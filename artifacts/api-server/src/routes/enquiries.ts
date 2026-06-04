import { Router, type IRouter, type Request, type Response } from "express";
import { SubmitEnquiryBody } from "@workspace/api-zod";
import { db, enquiriesTable, pool } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { logger } from "../lib/logger";
import { sendEnquiryNotification, sendAcknowledgementEmail } from "../lib/email";
import { forwardEnquiryToIrnOs } from "../lib/irn-os";

const router: IRouter = Router();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();
let sourceColumnsReady: Promise<void> | null = null;

const SOURCE_COLUMN_SQL = `
ALTER TABLE enquiries
  ADD COLUMN IF NOT EXISTS landing_page text,
  ADD COLUMN IF NOT EXISTS current_page text,
  ADD COLUMN IF NOT EXISTS referrer text,
  ADD COLUMN IF NOT EXISTS page_source text,
  ADD COLUMN IF NOT EXISTS utm_source text,
  ADD COLUMN IF NOT EXISTS utm_medium text,
  ADD COLUMN IF NOT EXISTS utm_campaign text,
  ADD COLUMN IF NOT EXISTS utm_term text,
  ADD COLUMN IF NOT EXISTS utm_content text;
`;

function ensureSourceColumns(): Promise<void> {
  sourceColumnsReady ??= pool.query(SOURCE_COLUMN_SQL).then(() => undefined);
  return sourceColumnsReady;
}

function getClientKey(req: Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  const firstForwarded = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  return firstForwarded?.split(",")[0]?.trim() || req.ip || "unknown";
}

function isRateLimited(req: Request): boolean {
  const key = getClientKey(req);
  const now = Date.now();
  const current = rateLimitBuckets.get(key);
  if (!current || current.resetAt <= now) {
    rateLimitBuckets.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  current.count += 1;
  return current.count > RATE_LIMIT_MAX;
}

function optionalString(req: Request, field: string): string | null {
  const value = req.body[field];
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, 2048) : null;
}

function requireAdmin(req: Request, res: Response): boolean {
  const secret = req.headers["x-admin-secret"];
  const expected = process.env.ADMIN_SECRET;
  if (!expected || secret !== expected) {
    res.status(401).json({ error: "Unauthorised" });
    return false;
  }
  return true;
}

router.post("/enquiries", async (req: Request, res: Response) => {
  if (isRateLimited(req)) {
    res.status(429).json({ error: "Too many enquiries. Please try again later." });
    return;
  }

  if (typeof req.body["website"] === "string" && req.body["website"].trim()) {
    logger.info("Blocked enquiry submission with populated honeypot field");
    res.status(204).end();
    return;
  }

  const formStartedAt = Number(req.body["formStartedAt"]);
  if (Number.isFinite(formStartedAt) && Date.now() - formStartedAt < 2000) {
    logger.info("Blocked enquiry submission that completed too quickly");
    res.status(204).end();
    return;
  }

  const parseResult = SubmitEnquiryBody.safeParse(req.body);

  if (!parseResult.success) {
    const details = parseResult.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    res.status(422).json({ error: "Validation failed", details });
    return;
  }

  const data = parseResult.data;

  if (!data.consent) {
    res.status(422).json({
      error: "Validation failed",
      details: [{ field: "consent", message: "Consent is required" }],
    });
    return;
  }

  const sourceFields = {
    landingPage: optionalString(req, "landingPage"),
    currentPage: optionalString(req, "currentPage"),
    referrer: optionalString(req, "referrer"),
    pageSource: optionalString(req, "pageSource"),
    utmSource: optionalString(req, "utmSource"),
    utmMedium: optionalString(req, "utmMedium"),
    utmCampaign: optionalString(req, "utmCampaign"),
    utmTerm: optionalString(req, "utmTerm"),
    utmContent: optionalString(req, "utmContent"),
  };

  const submittedAt = new Date().toUTCString();

  try {
    await ensureSourceColumns();

    const [enquiry] = await db
      .insert(enquiriesTable)
      .values({
        name: data.name,
        email: data.email,
        phone: data.phone,
        preferredContact: data.preferredContact,
        supportType: data.supportType,
        message: data.message,
        consent: data.consent,
        ...sourceFields,
      })
      .returning({ id: enquiriesTable.id, createdAt: enquiriesTable.createdAt });

    logger.info({ enquiryId: enquiry.id }, "Enquiry stored");

    let notificationSent = false;
    await sendEnquiryNotification({
      name: data.name,
      email: data.email,
      phone: data.phone,
      preferredContact: data.preferredContact,
      supportType: data.supportType,
      message: data.message,
      consent: data.consent,
      ...sourceFields,
      submittedAt,
    })
      .then(() => {
        notificationSent = true;
      })
      .catch((err) => {
        logger.warn({ err, enquiryId: enquiry.id }, "Email notification failed — enquiry still saved");
      });

    await db
      .update(enquiriesTable)
      .set({ notificationSent })
      .where(eq(enquiriesTable.id, enquiry.id))
      .catch((dbErr) => {
        logger.warn({ dbErr }, "Failed to update notificationSent flag on enquiry");
      });

    const crmForwardResult = await forwardEnquiryToIrnOs({
      enquiryId: String(enquiry.id),
      createdAt: enquiry.createdAt,
      name: data.name,
      email: data.email,
      phone: data.phone,
      preferredContact: data.preferredContact,
      supportType: data.supportType,
      message: data.message,
      consent: data.consent,
      ...sourceFields,
      submittedAt,
    });
    if (crmForwardResult.forwarded) {
      logger.info(
        { enquiryId: enquiry.id, leadId: crmForwardResult.leadId, duplicate: crmForwardResult.duplicate },
        "Enquiry forwarded to IRN OS",
      );
    } else {
      await sendAcknowledgementEmail({
        name: data.name,
        email: data.email,
      }).catch((err) => {
        logger.warn({ err }, "Fallback acknowledgement email failed — enquiry still saved");
      });
    }

    res.status(201).json({ id: enquiry.id, createdAt: enquiry.createdAt });
  } catch (err) {
    logger.error({ err }, "Failed to store enquiry");
    res.status(500).json({ error: "An unexpected error occurred. Please try again." });
  }
});

router.get("/admin/enquiries", async (req: Request, res: Response) => {
  if (!requireAdmin(req, res)) return;
  try {
    const rows = await db
      .select()
      .from(enquiriesTable)
      .orderBy(desc(enquiriesTable.createdAt));
    res.json(rows);
  } catch (err) {
    logger.error({ err }, "Failed to list enquiries");
    res.status(500).json({ error: "Failed to fetch enquiries" });
  }
});

export default router;

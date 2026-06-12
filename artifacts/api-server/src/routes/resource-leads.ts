import { Router, type IRouter, type Request, type Response } from "express";
import { z } from "zod/v4";
import { db, pool, resourceLeadsTable } from "@workspace/db";
import { desc, eq } from "drizzle-orm";
import { logger } from "../lib/logger";
import { sendResourceLeadEmails } from "../lib/email";

const router: IRouter = Router();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();
let tableReady: Promise<void> | null = null;

const RESOURCE_LEADS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS resource_leads (
  id serial PRIMARY KEY,
  first_name text NOT NULL,
  email text NOT NULL,
  resource_slug text NOT NULL,
  consent boolean NOT NULL DEFAULT true,
  landing_page text,
  current_page text,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  email_sent boolean NOT NULL DEFAULT false,
  created_at timestamp NOT NULL DEFAULT now()
);
`;

const SubmitResourceLeadBody = z.object({
  firstName: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(255),
  resourceSlug: z.literal("recovery-plan-checklist"),
  consent: z.boolean(),
});

function ensureResourceLeadsTable(): Promise<void> {
  tableReady ??= pool.query(RESOURCE_LEADS_TABLE_SQL).then(() => undefined);
  return tableReady;
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

router.post("/resource-leads", async (req: Request, res: Response) => {
  if (isRateLimited(req)) {
    res.status(429).json({ error: "Too many requests. Please try again later." });
    return;
  }

  if (typeof req.body["website"] === "string" && req.body["website"].trim()) {
    logger.info("Blocked resource lead submission with populated honeypot field");
    res.status(204).end();
    return;
  }

  const formStartedAt = Number(req.body["formStartedAt"]);
  if (Number.isFinite(formStartedAt) && Date.now() - formStartedAt < 2000) {
    logger.info("Blocked resource lead submission that completed too quickly");
    res.status(204).end();
    return;
  }

  const parseResult = SubmitResourceLeadBody.safeParse(req.body);
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
    utmSource: optionalString(req, "utmSource"),
    utmMedium: optionalString(req, "utmMedium"),
    utmCampaign: optionalString(req, "utmCampaign"),
    utmTerm: optionalString(req, "utmTerm"),
    utmContent: optionalString(req, "utmContent"),
  };

  const submittedAt = new Date().toUTCString();
  const checklistUrl = "https://www.insightrecoverynetwork.com/recovery-plan-checklist/checklist";

  try {
    await ensureResourceLeadsTable();

    const [lead] = await db
      .insert(resourceLeadsTable)
      .values({
        firstName: data.firstName,
        email: data.email,
        resourceSlug: data.resourceSlug,
        consent: data.consent,
        ...sourceFields,
      })
      .returning({ id: resourceLeadsTable.id, createdAt: resourceLeadsTable.createdAt });

    let emailSent = false;
    await sendResourceLeadEmails({
      firstName: data.firstName,
      email: data.email,
      resourceSlug: data.resourceSlug,
      checklistUrl,
      ...sourceFields,
      submittedAt,
    })
      .then(() => {
        emailSent = true;
      })
      .catch((err) => {
        logger.warn({ err, leadId: lead.id }, "Resource lead email failed — lead still saved");
      });

    await db
      .update(resourceLeadsTable)
      .set({ emailSent })
      .where(eq(resourceLeadsTable.id, lead.id))
      .catch((dbErr) => {
        logger.warn({ dbErr }, "Failed to update resource lead emailSent flag");
      });

    res.status(201).json({ id: lead.id, createdAt: lead.createdAt });
  } catch (err) {
    logger.error({ err }, "Failed to store resource lead");
    res.status(500).json({ error: "An unexpected error occurred. Please try again." });
  }
});

router.get("/admin/resource-leads", async (req: Request, res: Response) => {
  if (!requireAdmin(req, res)) return;
  try {
    await ensureResourceLeadsTable();
    const rows = await db
      .select()
      .from(resourceLeadsTable)
      .orderBy(desc(resourceLeadsTable.createdAt));
    res.json(rows);
  } catch (err) {
    logger.error({ err }, "Failed to list resource leads");
    res.status(500).json({ error: "Failed to fetch resource leads" });
  }
});

export default router;

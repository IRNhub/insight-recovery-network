import { Router, type IRouter, type Request, type Response } from "express";
import { SubmitEnquiryBody } from "@workspace/api-zod";
import { db, enquiriesTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { logger } from "../lib/logger";
import { sendEnquiryNotification, sendAcknowledgementEmail } from "../lib/email";

const router: IRouter = Router();

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

  const pageSource =
    typeof req.body["pageSource"] === "string" ? req.body["pageSource"] : undefined;

  const submittedAt = new Date().toUTCString();

  try {
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
      pageSource,
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

    await sendAcknowledgementEmail({
      name: data.name,
      email: data.email,
    }).catch((err) => {
      logger.warn({ err }, "Acknowledgement email failed — enquiry still saved");
    });

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

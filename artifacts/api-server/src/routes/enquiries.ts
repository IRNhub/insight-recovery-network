import { Router, type IRouter, type Request, type Response } from "express";
import { SubmitEnquiryBody } from "@workspace/api-zod";
import { db, enquiriesTable } from "@workspace/db";
import { logger } from "../lib/logger";
import { sendEnquiryNotification, sendAcknowledgementEmail } from "../lib/email";

const router: IRouter = Router();

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
    }).catch((err) => {
      logger.warn({ err }, "Email notification failed — enquiry still saved");
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

export default router;

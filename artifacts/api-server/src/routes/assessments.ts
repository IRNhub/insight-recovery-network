import { Router, type IRouter, type Request, type Response } from "express";
import { z } from "zod";
import { db, assessmentsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "../lib/logger";
import { generateAnchorResponse, type AnchorReport } from "../lib/anchor";
import { sendAssessmentResultToUser, sendAssessmentLeadToCraig } from "../lib/email";

const router: IRouter = Router();

const SubmitAssessmentBody = z.object({
  type: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  consent: z.boolean(),
  answers: z.record(z.string(), z.union([z.string(), z.array(z.string())])),
  scoreValue: z.number().int().min(0),
  scoreLevel: z.string().min(1),
  scoreLabel: z.string().min(1),
  bandName: z.string().min(1),
  redFlags: z.array(z.string()),
  advisories: z.array(z.string()).default([]),
  tags: z.array(z.string()),
  clinicalBrief: z.string(),
});

router.post("/assessments/submit", async (req: Request, res: Response) => {
  const parseResult = SubmitAssessmentBody.safeParse(req.body);

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

  const submittedAt = new Date().toUTCString();

  try {
    const anchorReport: AnchorReport = await generateAnchorResponse({
      scoreLevel: data.scoreLevel,
      scoreLabel: data.bandName,
      redFlags: data.redFlags,
      clinicalBrief: data.clinicalBrief,
      name: data.name,
    });

    const anchorResponseText = [
      anchorReport.whatThisMaySuggest,
      "",
      `Key patterns: ${anchorReport.keyPatterns.join(", ")}`,
      "",
      anchorReport.whatThisDoesNotMean,
      "",
      anchorReport.suggestedNextSteps,
    ].join("\n");

    const [assessment] = await db
      .insert(assessmentsTable)
      .values({
        type: data.type,
        name: data.name,
        email: data.email,
        phone: data.phone ?? null,
        consent: data.consent,
        answers: data.answers,
        scoreValue: data.scoreValue,
        scoreLevel: data.scoreLevel,
        scoreLabel: data.bandName,
        redFlags: data.redFlags,
        tags: data.tags,
        anchorResponse: anchorResponseText,
      })
      .returning({ id: assessmentsTable.id, createdAt: assessmentsTable.createdAt });

    logger.info({ assessmentId: assessment.id, type: data.type, scoreLevel: data.scoreLevel }, "Assessment stored");

    const emailPayload = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      type: data.type,
      scoreLabel: data.scoreLabel,
      bandName: data.bandName,
      scoreLevel: data.scoreLevel,
      scoreValue: data.scoreValue,
      redFlags: data.redFlags,
      advisories: data.advisories,
      tags: data.tags,
      clinicalBrief: data.clinicalBrief,
      anchorReport,
      submittedAt,
    };

    await Promise.allSettled([
      sendAssessmentResultToUser(emailPayload).catch((err) =>
        logger.warn({ err }, "User result email failed")
      ),
      sendAssessmentLeadToCraig(emailPayload).catch((err) =>
        logger.warn({ err }, "Craig lead email failed")
      ),
    ]);

    res.status(201).json({
      id: assessment.id,
      anchorReport,
      createdAt: assessment.createdAt,
    });
  } catch (err) {
    logger.error({ err }, "Failed to process assessment");
    res.status(500).json({ error: "An unexpected error occurred. Please try again." });
  }
});

router.post("/assessments/:id/cta-clicked", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id ?? "", 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid assessment id" });
    return;
  }
  try {
    await db
      .update(assessmentsTable)
      .set({ ctaClicked: true })
      .where(eq(assessmentsTable.id, id));
    logger.info({ assessmentId: id }, "CTA click recorded");
    res.status(200).json({ ok: true });
  } catch (err) {
    logger.warn({ err, assessmentId: id }, "Failed to record CTA click — non-fatal");
    res.status(200).json({ ok: true });
  }
});

export default router;

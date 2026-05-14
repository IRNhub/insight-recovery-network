import { Router, type IRouter, type Request, type Response } from "express";
import { z } from "zod";
import { db, assessmentsTable } from "@workspace/db";
import { logger } from "../lib/logger";
import { generateAnchorResponse } from "../lib/anchor";
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
  redFlags: z.array(z.string()),
  tags: z.array(z.string()),
  sectionSummary: z.string(),
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
    const anchorResponse = await generateAnchorResponse({
      scoreLevel: data.scoreLevel,
      scoreLabel: data.scoreLabel,
      redFlags: data.redFlags,
      sectionSummary: data.sectionSummary,
      name: data.name,
    });

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
        redFlags: data.redFlags,
        tags: data.tags,
        anchorResponse,
      })
      .returning({ id: assessmentsTable.id, createdAt: assessmentsTable.createdAt });

    logger.info({ assessmentId: assessment.id, type: data.type, scoreLevel: data.scoreLevel }, "Assessment stored");

    const emailPayload = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      type: data.type,
      scoreLabel: data.scoreLabel,
      scoreLevel: data.scoreLevel,
      scoreValue: data.scoreValue,
      redFlags: data.redFlags,
      tags: data.tags,
      sectionSummary: data.sectionSummary,
      anchorResponse,
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
      anchorResponse,
      createdAt: assessment.createdAt,
    });
  } catch (err) {
    logger.error({ err }, "Failed to process assessment");
    res.status(500).json({ error: "An unexpected error occurred. Please try again." });
  }
});

export default router;

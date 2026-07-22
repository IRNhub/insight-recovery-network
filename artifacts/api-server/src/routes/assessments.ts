import { Router, type IRouter, type Request, type Response } from "express";
import { z } from "zod";
import { db, assessmentsTable } from "@workspace/db";
import { desc, eq } from "drizzle-orm";
import { logger } from "../lib/logger";
import { generateAnchorResponse, type AnchorReport } from "../lib/anchor";
import { sendAssessmentResultToUser, sendAssessmentLeadToCraig } from "../lib/email";
import { forwardAssessmentToIrnOs } from "../lib/irn-os";

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

function requireAdmin(req: Request, res: Response): boolean {
  const secret = req.headers["x-admin-secret"];
  const expected = process.env.ADMIN_SECRET;
  if (!expected || secret !== expected) {
    res.status(401).json({ error: "Unauthorised" });
    return false;
  }
  return true;
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

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

    const [crmForwardResult] = await Promise.all([
      forwardAssessmentToIrnOs({
        assessmentId: String(assessment.id),
        createdAt: assessment.createdAt,
        name: data.name,
        email: data.email,
        phone: data.phone,
        type: data.type,
        scoreValue: data.scoreValue,
        scoreLevel: data.scoreLevel,
        bandName: data.bandName,
        redFlags: data.redFlags,
        advisories: data.advisories,
        tags: data.tags,
        clinicalBrief: data.clinicalBrief,
        answers: data.answers,
        consent: data.consent,
        submittedAt,
      }),
      Promise.allSettled([
        sendAssessmentResultToUser(emailPayload).catch((err) =>
          logger.warn({ err }, "User result email failed")
        ),
        sendAssessmentLeadToCraig(emailPayload).catch((err) =>
          logger.warn({ err }, "Craig lead email failed")
        ),
      ]),
    ]);

    await db
      .update(assessmentsTable)
      .set({ status: crmForwardResult.forwarded ? "forwarded_to_irn_os" : "irn_os_forward_failed" })
      .where(eq(assessmentsTable.id, assessment.id))
      .catch((dbErr) => {
        logger.warn({ dbErr, assessmentId: assessment.id }, "Failed to update assessment forwarding status");
      });

    if (crmForwardResult.forwarded) {
      logger.info({
        assessmentId: assessment.id,
        leadId: crmForwardResult.leadId,
        duplicate: crmForwardResult.duplicate,
      }, "Assessment forwarded to IRN OS");
    } else {
      logger.warn({
        assessmentId: assessment.id,
        error: crmForwardResult.error,
      }, "Assessment saved but IRN OS forwarding failed");
    }

    res.status(201).json({
      id: assessment.id,
      anchorReport,
      createdAt: assessment.createdAt,
      irnOsForwarded: crmForwardResult.forwarded,
    });
  } catch (err) {
    logger.error({ err }, "Failed to process assessment");
    res.status(500).json({ error: "An unexpected error occurred. Please try again." });
  }
});

router.get("/admin/assessments", async (req: Request, res: Response) => {
  if (!requireAdmin(req, res)) return;

  try {
    const rows = await db
      .select()
      .from(assessmentsTable)
      .orderBy(desc(assessmentsTable.createdAt));
    res.json(rows);
  } catch (err) {
    logger.error({ err }, "Failed to list assessments");
    res.status(500).json({ error: "Failed to fetch assessments" });
  }
});

router.post("/admin/assessments/:id/forward-to-irn-os", async (req: Request, res: Response) => {
  if (!requireAdmin(req, res)) return;

  const idParam = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = Number.parseInt(idParam ?? "", 10);
  if (!Number.isInteger(id)) {
    res.status(400).json({ error: "Invalid assessment id" });
    return;
  }

  try {
    const [assessment] = await db
      .select()
      .from(assessmentsTable)
      .where(eq(assessmentsTable.id, id));

    if (!assessment) {
      res.status(404).json({ error: "Assessment not found" });
      return;
    }

    const result = await forwardAssessmentToIrnOs({
      assessmentId: String(assessment.id),
      createdAt: assessment.createdAt,
      name: assessment.name,
      email: assessment.email,
      phone: assessment.phone ?? undefined,
      type: assessment.type,
      scoreValue: assessment.scoreValue,
      scoreLevel: assessment.scoreLevel,
      bandName: assessment.scoreLabel || assessment.scoreLevel,
      redFlags: stringArray(assessment.redFlags),
      advisories: [],
      tags: stringArray(assessment.tags),
      clinicalBrief: [
        `Assessment: ${assessment.type}`,
        `Score: ${assessment.scoreValue} - ${assessment.scoreLabel || assessment.scoreLevel}`,
        "",
        assessment.anchorResponse || "No Anchor response was stored.",
      ].join("\n"),
      answers: assessment.answers as Record<string, string | string[]>,
      consent: assessment.consent,
      submittedAt: assessment.createdAt.toUTCString(),
    });

    await db
      .update(assessmentsTable)
      .set({ status: result.forwarded ? "forwarded_to_irn_os" : "irn_os_forward_failed" })
      .where(eq(assessmentsTable.id, assessment.id));

    if (!result.forwarded) {
      res.status(502).json({ error: result.error || "IRN OS forwarding failed" });
      return;
    }

    logger.info({ assessmentId: assessment.id, leadId: result.leadId, duplicate: result.duplicate }, "Assessment re-forwarded to IRN OS");
    res.json({ ok: true, leadId: result.leadId, duplicate: result.duplicate });
  } catch (err) {
    logger.error({ err, assessmentId: id }, "Failed to re-forward assessment to IRN OS");
    res.status(500).json({ error: "Failed to forward assessment" });
  }
});

router.post("/assessments/:id/cta-clicked", async (req: Request, res: Response) => {
  const idParam = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(idParam ?? "", 10);
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

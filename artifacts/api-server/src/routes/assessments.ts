import { Router, type IRouter, type Request, type Response } from "express";
import { assessmentsTable, db } from "@workspace/db";
import { desc, eq } from "drizzle-orm";
import { logger } from "../lib/logger.ts";
import { forwardAssessmentToIrnOs } from "../lib/irn-os.ts";
import { assessmentDeliveryHandlers } from "../assessment-engine/assessment-delivery.ts";
import {
  assessmentPersistence,
  storedAssessmentFromRow,
} from "../assessment-engine/assessment-persistence.ts";
import {
  recoverAssessment,
  requestAssessmentContact,
  submitAssessment,
} from "../assessment-engine/assessment-service.ts";
import { parseAssessmentContactRequest } from "../assessment-engine/assessment-contact.ts";
import {
  getActiveDefinition,
  isAssessmentKey,
  toPublicDefinition,
} from "../assessment-engine/registry.ts";
import {
  readResultAccessToken,
  setResultAccessCookie,
} from "../assessment-engine/result-access.ts";
import { AssessmentValidationError } from "../assessment-engine/validate-answers.ts";
import { assessmentRateLimiter } from "../assessment-engine/assessment-rate-limit-postgres.ts";

const router: IRouter = Router();

const RATE_LIMIT_UNAVAILABLE_RETRY_SECONDS = 60;

async function assessmentRequestMayProceed(
  req: Request,
  res: Response,
  scope: "submit" | "contact",
  maximum: number,
): Promise<boolean> {
  try {
    const decision = await assessmentRateLimiter.check(req.ip || "unknown", scope, maximum);
    if (!decision.limited) return true;
    res.setHeader("Retry-After", String(decision.retryAfterSeconds));
    res.status(429).json({
      error: scope === "submit"
        ? "Too many assessment submissions. Please try again later."
        : "Too many contact requests. Please try again later.",
    });
    return false;
  } catch (error) {
    logger.error({ err: error }, "Shared assessment rate limiter unavailable");
    res.setHeader("Retry-After", String(RATE_LIMIT_UNAVAILABLE_RETRY_SECONDS));
    res.status(503).json({
      error: "This request cannot be processed safely right now. Please try again shortly.",
    });
    return false;
  }
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

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function noStore(res: Response): void {
  res.setHeader("Cache-Control", "private, no-store");
  res.setHeader("Pragma", "no-cache");
}

router.get("/assessments/:key/definition", (req: Request, res: Response) => {
  const key = Array.isArray(req.params.key) ? req.params.key[0] : req.params.key;
  if (!key || !isAssessmentKey(key)) {
    res.status(404).json({ error: "Assessment definition not found" });
    return;
  }
  res.setHeader("Cache-Control", "public, max-age=300, stale-while-revalidate=3600");
  res.json(toPublicDefinition(getActiveDefinition(key)));
});

router.post("/assessments/submit", async (req: Request, res: Response) => {
  noStore(res);
  if (!(await assessmentRequestMayProceed(req, res, "submit", 12))) return;
  try {
    const outcome = await submitAssessment(req.body, {
      persistence: assessmentPersistence,
      deliveries: assessmentDeliveryHandlers,
    });
    setResultAccessCookie(res, outcome.accessToken);
    res.status(outcome.created ? 201 : 200).json({
      result: outcome.result,
      resultPath: `/assessment-results/${outcome.result.assessmentKey}`,
      created: outcome.created,
    });
  } catch (error) {
    if (error instanceof AssessmentValidationError) {
      res.status(422).json({ error: "Validation failed", details: error.issues });
      return;
    }
    logger.error({ err: error }, "Authoritative assessment submission failed");
    res.status(500).json({ error: "Your result could not be saved. Please try again." });
  }
});

router.get("/assessments/result", async (req: Request, res: Response) => {
  noStore(res);
  const token = readResultAccessToken(req);
  if (!token) {
    res.status(404).json({ error: "Assessment result not found" });
    return;
  }
  try {
    const stored = await recoverAssessment(token, assessmentPersistence);
    if (!stored) {
      res.status(404).json({ error: "Assessment result not found" });
      return;
    }
    res.json({ result: stored.result });
  } catch (error) {
    logger.error({ err: error }, "Assessment result recovery failed");
    res.status(500).json({ error: "The result could not be retrieved." });
  }
});

router.post("/assessments/result/contact", async (req: Request, res: Response) => {
  noStore(res);
  if (!(await assessmentRequestMayProceed(req, res, "contact", 6))) return;
  const token = readResultAccessToken(req);
  if (!token) {
    res.status(404).json({ error: "Assessment result not found" });
    return;
  }
  try {
    const contactRequest = parseAssessmentContactRequest(req.body);
    const stored = await requestAssessmentContact(
      token,
      contactRequest,
      assessmentPersistence,
      assessmentDeliveryHandlers,
    );
    if (!stored) {
      res.status(404).json({ error: "Assessment result not found" });
      return;
    }
    res.json({ result: stored.result });
  } catch (error) {
    if (error instanceof AssessmentValidationError) {
      res.status(422).json({ error: "Validation failed", details: error.issues });
      return;
    }
    logger.error({ err: error }, "Assessment contact request failed");
    res.status(500).json({ error: "Your contact preferences could not be saved. Please try again." });
  }
});

router.post("/assessments/result/cta", async (req: Request, res: Response) => {
  noStore(res);
  const token = readResultAccessToken(req);
  if (!token) {
    res.status(404).json({ error: "Assessment result not found" });
    return;
  }
  try {
    const stored = await recoverAssessment(token, assessmentPersistence);
    if (!stored) {
      res.status(404).json({ error: "Assessment result not found" });
      return;
    }
    await assessmentPersistence.markCtaClicked(stored.storageId);
    res.json({ ok: true });
  } catch (error) {
    logger.warn({ err: error }, "Assessment CTA operational event could not be saved");
    res.json({ ok: true });
  }
});

router.get("/admin/assessments", async (req: Request, res: Response) => {
  if (!requireAdmin(req, res)) return;
  try {
    const rows = await db.select().from(assessmentsTable).orderBy(desc(assessmentsTable.createdAt));
    res.json(rows);
  } catch (error) {
    logger.error({ err: error }, "Failed to list assessments");
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
    const [assessment] = await db.select().from(assessmentsTable).where(eq(assessmentsTable.id, id));
    if (!assessment) {
      res.status(404).json({ error: "Assessment not found" });
      return;
    }

    const authoritative = storedAssessmentFromRow(assessment);
    if (authoritative) {
      await assessmentDeliveryHandlers.irnOs(authoritative);
      await assessmentPersistence.updateDelivery(authoritative.storageId, "irn_os", "forwarded");
      res.json({ ok: true });
      return;
    }
    if (!assessment.name || !assessment.email) {
      res.status(422).json({ error: "Legacy assessment contact details are incomplete" });
      return;
    }

    const result = await forwardAssessmentToIrnOs({
      assessmentId: String(assessment.id),
      createdAt: assessment.createdAt,
      name: assessment.name,
      email: assessment.email,
      phone: assessment.phone ?? undefined,
      type: assessment.type,
      scoreValue: assessment.scoreValue ?? undefined,
      scoreLevel: assessment.scoreLevel,
      bandName: assessment.scoreLabel || assessment.scoreLevel,
      redFlags: stringArray(assessment.redFlags),
      advisories: [],
      tags: stringArray(assessment.tags),
      clinicalBrief: assessment.anchorResponse || "Legacy assessment result. Review the original record.",
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
    res.json({ ok: true, duplicate: result.duplicate });
  } catch (error) {
    logger.error({ err: error, assessmentId: id }, "Failed to re-forward assessment to IRN OS");
    res.status(500).json({ error: "Failed to forward assessment" });
  }
});

export default router;

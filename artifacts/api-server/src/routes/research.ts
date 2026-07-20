/**
 * Public Research & Surveys endpoints.
 *
 * GET  /api/research/surveys/:slug            — fetch a non-draft survey + questions
 * POST /api/research/surveys/:slug/responses  — submit an anonymous response
 *
 * Anti-abuse (mirrors existing enquiries/resource-leads patterns):
 * - honeypot field ("website")
 * - server-side rate limiting per client
 * - minimum realistic completion-time flag
 * - idempotent submission token (unique constraint)
 * - salted one-way client hash for duplicate flagging (no raw IP stored)
 * - strict server-side validation against stored question definitions
 */
import { Router, type IRouter, type Request, type Response } from "express";
import { z } from "zod/v4";
import {
  db,
  pool,
  surveysTable,
  surveyQuestionsTable,
  surveyResponsesTable,
  surveyAnswersTable,
} from "@workspace/db";
import { eq, and, asc, gt } from "drizzle-orm";
import { logger } from "../lib/logger";
import { ensureSurveyTables } from "./../lib/survey-tables";
import { FAMILY_SURVEY_CODE_PREFIX, FAMILY_SURVEY_SLUG } from "../lib/seed-family-survey";
import {
  validateAnswers,
  generateResponseCode,
  computeClientHash,
  categoriseUserAgent,
  type QuestionForValidation,
} from "../lib/survey-utils";

const router: IRouter = Router();

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const DUPLICATE_WINDOW_MS = 12 * 60 * 60 * 1000;
const MINIMUM_REALISTIC_SECONDS = 60;
const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();

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

function codePrefixForSlug(slug: string): string {
  if (slug === FAMILY_SURVEY_SLUG) return FAMILY_SURVEY_CODE_PREFIX;
  return `SRV-${new Date().getFullYear()}`;
}

const SubmitResponseBody = z.object({
  submissionToken: z.string().trim().min(8).max(100),
  consentAccepted: z.boolean(),
  quotationPermission: z.boolean().optional().default(false),
  answers: z.record(z.string().max(120), z.unknown()),
  startedAt: z.number().optional(),
  source: z.string().trim().max(200).optional(),
  medium: z.string().trim().max(200).optional(),
  campaign: z.string().trim().max(200).optional(),
  referralUrl: z.string().trim().max(2048).optional(),
});

router.get("/research/surveys/:slug", async (req: Request, res: Response) => {
  try {
    await ensureSurveyTables();
    const slug = String(req.params.slug || "").slice(0, 200);
    const [survey] = await db.select().from(surveysTable).where(eq(surveysTable.slug, slug));

    if (!survey || survey.status === "draft" || survey.status === "archived") {
      res.status(404).json({ error: "Survey not found" });
      return;
    }

    const questions = await db
      .select({
        questionKey: surveyQuestionsTable.questionKey,
        section: surveyQuestionsTable.section,
        questionOrder: surveyQuestionsTable.questionOrder,
        questionText: surveyQuestionsTable.questionText,
        questionType: surveyQuestionsTable.questionType,
        options: surveyQuestionsTable.options,
        isRequired: surveyQuestionsTable.isRequired,
        helperText: surveyQuestionsTable.helperText,
      })
      .from(surveyQuestionsTable)
      .where(eq(surveyQuestionsTable.surveyId, survey.id))
      .orderBy(asc(surveyQuestionsTable.questionOrder));

    // No internal database IDs are exposed publicly.
    res.json({
      slug: survey.slug,
      title: survey.title,
      description: survey.description,
      status: survey.status,
      questions,
    });
  } catch (err) {
    logger.error({ err }, "Failed to fetch public survey");
    res.status(500).json({ error: "Unable to load the survey right now." });
  }
});

router.post("/research/surveys/:slug/responses", async (req: Request, res: Response) => {
  try {
    await ensureSurveyTables();

    if (isRateLimited(req)) {
      res.status(429).json({ error: "Too many submissions. Please try again later." });
      return;
    }

    // Honeypot: silently discard without recording answer content.
    if (typeof req.body["website"] === "string" && req.body["website"].trim()) {
      logger.info("Blocked survey submission with populated honeypot field");
      res.status(204).end();
      return;
    }

    const slug = String(req.params.slug || "").slice(0, 200);
    const [survey] = await db.select().from(surveysTable).where(eq(surveysTable.slug, slug));

    if (!survey || survey.status === "draft" || survey.status === "archived") {
      res.status(404).json({ error: "Survey not found" });
      return;
    }

    if (survey.status !== "open") {
      res.status(409).json({ error: "This survey is closed and no longer accepting responses." });
      return;
    }

    const parsed = SubmitResponseBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid submission." });
      return;
    }
    const body = parsed.data;

    if (body.consentAccepted !== true) {
      res.status(400).json({ error: "The required consent must be accepted before submitting." });
      return;
    }

    // Idempotency: if this token was already used, return the original result.
    const [existing] = await db
      .select({ responseCode: surveyResponsesTable.responseCode })
      .from(surveyResponsesTable)
      .where(eq(surveyResponsesTable.submissionToken, body.submissionToken));
    if (existing) {
      res.status(200).json({ responseCode: existing.responseCode, duplicate: true });
      return;
    }

    const questions = await db
      .select({
        id: surveyQuestionsTable.id,
        questionKey: surveyQuestionsTable.questionKey,
        questionType: surveyQuestionsTable.questionType,
        isRequired: surveyQuestionsTable.isRequired,
        options: surveyQuestionsTable.options,
      })
      .from(surveyQuestionsTable)
      .where(eq(surveyQuestionsTable.surveyId, survey.id))
      .orderBy(asc(surveyQuestionsTable.questionOrder));

    const { errors, cleanAnswers } = validateAnswers(questions as QuestionForValidation[], body.answers);
    if (errors.length > 0) {
      // Log validation failure without recording sensitive answer content.
      logger.info({ slug, errorCount: errors.length }, "Survey submission failed validation");
      res.status(400).json({ error: "Some answers were missing or invalid.", details: errors });
      return;
    }

    // Duplicate detection via salted one-way hash — raw IP is used only
    // transiently here and never stored (see survey-utils.ts).
    const userAgent = req.headers["user-agent"] || "";
    const clientHash = computeClientHash(getClientKey(req), String(userAgent));
    const windowStart = new Date(Date.now() - DUPLICATE_WINDOW_MS);
    const [priorFromClient] = await db
      .select({ id: surveyResponsesTable.id })
      .from(surveyResponsesTable)
      .where(
        and(
          eq(surveyResponsesTable.surveyId, survey.id),
          eq(surveyResponsesTable.clientHash, clientHash),
          gt(surveyResponsesTable.submittedAt, windowStart),
        ),
      )
      .limit(1);

    const startedAtMs = body.startedAt && Number.isFinite(body.startedAt) ? body.startedAt : null;
    const durationSeconds = startedAtMs ? Math.max(0, Math.round((Date.now() - startedAtMs) / 1000)) : null;
    const minimumTimeFlag = durationSeconds !== null && durationSeconds < MINIMUM_REALISTIC_SECONDS;

    const responseCode = generateResponseCode(codePrefixForSlug(slug));

    const inserted = await db.transaction(async (tx) => {
      const [response] = await tx
        .insert(surveyResponsesTable)
        .values({
          surveyId: survey.id,
          responseCode,
          submissionToken: body.submissionToken,
          consentAccepted: true,
          quotationPermission: body.quotationPermission === true,
          startedAt: startedAtMs ? new Date(startedAtMs) : null,
          submittedAt: new Date(),
          completionDurationSeconds: durationSeconds,
          source: body.source?.slice(0, 200) || null,
          medium: body.medium?.slice(0, 200) || null,
          campaign: body.campaign?.slice(0, 200) || null,
          referralUrl: body.referralUrl?.slice(0, 2048) || null,
          userAgentCategory: categoriseUserAgent(String(userAgent)),
          clientHash,
          suspectedDuplicate: Boolean(priorFromClient),
          minimumTimeFlag,
        })
        .returning({ id: surveyResponsesTable.id, responseCode: surveyResponsesTable.responseCode });

      if (!response) throw new Error("Response insert returned no row");

      if (cleanAnswers.length > 0) {
        await tx.insert(surveyAnswersTable).values(
          cleanAnswers.map((a) => ({
            responseId: response.id,
            questionId: a.questionId,
            answerValue: a.answerValue,
            answerValues: a.answerValues,
          })),
        );
      }

      return response;
    });

    logger.info({ slug, responseCode: inserted.responseCode }, "Survey response submitted");
    res.status(201).json({ responseCode: inserted.responseCode });
  } catch (err: any) {
    // Unique violation on submission_token = concurrent double submit.
    if (err?.code === "23505") {
      res.status(200).json({ duplicate: true });
      return;
    }
    logger.error({ err: err?.message }, "Survey submission failed");
    res.status(500).json({ error: "We could not submit your response. Please try again." });
  }
});

export default router;

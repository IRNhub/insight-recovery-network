/**
 * IRNOS "Research & Surveys" admin endpoints.
 *
 * Access: restricted via the existing admin-secret pattern (x-admin-secret
 * header checked against ADMIN_SECRET). Holders of the admin secret map to
 * the Admin / Clinical Director roles; therapists, admissions coordinators
 * and finance users do not hold this secret. All /api/admin/* responses are
 * already served with X-Robots-Tag: noindex (see app.ts).
 *
 * Privacy: raw IP addresses are never stored, and the salted clientHash is
 * intentionally excluded from every admin response and export below.
 */
import { Router, type IRouter, type Request, type Response } from "express";
import {
  db,
  surveysTable,
  surveyQuestionsTable,
  surveyResponsesTable,
  surveyAnswersTable,
  surveyAuditLogTable,
} from "@workspace/db";
import { eq, and, desc, asc, gte, lte, sql, inArray } from "drizzle-orm";
import { logger } from "../lib/logger";
import { ensureSurveyTables } from "../lib/survey-tables";
import { toCsv } from "../lib/survey-utils";

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

async function audit(entry: {
  surveyId?: number | null;
  responseId?: number | null;
  action: string;
  reason?: string | null;
}): Promise<void> {
  try {
    await db.insert(surveyAuditLogTable).values({
      surveyId: entry.surveyId ?? null,
      responseId: entry.responseId ?? null,
      action: entry.action,
      actor: "admin",
      reason: entry.reason ?? null,
    });
  } catch (err) {
    logger.error({ err }, "Failed to write survey audit log entry");
  }
}

/** Fields safe to expose in admin responses (clientHash + submissionToken excluded). */
const RESPONSE_COLUMNS = {
  id: surveyResponsesTable.id,
  surveyId: surveyResponsesTable.surveyId,
  responseCode: surveyResponsesTable.responseCode,
  consentAccepted: surveyResponsesTable.consentAccepted,
  quotationPermission: surveyResponsesTable.quotationPermission,
  startedAt: surveyResponsesTable.startedAt,
  submittedAt: surveyResponsesTable.submittedAt,
  completionDurationSeconds: surveyResponsesTable.completionDurationSeconds,
  source: surveyResponsesTable.source,
  medium: surveyResponsesTable.medium,
  campaign: surveyResponsesTable.campaign,
  referralUrl: surveyResponsesTable.referralUrl,
  userAgentCategory: surveyResponsesTable.userAgentCategory,
  suspectedDuplicate: surveyResponsesTable.suspectedDuplicate,
  minimumTimeFlag: surveyResponsesTable.minimumTimeFlag,
  excludedFromAnalysis: surveyResponsesTable.excludedFromAnalysis,
  exclusionReason: surveyResponsesTable.exclusionReason,
  adminNotes: surveyResponsesTable.adminNotes,
  createdAt: surveyResponsesTable.createdAt,
};

function buildResponseFilters(req: Request, surveyId: number) {
  const conditions: any[] = [eq(surveyResponsesTable.surveyId, surveyId)];
  const q = req.query;

  if (typeof q.from === "string" && q.from) {
    const from = new Date(q.from);
    if (!Number.isNaN(from.getTime())) conditions.push(gte(surveyResponsesTable.submittedAt, from));
  }
  if (typeof q.to === "string" && q.to) {
    const to = new Date(q.to);
    if (!Number.isNaN(to.getTime())) {
      to.setHours(23, 59, 59, 999);
      conditions.push(lte(surveyResponsesTable.submittedAt, to));
    }
  }
  if (typeof q.source === "string" && q.source) conditions.push(eq(surveyResponsesTable.source, q.source));
  if (q.quotation === "true") conditions.push(eq(surveyResponsesTable.quotationPermission, true));
  if (q.quotation === "false") conditions.push(eq(surveyResponsesTable.quotationPermission, false));
  if (q.included === "true") conditions.push(eq(surveyResponsesTable.excludedFromAnalysis, false));
  if (q.included === "false") conditions.push(eq(surveyResponsesTable.excludedFromAnalysis, true));
  if (q.duplicate === "true") conditions.push(eq(surveyResponsesTable.suspectedDuplicate, true));

  return conditions;
}

/** Loads a keyed answer map (responseId -> questionKey -> value) for given responses. */
async function loadAnswerMaps(responseIds: number[], questionKeys?: string[]) {
  if (responseIds.length === 0) return new Map<number, Record<string, string>>();
  const rows = await db
    .select({
      responseId: surveyAnswersTable.responseId,
      answerValue: surveyAnswersTable.answerValue,
      answerValues: surveyAnswersTable.answerValues,
      questionKey: surveyQuestionsTable.questionKey,
    })
    .from(surveyAnswersTable)
    .innerJoin(surveyQuestionsTable, eq(surveyAnswersTable.questionId, surveyQuestionsTable.id))
    .where(inArray(surveyAnswersTable.responseId, responseIds));

  const map = new Map<number, Record<string, string>>();
  for (const row of rows) {
    if (questionKeys && !questionKeys.includes(row.questionKey)) continue;
    const value = row.answerValue ?? (row.answerValues ? row.answerValues.join("; ") : "");
    const entry = map.get(row.responseId) ?? {};
    entry[row.questionKey] = value;
    map.set(row.responseId, entry);
  }
  return map;
}

// ── Survey list ────────────────────────────────────────────────────────────────

router.get("/admin/research/surveys", async (req: Request, res: Response) => {
  if (!requireAdmin(req, res)) return;
  try {
    await ensureSurveyTables();
    const includeArchived = req.query.archived === "true";
    const surveys = await db.select().from(surveysTable).orderBy(desc(surveysTable.createdAt));

    const result = [];
    for (const survey of surveys) {
      if (!includeArchived && survey.status === "archived") continue;
      const [counts] = await db
        .select({
          total: sql<number>`count(*)::int`,
          excluded: sql<number>`count(*) filter (where ${surveyResponsesTable.excludedFromAnalysis})::int`,
          duplicates: sql<number>`count(*) filter (where ${surveyResponsesTable.suspectedDuplicate})::int`,
          lastResponseAt: sql<string | null>`max(${surveyResponsesTable.submittedAt})`,
        })
        .from(surveyResponsesTable)
        .where(eq(surveyResponsesTable.surveyId, survey.id));

      result.push({
        id: survey.id,
        slug: survey.slug,
        title: survey.title,
        status: survey.status,
        publicPath: `/research/${survey.slug}`,
        opensAt: survey.opensAt,
        closesAt: survey.closesAt,
        createdAt: survey.createdAt,
        totalResponses: counts?.total ?? 0,
        validResponses: (counts?.total ?? 0) - (counts?.excluded ?? 0),
        excludedResponses: counts?.excluded ?? 0,
        suspectedDuplicates: counts?.duplicates ?? 0,
        lastResponseAt: counts?.lastResponseAt ?? null,
      });
    }
    res.json(result);
  } catch (err) {
    logger.error({ err }, "Failed to list surveys");
    res.status(500).json({ error: "Failed to list surveys" });
  }
});

// ── Survey summary dashboard ─────────────────────────────────────────────────

router.get("/admin/research/surveys/:id/summary", async (req: Request, res: Response) => {
  if (!requireAdmin(req, res)) return;
  try {
    await ensureSurveyTables();
    const surveyId = Number(req.params.id);
    const [survey] = await db.select().from(surveysTable).where(eq(surveysTable.id, surveyId));
    if (!survey) {
      res.status(404).json({ error: "Survey not found" });
      return;
    }

    const [counts] = await db
      .select({
        total: sql<number>`count(*)::int`,
        excluded: sql<number>`count(*) filter (where ${surveyResponsesTable.excludedFromAnalysis})::int`,
        duplicates: sql<number>`count(*) filter (where ${surveyResponsesTable.suspectedDuplicate})::int`,
        quotationYes: sql<number>`count(*) filter (where ${surveyResponsesTable.quotationPermission})::int`,
        avgDuration: sql<number | null>`round(avg(${surveyResponsesTable.completionDurationSeconds}))::int`,
      })
      .from(surveyResponsesTable)
      .where(eq(surveyResponsesTable.surveyId, surveyId));

    const bySource = await db
      .select({
        source: sql<string>`coalesce(${surveyResponsesTable.source}, 'direct')`,
        count: sql<number>`count(*)::int`,
      })
      .from(surveyResponsesTable)
      .where(eq(surveyResponsesTable.surveyId, surveyId))
      .groupBy(sql`coalesce(${surveyResponsesTable.source}, 'direct')`)
      .orderBy(desc(sql`count(*)`));

    const byDay = await db
      .select({
        day: sql<string>`to_char(${surveyResponsesTable.submittedAt}, 'YYYY-MM-DD')`,
        count: sql<number>`count(*)::int`,
      })
      .from(surveyResponsesTable)
      .where(eq(surveyResponsesTable.surveyId, surveyId))
      .groupBy(sql`to_char(${surveyResponsesTable.submittedAt}, 'YYYY-MM-DD')`)
      .orderBy(asc(sql`to_char(${surveyResponsesTable.submittedAt}, 'YYYY-MM-DD')`));

    // Country distribution comes from the "country" question answers.
    const byCountry = await db
      .select({
        country: sql<string>`coalesce(${surveyAnswersTable.answerValue}, 'Not answered')`,
        count: sql<number>`count(*)::int`,
      })
      .from(surveyAnswersTable)
      .innerJoin(surveyQuestionsTable, eq(surveyAnswersTable.questionId, surveyQuestionsTable.id))
      .innerJoin(surveyResponsesTable, eq(surveyAnswersTable.responseId, surveyResponsesTable.id))
      .where(
        and(
          eq(surveyResponsesTable.surveyId, surveyId),
          eq(surveyQuestionsTable.questionKey, "country"),
        ),
      )
      .groupBy(sql`coalesce(${surveyAnswersTable.answerValue}, 'Not answered')`)
      .orderBy(desc(sql`count(*)`));

    res.json({
      survey: {
        id: survey.id,
        slug: survey.slug,
        title: survey.title,
        status: survey.status,
        publicPath: `/research/${survey.slug}`,
        opensAt: survey.opensAt,
        closesAt: survey.closesAt,
      },
      totals: {
        total: counts?.total ?? 0,
        included: (counts?.total ?? 0) - (counts?.excluded ?? 0),
        excluded: counts?.excluded ?? 0,
        suspectedDuplicates: counts?.duplicates ?? 0,
        quotationPermission: counts?.quotationYes ?? 0,
        averageCompletionSeconds: counts?.avgDuration ?? null,
      },
      bySource,
      byCountry,
      byDay,
    });
  } catch (err) {
    logger.error({ err }, "Failed to load survey summary");
    res.status(500).json({ error: "Failed to load survey summary" });
  }
});

// ── Response table ─────────────────────────────────────────────────────────────

router.get("/admin/research/surveys/:id/responses", async (req: Request, res: Response) => {
  if (!requireAdmin(req, res)) return;
  try {
    await ensureSurveyTables();
    const surveyId = Number(req.params.id);
    const conditions = buildResponseFilters(req, surveyId);

    const responses = await db
      .select(RESPONSE_COLUMNS)
      .from(surveyResponsesTable)
      .where(and(...conditions))
      .orderBy(desc(surveyResponsesTable.submittedAt))
      .limit(1000);

    const answerMaps = await loadAnswerMaps(
      responses.map((r) => r.id),
      ["relationship", "main_addiction", "country"],
    );

    let rows = responses.map((r) => ({
      ...r,
      relationship: answerMaps.get(r.id)?.relationship ?? null,
      mainAddiction: answerMaps.get(r.id)?.main_addiction ?? null,
      country: answerMaps.get(r.id)?.country ?? null,
    }));

    // Answer-based filters applied after the join.
    const { country, relationship, addiction } = req.query;
    if (typeof country === "string" && country) rows = rows.filter((r) => r.country === country);
    if (typeof relationship === "string" && relationship) rows = rows.filter((r) => r.relationship === relationship);
    if (typeof addiction === "string" && addiction) rows = rows.filter((r) => r.mainAddiction === addiction);

    res.json(rows);
  } catch (err) {
    logger.error({ err }, "Failed to list survey responses");
    res.status(500).json({ error: "Failed to list responses" });
  }
});

// ── Individual response ──────────────────────────────────────────────────────

router.get("/admin/research/responses/:id", async (req: Request, res: Response) => {
  if (!requireAdmin(req, res)) return;
  try {
    await ensureSurveyTables();
    const responseId = Number(req.params.id);
    const [response] = await db
      .select(RESPONSE_COLUMNS)
      .from(surveyResponsesTable)
      .where(eq(surveyResponsesTable.id, responseId));
    if (!response) {
      res.status(404).json({ error: "Response not found" });
      return;
    }

    const answers = await db
      .select({
        questionKey: surveyQuestionsTable.questionKey,
        section: surveyQuestionsTable.section,
        questionOrder: surveyQuestionsTable.questionOrder,
        questionText: surveyQuestionsTable.questionText,
        questionType: surveyQuestionsTable.questionType,
        answerValue: surveyAnswersTable.answerValue,
        answerValues: surveyAnswersTable.answerValues,
      })
      .from(surveyAnswersTable)
      .innerJoin(surveyQuestionsTable, eq(surveyAnswersTable.questionId, surveyQuestionsTable.id))
      .where(eq(surveyAnswersTable.responseId, responseId))
      .orderBy(asc(surveyQuestionsTable.questionOrder));

    res.json({ response, answers });
  } catch (err) {
    logger.error({ err }, "Failed to load survey response");
    res.status(500).json({ error: "Failed to load response" });
  }
});

// ── Exclude / restore / notes ────────────────────────────────────────────────

router.post("/admin/research/responses/:id/exclude", async (req: Request, res: Response) => {
  if (!requireAdmin(req, res)) return;
  try {
    const responseId = Number(req.params.id);
    const reason = typeof req.body?.reason === "string" ? req.body.reason.trim().slice(0, 1000) : null;
    const [updated] = await db
      .update(surveyResponsesTable)
      .set({ excludedFromAnalysis: true, exclusionReason: reason })
      .where(eq(surveyResponsesTable.id, responseId))
      .returning({ id: surveyResponsesTable.id, surveyId: surveyResponsesTable.surveyId });
    if (!updated) {
      res.status(404).json({ error: "Response not found" });
      return;
    }
    await audit({ surveyId: updated.surveyId, responseId, action: "response_excluded", reason });
    res.json({ ok: true });
  } catch (err) {
    logger.error({ err }, "Failed to exclude response");
    res.status(500).json({ error: "Failed to exclude response" });
  }
});

router.post("/admin/research/responses/:id/restore", async (req: Request, res: Response) => {
  if (!requireAdmin(req, res)) return;
  try {
    const responseId = Number(req.params.id);
    const [updated] = await db
      .update(surveyResponsesTable)
      .set({ excludedFromAnalysis: false, exclusionReason: null })
      .where(eq(surveyResponsesTable.id, responseId))
      .returning({ id: surveyResponsesTable.id, surveyId: surveyResponsesTable.surveyId });
    if (!updated) {
      res.status(404).json({ error: "Response not found" });
      return;
    }
    await audit({ surveyId: updated.surveyId, responseId, action: "response_restored" });
    res.json({ ok: true });
  } catch (err) {
    logger.error({ err }, "Failed to restore response");
    res.status(500).json({ error: "Failed to restore response" });
  }
});

router.post("/admin/research/responses/:id/notes", async (req: Request, res: Response) => {
  if (!requireAdmin(req, res)) return;
  try {
    const responseId = Number(req.params.id);
    const notes = typeof req.body?.notes === "string" ? req.body.notes.trim().slice(0, 4000) : "";
    const [updated] = await db
      .update(surveyResponsesTable)
      .set({ adminNotes: notes || null })
      .where(eq(surveyResponsesTable.id, responseId))
      .returning({ id: surveyResponsesTable.id });
    if (!updated) {
      res.status(404).json({ error: "Response not found" });
      return;
    }
    res.json({ ok: true });
  } catch (err) {
    logger.error({ err }, "Failed to save notes");
    res.status(500).json({ error: "Failed to save notes" });
  }
});

// ── Survey status ──────────────────────────────────────────────────────────────

const VALID_TRANSITIONS: Record<string, string[]> = {
  draft: ["open", "archived"],
  open: ["closed"],
  closed: ["open", "archived"],
  archived: [],
};

router.post("/admin/research/surveys/:id/status", async (req: Request, res: Response) => {
  if (!requireAdmin(req, res)) return;
  try {
    const surveyId = Number(req.params.id);
    const nextStatus = String(req.body?.status || "");
    const [survey] = await db.select().from(surveysTable).where(eq(surveysTable.id, surveyId));
    if (!survey) {
      res.status(404).json({ error: "Survey not found" });
      return;
    }
    if (!VALID_TRANSITIONS[survey.status]?.includes(nextStatus)) {
      res.status(400).json({ error: `Cannot change status from ${survey.status} to ${nextStatus}.` });
      return;
    }

    await db
      .update(surveysTable)
      .set({
        status: nextStatus as any,
        isPublic: nextStatus === "open" || nextStatus === "closed",
        opensAt: nextStatus === "open" && !survey.opensAt ? new Date() : survey.opensAt,
        closesAt: nextStatus === "closed" ? new Date() : survey.closesAt,
        updatedAt: new Date(),
      })
      .where(eq(surveysTable.id, surveyId));

    const actionMap: Record<string, string> = {
      open: "survey_opened",
      closed: "survey_closed",
      archived: "survey_archived",
    };
    await audit({ surveyId, action: actionMap[nextStatus] ?? `survey_status_${nextStatus}` });
    res.json({ ok: true, status: nextStatus });
  } catch (err) {
    logger.error({ err }, "Failed to change survey status");
    res.status(500).json({ error: "Failed to change survey status" });
  }
});

// ── Audit log ──────────────────────────────────────────────────────────────────

router.get("/admin/research/surveys/:id/audit", async (req: Request, res: Response) => {
  if (!requireAdmin(req, res)) return;
  try {
    const surveyId = Number(req.params.id);
    const entries = await db
      .select()
      .from(surveyAuditLogTable)
      .where(eq(surveyAuditLogTable.surveyId, surveyId))
      .orderBy(desc(surveyAuditLogTable.createdAt))
      .limit(200);
    res.json(entries);
  } catch (err) {
    logger.error({ err }, "Failed to load audit log");
    res.status(500).json({ error: "Failed to load audit log" });
  }
});

// ── CSV export ─────────────────────────────────────────────────────────────────

router.get("/admin/research/surveys/:id/export.csv", async (req: Request, res: Response) => {
  if (!requireAdmin(req, res)) return;
  try {
    await ensureSurveyTables();
    const surveyId = Number(req.params.id);
    const [survey] = await db.select().from(surveysTable).where(eq(surveysTable.id, surveyId));
    if (!survey) {
      res.status(404).json({ error: "Survey not found" });
      return;
    }

    const includeExcluded = req.query.includeExcluded === "true";
    const conditions = buildResponseFilters(req, surveyId);
    if (!includeExcluded && req.query.included === undefined) {
      conditions.push(eq(surveyResponsesTable.excludedFromAnalysis, false));
    }

    const questions = await db
      .select({
        id: surveyQuestionsTable.id,
        questionKey: surveyQuestionsTable.questionKey,
        questionText: surveyQuestionsTable.questionText,
      })
      .from(surveyQuestionsTable)
      .where(eq(surveyQuestionsTable.surveyId, surveyId))
      .orderBy(asc(surveyQuestionsTable.questionOrder));

    const responses = await db
      .select(RESPONSE_COLUMNS)
      .from(surveyResponsesTable)
      .where(and(...conditions))
      .orderBy(desc(surveyResponsesTable.submittedAt))
      .limit(10000);

    const answerMaps = await loadAnswerMaps(responses.map((r) => r.id));

    // Answer-based filters (country/relationship/addiction) for parity with the table view.
    const { country, relationship, addiction } = req.query;
    const filtered = responses.filter((r) => {
      const answers = answerMaps.get(r.id) ?? {};
      if (typeof country === "string" && country && answers["country"] !== country) return false;
      if (typeof relationship === "string" && relationship && answers["relationship"] !== relationship) return false;
      if (typeof addiction === "string" && addiction && answers["main_addiction"] !== addiction) return false;
      return true;
    });

    const headers = [
      "Response code",
      "Submitted at",
      "Consent accepted",
      "Quotation permission",
      "Completion time (seconds)",
      "Source",
      "Medium",
      "Campaign",
      "Referral URL",
      "Device category",
      "Suspected duplicate",
      "Completed unusually quickly",
      "Excluded from analysis",
      "Exclusion reason",
      ...questions.map((q) => q.questionText),
    ];

    const rows = filtered.map((r) => {
      const answers = answerMaps.get(r.id) ?? {};
      return [
        r.responseCode,
        r.submittedAt?.toISOString() ?? "",
        r.consentAccepted ? "Yes" : "No",
        r.quotationPermission ? "Yes" : "No",
        r.completionDurationSeconds ?? "",
        r.source ?? "",
        r.medium ?? "",
        r.campaign ?? "",
        r.referralUrl ?? "",
        r.userAgentCategory ?? "",
        r.suspectedDuplicate ? "Yes" : "No",
        r.minimumTimeFlag ? "Yes" : "No",
        r.excludedFromAnalysis ? "Yes" : "No",
        r.exclusionReason ?? "",
        ...questions.map((q) => answers[q.questionKey] ?? ""),
      ];
    });

    await audit({
      surveyId,
      action: "export_generated",
      reason: `rows=${rows.length}; includeExcluded=${includeExcluded}`,
    });

    const filename = `${survey.slug}-responses-${new Date().toISOString().slice(0, 10)}.csv`;
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(toCsv(headers, rows));
  } catch (err) {
    logger.error({ err }, "Failed to export survey responses");
    res.status(500).json({ error: "Failed to export responses" });
  }
});

export default router;

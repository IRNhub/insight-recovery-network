import {
  db,
  surveyAnswersTable,
  surveyQuestionsTable,
  surveyResponsesTable,
  surveysTable,
} from "@workspace/db";
import { asc, eq, isNull } from "drizzle-orm";
import { logger } from "./logger";
import { ensureSurveyTables } from "./survey-tables";

function configuration() {
  return {
    baseUrl: (process.env.IRN_OS_SURVEY_BASE_URL || "").replace(/\/$/, ""),
    apiKey: process.env.IRN_SURVEY_SERVICE_API_KEY || "",
  };
}

async function sendJson(url: string, method: "POST" | "PUT", payload: unknown) {
  const { apiKey } = configuration();
  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(10000),
  });
  const contentType = response.headers.get("content-type") || "";
  const data: any = contentType.includes("application/json") ? await response.json().catch(() => null) : null;
  if (!response.ok || !data || data.accepted !== true) {
    throw new Error(data?.error || `IRNOS returned ${response.status} without a valid acknowledgement`);
  }
  return data;
}

async function definitionForSurvey(surveyId: number) {
  const [survey] = await db.select().from(surveysTable).where(eq(surveysTable.id, surveyId));
  if (!survey) throw new Error("Survey not found");
  const questions = await db.select({
    questionKey: surveyQuestionsTable.questionKey,
    section: surveyQuestionsTable.section,
    questionOrder: surveyQuestionsTable.questionOrder,
    questionText: surveyQuestionsTable.questionText,
    questionType: surveyQuestionsTable.questionType,
    options: surveyQuestionsTable.options,
    isRequired: surveyQuestionsTable.isRequired,
    helperText: surveyQuestionsTable.helperText,
  }).from(surveyQuestionsTable).where(eq(surveyQuestionsTable.surveyId, surveyId)).orderBy(asc(surveyQuestionsTable.questionOrder));
  return {
    survey: {
      slug: survey.slug,
      title: survey.title,
      description: survey.description,
      status: survey.status,
      opensAt: survey.opensAt?.toISOString() ?? null,
      closesAt: survey.closesAt?.toISOString() ?? null,
    },
    questions,
  };
}

export async function syncSurveyDefinitionToIrnOs(surveyId: number) {
  const { baseUrl, apiKey } = configuration();
  if (!baseUrl || !apiKey) return { synced: false, error: "not_configured" };
  const definition = await definitionForSurvey(surveyId);
  await sendJson(`${baseUrl}/${encodeURIComponent(definition.survey.slug)}`, "PUT", definition);
  return { synced: true };
}

export async function forwardSurveyResponseToIrnOs(responseId: number) {
  await ensureSurveyTables();
  const { baseUrl, apiKey } = configuration();
  if (!baseUrl || !apiKey) return { forwarded: false, error: "not_configured" };

  const [response] = await db.select().from(surveyResponsesTable).where(eq(surveyResponsesTable.id, responseId));
  if (!response) return { forwarded: false, error: "response_not_found" };
  if (response.irnOsForwardedAt) return { forwarded: true, duplicate: true };

  try {
    const definition = await definitionForSurvey(response.surveyId);
    const answerRows = await db.select({
      questionKey: surveyQuestionsTable.questionKey,
      answerValue: surveyAnswersTable.answerValue,
      answerValues: surveyAnswersTable.answerValues,
    }).from(surveyAnswersTable)
      .innerJoin(surveyQuestionsTable, eq(surveyAnswersTable.questionId, surveyQuestionsTable.id))
      .where(eq(surveyAnswersTable.responseId, response.id));
    const answers: Record<string, string | string[]> = {};
    for (const answer of answerRows) {
      answers[answer.questionKey] = answer.answerValues ?? answer.answerValue ?? "";
    }
    const payload = {
      ...definition,
      response: {
        websiteResponseId: String(response.id),
        responseCode: response.responseCode,
        submissionToken: response.submissionToken,
        consentAccepted: true as const,
        quotationPermission: response.quotationPermission,
        startedAt: response.startedAt?.toISOString() ?? null,
        submittedAt: response.submittedAt.toISOString(),
        completionDurationSeconds: response.completionDurationSeconds,
        source: response.source,
        medium: response.medium,
        campaign: response.campaign,
        referralUrl: response.referralUrl,
        userAgentCategory: response.userAgentCategory,
        suspectedDuplicate: response.suspectedDuplicate,
        minimumTimeFlag: response.minimumTimeFlag,
        answers,
      },
    };
    const acknowledgement = await sendJson(`${baseUrl}/responses`, "POST", payload);
    await db.update(surveyResponsesTable).set({
      irnOsForwardedAt: new Date(),
      irnOsForwardAttempts: response.irnOsForwardAttempts + 1,
      irnOsForwardError: null,
    }).where(eq(surveyResponsesTable.id, response.id));
    logger.info({ responseId, irnOsResponseId: acknowledgement.responseId }, "Survey response delivered to IRNOS");
    return { forwarded: true, duplicate: Boolean(acknowledgement.duplicate) };
  } catch (error: any) {
    const message = error?.message || "Unknown IRNOS survey delivery error";
    await db.update(surveyResponsesTable).set({
      irnOsForwardAttempts: response.irnOsForwardAttempts + 1,
      irnOsForwardError: message.slice(0, 2000),
    }).where(eq(surveyResponsesTable.id, response.id));
    logger.warn({ responseId, error: message }, "Survey response delivery to IRNOS failed; retained for retry");
    return { forwarded: false, error: message };
  }
}

let syncRunning = false;

export async function syncPendingSurveysToIrnOs() {
  if (syncRunning) return;
  const { baseUrl, apiKey } = configuration();
  if (!baseUrl || !apiKey) return;
  syncRunning = true;
  try {
    await ensureSurveyTables();
    const surveys = await db.select({ id: surveysTable.id }).from(surveysTable);
    for (const survey of surveys) {
      await syncSurveyDefinitionToIrnOs(survey.id).catch((error) =>
        logger.warn({ surveyId: survey.id, error: error?.message }, "Survey definition sync failed"),
      );
    }
    const pending = await db.select({ id: surveyResponsesTable.id })
      .from(surveyResponsesTable)
      .where(isNull(surveyResponsesTable.irnOsForwardedAt))
      .orderBy(asc(surveyResponsesTable.submittedAt))
      .limit(50);
    for (const response of pending) await forwardSurveyResponseToIrnOs(response.id);
  } finally {
    syncRunning = false;
  }
}

export function startSurveySyncWorker() {
  void syncPendingSurveysToIrnOs();
  const timer = setInterval(() => void syncPendingSurveysToIrnOs(), 5 * 60 * 1000);
  timer.unref();
}

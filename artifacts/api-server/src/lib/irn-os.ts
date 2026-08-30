import { logger } from "./logger.ts";

interface IrnOsLeadPayload {
  enquiryId: string;
  createdAt: Date;
  name: string;
  email: string;
  phone: string;
  preferredContact: string;
  supportType: string;
  serviceInterest: string;
  message: string;
  consent: boolean;
  landingPage?: string | null;
  currentPage?: string | null;
  referrer?: string | null;
  pageSource?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmTerm?: string | null;
  utmContent?: string | null;
  submittedAt: string;
}

export interface IrnOsAssessmentPayload {
  assessmentId: string;
  createdAt: Date;
  name: string;
  email: string;
  phone?: string;
  type: string;
  scoreValue: number;
  scoreLevel: string;
  bandName: string;
  redFlags: string[];
  advisories: string[];
  tags: string[];
  clinicalBrief: string;
  answers?: Record<string, string | string[]>;
  consent: boolean;
  submittedAt: string;
}

export interface IrnOsForwardResult {
  forwarded: boolean;
  duplicate?: boolean;
  leadId?: string;
  error?: string;
}

interface IrnOsResponse {
  error?: unknown;
  duplicate?: unknown;
  leadId?: unknown;
  existingId?: unknown;
}

function assessmentMessage(payload: IrnOsAssessmentPayload): string {
  return [
    `Website assessment completed: ${payload.type}`,
    `Result: ${payload.bandName} (${payload.scoreValue})`,
    `Score level: ${payload.scoreLevel}`,
    `Red flags: ${payload.redFlags.join(", ") || "None"}`,
    `Advisories: ${payload.advisories.join(", ") || "None"}`,
    `Tags: ${payload.tags.join(", ") || "None"}`,
    "",
    payload.clinicalBrief,
  ].join("\n");
}

export function buildAssessmentLeadPayload(payload: IrnOsAssessmentPayload): Record<string, unknown> {
  const sourceId = `website-assessment-${payload.assessmentId}`;
  const createdAt = payload.createdAt.toISOString();

  return {
    id: sourceId,
    lead_id: sourceId,
    assessment_id: payload.assessmentId,
    full_name: payload.name,
    name: payload.name,
    email: payload.email,
    phone: payload.phone || undefined,
    preferredContact: payload.phone ? "phone" : "email",
    supportType: "myself",
    form_name: `Website assessment: ${payload.type}`,
    service_interest: "free-assessment",
    serviceInterest: "free-assessment",
    source: "website_assessment",
    source_platform: "website",
    currentPage: `/assessments/${payload.type}`,
    pageSource: `website-assessment:${payload.type}`,
    landingPage: `/assessments/${payload.type}`,
    message: assessmentMessage(payload),
    assessment_type: payload.type,
    assessmentType: payload.type,
    score_value: payload.scoreValue,
    scoreValue: payload.scoreValue,
    score_level: payload.scoreLevel,
    scoreLevel: payload.scoreLevel,
    score_label: payload.bandName,
    scoreLabel: payload.bandName,
    red_flags: payload.redFlags,
    advisories: payload.advisories,
    tags: payload.tags,
    clinical_brief: payload.clinicalBrief,
    answers: payload.answers,
    consent: payload.consent,
    created_at: createdAt,
    created_time: createdAt,
    submitted_at: payload.submittedAt,
  };
}

async function forwardToIrnOs(
  body: Record<string, unknown>,
  sourceId: string,
): Promise<IrnOsForwardResult> {
  const endpoint = process.env.IRN_OS_LEAD_ENDPOINT;
  const apiKey = process.env.IRN_OS_LEAD_API_KEY;

  if (!endpoint || !apiKey) {
    logger.info("IRN OS lead forwarding not configured");
    return { forwarded: false, error: "not_configured" };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    const data = (await response.json().catch(() => null)) as IrnOsResponse | null;

    if (!response.ok) {
      const error = typeof data?.error === "string" ? data.error : `IRN OS returned ${response.status}`;
      logger.warn({ error, status: response.status, sourceId }, "IRN OS lead forwarding failed");
      return { forwarded: false, error };
    }

    const leadId = typeof data?.leadId === "string"
      ? data.leadId
      : typeof data?.existingId === "string"
        ? data.existingId
        : undefined;

    return {
      forwarded: true,
      duplicate: Boolean(data?.duplicate),
      leadId,
    };
  } catch (err: unknown) {
    const error = err instanceof Error && err.name === "AbortError"
      ? "IRN OS forwarding timed out"
      : err instanceof Error
        ? err.message
        : "Unknown IRN OS forwarding error";
    logger.warn({ error, sourceId }, "IRN OS lead forwarding failed");
    return { forwarded: false, error };
  } finally {
    clearTimeout(timeout);
  }
}

export async function forwardEnquiryToIrnOs(payload: IrnOsLeadPayload): Promise<IrnOsForwardResult> {
  const sourceId = `website-enquiry-${payload.enquiryId}`;
  const createdAt = payload.createdAt.toISOString();

  return forwardToIrnOs({
    ...payload,
    id: sourceId,
    lead_id: sourceId,
    full_name: payload.name,
    form_name: "IRN website enquiry",
    source: "website_enquiry",
    source_platform: "website",
    createdAt,
    created_time: createdAt,
  }, sourceId);
}

export async function forwardAssessmentToIrnOs(
  payload: IrnOsAssessmentPayload,
): Promise<IrnOsForwardResult> {
  const sourceId = `website-assessment-${payload.assessmentId}`;
  return forwardToIrnOs(buildAssessmentLeadPayload(payload), sourceId);
}

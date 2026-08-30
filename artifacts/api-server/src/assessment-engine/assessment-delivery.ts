import { sendAuthoritativeAssessmentEmail } from "./assessment-email.ts";
import type {
  AssessmentDeliveryHandlers,
  StoredAssessmentResult,
} from "./assessment-service.ts";
import { forwardAssessmentToIrnOs } from "../lib/irn-os.ts";

function deterministicBrief(record: StoredAssessmentResult): string {
  return [
    record.result.interpretation.summary,
    ...record.result.interpretation.keyPatterns.flatMap((pattern) => [
      `${pattern.title}: ${pattern.statement}`,
      `Why this matters: ${pattern.whyItMatters}`,
    ]),
    `Safety action: ${record.result.safety.action}`,
    ...record.result.safety.content.map((item) => `${item.heading}: ${item.body}`),
    ...record.result.interpretation.limitations,
  ].join("\n");
}

async function forwardAuthoritativeAssessment(record: StoredAssessmentResult): Promise<void> {
  if (!record.contact.name || !record.contact.email) {
    const error = new Error("IRNOS follow-up contact details are incomplete");
    error.name = "contact_missing";
    throw error;
  }
  const hasFollowUpPermission = record.submission.consent ||
    ["queued", "failed", "forwarded"].includes(record.result.delivery.irnOs);
  if (!hasFollowUpPermission) {
    const error = new Error("IRNOS follow-up permission is missing");
    error.name = "consent_missing";
    throw error;
  }
  const forwarded = await forwardAssessmentToIrnOs({
    assessmentId: record.storageId,
    createdAt: new Date(record.result.completedAt),
    name: record.contact.name,
    email: record.contact.email,
    phone: record.contact.phone,
    type: record.result.assessmentKey,
    scoreValue: record.result.screening.value ?? undefined,
    scoreLevel: record.result.screening.level,
    bandName: record.result.screening.label,
    redFlags: record.result.safety.triggeredRules.map((rule) => rule.id),
    advisories: [],
    tags: [
      `definition:${record.result.definitionVersion}`,
      `safety-action:${record.result.safety.action}`,
    ],
    clinicalBrief: deterministicBrief(record),
    // Raw answers are deliberately not forwarded by the Phase A path.
    answers: undefined,
    consent: true,
    submittedAt: record.result.completedAt,
  });

  if (!forwarded.forwarded) {
    const error = new Error("IRNOS did not accept the assessment");
    error.name = forwarded.error === "not_configured" ? "provider_not_configured" : "provider_failed";
    throw error;
  }
}

export const assessmentDeliveryHandlers: AssessmentDeliveryHandlers = {
  email(record) {
    if (!record.contact.email) {
      const error = new Error("Result email address is missing");
      error.name = "contact_missing";
      return Promise.reject(error);
    }
    return sendAuthoritativeAssessmentEmail({
      name: record.contact.name,
      email: record.contact.email,
      result: record.result,
    });
  },
  irnOs: forwardAuthoritativeAssessment,
};

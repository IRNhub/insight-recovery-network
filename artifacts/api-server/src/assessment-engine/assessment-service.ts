import { randomUUID } from "node:crypto";
import type {
  AssessmentAnswers,
  AuthoritativeAssessmentResult,
  ValidatedSubmission,
} from "./contracts.ts";
import { disabledAiEnhancement } from "./assessment-ai.ts";
import { evaluateAssessment } from "./evaluate.ts";
import {
  createResultAccessToken,
  hashResultAccessToken,
} from "./result-access.ts";
import { parseSubmissionPayload } from "./validate-answers.ts";

const RETENTION_DAYS = 730;

export interface AssessmentContact {
  name: string;
  email: string;
  phone?: string;
}

export interface StoredAssessmentResult {
  storageId: string;
  submission: ValidatedSubmission;
  contact: AssessmentContact;
  result: AuthoritativeAssessmentResult;
  answers: AssessmentAnswers;
}

export interface AssessmentPersistence {
  findBySubmissionKey(submissionKey: string): Promise<StoredAssessmentResult | null>;
  create(
    record: StoredAssessmentResult,
    accessTokenHash: string,
  ): Promise<{ record: StoredAssessmentResult; created: boolean }>;
  rotateAccessToken(storageId: string, accessTokenHash: string): Promise<void>;
  findByAccessTokenHash(accessTokenHash: string): Promise<StoredAssessmentResult | null>;
  updateDelivery(
    storageId: string,
    channel: "email" | "irn_os",
    status: "sent" | "forwarded" | "failed",
    errorCode?: string,
  ): Promise<void>;
  markCtaClicked(storageId: string): Promise<void>;
}

export interface AssessmentDeliveryHandlers {
  email(record: StoredAssessmentResult): Promise<void>;
  irnOs(record: StoredAssessmentResult): Promise<void>;
}

export interface SubmitAssessmentDependencies {
  persistence: AssessmentPersistence;
  deliveries: AssessmentDeliveryHandlers;
  now?: () => Date;
  createId?: () => string;
  createToken?: () => string;
}

export interface SubmitAssessmentOutcome {
  result: AuthoritativeAssessmentResult;
  accessToken: string;
  created: boolean;
}

function requiredText(answers: AssessmentAnswers, id: string): string {
  const value = answers[id];
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Validated assessment is missing required ${id}`);
  }
  return value.trim();
}

function contactFromAnswers(answers: AssessmentAnswers): AssessmentContact {
  const phone = answers.phone;
  return {
    name: requiredText(answers, "name"),
    email: requiredText(answers, "email"),
    ...(typeof phone === "string" && phone.trim() ? { phone: phone.trim() } : {}),
  };
}

function resultWithDelivery(
  result: AuthoritativeAssessmentResult,
  channel: "email" | "irn_os",
  status: "sent" | "forwarded" | "failed",
): AuthoritativeAssessmentResult {
  return {
    ...result,
    delivery: {
      ...result.delivery,
      ...(channel === "email" ? { email: status as "sent" | "failed" } : { irnOs: status as "forwarded" | "failed" }),
    },
  };
}

export async function attemptAssessmentDeliveries(
  record: StoredAssessmentResult,
  persistence: AssessmentPersistence,
  handlers: AssessmentDeliveryHandlers,
): Promise<StoredAssessmentResult> {
  let current = record;

  const attempts: Array<{
    channel: "email" | "irn_os";
    shouldAttempt: boolean;
    deliver: () => Promise<void>;
    success: "sent" | "forwarded";
  }> = [
    {
      channel: "email",
      shouldAttempt: current.result.delivery.email !== "sent",
      deliver: () => handlers.email(current),
      success: "sent",
    },
    {
      channel: "irn_os",
      shouldAttempt: current.result.delivery.irnOs !== "forwarded",
      deliver: () => handlers.irnOs(current),
      success: "forwarded",
    },
  ];

  for (const attempt of attempts) {
    if (!attempt.shouldAttempt) continue;
    let status: "sent" | "forwarded" | "failed" = attempt.success;
    let errorCode: string | undefined;
    try {
      await attempt.deliver();
    } catch (error) {
      status = "failed";
      errorCode = error instanceof Error && error.name ? error.name : "delivery_failed";
    }
    current = { ...current, result: resultWithDelivery(current.result, attempt.channel, status) };
    try {
      await persistence.updateDelivery(current.storageId, attempt.channel, status, errorCode);
    } catch {
      // The authoritative result is already saved. A delivery status update is
      // secondary and must never make the result unavailable.
    }
  }

  return current;
}

function buildNewRecord(
  raw: unknown,
  now: Date,
  resultId: string,
): StoredAssessmentResult {
  const { submission, definition } = parseSubmissionPayload(raw);
  const evaluated = evaluateAssessment(definition, submission.answers);
  const expiresAt = new Date(now.getTime() + RETENTION_DAYS * 24 * 60 * 60 * 1000);

  return {
    storageId: "pending",
    submission,
    contact: contactFromAnswers(submission.answers),
    answers: evaluated.answers,
    result: {
      resultId,
      assessmentKey: submission.assessmentKey,
      definitionVersion: definition.version,
      definitionHash: definition.definitionHash,
      engineVersion: definition.engineVersion,
      completedAt: now.toISOString(),
      screening: evaluated.screening,
      instrument: null,
      domains: evaluated.domains,
      safety: evaluated.safety,
      interpretation: evaluated.interpretation,
      pathways: evaluated.pathways,
      aiEnhancement: disabledAiEnhancement(),
      persistence: { status: "saved", expiresAt: expiresAt.toISOString() },
      delivery: { email: "queued", irnOs: "queued" },
    },
  };
}

export async function submitAssessment(
  raw: unknown,
  dependencies: SubmitAssessmentDependencies,
): Promise<SubmitAssessmentOutcome> {
  const now = dependencies.now?.() ?? new Date();
  const createToken = dependencies.createToken ?? createResultAccessToken;
  const token = createToken();
  const tokenHash = hashResultAccessToken(token);
  const parsed = parseSubmissionPayload(raw);

  const existing = await dependencies.persistence.findBySubmissionKey(parsed.submission.submissionKey);
  if (existing) {
    await dependencies.persistence.rotateAccessToken(existing.storageId, tokenHash);
    const delivered = await attemptAssessmentDeliveries(existing, dependencies.persistence, dependencies.deliveries);
    return { result: delivered.result, accessToken: token, created: false };
  }

  const candidate = buildNewRecord(raw, now, dependencies.createId?.() ?? randomUUID());
  const persisted = await dependencies.persistence.create(candidate, tokenHash);

  if (!persisted.created) {
    await dependencies.persistence.rotateAccessToken(persisted.record.storageId, tokenHash);
  }

  const delivered = await attemptAssessmentDeliveries(
    persisted.record,
    dependencies.persistence,
    dependencies.deliveries,
  );

  return { result: delivered.result, accessToken: token, created: persisted.created };
}

export async function recoverAssessment(
  accessToken: string,
  persistence: AssessmentPersistence,
): Promise<StoredAssessmentResult | null> {
  return persistence.findByAccessTokenHash(hashResultAccessToken(accessToken));
}

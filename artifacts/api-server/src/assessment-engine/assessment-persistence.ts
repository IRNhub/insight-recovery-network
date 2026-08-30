import {
  assessmentDeliveriesTable,
  assessmentsTable,
  db,
  type Assessment,
} from "@workspace/db";
import { and, eq, isNull, sql } from "drizzle-orm";
import type {
  AssessmentAnswers,
  DeterministicInterpretation,
  DomainResult,
  PathwayRecommendation,
  SafetyResult,
  ScreeningClassification,
} from "./contracts.ts";
import type {
  AssessmentPersistence,
  StoredAssessmentResult,
} from "./assessment-service.ts";

function deliveryEmailStatus(value: string): "not-requested" | "queued" | "sent" | "failed" {
  return value === "queued" || value === "sent" || value === "failed" ? value : "not-requested";
}

function deliveryIrnOsStatus(value: string): "not-requested" | "queued" | "forwarded" | "failed" {
  return value === "queued" || value === "forwarded" || value === "failed" ? value : "not-requested";
}

export function storedAssessmentFromRow(row: Assessment): StoredAssessmentResult | null {
  if (
    row.resultSource !== "server-authoritative-phase-a-v1" ||
    !row.submissionKey ||
    !row.assessmentKey ||
    !row.definitionVersion ||
    !row.definitionHash ||
    !row.engineVersion ||
    !row.screeningClassification ||
    !row.domains ||
    !row.safetyAction ||
    !row.triggeredSafetyRules ||
    !row.deterministicInterpretation ||
    !row.pathways
  ) {
    return null;
  }

  const answers = row.answers as AssessmentAnswers;
  const safety = row.triggeredSafetyRules as SafetyResult;
  const storedScreening = row.screeningClassification as ScreeningClassification;
  const screening: ScreeningClassification = {
    ...storedScreening,
    displayScore: storedScreening.displayScore ?? (storedScreening.value !== null),
  };

  return {
    storageId: String(row.id),
    submission: {
      assessmentKey: row.assessmentKey as StoredAssessmentResult["submission"]["assessmentKey"],
      definitionVersion: row.definitionVersion,
      submissionKey: row.submissionKey,
      answers,
      consent: row.consent,
      privacyNoticeVersion: row.privacyNoticeVersion ?? "unknown-legacy-notice",
    },
    contact: {
      ...(row.name ? { name: row.name } : {}),
      ...(row.email ? { email: row.email } : {}),
      ...(row.phone ? { phone: row.phone } : {}),
    },
    answers,
    result: {
      resultId: row.resultPublicId,
      assessmentKey: row.assessmentKey as StoredAssessmentResult["result"]["assessmentKey"],
      definitionVersion: row.definitionVersion,
      definitionHash: row.definitionHash,
      engineVersion: row.engineVersion,
      completedAt: row.createdAt.toISOString(),
      screening,
      instrument: (row.instrumentResult as StoredAssessmentResult["result"]["instrument"]) ?? null,
      domains: row.domains as DomainResult[],
      safety,
      interpretation: row.deterministicInterpretation as DeterministicInterpretation,
      pathways: row.pathways as PathwayRecommendation[],
      aiEnhancement: {
        status: row.aiEnhancementStatus as StoredAssessmentResult["result"]["aiEnhancement"]["status"],
        ...(row.aiProvider ? { provider: row.aiProvider } : {}),
        ...(row.aiModel ? { model: row.aiModel } : {}),
        ...(row.aiPromptVersion ? { promptVersion: row.aiPromptVersion } : {}),
      },
      persistence: {
        status: "saved",
        ...(row.deleteAfter ? { expiresAt: row.deleteAfter.toISOString() } : {}),
      },
      delivery: {
        email: deliveryEmailStatus(row.emailDeliveryStatus),
        irnOs: deliveryIrnOsStatus(row.irnOsDeliveryStatus),
      },
    },
  };
}

function uniqueViolation(error: unknown): boolean {
  return Boolean(error && typeof error === "object" && "code" in error && error.code === "23505");
}

async function findBySubmissionKey(submissionKey: string): Promise<StoredAssessmentResult | null> {
  const [row] = await db
    .select()
    .from(assessmentsTable)
    .where(and(eq(assessmentsTable.submissionKey, submissionKey), isNull(assessmentsTable.deletedAt)))
    .limit(1);
  return row ? storedAssessmentFromRow(row) : null;
}

export const assessmentPersistence: AssessmentPersistence = {
  findBySubmissionKey,

  async create(record, accessTokenHash) {
    try {
      const created = await db.transaction(async (tx) => {
        const [row] = await tx
          .insert(assessmentsTable)
          .values({
            resultPublicId: record.result.resultId,
            submissionKey: record.submission.submissionKey,
            type: record.result.assessmentKey,
            assessmentKey: record.result.assessmentKey,
            definitionVersion: record.result.definitionVersion,
            definitionHash: record.result.definitionHash,
            engineVersion: record.result.engineVersion,
            resultSource: "server-authoritative-phase-a-v1",
            name: record.contact.name ?? null,
            email: record.contact.email ?? null,
            phone: record.contact.phone ?? null,
            consent: record.submission.consent,
            answers: record.answers,
            scoreValue: record.result.screening.value,
            scoreLevel: record.result.screening.level,
            scoreLabel: record.result.screening.label,
            redFlags: record.result.safety.triggeredRules.map((rule) => rule.id),
            tags: [
              `assessment:${record.result.assessmentKey}`,
              `definition:${record.result.definitionVersion}`,
              `safety-action:${record.result.safety.action}`,
            ],
            anchorResponse: null,
            instrumentResult: record.result.instrument,
            domains: record.result.domains,
            screeningClassification: record.result.screening,
            safetyAction: record.result.safety.action,
            triggeredSafetyRules: record.result.safety,
            deterministicInterpretation: record.result.interpretation,
            pathways: record.result.pathways,
            aiEnhancementStatus: record.result.aiEnhancement.status,
            aiProvider: record.result.aiEnhancement.provider ?? null,
            aiModel: record.result.aiEnhancement.model ?? null,
            aiPromptVersion: record.result.aiEnhancement.promptVersion ?? null,
            persistenceState: "saved",
            emailDeliveryStatus: record.result.delivery.email,
            irnOsDeliveryStatus: record.result.delivery.irnOs,
            privacyNoticeVersion: record.submission.privacyNoticeVersion,
            resultAccessTokenHash: accessTokenHash,
            deleteAfter: record.result.persistence.expiresAt
              ? new Date(record.result.persistence.expiresAt)
              : null,
          })
          .returning();

        if (!row) throw new Error("Assessment insert returned no record");

        const requestedDeliveries = [
          ...(record.result.delivery.email === "queued" ? [{ assessmentId: row.id, channel: "email" as const }] : []),
          ...(record.result.delivery.irnOs === "queued" ? [{ assessmentId: row.id, channel: "irn_os" as const }] : []),
        ];
        if (requestedDeliveries.length > 0) {
          await tx.insert(assessmentDeliveriesTable).values(requestedDeliveries);
        }
        return row;
      });

      const stored = storedAssessmentFromRow(created);
      if (!stored) throw new Error("Stored authoritative result could not be rehydrated");
      return { record: stored, created: true };
    } catch (error) {
      if (uniqueViolation(error)) {
        const existing = await findBySubmissionKey(record.submission.submissionKey);
        if (existing) return { record: existing, created: false };
      }
      throw error;
    }
  },

  async rotateAccessToken(storageId, accessTokenHash) {
    await db
      .update(assessmentsTable)
      .set({ resultAccessTokenHash: accessTokenHash })
      .where(eq(assessmentsTable.id, Number(storageId)));
  },

  async findByAccessTokenHash(accessTokenHash) {
    const [row] = await db
      .select()
      .from(assessmentsTable)
      .where(and(
        eq(assessmentsTable.resultAccessTokenHash, accessTokenHash),
        isNull(assessmentsTable.deletedAt),
      ))
      .limit(1);
    if (!row || (row.deleteAfter && row.deleteAfter <= new Date())) return null;
    return storedAssessmentFromRow(row);
  },

  async updateDelivery(storageId, channel, status, errorCode) {
    const assessmentId = Number(storageId);
    const nextAttemptAt = status === "failed"
      ? new Date(Date.now() + 15 * 60 * 1000)
      : new Date();
    await db.transaction(async (tx) => {
      await tx
        .update(assessmentsTable)
        .set(channel === "email"
          ? { emailDeliveryStatus: status }
          : { irnOsDeliveryStatus: status })
        .where(eq(assessmentsTable.id, assessmentId));

      await tx
        .update(assessmentDeliveriesTable)
        .set({
          status: status === "sent" || status === "forwarded" ? "complete" : "failed",
          attempts: sql`${assessmentDeliveriesTable.attempts} + 1`,
          nextAttemptAt,
          lastErrorCode: errorCode?.slice(0, 80) ?? null,
          updatedAt: new Date(),
        })
        .where(and(
          eq(assessmentDeliveriesTable.assessmentId, assessmentId),
          eq(assessmentDeliveriesTable.channel, channel),
        ));
    });
  },

  async markCtaClicked(storageId) {
    await db
      .update(assessmentsTable)
      .set({ ctaClicked: true })
      .where(eq(assessmentsTable.id, Number(storageId)));
  },

  async requestContact(storageId, request) {
    const assessmentId = Number(storageId);
    const updated = await db.transaction(async (tx) => {
      const [current] = await tx
        .select()
        .from(assessmentsTable)
        .where(and(eq(assessmentsTable.id, assessmentId), isNull(assessmentsTable.deletedAt)))
        .limit(1);
      if (!current) throw new Error("Assessment result not found");

      const queueEmail = request.permissions.emailResult && current.emailDeliveryStatus !== "sent";
      const queueIrnOs = request.permissions.irnFollowUp && current.irnOsDeliveryStatus !== "forwarded";
      const now = new Date();
      const [row] = await tx
        .update(assessmentsTable)
        .set({
          name: request.name ?? current.name,
          email: request.email,
          phone: request.phone ?? current.phone,
          resultEmailRequested: current.resultEmailRequested || request.permissions.emailResult,
          irnFollowUpRequested: current.irnFollowUpRequested || request.permissions.irnFollowUp,
          marketingConsent: current.marketingConsent || request.permissions.marketing,
          resultEmailConsentAt: current.resultEmailConsentAt ?? (request.permissions.emailResult ? now : null),
          irnFollowUpConsentAt: current.irnFollowUpConsentAt ?? (request.permissions.irnFollowUp ? now : null),
          marketingConsentAt: current.marketingConsentAt ?? (request.permissions.marketing ? now : null),
          contactPrivacyNoticeVersion: request.privacyNoticeVersion,
          emailDeliveryStatus: queueEmail ? "queued" : current.emailDeliveryStatus,
          irnOsDeliveryStatus: queueIrnOs ? "queued" : current.irnOsDeliveryStatus,
        })
        .where(eq(assessmentsTable.id, assessmentId))
        .returning();
      if (!row) throw new Error("Assessment contact update returned no record");

      for (const [channel, shouldQueue] of [["email", queueEmail], ["irn_os", queueIrnOs]] as const) {
        if (!shouldQueue) continue;
        await tx
          .insert(assessmentDeliveriesTable)
          .values({ assessmentId, channel, status: "queued", nextAttemptAt: now })
          .onConflictDoUpdate({
            target: [assessmentDeliveriesTable.assessmentId, assessmentDeliveriesTable.channel],
            set: { status: "queued", nextAttemptAt: now, lastErrorCode: null, updatedAt: now },
          });
      }
      return row;
    });

    const stored = storedAssessmentFromRow(updated);
    if (!stored) throw new Error("Updated authoritative result could not be rehydrated");
    return stored;
  },
};

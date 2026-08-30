import assert from "node:assert/strict";
import test from "node:test";
import type {
  AssessmentAnswers,
  AssessmentContactRequest,
  AssessmentKey,
} from "../assessment-engine/contracts.ts";
import { disabledAiEnhancement } from "../assessment-engine/assessment-ai.ts";
import { parseAssessmentContactRequest } from "../assessment-engine/assessment-contact.ts";
import { questionIsApplicable } from "../assessment-engine/branching.ts";
import { evaluateAssessment } from "../assessment-engine/evaluate.ts";
import { materialisePhaseCClinicalFixtures, phaseCClinicalFixtures } from "../assessment-engine/phase-c-clinical-fixtures.ts";
import { phaseCInstrumentPermissionDecision } from "../assessment-engine/phase-c-mental-health-definitions-v2.ts";
import { getActiveDefinition, toPublicDefinition } from "../assessment-engine/registry.ts";
import {
  recoverAssessment,
  requestAssessmentContact,
  submitAssessment,
  type AssessmentDeliveryHandlers,
  type AssessmentPersistence,
  type StoredAssessmentResult,
} from "../assessment-engine/assessment-service.ts";
import { AssessmentValidationError, validateAnswers } from "../assessment-engine/validate-answers.ts";

type PhaseCKey = Extract<AssessmentKey, "anxiety" | "depression" | "adhd">;
const PHASE_C_KEYS: PhaseCKey[] = ["anxiety", "depression", "adhd"];
let submissionCounter = 0;

function completeAnswers(key: PhaseCKey, overrides: AssessmentAnswers = {}): AssessmentAnswers {
  const definition = getActiveDefinition(key);
  const answers: AssessmentAnswers = { ...overrides };
  for (let pass = 0; pass < 5; pass += 1) {
    for (const section of definition.sections) {
      for (const question of section.questions) {
        if (answers[question.id] !== undefined || !question.required || !questionIsApplicable(section, question, answers)) continue;
        if (!question.options?.length) continue;
        const selected = [...question.options].sort((a, b) => a.score - b.score)[0]!;
        answers[question.id] = question.type === "checkbox" ? [selected.value] : selected.value;
      }
    }
  }
  return answers;
}

function submission(key: PhaseCKey, overrides: AssessmentAnswers = {}) {
  submissionCounter += 1;
  return {
    assessmentKey: key,
    definitionVersion: getActiveDefinition(key).version,
    submissionKey: `10000000-0000-4000-8000-${String(submissionCounter).padStart(12, "0")}`,
    answers: completeAnswers(key, overrides),
    scoreValue: 999999,
    bandName: "Forged emergency result",
  };
}

function gadAnswers(score: number): AssessmentAnswers {
  const answers: AssessmentAnswers = {};
  for (let index = 1; index <= 7; index += 1) {
    const value = Math.min(3, score);
    score -= value;
    answers[`gad7-${index}`] = ["not-at-all", "several-days", "more-than-half", "nearly-every-day"][value]!;
  }
  return answers;
}

function phqAnswers(score: number): AssessmentAnswers {
  const answers: AssessmentAnswers = {};
  for (let index = 1; index <= 9; index += 1) {
    const value = Math.min(3, score);
    score -= value;
    answers[`phq9-${index}`] = ["not-at-all", "several-days", "more-than-half", "nearly-every-day"][value]!;
  }
  return answers;
}

class PhaseCMemoryPersistence implements AssessmentPersistence {
  private records = new Map<string, StoredAssessmentResult>();
  private submissions = new Map<string, string>();
  private tokens = new Map<string, string>();
  contactRequests: AssessmentContactRequest[] = [];

  async findBySubmissionKey(submissionKey: string) {
    const id = this.submissions.get(submissionKey);
    return id ? this.records.get(id) ?? null : null;
  }

  async create(record: StoredAssessmentResult, accessTokenHash: string) {
    const existing = await this.findBySubmissionKey(record.submission.submissionKey);
    if (existing) return { record: existing, created: false };
    const id = String(this.records.size + 1);
    const stored = { ...record, storageId: id };
    this.records.set(id, stored);
    this.submissions.set(stored.submission.submissionKey, id);
    this.tokens.set(accessTokenHash, id);
    return { record: stored, created: true };
  }

  async rotateAccessToken(storageId: string, accessTokenHash: string) {
    for (const [token, id] of this.tokens) if (id === storageId) this.tokens.delete(token);
    this.tokens.set(accessTokenHash, storageId);
  }

  async findByAccessTokenHash(accessTokenHash: string) {
    const id = this.tokens.get(accessTokenHash);
    return id ? this.records.get(id) ?? null : null;
  }

  async updateDelivery(storageId: string, channel: "email" | "irn_os", status: "sent" | "forwarded" | "failed") {
    const record = this.records.get(storageId);
    if (!record) return;
    this.records.set(storageId, {
      ...record,
      result: {
        ...record.result,
        delivery: {
          ...record.result.delivery,
          ...(channel === "email" ? { email: status as "sent" | "failed" } : { irnOs: status as "forwarded" | "failed" }),
        },
      },
    });
  }

  async markCtaClicked() {}

  async requestContact(storageId: string, request: AssessmentContactRequest) {
    const record = this.records.get(storageId);
    if (!record) throw new Error("Synthetic result not found");
    this.contactRequests.push(request);
    const updated: StoredAssessmentResult = {
      ...record,
      contact: { name: request.name, email: request.email, phone: request.phone },
      result: {
        ...record.result,
        delivery: {
          email: request.permissions.emailResult ? "queued" : record.result.delivery.email,
          irnOs: request.permissions.irnFollowUp ? "queued" : record.result.delivery.irnOs,
        },
      },
    };
    this.records.set(storageId, updated);
    return updated;
  }
}

const successfulDeliveries: AssessmentDeliveryHandlers = {
  async email() {},
  async irnOs() {},
};

test("Phase C activates only the authorised adult mental-health v2 definitions", () => {
  for (const key of PHASE_C_KEYS) {
    const definition = getActiveDefinition(key);
    assert.equal(definition.version, 2);
    assert.equal(definition.engineVersion, "phase-c-v2");
    assert.equal(definition.clinicalApproval.status, "approved");
    assert.equal(definition.clinicalApproval.approvedAt, "2026-08-30");
    assert.equal(definition.eligibility?.questionId, "age-eligibility");
    assert.deepEqual(definition.eligibility?.allowedValues, ["adult"]);
  }
});

test("instrument permissions, names, item counts and required ASRS threshold presentation are explicit", () => {
  assert.match(phaseCInstrumentPermissionDecision.gad7, /without formal permission/i);
  assert.match(phaseCInstrumentPermissionDecision.phq9, /without formal permission/i);
  assert.match(phaseCInstrumentPermissionDecision.asrs, /without formal permission/i);
  const expected = [
    ["anxiety", "GAD-7", 7, 21],
    ["depression", "PHQ-9", 9, 27],
    ["adhd", "Adult ADHD Self-Report Scale (ASRS-v1.1) Screener", 6, 6],
  ] as const;
  for (const [key, name, items, maximum] of expected) {
    const instrument = getActiveDefinition(key).instrument;
    assert.equal(instrument?.name, name);
    assert.equal(instrument?.questionIds.length, items);
    assert.equal(instrument?.maximumScore, maximum);
    assert.equal(instrument?.permissionStatus, "confirmed");
    assert.ok(instrument?.citation);
  }
  const publicAdhd = toPublicDefinition(getActiveDefinition("adhd"));
  const thresholdOptions = publicAdhd.sections.flatMap((section) => section.questions)
    .flatMap((question) => question.options ?? [])
    .filter((option) => option.instrumentThreshold);
  assert.ok(thresholdOptions.length > 0);
  assert.equal(thresholdOptions.every((option) => !("score" in option)), true);
});

test("GAD-7 scoring and bands match the authoritative 0 to 21 boundaries", () => {
  const definition = getActiveDefinition("anxiety");
  for (const [score, band] of [[0, "Minimal anxiety"], [4, "Minimal anxiety"], [5, "Mild anxiety"], [9, "Mild anxiety"], [10, "Moderate anxiety"], [14, "Moderate anxiety"], [15, "Severe anxiety"], [21, "Severe anxiety"]] as const) {
    const result = evaluateAssessment(definition, validateAnswers(definition, completeAnswers("anxiety", gadAnswers(score))));
    assert.equal(result.instrument?.rawScore, score);
    assert.equal(result.instrument?.band, band);
    assert.equal(result.screening.source, "validated-instrument");
  }
});

test("PHQ-9 scoring and bands match the authoritative 0 to 27 boundaries", () => {
  const definition = getActiveDefinition("depression");
  for (const [score, band] of [[0, "Minimal depression"], [4, "Minimal depression"], [5, "Mild depression"], [9, "Mild depression"], [10, "Moderate depression"], [14, "Moderate depression"], [15, "Moderately severe depression"], [19, "Moderately severe depression"], [20, "Severe depression"], [27, "Severe depression"]] as const) {
    const overrides = { ...phqAnswers(score), "mental-health-safety": "none" };
    const result = evaluateAssessment(definition, validateAnswers(definition, completeAnswers("depression", overrides)));
    assert.equal(result.instrument?.rawScore, score);
    assert.equal(result.instrument?.band, band);
  }
});

test("ASRS-v1.1 uses the original six shaded threshold responses and a four-of-six cut-off", () => {
  const definition = getActiveDefinition("adhd");
  const three = evaluateAssessment(definition, validateAnswers(definition, completeAnswers("adhd", {
    "asrs-1": "often", "asrs-2": "often", "asrs-4": "sometimes",
  })));
  assert.equal(three.instrument?.rawScore, 3);
  assert.equal(three.instrument?.band, "ASRS screening threshold not reached");

  const four = evaluateAssessment(definition, validateAnswers(definition, completeAnswers("adhd", {
    "asrs-1": "often", "asrs-2": "often", "asrs-3": "often", "asrs-4": "sometimes",
  })));
  assert.equal(four.instrument?.rawScore, 4);
  assert.equal(four.instrument?.band, "ASRS screening threshold reached");

  const nonThresholdSometimes = evaluateAssessment(definition, validateAnswers(definition, completeAnswers("adhd", {
    "asrs-1": "sometimes", "asrs-2": "sometimes", "asrs-3": "sometimes", "asrs-5": "sometimes",
  })));
  assert.equal(nonThresholdSometimes.instrument?.rawScore, 0);
});

test("IRN context never changes the validated instrument score", () => {
  const cases: Array<{ key: PhaseCKey; baseline: AssessmentAnswers; context: AssessmentAnswers }> = [
    { key: "anxiety", baseline: gadAnswers(5), context: { "anxiety-duration": "over-six-months", "anxiety-avoidance": "major", "anxiety-functioning": "severe", "anxiety-substance-coping": "most-days" } },
    { key: "depression", baseline: phqAnswers(5), context: { "depression-duration": "over-six-months", "depression-functioning": "severe", "depression-isolation": "major", "depression-substance-coping": "most-days" } },
    { key: "adhd", baseline: { "asrs-1": "often", "asrs-2": "often", "asrs-3": "often", "asrs-4": "sometimes" }, context: { "adhd-childhood": "clear", "adhd-settings": "multiple", "adhd-functioning": "severe", "adhd-substance-overlap": "yes" } },
  ];
  for (const item of cases) {
    const definition = getActiveDefinition(item.key);
    const baseline = evaluateAssessment(definition, validateAnswers(definition, completeAnswers(item.key, item.baseline)));
    const contextual = evaluateAssessment(definition, validateAnswers(definition, completeAnswers(item.key, { ...item.baseline, ...item.context })));
    assert.equal(contextual.instrument?.rawScore, baseline.instrument?.rawScore, item.key);
  }
});

test("mild symptom severity can coexist with urgent safety guidance", () => {
  const definition = getActiveDefinition("anxiety");
  const result = evaluateAssessment(definition, validateAnswers(definition, completeAnswers("anxiety", {
    ...gadAnswers(5),
    "mental-health-safety": "recurring-increasing",
  })));
  assert.equal(result.instrument?.band, "Mild anxiety");
  assert.equal(result.safety.action, "urgent-same-day-assessment");
  assert.equal(result.safety.suppressCommercialCtas, true);
});

test("high symptom scores never create an emergency without a separate safety answer", () => {
  for (const [key, overrides] of [["anxiety", gadAnswers(21)], ["depression", { ...phqAnswers(24), "phq9-9": "not-at-all" }]] as const) {
    const definition = getActiveDefinition(key);
    const result = evaluateAssessment(definition, validateAnswers(definition, completeAnswers(key, { ...overrides, "mental-health-safety": "none" })));
    assert.equal(result.screening.level, "elevated-concern");
    assert.equal(result.safety.action, "no-immediate-warning-identified");
    assert.equal(result.safety.suppressCommercialCtas, false);
  }
});

test("PHQ-9 item 9 enters safety separately and is never turned into a suicide-risk label", () => {
  const definition = getActiveDefinition("depression");
  const result = evaluateAssessment(definition, validateAnswers(definition, completeAnswers("depression", {
    "phq9-9": "several-days",
    "mental-health-safety": "none",
  })));
  assert.equal(result.instrument?.rawScore, 1);
  assert.equal(result.safety.action, "clinical-review-recommended");
  assert.equal(result.safety.content.some((content) => content.id === "phq9-item9-review"), true);
  assert.equal(/low suicide risk|medium suicide risk|high suicide risk/i.test(JSON.stringify(result)), false);
});

test("the one shared safety architecture preserves all five approved distinctions", () => {
  const expected = [
    ["historical-non-current", "additional-caution"],
    ["passing-current", "clinical-review-recommended"],
    ["recurring-increasing", "urgent-same-day-assessment"],
    ["cannot-remain-safe", "emergency-help-now"],
    ["recent-attempt-immediate-danger", "emergency-help-now"],
  ] as const;
  for (const key of PHASE_C_KEYS) {
    const definition = getActiveDefinition(key);
    for (const [value, action] of expected) {
      const result = evaluateAssessment(definition, validateAnswers(definition, completeAnswers(key, { "mental-health-safety": value })));
      assert.equal(result.safety.action, action, `${key}:${value}`);
    }
  }
});

test("emergency mental-health presentation appears first, contains no substance copy and suppresses commercial CTAs", () => {
  for (const key of PHASE_C_KEYS) {
    const definition = getActiveDefinition(key);
    const result = evaluateAssessment(definition, validateAnswers(definition, completeAnswers(key, { "mental-health-safety": "cannot-remain-safe" })));
    assert.equal(result.safety.action, "emergency-help-now");
    assert.equal(result.safety.content[0]?.id, "mental-health-emergency");
    assert.equal(result.pathways[0]?.id, "emergency-999");
    assert.equal(result.pathways.some((pathway) => pathway.commercial), false);
    assert.equal(/alcohol|withdrawal|detox/i.test(JSON.stringify(result.safety)), false);
  }
});

test("ADHD results cannot diagnose and weak developmental or multi-setting evidence creates explicit uncertainty", () => {
  const definition = getActiveDefinition("adhd");
  const result = evaluateAssessment(definition, validateAnswers(definition, completeAnswers("adhd", {
    "asrs-1": "often", "asrs-2": "often", "asrs-3": "often", "asrs-4": "sometimes",
    "adhd-childhood": "no", "adhd-settings": "one", "adhd-functioning": "mild",
  })));
  assert.equal(result.instrument?.band, "ASRS screening threshold reached");
  assert.equal(result.interpretation.keyPatterns[0]?.id, "adhd.context-uncertain.v2");
  assert.match(result.interpretation.keyPatterns[0]?.statement ?? "", /before concluding that ADHD is the explanation/i);
  assert.equal(result.interpretation.limitations.includes("A screening result cannot diagnose ADHD."), true);
  assert.equal(/you have ADHD|diagnosis of ADHD/i.test(JSON.stringify(result)), false);
});

test("adult eligibility is public, under-18 submissions are rejected and no paediatric scoring is attempted", () => {
  for (const key of PHASE_C_KEYS) {
    const definition = getActiveDefinition(key);
    const publicDefinition = toPublicDefinition(definition);
    assert.equal(publicDefinition.eligibility?.questionId, "age-eligibility");
    assert.throws(
      () => validateAnswers(definition, { "age-eligibility": "under-18" }),
      (error: unknown) => error instanceof AssessmentValidationError
        && error.issues.some((issue) => issue.field === "answers.age-eligibility" && /cannot accept or score/i.test(issue.message)),
    );
  }
});

test("the 26-fixture Clinical Director pack is complete and every expected mapping holds", () => {
  const materialised = materialisePhaseCClinicalFixtures();
  assert.equal(materialised.length, 26);
  assert.equal(phaseCClinicalFixtures.filter((fixture) => fixture.assessmentKey === "anxiety").length, 8);
  assert.equal(phaseCClinicalFixtures.filter((fixture) => fixture.assessmentKey === "depression").length, 9);
  assert.equal(phaseCClinicalFixtures.filter((fixture) => fixture.assessmentKey === "adhd").length, 9);
  for (const fixture of materialised) {
    const expected = fixture.expectedReviewAssertions;
    assert.equal(fixture.approvalStatus, "CLINICAL DIRECTOR APPROVED 30 AUGUST 2026");
    assert.equal(fixture.validatedInstrumentResult?.rawScore, expected.score, fixture.fixtureId);
    assert.equal(fixture.validatedInstrumentResult?.band, expected.band, fixture.fixtureId);
    assert.equal(fixture.safetyAction, expected.safetyAction, fixture.fixtureId);
    const contentIds = new Set(fixture.requiredContent.map((content) => content.id));
    for (const contentId of expected.requiredContentIds) assert.equal(contentIds.has(contentId), true, fixture.fixtureId);
    if (expected.requireCommercialSuppression) assert.equal(fixture.pathways.some((pathway) => pathway.commercial), false, fixture.fixtureId);
    if (expected.requiredFindingId) assert.equal(fixture.deterministicFindings.some((finding) => finding.id === expected.requiredFindingId), true, fixture.fixtureId);
    assert.ok(Object.keys(fixture.exactSyntheticAnswers).length > 0);
    assert.ok(fixture.contextualDomains.length > 0);
    assert.ok(fixture.pathways.length > 0);
    assert.ok(fixture.prohibitedContent.length > 0);
  }
});

test("Phase C anonymous results, secure recovery and optional contact permissions remain independent", async () => {
  const persistence = new PhaseCMemoryPersistence();
  let emailAttempts = 0;
  let irnOsAttempts = 0;
  const deliveries: AssessmentDeliveryHandlers = {
    async email() { emailAttempts += 1; },
    async irnOs() { irnOsAttempts += 1; },
  };
  const outcome = await submitAssessment(submission("depression"), { persistence, deliveries });
  assert.deepEqual(outcome.result.delivery, { email: "not-requested", irnOs: "not-requested" });
  assert.equal(emailAttempts, 0);
  assert.equal(irnOsAttempts, 0);
  assert.equal(outcome.result.instrument?.name, "PHQ-9");
  assert.ok(await recoverAssessment(outcome.accessToken, persistence));

  const request = parseAssessmentContactRequest({
    email: "phase-c@example.test",
    permissions: { emailResult: true, irnFollowUp: false, marketing: true },
  });
  const contacted = await requestAssessmentContact(outcome.accessToken, request, persistence, deliveries);
  assert.equal(contacted?.result.delivery.email, "sent");
  assert.equal(contacted?.result.delivery.irnOs, "not-requested");
  assert.equal(persistence.contactRequests[0]?.permissions.emailResult, true);
  assert.equal(persistence.contactRequests[0]?.permissions.irnFollowUp, false);
  assert.equal(persistence.contactRequests[0]?.permissions.marketing, true);
  assert.equal(emailAttempts, 1);
  assert.equal(irnOsAttempts, 0);
});

test("the server remains authoritative and AI-disabled Phase C results remain complete", async () => {
  const persistence = new PhaseCMemoryPersistence();
  const outcome = await submitAssessment(submission("anxiety", gadAnswers(5)), {
    persistence,
    deliveries: successfulDeliveries,
  });
  assert.equal(outcome.result.instrument?.rawScore, 5);
  assert.notEqual(outcome.result.screening.value, 999999);
  assert.notEqual(outcome.result.screening.label, "Forged emergency result");
  assert.equal(outcome.result.aiEnhancement.status, disabledAiEnhancement().status);
  assert.ok(outcome.result.interpretation.summary);
  assert.ok(outcome.result.pathways.length > 0);
});

test("all Phase B definitions and clinical fixtures remain available without Phase C mutation", () => {
  for (const key of ["alcohol-use", "alcohol-detox", "drug-use", "detox-suitability"] as const) {
    const definition = getActiveDefinition(key);
    assert.equal(definition.version, 2);
    assert.equal(definition.engineVersion, "phase-b-v2");
    assert.equal(definition.instrument, null);
    assert.equal(definition.scoring.kind, "irn-descriptive-profile");
  }
});

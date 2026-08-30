import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import type {
  AssessmentAnswers,
  AssessmentContactRequest,
  AssessmentKey,
} from "../assessment-engine/contracts.ts";
import { parseAssessmentContactRequest } from "../assessment-engine/assessment-contact.ts";
import { assessmentDeliveryHandlers } from "../assessment-engine/assessment-delivery.ts";
import {
  materialisePhaseBClinicalFixtures,
  phaseBClinicalFixtures,
} from "../assessment-engine/phase-b-clinical-fixtures.ts";
import { phaseBInstrumentPermissionDecision } from "../assessment-engine/phase-b-substance-definitions-v2.ts";
import { questionIsApplicable } from "../assessment-engine/branching.ts";
import { evaluateAssessment } from "../assessment-engine/evaluate.ts";
import { getActiveDefinition } from "../assessment-engine/registry.ts";
import {
  recoverAssessment,
  requestAssessmentContact,
  submitAssessment,
  type AssessmentDeliveryHandlers,
  type AssessmentPersistence,
  type StoredAssessmentResult,
} from "../assessment-engine/assessment-service.ts";
import {
  AssessmentValidationError,
  validateAnswers,
} from "../assessment-engine/validate-answers.ts";

type PhaseBKey = Extract<AssessmentKey, "alcohol-use" | "alcohol-detox" | "drug-use" | "detox-suitability">;

const PHASE_B_KEYS: PhaseBKey[] = ["alcohol-use", "alcohol-detox", "drug-use", "detox-suitability"];
let submissionCounter = 100;

function completeAnswers(key: PhaseBKey, overrides: AssessmentAnswers = {}): AssessmentAnswers {
  const definition = getActiveDefinition(key);
  const answers: AssessmentAnswers = { ...overrides };
  for (let pass = 0; pass < 5; pass += 1) {
    for (const section of definition.sections) {
      for (const question of section.questions) {
        if (answers[question.id] !== undefined || !question.required || !questionIsApplicable(section, question, answers)) continue;
        if (question.options?.length) {
          const selected = [...question.options].sort((a, b) => a.score - b.score)[0]!;
          answers[question.id] = question.type === "checkbox" ? [selected.value] : selected.value;
        } else {
          answers[question.id] = "Synthetic response";
        }
      }
    }
  }
  return answers;
}

function submission(key: PhaseBKey, overrides: AssessmentAnswers = {}) {
  submissionCounter += 1;
  return {
    assessmentKey: key,
    definitionVersion: getActiveDefinition(key).version,
    submissionKey: `00000000-0000-4000-8000-${String(submissionCounter).padStart(12, "0")}`,
    answers: completeAnswers(key, overrides),
  };
}

class PhaseBMemoryPersistence implements AssessmentPersistence {
  createCount = 0;
  contactRequests: AssessmentContactRequest[] = [];
  private records = new Map<string, StoredAssessmentResult>();
  private bySubmission = new Map<string, string>();
  private byTokenHash = new Map<string, string>();

  async findBySubmissionKey(submissionKey: string) {
    const id = this.bySubmission.get(submissionKey);
    return id ? this.records.get(id) ?? null : null;
  }

  async create(record: StoredAssessmentResult, accessTokenHash: string) {
    const existing = await this.findBySubmissionKey(record.submission.submissionKey);
    if (existing) return { record: existing, created: false };
    this.createCount += 1;
    const stored = { ...record, storageId: String(this.createCount) };
    this.records.set(stored.storageId, stored);
    this.bySubmission.set(stored.submission.submissionKey, stored.storageId);
    this.byTokenHash.set(accessTokenHash, stored.storageId);
    return { record: stored, created: true };
  }

  async rotateAccessToken(storageId: string, accessTokenHash: string) {
    for (const [hash, id] of this.byTokenHash) if (id === storageId) this.byTokenHash.delete(hash);
    this.byTokenHash.set(accessTokenHash, storageId);
  }

  async findByAccessTokenHash(accessTokenHash: string) {
    const id = this.byTokenHash.get(accessTokenHash);
    return id ? this.records.get(id) ?? null : null;
  }

  async updateDelivery(storageId: string, channel: "email" | "irn_os", status: "sent" | "forwarded" | "failed") {
    const record = this.records.get(storageId);
    if (!record) return;
    const result = {
      ...record.result,
      delivery: {
        ...record.result.delivery,
        ...(channel === "email" ? { email: status as "sent" | "failed" } : { irnOs: status as "forwarded" | "failed" }),
      },
    };
    this.records.set(storageId, { ...record, result });
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
          email: request.permissions.emailResult && record.result.delivery.email !== "sent"
            ? "queued"
            : record.result.delivery.email,
          irnOs: request.permissions.irnFollowUp && record.result.delivery.irnOs !== "forwarded"
            ? "queued"
            : record.result.delivery.irnOs,
        },
      },
    };
    this.records.set(storageId, updated);
    return updated;
  }
}

test("Phase B activates only the four authorised substance assessment definitions", () => {
  for (const key of PHASE_B_KEYS) {
    const definition = getActiveDefinition(key);
    assert.equal(definition.version, 2);
    assert.equal(definition.engineVersion, "phase-b-v2");
    assert.equal(definition.clinicalApproval.status, "pending-clinical-director");
  }
  for (const key of ["anxiety", "depression", "adhd"] as const) {
    assert.equal(getActiveDefinition(key).version, 1);
  }
});

test("unconfirmed WHO permissions result in truthful IRN descriptive profiles with no combined total", () => {
  assert.match(phaseBInstrumentPermissionDecision.audit, /permission/i);
  assert.match(phaseBInstrumentPermissionDecision.assist, /permission/i);
  for (const key of PHASE_B_KEYS) {
    const definition = getActiveDefinition(key);
    assert.equal(definition.instrument, null);
    assert.equal(definition.scoring.kind, "irn-descriptive-profile");
    const result = evaluateAssessment(definition, validateAnswers(definition, completeAnswers(key)));
    assert.equal(result.screening.source, "irn-descriptive-profile");
    assert.equal(result.screening.value, null);
    assert.equal(result.screening.maximumValue, null);
    assert.equal(result.screening.displayScore, false);
    assert.equal(result.interpretation.summary.includes("total score alone"), false);
  }
});

test("substance branching requires selected branches and rejects contradictory hidden answers", () => {
  const definition = getActiveDefinition("detox-suitability");
  const cannabis = completeAnswers("detox-suitability", { substances: ["cannabis"] });
  const validatedCannabis = validateAnswers(definition, cannabis);
  assert.equal("substance-opioid-frequency" in validatedCannabis, false);

  const opioids = validateAnswers(definition, completeAnswers("detox-suitability", { substances: ["opioids"] }));
  assert.equal(typeof opioids["substance-opioid-frequency"], "string");
  assert.throws(
    () => validateAnswers(definition, {
      ...cannabis,
      "substance-opioid-overdose-history": "yes",
    }),
    (error: unknown) => error instanceof AssessmentValidationError
      && error.issues.some((issue) => issue.field === "answers.substance-opioid-overdose-history"),
  );
});

test("general detox handles conflicting abrupt-change answers conservatively", () => {
  const definition = getActiveDefinition("detox-suitability");
  const result = evaluateAssessment(definition, validateAnswers(definition, completeAnswers("detox-suitability", {
    substances: ["benzodiazepines"],
    "intended-change": "abrupt",
    "substance-benz-frequency": "daily",
    "substance-benz-abrupt": "no",
  })));
  assert.equal(result.safety.action, "clinical-review-recommended");
  assert.equal(result.safety.content.some((content) => content.id === "benzodiazepine-withdrawal-review"), true);
});

test("independent alcohol safety can override a low profile while exposure alone is not an emergency", () => {
  const definition = getActiveDefinition("alcohol-use");
  const historicalSeizure = evaluateAssessment(
    definition,
    validateAnswers(definition, completeAnswers("alcohol-use", { "alcohol-prior-seizure": "yes" })),
  );
  assert.equal(historicalSeizure.screening.value, null);
  assert.equal(historicalSeizure.safety.action, "clinical-review-recommended");
  assert.ok(historicalSeizure.safety.content.some((item) => item.id === "alcohol-withdrawal-review"));

  const prominentExposure = evaluateAssessment(definition, validateAnswers(definition, completeAnswers("alcohol-use", {
    "alcohol-frequency": "four-plus-week",
    "alcohol-quantity": "ten-plus",
    "alcohol-heavy-occasion": "daily-or-almost-daily",
  })));
  assert.notEqual(prominentExposure.safety.action, "emergency-help-now");
  assert.equal(prominentExposure.safety.content.some((item) => item.id === "alcohol-withdrawal-emergency"), false);
});

test("substance-specific safety content does not leak an unrelated withdrawal model", () => {
  const cases: Array<{ key: PhaseBKey; overrides: AssessmentAnswers; required: string; prohibited: string[] }> = [
    { key: "drug-use", overrides: { substances: ["benzodiazepines"], "substance-benz-frequency": "daily", "substance-benz-abrupt": "yes" }, required: "benzodiazepine-withdrawal-review", prohibited: ["alcohol-withdrawal-urgent"] },
    { key: "drug-use", overrides: { substances: ["opioids"], "substance-opioid-overdose-now": "unresponsive" }, required: "opioid-overdose-emergency", prohibited: ["alcohol-withdrawal-urgent", "withdrawal-urgent"] },
    { key: "drug-use", overrides: { substances: ["opioids"], "substance-opioid-recent-abstinence": "yes", "substance-opioid-reduced-tolerance": "no" }, required: "opioid-tolerance-review", prohibited: ["alcohol-withdrawal-urgent"] },
    { key: "drug-use", overrides: { substances: ["stimulants"], "substance-stimulant-acute": "psychosis" }, required: "stimulant-urgent", prohibited: ["alcohol-withdrawal-urgent", "benzodiazepine-withdrawal-urgent"] },
    { key: "detox-suitability", overrides: { substances: ["cannabis"], "substance-cannabis-psychological": "significant" }, required: "cannabis-support-review", prohibited: ["alcohol-withdrawal-urgent", "withdrawal-urgent"] },
    { key: "detox-suitability", overrides: { substances: ["ketamine"], "substance-ketamine-urinary": "significant" }, required: "ketamine-urinary-review", prohibited: ["alcohol-withdrawal-urgent", "withdrawal-urgent"] },
    { key: "detox-suitability", overrides: { substances: ["ghb-gbl"], "substance-ghb-withdrawal": "significant" }, required: "ghb-gbl-withdrawal-urgent", prohibited: ["alcohol-withdrawal-urgent"] },
  ];
  for (const item of cases) {
    const definition = getActiveDefinition(item.key);
    const result = evaluateAssessment(definition, validateAnswers(definition, completeAnswers(item.key, item.overrides)));
    const contentIds = new Set(result.safety.content.map((content) => content.id));
    assert.equal(contentIds.has(item.required as never), true, `${item.key} should include ${item.required}`);
    for (const prohibited of item.prohibited) assert.equal(contentIds.has(prohibited as never), false, `${item.key} should not include ${prohibited}`);
  }
});

test("current acute substance emergencies prioritise 999 and suppress every IRN pathway", () => {
  const cases: Array<{ key: PhaseBKey; overrides: AssessmentAnswers; contentId: string }> = [
    { key: "alcohol-use", overrides: { "alcohol-current-withdrawal": "severe" }, contentId: "alcohol-withdrawal-emergency" },
    { key: "drug-use", overrides: { substances: ["benzodiazepines"], "substance-benz-withdrawal": "severe" }, contentId: "benzodiazepine-withdrawal-emergency" },
    { key: "drug-use", overrides: { substances: ["ghb-gbl"], "substance-ghb-withdrawal": "severe" }, contentId: "ghb-gbl-withdrawal-emergency" },
    { key: "drug-use", overrides: { substances: ["stimulants"], "substance-stimulant-acute": "severe-agitation" }, contentId: "stimulant-emergency" },
  ];
  for (const item of cases) {
    const definition = getActiveDefinition(item.key);
    const result = evaluateAssessment(definition, validateAnswers(definition, completeAnswers(item.key, item.overrides)));
    assert.equal(result.safety.action, "emergency-help-now", item.key);
    assert.equal(result.safety.suppressCommercialCtas, true, item.key);
    assert.equal(result.safety.content.some((content) => content.id === item.contentId), true, item.key);
    assert.equal(result.pathways.some((pathway) => pathway.id === "emergency-999"), true, item.key);
    assert.equal(result.pathways.some((pathway) => pathway.commercial), false, item.key);
    assert.equal(result.pathways.some((pathway) => pathway.destination.startsWith("/")), false, item.key);
  }
});

test("the shared self-harm module remains separate and suppresses commercial crisis messaging", () => {
  for (const key of PHASE_B_KEYS) {
    const definition = getActiveDefinition(key);
    const overrides: AssessmentAnswers = key === "drug-use" || key === "detox-suitability"
      ? { substances: ["cannabis"], "mental-health": "yes-self-harm" }
      : { "mental-health": "yes-self-harm" };
    const result = evaluateAssessment(definition, validateAnswers(definition, completeAnswers(key, overrides)));
    assert.equal(result.safety.action, "urgent-same-day-assessment");
    assert.ok(result.safety.content.some((item) => item.id === "mental-health-urgent"));
    assert.equal(result.pathways.some((pathway) => pathway.commercial), false);
    if (key === "drug-use" || key === "detox-suitability") {
      assert.equal(result.safety.content.some((item) => item.id.startsWith("alcohol-")), false);
    }
  }
});

test("the Clinical Director fixture pack covers every required profile and enforces its assertions", () => {
  const materialised = materialisePhaseBClinicalFixtures();
  assert.equal(materialised.length, 41);
  assert.equal(phaseBClinicalFixtures.filter((fixture) => fixture.assessmentKey === "alcohol-use").length, 9);
  assert.equal(phaseBClinicalFixtures.filter((fixture) => fixture.assessmentKey === "alcohol-detox").length, 9);
  assert.equal(phaseBClinicalFixtures.filter((fixture) => fixture.assessmentKey === "drug-use").length, 11);
  assert.equal(phaseBClinicalFixtures.filter((fixture) => fixture.assessmentKey === "detox-suitability").length, 12);

  for (const fixture of materialised) {
    assert.equal(fixture.approvalStatus, "PENDING CLINICAL DIRECTOR APPROVAL");
    assert.ok(Object.keys(fixture.exactSyntheticAnswers).length > 0);
    assert.equal(fixture.validatedInstrumentResult, null);
    const expected = fixture.expectedReviewAssertions;
    if (expected.validationErrorField) {
      assert.equal(fixture.validation.status, "rejected");
      assert.ok(fixture.validation.issues.some((issue) => issue.field === expected.validationErrorField));
      continue;
    }
    assert.equal(fixture.validation.status, "accepted");
    assert.ok(fixture.domainProfile.length > 0);
    assert.ok(fixture.deterministicInterpretation);
    assert.ok(fixture.pathways.length > 0);
    if (expected.safetyAction) assert.equal(fixture.safetyAction, expected.safetyAction, fixture.fixtureId);
    const contentIds = new Set(fixture.requiredContent.map((content) => content.id));
    for (const id of expected.requiredContentIds ?? []) assert.equal(contentIds.has(id), true, fixture.fixtureId);
    for (const id of expected.prohibitedContentIds ?? []) assert.equal(contentIds.has(id), false, fixture.fixtureId);
    if (expected.requireCommercialSuppression) {
      assert.equal(fixture.pathways.some((pathway) => pathway.commercial), false, fixture.fixtureId);
    }
  }
});

test("anonymous results are durable and do not trigger contact delivery", async () => {
  const persistence = new PhaseBMemoryPersistence();
  let emailAttempts = 0;
  let irnOsAttempts = 0;
  const outcome = await submitAssessment(submission("drug-use", { substances: ["cannabis"] }), {
    persistence,
    deliveries: {
      async email() { emailAttempts += 1; },
      async irnOs() { irnOsAttempts += 1; },
    },
  });
  assert.equal(outcome.result.persistence.status, "saved");
  assert.deepEqual(outcome.result.delivery, { email: "not-requested", irnOs: "not-requested" });
  assert.equal(emailAttempts, 0);
  assert.equal(irnOsAttempts, 0);
  const recovered = await recoverAssessment(outcome.accessToken, persistence);
  assert.ok(recovered);
  assert.deepEqual(recovered.contact, {});
});

test("post-result email, follow-up and marketing permissions remain independent", async () => {
  const persistence = new PhaseBMemoryPersistence();
  let emailAttempts = 0;
  let irnOsAttempts = 0;
  const deliveries: AssessmentDeliveryHandlers = {
    async email() { emailAttempts += 1; },
    async irnOs() { irnOsAttempts += 1; },
  };
  const emailOnly = await submitAssessment(submission("alcohol-use"), { persistence, deliveries });
  const emailRequest = parseAssessmentContactRequest({
    email: "synthetic@example.test",
    permissions: { emailResult: true, irnFollowUp: false, marketing: false },
  });
  const emailed = await requestAssessmentContact(emailOnly.accessToken, emailRequest, persistence, deliveries);
  assert.equal(emailed?.result.delivery.email, "sent");
  assert.equal(emailed?.result.delivery.irnOs, "not-requested");
  assert.equal(emailAttempts, 1);
  assert.equal(irnOsAttempts, 0);

  const marketingOnly = await submitAssessment(submission("drug-use", { substances: ["cannabis"] }), { persistence, deliveries });
  const marketingRequest = parseAssessmentContactRequest({
    email: "marketing@example.test",
    permissions: { emailResult: false, irnFollowUp: false, marketing: true },
  });
  const marketing = await requestAssessmentContact(marketingOnly.accessToken, marketingRequest, persistence, deliveries);
  assert.deepEqual(marketing?.result.delivery, { email: "not-requested", irnOs: "not-requested" });
  assert.equal(emailAttempts, 1);
  assert.equal(irnOsAttempts, 0);
  assert.equal(persistence.contactRequests.at(-1)?.permissions.marketing, true);
  assert.equal(persistence.contactRequests.at(-1)?.permissions.emailResult, false);
  assert.equal(persistence.contactRequests.at(-1)?.permissions.irnFollowUp, false);
});

test("post-result delivery failure never removes the saved anonymous result", async () => {
  const persistence = new PhaseBMemoryPersistence();
  const deliveries: AssessmentDeliveryHandlers = {
    async email() { throw new Error("Synthetic email failure"); },
    async irnOs() {},
  };
  const outcome = await submitAssessment(submission("alcohol-detox"), { persistence, deliveries });
  const request = parseAssessmentContactRequest({
    email: "synthetic@example.test",
    permissions: { emailResult: true, irnFollowUp: false, marketing: false },
  });
  const contacted = await requestAssessmentContact(outcome.accessToken, request, persistence, deliveries);
  assert.equal(contacted?.result.persistence.status, "saved");
  assert.equal(contacted?.result.delivery.email, "failed");
  assert.ok(await recoverAssessment(outcome.accessToken, persistence));
});

test("the additive Phase B migration preserves existing assessment records", async () => {
  const migration = await readFile(
    new URL("../../../../lib/db/migrations/20260830_assessment_phase_b.sql", import.meta.url),
    "utf8",
  );
  assert.equal(/\bDROP\s+(?:TABLE|COLUMN)\b/i.test(migration), false);
  assert.match(migration, /ALTER COLUMN "name" DROP NOT NULL/);
  assert.match(migration, /ALTER COLUMN "email" DROP NOT NULL/);
  assert.match(migration, /ALTER COLUMN "score_value" DROP NOT NULL/);
  for (const column of ["result_email_requested", "irn_follow_up_requested", "marketing_consent"]) {
    assert.match(migration, new RegExp(`ADD COLUMN IF NOT EXISTS "${column}"`));
  }
});

test("IRNOS receives explicit follow-up permission and never receives raw answers", async () => {
  const persistence = new PhaseBMemoryPersistence();
  const outcome = await submitAssessment(submission("drug-use", { substances: ["cannabis"] }), {
    persistence,
    deliveries: { async email() {}, async irnOs() {} },
  });
  const request = parseAssessmentContactRequest({
    name: "Synthetic Test Person",
    email: "synthetic@example.test",
    permissions: { emailResult: false, irnFollowUp: true, marketing: false },
  });
  const recovered = await recoverAssessment(outcome.accessToken, persistence);
  assert.ok(recovered);
  const queued = await persistence.requestContact(recovered.storageId, request);

  const originalFetch = globalThis.fetch;
  const originalEndpoint = process.env.IRN_OS_LEAD_ENDPOINT;
  const originalKey = process.env.IRN_OS_LEAD_API_KEY;
  let forwardedBody: Record<string, unknown> | null = null;
  process.env.IRN_OS_LEAD_ENDPOINT = "https://synthetic.invalid/leads";
  process.env.IRN_OS_LEAD_API_KEY = "synthetic-test-key";
  globalThis.fetch = (async (_input: string | URL | Request, init?: RequestInit) => {
    forwardedBody = JSON.parse(String(init?.body)) as Record<string, unknown>;
    return new Response(JSON.stringify({ leadId: "synthetic-lead" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }) as typeof fetch;
  try {
    await assessmentDeliveryHandlers.irnOs(queued);
    const capturedBody = forwardedBody as Record<string, unknown> | null;
    assert.equal(capturedBody?.["consent"], true);
    assert.equal(capturedBody?.["answers"], undefined);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalEndpoint === undefined) delete process.env.IRN_OS_LEAD_ENDPOINT;
    else process.env.IRN_OS_LEAD_ENDPOINT = originalEndpoint;
    if (originalKey === undefined) delete process.env.IRN_OS_LEAD_API_KEY;
    else process.env.IRN_OS_LEAD_API_KEY = originalKey;
  }
});

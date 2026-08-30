import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import type {
  AssessmentAnswers,
  AssessmentDefinition,
  AssessmentKey,
} from "../assessment-engine/contracts.ts";
import { disabledAiEnhancement } from "../assessment-engine/assessment-ai.ts";
import { evaluateAssessment } from "../assessment-engine/evaluate.ts";
import { evaluateInstrument } from "../assessment-engine/evaluate-instrument.ts";
import { evaluateSafety } from "../assessment-engine/evaluate-safety.ts";
import {
  getActiveDefinition,
  listActiveDefinitions,
  toPublicDefinition,
} from "../assessment-engine/registry.ts";
import {
  createResultAccessToken,
  hashResultAccessToken,
} from "../assessment-engine/result-access.ts";
import {
  recoverAssessment,
  submitAssessment,
  type AssessmentDeliveryHandlers,
  type AssessmentPersistence,
  type StoredAssessmentResult,
} from "../assessment-engine/assessment-service.ts";
import {
  AssessmentValidationError,
  parseSubmissionPayload,
  validateAnswers,
} from "../assessment-engine/validate-answers.ts";

const KEYS: AssessmentKey[] = [
  "alcohol-use",
  "alcohol-detox",
  "drug-use",
  "detox-suitability",
  "anxiety",
  "depression",
  "adhd",
];

let keyCounter = 0;

function lowestAnswers(key: AssessmentKey, overrides: AssessmentAnswers = {}): AssessmentAnswers {
  const definition = getActiveDefinition(key);
  const answers: AssessmentAnswers = {};
  for (const question of definition.sections.flatMap((section) => section.questions)) {
    if (question.id === "name") answers[question.id] = "Synthetic Test Person";
    else if (question.id === "email") answers[question.id] = "synthetic@example.test";
    else if (question.type === "tel") continue;
    else if (question.options?.length) {
      const option = [...question.options].sort((a, b) => a.score - b.score)[0]!;
      answers[question.id] = question.type === "checkbox" ? [option.value] : option.value;
    } else if (question.required) answers[question.id] = "Synthetic response";
  }
  return { ...answers, ...overrides };
}

function payload(key: AssessmentKey, overrides: Record<string, unknown> = {}) {
  keyCounter += 1;
  return {
    assessmentKey: key,
    definitionVersion: 1,
    submissionKey: `00000000-0000-4000-8000-${String(keyCounter).padStart(12, "0")}`,
    answers: lowestAnswers(key),
    consent: true,
    ...overrides,
  };
}

class MemoryPersistence implements AssessmentPersistence {
  createCount = 0;
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
    for (const [hash, id] of this.byTokenHash) {
      if (id === storageId) this.byTokenHash.delete(hash);
    }
    this.byTokenHash.set(accessTokenHash, storageId);
  }

  async findByAccessTokenHash(accessTokenHash: string) {
    const id = this.byTokenHash.get(accessTokenHash);
    return id ? this.records.get(id) ?? null : null;
  }

  async updateDelivery(
    storageId: string,
    channel: "email" | "irn_os",
    status: "sent" | "forwarded" | "failed",
  ) {
    const record = this.records.get(storageId);
    if (!record) return;
    const result = {
      ...record.result,
      delivery: {
        ...record.result.delivery,
        ...(channel === "email"
          ? { email: status as "sent" | "failed" }
          : { irnOs: status as "forwarded" | "failed" }),
      },
    };
    this.records.set(storageId, { ...record, result });
  }

  async markCtaClicked() {}
}

const successfulDeliveries: AssessmentDeliveryHandlers = {
  async email() {},
  async irnOs() {},
};

function authoritative(raw: unknown) {
  const { definition, submission } = parseSubmissionPayload(raw);
  return evaluateAssessment(definition, submission.answers);
}

test("1 forged browser score is ignored", () => {
  const result = authoritative(payload("anxiety", { scoreValue: 999_999 }));
  assert.notEqual(result.screening.value, 999_999);
});

test("2 forged browser band is ignored", () => {
  const result = authoritative(payload("anxiety", { scoreLevel: "emergency", bandName: "Forged band" }));
  assert.notEqual(result.screening.label, "Forged band");
  assert.notEqual(result.screening.level, "emergency");
});

test("3 forged browser flags are ignored", () => {
  const result = authoritative(payload("anxiety", { redFlags: ["forged-emergency"] }));
  assert.equal(result.safety.triggeredRules.some((rule) => rule.id === "forged-emergency"), false);
});

test("4 forged clinical brief is ignored", () => {
  const result = authoritative(payload("anxiety", { clinicalBrief: "FORGED CLINICAL BRIEF" }));
  assert.equal(JSON.stringify(result.interpretation).includes("FORGED CLINICAL BRIEF"), false);
});

test("5 unknown questions and answer options are rejected", () => {
  assert.throws(
    () => authoritative(payload("anxiety", { answers: { ...lowestAnswers("anxiety"), injected: "yes" } })),
    AssessmentValidationError,
  );
  assert.throws(
    () => authoritative(payload("anxiety", { answers: { ...lowestAnswers("anxiety"), anxiousness: "not-an-option" } })),
    AssessmentValidationError,
  );
});

test("6 idempotency prevents duplicate results and duplicate successful deliveries", async () => {
  const persistence = new MemoryPersistence();
  let emails = 0;
  let forwards = 0;
  const deliveries: AssessmentDeliveryHandlers = {
    async email() { emails += 1; },
    async irnOs() { forwards += 1; },
  };
  const raw = payload("depression");
  const first = await submitAssessment(raw, { persistence, deliveries });
  const second = await submitAssessment(raw, { persistence, deliveries });
  assert.equal(first.created, true);
  assert.equal(second.created, false);
  assert.equal(first.result.resultId, second.result.resultId);
  assert.equal(persistence.createCount, 1);
  assert.equal(emails, 1);
  assert.equal(forwards, 1);
});

test("7 safety is evaluated independently from screening severity", () => {
  const definition = getActiveDefinition("anxiety");
  const answers = lowestAnswers("anxiety", { "self-harm": "yes-significant" });
  const screening = evaluateInstrument(definition, answers);
  const safety = evaluateSafety(definition, answers);
  assert.equal(typeof screening.value, "number");
  assert.equal(safety.action, "urgent-same-day-assessment");
  assert.notEqual(safety.action, screening.level);
});

test("8 serious safety action cannot be downgraded by otherwise low-severity answers", () => {
  const result = authoritative(payload("depression", {
    answers: lowestAnswers("depression", { "self-harm": "yes-significant" }),
  }));
  assert.equal(result.safety.action, "urgent-same-day-assessment");
});

for (const [number, key] of [[9, "anxiety"], [10, "depression"], [11, "adhd"]] as const) {
  test(`${number} ${key} self-harm cannot produce alcohol advice`, () => {
    const questionId = key === "adhd" ? "mental-health" : "self-harm";
    const value = key === "adhd" ? "yes-self-harm" : "yes-significant";
    const result = authoritative(payload(key, { answers: lowestAnswers(key, { [questionId]: value }) }));
    assert.equal(result.safety.content.some((item) => item.id.startsWith("alcohol-")), false);
    assert.equal(JSON.stringify(result.safety).toLowerCase().includes("stopping drinking"), false);
  });
}

test("12 alcohol content cannot appear without alcohol context and does appear for an alcohol rule", () => {
  for (const key of ["drug-use", "detox-suitability", "anxiety", "depression", "adhd"] as const) {
    const result = authoritative(payload(key));
    assert.equal(result.safety.content.some((item) => item.id.startsWith("alcohol-")), false);
  }
  const alcohol = authoritative(payload("alcohol-detox", {
    answers: lowestAnswers("alcohol-detox", { "withdrawal-symptoms": "yes-severe" }),
  }));
  assert.equal(alcohol.safety.content.some((item) => item.id === "alcohol-withdrawal-urgent"), true);
});

test("13 emergency presentation suppresses commercial CTAs", () => {
  const base = getActiveDefinition("anxiety");
  const definition: AssessmentDefinition = {
    ...base,
    safetyRules: [
      ...base.safetyRules,
      {
        id: "fixture.immediate-danger",
        version: 1,
        action: "emergency-help-now",
        all: [{ questionId: "self-harm", equals: "yes-significant" }],
        evidenceQuestionIds: ["self-harm"],
        contentId: "mental-health-emergency",
        pathwayIds: ["emergency-999"],
        suppressCommercialCtas: true,
        approval: { status: "pending-clinical-director", reference: "synthetic-fixture" },
      },
    ],
  };
  const result = evaluateAssessment(definition, lowestAnswers("anxiety", { "self-harm": "yes-significant" }));
  assert.equal(result.safety.action, "emergency-help-now");
  assert.equal(result.pathways.some((pathway) => pathway.commercial), false);
  assert.equal(result.pathways.some((pathway) => pathway.id === "emergency-999"), true);
});

test("14 unavailable AI still produces a complete deterministic result", () => {
  const result = authoritative(payload("alcohol-use"));
  assert.equal(disabledAiEnhancement().status, "disabled");
  assert.ok(result.interpretation.summary);
  assert.ok(result.domains.length > 0);
  assert.ok(result.pathways.length > 0);
});

test("15 email failure preserves the saved result", async () => {
  const persistence = new MemoryPersistence();
  const result = await submitAssessment(payload("anxiety"), {
    persistence,
    deliveries: {
      async email() { throw new Error("synthetic email failure"); },
      async irnOs() {},
    },
  });
  assert.equal(result.result.persistence.status, "saved");
  assert.equal(result.result.delivery.email, "failed");
  assert.ok(await recoverAssessment(result.accessToken, persistence));
});

test("16 IRNOS failure preserves the saved result", async () => {
  const persistence = new MemoryPersistence();
  const result = await submitAssessment(payload("anxiety"), {
    persistence,
    deliveries: {
      async email() {},
      async irnOs() { throw new Error("synthetic IRNOS failure"); },
    },
  });
  assert.equal(result.result.persistence.status, "saved");
  assert.equal(result.result.delivery.irnOs, "failed");
  assert.ok(await recoverAssessment(result.accessToken, persistence));
});

test("17 idempotent retry recovers a durable result after a lost response", async () => {
  const persistence = new MemoryPersistence();
  const raw = payload("adhd");
  const lostResponse = await submitAssessment(raw, { persistence, deliveries: successfulDeliveries });
  const retry = await submitAssessment(raw, { persistence, deliveries: successfulDeliveries });
  assert.equal(retry.result.resultId, lostResponse.result.resultId);
  const recovered = await recoverAssessment(retry.accessToken, persistence);
  assert.equal(recovered?.result.resultId, lostResponse.result.resultId);
});

test("18 result access capabilities are opaque, unpredictable and hashed", () => {
  const tokens = new Set(Array.from({ length: 200 }, createResultAccessToken));
  assert.equal(tokens.size, 200);
  for (const token of tokens) {
    assert.ok(token.length >= 40);
    const hash = hashResultAccessToken(token);
    assert.match(hash, /^[a-f0-9]{64}$/);
    assert.notEqual(hash, token);
  }
});

test("19 legacy assessment records remain intact under an additive migration", async () => {
  const migration = await readFile(new URL("../../../../lib/db/migrations/20260830_assessment_phase_a.sql", import.meta.url), "utf8");
  const schema = await readFile(new URL("../../../../lib/db/src/schema/assessments.ts", import.meta.url), "utf8");
  assert.equal(/\bDROP\s+(TABLE|COLUMN)\b/i.test(migration), false);
  assert.equal(/UPDATE\s+assessments\s+SET\s+score_/i.test(migration), false);
  assert.match(schema, /default\("legacy-client-v1"\)/);
});

test("20 GA, GTM and Meta do not initialise on assessment journeys despite stored consent", async () => {
  const appended: unknown[] = [];
  const storage = new Map<string, string>([[
    "irn_cookie_consent_v1",
    JSON.stringify({ necessary: true, analytics: true, marketing: true, version: 1, updatedAt: "synthetic" }),
  ]]);
  const originalWindow = (globalThis as { window?: unknown }).window;
  const originalDocument = (globalThis as { document?: unknown }).document;
  (globalThis as { window?: unknown }).window = {
    location: { pathname: "/assessments/anxiety" },
    localStorage: { getItem: (key: string) => storage.get(key) ?? null },
    sessionStorage: { getItem: () => null, setItem: () => undefined },
  };
  (globalThis as { document?: unknown }).document = {
    querySelector: () => null,
    createElement: () => ({}),
    head: { appendChild: (node: unknown) => appended.push(node) },
  };
  try {
    const consentModulePath = "../../../irn-website/src/lib/" + "consent.ts";
    const { initialiseConsent } = await import(consentModulePath) as {
      initialiseConsent: () => void;
    };
    initialiseConsent();
    assert.equal(appended.length, 0);
    const syntheticWindow = (globalThis as unknown as { window: Record<string, unknown> }).window;
    assert.equal("dataLayer" in syntheticWindow, false);
    assert.equal("fbq" in syntheticWindow, false);
  } finally {
    (globalThis as { window?: unknown }).window = originalWindow;
    (globalThis as { document?: unknown }).document = originalDocument;
  }
});

test("21 clinical data and result capabilities are redacted or absent from telemetry", async () => {
  const loggerSource = await readFile(new URL("./logger.ts", import.meta.url), "utf8");
  const routeSource = await readFile(new URL("../routes/assessments.ts", import.meta.url), "utf8");
  for (const key of ["email", "phone", "answers", "clinicalBrief", "safetyAction", "resultToken", "accessToken"]) {
    assert.match(loggerSource, new RegExp(`\\"\\*?\\.?${key}\\"`));
  }
  assert.equal(/res\.(?:json|status\([^)]*\)\.json)\([^)]*accessToken/s.test(routeSource), false);
  assert.match(routeSource, /setResultAccessCookie\(res, outcome\.accessToken\)/);
});

test("22 active definition versions are deeply immutable", () => {
  for (const definition of listActiveDefinitions()) {
    assert.equal(Object.isFrozen(definition), true);
    assert.equal(Object.isFrozen(definition.sections), true);
    assert.equal(Object.isFrozen(definition.sections[0]), true);
    assert.equal(Object.isFrozen(definition.sections[0]?.questions), true);
    assert.equal(Object.isFrozen(definition.safetyRules), true);
  }
});

test("23 active definitions include explicit clinical approval metadata", () => {
  for (const definition of listActiveDefinitions()) {
    assert.equal(definition.status, "active");
    assert.equal(definition.clinicalApproval.status, "approved");
    assert.ok(definition.clinicalApproval.reference);
    for (const rule of [...definition.safetyRules, ...definition.interpretationRules]) {
      assert.ok(rule.approval.reference);
      assert.ok(["approved", "pending-clinical-director"].includes(rule.approval.status));
    }
  }
});

test("every configured answer option validates and evaluates without a gap", () => {
  for (const key of KEYS) {
    const definition = getActiveDefinition(key);
    for (const question of definition.sections.flatMap((section) => section.questions)) {
      for (const option of question.options ?? []) {
        const answers = lowestAnswers(key, {
          [question.id]: question.type === "checkbox" ? [option.value] : option.value,
        });
        const validated = validateAnswers(definition, answers);
        assert.doesNotThrow(() => evaluateAssessment(definition, validated));
      }
    }
  }
});

test("score classification respects each active definition threshold boundary", () => {
  for (const key of KEYS) {
    const definition = getActiveDefinition(key);
    const screening = evaluateInstrument(definition, lowestAnswers(key));
    if (screening.value >= definition.scoring.possibleDetoxRisk) assert.equal(screening.level, "elevated-concern");
    else if (screening.value >= definition.scoring.higherConcern) assert.equal(screening.level, "higher-concern");
    else if (screening.value >= definition.scoring.moderateConcern) assert.equal(screening.level, "moderate-concern");
    else assert.equal(screening.level, "lower-concern");
  }
});

test("public definitions omit scoring and safety implementation", () => {
  for (const definition of listActiveDefinitions()) {
    const publicDefinition = toPublicDefinition(definition);
    const serialised = JSON.stringify(publicDefinition);
    assert.equal(serialised.includes("score"), false);
    assert.equal(serialised.includes("redFlag"), false);
    assert.equal(serialised.includes("safetyRules"), false);
    assert.equal(serialised.includes("interpretationRules"), false);
  }
});

test("every active safety rule references a real question and approved option", () => {
  for (const definition of listActiveDefinitions()) {
    const questions = new Map(
      definition.sections.flatMap((section) => section.questions).map((question) => [question.id, question]),
    );
    for (const rule of definition.safetyRules) {
      for (const condition of [...(rule.all ?? []), ...(rule.any ?? [])]) {
        const question = questions.get(condition.questionId);
        assert.ok(question, `${definition.key}:${rule.id} references an unknown question`);
        const approvedValues = new Set(question.options?.map((option) => option.value) ?? []);
        for (const value of [condition.equals, condition.includes, ...(condition.oneOf ?? [])].filter(Boolean)) {
          assert.equal(
            approvedValues.has(value as string),
            true,
            `${definition.key}:${rule.id} references an unknown answer value`,
          );
        }
      }
    }
  }
});

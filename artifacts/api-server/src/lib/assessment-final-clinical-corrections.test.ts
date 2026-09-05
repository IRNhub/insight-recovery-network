import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { questionIsApplicable } from "../assessment-engine/branching.ts";
import type {
  AssessmentAnswers,
  AssessmentContactRequest,
  AssessmentKey,
} from "../assessment-engine/contracts.ts";
import { evaluateAssessment } from "../assessment-engine/evaluate.ts";
import {
  phaseBClinicalFixtures,
} from "../assessment-engine/phase-b-clinical-fixtures.ts";
import {
  phaseCClinicalFixtures,
} from "../assessment-engine/phase-c-clinical-fixtures.ts";
import { getActiveDefinition, toPublicDefinition } from "../assessment-engine/registry.ts";
import {
  recoverAssessment,
  submitAssessment,
  type AssessmentPersistence,
  type StoredAssessmentResult,
} from "../assessment-engine/assessment-service.ts";
import { validateAnswers } from "../assessment-engine/validate-answers.ts";

const ASSESSMENT_KEYS: AssessmentKey[] = [
  "alcohol-use",
  "alcohol-detox",
  "drug-use",
  "detox-suitability",
  "anxiety",
  "depression",
  "adhd",
];

function completeAnswers(
  key: AssessmentKey,
  overrides: AssessmentAnswers = {},
): AssessmentAnswers {
  const definition = getActiveDefinition(key);
  const answers: AssessmentAnswers = {
    ...(definition.eligibility ? { [definition.eligibility.questionId]: "adult" } : {}),
    ...overrides,
  };

  for (let pass = 0; pass < 5; pass += 1) {
    for (const section of definition.sections) {
      for (const question of section.questions) {
        if (
          answers[question.id] !== undefined
          || !question.required
          || !questionIsApplicable(section, question, answers)
        ) continue;
        if (question.options?.length) {
          const selected = [...question.options].sort((a, b) => a.score - b.score)[0]!;
          answers[question.id] = question.type === "checkbox"
            ? [selected.value]
            : selected.value;
        } else {
          answers[question.id] = "Synthetic response";
        }
      }
    }
  }

  return answers;
}

function assess(key: AssessmentKey, overrides: AssessmentAnswers = {}) {
  const definition = getActiveDefinition(key);
  return evaluateAssessment(
    definition,
    validateAnswers(definition, completeAnswers(key, overrides)),
  );
}

function gadAnswers(score: number): AssessmentAnswers {
  const answers: AssessmentAnswers = {};
  for (let index = 1; index <= 7; index += 1) {
    const value = Math.min(3, score);
    score -= value;
    answers[`gad7-${index}`] = [
      "not-at-all",
      "several-days",
      "more-than-half",
      "nearly-every-day",
    ][value]!;
  }
  return answers;
}

function phqAnswers(score: number): AssessmentAnswers {
  const answers: AssessmentAnswers = {};
  for (let index = 1; index <= 9; index += 1) {
    const value = Math.min(3, score);
    score -= value;
    answers[`phq9-${index}`] = [
      "not-at-all",
      "several-days",
      "more-than-half",
      "nearly-every-day",
    ][value]!;
  }
  return answers;
}

class CorrectionMemoryPersistence implements AssessmentPersistence {
  private records = new Map<string, StoredAssessmentResult>();
  private submissions = new Map<string, string>();
  private tokens = new Map<string, string>();

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
    for (const [hash, id] of this.tokens) {
      if (id === storageId) this.tokens.delete(hash);
    }
    this.tokens.set(accessTokenHash, storageId);
  }

  async findByAccessTokenHash(accessTokenHash: string) {
    const id = this.tokens.get(accessTokenHash);
    return id ? this.records.get(id) ?? null : null;
  }

  async updateDelivery() {}

  async markCtaClicked() {}

  async requestContact(
    storageId: string,
    _request: AssessmentContactRequest,
  ): Promise<StoredAssessmentResult> {
    const record = this.records.get(storageId);
    if (!record) throw new Error("Synthetic result not found");
    return record;
  }
}

test("correction gate 1: dependent alcohol plus planned abrupt cessation is urgent same-day", () => {
  const result = assess("alcohol-use", {
    "alcohol-tolerance": "yes",
    "alcohol-intended-change": "abrupt",
  });
  assert.equal(result.safety.action, "urgent-same-day-assessment");
  const content = result.safety.content.find((item) => item.id === "alcohol-withdrawal-urgent");
  assert.ok(content);
  assert.match(content.body, /abruptly stopping or sharply reducing alcohol may be unsafe/i);
  assert.match(content.actionText ?? "", /urgent medical advice today before stopping or sharply reducing/i);
});

test("correction gate 2: alcohol dependence without imminent cessation is not automatically urgent", () => {
  const result = assess("alcohol-use", {
    "alcohol-tolerance": "yes",
    "alcohol-morning-relief": "weekly",
    "alcohol-intended-change": "no",
  });
  assert.notEqual(result.safety.action, "urgent-same-day-assessment");
  assert.notEqual(result.safety.action, "emergency-help-now");
});

test("correction gate 3: non-acute severe alcohol withdrawal wording cannot trigger emergency", () => {
  const direct = assess("alcohol-use", {
    "alcohol-current-withdrawal": "severe",
    "alcohol-current-acute": "none",
  });
  const branched = assess("drug-use", {
    substances: ["alcohol"],
    "substance-alcohol-withdrawal": "severe",
    "substance-alcohol-current-acute": "none",
  });
  for (const result of [direct, branched]) {
    assert.equal(result.safety.action, "urgent-same-day-assessment");
    assert.notEqual(result.safety.action, "emergency-help-now");
  }

  for (const key of ["alcohol-use", "drug-use"] as const) {
    const publicDefinition = toPublicDefinition(getActiveDefinition(key));
    const severeLabels = publicDefinition.sections
      .flatMap((section) => section.questions)
      .filter((question) => ["alcohol-current-withdrawal", "substance-alcohol-withdrawal"].includes(question.id))
      .flatMap((question) => question.options ?? [])
      .filter((option) => option.value === "severe")
      .map((option) => option.label);
    assert.equal(severeLabels.length, 1);
    assert.match(severeLabels[0]!, /without a current seizure|without current seizure/i);
    assert.notEqual(severeLabels[0]!.trim().toLowerCase(), "severe withdrawal");
  }
});

test("correction gate 4: explicit acute alcohol seizure, confusion or severe hallucinations is emergency", () => {
  for (const value of ["seizure", "confusion", "hallucinations"] as const) {
    const direct = assess("alcohol-use", { "alcohol-current-acute": value });
    const branched = assess("drug-use", {
      substances: ["alcohol"],
      "substance-alcohol-current-acute": value,
    });
    for (const result of [direct, branched]) {
      assert.equal(result.safety.action, "emergency-help-now", value);
      assert.ok(result.safety.content.some((content) => content.id === "alcohol-withdrawal-emergency"));
    }
  }
});

test("correction gate 5: historical alcohol-withdrawal seizure plus imminent reduction is urgent", () => {
  const result = assess("alcohol-use", {
    "alcohol-prior-seizure": "yes",
    "alcohol-intended-change": "abrupt",
  });
  assert.equal(result.safety.action, "urgent-same-day-assessment");
});

test("correction gate 6: historical alcohol-withdrawal seizure without imminent change remains clinical review", () => {
  const result = assess("alcohol-use", {
    "alcohol-prior-seizure": "yes",
    "alcohol-intended-change": "no",
  });
  assert.equal(result.safety.action, "clinical-review-recommended");
});

test("correction gate 7: regular benzodiazepine use plus abrupt reduction is urgent", () => {
  const cases = [
    assess("drug-use", {
      substances: ["benzodiazepines"],
      "substance-benz-frequency": "daily",
      "substance-benz-abrupt": "yes",
    }),
    assess("detox-suitability", {
      substances: ["benzodiazepines"],
      "substance-benz-frequency": "several-week",
      "intended-change": "abrupt",
    }),
  ];
  for (const result of cases) {
    assert.equal(result.safety.action, "urgent-same-day-assessment");
    assert.ok(result.safety.content.some((content) => content.id === "benzodiazepine-withdrawal-urgent"));
  }
});

test("correction gate 8: multiple-daily GHB or GBL plus planned cessation is urgent", () => {
  const cases = [
    assess("drug-use", {
      substances: ["ghb-gbl"],
      "substance-ghb-frequency": "multiple-daily",
      "substance-ghb-intended-change": "abrupt",
    }),
    assess("detox-suitability", {
      substances: ["ghb-gbl"],
      "substance-ghb-frequency": "multiple-daily",
      "intended-change": "abrupt",
    }),
  ];
  for (const result of cases) {
    assert.equal(result.safety.action, "urgent-same-day-assessment");
    assert.ok(result.safety.content.some((content) => content.id === "ghb-gbl-withdrawal-urgent"));
  }
});

test("correction gate 9: acute GHB or GBL emergency symptoms remain emergency", () => {
  for (const key of ["drug-use", "detox-suitability"] as const) {
    const result = assess(key, {
      substances: ["ghb-gbl"],
      "substance-ghb-withdrawal": "severe",
    });
    assert.equal(result.safety.action, "emergency-help-now");
    assert.ok(result.safety.content.some((content) => content.id === "ghb-gbl-withdrawal-emergency"));
  }
});

test("correction gate 10: daily opioid use shows opioid-specific harm reduction in a routine state", () => {
  const result = assess("drug-use", {
    substances: ["opioids"],
    "substance-opioid-frequency": "daily",
  });
  const content = result.safety.content.find((item) => item.id === "opioid-harm-reduction");
  assert.equal(result.safety.action, "no-immediate-warning-identified");
  assert.ok(content);
  assert.match(content.body, /does not mean.*safe/i);
  assert.match(content.body, /naloxone/i);
});

test("correction gate 11: reduced opioid tolerance has prominent overdose, sedative and naloxone guidance", () => {
  const result = assess("drug-use", {
    substances: ["opioids"],
    "substance-opioid-reduced-tolerance": "yes",
  });
  const content = result.safety.content.find((item) => item.id === "opioid-tolerance-review");
  assert.ok(content);
  assert.match(content.body, /overdose/i);
  assert.match(content.body, /sedative|alcohol|benzodiazepine/i);
  assert.match(content.body, /naloxone/i);
});

test("correction gate 12: opioid plus sedative use enhances overdose guidance and prioritises NHS or GP care", () => {
  const result = assess("drug-use", {
    substances: ["opioids"],
    "substance-opioid-co-use": ["benzodiazepines"],
  });
  const content = result.safety.content.find((item) => item.id === "opioid-overdose-caution");
  assert.equal(result.safety.action, "clinical-review-recommended");
  assert.ok(content);
  assert.match(content.body, /breathing|overdose/i);
  assert.match(content.body, /naloxone/i);
  assert.deepEqual(result.pathways.slice(0, 2).map((pathway) => pathway.id), [
    "nhs-substance-service",
    "gp-review",
  ]);
  assert.equal(result.pathways.some((pathway) => pathway.commercial), false);
});

test("correction gate 13: acute opioid overdose presentations are emergency", () => {
  for (const value of ["unresponsive", "breathing", "colour"] as const) {
    const result = assess("drug-use", {
      substances: ["opioids"],
      "substance-opioid-overdose-now": value,
    });
    assert.equal(result.safety.action, "emergency-help-now", value);
    assert.equal(result.pathways[0]?.id, "emergency-999");
  }
});

test("correction gate 14: stimulant psychosis without immediate danger is urgent", () => {
  const result = assess("drug-use", {
    substances: ["stimulants"],
    "substance-stimulant-acute": "psychosis",
  });
  assert.equal(result.safety.action, "urgent-same-day-assessment");
  assert.ok(result.safety.content.some((content) => content.id === "stimulant-urgent"));
});

test("correction gate 15: stimulant chest pain or immediate-danger acute state is emergency", () => {
  for (const value of ["chest-pain", "severe-agitation"] as const) {
    const result = assess("drug-use", {
      substances: ["stimulants"],
      "substance-stimulant-acute": value,
    });
    assert.equal(result.safety.action, "emergency-help-now", value);
    assert.ok(result.safety.content.some((content) => content.id === "stimulant-emergency"));
  }
});

test("correction gate 16: pregnancy pathways prioritise maternity, GP and specialist care", () => {
  const cases = [
    assess("alcohol-use", { pregnancy: "yes" }),
    assess("detox-suitability", { substances: ["opioids"], pregnancy: "possible" }),
  ];
  for (const result of cases) {
    const pathwayIds = result.pathways.map((pathway) => pathway.id);
    assert.deepEqual(pathwayIds.slice(0, 3), [
      "pregnancy-specialist",
      "gp-review",
      "nhs-substance-service",
    ]);
    const firstCommercial = result.pathways.findIndex((pathway) => pathway.commercial);
    assert.ok(firstCommercial === -1 || firstCommercial >= 3);
  }
});

test("correction gate 17: every urgent same-day fixture suppresses ordinary commercial pathways", () => {
  const fixtures = [...phaseBClinicalFixtures, ...phaseCClinicalFixtures]
    .filter((fixture) => fixture.expected.safetyAction === "urgent-same-day-assessment");
  assert.ok(fixtures.length > 0);
  for (const fixture of fixtures) {
    const definition = getActiveDefinition(fixture.assessmentKey);
    const result = evaluateAssessment(
      definition,
      validateAnswers(definition, fixture.answers),
    );
    assert.equal(result.safety.suppressCommercialCtas, true, fixture.id);
    assert.equal(result.pathways.some((pathway) => pathway.commercial), false, fixture.id);
  }
});

test("correction gate 18: every emergency fixture continues to suppress commercial pathways", () => {
  const fixtures = [...phaseBClinicalFixtures, ...phaseCClinicalFixtures]
    .filter((fixture) => fixture.expected.safetyAction === "emergency-help-now");
  assert.ok(fixtures.length > 0);
  for (const fixture of fixtures) {
    const definition = getActiveDefinition(fixture.assessmentKey);
    const result = evaluateAssessment(
      definition,
      validateAnswers(definition, fixture.answers),
    );
    assert.equal(result.safety.suppressCommercialCtas, true, fixture.id);
    assert.equal(result.pathways.some((pathway) => pathway.commercial), false, fixture.id);
  }
});

test("correction gate 19: PHQ-9 item 9 produces one integrated safety block with preserved evidence", () => {
  for (const safetyAnswer of ["passing-current", "recurring-increasing"] as const) {
    const result = assess("depression", {
      "phq9-9": "several-days",
      "mental-health-safety": safetyAnswer,
    });
    assert.equal(result.safety.content.length, 1, safetyAnswer);
    assert.notEqual(result.safety.content[0]?.id, "phq9-item9-review");
    assert.match(result.safety.content[0]?.body ?? "", /PHQ-9 item 9/i);
    assert.match(result.safety.content[0]?.body ?? "", /not a suicide-risk score/i);
    assert.ok(result.safety.triggeredRules.some((rule) => rule.contentId === "phq9-item9-review"));
    assert.ok(result.safety.triggeredRules.some((rule) => rule.evidenceQuestionIds.includes("phq9-9")));
  }
});

test("correction gate 20: GAD-7, PHQ-9 and ASRS validated scores remain unchanged by context", () => {
  const cases: Array<{
    key: Extract<AssessmentKey, "anxiety" | "depression" | "adhd">;
    baseline: AssessmentAnswers;
    context: AssessmentAnswers;
  }> = [
    {
      key: "anxiety",
      baseline: gadAnswers(5),
      context: {
        "anxiety-duration": "over-six-months",
        "anxiety-functioning": "severe",
        "anxiety-substance-coping": "most-days",
      },
    },
    {
      key: "depression",
      baseline: phqAnswers(5),
      context: {
        "depression-duration": "over-six-months",
        "depression-functioning": "severe",
        "depression-substance-coping": "most-days",
      },
    },
    {
      key: "adhd",
      baseline: {
        "asrs-1": "often",
        "asrs-2": "often",
        "asrs-3": "often",
        "asrs-4": "sometimes",
      },
      context: {
        "adhd-childhood": "clear",
        "adhd-settings": "multiple",
        "adhd-functioning": "severe",
        "adhd-substance-overlap": "yes",
      },
    },
  ];
  for (const item of cases) {
    const baseline = assess(item.key, item.baseline);
    const contextual = assess(item.key, { ...item.baseline, ...item.context });
    assert.equal(contextual.instrument?.rawScore, baseline.instrument?.rawScore, item.key);
  }
});

test("correction gate 21: minimal profiles receive proportionate self-guided-first pathways", () => {
  for (const key of ASSESSMENT_KEYS) {
    const result = assess(key);
    assert.equal(result.pathways[0]?.id, "self-guided", key);
    assert.notEqual(result.safety.action, "urgent-same-day-assessment", key);
    assert.notEqual(result.safety.action, "emergency-help-now", key);
  }
});

test("correction gate 22: S0 wording explains limits without broad safety clearance", () => {
  const result = assess("anxiety");
  assert.equal(result.safety.content[0]?.heading, "About your result");
  assert.match(result.safety.content[0]?.body ?? "", /does not mean.*rule out medical or mental-health concerns/i);
  assert.equal(/you are safe|there is no risk|no medical or mental-health concern/i.test(
    result.safety.content[0]?.body ?? "",
  ), false);
});

test("correction gate 23: server authority ignores forged score and band fields", async () => {
  const persistence = new CorrectionMemoryPersistence();
  const result = await submitAssessment({
    assessmentKey: "anxiety",
    definitionVersion: getActiveDefinition("anxiety").version,
    submissionKey: "20000000-0000-4000-8000-000000000023",
    answers: completeAnswers("anxiety", gadAnswers(5)),
    scoreValue: 999999,
    bandName: "Forged emergency result",
  }, {
    persistence,
    deliveries: { async email() {}, async irnOs() {} },
    createId: () => "correction-gate-23",
    createToken: () => "synthetic-correction-gate-23-token",
  });
  assert.equal(result.result.instrument?.rawScore, 5);
  assert.notEqual(result.result.screening.value, 999999);
  assert.notEqual(result.result.screening.label, "Forged emergency result");
});

test("correction gate 24: the assessment tracking and privacy boundary remains explicit", async () => {
  const source = await readFile(
    new URL("../../../irn-website/src/lib/assessment-tracking-boundary.ts", import.meta.url),
    "utf8",
  );
  for (const path of [
    "/assessments",
    "/assessment/alcohol-detox",
    "/assessment-results",
    "/get-help",
  ]) assert.match(source, new RegExp(path.replaceAll("/", "\\/")));
  assert.match(source, /googletagmanager\.com/);
  assert.match(source, /connect\.facebook\.net/);
  assert.match(source, /window\.location\.replace\(window\.location\.href\)/);
});

test("correction gate 25: an anonymous result is saved and recoverable before any optional contact", async () => {
  const persistence = new CorrectionMemoryPersistence();
  let emailAttempts = 0;
  let irnOsAttempts = 0;
  const outcome = await submitAssessment({
    assessmentKey: "depression",
    definitionVersion: getActiveDefinition("depression").version,
    submissionKey: "20000000-0000-4000-8000-000000000025",
    answers: completeAnswers("depression"),
  }, {
    persistence,
    deliveries: {
      async email() { emailAttempts += 1; },
      async irnOs() { irnOsAttempts += 1; },
    },
    createId: () => "correction-gate-25",
    createToken: () => "synthetic-correction-gate-25-token",
  });
  assert.equal(outcome.result.persistence.status, "saved");
  assert.deepEqual(outcome.result.delivery, {
    email: "not-requested",
    irnOs: "not-requested",
  });
  assert.equal(emailAttempts, 0);
  assert.equal(irnOsAttempts, 0);
  const recovered = await recoverAssessment(outcome.accessToken, persistence);
  assert.ok(recovered);
  assert.deepEqual(recovered.contact, {});
});

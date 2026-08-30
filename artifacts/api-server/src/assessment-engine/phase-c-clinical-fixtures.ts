import type {
  AssessmentAnswers,
  AssessmentKey,
  SafetyAction,
  SafetyContentId,
} from "./contracts.ts";
import { questionIsApplicable } from "./branching.ts";
import { evaluateAssessment } from "./evaluate.ts";
import { getActiveDefinition } from "./registry.ts";
import { validateAnswers } from "./validate-answers.ts";

type PhaseCKey = Extract<AssessmentKey, "anxiety" | "depression" | "adhd">;

export interface PhaseCClinicalFixture {
  id: string;
  assessmentKey: PhaseCKey;
  profile: string;
  answers: AssessmentAnswers;
  expected: {
    score: number;
    band: string;
    safetyAction: SafetyAction;
    requiredContentIds: SafetyContentId[];
    requireCommercialSuppression?: boolean;
    requiredFindingId?: string;
  };
}

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

function fixture(
  id: string,
  assessmentKey: PhaseCKey,
  profile: string,
  overrides: AssessmentAnswers,
  expected: PhaseCClinicalFixture["expected"],
): PhaseCClinicalFixture {
  return { id, assessmentKey, profile, answers: completeAnswers(assessmentKey, overrides), expected };
}

const GAD_MODERATE = {
  "gad7-1": "more-than-half",
  "gad7-2": "more-than-half",
  "gad7-3": "more-than-half",
  "gad7-4": "more-than-half",
  "gad7-5": "more-than-half",
};

const PHQ_MILD = {
  "phq9-1": "several-days",
  "phq9-2": "several-days",
  "phq9-3": "several-days",
  "phq9-4": "several-days",
  "phq9-5": "several-days",
};

const ASRS_ATTENTION_POSITIVE = {
  "asrs-1": "often",
  "asrs-2": "often",
  "asrs-3": "often",
  "asrs-4": "sometimes",
};

export const phaseCClinicalFixtures: PhaseCClinicalFixture[] = [
  fixture("anxiety-minimal", "anxiety", "Minimal symptoms", {}, {
    score: 0,
    band: "Minimal anxiety",
    safetyAction: "no-immediate-warning-identified",
    requiredContentIds: ["screening-limitation"],
  }),
  fixture("anxiety-moderate-persistent", "anxiety", "Moderate persistent symptoms", {
    ...GAD_MODERATE,
    "anxiety-duration": "over-six-months",
    "anxiety-coping": "not-helping",
  }, {
    score: 10,
    band: "Moderate anxiety",
    safetyAction: "no-immediate-warning-identified",
    requiredContentIds: ["screening-limitation"],
    requiredFindingId: "anxiety.persistent-coping.v2",
  }),
  fixture("anxiety-severe-functional", "anxiety", "Severe symptoms with functional impairment", {
    "gad7-1": "nearly-every-day", "gad7-2": "nearly-every-day", "gad7-3": "nearly-every-day", "gad7-4": "nearly-every-day", "gad7-5": "nearly-every-day", "gad7-6": "nearly-every-day", "gad7-7": "nearly-every-day",
    "anxiety-functioning": "severe",
    "anxiety-work-study": "most-or-all",
    "anxiety-social": "most-or-all",
  }, {
    score: 21,
    band: "Severe anxiety",
    safetyAction: "no-immediate-warning-identified",
    requiredContentIds: ["screening-limitation"],
    requiredFindingId: "anxiety.avoidance-functioning.v2",
  }),
  fixture("anxiety-avoidance", "anxiety", "Anxiety plus avoidance", {
    ...GAD_MODERATE,
    "anxiety-avoidance": "major",
    "anxiety-functioning": "moderate",
  }, {
    score: 10,
    band: "Moderate anxiety",
    safetyAction: "no-immediate-warning-identified",
    requiredContentIds: ["screening-limitation"],
    requiredFindingId: "anxiety.avoidance-functioning.v2",
  }),
  fixture("anxiety-substance-coping", "anxiety", "Anxiety plus substance coping", {
    ...GAD_MODERATE,
    "anxiety-substance-coping": "often",
  }, {
    score: 10,
    band: "Moderate anxiety",
    safetyAction: "no-immediate-warning-identified",
    requiredContentIds: ["screening-limitation"],
    requiredFindingId: "anxiety.substance-coping.v2",
  }),
  fixture("anxiety-mild-passing-thoughts", "anxiety", "Mild symptoms plus current passing self-harm thoughts", {
    "gad7-1": "several-days", "gad7-2": "several-days", "gad7-3": "several-days", "gad7-4": "several-days", "gad7-5": "several-days",
    "mental-health-safety": "passing-current",
  }, {
    score: 5,
    band: "Mild anxiety",
    safetyAction: "clinical-review-recommended",
    requiredContentIds: ["mental-health-current-review"],
    requireCommercialSuppression: true,
  }),
  fixture("anxiety-recurring-thoughts", "anxiety", "Recurring or increasing self-harm thoughts", {
    "mental-health-safety": "recurring-increasing",
  }, {
    score: 0,
    band: "Minimal anxiety",
    safetyAction: "urgent-same-day-assessment",
    requiredContentIds: ["mental-health-urgent"],
    requireCommercialSuppression: true,
  }),
  fixture("anxiety-cannot-remain-safe", "anxiety", "Immediate inability to remain safe", {
    "mental-health-safety": "cannot-remain-safe",
  }, {
    score: 0,
    band: "Minimal anxiety",
    safetyAction: "emergency-help-now",
    requiredContentIds: ["mental-health-emergency"],
    requireCommercialSuppression: true,
  }),

  fixture("depression-minimal", "depression", "Minimal symptoms", {}, {
    score: 0,
    band: "Minimal depression",
    safetyAction: "no-immediate-warning-identified",
    requiredContentIds: ["screening-limitation"],
  }),
  fixture("depression-low-mood-low-impact", "depression", "Low mood without major impairment", {
    "phq9-2": "several-days",
    "depression-functioning": "mild",
  }, {
    score: 1,
    band: "Minimal depression",
    safetyAction: "no-immediate-warning-identified",
    requiredContentIds: ["screening-limitation"],
  }),
  fixture("depression-anhedonia-energy", "depression", "Prominent anhedonia and low energy", {
    "phq9-1": "nearly-every-day",
    "phq9-4": "nearly-every-day",
    "depression-routine": "none",
    "depression-isolation": "regular",
  }, {
    score: 6,
    band: "Mild depression",
    safetyAction: "no-immediate-warning-identified",
    requiredContentIds: ["screening-limitation"],
    requiredFindingId: "depression.symptoms-withdrawal.v2",
  }),
  fixture("depression-functional-impact", "depression", "Significant functional impairment", {
    ...PHQ_MILD,
    "phq9-6": "several-days", "phq9-7": "several-days", "phq9-8": "several-days",
    "depression-functioning": "severe",
    "depression-isolation": "major",
  }, {
    score: 8,
    band: "Mild depression",
    safetyAction: "no-immediate-warning-identified",
    requiredContentIds: ["screening-limitation"],
    requiredFindingId: "depression.symptoms-withdrawal.v2",
  }),
  fixture("depression-isolation-hopelessness", "depression", "Isolation plus hopelessness", {
    "phq9-1": "more-than-half", "phq9-2": "nearly-every-day", "phq9-4": "several-days",
    "depression-isolation": "major",
    "depression-routine": "rarely",
  }, {
    score: 6,
    band: "Mild depression",
    safetyAction: "no-immediate-warning-identified",
    requiredContentIds: ["screening-limitation"],
    requiredFindingId: "depression.symptoms-withdrawal.v2",
  }),
  fixture("depression-substance-coping", "depression", "Depression symptoms with substance coping", {
    ...PHQ_MILD,
    "phq9-6": "several-days",
    "depression-substance-coping": "often",
  }, {
    score: 6,
    band: "Mild depression",
    safetyAction: "no-immediate-warning-identified",
    requiredContentIds: ["screening-limitation"],
    requiredFindingId: "depression.substance-coping.v2",
  }),
  fixture("depression-lower-item9", "depression", "Lower total severity plus self-harm thoughts", {
    "phq9-9": "several-days",
    "mental-health-safety": "passing-current",
  }, {
    score: 1,
    band: "Minimal depression",
    safetyAction: "clinical-review-recommended",
    requiredContentIds: ["phq9-item9-review", "mental-health-current-review"],
    requireCommercialSuppression: true,
  }),
  fixture("depression-recurring-thoughts", "depression", "Recurring self-harm thoughts", {
    "phq9-9": "several-days",
    "mental-health-safety": "recurring-increasing",
  }, {
    score: 1,
    band: "Minimal depression",
    safetyAction: "urgent-same-day-assessment",
    requiredContentIds: ["phq9-item9-review", "mental-health-urgent"],
    requireCommercialSuppression: true,
  }),
  fixture("depression-cannot-remain-safe", "depression", "Immediate inability to remain safe", {
    "mental-health-safety": "cannot-remain-safe",
  }, {
    score: 0,
    band: "Minimal depression",
    safetyAction: "emergency-help-now",
    requiredContentIds: ["mental-health-emergency"],
    requireCommercialSuppression: true,
  }),

  fixture("adhd-few-symptoms", "adhd", "Few symptoms", {}, {
    score: 0,
    band: "ASRS screening threshold not reached",
    safetyAction: "no-immediate-warning-identified",
    requiredContentIds: ["screening-limitation"],
  }),
  fixture("adhd-attention-only", "adhd", "Attention symptoms only", {
    ...ASRS_ATTENTION_POSITIVE,
    "adhd-childhood": "no", "adhd-settings": "one", "adhd-functioning": "mild",
  }, {
    score: 4,
    band: "ASRS screening threshold reached",
    safetyAction: "no-immediate-warning-identified",
    requiredContentIds: ["screening-limitation"],
    requiredFindingId: "adhd.context-uncertain.v2",
  }),
  fixture("adhd-restlessness-impulsivity", "adhd", "Impulsivity and restlessness profile", {
    "asrs-5": "often", "asrs-6": "sometimes",
    "adhd-impulsivity": "most-or-all", "adhd-emotional-regulation": "often",
    "adhd-functioning": "moderate", "adhd-work-study": "often", "adhd-relationships": "often",
  }, {
    score: 2,
    band: "ASRS screening threshold not reached",
    safetyAction: "no-immediate-warning-identified",
    requiredContentIds: ["screening-limitation"],
    requiredFindingId: "adhd.restlessness-impact.v2",
  }),
  fixture("adhd-no-childhood", "adhd", "Symptoms without childhood persistence", {
    ...ASRS_ATTENTION_POSITIVE,
    "adhd-childhood": "no", "adhd-settings": "multiple", "adhd-functioning": "moderate",
  }, {
    score: 4,
    band: "ASRS screening threshold reached",
    safetyAction: "no-immediate-warning-identified",
    requiredContentIds: ["screening-limitation"],
    requiredFindingId: "adhd.context-uncertain.v2",
  }),
  fixture("adhd-one-setting", "adhd", "Symptoms in only one setting", {
    ...ASRS_ATTENTION_POSITIVE,
    "adhd-childhood": "clear", "adhd-settings": "one", "adhd-functioning": "moderate",
  }, {
    score: 4,
    band: "ASRS screening threshold reached",
    safetyAction: "no-immediate-warning-identified",
    requiredContentIds: ["screening-limitation"],
    requiredFindingId: "adhd.context-uncertain.v2",
  }),
  fixture("adhd-multisetting-impact", "adhd", "Symptoms with significant multi-setting impairment", {
    "asrs-1": "often", "asrs-2": "often", "asrs-3": "often", "asrs-4": "sometimes", "asrs-5": "often", "asrs-6": "sometimes",
    "adhd-childhood": "clear", "adhd-settings": "multiple", "adhd-functioning": "severe", "adhd-work-study": "most-or-all", "adhd-relationships": "often",
  }, {
    score: 6,
    band: "ASRS screening threshold reached",
    safetyAction: "no-immediate-warning-identified",
    requiredContentIds: ["screening-limitation"],
    requiredFindingId: "adhd.multi-setting-impact.v2",
  }),
  fixture("adhd-mental-health-overlap", "adhd", "ADHD-like symptoms with anxiety or depression overlap", {
    ...ASRS_ATTENTION_POSITIVE,
    "adhd-childhood": "possible", "adhd-settings": "multiple", "adhd-functioning": "moderate",
    "adhd-sleep": "likely", "adhd-mood-anxiety": "yes",
  }, {
    score: 4,
    band: "ASRS screening threshold reached",
    safetyAction: "no-immediate-warning-identified",
    requiredContentIds: ["screening-limitation"],
    requiredFindingId: "adhd.context-uncertain.v2",
  }),
  fixture("adhd-substance-overlap", "adhd", "ADHD-like symptoms with substance use", {
    ...ASRS_ATTENTION_POSITIVE,
    "adhd-childhood": "clear", "adhd-settings": "multiple", "adhd-functioning": "moderate",
    "adhd-substance-overlap": "yes",
  }, {
    score: 4,
    band: "ASRS screening threshold reached",
    safetyAction: "no-immediate-warning-identified",
    requiredContentIds: ["screening-limitation"],
    requiredFindingId: "adhd.substance-overlap.v2",
  }),
  fixture("adhd-self-harm", "adhd", "Self-harm requiring a separate safety pathway", {
    "mental-health-safety": "recurring-increasing",
  }, {
    score: 0,
    band: "ASRS screening threshold not reached",
    safetyAction: "urgent-same-day-assessment",
    requiredContentIds: ["mental-health-urgent"],
    requireCommercialSuppression: true,
  }),
];

export function materialisePhaseCClinicalFixtures() {
  return phaseCClinicalFixtures.map((fixture) => {
    const definition = getActiveDefinition(fixture.assessmentKey);
    const answers = validateAnswers(definition, fixture.answers);
    const result = evaluateAssessment(definition, answers);
    return {
      approvalStatus: "PENDING CLINICAL DIRECTOR APPROVAL" as const,
      fixtureId: fixture.id,
      assessmentKey: fixture.assessmentKey,
      profile: fixture.profile,
      definitionVersion: definition.version,
      definitionHash: definition.definitionHash,
      exactSyntheticAnswers: answers,
      validatedInstrumentResult: result.instrument,
      contextualDomains: result.domains,
      triggeredSafetyRules: result.safety.triggeredRules,
      safetyAction: result.safety.action,
      deterministicFindings: result.interpretation.keyPatterns,
      pathways: result.pathways,
      requiredContent: result.safety.content,
      prohibitedContent: [
        "Any alcohol, detox or withdrawal safety copy",
        "Any low, medium or high suicide-risk label",
        "Any diagnostic claim",
        "Any commercial call to action when safety suppression is required",
      ],
      expectedReviewAssertions: fixture.expected,
    };
  });
}

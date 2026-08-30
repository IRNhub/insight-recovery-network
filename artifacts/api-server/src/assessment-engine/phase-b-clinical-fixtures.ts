import type { AssessmentAnswers, AssessmentKey, SafetyContentId } from "./contracts.ts";
import { questionIsApplicable } from "./branching.ts";
import { evaluateAssessment } from "./evaluate.ts";
import { getActiveDefinition } from "./registry.ts";
import { AssessmentValidationError, validateAnswers } from "./validate-answers.ts";

type PhaseBKey = Extract<AssessmentKey, "alcohol-use" | "alcohol-detox" | "drug-use" | "detox-suitability">;

export interface PhaseBClinicalFixture {
  id: string;
  assessmentKey: PhaseBKey;
  profile: string;
  answers: AssessmentAnswers;
  expected: {
    safetyAction?: string;
    requiredContentIds?: SafetyContentId[];
    prohibitedContentIds?: SafetyContentId[];
    requireCommercialSuppression?: boolean;
    validationErrorField?: string;
  };
}

function syntheticAnswers(key: PhaseBKey, overrides: AssessmentAnswers = {}): AssessmentAnswers {
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
          answers[question.id] = "Synthetic other substance";
        }
      }
    }
  }
  return answers;
}

function fixture(
  id: string,
  assessmentKey: PhaseBKey,
  profile: string,
  overrides: AssessmentAnswers,
  expected: PhaseBClinicalFixture["expected"] = {},
): PhaseBClinicalFixture {
  return { id, assessmentKey, profile, answers: syntheticAnswers(assessmentKey, overrides), expected };
}

export const phaseBClinicalFixtures: PhaseBClinicalFixture[] = [
  fixture("alcohol-use-minimal", "alcohol-use", "Minimal drinking", {}, {
    safetyAction: "no-immediate-warning-identified",
    requiredContentIds: ["screening-limitation"],
  }),
  fixture("alcohol-use-prominent-exposure", "alcohol-use", "Prominent alcohol exposure without withdrawal", {
    "alcohol-frequency": "four-plus-week",
    "alcohol-quantity": "ten-plus",
    "alcohol-heavy-occasion": "weekly",
  }, { prohibitedContentIds: ["alcohol-withdrawal-urgent", "alcohol-withdrawal-emergency"] }),
  fixture("alcohol-use-dependence-indicators", "alcohol-use", "Dependence indicators", {
    "alcohol-impaired-control": "weekly",
    "alcohol-morning-relief": "weekly",
    "alcohol-tolerance": "yes",
    "alcohol-previous-withdrawal": "significant",
  }, { safetyAction: "clinical-review-recommended", requiredContentIds: ["alcohol-withdrawal-review"] }),
  fixture("alcohol-use-low-profile-prior-seizure", "alcohol-use", "Lower alcohol exposure with a historical withdrawal seizure", {
    "alcohol-prior-seizure": "yes",
  }, { safetyAction: "clinical-review-recommended", requiredContentIds: ["alcohol-withdrawal-review"] }),
  fixture("alcohol-use-abrupt-dependence", "alcohol-use", "Intended abrupt cessation with dependence indicators", {
    "alcohol-intended-change": "abrupt",
    "alcohol-tolerance": "yes",
    "alcohol-morning-relief": "daily-or-almost-daily",
  }, { safetyAction: "clinical-review-recommended", requiredContentIds: ["alcohol-withdrawal-review"] }),
  fixture("alcohol-use-current-severe-withdrawal", "alcohol-use", "Current severe alcohol-withdrawal symptoms", {
    "alcohol-current-withdrawal": "severe",
  }, { safetyAction: "emergency-help-now", requiredContentIds: ["alcohol-withdrawal-emergency"], requireCommercialSuppression: true }),
  fixture("alcohol-use-benzodiazepines", "alcohol-use", "Alcohol with benzodiazepine co-use", {
    "alcohol-co-use": ["benzodiazepines"],
  }, { safetyAction: "clinical-review-recommended", requiredContentIds: ["benzodiazepine-withdrawal-review"] }),
  fixture("alcohol-use-opioids", "alcohol-use", "Alcohol with opioid co-use", {
    "alcohol-co-use": ["opioids"],
  }, { safetyAction: "clinical-review-recommended", requiredContentIds: ["opioid-overdose-caution"] }),
  fixture("alcohol-use-pregnancy-dependence", "alcohol-use", "Pregnancy with alcohol dependence indicators", {
    pregnancy: "yes",
    "alcohol-morning-relief": "weekly",
    "alcohol-tolerance": "yes",
  }, { safetyAction: "clinical-review-recommended", requiredContentIds: ["pregnancy-substance-review", "alcohol-withdrawal-review"] }),

  fixture("alcohol-detox-no-dependence", "alcohol-detox", "No dependence indicators", {}, {
    safetyAction: "no-immediate-warning-identified",
  }),
  fixture("alcohol-detox-mild-symptoms", "alcohol-detox", "Mild current symptoms", {
    "alcohol-current-withdrawal": "mild",
  }, { safetyAction: "clinical-review-recommended", requiredContentIds: ["alcohol-withdrawal-review"], prohibitedContentIds: ["alcohol-withdrawal-emergency"] }),
  fixture("alcohol-detox-previous-complicated", "alcohol-detox", "Previous complicated detoxification", {
    "alcohol-previous-detox": "complicated",
  }, { safetyAction: "clinical-review-recommended", requiredContentIds: ["alcohol-withdrawal-review"] }),
  fixture("alcohol-detox-prior-seizure", "alcohol-detox", "Prior alcohol-withdrawal seizure", {
    "alcohol-prior-seizure": "yes",
    "alcohol-intended-change": "abrupt",
  }, { safetyAction: "urgent-same-day-assessment", requiredContentIds: ["alcohol-withdrawal-urgent"] }),
  fixture("alcohol-detox-prior-confusion", "alcohol-detox", "Hallucination, confusion or delirium history", {
    "alcohol-prior-hallucination-confusion": "yes",
  }, { safetyAction: "clinical-review-recommended", requiredContentIds: ["alcohol-withdrawal-review"] }),
  fixture("alcohol-detox-acute-seizure", "alcohol-detox", "Current acute seizure", {
    "alcohol-current-acute": "seizure",
  }, { safetyAction: "emergency-help-now", requiredContentIds: ["alcohol-withdrawal-emergency"], requireCommercialSuppression: true }),
  fixture("alcohol-detox-limited-support", "alcohol-detox", "Limited home support", {
    support: "no",
  }),
  fixture("alcohol-detox-medically-vulnerable", "alcohol-detox", "Medical vulnerability", {
    "medical-vulnerability": "yes",
  }, { safetyAction: "clinical-review-recommended", requiredContentIds: ["medical-vulnerability-review"] }),
  fixture("alcohol-detox-polysubstance", "alcohol-detox", "Alcohol with multiple sedating substances", {
    "alcohol-co-use": ["benzodiazepines", "opioids"],
  }, { safetyAction: "clinical-review-recommended", requiredContentIds: ["benzodiazepine-withdrawal-review", "opioid-overdose-caution"] }),

  fixture("drug-cannabis-consequences", "drug-use", "Cannabis with functional consequences", {
    substances: ["cannabis"],
    "substance-cannabis-frequency": "daily",
    "substance-cannabis-control": "yes",
    "substance-cannabis-impact": "yes",
    "drug-consequences": "significant",
  }, { prohibitedContentIds: ["alcohol-withdrawal-urgent", "benzodiazepine-withdrawal-urgent"] }),
  fixture("drug-stimulant-heavy", "drug-use", "Heavy cocaine or stimulant use", {
    substances: ["stimulants"],
    "substance-stimulant-frequency": "daily-binge",
    "substance-stimulant-sleep": "very-little",
  }, { safetyAction: "clinical-review-recommended", requiredContentIds: ["stimulant-mental-health-review"], prohibitedContentIds: ["alcohol-withdrawal-urgent"] }),
  fixture("drug-stimulant-psychosis", "drug-use", "Current stimulant-related psychotic symptoms", {
    substances: ["stimulants"],
    "substance-stimulant-acute": "psychosis",
  }, { safetyAction: "urgent-same-day-assessment", requiredContentIds: ["stimulant-urgent"], requireCommercialSuppression: true }),
  fixture("drug-opioid-daily", "drug-use", "Daily opioid use", {
    substances: ["opioids"],
    "substance-opioid-frequency": "daily",
  }, { prohibitedContentIds: ["alcohol-withdrawal-urgent"] }),
  fixture("drug-opioid-reduced-tolerance", "drug-use", "Opioid use after reduced tolerance", {
    substances: ["opioids"],
    "substance-opioid-recent-abstinence": "yes",
    "substance-opioid-reduced-tolerance": "yes",
  }, { safetyAction: "clinical-review-recommended", requiredContentIds: ["opioid-tolerance-review"] }),
  fixture("drug-opioid-prior-overdose", "drug-use", "Previous opioid overdose", {
    substances: ["opioids"],
    "substance-opioid-overdose-history": "yes",
  }, { safetyAction: "clinical-review-recommended", requiredContentIds: ["opioid-overdose-caution"] }),
  fixture("drug-opioid-sedative", "drug-use", "Opioid and sedative co-use", {
    substances: ["opioids"],
    "substance-opioid-co-use": ["benzodiazepines"],
  }, { safetyAction: "clinical-review-recommended", requiredContentIds: ["opioid-overdose-caution"] }),
  fixture("drug-benzodiazepine-regular", "drug-use", "Regular benzodiazepine use with intended abrupt reduction", {
    substances: ["benzodiazepines"],
    "substance-benz-frequency": "daily",
    "substance-benz-abrupt": "yes",
  }, { safetyAction: "clinical-review-recommended", requiredContentIds: ["benzodiazepine-withdrawal-review"], prohibitedContentIds: ["alcohol-withdrawal-urgent"] }),
  fixture("drug-ghb-frequent", "drug-use", "Frequent GHB or GBL use", {
    substances: ["ghb-gbl"],
    "substance-ghb-frequency": "multiple-daily",
  }, { safetyAction: "clinical-review-recommended", requiredContentIds: ["ghb-gbl-withdrawal-review"], prohibitedContentIds: ["alcohol-withdrawal-urgent"] }),
  fixture("drug-ketamine-urinary", "drug-use", "Ketamine use with urinary symptoms", {
    substances: ["ketamine"],
    "substance-ketamine-frequency": "daily",
    "substance-ketamine-urinary": "significant",
  }, { safetyAction: "clinical-review-recommended", requiredContentIds: ["ketamine-urinary-review"], prohibitedContentIds: ["alcohol-withdrawal-urgent"] }),
  fixture("drug-multiple-substances", "drug-use", "Multiple substances", {
    substances: ["cannabis", "stimulants"],
  }, { safetyAction: "clinical-review-recommended", requiredContentIds: ["polysubstance-review"] }),

  fixture("detox-alcohol", "detox-suitability", "Alcohol change planning", {
    substances: ["alcohol"],
    "intended-change": "abrupt",
    "substance-alcohol-prior-seizure": "yes",
  }, { safetyAction: "urgent-same-day-assessment", requiredContentIds: ["alcohol-withdrawal-urgent"] }),
  fixture("detox-benzodiazepine", "detox-suitability", "Benzodiazepine change planning", {
    substances: ["benzodiazepines"],
    "intended-change": "abrupt",
    "substance-benz-frequency": "daily",
    "substance-benz-abrupt": "yes",
  }, { safetyAction: "clinical-review-recommended", requiredContentIds: ["benzodiazepine-withdrawal-review"] }),
  fixture("detox-opioid", "detox-suitability", "Opioid change planning after reduced tolerance", {
    substances: ["opioids"],
    "substance-opioid-reduced-tolerance": "yes",
  }, { safetyAction: "clinical-review-recommended", requiredContentIds: ["opioid-tolerance-review"] }),
  fixture("detox-ghb", "detox-suitability", "GHB or GBL change planning with withdrawal", {
    substances: ["ghb-gbl"],
    "substance-ghb-withdrawal": "significant",
  }, { safetyAction: "urgent-same-day-assessment", requiredContentIds: ["ghb-gbl-withdrawal-urgent"] }),
  fixture("detox-stimulant", "detox-suitability", "Stimulant change planning with sleep deprivation", {
    substances: ["stimulants"],
    "substance-stimulant-sleep": "none-two-days",
  }, { safetyAction: "clinical-review-recommended", requiredContentIds: ["stimulant-mental-health-review"], prohibitedContentIds: ["alcohol-withdrawal-urgent"] }),
  fixture("detox-cannabis", "detox-suitability", "Cannabis change planning", {
    substances: ["cannabis"],
    "substance-cannabis-control": "yes",
    "substance-cannabis-withdrawal": "yes",
  }, { prohibitedContentIds: ["alcohol-withdrawal-urgent", "benzodiazepine-withdrawal-urgent"] }),
  fixture("detox-ketamine", "detox-suitability", "Ketamine change planning with urinary symptoms", {
    substances: ["ketamine"],
    "substance-ketamine-urinary": "significant",
  }, { safetyAction: "clinical-review-recommended", requiredContentIds: ["ketamine-urinary-review"] }),
  fixture("detox-polysubstance", "detox-suitability", "Polysubstance change planning", {
    substances: ["benzodiazepines", "opioids"],
  }, { safetyAction: "clinical-review-recommended", requiredContentIds: ["polysubstance-review"] }),
  fixture("detox-contradictory-hidden-opioid-answer", "detox-suitability", "Contradictory branch answers are rejected", {
    substances: ["cannabis"],
    "substance-opioid-overdose-history": "yes",
  }, { validationErrorField: "answers.substance-opioid-overdose-history" }),
  fixture("detox-other-severe", "detox-suitability", "Other substance with severe current symptoms", {
    substances: ["other"],
    "substance-other-name": "Synthetic unlisted substance",
    "substance-other-current-symptoms": "severe",
  }, { safetyAction: "urgent-same-day-assessment", requiredContentIds: ["withdrawal-urgent"] }),
  fixture("detox-medical-vulnerability", "detox-suitability", "Medical vulnerability", {
    substances: ["cannabis"],
    "medical-vulnerability": "yes",
  }, { safetyAction: "clinical-review-recommended", requiredContentIds: ["medical-vulnerability-review"] }),
  fixture("detox-pregnancy", "detox-suitability", "Pregnancy with opioid use", {
    substances: ["opioids"],
    pregnancy: "yes",
  }, { safetyAction: "clinical-review-recommended", requiredContentIds: ["pregnancy-substance-review"] }),
];

export function materialisePhaseBClinicalFixtures() {
  return phaseBClinicalFixtures.map((fixture) => {
    const definition = getActiveDefinition(fixture.assessmentKey);
    let answers: AssessmentAnswers;
    try {
      answers = validateAnswers(definition, fixture.answers);
    } catch (error) {
      if (!(error instanceof AssessmentValidationError) || !fixture.expected.validationErrorField) throw error;
      return {
        approvalStatus: "PENDING CLINICAL DIRECTOR APPROVAL",
        fixtureId: fixture.id,
        assessmentKey: fixture.assessmentKey,
        profile: fixture.profile,
        definitionVersion: definition.version,
        definitionHash: definition.definitionHash,
        exactSyntheticAnswers: fixture.answers,
        validation: { status: "rejected" as const, issues: error.issues },
        validatedInstrumentResult: null,
        instrumentNote: definition.clinicalApproval.notes,
        domainProfile: [],
        triggeredSafetyRules: [],
        safetyAction: null,
        requiredContent: [],
        prohibitedContent: fixture.expected.prohibitedContentIds ?? [],
        deterministicInterpretation: null,
        pathways: [],
        expectedReviewAssertions: fixture.expected,
      };
    }
    const result = evaluateAssessment(definition, answers);
    return {
      approvalStatus: "PENDING CLINICAL DIRECTOR APPROVAL",
      fixtureId: fixture.id,
      assessmentKey: fixture.assessmentKey,
      profile: fixture.profile,
      definitionVersion: definition.version,
      definitionHash: definition.definitionHash,
      exactSyntheticAnswers: answers,
      validation: { status: "accepted" as const, issues: [] },
      validatedInstrumentResult: null,
      instrumentNote: definition.clinicalApproval.notes,
      domainProfile: result.domains,
      triggeredSafetyRules: result.safety.triggeredRules,
      safetyAction: result.safety.action,
      requiredContent: result.safety.content,
      prohibitedContent: fixture.expected.prohibitedContentIds ?? [],
      deterministicInterpretation: result.interpretation,
      pathways: result.pathways,
      expectedReviewAssertions: fixture.expected,
    };
  });
}

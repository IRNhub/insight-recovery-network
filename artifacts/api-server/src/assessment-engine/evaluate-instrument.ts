import type {
  AssessmentAnswers,
  AssessmentDefinition,
  AuthoritativeAssessmentResult,
  ScreeningClassification,
} from "./contracts.ts";

function validatedInstrumentScore(
  definition: AssessmentDefinition,
  answers: AssessmentAnswers,
): { value: number; band: NonNullable<AssessmentDefinition["instrument"]>["bands"][number] } | null {
  const instrument = definition.instrument;
  if (!instrument) return null;

  const questions = new Map(
    definition.sections.flatMap((section) => section.questions).map((question) => [question.id, question]),
  );
  const value = instrument.questionIds.reduce((total, questionId) => {
    const question = questions.get(questionId);
    const answer = answers[questionId];
    if (!question?.options || answer === undefined) return total;
    const values = Array.isArray(answer) ? answer : [answer];
    return total + values.reduce(
      (questionTotal, selected) => questionTotal + (question.options?.find((option) => option.value === selected)?.score ?? 0),
      0,
    );
  }, 0);
  const band = instrument.bands.find(
    (candidate) => value >= candidate.minimumScore && value <= candidate.maximumScore,
  );
  if (!band) throw new Error(`No validated instrument band covers score ${value} for ${instrument.name}`);
  return { value, band };
}

export function evaluateInstrument(
  definition: AssessmentDefinition,
  answers: AssessmentAnswers,
): ScreeningClassification {
  const validated = validatedInstrumentScore(definition, answers);
  if (validated && definition.instrument) {
    return {
      source: "validated-instrument",
      value: validated.value,
      maximumValue: definition.instrument.maximumScore,
      level: validated.band.level,
      label: validated.band.label,
      explanation: definition.instrument.explanation,
      displayScore: true,
    };
  }

  if (definition.scoring.kind === "irn-descriptive-profile") {
    return {
      source: "irn-descriptive-profile",
      value: null,
      maximumValue: null,
      level: "descriptive-profile",
      label: definition.scoring.profileLabel,
      explanation: definition.scoring.explanation,
      displayScore: false,
    };
  }

  let value = 0;
  let maximumValue = 0;

  for (const section of definition.sections) {
    if (section.id === "contact-consent") continue;
    for (const question of section.questions) {
      if (!question.options) continue;
      maximumValue += Math.max(0, ...question.options.map((option) => option.score));
      const answer = answers[question.id];
      if (!answer) continue;
      const selected = Array.isArray(answer) ? answer : [answer];
      for (const selectedValue of selected) {
        value += question.options.find((option) => option.value === selectedValue)?.score ?? 0;
      }
    }
  }

  let level: ScreeningClassification["level"];
  let label: string;
  if (value >= definition.scoring.possibleDetoxRisk) {
    level = "elevated-concern";
    label = "Elevated concern";
  } else if (value >= definition.scoring.higherConcern) {
    level = "higher-concern";
    label = "Higher concern";
  } else if (value >= definition.scoring.moderateConcern) {
    level = "moderate-concern";
    label = "Moderate concern";
  } else {
    level = "lower-concern";
    label = "Lower concern";
  }

  return {
    source: "irn-legacy-custom",
    value,
    maximumValue,
    level,
    label,
    explanation: "This is an IRN-developed descriptive score retained for Phase A compatibility. It is not a validated instrument score and is separate from the safety guidance below.",
    displayScore: true,
  };
}

export function evaluateInstrumentResult(
  definition: AssessmentDefinition,
  answers: AssessmentAnswers,
): AuthoritativeAssessmentResult["instrument"] {
  const validated = validatedInstrumentScore(definition, answers);
  if (!validated || !definition.instrument) return null;
  return {
    name: definition.instrument.name,
    version: definition.instrument.version,
    rawScore: validated.value,
    maximumScore: definition.instrument.maximumScore,
    band: validated.band.label,
  };
}

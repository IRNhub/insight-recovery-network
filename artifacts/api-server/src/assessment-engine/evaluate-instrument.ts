import type {
  AssessmentAnswers,
  AssessmentDefinition,
  ScreeningClassification,
} from "./contracts.ts";

export function evaluateInstrument(
  definition: AssessmentDefinition,
  answers: AssessmentAnswers,
): ScreeningClassification {
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
  };
}

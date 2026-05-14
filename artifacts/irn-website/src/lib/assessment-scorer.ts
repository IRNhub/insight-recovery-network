import type { AssessmentConfig, AssessmentAnswers, ScoreResult, ScoreLevel } from "@/types/assessment";

const SCORE_LABELS: Record<ScoreLevel, string> = {
  "lower-concern": "Lower Concern",
  "moderate-concern": "Moderate Concern",
  "higher-concern": "Higher Concern",
  "possible-detox-risk": "Possible Detox Risk",
  "urgent-medical-advice": "Urgent Medical Advice Recommended",
};

const SCORE_TAGLINES: Record<ScoreLevel, string> = {
  "lower-concern":
    "Your responses suggest a lower level of clinical concern at this time.",
  "moderate-concern":
    "Your responses indicate a moderate level of concern that warrants further support.",
  "higher-concern":
    "Your responses suggest a higher level of concern. A clinical conversation is strongly recommended.",
  "possible-detox-risk":
    "Your responses indicate that detoxing without medical support could be unsafe. Please do not stop drinking suddenly.",
  "urgent-medical-advice":
    "Based on your responses, we strongly recommend seeking medical advice before making any changes to your drinking.",
};

const SCORE_COLOURS: Record<ScoreLevel, string> = {
  "lower-concern": "#2e7d52",
  "moderate-concern": "#b08a2a",
  "higher-concern": "#c0622a",
  "possible-detox-risk": "#9b2a2a",
  "urgent-medical-advice": "#6b1a1a",
};

const IMMEDIATE_RED_FLAGS = new Set([
  "seizure-history",
  "hallucinations",
  "mental-health-risk",
]);

export function scoreAssessment(
  config: AssessmentConfig,
  answers: AssessmentAnswers
): ScoreResult {
  let totalScore = 0;
  const triggeredRedFlags: string[] = [];

  for (const section of config.sections) {
    for (const question of section.questions) {
      const answer = answers[question.id];
      if (!answer || !question.options) continue;

      const selectedValues = Array.isArray(answer) ? answer : [answer];

      for (const value of selectedValues) {
        const option = question.options.find((o) => o.value === value);
        if (!option) continue;

        totalScore += option.score;

        if (option.redFlag && question.redFlagKey) {
          if (!triggeredRedFlags.includes(question.redFlagKey)) {
            triggeredRedFlags.push(question.redFlagKey);
          }
        }
      }
    }
  }

  const immediateFlags = triggeredRedFlags.filter((f) =>
    IMMEDIATE_RED_FLAGS.has(f)
  );
  const redFlagCount = triggeredRedFlags.length;

  let level: ScoreLevel;

  if (immediateFlags.length >= 1 || redFlagCount >= 3) {
    level = "urgent-medical-advice";
  } else if (redFlagCount >= 2 || totalScore >= config.scoreThresholds.possibleDetoxRisk) {
    level = "possible-detox-risk";
  } else if (redFlagCount >= 1 || totalScore >= config.scoreThresholds.higherConcern) {
    level = "higher-concern";
  } else if (totalScore >= config.scoreThresholds.moderateConcern) {
    level = "moderate-concern";
  } else {
    level = "lower-concern";
  }

  return {
    value: totalScore,
    level,
    redFlags: triggeredRedFlags,
    label: SCORE_LABELS[level],
    colour: SCORE_COLOURS[level],
    tagline: SCORE_TAGLINES[level],
  };
}

export function buildSectionSummary(
  config: AssessmentConfig,
  answers: AssessmentAnswers
): string {
  const lines: string[] = [];

  for (const section of config.sections) {
    const sectionLines: string[] = [`${section.title}:`];
    for (const question of section.questions) {
      const answer = answers[question.id];
      if (!answer) continue;
      if (!question.options) {
        sectionLines.push(`  - ${question.text}: ${answer}`);
        continue;
      }
      const selectedValues = Array.isArray(answer) ? answer : [answer];
      const labels = selectedValues
        .map((v) => question.options!.find((o) => o.value === v)?.label ?? v)
        .join(", ");
      sectionLines.push(`  - ${question.text}: ${labels}`);
    }
    lines.push(sectionLines.join("\n"));
  }

  return lines.join("\n\n");
}

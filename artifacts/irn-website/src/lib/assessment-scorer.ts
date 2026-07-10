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

const BAND_NAMES: Record<string, Partial<Record<ScoreLevel, string>>> = {
  depression: {
    "lower-concern": "Minimal to mild indication",
    "moderate-concern": "Moderate indication",
    "higher-concern": "Moderately severe to severe",
    "urgent-medical-advice": "Severe, urgent support recommended",
  },
  anxiety: {
    "lower-concern": "Minimal to mild indication",
    "moderate-concern": "Moderate indication",
    "higher-concern": "Severe indication",
    "urgent-medical-advice": "Severe, urgent support recommended",
  },
  "alcohol-use": {
    "lower-concern": "Low risk",
    "moderate-concern": "Increasing risk",
    "higher-concern": "Higher risk",
    "possible-detox-risk": "Possible dependence",
    "urgent-medical-advice": "High dependence, urgent support recommended",
  },
  adhd: {
    "lower-concern": "Low indication",
    "moderate-concern": "Moderate indication",
    "higher-concern": "High indication",
    "urgent-medical-advice": "High indication, urgent support recommended",
  },
  "drug-use": {
    "lower-concern": "Low risk indication",
    "moderate-concern": "Moderate concern",
    "higher-concern": "High concern",
    "urgent-medical-advice": "High concern, urgent support recommended",
  },
  "alcohol-detox": {
    "lower-concern": "Lower Concern",
    "moderate-concern": "Moderate Concern",
    "higher-concern": "Higher Concern",
    "possible-detox-risk": "Possible Detox Risk",
    "urgent-medical-advice": "Urgent Medical Advice Recommended",
  },
};

function getBandName(assessmentId: string, level: ScoreLevel): string {
  return BAND_NAMES[assessmentId]?.[level] ?? SCORE_LABELS[level];
}

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
  const triggeredAdvisories: string[] = [];

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

        if (option.advisoryKey && !triggeredAdvisories.includes(option.advisoryKey)) {
          triggeredAdvisories.push(option.advisoryKey);
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
    advisories: triggeredAdvisories,
    label: SCORE_LABELS[level],
    bandName: getBandName(config.id, level),
    colour: SCORE_COLOURS[level],
    tagline: SCORE_TAGLINES[level],
  };
}

/**
 * Builds a structured clinical brief for Anchor AI.
 * Sends domain-level analysis with only elevated/notable responses,  * NOT a verbatim Q&A transcript. This prevents Anchor from simply
 * repeating answers back to the user.
 */
export function buildClinicalBrief(
  config: AssessmentConfig,
  answers: AssessmentAnswers,
  scoreResult: ScoreResult
): string {
  const lines: string[] = [];

  lines.push(`Assessment: ${config.title}`);
  lines.push(`Total score: ${scoreResult.value}`);
  lines.push(`Result band: ${scoreResult.bandName}`);
  lines.push(`Score level: ${scoreResult.level}`);

  if (scoreResult.redFlags.length > 0) {
    lines.push(`Risk indicators triggered: ${scoreResult.redFlags.join(", ")}`);
  }

  lines.push("");
  lines.push("Domain analysis (section scores and elevated findings):");

  for (const section of config.sections) {
    if (section.id === "contact-consent") continue;

    let sectionScore = 0;
    let sectionMax = 0;
    const notableFindings: string[] = [];

    for (const question of section.questions) {
      if (!question.options) continue;
      const answer = answers[question.id];
      if (!answer) continue;

      const maxOptionScore = Math.max(...question.options.map((o) => o.score));
      sectionMax += maxOptionScore;

      const selectedValues = Array.isArray(answer) ? answer : [answer];
      for (const value of selectedValues) {
        const option = question.options.find((o) => o.value === value);
        if (!option) continue;
        sectionScore += option.score;

        const isElevated =
          maxOptionScore > 0 &&
          option.score > 0 &&
          (option.score / maxOptionScore >= 0.5 || option.score >= 3);

        if (isElevated || option.redFlag || option.advisoryKey) {
          const theme = question.text
            .replace(/\?$/, "")
            .replace(/How often do you (have difficulty )?/i, "")
            .replace(/^Do you /i, "")
            .replace(/^Are you /i, "")
            .replace(/^Have you /i, "");
          const severity = option.redFlag
            ? `${option.label} [flagged]`
            : option.advisoryKey
            ? `${option.label} [advisory]`
            : option.label;
          // Capitalise first letter of theme
          const cleanTheme =
            theme.charAt(0).toUpperCase() + theme.slice(1);
          notableFindings.push(`${cleanTheme}: ${severity}`);
        }
      }
    }

    const sectionTitle = section.title.replace(/Section \d+ of \d+: /, "");
    const scoreStr = sectionMax > 0 ? ` (${sectionScore}/${sectionMax})` : "";
    if (notableFindings.length > 0) {
      lines.push(`\n  ${sectionTitle}${scoreStr}:`);
      for (const finding of notableFindings) {
        lines.push(`    - ${finding}`);
      }
    } else {
      lines.push(`\n  ${sectionTitle}${scoreStr}: no elevated responses`);
    }
  }

  return lines.join("\n");
}

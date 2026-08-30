import type {
  AssessmentAnswers,
  AssessmentDefinition,
  SafetyAction,
  SafetyContent,
  SafetyResult,
  SafetyRule,
  TriggeredSafetyRule,
} from "./contracts.ts";
import { answerConditionMatches } from "./branching.ts";
import { getSafetyContent } from "./safety-content.ts";

const ACTION_RANK: Record<SafetyAction, number> = {
  "no-immediate-warning-identified": 0,
  "additional-caution": 1,
  "clinical-review-recommended": 2,
  "urgent-same-day-assessment": 3,
  "emergency-help-now": 4,
};

const ACTION_HEADING: Record<SafetyAction, string> = {
  "no-immediate-warning-identified": "Your answers have not identified an immediate warning sign within this screening tool",
  "additional-caution": "Additional caution is appropriate",
  "clinical-review-recommended": "A clinical review is recommended",
  "urgent-same-day-assessment": "Please seek urgent professional support today",
  "emergency-help-now": "Please get emergency help now",
};

function ruleMatches(rule: SafetyRule, answers: AssessmentAnswers): boolean {
  const allMatch = !rule.all || rule.all.every((condition) => answerConditionMatches(condition, answers));
  const anyMatch = !rule.any || rule.any.some((condition) => answerConditionMatches(condition, answers));
  return allMatch && anyMatch;
}

function buildSafetyContent(matched: SafetyRule[]): SafetyContent[] {
  const contentIds = matched.length > 0
    ? [...new Set(matched.map((rule) => rule.contentId))]
    : ["screening-limitation" as const];
  const hasPhqItemNine = contentIds.includes("phq9-item9-review");
  const sharedMentalHealthId = contentIds.find((id) => [
    "mental-health-support",
    "mental-health-current-review",
    "mental-health-urgent",
    "mental-health-emergency",
  ].includes(id));

  if (hasPhqItemNine && sharedMentalHealthId) {
    const base = getSafetyContent(sharedMentalHealthId);
    return [{
      ...base,
      body: `${base.body} Your PHQ-9 item 9 response remains part of the PHQ-9 score, but it is not a suicide-risk score. The symptom total does not determine immediate safety. This guidance is based on your separate safety answer and current context.`,
    }];
  }

  return contentIds.map(getSafetyContent);
}

export function evaluateSafety(
  definition: AssessmentDefinition,
  answers: AssessmentAnswers,
): SafetyResult {
  const matched = definition.safetyRules.filter((rule) => ruleMatches(rule, answers));
  const action = matched.reduce<SafetyAction>(
    (highest, rule) => ACTION_RANK[rule.action] > ACTION_RANK[highest] ? rule.action : highest,
    "no-immediate-warning-identified",
  );

  const triggeredRules: TriggeredSafetyRule[] = matched.map((rule) => ({
    id: rule.id,
    version: rule.version,
    action: rule.action,
    evidenceQuestionIds: rule.evidenceQuestionIds,
    contentId: rule.contentId,
    pathwayIds: rule.pathwayIds,
    approvalStatus: rule.approval.status,
  }));
  return {
    action,
    publicHeading: ACTION_HEADING[action],
    limitation: "This online assessment cannot rule out medical or mental-health risk. Seek professional or emergency help whenever you feel concerned or unsafe.",
    triggeredRules,
    content: buildSafetyContent(matched),
    suppressCommercialCtas:
      action === "urgent-same-day-assessment"
      || action === "emergency-help-now"
      || matched.some((rule) => rule.suppressCommercialCtas),
  };
}

export function safetyActionRank(action: SafetyAction): number {
  return ACTION_RANK[action];
}

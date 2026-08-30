import type {
  AnswerCondition,
  AssessmentAnswers,
  AssessmentDefinition,
  SafetyAction,
  SafetyResult,
  SafetyRule,
  TriggeredSafetyRule,
} from "./contracts.ts";
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

function conditionMatches(condition: AnswerCondition, answers: AssessmentAnswers): boolean {
  const answer = answers[condition.questionId];
  if (answer === undefined) return false;
  const values = Array.isArray(answer) ? answer : [answer];
  if (condition.equals !== undefined) return values.length === 1 && values[0] === condition.equals;
  if (condition.includes !== undefined) return values.includes(condition.includes);
  if (condition.oneOf !== undefined) return values.some((value) => condition.oneOf!.includes(value));
  return false;
}

function ruleMatches(rule: SafetyRule, answers: AssessmentAnswers): boolean {
  const allMatch = !rule.all || rule.all.every((condition) => conditionMatches(condition, answers));
  const anyMatch = !rule.any || rule.any.some((condition) => conditionMatches(condition, answers));
  return allMatch && anyMatch;
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
  const contentIds = matched.length > 0
    ? [...new Set(matched.map((rule) => rule.contentId))]
    : ["screening-limitation" as const];

  return {
    action,
    publicHeading: ACTION_HEADING[action],
    limitation: "This online assessment cannot rule out medical or mental-health risk. Seek professional or emergency help whenever you feel concerned or unsafe.",
    triggeredRules,
    content: contentIds.map(getSafetyContent),
    suppressCommercialCtas:
      action === "emergency-help-now" || matched.some((rule) => rule.suppressCommercialCtas),
  };
}

export function safetyActionRank(action: SafetyAction): number {
  return ACTION_RANK[action];
}

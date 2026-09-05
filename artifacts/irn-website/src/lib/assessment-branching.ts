import type {
  AnswerCondition,
  AssessmentAnswers,
  BranchConditionSet,
  PublicAssessmentConfig,
  PublicAssessmentQuestion,
} from "@/types/assessment";

function conditionMatches(condition: AnswerCondition, answers: AssessmentAnswers): boolean {
  const answer = answers[condition.questionId];
  if (answer === undefined) return false;
  const values = Array.isArray(answer) ? answer : [answer];
  if (condition.equals !== undefined && !(values.length === 1 && values[0] === condition.equals)) return false;
  if (condition.includes !== undefined && !values.includes(condition.includes)) return false;
  if (condition.notIncludes !== undefined && values.includes(condition.notIncludes)) return false;
  if (condition.oneOf !== undefined && !values.some((value) => condition.oneOf!.includes(value))) return false;
  if (condition.minimumSelections !== undefined && values.length < condition.minimumSelections) return false;
  return true;
}

export function branchMatches(
  conditions: BranchConditionSet | undefined,
  answers: AssessmentAnswers,
): boolean {
  if (!conditions) return true;
  return (!conditions.all || conditions.all.every((condition) => conditionMatches(condition, answers))) &&
    (!conditions.any || conditions.any.some((condition) => conditionMatches(condition, answers)));
}

export function visibleAssessmentSections(config: PublicAssessmentConfig, answers: AssessmentAnswers) {
  return config.sections
    .filter((section) => branchMatches(section.displayWhen, answers))
    .map((section) => ({
      ...section,
      questions: section.questions.filter((question) => branchMatches(question.displayWhen, answers)),
    }))
    .filter((section) => section.questions.length > 0);
}

export function pruneHiddenAnswers(
  config: PublicAssessmentConfig,
  answers: AssessmentAnswers,
): AssessmentAnswers {
  const visibleIds = new Set(
    visibleAssessmentSections(config, answers)
      .flatMap((section) => section.questions)
      .map((question: PublicAssessmentQuestion) => question.id),
  );
  return Object.fromEntries(Object.entries(answers).filter(([id]) => visibleIds.has(id)));
}

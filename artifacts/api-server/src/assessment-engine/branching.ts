import type {
  AnswerCondition,
  AssessmentAnswers,
  AssessmentQuestion,
  AssessmentSection,
  BranchConditionSet,
} from "./contracts.ts";

export function answerConditionMatches(
  condition: AnswerCondition,
  answers: AssessmentAnswers,
): boolean {
  const answer = answers[condition.questionId];
  if (answer === undefined) return false;
  const values = Array.isArray(answer) ? answer : [answer];

  if (condition.equals !== undefined && !(values.length === 1 && values[0] === condition.equals)) {
    return false;
  }
  if (condition.includes !== undefined && !values.includes(condition.includes)) return false;
  if (condition.notIncludes !== undefined && values.includes(condition.notIncludes)) return false;
  if (condition.oneOf !== undefined && !values.some((value) => condition.oneOf!.includes(value))) {
    return false;
  }
  if (condition.minimumSelections !== undefined && values.length < condition.minimumSelections) {
    return false;
  }
  return true;
}

export function branchConditionsMatch(
  conditions: BranchConditionSet | undefined,
  answers: AssessmentAnswers,
): boolean {
  if (!conditions) return true;
  const allMatch = !conditions.all || conditions.all.every((condition) => answerConditionMatches(condition, answers));
  const anyMatch = !conditions.any || conditions.any.some((condition) => answerConditionMatches(condition, answers));
  return allMatch && anyMatch;
}

export function sectionIsApplicable(section: AssessmentSection, answers: AssessmentAnswers): boolean {
  return branchConditionsMatch(section.displayWhen, answers);
}

export function questionIsApplicable(
  section: AssessmentSection,
  question: AssessmentQuestion,
  answers: AssessmentAnswers,
): boolean {
  return sectionIsApplicable(section, answers) && branchConditionsMatch(question.displayWhen, answers);
}

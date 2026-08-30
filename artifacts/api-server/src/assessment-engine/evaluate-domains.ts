import type {
  AssessmentAnswers,
  AssessmentDefinition,
  DomainResult,
  DomainState,
} from "./contracts.ts";

const STATE_ORDER: DomainState[] = ["not-indicated", "present", "elevated", "prominent"];

export function domainStateRank(state: DomainState): number {
  return STATE_ORDER.indexOf(state);
}

function stateFor(score: number, maximumScore: number): DomainState {
  if (score <= 0 || maximumScore <= 0) return "not-indicated";
  const ratio = score / maximumScore;
  if (ratio < 0.25) return "present";
  if (ratio < 0.6) return "elevated";
  return "prominent";
}

export function evaluateDomains(
  definition: AssessmentDefinition,
  answers: AssessmentAnswers,
): DomainResult[] {
  const sectionMap = new Map(definition.sections.map((section) => [section.id, section]));

  return definition.domainRules.map((rule) => {
    const section = sectionMap.get(rule.sectionId);
    let score = 0;
    let maximumScore = 0;
    const evidenceQuestionIds: string[] = [];

    for (const question of section?.questions ?? []) {
      if (!question.options) continue;
      maximumScore += Math.max(0, ...question.options.map((option) => option.score));
      const answer = answers[question.id];
      if (!answer) continue;
      const values = Array.isArray(answer) ? answer : [answer];
      for (const value of values) {
        const option = question.options.find((candidate) => candidate.value === value);
        if (!option) continue;
        score += option.score;
        if (option.score > 0) evidenceQuestionIds.push(question.id);
      }
    }

    return {
      id: rule.id,
      label: rule.label,
      score,
      maximumScore,
      state: stateFor(score, maximumScore),
      evidenceQuestionIds: [...new Set(evidenceQuestionIds)],
      summary: rule.elevatedText,
      whyItMatters: rule.whyItMatters,
    };
  });
}

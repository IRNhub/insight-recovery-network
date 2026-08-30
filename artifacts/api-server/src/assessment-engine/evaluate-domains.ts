import type {
  AssessmentAnswers,
  AssessmentDefinition,
  DomainResult,
  DomainState,
} from "./contracts.ts";
import { questionIsApplicable } from "./branching.ts";

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
  const questionEntries = definition.sections.flatMap((section) =>
    section.questions.map((question) => ({ section, question })),
  );

  return definition.domainRules.map((rule) => {
    const entries = questionEntries.filter(({ section, question }) =>
      (rule.questionIds?.includes(question.id) || (!rule.questionIds && section.id === rule.sectionId)) &&
      questionIsApplicable(section, question, answers),
    );
    let score = 0;
    let maximumScore = 0;
    const evidenceQuestionIds: string[] = [];

    for (const { question } of entries) {
      if (!question.options) continue;
      maximumScore += question.type === "checkbox"
        ? question.options.reduce((total, option) => total + Math.max(0, option.score), 0)
        : Math.max(0, ...question.options.map((option) => option.score));
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

    const state = stateFor(score, maximumScore);
    const summary = state === "not-indicated"
      ? `Your answers did not identify ${rule.label.toLowerCase()} as a prominent part of this profile.`
      : state === "present"
        ? `${rule.label} is present in the profile but did not stand out as an elevated area.`
        : rule.elevatedText;

    return {
      id: rule.id,
      label: rule.label,
      score,
      maximumScore,
      state,
      evidenceQuestionIds: [...new Set(evidenceQuestionIds)],
      summary,
      whyItMatters: rule.whyItMatters,
    };
  });
}

import type {
  AssessmentAnswers,
  AssessmentDefinition,
  DeterministicInterpretation,
  DomainResult,
  PatternFinding,
  ScreeningClassification,
} from "./contracts.ts";
import { answerConditionMatches } from "./branching.ts";
import { domainStateRank } from "./evaluate-domains.ts";

export function buildInterpretation(
  definition: AssessmentDefinition,
  answers: AssessmentAnswers,
  screening: ScreeningClassification,
  domains: DomainResult[],
): DeterministicInterpretation {
  const domainMap = new Map(domains.map((domain) => [domain.id, domain]));
  const matchedCombinationRules = definition.interpretationRules
    .filter((rule) => (rule.minimumDomainIds ?? rule.domainIds).every((id) => {
      const domain = domainMap.get(id);
      return domain && domainStateRank(domain.state) >= domainStateRank(rule.minimumState);
    }))
    .filter((rule) => !rule.all || rule.all.every((condition) => answerConditionMatches(condition, answers)))
    .filter((rule) => !rule.any || rule.any.some((condition) => answerConditionMatches(condition, answers)))
    .sort((a, b) => b.priority - a.priority);

  const keyPatterns: PatternFinding[] = matchedCombinationRules.slice(0, 2).map((rule) => ({
    id: rule.id,
    title: rule.domainIds.map((id) => domainMap.get(id)?.label ?? id).join(" and "),
    statement: rule.statement,
    whyItMatters: rule.whyItMatters,
    evidenceDomainIds: rule.domainIds,
  }));

  const rankedDomains = domains
    .filter((domain) => domain.state !== "not-indicated")
    .sort((a, b) => domainStateRank(b.state) - domainStateRank(a.state) || b.score - a.score);

  for (const domain of rankedDomains) {
    if (keyPatterns.length >= 4) break;
    if (keyPatterns.some((pattern) => pattern.evidenceDomainIds.includes(domain.id))) continue;
    keyPatterns.push({
      id: `domain.${domain.id}`,
      title: domain.label,
      statement: domain.summary,
      whyItMatters: domain.whyItMatters,
      evidenceDomainIds: [domain.id],
    });
  }

  const topLabels = rankedDomains.slice(0, 2).map((domain) => domain.label.toLowerCase());
  const summary = screening.source === "irn-descriptive-profile"
    ? topLabels.length >= 2
      ? `Your descriptive profile is mainly shaped by ${topLabels[0]} together with ${topLabels[1]}. Looking at how these areas interact is more useful than treating them as one combined score.`
      : topLabels.length === 1
        ? `Your descriptive profile is mainly shaped by ${topLabels[0]}. This profile has no combined total, and the safety guidance remains separate.`
        : "No single domain stood out in this descriptive profile. That does not rule out a need for professional support, and the safety guidance remains separate."
    : topLabels.length >= 2
      ? `Your ${screening.label.toLowerCase()} result is mainly shaped by ${topLabels[0]} together with ${topLabels[1]}. The interaction between those areas provides useful context for the screening score.`
      : topLabels.length === 1
        ? `Your ${screening.label.toLowerCase()} result is mainly shaped by ${topLabels[0]}. The safety guidance and limitations remain separate from this score.`
        : `Your answers fall within the ${screening.label.toLowerCase()} range. No single context domain was elevated, but this does not rule out a need for professional support.`;

  const protectiveFactors: PatternFinding[] = [];
  const readinessDomainId = domains.some((domain) => domain.id === "readiness-support")
    ? "readiness-support"
    : domains.some((domain) => domain.id === "mental-health-readiness")
      ? "mental-health-readiness"
      : "readiness";
  if (answers["support"] === "yes") {
    protectiveFactors.push({ id: "protective.available-support", title: "Available support", statement: "You indicated that someone may be available to support you.", whyItMatters: "Practical support can help with planning, but it does not replace medical assessment where safety concerns are present.", evidenceDomainIds: [readinessDomainId] });
  }
  if (answers["motivation"] === "ready" || answers["readiness"] === "ready" || answers["readiness"] === "already-changing") {
    protectiveFactors.push({ id: "protective.readiness", title: "Readiness to seek change", statement: "You indicated that you feel ready to make or continue a change.", whyItMatters: "Readiness can help engagement with support, while the safest method still depends on clinical context.", evidenceDomainIds: [readinessDomainId] });
  }

  const limitations = [
    "This result is not a diagnosis or medical clearance.",
    screening.explanation,
    "A qualified professional can assess history, current symptoms, physical health, medication and circumstances that this online screen cannot establish.",
  ];
  if (definition.key === "adhd") limitations.splice(1, 0, "A screening result cannot diagnose ADHD.");

  return {
    summary,
    keyPatterns,
    whyThisMatters: keyPatterns.slice(0, 3).map((pattern) => pattern.whyItMatters),
    protectiveFactors,
    limitations,
  };
}

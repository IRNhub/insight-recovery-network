import type {
  AssessmentAnswers,
  AssessmentDefinition,
  DeterministicInterpretation,
  DomainResult,
  PatternFinding,
  ScreeningClassification,
} from "./contracts.ts";
import { domainStateRank } from "./evaluate-domains.ts";

export function buildInterpretation(
  definition: AssessmentDefinition,
  answers: AssessmentAnswers,
  screening: ScreeningClassification,
  domains: DomainResult[],
): DeterministicInterpretation {
  const domainMap = new Map(domains.map((domain) => [domain.id, domain]));
  const matchedCombinationRules = definition.interpretationRules
    .filter((rule) => rule.domainIds.every((id) => {
      const domain = domainMap.get(id);
      return domain && domainStateRank(domain.state) >= domainStateRank(rule.minimumState);
    }))
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
  const summary = topLabels.length >= 2
    ? `Your ${screening.label.toLowerCase()} descriptive result is mainly shaped by ${topLabels[0]} together with ${topLabels[1]}. The interaction between those areas is more useful than the total score alone.`
    : topLabels.length === 1
      ? `Your ${screening.label.toLowerCase()} descriptive result is mainly shaped by ${topLabels[0]}. The safety guidance and limitations remain separate from this score.`
      : `Your answers fall within the ${screening.label.toLowerCase()} range of this IRN-developed descriptive screen. No single domain was elevated, but this does not rule out a need for professional support.`;

  const protectiveFactors: PatternFinding[] = [];
  if (answers["support"] === "yes") {
    protectiveFactors.push({ id: "protective.available-support", title: "Available support", statement: "You indicated that someone may be available to support you.", whyItMatters: "Practical support can help with planning, but it does not replace medical assessment where safety concerns are present.", evidenceDomainIds: ["readiness"] });
  }
  if (answers["motivation"] === "ready") {
    protectiveFactors.push({ id: "protective.readiness", title: "Readiness to seek change", statement: "You indicated that you feel ready to make a change.", whyItMatters: "Readiness can help engagement with support, while the safest method still depends on clinical context.", evidenceDomainIds: ["readiness", "mental-health-readiness"] });
  }

  return {
    summary,
    keyPatterns,
    whyThisMatters: keyPatterns.slice(0, 3).map((pattern) => pattern.whyItMatters),
    protectiveFactors,
    limitations: [
      "This result is not a diagnosis or medical clearance.",
      screening.explanation,
      "A qualified professional can assess history, current symptoms, physical health, medication and circumstances that this online screen cannot establish.",
    ],
  };
}

import type {
  AssessmentDefinition,
  DomainResult,
  PathwayRecommendation,
  SafetyResult,
  ScreeningClassification,
} from "./contracts.ts";

export function selectPathways(
  definition: AssessmentDefinition,
  screening: ScreeningClassification,
  safety: SafetyResult,
  domains: DomainResult[] = [],
): PathwayRecommendation[] {
  const byId = new Map(definition.pathwayRules.map((pathway) => [pathway.id, pathway]));
  const requiredIds = new Set(safety.triggeredRules.flatMap((rule) => rule.pathwayIds));

  if (safety.action === "emergency-help-now") requiredIds.add("emergency-999");
  if (safety.action === "urgent-same-day-assessment" && requiredIds.size === 0) requiredIds.add("urgent-medical");
  if (safety.action === "clinical-review-recommended") requiredIds.add("gp-review");

  if (safety.action === "no-immediate-warning-identified" || safety.action === "additional-caution") {
    if (definition.key === "adhd") requiredIds.add("formal-adhd");
    else if (["anxiety", "depression"].includes(definition.key)) requiredIds.add("nhs-mental-health");
    else if (screening.source === "irn-descriptive-profile") {
      const elevatedDomains = domains.filter((domain) => ["elevated", "prominent"].includes(domain.state));
      if (elevatedDomains.length === 0) requiredIds.add("self-guided");
      requiredIds.add("nhs-substance-service");
      if (elevatedDomains.some((domain) => ["physical-health", "withdrawal", "withdrawal-complications", "overdose-tolerance"].includes(domain.id))) {
        requiredIds.add("gp-review");
      }
    }
    else if (screening.level === "lower-concern") requiredIds.add("self-guided");
    else requiredIds.add("gp-review");
  }

  if (!safety.suppressCommercialCtas && safety.action !== "emergency-help-now") {
    requiredIds.add("irn-consultation");
    if (screening.source === "irn-descriptive-profile" && safety.action !== "urgent-same-day-assessment") {
      const prominent = domains.filter((domain) => domain.state === "prominent");
      if (prominent.some((domain) => ["control-consequences", "impaired-control", "dependence-indicators"].includes(domain.id))) {
        requiredIds.add("treatment-placement");
      } else {
        requiredIds.add("irn-online-programme");
      }
    }
  }

  return [...requiredIds]
    .map((id, index) => {
      const pathway = byId.get(id);
      if (!pathway) return null;
      return { ...pathway, priority: 100 - index } satisfies PathwayRecommendation;
    })
    .filter((pathway): pathway is PathwayRecommendation => pathway !== null)
    .filter((pathway) => !safety.suppressCommercialCtas || !pathway.commercial)
    .sort((a, b) => b.priority - a.priority);
}

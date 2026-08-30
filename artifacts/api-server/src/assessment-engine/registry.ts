import { createHash } from "node:crypto";
import type {
  AssessmentDefinition,
  AssessmentKey,
  ClinicalApprovalMetadata,
  DomainRule,
  InterpretationRule,
  PathwayDefinition,
  PublicAssessmentDefinition,
  SafetyRule,
} from "./contracts.ts";
import { legacyDefinitionSnapshotV1 } from "./legacy-definition-snapshot-v1.ts";

export const ENGINE_VERSION = "phase-a-v1";

const FOUNDATION_APPROVAL: ClinicalApprovalMetadata = {
  status: "approved",
  reference: "IRN-ASSESSMENT-PHASE-A-AUTHORISATION-2026-08-30",
  approvedBy: "Craig Bilton, Clinical Director",
  approvedAt: "2026-08-30",
  notes: "Authorised shared architecture and conservative P0 separation. Future validated instruments remain Phase B onward.",
};

const PENDING_RULE_APPROVAL: ClinicalApprovalMetadata = {
  status: "pending-clinical-director",
  reference: "IRN-ASSESSMENT-SAFETY-RULES-V1",
  notes: "Conservative Phase A response to existing answer states. Exact question wording and thresholds require fixture-level Clinical Director approval before Phase B.",
};

function safetyRule(
  rule: Omit<SafetyRule, "version" | "approval"> & { approval?: ClinicalApprovalMetadata },
): SafetyRule {
  return {
    ...rule,
    version: 1,
    approval: rule.approval ?? PENDING_RULE_APPROVAL,
  };
}

const SELF_HARM_RULES: Partial<Record<AssessmentKey, SafetyRule[]>> = {
  "alcohol-use": [
    safetyRule({ id: "mental-health.significant.alcohol-use", action: "urgent-same-day-assessment", all: [{ questionId: "mental-health", equals: "yes-self-harm" }], evidenceQuestionIds: ["mental-health"], contentId: "mental-health-urgent", pathwayIds: ["urgent-mental-health", "samaritans"], suppressCommercialCtas: true }),
    safetyRule({ id: "mental-health.mood.alcohol-use", action: "additional-caution", all: [{ questionId: "mental-health", equals: "yes-mood" }], evidenceQuestionIds: ["mental-health"], contentId: "mental-health-support", pathwayIds: ["gp-review"], suppressCommercialCtas: false }),
  ],
  "alcohol-detox": [
    safetyRule({ id: "mental-health.significant.alcohol-detox", action: "urgent-same-day-assessment", all: [{ questionId: "mental-health", equals: "yes-self-harm" }], evidenceQuestionIds: ["mental-health"], contentId: "mental-health-urgent", pathwayIds: ["urgent-mental-health", "samaritans"], suppressCommercialCtas: true }),
    safetyRule({ id: "mental-health.mood.alcohol-detox", action: "additional-caution", all: [{ questionId: "mental-health", equals: "yes-mood" }], evidenceQuestionIds: ["mental-health"], contentId: "mental-health-support", pathwayIds: ["gp-review"], suppressCommercialCtas: false }),
  ],
  "drug-use": [
    safetyRule({ id: "mental-health.significant.drug-use", action: "urgent-same-day-assessment", all: [{ questionId: "mental-health", equals: "yes-self-harm" }], evidenceQuestionIds: ["mental-health"], contentId: "mental-health-urgent", pathwayIds: ["urgent-mental-health", "samaritans"], suppressCommercialCtas: true }),
    safetyRule({ id: "mental-health.mood.drug-use", action: "additional-caution", all: [{ questionId: "mental-health", equals: "yes-mood" }], evidenceQuestionIds: ["mental-health"], contentId: "mental-health-support", pathwayIds: ["gp-review"], suppressCommercialCtas: false }),
  ],
  "detox-suitability": [
    safetyRule({ id: "mental-health.significant.detox", action: "urgent-same-day-assessment", all: [{ questionId: "mental-health", equals: "yes-self-harm" }], evidenceQuestionIds: ["mental-health"], contentId: "mental-health-urgent", pathwayIds: ["urgent-mental-health", "samaritans"], suppressCommercialCtas: true }),
    safetyRule({ id: "mental-health.mood.detox", action: "additional-caution", all: [{ questionId: "mental-health", equals: "yes-mood" }], evidenceQuestionIds: ["mental-health"], contentId: "mental-health-support", pathwayIds: ["gp-review"], suppressCommercialCtas: false }),
  ],
  anxiety: [
    safetyRule({ id: "self-harm.significant.anxiety", action: "urgent-same-day-assessment", all: [{ questionId: "self-harm", equals: "yes-significant" }], evidenceQuestionIds: ["self-harm"], contentId: "mental-health-urgent", pathwayIds: ["urgent-mental-health", "samaritans"], suppressCommercialCtas: true }),
    safetyRule({ id: "self-harm.passing.anxiety", action: "clinical-review-recommended", all: [{ questionId: "self-harm", equals: "passing-thoughts" }], evidenceQuestionIds: ["self-harm"], contentId: "mental-health-support", pathwayIds: ["gp-review", "samaritans"], suppressCommercialCtas: false }),
  ],
  depression: [
    safetyRule({ id: "self-harm.significant.depression", action: "urgent-same-day-assessment", all: [{ questionId: "self-harm", equals: "yes-significant" }], evidenceQuestionIds: ["self-harm"], contentId: "mental-health-urgent", pathwayIds: ["urgent-mental-health", "samaritans"], suppressCommercialCtas: true }),
    safetyRule({ id: "self-harm.passing.depression", action: "clinical-review-recommended", all: [{ questionId: "self-harm", equals: "passing-thoughts" }], evidenceQuestionIds: ["self-harm"], contentId: "mental-health-support", pathwayIds: ["gp-review", "samaritans"], suppressCommercialCtas: false }),
    safetyRule({ id: "mental-health.hopelessness.depression", action: "additional-caution", all: [{ questionId: "hopelessness", equals: "nearly-every-day" }], evidenceQuestionIds: ["hopelessness"], contentId: "mental-health-support", pathwayIds: ["gp-review"], suppressCommercialCtas: false }),
  ],
  adhd: [
    safetyRule({ id: "mental-health.significant.adhd", action: "urgent-same-day-assessment", all: [{ questionId: "mental-health", equals: "yes-self-harm" }], evidenceQuestionIds: ["mental-health"], contentId: "mental-health-urgent", pathwayIds: ["urgent-mental-health", "samaritans"], suppressCommercialCtas: true }),
    safetyRule({ id: "mental-health.mood.adhd", action: "additional-caution", all: [{ questionId: "mental-health", equals: "yes-mood" }], evidenceQuestionIds: ["mental-health"], contentId: "mental-health-support", pathwayIds: ["gp-review"], suppressCommercialCtas: false }),
  ],
};

const WITHDRAWAL_RULES: Partial<Record<AssessmentKey, SafetyRule[]>> = {
  "alcohol-use": [
    safetyRule({ id: "alcohol.morning-drinking", action: "clinical-review-recommended", all: [{ questionId: "morning-drinking", equals: "yes" }], evidenceQuestionIds: ["morning-drinking"], contentId: "alcohol-withdrawal-review", pathwayIds: ["gp-review", "detox-clinical-review"], suppressCommercialCtas: false }),
  ],
  "alcohol-detox": [
    safetyRule({ id: "alcohol.severe-withdrawal", action: "urgent-same-day-assessment", all: [{ questionId: "withdrawal-symptoms", equals: "yes-severe" }], evidenceQuestionIds: ["withdrawal-symptoms"], contentId: "alcohol-withdrawal-urgent", pathwayIds: ["urgent-medical"], suppressCommercialCtas: false }),
    safetyRule({ id: "alcohol.seizure-history", action: "urgent-same-day-assessment", all: [{ questionId: "seizure-history", equals: "yes" }], evidenceQuestionIds: ["seizure-history"], contentId: "alcohol-withdrawal-urgent", pathwayIds: ["urgent-medical"], suppressCommercialCtas: false }),
    safetyRule({ id: "alcohol.hallucination-history", action: "urgent-same-day-assessment", all: [{ questionId: "hallucinations", equals: "yes" }], evidenceQuestionIds: ["hallucinations"], contentId: "alcohol-withdrawal-urgent", pathwayIds: ["urgent-medical"], suppressCommercialCtas: false }),
    safetyRule({ id: "alcohol.morning-drinking.detox", action: "clinical-review-recommended", all: [{ questionId: "morning-drinking", equals: "yes" }], evidenceQuestionIds: ["morning-drinking"], contentId: "alcohol-withdrawal-review", pathwayIds: ["detox-clinical-review"], suppressCommercialCtas: false }),
    safetyRule({ id: "benzodiazepine.regular.alcohol-detox", action: "clinical-review-recommended", all: [{ questionId: "benzodiazepines", equals: "yes" }], evidenceQuestionIds: ["benzodiazepines"], contentId: "benzodiazepine-withdrawal-review", pathwayIds: ["detox-clinical-review"], suppressCommercialCtas: false }),
    safetyRule({ id: "ghb-gbl.use.alcohol-detox", action: "clinical-review-recommended", all: [{ questionId: "ghb-use", equals: "yes" }], evidenceQuestionIds: ["ghb-use"], contentId: "ghb-gbl-withdrawal-review", pathwayIds: ["detox-clinical-review"], suppressCommercialCtas: false }),
    safetyRule({ id: "polysubstance.regular.alcohol-detox", action: "clinical-review-recommended", all: [{ questionId: "polysubstance", equals: "yes-regularly" }], evidenceQuestionIds: ["polysubstance"], contentId: "polysubstance-review", pathwayIds: ["detox-clinical-review"], suppressCommercialCtas: false }),
    safetyRule({ id: "medical.vulnerability.alcohol-detox", action: "clinical-review-recommended", all: [{ questionId: "medical-conditions", equals: "yes" }], evidenceQuestionIds: ["medical-conditions"], contentId: "medical-vulnerability-review", pathwayIds: ["detox-clinical-review"], suppressCommercialCtas: false }),
    safetyRule({ id: "detox.previous-complication.alcohol", action: "clinical-review-recommended", all: [{ questionId: "previous-detox", equals: "yes-complications" }], evidenceQuestionIds: ["previous-detox"], contentId: "alcohol-withdrawal-review", pathwayIds: ["detox-clinical-review"], suppressCommercialCtas: false }),
  ],
  "drug-use": [
    safetyRule({ id: "withdrawal.severe.drug-use", action: "urgent-same-day-assessment", all: [{ questionId: "withdrawal", equals: "yes-severe" }], evidenceQuestionIds: ["withdrawal"], contentId: "withdrawal-urgent", pathwayIds: ["urgent-medical"], suppressCommercialCtas: false }),
    safetyRule({ id: "polysubstance.regular.drug-use", action: "clinical-review-recommended", all: [{ questionId: "polysubstance", equals: "yes-regularly" }], evidenceQuestionIds: ["polysubstance"], contentId: "polysubstance-review", pathwayIds: ["gp-review"], suppressCommercialCtas: false }),
  ],
  "detox-suitability": [
    safetyRule({ id: "withdrawal.severe.detox", action: "urgent-same-day-assessment", all: [{ questionId: "withdrawal-symptoms", equals: "yes-severe" }], evidenceQuestionIds: ["withdrawal-symptoms", "substance-type"], contentId: "withdrawal-urgent", pathwayIds: ["urgent-medical"], suppressCommercialCtas: false }),
    safetyRule({ id: "withdrawal.seizure-history.detox", action: "urgent-same-day-assessment", all: [{ questionId: "seizure-history", equals: "yes" }], evidenceQuestionIds: ["seizure-history", "substance-type"], contentId: "withdrawal-urgent", pathwayIds: ["urgent-medical"], suppressCommercialCtas: false }),
    safetyRule({ id: "withdrawal.hallucination-history.detox", action: "urgent-same-day-assessment", all: [{ questionId: "hallucinations", equals: "yes" }], evidenceQuestionIds: ["hallucinations", "substance-type"], contentId: "withdrawal-urgent", pathwayIds: ["urgent-medical"], suppressCommercialCtas: false }),
    safetyRule({ id: "benzodiazepine.primary.detox", action: "clinical-review-recommended", all: [{ questionId: "substance-type", equals: "benzos" }], evidenceQuestionIds: ["substance-type"], contentId: "benzodiazepine-withdrawal-review", pathwayIds: ["detox-clinical-review"], suppressCommercialCtas: false }),
    safetyRule({ id: "benzodiazepine.regular.detox", action: "clinical-review-recommended", all: [{ questionId: "benzodiazepines", equals: "yes" }], evidenceQuestionIds: ["benzodiazepines"], contentId: "benzodiazepine-withdrawal-review", pathwayIds: ["detox-clinical-review"], suppressCommercialCtas: false }),
    safetyRule({ id: "opioid.primary.detox", action: "clinical-review-recommended", all: [{ questionId: "substance-type", equals: "opiates" }], evidenceQuestionIds: ["substance-type"], contentId: "opioid-overdose-caution", pathwayIds: ["detox-clinical-review"], suppressCommercialCtas: false }),
    safetyRule({ id: "polysubstance.primary.detox", action: "clinical-review-recommended", all: [{ questionId: "substance-type", equals: "multiple" }], evidenceQuestionIds: ["substance-type"], contentId: "polysubstance-review", pathwayIds: ["detox-clinical-review"], suppressCommercialCtas: false }),
    safetyRule({ id: "medical.vulnerability.detox", action: "clinical-review-recommended", all: [{ questionId: "medical-conditions", equals: "yes" }], evidenceQuestionIds: ["medical-conditions"], contentId: "medical-vulnerability-review", pathwayIds: ["detox-clinical-review"], suppressCommercialCtas: false }),
    safetyRule({ id: "detox.previous-complication.general", action: "clinical-review-recommended", all: [{ questionId: "previous-detox", equals: "yes-complications" }], evidenceQuestionIds: ["previous-detox"], contentId: "withdrawal-review", pathwayIds: ["detox-clinical-review"], suppressCommercialCtas: false }),
  ],
};

const DOMAIN_COPY: Record<AssessmentKey, Record<string, Omit<DomainRule, "id" | "sectionId">>> = {
  "alcohol-use": {
    "drinking-pattern": { label: "Drinking pattern", elevatedText: "Your drinking pattern is one of the more prominent parts of this result.", whyItMatters: "Frequency and quantity matter most when considered alongside control, dependence and impact." },
    "control-dependence": { label: "Control and dependence indicators", elevatedText: "Your answers suggest that control or dependence indicators deserve attention.", whyItMatters: "Loss of control, tolerance or using alcohol to function can be more concerning than frequency alone." },
    consequences: { label: "Consequences and attempts to change", elevatedText: "Alcohol appears to be affecting important areas of life or has been difficult to change.", whyItMatters: "Continued difficulty despite consequences can indicate a pattern that warrants structured support." },
    "wellbeing-safety": { label: "Emotional wellbeing", elevatedText: "Emotional wellbeing is an important part of the pattern you described.", whyItMatters: "Mood and safety concerns require their own response and should not be reduced to an alcohol score." },
  },
  "alcohol-detox": {
    "current-use": { label: "Current alcohol exposure", elevatedText: "Your current drinking pattern contributes materially to the result.", whyItMatters: "Current exposure helps establish context, but cannot determine withdrawal safety on its own." },
    "control-consequences": { label: "Dependence and consequences", elevatedText: "Control, craving or consequences form a prominent part of the pattern.", whyItMatters: "These indicators can point towards a need for fuller dependence and treatment assessment." },
    "detox-safety": { label: "Withdrawal and detox safety", elevatedText: "Withdrawal or detox safety factors stand out in your answers.", whyItMatters: "A single withdrawal complication can matter independently of the overall score." },
    "mental-health-readiness": { label: "Health, support and readiness", elevatedText: "Health or readiness factors may affect the kind of support that is appropriate.", whyItMatters: "Medical, psychological and practical context can change the safest treatment setting." },
  },
  "drug-use": {
    "substance-use-patterns": { label: "Substance-use pattern", elevatedText: "Frequency, coping use or higher-risk use is prominent in this result.", whyItMatters: "The exact substance and pattern are essential to understanding risk, which this legacy screen does not yet fully collect." },
    "control-dependence": { label: "Control, craving and withdrawal", elevatedText: "Control, craving or withdrawal indicators deserve attention.", whyItMatters: "These patterns can signal a need for substance-specific professional assessment." },
    consequences: { label: "Consequences and continued use", elevatedText: "Use appears to be continuing despite concern or consequences.", whyItMatters: "Consequences combined with difficulty changing often warrant more structured support." },
    "wellbeing-safety": { label: "Emotional wellbeing", elevatedText: "Emotional wellbeing is a clinically important part of this result.", whyItMatters: "Mental-health and self-harm needs require a separate response from substance severity." },
  },
  "detox-suitability": {
    "current-use": { label: "Current substance-use context", elevatedText: "Current use and duration contribute materially to the need for further assessment.", whyItMatters: "Different substances require different withdrawal and overdose considerations." },
    "withdrawal-history": { label: "Withdrawal and complication history", elevatedText: "Withdrawal history is one of the most important parts of this result.", whyItMatters: "Previous or current complications can outweigh a low overall score." },
    "medical-context": { label: "Medical and substance context", elevatedText: "Medical or concurrent-substance factors may affect detox planning.", whyItMatters: "An online questionnaire cannot medically clear detoxification where these factors are present." },
    readiness: { label: "Support and readiness", elevatedText: "Available support or readiness may influence the next practical step.", whyItMatters: "Readiness and home support affect planning, but do not override medical safety needs." },
  },
  anxiety: {
    "anxiety-symptoms": { label: "Anxiety symptom burden", elevatedText: "Worry, anxiousness or difficulty switching off is prominent in your answers.", whyItMatters: "Persistent symptoms become more clinically useful to understand when considered with avoidance and impairment." },
    "physical-behavioural": { label: "Physical responses and avoidance", elevatedText: "Physical anxiety, avoidance or coping behaviour stands out.", whyItMatters: "Avoidance and short-term coping strategies can maintain anxiety and restrict daily life." },
    "impact-and-safety": { label: "Daily impact and wellbeing", elevatedText: "The effect on daily life or wellbeing is a prominent part of this result.", whyItMatters: "Functional impact helps distinguish occasional symptoms from a pattern needing support." },
  },
  depression: {
    "mood-emotional-wellbeing": { label: "Mood and emotional wellbeing", elevatedText: "Low mood, reduced interest or difficult thoughts are prominent.", whyItMatters: "Mood symptoms are more concerning when persistent and combined with functional or physical changes." },
    "energy-physical": { label: "Energy, sleep and concentration", elevatedText: "Energy, sleep, appetite or concentration difficulties stand out.", whyItMatters: "These changes can reinforce reduced activity and make everyday coping harder." },
    "safety-coping": { label: "Coping, isolation and safety", elevatedText: "Coping or safety-related answers require particular attention.", whyItMatters: "Self-harm needs must be handled independently from the depression symptom total." },
  },
  adhd: {
    "attention-focus": { label: "Attention and focus", elevatedText: "Attention, organisation or distraction is prominent in your answers.", whyItMatters: "Attention symptoms need to be considered across settings and over time, not in isolation." },
    "hyperactivity-restlessness": { label: "Impulsivity and regulation", elevatedText: "Restlessness, impulsivity or emotional regulation stands out.", whyItMatters: "These traits can overlap with stress, sleep, trauma and other mental-health factors." },
    "impact-and-context": { label: "Impact and developmental context", elevatedText: "Daily impact or longer-term context contributes materially to the result.", whyItMatters: "A formal ADHD assessment considers childhood history, multiple settings, impairment and alternative explanations." },
  },
};

const PAIR_RULES: Record<AssessmentKey, Array<Omit<InterpretationRule, "approval">>> = {
  "alcohol-use": [
    { id: "alcohol.control-plus-pattern", priority: 100, domainIds: ["drinking-pattern", "control-dependence"], minimumState: "elevated", statement: "The more important pattern is the combination of alcohol exposure with reduced control or dependence indicators, rather than drinking frequency alone.", whyItMatters: "This combination makes a fuller assessment of dependence and withdrawal history more useful before deciding what change is safe." },
    { id: "alcohol.control-plus-consequence", priority: 90, domainIds: ["control-dependence", "consequences"], minimumState: "elevated", statement: "Difficulty controlling alcohol use appears alongside consequences or unsuccessful attempts to change.", whyItMatters: "That interaction can indicate a more established pattern than either feature alone." },
  ],
  "alcohol-detox": [
    { id: "alcohol-detox.withdrawal-plus-use", priority: 100, domainIds: ["current-use", "detox-safety"], minimumState: "elevated", statement: "Current alcohol exposure appears alongside withdrawal or detox-safety indicators.", whyItMatters: "Withdrawal safety must be assessed separately and can outweigh the ordinary screening score." },
    { id: "alcohol-detox.control-plus-safety", priority: 95, domainIds: ["control-consequences", "detox-safety"], minimumState: "elevated", statement: "Dependence-related features appear alongside withdrawal-safety concerns.", whyItMatters: "This combination supports obtaining professional advice before attempting a major change." },
  ],
  "drug-use": [
    { id: "drug.control-plus-consequence", priority: 100, domainIds: ["control-dependence", "consequences"], minimumState: "elevated", statement: "Difficulty controlling use appears alongside continued use despite concern or consequences.", whyItMatters: "That pattern is more informative than frequency alone and supports substance-specific assessment." },
    { id: "drug.pattern-plus-control", priority: 90, domainIds: ["substance-use-patterns", "control-dependence"], minimumState: "elevated", statement: "A more frequent or risky use pattern appears alongside craving, withdrawal or difficulty changing.", whyItMatters: "The exact substance and combination now need to be established before safe guidance can be given." },
  ],
  "detox-suitability": [
    { id: "detox.use-plus-withdrawal", priority: 100, domainIds: ["current-use", "withdrawal-history"], minimumState: "elevated", statement: "Current use and withdrawal history together indicate a need for substance-specific clinical assessment.", whyItMatters: "A universal detox score cannot establish the safest setting for this combination." },
    { id: "detox.withdrawal-plus-medical", priority: 95, domainIds: ["withdrawal-history", "medical-context"], minimumState: "elevated", statement: "Withdrawal history appears alongside medical or concurrent-substance factors.", whyItMatters: "These interacting factors can materially affect whether medical supervision is required." },
  ],
  anxiety: [
    { id: "anxiety.symptoms-plus-impact", priority: 100, domainIds: ["anxiety-symptoms", "impact-and-safety"], minimumState: "elevated", statement: "Anxiety symptoms appear alongside meaningful interference with daily functioning or wellbeing.", whyItMatters: "The impact on work, relationships and safety is more informative than symptom frequency alone." },
    { id: "anxiety.symptoms-plus-avoidance", priority: 90, domainIds: ["anxiety-symptoms", "physical-behavioural"], minimumState: "elevated", statement: "Persistent anxious thoughts appear alongside physical reactions, avoidance or coping behaviour.", whyItMatters: "Avoidance can bring short-term relief while maintaining anxiety over time." },
  ],
  depression: [
    { id: "depression.mood-plus-physical", priority: 100, domainIds: ["mood-emotional-wellbeing", "energy-physical"], minimumState: "elevated", statement: "Mood changes appear alongside sleep, energy, appetite or concentration difficulties.", whyItMatters: "This combined cognitive and physical pattern can have a wider effect on functioning than either group alone." },
    { id: "depression.mood-plus-coping", priority: 95, domainIds: ["mood-emotional-wellbeing", "safety-coping"], minimumState: "elevated", statement: "Low mood appears alongside isolation, coping difficulties or safety-related concerns.", whyItMatters: "Safety and support needs must be addressed separately from the depression symptom score." },
  ],
  adhd: [
    { id: "adhd.attention-plus-regulation", priority: 100, domainIds: ["attention-focus", "hyperactivity-restlessness"], minimumState: "elevated", statement: "Attention difficulties appear alongside impulsivity, restlessness or emotional regulation difficulties.", whyItMatters: "A broader pattern across these domains can justify formal assessment, but does not establish ADHD." },
    { id: "adhd.symptoms-plus-impact", priority: 95, domainIds: ["attention-focus", "impact-and-context"], minimumState: "elevated", statement: "Attention difficulties appear alongside meaningful impact or longer-term context.", whyItMatters: "Formal assessment considers persistence, childhood history, multiple settings and alternative explanations." },
  ],
};

const PATHWAYS: PathwayDefinition[] = [
  { id: "emergency-999", category: "emergency", label: "Call 999 or go to A&E", description: "Use emergency services if you are in immediate danger or experiencing an acute medical emergency.", destination: "tel:999", commercial: false },
  { id: "samaritans", category: "nhs-specialist", label: "Call Samaritans on 116 123", description: "Confidential emotional support is available at any time.", destination: "tel:116123", commercial: false },
  { id: "urgent-mental-health", category: "urgent-medical", label: "Seek urgent mental-health support today", description: "Contact your GP, NHS 111 or an appropriate local mental-health crisis service today.", destination: "tel:111", commercial: false },
  { id: "urgent-medical", category: "urgent-medical", label: "Seek urgent medical advice today", description: "Contact NHS 111, your GP or an appropriate urgent medical service before attempting significant change.", destination: "tel:111", commercial: false },
  { id: "gp-review", category: "gp", label: "Speak with your GP or a qualified clinician", description: "A professional can review the wider medical and mental-health context that an online screen cannot establish.", destination: "https://www.nhs.uk/service-search/find-a-gp", commercial: false },
  { id: "detox-clinical-review", category: "detox-provider", label: "Arrange a clinical detox assessment", description: "A medically informed assessment can determine whether withdrawal support or supervision may be needed.", destination: "/get-help", commercial: false },
  { id: "nhs-mental-health", category: "nhs-specialist", label: "Explore NHS mental-health support", description: "Your GP or local NHS service can discuss assessment and treatment options.", destination: "https://www.nhs.uk/mental-health/", commercial: false, assessmentKeys: ["anxiety", "depression", "adhd"] },
  { id: "formal-adhd", category: "formal-assessment", label: "Discuss a formal ADHD assessment", description: "ADHD diagnosis requires a specialist clinical and developmental assessment, not a screening score alone.", destination: "/get-help", commercial: false, assessmentKeys: ["adhd"] },
  { id: "self-guided", category: "self-guided", label: "Review practical information and monitor patterns", description: "Use reliable information and return for professional help if symptoms, impact or safety concerns increase.", destination: "/resources", commercial: false },
  { id: "irn-consultation", category: "irn-consultation", label: "Discuss your options with IRN", description: "IRN can help you understand appropriate support and treatment-navigation options. IRN is not an emergency service.", destination: "/get-help", commercial: true },
];

function domainRulesFor(key: AssessmentKey): DomainRule[] {
  return Object.entries(DOMAIN_COPY[key]).map(([sectionId, copy]) => ({
    id: sectionId,
    sectionId,
    ...copy,
  }));
}

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.entries(value as Record<string, unknown>)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, entry]) => `${JSON.stringify(key)}:${stableStringify(entry)}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}

function deepFreeze<T>(value: T): T {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value as Record<string, unknown>)) deepFreeze(child);
  }
  return value;
}

function buildDefinition(key: AssessmentKey): AssessmentDefinition {
  const legacy = legacyDefinitionSnapshotV1[key];
  const draft = {
    key,
    version: 1,
    definitionHash: "",
    status: "active" as const,
    effectiveDate: "2026-08-30",
    engineVersion: ENGINE_VERSION,
    title: legacy.title,
    subtitle: legacy.subtitle,
    estimatedMinutes: legacy.estimatedMinutes,
    sections: legacy.sections,
    scoring: {
      kind: "irn-legacy-custom" as const,
      moderateConcern: legacy.scoreThresholds.moderateConcern,
      higherConcern: legacy.scoreThresholds.higherConcern,
      possibleDetoxRisk: legacy.scoreThresholds.possibleDetoxRisk,
    },
    domainRules: domainRulesFor(key),
    safetyRules: [...(SELF_HARM_RULES[key] ?? []), ...(WITHDRAWAL_RULES[key] ?? [])],
    interpretationRules: PAIR_RULES[key].map((rule) => ({ ...rule, approval: PENDING_RULE_APPROVAL })),
    pathwayRules: PATHWAYS.filter((pathway) => !pathway.assessmentKeys || pathway.assessmentKeys.includes(key)),
    clinicalApproval: FOUNDATION_APPROVAL,
  };
  const definitionHash = createHash("sha256").update(stableStringify(draft)).digest("hex");
  return deepFreeze({ ...draft, definitionHash });
}

const ACTIVE_DEFINITIONS = deepFreeze(
  Object.fromEntries(
    (Object.keys(legacyDefinitionSnapshotV1) as AssessmentKey[]).map((key) => [key, buildDefinition(key)]),
  ) as Record<AssessmentKey, AssessmentDefinition>,
);

export function isAssessmentKey(value: string): value is AssessmentKey {
  return value in ACTIVE_DEFINITIONS;
}

export function getActiveDefinition(key: AssessmentKey): AssessmentDefinition {
  return ACTIVE_DEFINITIONS[key];
}

export function getDefinition(key: AssessmentKey, version: number): AssessmentDefinition | null {
  const definition = ACTIVE_DEFINITIONS[key];
  return definition.version === version ? definition : null;
}

export function listActiveDefinitions(): AssessmentDefinition[] {
  return Object.values(ACTIVE_DEFINITIONS);
}

export function toPublicDefinition(definition: AssessmentDefinition): PublicAssessmentDefinition {
  return {
    key: definition.key,
    version: definition.version,
    definitionHash: definition.definitionHash,
    title: definition.title,
    subtitle: definition.subtitle,
    estimatedMinutes: definition.estimatedMinutes,
    sections: definition.sections.map((section) => ({
      id: section.id,
      title: section.title,
      description: section.description,
      questions: section.questions.map((question) => ({
        id: question.id,
        text: question.text,
        subtext: question.subtext,
        type: question.type,
        required: question.required,
        options: question.options?.map((option) => ({ value: option.value, label: option.label })),
      })),
    })),
  };
}

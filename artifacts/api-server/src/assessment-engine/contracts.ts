export type AssessmentKey =
  | "alcohol-use"
  | "alcohol-detox"
  | "drug-use"
  | "detox-suitability"
  | "anxiety"
  | "depression"
  | "adhd";

export type AnswerValue = string | string[];
export type AssessmentAnswers = Record<string, AnswerValue>;

export type QuestionType = "radio" | "checkbox" | "text" | "email" | "tel";

export interface AssessmentOption {
  value: string;
  label: string;
  score: number;
  /** Required by instruments such as ASRS where the official form visually marks threshold responses. */
  instrumentThreshold?: boolean;
  redFlag?: boolean;
  advisoryKey?: string;
}

export interface AssessmentQuestion {
  id: string;
  text: string;
  subtext?: string;
  type: QuestionType;
  options?: AssessmentOption[];
  required?: boolean;
  redFlagKey?: string;
  displayWhen?: BranchConditionSet;
}

export interface AssessmentSection {
  id: string;
  title: string;
  description?: string;
  questions: AssessmentQuestion[];
  displayWhen?: BranchConditionSet;
}

export type DefinitionStatus = "draft" | "active" | "retired";
export type ApprovalStatus = "approved" | "pending-clinical-director";

export interface ClinicalApprovalMetadata {
  status: ApprovalStatus;
  reference: string;
  approvedBy?: string;
  approvedAt?: string;
  notes?: string;
}

export type SafetyAction =
  | "no-immediate-warning-identified"
  | "additional-caution"
  | "clinical-review-recommended"
  | "urgent-same-day-assessment"
  | "emergency-help-now";

export interface AnswerCondition {
  questionId: string;
  equals?: string;
  includes?: string;
  notIncludes?: string;
  oneOf?: string[];
  minimumSelections?: number;
}

export interface BranchConditionSet {
  all?: AnswerCondition[];
  any?: AnswerCondition[];
}

export interface SafetyRule {
  id: string;
  version: number;
  action: SafetyAction;
  all?: AnswerCondition[];
  any?: AnswerCondition[];
  evidenceQuestionIds: string[];
  contentId: SafetyContentId;
  pathwayIds: string[];
  suppressCommercialCtas: boolean;
  approval: ClinicalApprovalMetadata;
}

export type SafetyContentId =
  | "screening-limitation"
  | "mental-health-support"
  | "mental-health-current-review"
  | "phq9-item9-review"
  | "mental-health-urgent"
  | "mental-health-emergency"
  | "alcohol-withdrawal-review"
  | "alcohol-withdrawal-urgent"
  | "alcohol-withdrawal-emergency"
  | "benzodiazepine-withdrawal-review"
  | "benzodiazepine-withdrawal-urgent"
  | "benzodiazepine-withdrawal-emergency"
  | "ghb-gbl-withdrawal-review"
  | "ghb-gbl-withdrawal-urgent"
  | "ghb-gbl-withdrawal-emergency"
  | "opioid-harm-reduction"
  | "opioid-overdose-caution"
  | "opioid-overdose-emergency"
  | "opioid-tolerance-review"
  | "stimulant-urgent"
  | "stimulant-emergency"
  | "stimulant-mental-health-review"
  | "ketamine-urinary-review"
  | "cannabis-support-review"
  | "pregnancy-substance-review"
  | "polysubstance-review"
  | "withdrawal-review"
  | "withdrawal-urgent"
  | "medical-vulnerability-review";

export interface SafetyContent {
  id: SafetyContentId;
  heading: string;
  body: string;
  actionText?: string;
  emergencyText?: string;
}

export interface DomainRule {
  id: string;
  sectionId?: string;
  questionIds?: string[];
  label: string;
  elevatedText: string;
  whyItMatters: string;
}

export interface InterpretationRule {
  id: string;
  priority: number;
  domainIds: string[];
  minimumDomainIds?: string[];
  minimumState: DomainState;
  all?: AnswerCondition[];
  any?: AnswerCondition[];
  statement: string;
  whyItMatters: string;
  approval: ClinicalApprovalMetadata;
}

export type PathwayCategory =
  | "emergency"
  | "urgent-medical"
  | "gp"
  | "nhs-specialist"
  | "formal-assessment"
  | "self-guided"
  | "irn-consultation"
  | "irn-online-programme"
  | "detox-provider"
  | "residential-placement"
  | "family-support";

export interface PathwayDefinition {
  id: string;
  category: PathwayCategory;
  label: string;
  description: string;
  destination: string;
  commercial: boolean;
  minimumSafetyAction?: SafetyAction;
  maximumSafetyAction?: SafetyAction;
  assessmentKeys?: AssessmentKey[];
}

export interface AssessmentEligibility {
  questionId: string;
  allowedValues: string[];
  ineligibleHeading: string;
  ineligibleBody: string;
  pathways: Array<{
    label: string;
    description: string;
    destination: string;
  }>;
}

export interface ValidatedInstrumentBand {
  minimumScore: number;
  maximumScore: number;
  label: string;
  level: Exclude<ScreeningClassification["level"], "descriptive-profile">;
}

export interface ValidatedInstrumentDefinition {
  kind: "audit" | "assist" | "gad-7" | "phq-9" | "asrs-v1.1-6q";
  name: string;
  version: string;
  questionIds: string[];
  maximumScore: number;
  bands: ValidatedInstrumentBand[];
  explanation: string;
  permissionStatus: "confirmed";
  sourceUrl: string;
  citation: string;
}

export interface AssessmentDefinition {
  key: AssessmentKey;
  version: number;
  definitionHash: string;
  status: DefinitionStatus;
  effectiveDate: string;
  engineVersion: string;
  title: string;
  subtitle: string;
  estimatedMinutes: number;
  eligibility?: AssessmentEligibility;
  sections: AssessmentSection[];
  scoring: {
    kind: "irn-legacy-custom";
    moderateConcern: number;
    higherConcern: number;
    possibleDetoxRisk: number;
  } | {
    kind: "irn-descriptive-profile";
    profileLabel: string;
    explanation: string;
  };
  instrument: null | ValidatedInstrumentDefinition;
  domainRules: DomainRule[];
  safetyRules: SafetyRule[];
  interpretationRules: InterpretationRule[];
  pathwayRules: PathwayDefinition[];
  clinicalApproval: ClinicalApprovalMetadata;
}

export interface PublicAssessmentDefinition {
  key: AssessmentKey;
  version: number;
  definitionHash: string;
  title: string;
  subtitle: string;
  estimatedMinutes: number;
  eligibility?: AssessmentEligibility;
  sections: Array<{
    id: string;
    title: string;
    description?: string;
    questions: Array<Omit<AssessmentQuestion, "redFlagKey" | "options"> & {
      options?: Array<Pick<AssessmentOption, "value" | "label" | "instrumentThreshold">>;
    }>;
  }>;
}

export type DomainState = "not-indicated" | "present" | "elevated" | "prominent";

export interface DomainResult {
  id: string;
  label: string;
  score: number;
  maximumScore: number;
  state: DomainState;
  evidenceQuestionIds: string[];
  summary: string;
  whyItMatters: string;
}

export interface ScreeningClassification {
  source: "irn-legacy-custom" | "validated-instrument" | "irn-descriptive-profile";
  value: number | null;
  maximumValue: number | null;
  level: "lower-concern" | "moderate-concern" | "higher-concern" | "elevated-concern" | "descriptive-profile";
  label: string;
  explanation: string;
  displayScore: boolean;
}

export interface TriggeredSafetyRule {
  id: string;
  version: number;
  action: SafetyAction;
  evidenceQuestionIds: string[];
  contentId: SafetyContentId;
  pathwayIds: string[];
  approvalStatus: ApprovalStatus;
}

export interface SafetyResult {
  action: SafetyAction;
  publicHeading: string;
  limitation: string;
  triggeredRules: TriggeredSafetyRule[];
  content: SafetyContent[];
  suppressCommercialCtas: boolean;
}

export interface PatternFinding {
  id: string;
  title: string;
  statement: string;
  whyItMatters: string;
  evidenceDomainIds: string[];
}

export interface DeterministicInterpretation {
  summary: string;
  keyPatterns: PatternFinding[];
  whyThisMatters: string[];
  protectiveFactors: PatternFinding[];
  limitations: string[];
}

export interface PathwayRecommendation {
  id: string;
  category: PathwayCategory;
  label: string;
  description: string;
  destination: string;
  commercial: boolean;
  priority: number;
}

export interface AuthoritativeAssessmentResult {
  resultId: string;
  assessmentKey: AssessmentKey;
  definitionVersion: number;
  definitionHash: string;
  engineVersion: string;
  completedAt: string;
  screening: ScreeningClassification;
  instrument: null | {
    name: string;
    version: string;
    rawScore: number;
    maximumScore: number;
    band: string;
  };
  domains: DomainResult[];
  safety: SafetyResult;
  interpretation: DeterministicInterpretation;
  pathways: PathwayRecommendation[];
  aiEnhancement: {
    status: "disabled" | "pending" | "available" | "failed";
    narrative?: string;
    provider?: string;
    model?: string;
    promptVersion?: string;
  };
  persistence: {
    status: "saved" | "not-saved";
    expiresAt?: string;
  };
  delivery: {
    email: "not-requested" | "queued" | "sent" | "failed";
    irnOs: "not-requested" | "queued" | "forwarded" | "failed";
  };
}

export interface ValidatedSubmission {
  assessmentKey: AssessmentKey;
  definitionVersion: number;
  submissionKey: string;
  answers: AssessmentAnswers;
  consent: boolean;
  privacyNoticeVersion: string;
}

export interface AssessmentContactPermissions {
  emailResult: boolean;
  irnFollowUp: boolean;
  marketing: boolean;
}

export interface AssessmentContactRequest {
  name?: string;
  email: string;
  phone?: string;
  permissions: AssessmentContactPermissions;
  privacyNoticeVersion: string;
}

export interface EvaluationResult {
  answers: AssessmentAnswers;
  screening: ScreeningClassification;
  instrument: AuthoritativeAssessmentResult["instrument"];
  domains: DomainResult[];
  safety: SafetyResult;
  interpretation: DeterministicInterpretation;
  pathways: PathwayRecommendation[];
}

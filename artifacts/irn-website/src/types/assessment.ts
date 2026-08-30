export type QuestionType = "radio" | "checkbox" | "text" | "email" | "tel";

export interface QuestionOption {
  value: string;
  label: string;
  score: number;
  instrumentThreshold?: boolean;
  redFlag?: boolean;
  advisoryKey?: string;
}

export interface Question {
  id: string;
  text: string;
  subtext?: string;
  type: QuestionType;
  options?: QuestionOption[];
  required?: boolean;
  redFlagKey?: string;
  displayWhen?: BranchConditionSet;
}

export interface AssessmentSection {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  displayWhen?: BranchConditionSet;
}

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

export type ScoreLevel =
  | "lower-concern"
  | "moderate-concern"
  | "higher-concern"
  | "possible-detox-risk"
  | "urgent-medical-advice";

export interface ScoreResult {
  value: number;
  level: ScoreLevel;
  redFlags: string[];
  advisories: string[];
  label: string;
  bandName: string;
  colour: string;
  tagline: string;
}

export interface AnchorReport {
  whatThisMaySuggest: string;
  keyPatterns: string[];
  whatThisDoesNotMean: string;
  suggestedNextSteps: string;
  ctaText: string;
}

export type SafetyAction =
  | "no-immediate-warning-identified"
  | "additional-caution"
  | "clinical-review-recommended"
  | "urgent-same-day-assessment"
  | "emergency-help-now";

export interface AuthoritativeAssessmentResult {
  resultId: string;
  assessmentKey: string;
  definitionVersion: number;
  definitionHash: string;
  engineVersion: string;
  completedAt: string;
  screening: {
    source: "irn-legacy-custom" | "validated-instrument" | "irn-descriptive-profile";
    value: number | null;
    maximumValue: number | null;
    level: "lower-concern" | "moderate-concern" | "higher-concern" | "elevated-concern" | "descriptive-profile";
    label: string;
    explanation: string;
    displayScore: boolean;
  };
  instrument: null | {
    name: string;
    version: string;
    rawScore: number;
    maximumScore: number;
    band: string;
  };
  domains: Array<{
    id: string;
    label: string;
    score: number;
    maximumScore: number;
    state: "not-indicated" | "present" | "elevated" | "prominent";
    evidenceQuestionIds: string[];
    summary: string;
    whyItMatters: string;
  }>;
  safety: {
    action: SafetyAction;
    publicHeading: string;
    limitation: string;
    triggeredRules: Array<{
      id: string;
      version: number;
      action: SafetyAction;
      evidenceQuestionIds: string[];
      contentId: string;
      pathwayIds: string[];
      approvalStatus: "approved" | "pending-clinical-director";
    }>;
    content: Array<{
      id: string;
      heading: string;
      body: string;
      actionText?: string;
      emergencyText?: string;
    }>;
    suppressCommercialCtas: boolean;
  };
  interpretation: {
    summary: string;
    keyPatterns: Array<{
      id: string;
      title: string;
      statement: string;
      whyItMatters: string;
      evidenceDomainIds: string[];
    }>;
    whyThisMatters: string[];
    protectiveFactors: Array<{
      id: string;
      title: string;
      statement: string;
      whyItMatters: string;
      evidenceDomainIds: string[];
    }>;
    limitations: string[];
  };
  pathways: Array<{
    id: string;
    category: string;
    label: string;
    description: string;
    destination: string;
    commercial: boolean;
    priority: number;
  }>;
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

export interface AssessmentConfig {
  id: string;
  title: string;
  subtitle: string;
  estimatedMinutes: number;
  sections: AssessmentSection[];
  scoreThresholds: {
    moderateConcern: number;
    higherConcern: number;
    possibleDetoxRisk: number;
  };
}

export interface PublicAssessmentQuestion
  extends Omit<Question, "options" | "redFlagKey"> {
  options?: Array<Pick<QuestionOption, "value" | "label" | "instrumentThreshold">>;
}

export interface PublicAssessmentConfig {
  id: string;
  definitionVersion: number;
  definitionHash: string;
  title: string;
  subtitle: string;
  estimatedMinutes: number;
  eligibility?: {
    questionId: string;
    allowedValues: string[];
    ineligibleHeading: string;
    ineligibleBody: string;
    pathways: Array<{
      label: string;
      description: string;
      destination: string;
    }>;
  };
  sections: Array<{
    id: string;
    title: string;
    description?: string;
    displayWhen?: BranchConditionSet;
    questions: PublicAssessmentQuestion[];
  }>;
}

export type AssessmentAnswers = Record<string, string | string[]>;

export interface AssessmentContactRequest {
  name?: string;
  email: string;
  phone?: string;
  permissions: {
    emailResult: boolean;
    irnFollowUp: boolean;
    marketing: boolean;
  };
}

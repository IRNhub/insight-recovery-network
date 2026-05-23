export type QuestionType = "radio" | "checkbox" | "text" | "email" | "tel";

export interface QuestionOption {
  value: string;
  label: string;
  score: number;
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
}

export interface AssessmentSection {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
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

export type AssessmentAnswers = Record<string, string | string[]>;

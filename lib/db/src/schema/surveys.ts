/**
 * Research & Surveys schema (Phase 1).
 *
 * Reusable survey framework: a Survey has ordered SurveyQuestions; each
 * anonymous SurveyResponse stores one SurveyAnswer per answered question.
 * Significant admin actions are recorded in survey_audit_log.
 *
 * Anonymity rules (Phase 1):
 * - No name, email, phone, account ID, client ID, address, postcode or town
 *   fields exist anywhere in these tables.
 * - Responses are identified publicly only by `responseCode`
 *   (e.g. FAM-2026-XXXXXXXX) generated from crypto-random bytes.
 * - Raw IP addresses are NEVER stored. `clientHash` is a salted one-way
 *   SHA-256 hash of request metadata used only for duplicate flagging.
 */
import {
  pgTable,
  serial,
  integer,
  text,
  boolean,
  timestamp,
  jsonb,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export type SurveyStatus = "draft" | "open" | "closed" | "archived";

export type SurveyQuestionType =
  | "single_choice"
  | "multi_choice"
  | "scale"
  | "short_text"
  | "long_text"
  | "yes_no"
  | "consent";

export interface SurveyQuestionOptions {
  /** Approved choices for single_choice / multi_choice */
  choices?: string[];
  /** Scale bounds and labels */
  scaleMin?: number;
  scaleMax?: number;
  scaleMinLabel?: string;
  scaleMaxLabel?: string;
  /** Maximum length for text answers */
  maxLength?: number;
}

export const surveysTable = pgTable("surveys", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  status: text("status").$type<SurveyStatus>().notNull().default("draft"),
  isPublic: boolean("is_public").notNull().default(false),
  isNoIndex: boolean("is_no_index").notNull().default(true),
  opensAt: timestamp("opens_at"),
  closesAt: timestamp("closes_at"),
  createdBy: text("created_by"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const surveyQuestionsTable = pgTable(
  "survey_questions",
  {
    id: serial("id").primaryKey(),
    surveyId: integer("survey_id")
      .notNull()
      .references(() => surveysTable.id),
    /** Stable machine key used for exports and answer matching */
    questionKey: text("question_key").notNull(),
    section: text("section").notNull(),
    questionOrder: integer("question_order").notNull(),
    questionText: text("question_text").notNull(),
    questionType: text("question_type").$type<SurveyQuestionType>().notNull(),
    options: jsonb("options").$type<SurveyQuestionOptions>(),
    isRequired: boolean("is_required").notNull().default(false),
    helperText: text("helper_text"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [uniqueIndex("survey_questions_survey_key_idx").on(table.surveyId, table.questionKey)],
);

export const surveyResponsesTable = pgTable("survey_responses", {
  id: serial("id").primaryKey(),
  surveyId: integer("survey_id")
    .notNull()
    .references(() => surveysTable.id),
  /** Public anonymous identifier, e.g. FAM-2026-7K2Q9XWD */
  responseCode: text("response_code").notNull().unique(),
  /** Client-generated idempotency token — prevents double submission */
  submissionToken: text("submission_token").notNull().unique(),
  consentAccepted: boolean("consent_accepted").notNull(),
  quotationPermission: boolean("quotation_permission").notNull().default(false),
  startedAt: timestamp("started_at"),
  submittedAt: timestamp("submitted_at").notNull().defaultNow(),
  completionDurationSeconds: integer("completion_duration_seconds"),
  source: text("source"),
  medium: text("medium"),
  campaign: text("campaign"),
  referralUrl: text("referral_url"),
  userAgentCategory: text("user_agent_category"),
  /**
   * Salted one-way SHA-256 hash of transient request metadata (never the raw
   * IP). Used only to flag suspected duplicates. Cannot reasonably be
   * reversed and is never shown in the admin UI.
   */
  clientHash: text("client_hash"),
  suspectedDuplicate: boolean("suspected_duplicate").notNull().default(false),
  minimumTimeFlag: boolean("minimum_time_flag").notNull().default(false),
  excludedFromAnalysis: boolean("excluded_from_analysis").notNull().default(false),
  exclusionReason: text("exclusion_reason"),
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const surveyAnswersTable = pgTable(
  "survey_answers",
  {
    id: serial("id").primaryKey(),
    responseId: integer("response_id")
      .notNull()
      .references(() => surveyResponsesTable.id),
    questionId: integer("question_id")
      .notNull()
      .references(() => surveyQuestionsTable.id),
    /** Value for single_choice / scale / text / yes_no answers */
    answerValue: text("answer_value"),
    /** Values for multi_choice answers */
    answerValues: jsonb("answer_values").$type<string[]>(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [uniqueIndex("survey_answers_response_question_idx").on(table.responseId, table.questionId)],
);

export const surveyAuditLogTable = pgTable("survey_audit_log", {
  id: serial("id").primaryKey(),
  surveyId: integer("survey_id").references(() => surveysTable.id),
  responseId: integer("response_id").references(() => surveyResponsesTable.id),
  action: text("action").notNull(),
  actor: text("actor").notNull().default("admin"),
  reason: text("reason"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Survey = typeof surveysTable.$inferSelect;
export type SurveyQuestion = typeof surveyQuestionsTable.$inferSelect;
export type SurveyResponse = typeof surveyResponsesTable.$inferSelect;
export type SurveyAnswer = typeof surveyAnswersTable.$inferSelect;
export type SurveyAuditLogEntry = typeof surveyAuditLogTable.$inferSelect;

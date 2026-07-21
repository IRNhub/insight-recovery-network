/**
 * Runtime table bootstrap for the Research & Surveys framework.
 *
 * Follows the existing project pattern (see resource-leads.ts): idempotent
 * `CREATE TABLE IF NOT EXISTS` executed once per process before first use, so
 * deployments are self-healing and existing production data is unaffected.
 * The canonical Drizzle schema lives in @workspace/db (lib/db/src/schema/surveys.ts)
 * and `pnpm --filter @workspace/db run push` remains the dev-time migration path.
 *
 * Running this SQL twice is safe: every statement is IF NOT EXISTS.
 */
import { pool } from "@workspace/db";

const SURVEY_TABLES_SQL = `
CREATE TABLE IF NOT EXISTS surveys (
  id serial PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'draft',
  is_public boolean NOT NULL DEFAULT false,
  is_no_index boolean NOT NULL DEFAULT true,
  opens_at timestamp,
  closes_at timestamp,
  created_by text,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS survey_questions (
  id serial PRIMARY KEY,
  survey_id integer NOT NULL REFERENCES surveys(id),
  question_key text NOT NULL,
  section text NOT NULL,
  question_order integer NOT NULL,
  question_text text NOT NULL,
  question_type text NOT NULL,
  options jsonb,
  is_required boolean NOT NULL DEFAULT false,
  helper_text text,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS survey_questions_survey_key_idx
  ON survey_questions (survey_id, question_key);

CREATE TABLE IF NOT EXISTS survey_responses (
  id serial PRIMARY KEY,
  survey_id integer NOT NULL REFERENCES surveys(id),
  response_code text NOT NULL UNIQUE,
  submission_token text NOT NULL UNIQUE,
  consent_accepted boolean NOT NULL,
  quotation_permission boolean NOT NULL DEFAULT false,
  started_at timestamp,
  submitted_at timestamp NOT NULL DEFAULT now(),
  completion_duration_seconds integer,
  source text,
  medium text,
  campaign text,
  referral_url text,
  user_agent_category text,
  client_hash text,
  suspected_duplicate boolean NOT NULL DEFAULT false,
  minimum_time_flag boolean NOT NULL DEFAULT false,
  excluded_from_analysis boolean NOT NULL DEFAULT false,
  exclusion_reason text,
  admin_notes text,
  irnos_forwarded_at timestamp,
  irnos_forward_attempts integer NOT NULL DEFAULT 0,
  irnos_forward_error text,
  created_at timestamp NOT NULL DEFAULT now()
);
ALTER TABLE survey_responses ADD COLUMN IF NOT EXISTS irnos_forwarded_at timestamp;
ALTER TABLE survey_responses ADD COLUMN IF NOT EXISTS irnos_forward_attempts integer NOT NULL DEFAULT 0;
ALTER TABLE survey_responses ADD COLUMN IF NOT EXISTS irnos_forward_error text;
CREATE INDEX IF NOT EXISTS survey_responses_survey_idx ON survey_responses (survey_id);
CREATE INDEX IF NOT EXISTS survey_responses_client_hash_idx ON survey_responses (survey_id, client_hash);

CREATE TABLE IF NOT EXISTS survey_answers (
  id serial PRIMARY KEY,
  response_id integer NOT NULL REFERENCES survey_responses(id),
  question_id integer NOT NULL REFERENCES survey_questions(id),
  answer_value text,
  answer_values jsonb,
  created_at timestamp NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS survey_answers_response_question_idx
  ON survey_answers (response_id, question_id);

CREATE TABLE IF NOT EXISTS survey_audit_log (
  id serial PRIMARY KEY,
  survey_id integer REFERENCES surveys(id),
  response_id integer REFERENCES survey_responses(id),
  action text NOT NULL,
  actor text NOT NULL DEFAULT 'admin',
  reason text,
  created_at timestamp NOT NULL DEFAULT now()
);
`;

let tablesReady: Promise<void> | null = null;

export function ensureSurveyTables(): Promise<void> {
  tablesReady ??= pool.query(SURVEY_TABLES_SQL).then(() => undefined);
  return tablesReady;
}

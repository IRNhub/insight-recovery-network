-- IRN Assessment Platform Phase A
-- Additive only. Existing rows retain their legacy score and answer data.

ALTER TABLE "assessments"
  ADD COLUMN IF NOT EXISTS "result_public_id" uuid DEFAULT gen_random_uuid(),
  ADD COLUMN IF NOT EXISTS "submission_key" uuid,
  ADD COLUMN IF NOT EXISTS "assessment_key" text,
  ADD COLUMN IF NOT EXISTS "definition_version" integer,
  ADD COLUMN IF NOT EXISTS "definition_hash" text,
  ADD COLUMN IF NOT EXISTS "engine_version" text,
  ADD COLUMN IF NOT EXISTS "result_source" text NOT NULL DEFAULT 'legacy-client-v1',
  ADD COLUMN IF NOT EXISTS "instrument_result" jsonb,
  ADD COLUMN IF NOT EXISTS "domains" jsonb,
  ADD COLUMN IF NOT EXISTS "screening_classification" jsonb,
  ADD COLUMN IF NOT EXISTS "safety_action" text,
  ADD COLUMN IF NOT EXISTS "triggered_safety_rules" jsonb,
  ADD COLUMN IF NOT EXISTS "deterministic_interpretation" jsonb,
  ADD COLUMN IF NOT EXISTS "pathways" jsonb,
  ADD COLUMN IF NOT EXISTS "ai_enhancement_status" text NOT NULL DEFAULT 'not_requested',
  ADD COLUMN IF NOT EXISTS "ai_provider" text,
  ADD COLUMN IF NOT EXISTS "ai_model" text,
  ADD COLUMN IF NOT EXISTS "ai_prompt_version" text,
  ADD COLUMN IF NOT EXISTS "persistence_state" text NOT NULL DEFAULT 'saved',
  ADD COLUMN IF NOT EXISTS "email_delivery_status" text NOT NULL DEFAULT 'not_requested',
  ADD COLUMN IF NOT EXISTS "irn_os_delivery_status" text NOT NULL DEFAULT 'not_requested',
  ADD COLUMN IF NOT EXISTS "privacy_notice_version" text,
  ADD COLUMN IF NOT EXISTS "result_access_token_hash" text,
  ADD COLUMN IF NOT EXISTS "delete_after" timestamp,
  ADD COLUMN IF NOT EXISTS "deleted_at" timestamp;

UPDATE "assessments"
SET "result_public_id" = gen_random_uuid()
WHERE "result_public_id" IS NULL;

ALTER TABLE "assessments"
  ALTER COLUMN "result_public_id" SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "assessments_result_public_id_uq"
  ON "assessments" ("result_public_id");
CREATE UNIQUE INDEX IF NOT EXISTS "assessments_submission_key_uq"
  ON "assessments" ("submission_key") WHERE "submission_key" IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS "assessments_result_access_token_hash_uq"
  ON "assessments" ("result_access_token_hash") WHERE "result_access_token_hash" IS NOT NULL;

CREATE TABLE IF NOT EXISTS "assessment_deliveries" (
  "id" serial PRIMARY KEY,
  "assessment_id" integer NOT NULL REFERENCES "assessments"("id") ON DELETE CASCADE,
  "channel" text NOT NULL,
  "status" text NOT NULL DEFAULT 'queued',
  "attempts" integer NOT NULL DEFAULT 0,
  "next_attempt_at" timestamp NOT NULL DEFAULT now(),
  "last_error_code" text,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS "assessment_delivery_assessment_channel_uq"
  ON "assessment_deliveries" ("assessment_id", "channel");
CREATE INDEX IF NOT EXISTS "assessment_delivery_retry_idx"
  ON "assessment_deliveries" ("status", "next_attempt_at");

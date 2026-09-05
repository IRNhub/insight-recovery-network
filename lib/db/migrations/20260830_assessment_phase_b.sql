-- IRN Assessment Platform Phase B
-- Depends on 20260830_assessment_phase_a.sql.
-- Existing records and contact data are preserved. Relaxing the legacy contact
-- constraint permits anonymous authoritative results before optional contact.

ALTER TABLE "assessments"
  ALTER COLUMN "name" DROP NOT NULL,
  ALTER COLUMN "email" DROP NOT NULL,
  ALTER COLUMN "score_value" DROP NOT NULL,
  ADD COLUMN IF NOT EXISTS "result_email_requested" boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "irn_follow_up_requested" boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "marketing_consent" boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "result_email_consent_at" timestamp,
  ADD COLUMN IF NOT EXISTS "irn_follow_up_consent_at" timestamp,
  ADD COLUMN IF NOT EXISTS "marketing_consent_at" timestamp,
  ADD COLUMN IF NOT EXISTS "contact_privacy_notice_version" text;

COMMENT ON COLUMN "assessments"."result_email_requested" IS
  'Explicit optional permission to email this assessment result.';
COMMENT ON COLUMN "assessments"."score_value" IS
  'Validated numeric score when applicable; null for non-numeric descriptive profiles.';
COMMENT ON COLUMN "assessments"."irn_follow_up_requested" IS
  'Explicit optional permission for IRN to follow up about this assessment.';
COMMENT ON COLUMN "assessments"."marketing_consent" IS
  'Separate marketing permission; never implied by result email or follow-up.';

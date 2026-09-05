-- IRN Assessment Platform distributed rate limiting
-- Depends on 20260830_assessment_phase_a.sql and
-- 20260830_assessment_phase_b.sql. Additive only.

CREATE TABLE IF NOT EXISTS "assessment_rate_limits" (
  "id" serial PRIMARY KEY,
  "scope" text NOT NULL,
  "key_hash" varchar(64) NOT NULL,
  "window_started_at" timestamptz NOT NULL,
  "request_count" integer NOT NULL,
  "expires_at" timestamptz NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT "assessment_rate_limits_scope_check"
    CHECK ("scope" IN ('submit', 'contact')),
  CONSTRAINT "assessment_rate_limits_key_hash_check"
    CHECK (char_length("key_hash") = 64),
  CONSTRAINT "assessment_rate_limits_request_count_check"
    CHECK ("request_count" > 0)
);

CREATE UNIQUE INDEX IF NOT EXISTS "assessment_rate_limits_scope_key_uq"
  ON "assessment_rate_limits" ("scope", "key_hash");

CREATE INDEX IF NOT EXISTS "assessment_rate_limits_expires_at_idx"
  ON "assessment_rate_limits" ("expires_at");

COMMENT ON TABLE "assessment_rate_limits" IS
  'Short-lived shared abuse-control counters. key_hash is an HMAC-derived request identifier; no assessment answers, results, contact details or result tokens are stored.';

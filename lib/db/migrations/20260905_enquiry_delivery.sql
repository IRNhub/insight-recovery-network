-- Additive migration. Apply explicitly before the enquiry release, never in a request.
-- Existing enquiries and their historical notification state are preserved.
BEGIN;
ALTER TABLE enquiries
  ADD COLUMN IF NOT EXISTS landing_page text,
  ADD COLUMN IF NOT EXISTS service_interest text NOT NULL DEFAULT 'not-sure',
  ADD COLUMN IF NOT EXISTS current_page text,
  ADD COLUMN IF NOT EXISTS referrer text,
  ADD COLUMN IF NOT EXISTS page_source text,
  ADD COLUMN IF NOT EXISTS utm_source text,
  ADD COLUMN IF NOT EXISTS utm_medium text,
  ADD COLUMN IF NOT EXISTS utm_campaign text,
  ADD COLUMN IF NOT EXISTS utm_term text,
  ADD COLUMN IF NOT EXISTS utm_content text,
  ADD COLUMN IF NOT EXISTS submission_key uuid,
  ADD COLUMN IF NOT EXISTS submission_hash varchar(64);
CREATE UNIQUE INDEX IF NOT EXISTS enquiries_submission_key_uq ON enquiries (submission_key);

CREATE TABLE IF NOT EXISTS enquiry_deliveries (
  enquiry_id integer NOT NULL REFERENCES enquiries(id) ON DELETE CASCADE,
  channel text NOT NULL CHECK (channel IN ('notification', 'crm')),
  status text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'sent', 'failed')),
  attempts integer NOT NULL DEFAULT 0,
  next_attempt_at timestamptz NOT NULL DEFAULT now(),
  claimed_until timestamptz,
  lease_token uuid,
  last_error_code text,
  external_id text,
  sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (enquiry_id, channel)
);
CREATE INDEX IF NOT EXISTS enquiry_deliveries_due_idx ON enquiry_deliveries (next_attempt_at) WHERE status IN ('queued', 'processing');

CREATE TABLE IF NOT EXISTS enquiry_rate_limits (
  key_hash varchar(64) PRIMARY KEY,
  request_count integer NOT NULL,
  expires_at timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS enquiry_rate_limits_expiry_idx ON enquiry_rate_limits (expires_at);
COMMENT ON TABLE enquiry_deliveries IS 'Delivery state only; contact content remains in enquiries. Historical enquiries are not automatically replayed.';
COMMENT ON TABLE enquiry_rate_limits IS 'Expiring HMAC identifiers for shared enquiry abuse limits; no raw IP addresses.';
COMMIT;

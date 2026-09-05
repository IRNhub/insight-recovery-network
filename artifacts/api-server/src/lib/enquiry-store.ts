import { createHmac, randomUUID } from "node:crypto";
import type { pool as dbPool } from "@workspace/db";
import type { EnquiryInput } from "./enquiry-input.ts";

type Pool = Pick<typeof dbPool, "query" | "connect">;
export class EnquiryConflict extends Error {}
export type Delivery = {
  enquiry_id: number;
  channel: "crm" | "notification";
  attempts: number;
  lease_token: string;
};

export function createEnquiryStore(
  pool: Pool,
  getSecret: () => string | undefined,
) {
  function hmac(value: string) {
    const secret = getSecret();
    if (!secret) throw new Error("enquiry_security_configuration_missing");
    return createHmac("sha256", secret).update(value).digest("hex");
  }
  return {
    async rateLimit(identifier: string) {
      const key = hmac(`enquiry-rate:v1:${identifier}`);
      const { rows } = await pool.query(
        `INSERT INTO enquiry_rate_limits AS limits (key_hash, request_count, expires_at)
        VALUES ($1, 1, clock_timestamp() + interval '15 minutes')
        ON CONFLICT (key_hash) DO UPDATE SET request_count = CASE WHEN limits.expires_at <= clock_timestamp() THEN 1 ELSE LEAST(limits.request_count + 1, 11) END,
        expires_at = CASE WHEN limits.expires_at <= clock_timestamp() THEN EXCLUDED.expires_at ELSE limits.expires_at END
        RETURNING request_count > 10 AS limited, GREATEST(1, CEIL(EXTRACT(EPOCH FROM expires_at - clock_timestamp())))::integer AS retry_after`,
        [key],
      );
      return rows[0] as { limited: boolean; retry_after: number };
    },
    async accept(input: EnquiryInput) {
      const { submissionId, website, ...content } = input;
      const key = submissionId ?? randomUUID();
      const digest = hmac(`enquiry-body:v1:${JSON.stringify(content)}`);
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        const inserted = await client.query(
          `INSERT INTO enquiries
          (name,email,phone,preferred_contact,support_type,service_interest,message,consent,landing_page,current_page,referrer,page_source,utm_source,utm_medium,utm_campaign,utm_term,utm_content,submission_key,submission_hash)
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)
          ON CONFLICT (submission_key) DO NOTHING RETURNING id, created_at`,
          [
            input.name,
            input.email,
            input.phone,
            input.preferredContact,
            input.supportType,
            input.serviceInterest,
            input.message,
            true,
            input.landingPage,
            input.currentPage,
            input.referrer,
            input.pageSource,
            input.utmSource,
            input.utmMedium,
            input.utmCampaign,
            input.utmTerm,
            input.utmContent,
            key,
            digest,
          ],
        );
        if (!inserted.rows[0]) {
          const existing = await client.query(
            "SELECT id, created_at, submission_hash FROM enquiries WHERE submission_key = $1",
            [key],
          );
          if (!existing.rows[0] || existing.rows[0].submission_hash !== digest)
            throw new EnquiryConflict("submission_key_reused");
          await client.query("COMMIT");
          return {
            id: existing.rows[0].id as number,
            createdAt: existing.rows[0].created_at as Date,
            created: false,
          };
        }
        const row = inserted.rows[0];
        await client.query(
          `INSERT INTO enquiry_deliveries (enquiry_id,channel) VALUES ($1,'notification'),($1,'crm')`,
          [row.id],
        );
        await client.query("COMMIT");
        return {
          id: row.id as number,
          createdAt: row.created_at as Date,
          created: true,
        };
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    },
    async claim(): Promise<Delivery | undefined> {
      await pool.query(`UPDATE enquiry_deliveries SET status='failed',claimed_until=NULL,last_error_code='worker_lease_expired',updated_at=clock_timestamp()
        WHERE status='processing' AND claimed_until < clock_timestamp() AND attempts >= 8`);
      const token = randomUUID();
      const { rows } = await pool.query(
        `UPDATE enquiry_deliveries AS delivery SET status='processing', attempts=delivery.attempts+1,
        claimed_until=clock_timestamp()+interval '2 minutes', lease_token=$1, updated_at=clock_timestamp()
        WHERE (enquiry_id,channel) = (SELECT enquiry_id,channel FROM enquiry_deliveries
          WHERE attempts < 8 AND ((status='queued' AND next_attempt_at <= clock_timestamp()) OR (status='processing' AND claimed_until < clock_timestamp()))
          ORDER BY next_attempt_at, enquiry_id FOR UPDATE SKIP LOCKED LIMIT 1)
        RETURNING enquiry_id,channel,attempts,lease_token`,
        [token],
      );
      return rows[0] as Delivery | undefined;
    },
    async payload(id: number) {
      const { rows } = await pool.query(
        `SELECT id::text AS "enquiryId", created_at AS "createdAt", name,email,phone,preferred_contact AS "preferredContact",
        support_type AS "supportType",service_interest AS "serviceInterest",message,consent,landing_page AS "landingPage",current_page AS "currentPage",referrer,page_source AS "pageSource",
        utm_source AS "utmSource",utm_medium AS "utmMedium",utm_campaign AS "utmCampaign",utm_term AS "utmTerm",utm_content AS "utmContent" FROM enquiries WHERE id=$1`,
        [id],
      );
      return rows[0];
    },
    async complete(delivery: Delivery, externalId?: string) {
      await pool.query(
        `WITH completed AS (UPDATE enquiry_deliveries SET status='sent',sent_at=clock_timestamp(),updated_at=clock_timestamp(),claimed_until=NULL,last_error_code=NULL,external_id=$4
        WHERE enquiry_id=$1 AND channel=$2 AND lease_token=$3 AND status='processing' RETURNING enquiry_id, channel)
        UPDATE enquiries SET notification_sent=true WHERE id IN (SELECT enquiry_id FROM completed WHERE channel='notification')`,
        [
          delivery.enquiry_id,
          delivery.channel,
          delivery.lease_token,
          externalId ?? null,
        ],
      );
    },
    async fail(
      delivery: Delivery,
      code: "notification_failed" | "crm_unavailable" | "missing_enquiry",
    ) {
      await pool.query(
        `UPDATE enquiry_deliveries SET status=$4, next_attempt_at=clock_timestamp()+make_interval(secs=>$5::double precision), claimed_until=NULL,last_error_code=$6,updated_at=clock_timestamp()
        WHERE enquiry_id=$1 AND channel=$2 AND lease_token=$3 AND status='processing'`,
        [
          delivery.enquiry_id,
          delivery.channel,
          delivery.lease_token,
          delivery.attempts >= 8 ? "failed" : "queued",
          Math.min(30 * 2 ** (delivery.attempts - 1), 3600),
          code,
        ],
      );
    },
    async cleanup() {
      await pool.query(
        "DELETE FROM enquiry_rate_limits WHERE expires_at < clock_timestamp()",
      );
    },
  };
}
export type EnquiryStore = ReturnType<typeof createEnquiryStore>;

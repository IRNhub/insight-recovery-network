import { pool } from "@workspace/db";
import {
  createAssessmentRateLimiter,
  type AssessmentRateLimitDecision,
  type AssessmentRateLimitIncrement,
  type AssessmentRateLimitStore,
} from "./assessment-rate-limit.ts";

interface AssessmentRateLimitRow {
  request_count: number;
  limited: boolean;
  retry_after_seconds: number;
}

const INCREMENT_SQL = `
  INSERT INTO "assessment_rate_limits" AS current_limit (
    "scope",
    "key_hash",
    "window_started_at",
    "request_count",
    "expires_at",
    "created_at",
    "updated_at"
  )
  VALUES (
    $1,
    $2,
    clock_timestamp(),
    1,
    clock_timestamp() + make_interval(secs => $3::double precision),
    clock_timestamp(),
    clock_timestamp()
  )
  ON CONFLICT ("scope", "key_hash") DO UPDATE SET
    "request_count" = CASE
      WHEN current_limit."expires_at" <= EXCLUDED."window_started_at" THEN 1
      ELSE LEAST(current_limit."request_count" + 1, $4::integer + 1)
    END,
    "window_started_at" = CASE
      WHEN current_limit."expires_at" <= EXCLUDED."window_started_at"
        THEN EXCLUDED."window_started_at"
      ELSE current_limit."window_started_at"
    END,
    "expires_at" = CASE
      WHEN current_limit."expires_at" <= EXCLUDED."window_started_at"
        THEN EXCLUDED."expires_at"
      ELSE current_limit."expires_at"
    END,
    "updated_at" = EXCLUDED."updated_at"
  RETURNING
    "request_count",
    ("request_count" > $4::integer) AS "limited",
    GREATEST(
      1,
      CEIL(EXTRACT(EPOCH FROM ("expires_at" - clock_timestamp())))::integer
    ) AS "retry_after_seconds"
`;

export const postgresAssessmentRateLimitStore: AssessmentRateLimitStore = {
  async increment(input: AssessmentRateLimitIncrement): Promise<AssessmentRateLimitDecision> {
    const result = await pool.query<AssessmentRateLimitRow>(INCREMENT_SQL, [
      input.scope,
      input.keyHash,
      input.windowSeconds,
      input.maximum,
    ]);
    const row = result.rows[0];
    if (!row) throw new Error("Assessment rate-limit increment returned no row");
    return {
      limited: row.limited,
      count: row.request_count,
      retryAfterSeconds: row.retry_after_seconds,
    };
  },

  async cleanupExpired(): Promise<number> {
    const result = await pool.query(
      `DELETE FROM "assessment_rate_limits" WHERE "expires_at" <= clock_timestamp()`,
    );
    return result.rowCount ?? 0;
  },
};

export const assessmentRateLimiter = createAssessmentRateLimiter(
  postgresAssessmentRateLimitStore,
  () => process.env.ADMIN_SECRET,
);

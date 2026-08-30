import { logger } from "../lib/logger.ts";
import { postgresAssessmentRateLimitStore } from "./assessment-rate-limit-postgres.ts";

const CLEANUP_INTERVAL_MS = 6 * 60 * 60 * 1000;

export async function runAssessmentRateLimitCleanup(): Promise<void> {
  try {
    const deletedRows = await postgresAssessmentRateLimitStore.cleanupExpired();
    if (deletedRows > 0) {
      logger.info({ deletedRows }, "Expired assessment rate-limit counters removed");
    }
  } catch (error) {
    logger.warn({ err: error }, "Assessment rate-limit cleanup failed");
  }
}

export function startAssessmentRateLimitCleanupWorker(): void {
  runAssessmentRateLimitCleanup().catch(() => undefined);
  const timer = setInterval(() => {
    runAssessmentRateLimitCleanup().catch(() => undefined);
  }, CLEANUP_INTERVAL_MS);
  timer.unref();
}

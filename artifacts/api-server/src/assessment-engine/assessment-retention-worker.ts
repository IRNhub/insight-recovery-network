import { assessmentsTable, db } from "@workspace/db";
import { lte } from "drizzle-orm";
import { logger } from "../lib/logger.ts";

const RETENTION_PASS_INTERVAL_MS = 6 * 60 * 60 * 1000;

let running = false;

/**
 * Delete assessment rows from the live database when their explicit retention
 * deadline has passed. Linked assessment_deliveries rows are removed by the database's
 * ON DELETE CASCADE constraint. Legacy rows with no delete_after value are not
 * selected, so this worker cannot silently apply the new schedule to them.
 */
export async function deleteExpiredAssessments(now = new Date()): Promise<number> {
  const deleted = await db
    .delete(assessmentsTable)
    .where(lte(assessmentsTable.deleteAfter, now))
    .returning({ id: assessmentsTable.id });

  if (deleted.length > 0) {
    logger.info({ deletedCount: deleted.length }, "Expired assessment records deleted");
  }
  return deleted.length;
}

export async function runAssessmentRetentionPass(now = new Date()): Promise<void> {
  if (running) return;
  running = true;
  try {
    await deleteExpiredAssessments(now);
  } catch (error) {
    logger.warn({ err: error }, "Assessment retention pass failed");
  } finally {
    running = false;
  }
}

export function startAssessmentRetentionWorker(): void {
  runAssessmentRetentionPass().catch(() => undefined);
  const timer = setInterval(() => {
    runAssessmentRetentionPass().catch(() => undefined);
  }, RETENTION_PASS_INTERVAL_MS);
  timer.unref();
}

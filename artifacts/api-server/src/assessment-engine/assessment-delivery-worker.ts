import {
  assessmentDeliveriesTable,
  assessmentsTable,
  db,
} from "@workspace/db";
import { and, inArray, lt, lte, or, eq } from "drizzle-orm";
import { logger } from "../lib/logger.ts";
import { assessmentDeliveryHandlers } from "./assessment-delivery.ts";
import {
  assessmentPersistence,
  storedAssessmentFromRow,
} from "./assessment-persistence.ts";
import { attemptAssessmentDeliveries } from "./assessment-service.ts";

let running = false;

export async function retryPendingAssessmentDeliveries(): Promise<void> {
  if (running) return;
  running = true;
  try {
    const due = await db
      .select({ assessmentId: assessmentDeliveriesTable.assessmentId })
      .from(assessmentDeliveriesTable)
      .where(and(
        or(
          eq(assessmentDeliveriesTable.status, "queued"),
          eq(assessmentDeliveriesTable.status, "failed"),
        ),
        lte(assessmentDeliveriesTable.nextAttemptAt, new Date()),
        lt(assessmentDeliveriesTable.attempts, 5),
      ))
      .limit(20);

    const ids = [...new Set(due.map((row) => row.assessmentId))];
    if (ids.length === 0) return;
    const rows = await db.select().from(assessmentsTable).where(inArray(assessmentsTable.id, ids));

    for (const row of rows) {
      const record = storedAssessmentFromRow(row);
      if (!record) continue;
      await attemptAssessmentDeliveries(record, assessmentPersistence, assessmentDeliveryHandlers);
    }
  } catch (error) {
    logger.warn({ err: error }, "Assessment delivery retry pass failed");
  } finally {
    running = false;
  }
}

export function startAssessmentDeliveryWorker(): void {
  // Allow the request path to complete its immediate delivery attempts before
  // the first retry pass can claim newly queued work.
  const timer = setInterval(() => {
    retryPendingAssessmentDeliveries().catch(() => undefined);
  }, 60_000);
  timer.unref();
}

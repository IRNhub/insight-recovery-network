import { pool } from "@workspace/db";
import { createEnquiryStore } from "./enquiry-store.ts";
import { createEnquiryDeliveryRunner } from "./enquiry-delivery.ts";
import { sendEnquiryNotification } from "./email";
import { forwardEnquiryToIrnOs } from "./irn-os.ts";
import { logger } from "./logger.ts";

export const enquiryStore = createEnquiryStore(
  pool,
  () => process.env.ADMIN_SECRET,
);
export async function assertEnquiryStorageReady() {
  if (!process.env.ADMIN_SECRET)
    throw new Error("Enquiry acceptance requires ADMIN_SECRET");
  // Read-only checks: deployment must apply the additive migration explicitly.
  await pool.query(
    "SELECT submission_key,submission_hash FROM enquiries LIMIT 0",
  );
  await pool.query(
    "SELECT enquiry_id,lease_token,status FROM enquiry_deliveries LIMIT 0",
  );
  await pool.query(
    "SELECT key_hash,expires_at FROM enquiry_rate_limits LIMIT 0",
  );
}
const run = createEnquiryDeliveryRunner({
  store: enquiryStore,
  notify: sendEnquiryNotification,
  forward: forwardEnquiryToIrnOs,
  warn: (details) =>
    logger.warn(details, "Enquiry delivery requires retry or review"),
});
let running = false;
export async function processEnquiryDeliveries() {
  if (running) return;
  running = true;
  try {
    await run();
  } catch {
    logger.error(
      { code: "enquiry_worker_failed" },
      "Unable to process enquiry deliveries",
    );
  } finally {
    running = false;
  }
}
export function startEnquiryDeliveryWorker() {
  void processEnquiryDeliveries();
  setInterval(() => {
    void processEnquiryDeliveries();
  }, 15_000).unref();
  setInterval(() => {
    enquiryStore
      .cleanup()
      .catch(() =>
        logger.warn(
          { code: "enquiry_limit_cleanup_failed" },
          "Unable to clean enquiry limits",
        ),
      );
  }, 900_000).unref();
}

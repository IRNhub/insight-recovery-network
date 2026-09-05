import { Router, type IRouter, type Request, type Response } from "express";
import { db, enquiriesTable, pool } from "@workspace/db";
import { desc } from "drizzle-orm";
import { logger } from "../lib/logger";
import { enquiryInput, sanitiseEnquirySource } from "../lib/enquiry-input";
import { EnquiryConflict } from "../lib/enquiry-store";
import { enquiryStore, processEnquiryDeliveries } from "../lib/enquiry-worker";
import { timingSafeEqual } from "node:crypto";

const router: IRouter = Router();
function requireAdmin(req: Request, res: Response): boolean {
  const value = req.headers["x-admin-secret"];
  const expected = process.env.ADMIN_SECRET;
  if (
    typeof value !== "string" ||
    !expected ||
    Buffer.byteLength(value) !== Buffer.byteLength(expected) ||
    !timingSafeEqual(Buffer.from(value), Buffer.from(expected))
  ) {
    res.status(401).json({ error: "Unauthorised" });
    return false;
  }
  return true;
}
router.post("/enquiries", async (req: Request, res: Response) => {
  res.setHeader("Cache-Control", "private, no-store");
  try {
    // app.ts supplies the explicitly trusted proxy policy. Never read X-Forwarded-For here.
    const limit = await enquiryStore.rateLimit(req.ip || "unknown");
    if (limit.limited) {
      res.setHeader("Retry-After", limit.retry_after);
      res
        .status(429)
        .json({
          error: "Please wait before trying again, or contact IRN directly.",
        });
      return;
    }
    const parsed = enquiryInput.safeParse(req.body);
    if (!parsed.success) {
      res
        .status(422)
        .json({
          error: "Please check your enquiry",
          details: parsed.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        });
      return;
    }
    if (parsed.data.website) {
      res
        .status(422)
        .json({
          error: "Unable to accept this request. Please contact IRN directly.",
        });
      return;
    }
    // Autofill or fast completion is not evidence that a legitimate request should be discarded.
    const receipt = await enquiryStore.accept(
      sanitiseEnquirySource(parsed.data),
    );
    res
      .status(receipt.created ? 201 : 200)
      .json({ id: receipt.id, createdAt: receipt.createdAt });
    void processEnquiryDeliveries();
  } catch (error) {
    if (error instanceof EnquiryConflict) {
      res
        .status(409)
        .json({
          error:
            "This request has changed. Please refresh the form before trying again.",
        });
      return;
    }
    logger.error(
      { code: "enquiry_acceptance_failed" },
      "Unable to confirm enquiry acceptance",
    );
    res
      .status(503)
      .json({
        error:
          "We could not confirm your enquiry. Please retry or contact IRN directly.",
      });
  }
});
router.get("/admin/enquiries", async (req: Request, res: Response) => {
  res.setHeader("Cache-Control", "private, no-store");
  if (!requireAdmin(req, res)) return;
  try {
    const rows = await db
      .select()
      .from(enquiriesTable)
      .orderBy(desc(enquiriesTable.createdAt));
    const states = await pool.query(
      "SELECT enquiry_id,channel,status,attempts,last_error_code,sent_at FROM enquiry_deliveries",
    );
    res.json(
      rows.map((row) => ({
        ...row,
        deliveries: states.rows
          .filter((state) => state.enquiry_id === row.id)
          .map(({ enquiry_id, ...state }) => state),
      })),
    );
  } catch {
    logger.error(
      { code: "enquiry_admin_read_failed" },
      "Unable to read enquiry delivery status",
    );
    res.status(500).json({ error: "Failed to fetch enquiries" });
  }
});
router.post(
  "/admin/enquiries/process-deliveries",
  async (req: Request, res: Response) => {
    res.setHeader("Cache-Control", "private, no-store");
    if (!requireAdmin(req, res)) return;
    await processEnquiryDeliveries();
    const result = await pool.query(
      `SELECT channel,status,count(*)::integer AS count FROM enquiry_deliveries WHERE status <> 'sent' GROUP BY channel,status`,
    );
    res.json({ pending: result.rows });
  },
);
export default router;

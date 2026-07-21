import crypto from "node:crypto";
import { Router, type IRouter, type Request, type Response } from "express";
import { z } from "zod";
import { db, surveyAuditLogTable, surveysTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { ensureSurveyTables } from "../lib/survey-tables";
import { logger } from "../lib/logger";

const router: IRouter = Router();

function serviceAuthorised(req: Request): boolean {
  const expected = process.env.IRN_SURVEY_SERVICE_API_KEY || "";
  const header = String(req.headers.authorization || "");
  const provided = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!expected || !provided || expected.length !== provided.length) return false;
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(provided));
}

const transitions: Record<string, string[]> = {
  draft: ["open"],
  open: ["closed"],
  closed: ["open", "archived"],
  archived: [],
};

router.post("/integrations/irnos/surveys/status", async (req: Request, res: Response) => {
  res.setHeader("Cache-Control", "private, no-store");
  if (!serviceAuthorised(req)) return res.status(401).json({ updated: false, error: "Unauthorized" });
  const parsed = z.object({
    slug: z.string().min(1).max(200),
    status: z.enum(["open", "closed", "archived"]),
  }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ updated: false, error: "Invalid status request" });
  try {
    await ensureSurveyTables();
    const [survey] = await db.select().from(surveysTable).where(eq(surveysTable.slug, parsed.data.slug));
    if (!survey) return res.status(404).json({ updated: false, error: "Survey not found" });
    if (survey.status !== parsed.data.status && !transitions[survey.status]?.includes(parsed.data.status)) {
      return res.status(409).json({ updated: false, error: `Cannot change status from ${survey.status} to ${parsed.data.status}` });
    }
    const now = new Date();
    const [updated] = await db.update(surveysTable).set({
      status: parsed.data.status,
      isPublic: parsed.data.status === "open" || parsed.data.status === "closed",
      opensAt: parsed.data.status === "open" && !survey.opensAt ? now : survey.opensAt,
      closesAt: parsed.data.status === "closed" ? now : survey.closesAt,
      updatedAt: now,
    }).where(eq(surveysTable.id, survey.id)).returning();
    await db.insert(surveyAuditLogTable).values({
      surveyId: survey.id,
      action: `survey_${parsed.data.status}`,
      actor: "irnos-service",
    });
    return res.json({ updated: true, survey: { slug: updated?.slug, status: updated?.status } });
  } catch (error) {
    logger.error({ error }, "IRNOS survey control request failed");
    return res.status(500).json({ updated: false, error: "Status update failed" });
  }
});

export default router;

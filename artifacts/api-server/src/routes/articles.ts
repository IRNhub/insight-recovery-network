import { Router, type IRouter, type Request, type Response } from "express";
import { db, articlesTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { logger } from "../lib/logger";
import { insertArticleSchema, updateArticleSchema } from "@workspace/db";

const router: IRouter = Router();

function requireAdmin(req: Request, res: Response): boolean {
  const secret = req.headers["x-admin-secret"];
  const expected = process.env.ADMIN_SECRET;
  if (!expected || secret !== expected) {
    res.status(401).json({ error: "Unauthorised" });
    return false;
  }
  return true;
}

router.get("/articles", async (_req: Request, res: Response) => {
  try {
    const rows = await db
      .select()
      .from(articlesTable)
      .where(eq(articlesTable.published, true))
      .orderBy(desc(articlesTable.date));
    res.json(rows);
  } catch (err) {
    logger.error({ err }, "Failed to list articles");
    res.status(500).json({ error: "Failed to fetch articles" });
  }
});

router.get("/articles/:slug", async (req: Request, res: Response) => {
  const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
  if (!slug) {
    res.status(400).json({ error: "Invalid article slug" });
    return;
  }

  try {
    const [row] = await db
      .select()
      .from(articlesTable)
      .where(eq(articlesTable.slug, slug));
    if (!row || !row.published) {
      res.status(404).json({ error: "Article not found" });
      return;
    }
    res.json(row);
  } catch (err) {
    logger.error({ err }, "Failed to get article");
    res.status(500).json({ error: "Failed to fetch article" });
  }
});

router.get("/admin/articles", async (req: Request, res: Response) => {
  if (!requireAdmin(req, res)) return;
  try {
    const rows = await db
      .select()
      .from(articlesTable)
      .orderBy(desc(articlesTable.updatedAt));
    res.json(rows);
  } catch (err) {
    logger.error({ err }, "Failed to list all articles");
    res.status(500).json({ error: "Failed to fetch articles" });
  }
});

router.post("/admin/articles", async (req: Request, res: Response) => {
  if (!requireAdmin(req, res)) return;
  const parsed = insertArticleSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ error: "Validation failed", details: parsed.error.issues });
    return;
  }
  try {
    const [row] = await db
      .insert(articlesTable)
      .values({ ...parsed.data, updatedAt: new Date() })
      .returning();
    res.status(201).json(row);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("unique")) {
      res.status(409).json({ error: "An article with that slug already exists" });
      return;
    }
    logger.error({ err }, "Failed to create article");
    res.status(500).json({ error: "Failed to create article" });
  }
});

router.put("/admin/articles/:id", async (req: Request, res: Response) => {
  if (!requireAdmin(req, res)) return;
  const id = Number(req.params.id);
  if (!id) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const parsed = updateArticleSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ error: "Validation failed", details: parsed.error.issues });
    return;
  }
  try {
    const [row] = await db
      .update(articlesTable)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(articlesTable.id, id))
      .returning();
    if (!row) {
      res.status(404).json({ error: "Article not found" });
      return;
    }
    res.json(row);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("unique")) {
      res.status(409).json({ error: "An article with that slug already exists" });
      return;
    }
    logger.error({ err }, "Failed to update article");
    res.status(500).json({ error: "Failed to update article" });
  }
});

router.delete("/admin/articles/:id", async (req: Request, res: Response) => {
  if (!requireAdmin(req, res)) return;
  const id = Number(req.params.id);
  if (!id) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  try {
    const [row] = await db
      .delete(articlesTable)
      .where(eq(articlesTable.id, id))
      .returning({ id: articlesTable.id });
    if (!row) {
      res.status(404).json({ error: "Article not found" });
      return;
    }
    res.status(204).send();
  } catch (err) {
    logger.error({ err }, "Failed to delete article");
    res.status(500).json({ error: "Failed to delete article" });
  }
});

export default router;

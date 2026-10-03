import { Router, type IRouter } from "express";
import { db, articlesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { loadResourceLibrary } from "../lib/resource-library.ts";
import { logger } from "../lib/logger";

const router: IRouter = Router();

router.get("/resource-library", async (_req, res) => {
  const library = await loadResourceLibrary(
    () => db.select({
      slug: articlesTable.slug,
      title: articlesTable.title,
      excerpt: articlesTable.excerpt,
      category: articlesTable.category,
      image: articlesTable.image,
      readingTime: articlesTable.readingTime,
      date: articlesTable.date,
    }).from(articlesTable).where(eq(articlesTable.published, true)),
    () => logger.warn("Resource library database unavailable; serving bundled public metadata"),
  );
  res.setHeader("Cache-Control", "public, max-age=300");
  res.json(library);
});

export default router;

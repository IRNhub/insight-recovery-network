/**
 * Auto-seed articles on API server startup.
 * The seed data is bundled at build time from articles-seed-data.json (which
 * is generated from the static frontend articles.ts).  On first start, if the
 * articles table is empty, all 9 core articles are inserted as published.
 * This makes every deployment self-healing — no manual seeding step needed.
 */
import { db, articlesTable } from "@workspace/db";
import { count } from "drizzle-orm";
import { logger } from "./logger";
import articlesData from "./articles-seed-data.json" with { type: "json" };

interface SeedArticle {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  authorRole: string;
  date: string;
  readingTime: number;
  category: string;
  content: string;
  image?: string | null;
}

const SEED_ARTICLES = articlesData as SeedArticle[];

export async function seedArticlesIfEmpty(): Promise<void> {
  try {
    const [{ value }] = await db
      .select({ value: count() })
      .from(articlesTable);

    if (Number(value) > 0) return; // Already seeded — nothing to do

    logger.info({ count: SEED_ARTICLES.length }, "Articles table is empty — seeding initial content");

    for (const article of SEED_ARTICLES) {
      await db
        .insert(articlesTable)
        .values({
          slug: article.slug,
          title: article.title,
          excerpt: article.excerpt,
          author: article.author,
          authorRole: article.authorRole,
          date: article.date,
          readingTime: article.readingTime,
          category: article.category,
          content: article.content,
          image: article.image ?? null,
          published: true,
        })
        .onConflictDoNothing();
    }

    logger.info({ count: SEED_ARTICLES.length }, "Articles seeded successfully");
  } catch (err) {
    // Non-fatal: the frontend falls back to static articles if the DB is empty
    logger.error({ err }, "Auto-seed failed — articles will fall back to static data");
  }
}

import {
  articles as staticArticles,
  isApprovedArticleSlug,
} from "@/data/articles";
import type { Article } from "@/data/articles";

export async function fetchMergedArticles(): Promise<Article[]> {
  try {
    const res = await fetch("/api/articles");
    if (!res.ok) return staticArticles;

    const dbArticles: Article[] = await res.json();
    if (dbArticles.length === 0) return staticArticles;

    const dbWithoutApprovedArticles = dbArticles.filter(
      (article) => !isApprovedArticleSlug(article.slug),
    );
    const dbSlugs = new Set(dbWithoutApprovedArticles.map((article) => article.slug));
    const staticOnly = staticArticles.filter(
      (article) => isApprovedArticleSlug(article.slug) || !dbSlugs.has(article.slug),
    );
    const merged = [...dbWithoutApprovedArticles, ...staticOnly];

    merged.sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
    return merged;
  } catch {
    return staticArticles;
  }
}

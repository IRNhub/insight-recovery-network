import { articles as staticArticles } from "@/data/articles";
import type { Article } from "@/data/articles";

export async function fetchMergedArticles(): Promise<Article[]> {
  try {
    const res = await fetch("/api/articles");
    if (!res.ok) return staticArticles;

    const dbArticles: Article[] = await res.json();
    if (dbArticles.length === 0) return staticArticles;

    const dbSlugs = new Set(dbArticles.map((article) => article.slug));
    const staticOnly = staticArticles.filter((article) => !dbSlugs.has(article.slug));
    const merged = [...dbArticles, ...staticOnly];

    merged.sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
    return merged;
  } catch {
    return staticArticles;
  }
}

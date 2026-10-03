import snapshot from "./resource-library-static.json" with { type: "json" };

const SITE_URL = "https://www.insightrecoverynetwork.com";
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export interface ResourceArticleSource {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  image?: string | null;
  readingTime: number;
  date: string;
  publishedStatus?: string;
  published?: boolean;
}

export interface ResourceLibrarySource {
  articles: ResourceArticleSource[];
  approvedSlugs: string[];
  assessments: Array<{ slug: string; title: string; description: string; duration: string }>;
}

function publicImageUrl(image: string | null | undefined): string | null {
  if (!image) return null;
  try {
    const url = new URL(image, SITE_URL);
    if (!['www.insightrecoverynetwork.com', 'insightrecoverynetwork.com'].includes(url.hostname) ||
      !['https:', 'http:'].includes(url.protocol) || url.username || url.password || url.port) return null;
    return `${SITE_URL}${url.pathname}`;
  } catch {
    return null;
  }
}

function publishedDate(value: string): string | null {
  // Never use the request/build date to make undated content appear new.
  const date = /^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(value) ? new Date(value) : null;
  return date && Number.isFinite(date.getTime()) ? date.toISOString().slice(0, 10) : null;
}

export function buildResourceLibrary(
  databaseArticles: ResourceArticleSource[],
  source: ResourceLibrarySource = snapshot,
) {
  const approved = new Set(source.approvedSlugs);
  // Keep the website article-loader's precedence: approved static versions win;
  // other database articles override their static counterparts by slug.
  const database = databaseArticles.filter(article => article.published !== false && !approved.has(article.slug));
  const databaseSlugs = new Set(database.map(article => article.slug));
  const staticOnly = source.articles.filter(article => approved.has(article.slug) || !databaseSlugs.has(article.slug));
  const seen = new Set<string>();
  const articles = [...database, ...staticOnly]
    .filter(article => SLUG.test(article.slug) && (!article.publishedStatus || article.publishedStatus === "published"))
    .filter(article => {
      // Article detail resolves the first matching source slug. Do the same when
      // older static collections contain repeated entries for that public page.
      if (seen.has(article.slug)) return false;
      seen.add(article.slug);
      return true;
    })
    .map(article => ({
      id: article.slug,
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      category: article.category,
      imageUrl: publicImageUrl(article.image),
      readingTime: article.readingTime,
      publishedAt: publishedDate(article.date),
      url: `${SITE_URL}/resources/${article.slug}`,
    }))
    .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? "") || a.slug.localeCompare(b.slug, "en"));

  return {
    version: 1 as const,
    articles,
    assessments: source.assessments.filter(assessment => SLUG.test(assessment.slug)).map(assessment => ({
      slug: assessment.slug,
      title: assessment.title,
      description: assessment.description,
      duration: assessment.duration,
      url: `${SITE_URL}/assessments/${assessment.slug}`,
    })),
  };
}

export async function loadResourceLibrary(
  loadPublishedArticles: () => Promise<ResourceArticleSource[]>,
  onUnavailable: () => void = () => {},
) {
  try {
    return buildResourceLibrary(await loadPublishedArticles());
  } catch {
    onUnavailable();
    // A finite, build-time snapshot follows the website's existing static fallback.
    return buildResourceLibrary([]);
  }
}

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SEO } from "@/components/SEO";
import { Layout } from "@/components/layout/Layout";
import { CTASection } from "@/components/ui/cta-section";
import { ArticleCard } from "@/components/ui/article-card";
import { CATEGORIES, articles as staticArticles } from "@/data/articles";
import { BookOpen, Loader2, Search, X } from "lucide-react";
import resourcesHero from "../assets/resources-hero.png";
import type { Article } from "@/data/articles";

/**
 * Fetch published articles from the API and merge with the bundled static
 * articles so the page always shows content even if the production database
 * has not been seeded yet.  DB articles take precedence (same slug wins),
 * and any articles added only via the admin CMS are appended to the list.
 */
async function fetchArticles(): Promise<Article[]> {
  try {
    const res = await fetch("/api/articles");
    if (!res.ok) return staticArticles;
    const dbArticles: Article[] = await res.json();
    if (dbArticles.length === 0) return staticArticles;
    // Merge: DB articles first (CMS edits win), then fill in any static-only ones
    const dbSlugs = new Set(dbArticles.map((a) => a.slug));
    const staticOnly = staticArticles.filter((a) => !dbSlugs.has(a.slug));
    return [...dbArticles, ...staticOnly];
  } catch {
    return staticArticles;
  }
}

function matchesSearch(article: Article, query: string): boolean {
  const q = query.toLowerCase().trim();
  if (!q) return true;
  return (
    article.title.toLowerCase().includes(q) ||
    article.excerpt.toLowerCase().includes(q) ||
    article.category.toLowerCase().includes(q) ||
    article.content.toLowerCase().includes(q)
  );
}

export default function ResourcesList() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: articles = staticArticles, isLoading, isError } = useQuery({
    queryKey: ["articles"],
    queryFn: fetchArticles,
    staleTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  });

  const filtered = articles.filter((a) => {
    const isPublished = !a.publishedStatus || a.publishedStatus === "published";
    const categoryMatch = activeCategory === "All" || a.category === activeCategory;
    const searchMatch = matchesSearch(a, searchQuery);
    return isPublished && categoryMatch && searchMatch;
  });

  const hasActiveFilter = searchQuery.trim() !== "" || activeCategory !== "All";

  return (
    <Layout>
      <SEO
        title="Resources — Addiction, Recovery & Mental Health Articles"
        description="Expert articles on addiction, recovery, mental health, and treatment options — written by clinical specialists to help individuals and families make informed decisions."
        canonical="/resources"
      />

      {/* ── Hero — two-column ── */}
      <section
        style={{
          background:
            "linear-gradient(160deg, #F2EDE3 0%, #F6F4EF 50%, #EEE9DF 100%)",
          borderBottom: "1px solid rgba(201,169,110,0.2)",
        }}
      >
        <div className="container mx-auto px-6 md:px-12 py-10 md:py-14">
          <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-12">
            {/* Left: copy */}
            <div className="lg:w-[54%] flex flex-col">
              <div className="w-7 h-px mb-5" style={{ background: "#C9A96E" }} />
              <p className="text-[10px] font-semibold tracking-[0.20em] uppercase text-accent/70 font-sans mb-3">
                Clinical Resources
              </p>
              <h1
                className="font-serif text-primary leading-tight mb-4"
                style={{ fontSize: "clamp(1.9rem, 3.5vw, 2.75rem)" }}
              >
                Insight and guidance from clinical experience.
              </h1>
              <p className="text-[15px] text-muted-foreground font-light leading-relaxed mb-3 max-w-xl">
                Authoritative articles on addiction, recovery, mental health and
                treatment — written to help individuals and families navigate
                complex decisions with clarity.
              </p>
              <p className="text-xs text-muted-foreground/55 font-light leading-relaxed max-w-xl">
                All articles are written by Craig Bilton, Founder and Clinical
                Director of the Insight Recovery Network.
              </p>
            </div>

            {/* Right: editorial visual */}
            <div className="lg:flex-1">
              <div
                className="relative rounded-2xl overflow-hidden"
                style={{
                  aspectRatio: "16/11",
                  boxShadow:
                    "0 12px 40px -8px rgba(22,43,59,0.20), 0 0 0 1px rgba(22,43,59,0.06)",
                }}
              >
                <img
                  src={resourcesHero}
                  alt="Clinical resource library — laptop showing the Insight Recovery Network resources page on a desk with clinical books and a notebook"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div
                  className="absolute bottom-4 left-4 px-3.5 py-2.5 rounded-lg flex items-center gap-2.5"
                  style={{
                    background: "rgba(22,43,59,0.84)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <BookOpen className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                  <div>
                    <p className="font-serif text-white text-[11px] leading-tight">
                      Clinical resource library
                    </p>
                    <p className="text-white/50 text-[10px] font-light">
                      Expert articles · Recovery guidance
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Search + Category filter (sticky) ── */}
      <section className="py-5 border-b border-border/40 bg-background sticky top-[72px] z-30">
        <div className="container mx-auto px-6 md:px-12 flex flex-col gap-3">
          {/* Search input */}
          <div className="relative max-w-sm">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
              strokeWidth={1.5}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles…"
              className="w-full pl-9 pr-8 py-2 text-sm border border-border/50 bg-transparent outline-none text-primary placeholder:text-muted-foreground focus:border-primary/40 transition-colors"
              data-testid="resources-search-input"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" strokeWidth={1.5} />
              </button>
            )}
          </div>

          {/* Category pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                data-testid={`filter-${cat
                  .toLowerCase()
                  .replace(/\s+/g, "-")
                  .replace(/&/g, "and")}`}
                className={`px-4 py-2 text-xs font-semibold tracking-widest uppercase transition-colors duration-200 border ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-transparent text-muted-foreground border-border/50 hover:border-primary/40 hover:text-primary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-6 md:px-12">
          {isLoading ? (
            <div className="flex items-center justify-center py-20 gap-3 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm font-light">Loading articles…</span>
            </div>
          ) : isError ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground font-light">
                Unable to load articles. Please try again shortly.
              </p>
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              {hasActiveFilter ? (
                <div className="flex flex-col items-center gap-3">
                  <p className="text-muted-foreground font-light">
                    No articles match
                    {searchQuery.trim() && (
                      <>
                        {" "}
                        <span className="font-medium text-primary">
                          "{searchQuery}"
                        </span>
                      </>
                    )}
                    {activeCategory !== "All" && (
                      <>
                        {searchQuery.trim() ? " in " : " "}
                        <span className="font-medium text-primary">
                          {activeCategory}
                        </span>
                      </>
                    )}
                    .
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setActiveCategory("All");
                    }}
                    className="text-xs font-semibold tracking-widest uppercase text-primary/60 hover:text-primary transition-colors"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <p className="text-muted-foreground font-light">
                  No articles yet.
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      <CTASection
        heading="Speak with a clinical specialist."
        description="Our articles provide information, but every situation is different. A confidential conversation can help clarify the right next step for you or your loved one."
        primaryCta={{ label: "Speak Confidentially", href: "/contact" }}
      />
    </Layout>
  );
}

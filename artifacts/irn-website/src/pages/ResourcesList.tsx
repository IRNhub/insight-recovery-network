import { ResponsiveImage } from "@/components/ResponsiveImage";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SEO } from "@/components/SEO";
import { Layout } from "@/components/layout/Layout";
import { ogImageUrl } from "@/config/og-pages";
import { CTASection } from "@/components/ui/cta-section";
import { ArticleCard } from "@/components/ui/article-card";
import { CATEGORIES, articles as staticArticles } from "@/data/articles";
import { fetchMergedArticles } from "@/lib/article-loader";
import { BookOpen, Loader2, Search, X } from "lucide-react";
import resourcesHero from "../assets/resources-hero.webp";
import type { Article } from "@/data/articles";
import { substanceTreatmentPages } from "@/data/substance-treatment-pages.js";
import { Link } from "wouter";

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

const withdrawalDecisionGuides = [
  {
    title: "Addiction detox in the UK",
    description: "Start with the broad guide to withdrawal risk, assessment and treatment settings.",
    href: "/resources/addiction-detox-uk",
  },
  {
    title: "Alcohol detox and withdrawal",
    description: "Understand when medically assisted withdrawal or emergency help may be needed.",
    href: "/resources/alcohol-withdrawal-symptoms-when-you-need-medical-help",
  },
  {
    title: "Benzodiazepine withdrawal",
    description: "Why abrupt stopping can be unsafe and how prescriber-led support works.",
    href: "/resources/benzodiazepine-withdrawal",
  },
  {
    title: "Opioid detox and withdrawal",
    description: "Compare maintenance, detox and continuing care, including overdose prevention.",
    href: "/resources/opioid-detox",
  },
  {
    title: "Cocaine withdrawal",
    description: "Understand the crash, mental-health risks and support after stopping.",
    href: "/resources/cocaine-withdrawal",
  },
  {
    title: "Ketamine withdrawal",
    description: "Separate psychological withdrawal support from medical care for physical harm.",
    href: "/resources/ketamine-withdrawal",
  },
  {
    title: "Detox vs rehab",
    description: "See how withdrawal management differs from rehabilitation and aftercare.",
    href: "/resources/detox-vs-rehab",
  },
] as const;

export default function ResourcesList() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: articles = staticArticles, isLoading, isError } = useQuery({
    queryKey: ["articles"],
    queryFn: fetchMergedArticles,
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
        title="Resources, Addiction, Recovery & Mental Health Articles"
        description="Expert articles on addiction, recovery, mental health, and treatment options, written by Craig Bilton to help individuals and families make informed decisions."
        canonical="/resources"
        ogImage={ogImageUrl("og-resources.png")}
      />

      {/* ── Hero, two-column ── */}
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
                Addiction and Mental Health Recovery Resources
              </h1>
              <p className="text-[15px] text-muted-foreground font-light leading-relaxed mb-3 max-w-xl">
                Authoritative articles on addiction, recovery, mental health and
                treatment, written to help individuals and families navigate
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
                <ResponsiveImage
                  src={resourcesHero}
                  alt="Clinical resource library, laptop showing the Insight Recovery Network resources page on a desk with clinical books and a notebook"
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

      <section className="border-y border-border/40 bg-primary py-12 text-primary-foreground md:py-16" aria-labelledby="withdrawal-guides-heading">
        <div className="container mx-auto px-6 md:px-12">
          <div className="mb-8 max-w-3xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-accent">Withdrawal and detox decisions</p>
            <h2 id="withdrawal-guides-heading" className="mb-4 font-serif text-3xl md:text-4xl">Find the right safety guide before stopping</h2>
            <p className="leading-relaxed text-primary-foreground/75">Different substances require different clinical decisions. These guides explain risk, medical boundaries and the next appropriate service without offering self-detox schedules.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {withdrawalDecisionGuides.map((guide) => (
              <Link key={guide.href} href={guide.href} className="group border border-primary-foreground/15 bg-primary-foreground/5 p-5 transition-colors hover:border-accent/70 hover:bg-primary-foreground/10">
                <h3 className="mb-2 font-serif text-lg text-primary-foreground group-hover:text-accent">{guide.title}</h3>
                <p className="text-sm leading-relaxed text-primary-foreground/70">{guide.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border/40 bg-secondary/15 py-12 md:py-16" aria-labelledby="treatment-guides-heading">
        <div className="container mx-auto px-6 md:px-12">
          <div className="mb-8 max-w-3xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-accent/80">From information to a decision</p>
            <h2 id="treatment-guides-heading" className="mb-4 font-serif text-3xl text-primary md:text-4xl">Substance-specific treatment guides</h2>
            <p className="leading-relaxed text-muted-foreground">Use the clinical articles to understand a concern, then use these decision guides to compare assessment, community, online and residential treatment routes.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {substanceTreatmentPages.map((page) => (
              <Link key={page.route} href={page.route} className="group border border-border/40 bg-background p-5 transition-colors hover:border-accent/60">
                <h3 className="mb-2 font-serif text-lg text-primary group-hover:text-accent">{page.title}</h3>
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Compare treatment options</span>
              </Link>
            ))}
          </div>
          <p className="mt-8 text-sm leading-relaxed text-muted-foreground">
            Learn more about <Link href="/about-insight-recovery-network" className="underline underline-offset-4 hover:text-primary">how IRN works</Link>, our <Link href="/editorial-policy" className="underline underline-offset-4 hover:text-primary">editorial policy</Link>, <Link href="/media" className="underline underline-offset-4 hover:text-primary">media commentary</Link>, <Link href="/confidential-addiction-help-professionals" className="underline underline-offset-4 hover:text-primary">confidential help for professionals</Link> and the <Link href="/recovery-plan-checklist" className="underline underline-offset-4 hover:text-primary">recovery plan checklist</Link>.
          </p>
        </div>
      </section>

      <CTASection
        heading="Speak with a clinical specialist."
        description="Our articles provide information, but every situation is different. A confidential conversation can help clarify the right next step for you or your loved one."
        primaryCta={{ label: "Book a confidential call", href: "/get-help" }}
        secondaryCta={{ label: "Take a free assessment", href: "/assessments" }}
        primaryEvent="book_consultation_click"
        sourcePage="resources"
        serviceInterest="general-support"
        ctaLocation="final_cta"
      />
    </Layout>
  );
}

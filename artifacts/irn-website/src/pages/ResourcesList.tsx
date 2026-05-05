import { useState } from "react";
import { SEO } from "@/components/SEO";
import { Layout } from "@/components/layout/Layout";
import { PageHero } from "@/components/ui/page-hero";
import { CTASection } from "@/components/ui/cta-section";
import { ArticleCard } from "@/components/ui/article-card";
import { articles, CATEGORIES } from "@/data/articles";

export default function ResourcesList() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? articles
      : articles.filter((a) => a.category === activeCategory);

  return (
    <Layout>
      <SEO
        title="Resources — Addiction, Recovery & Mental Health Articles"
        description="Expert articles on addiction, recovery, mental health, and treatment options. Written by clinical specialists to help individuals and families make informed decisions."
        canonical="/resources"
      />

      <PageHero
        label="Resources"
        heading="Insight and guidance from clinical experience."
        description="Authoritative articles on addiction, recovery, mental health and treatment — written to help individuals and families navigate complex decisions with clarity."
      />

      {/* Category filter */}
      <section className="py-8 border-b border-border/40 bg-background sticky top-[88px] z-30">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex items-center gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                data-testid={`filter-${cat.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "and")}`}
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
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6 md:px-12">
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground font-light">No articles in this category yet.</p>
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

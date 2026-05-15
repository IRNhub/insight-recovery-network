import { useState } from "react";
import { SEO } from "@/components/SEO";
import { Layout } from "@/components/layout/Layout";
import { CTASection } from "@/components/ui/cta-section";
import { ArticleCard } from "@/components/ui/article-card";
import { articles, CATEGORIES } from "@/data/articles";
import { BookOpen } from "lucide-react";

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
        description="Expert articles on addiction, recovery, mental health, and treatment options — written by clinical specialists to help individuals and families make informed decisions."
        canonical="/resources"
      />

      {/* ── Hero — two-column ── */}
      <section
        style={{
          background: "linear-gradient(160deg, #F2EDE3 0%, #F6F4EF 50%, #EEE9DF 100%)",
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
                Authoritative articles on addiction, recovery, mental health and treatment — written to help individuals and families navigate complex decisions with clarity.
              </p>
              <p className="text-xs text-muted-foreground/55 font-light leading-relaxed max-w-xl">
                All articles are written by Craig Bilton, Founder and Clinical Director of the Insight Recovery Network.
              </p>
            </div>

            {/* Right: editorial visual */}
            <div className="lg:flex-1">
              <div
                className="relative rounded-2xl overflow-hidden"
                style={{
                  aspectRatio: "16/11",
                  boxShadow: "0 12px 40px -8px rgba(22,43,59,0.20), 0 0 0 1px rgba(22,43,59,0.06)",
                  background: "linear-gradient(135deg, #162B3B 0%, #1a3347 60%, #0f2030 100%)",
                }}
              >
                {/* Subtle grid */}
                <svg
                  className="absolute inset-0 w-full h-full opacity-[0.04]"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <pattern id="rGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.8" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#rGrid)" />
                </svg>

                {/* Gold circle decorations — reference IRN logo mark */}
                <div
                  className="absolute top-6 right-8 w-28 h-28 rounded-full pointer-events-none"
                  style={{ border: "1.5px solid rgba(201,169,110,0.18)" }}
                />
                <div
                  className="absolute top-10 right-12 w-16 h-16 rounded-full pointer-events-none"
                  style={{ border: "1px solid rgba(201,169,110,0.10)" }}
                />

                {/* Editorial article card representation */}
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <div
                    className="w-full max-w-[260px] rounded-lg p-6"
                    style={{
                      background: "rgba(246,244,240,0.06)",
                      border: "1px solid rgba(201,169,110,0.22)",
                    }}
                  >
                    <div className="w-8 h-0.5 mb-4" style={{ background: "rgba(201,169,110,0.75)" }} />
                    <div className="flex flex-col gap-2.5 mb-5">
                      <div className="h-px w-full" style={{ background: "rgba(255,255,255,0.25)" }} />
                      <div className="h-px w-5/6" style={{ background: "rgba(255,255,255,0.18)" }} />
                      <div className="h-px w-full" style={{ background: "rgba(255,255,255,0.18)" }} />
                      <div className="h-px w-4/5" style={{ background: "rgba(255,255,255,0.13)" }} />
                    </div>
                    <div className="w-5 h-0.5 mb-3" style={{ background: "rgba(201,169,110,0.4)" }} />
                    <div className="flex flex-col gap-2 mb-5">
                      <div className="h-px w-full" style={{ background: "rgba(255,255,255,0.12)" }} />
                      <div className="h-px w-3/4" style={{ background: "rgba(255,255,255,0.10)" }} />
                      <div className="h-px w-5/6" style={{ background: "rgba(255,255,255,0.10)" }} />
                    </div>
                    <div
                      className="flex items-center gap-2.5 pt-4"
                      style={{ borderTop: "1px solid rgba(201,169,110,0.2)" }}
                    >
                      <div
                        className="w-6 h-6 rounded-full flex-shrink-0"
                        style={{ background: "rgba(201,169,110,0.18)" }}
                      />
                      <div className="flex flex-col gap-1.5">
                        <div className="h-px w-20" style={{ background: "rgba(255,255,255,0.25)" }} />
                        <div className="h-px w-14" style={{ background: "rgba(255,255,255,0.15)" }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Overlay badge */}
                <div
                  className="absolute bottom-4 left-4 px-3.5 py-2.5 rounded-lg flex items-center gap-2.5"
                  style={{ background: "rgba(22,43,59,0.84)", backdropFilter: "blur(8px)" }}
                >
                  <BookOpen className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                  <div>
                    <p className="font-serif text-white text-[11px] leading-tight">Clinical resource library</p>
                    <p className="text-white/50 text-[10px] font-light">Expert articles · Recovery guidance</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

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
      <section className="py-12 md:py-16">
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

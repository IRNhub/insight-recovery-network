import { useParams, Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { SEO } from "@/components/SEO";
import { Layout } from "@/components/layout/Layout";
import { CTASection } from "@/components/ui/cta-section";
import { ArticleCard } from "@/components/ui/article-card";
import NotFound from "@/pages/not-found";
import { getArticleBySlug, articles, formatDate } from "@/data/articles";
import { Clock, Calendar, ArrowLeft, ArrowRight } from "lucide-react";

const SITE_URL = "https://www.insightrecoverynetwork.com";

/** Convert [text](url) patterns to <Link> elements */
function parseInlineLinks(text: string): React.ReactNode[] {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  if (parts.length === 1) return [text];
  return parts.map((part, idx) => {
    const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (m) {
      return (
        <Link
          key={idx}
          href={m[2]}
          className="text-primary underline underline-offset-2 hover:text-accent transition-colors duration-200"
        >
          {m[1]}
        </Link>
      );
    }
    return part;
  });
}

function parseContent(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // ## Heading
    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={i} className="text-2xl md:text-3xl font-serif text-primary mt-10 mb-4 leading-snug">
          {line.replace("## ", "")}
        </h2>
      );

    // [CTA:/path:Button Label] ... [/CTA]  — inline CTA callout block
    } else if (line.startsWith("[CTA:")) {
      const tagMatch = line.match(/^\[CTA:([^:]+):([^\]]+)\]$/);
      const ctaHref = tagMatch ? tagMatch[1] : "/contact";
      const ctaLabel = tagMatch ? tagMatch[2] : "Speak Confidentially";
      const ctaLines: string[] = [];
      i++;
      while (i < lines.length && lines[i] !== "[/CTA]") {
        if (lines[i].trim()) ctaLines.push(lines[i]);
        i++;
      }
      elements.push(
        <div
          key={i}
          className="my-10 p-7 md:p-9 border-l-4 rounded-r-xl"
          style={{
            borderColor: "#C9A96E",
            background: "linear-gradient(135deg, rgba(246,244,240,0.95) 0%, rgba(242,237,227,0.7) 100%)",
          }}
        >
          <p className="text-base font-light leading-relaxed text-primary/90 mb-6">
            {parseInlineLinks(ctaLines.join(" "))}
          </p>
          <Link
            href={ctaHref}
            className="inline-flex items-center gap-2.5 px-7 h-11 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity duration-200"
            style={{ background: "#162B3B" }}
          >
            {ctaLabel}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      );

    // **Whole-line bold paragraph**
    } else if (line.startsWith("**") && line.endsWith("**")) {
      elements.push(
        <p key={i} className="font-semibold text-primary mt-6 mb-2 text-sm">
          {line.replace(/\*\*/g, "")}
        </p>
      );

    // - Bullet list
    } else if (line.startsWith("- ")) {
      const listItems: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        listItems.push(lines[i].replace("- ", ""));
        i++;
      }
      elements.push(
        <ul key={`list-${i}`} className="list-none pl-0 my-4 flex flex-col gap-2">
          {listItems.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3 text-muted-foreground font-light text-base leading-relaxed">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
              <span>{parseInlineLinks(item)}</span>
            </li>
          ))}
        </ul>
      );
      continue;

    // Regular paragraph — handles **inline bold** and [text](url) inline links
    } else if (line.trim() !== "") {
      const rawParts = line.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
      const parts = rawParts.map((part, idx) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={idx} className="font-semibold text-primary">
              {part.replace(/\*\*/g, "")}
            </strong>
          );
        }
        const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (linkMatch) {
          return (
            <Link
              key={idx}
              href={linkMatch[2]}
              className="text-primary underline underline-offset-2 hover:text-accent transition-colors duration-200"
            >
              {linkMatch[1]}
            </Link>
          );
        }
        return part;
      });
      elements.push(
        <p key={i} className="text-muted-foreground font-light text-base leading-relaxed my-4">
          {parts}
        </p>
      );
    }

    i++;
  }

  return elements;
}

export default function ResourceDetail() {
  const params = useParams<{ slug: string }>();
  const article = getArticleBySlug(params.slug);

  if (!article) {
    return <NotFound />;
  }

  const related = articles
    .filter((a) => a.slug !== article.slug && a.category === article.category)
    .slice(0, 2);

  const moreRelated =
    related.length < 2
      ? articles
          .filter((a) => a.slug !== article.slug && !related.includes(a))
          .slice(0, 2 - related.length)
      : [];

  const relatedArticles = [...related, ...moreRelated].slice(0, 2);

  const canonicalPath = `/resources/${article.slug}`;
  const ogImage = article.image
    ? `${SITE_URL}${article.image}`
    : `${SITE_URL}/opengraph.jpg`;

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt,
    author: {
      "@type": "Person",
      name: article.author,
      jobTitle: article.authorRole,
    },
    publisher: {
      "@type": "Organization",
      name: "Insight Recovery Network",
      url: SITE_URL,
    },
    datePublished: article.date,
    dateModified: article.date,
    url: `${SITE_URL}${canonicalPath}`,
    mainEntityOfPage: `${SITE_URL}${canonicalPath}`,
    image: ogImage,
  };

  return (
    <Layout>
      <SEO
        title={article.title}
        description={article.excerpt}
        canonical={canonicalPath}
        ogImage={ogImage}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(blogSchema)}</script>
      </Helmet>

      {/* ── Article header ── */}
      <section className="py-16 md:py-24 border-b border-border/40">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-3xl mx-auto">
            <Link
              href="/resources"
              className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors mb-10"
              data-testid="link-back-to-resources"
            >
              <ArrowLeft size={14} strokeWidth={1.5} />
              All resources
            </Link>

            <span className="block text-[10px] font-semibold tracking-widest uppercase text-accent/80 mb-5">
              {article.category}
            </span>

            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-primary leading-tight mb-6">
              {article.title}
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed mb-8">
              {article.excerpt}
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-border/40">
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-primary">{article.author}</span>
                <span className="text-xs text-muted-foreground font-light">{article.authorRole}</span>
              </div>
              <div className="flex items-center gap-5 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} strokeWidth={1.5} />
                  {formatDate(article.date)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={13} strokeWidth={1.5} />
                  {article.readingTime} min read
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured image (shown when article supplies one) ── */}
      {article.image && (
        <section className="border-b border-border/40" style={{ background: "rgba(246,244,240,0.45)" }}>
          <div className="container mx-auto px-6 md:px-12">
            <div className="max-w-3xl mx-auto py-10 md:py-12">
              <div
                className="relative overflow-hidden rounded-xl"
                style={{
                  aspectRatio: "16/9",
                  boxShadow:
                    "0 12px 40px -8px rgba(22,43,59,0.18), 0 0 0 1px rgba(22,43,59,0.06)",
                }}
              >
                <img
                  src={article.image}
                  alt={article.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Article body ── */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-3xl mx-auto" data-testid="article-content">
            {parseContent(article.content)}
          </div>
        </div>
      </section>

      {/* ── Related articles ── */}
      {relatedArticles.length > 0 && (
        <section className="py-16 md:py-20 border-t border-border/40">
          <div className="container mx-auto px-6 md:px-12">
            <div className="mb-10">
              <span className="text-xs font-semibold tracking-widest uppercase text-accent/80">
                Continue reading
              </span>
              <h2 className="font-serif text-2xl md:text-3xl text-primary mt-2">
                Related articles
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedArticles.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
          </div>
        </section>
      )}

      <CTASection
        heading="Need guidance for your specific situation?"
        description="Our articles offer general information, but every person's situation is different. A confidential conversation can help clarify the most appropriate next step."
        primaryCta={{ label: "Speak Confidentially", href: "/contact" }}
      />
    </Layout>
  );
}

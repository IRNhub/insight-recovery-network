import { useParams, Link } from "wouter";
import { SEO } from "@/components/SEO";
import { Layout } from "@/components/layout/Layout";
import { CTASection } from "@/components/ui/cta-section";
import { ArticleCard } from "@/components/ui/article-card";
import NotFound from "@/pages/not-found";
import { getArticleBySlug, articles, formatDate } from "@/data/articles";
import { Clock, Calendar, ArrowLeft } from "lucide-react";

function parseContent(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={i} className="text-2xl md:text-3xl font-serif text-primary mt-10 mb-4 leading-snug">
          {line.replace("## ", "")}
        </h2>
      );
    } else if (line.startsWith("**") && line.endsWith("**")) {
      elements.push(
        <p key={i} className="font-semibold text-primary mt-6 mb-2 text-sm">
          {line.replace(/\*\*/g, "")}
        </p>
      );
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
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    } else if (line.trim() !== "") {
      const parts = line.split(/(\*\*[^*]+\*\*)/g).map((part, idx) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={idx} className="font-semibold text-primary">{part.replace(/\*\*/g, "")}</strong>;
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
      ? articles.filter((a) => a.slug !== article.slug && !related.includes(a)).slice(0, 2 - related.length)
      : [];

  const relatedArticles = [...related, ...moreRelated].slice(0, 2);

  return (
    <Layout>
      <SEO
        title={article.title}
        description={article.excerpt}
        canonical={`/resources/${article.slug}`}
      />

      {/* Article header */}
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

      {/* Article body */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-3xl mx-auto" data-testid="article-content">
            {parseContent(article.content)}
          </div>
        </div>
      </section>

      {/* Related articles */}
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

import { useEffect } from "react";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { SEO } from "@/components/SEO";
import { Layout } from "@/components/layout/Layout";
import { CTASection } from "@/components/ui/cta-section";
import { ArticleCard } from "@/components/ui/article-card";
import { RelatedServiceLinks } from "@/components/ui/related-service-links";
import NotFound from "@/pages/not-found";
import {
  formatDate,
  articles as staticArticles,
  isApprovedArticleSlug,
} from "@/data/articles";
import { fetchMergedArticles } from "@/lib/article-loader";
import type { Article } from "@/data/articles";
import { Clock, Calendar, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

const SITE_URL = "https://www.insightrecoverynetwork.com";
const EARLY_FINDINGS_SURVEY_URL = `${SITE_URL}/research/family-addiction-impact-survey-2026`;
const EARLY_FINDINGS_SERIES = [
  {
    slug: "families-carrying-burden-addiction-early-findings",
    label: "Families carrying the burden",
  },
  {
    slug: "why-families-delay-seeking-addiction-help",
    label: "Why families delay seeking help",
  },
  {
    slug: "hidden-family-cost-of-addiction",
    label: "The hidden family cost",
  },
] as const;

const ARTICLE_CLUSTERS: readonly (readonly string[])[] = [
  EARLY_FINDINGS_SERIES.map((article) => article.slug),
  [
    "cocaine-addiction",
    "addiction-detox-uk",
    "addiction-warning-signs",
    "why-cant-i-stop-how-addiction-works",
    "what-happens-in-residential-rehabilitation",
  ],
  [
    "dual-diagnosis",
    "mental-health-and-addiction",
    "addiction-warning-signs",
    "online-recovery-programmes",
    "supporting-a-loved-one-through-recovery",
  ],
  [
    "relapse-meaning",
    "slip-lapse-relapse-difference",
    "why-relapse-happens-before-substance-use",
    "relapse-prevention-plan",
    "addiction-warning-signs",
    "what-to-do-after-relapse",
    "how-structured-support-prevents-relapse",
    "relapsing-does-not-mean-you-have-failed",
  ],
  [
    "private-alcohol-rehab-uk-costs-options-alternatives",
    "how-to-choose-private-rehab-centre-uk",
    "private-rehab-vs-nhs-addiction-treatment",
    "alcohol-rehab-alternatives-uk",
    "do-i-need-alcohol-rehab-or-online-support",
    "what-happens-in-residential-rehabilitation",
  ],
  [
    "understanding-alcohol-dependency",
    "alcohol-withdrawal-symptoms-when-you-need-medical-help",
    "how-long-does-alcohol-stay-in-your-system",
    "can-i-stop-drinking-without-rehab",
    "online-alcohol-recovery-programme-uk",
  ],
  [
    "addiction-support-for-families",
    "how-to-stage-addiction-intervention-uk",
    "family-boundaries-addiction-recovery",
    "help-someone-with-addiction-without-enabling",
    "what-to-do-when-someone-refuses-treatment",
    "how-to-talk-to-someone-about-drinking-drug-use",
  ],
];

function headingId(heading: string): string {
  return heading
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function fetchArticle(slug: string): Promise<Article> {
  const approvedArticle = staticArticles.find((article) => article.slug === slug);
  if (approvedArticle && isApprovedArticleSlug(slug)) return approvedArticle;

  try {
    const res = await fetch(`/api/articles/${slug}`);
    if (res.status === 404) {
      // Fall back to the static bundled article before throwing
      const staticMatch = staticArticles.find((a) => a.slug === slug);
      if (staticMatch) return staticMatch;
      throw Object.assign(new Error("not-found"), { status: 404 });
    }
    if (!res.ok) {
      const staticMatch = staticArticles.find((a) => a.slug === slug);
      if (staticMatch) return staticMatch;
      throw new Error("Failed to load article");
    }
    return res.json();
  } catch (err: unknown) {
    // If we haven't already thrown a not-found, try static fallback
    if ((err as { status?: number }).status === 404) throw err;
    const staticMatch = staticArticles.find((a) => a.slug === slug);
    if (staticMatch) return staticMatch;
    throw err;
  }
}

/** Convert [text](url) patterns to <Link> elements */
function parseInlineLinks(text: string): React.ReactNode[] {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  if (parts.length === 1) return [text];
  return parts.map((part, idx) => {
    const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (m) {
      if (/^https?:\/\//.test(m[2])) {
        return (
          <a
            key={idx}
            href={m[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-2 hover:text-accent transition-colors duration-200"
          >
            {m[1]}
          </a>
        );
      }
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

function parseContent(
  content: string,
  supportingImages: Article["supportingImages"] = [],
) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // ## Heading
    if (line.startsWith("## ")) {
      const heading = line.replace("## ", "");
      elements.push(
        <h2 id={headingId(heading)} key={i} className="scroll-mt-24 text-2xl md:text-3xl font-serif text-primary mt-10 mb-4 leading-snug">
          {heading}
        </h2>
      );
      const supportingImage = supportingImages.find(
        (image) => image.afterHeading.toLowerCase() === heading.toLowerCase(),
      );
      if (supportingImage) {
        elements.push(
          <figure key={`supporting-image-${i}`} className="my-8">
            <div className="overflow-hidden rounded-xl border border-border/40 bg-secondary/20">
              <img
                src={supportingImage.src}
                alt={supportingImage.alt}
                className="block w-full aspect-video object-cover"
                loading="lazy"
              />
            </div>
            {supportingImage.caption && (
              <figcaption className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {supportingImage.caption}
              </figcaption>
            )}
          </figure>,
        );
      }

    // ### Sub-heading
    } else if (line.startsWith("### ")) {
      elements.push(
        <h3 key={i} className="text-lg md:text-xl font-serif text-primary mt-7 mb-3 leading-snug">
          {line.replace("### ", "")}
        </h3>
      );

    // [CTA:/path:Button Label] ... [/CTA], inline CTA callout block
    } else if (line.startsWith("[CTA:")) {
      const tagMatch = line.match(/^\[CTA:([^:]+):([^\]]+)\]$/);
      const ctaHref = tagMatch ? tagMatch[1] : "/contact";
      const ctaLabel = tagMatch ? tagMatch[2] : "Book a confidential call";
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

    // 1. Ordered list
    } else if (/^\d+\.\s+/.test(line)) {
      const listItems: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        listItems.push(lines[i].replace(/^\d+\.\s+/, ""));
        i++;
      }
      elements.push(
        <ol key={`ordered-list-${i}`} className="list-decimal pl-6 my-4 space-y-2">
          {listItems.map((item, idx) => (
            <li key={idx} className="pl-1 text-muted-foreground font-light text-base leading-relaxed">
              {parseInlineLinks(item)}
            </li>
          ))}
        </ol>
      );
      continue;

    // Markdown table, lines starting with |
    } else if (line.startsWith("| ")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      const isSeparator = (row: string) =>
        row.split("|").filter(Boolean).every((cell) => /^[\-: ]+$/.test(cell));
      const filtered = tableLines.filter((l) => !isSeparator(l));
      const [headerRow, ...dataRows] = filtered;
      const headers = headerRow.split("|").filter(Boolean).map((s) => s.trim());
      const rows = dataRows.map((row) =>
        row.split("|").filter(Boolean).map((s) => s.trim())
      );
      elements.push(
        <div key={`table-${i}`} className="my-8 overflow-x-auto rounded-lg border border-border/50">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "#162B3B" }}>
                {headers.map((h, idx) => (
                  <th
                    key={idx}
                    className="px-4 py-3 text-left font-medium text-primary-foreground text-xs tracking-wide whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ridx) => (
                <tr
                  key={ridx}
                  className={ridx % 2 === 0 ? "bg-background" : "bg-muted/30"}
                >
                  {row.map((cell, cidx) => (
                    <td
                      key={cidx}
                      className="px-4 py-3 text-muted-foreground font-light leading-relaxed align-top border-t border-border/30"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;

    // Regular paragraph, handles **inline bold** and [text](url) inline links
    } else if (line.startsWith("**Concise answer:**")) {
      const answer = line.replace("**Concise answer:**", "").trim();
      elements.push(
        <aside
          key={i}
          className="my-7 rounded-r-xl border-l-4 border-accent bg-secondary/40 px-6 py-5"
          aria-label="Concise answer"
        >
          <p className="text-primary font-medium leading-relaxed">
            <span className="font-semibold">Concise answer:</span> {parseInlineLinks(answer)}
          </p>
        </aside>
      );

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
          if (/^https?:\/\//.test(linkMatch[2])) {
            return (
              <a
                key={idx}
                href={linkMatch[2]}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-2 hover:text-accent transition-colors duration-200"
              >
                {linkMatch[1]}
              </a>
            );
          }
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

function withoutEmbeddedFaq(content: string) {
  const lines = content.split("\n");
  const faqStart = lines.findIndex((line) =>
    /^## Frequently Asked Questions(?:\b.*)?$/i.test(line.trim())
  );

  if (faqStart === -1) return content;

  let nextSection = faqStart + 1;
  while (nextSection < lines.length && !lines[nextSection].startsWith("## ")) {
    nextSection++;
  }

  return [...lines.slice(0, faqStart), ...lines.slice(nextSection)]
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export default function ResourceDetail() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug ?? "";
  const bundledArticle = staticArticles.find((candidate) => candidate.slug === slug);

  useEffect(() => {
    document
      .querySelectorAll('script[data-prerendered-jsonld="true"]')
      .forEach((script) => script.remove());
  }, [slug]);

  const {
    data: article,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["article", slug],
    queryFn: () => fetchArticle(slug),
    initialData: bundledArticle,
    enabled: Boolean(slug),
    retry: false,
    staleTime: 60_000,
  });

  const { data: allArticles = [] } = useQuery({
    queryKey: ["articles"],
    queryFn: fetchMergedArticles,
    staleTime: 60_000,
    enabled: !!article,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-40 gap-3 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm font-light">Loading article…</span>
        </div>
      </Layout>
    );
  }

  if (isError) {
    const is404 = (error as { status?: number })?.status === 404;
    if (is404) return <NotFound />;
    return (
      <Layout>
        <div className="text-center py-40">
          <p className="text-muted-foreground font-light">Unable to load this article. Please try again.</p>
        </div>
      </Layout>
    );
  }

  if (!article) return <NotFound />;

  const cluster = ARTICLE_CLUSTERS.find((items) => items.includes(article.slug));
  const related = cluster
    ? cluster
        .filter((slug) => slug !== article.slug)
        .map((slug) => allArticles.find((candidate) => candidate.slug === slug))
        .filter((candidate): candidate is Article => Boolean(candidate))
        .slice(0, 2)
    : allArticles
        .filter((a) => a.slug !== article.slug && a.category === article.category)
        .slice(0, 2);

  const moreRelated =
    related.length < 2
      ? allArticles
          .filter((a) => a.slug !== article.slug && !related.includes(a))
          .slice(0, 2 - related.length)
      : [];

  const relatedArticles = [...related, ...moreRelated].slice(0, 2);

  const canonicalPath = `/resources/${article.slug}`;
  const isEarlyFindingsArticle = EARLY_FINDINGS_SERIES.some(
    (candidate) => candidate.slug === article.slug,
  );
  const commercialLinks = (() => {
    if (article.slug === "cocaine-addiction") {
      return [
        { title: "Drug-use assessment", description: "Organise concerns about use, control, harm and the next appropriate conversation.", href: "/assessments/drug-use" },
        { title: "Online recovery programme", description: "Explore structured recovery support when online care is clinically suitable.", href: "/online-programme" },
        { title: "Treatment placement", description: "Compare more intensive treatment options when risk or complexity requires them.", href: "/treatment-placement" },
      ];
    }
    if (article.slug === "addiction-detox-uk") {
      return [
        { title: "Detox suitability assessment", description: "Organise withdrawal history and risk questions before speaking with a clinical service.", href: "/assessments/detox" },
        { title: "Treatment placement", description: "Compare private detox and residential providers by clinical capability and fit.", href: "/treatment-placement" },
        { title: "Residential rehabilitation", description: "Understand what should happen after withdrawal has been safely managed.", href: "/resources/what-happens-in-residential-rehabilitation" },
      ];
    }
    if (article.slug === "dual-diagnosis") {
      return [
        { title: "Recovery assessments", description: "Organise concerns before discussing co-occurring needs with an appropriate professional.", href: "/assessments" },
        { title: "Treatment placement", description: "Compare providers against mental-health, withdrawal, medication and safeguarding needs.", href: "/treatment-placement" },
        { title: "Online recovery programme", description: "Explore structured online support when the person is medically stable and suitable.", href: "/online-programme" },
      ];
    }
    if (article.slug === "how-to-choose-private-rehab-centre-uk") {
      return [
        { title: "Luxury rehab", description: "Compare premium treatment against clinical quality, privacy and aftercare.", href: "/luxury-rehab" },
        { title: "Executive rehab", description: "Review confidential treatment considerations for professionals.", href: "/executive-rehab" },
        { title: "Destination rehab", description: "Consider travel safety and the complete overseas treatment pathway.", href: "/destination-rehab" },
        { title: "Treatment placement", description: "Get assessment-led help comparing suitable providers.", href: "/treatment-placement" },
      ];
    }
    if (/(relapse|willpower|structured-support)/.test(article.slug)) {
      return [
        { title: "Online recovery programme", description: "Build ongoing structure, accountability and relapse-prevention support.", href: "/online-programme" },
        { title: "Treatment placement", description: "Assess whether detox or residential treatment may now be appropriate.", href: "/treatment-placement" },
        { title: "Confidential assessment", description: "Clarify risk and the right level of support for the current situation.", href: "/assessments" },
      ];
    }
    if (/(rehab|detox|withdrawal|alcohol-dependency)/.test(article.slug)) {
      return [
        { title: "Assessment-led treatment placement", description: "Compare suitable UK and international detox or residential options.", href: "/treatment-placement" },
        { title: "Private rehab costs UK", description: "Review guide prices, inclusions and lower-cost treatment routes.", href: "/how-much-does-rehab-cost-uk" },
        { title: "Private rehab Thailand", description: "Compare costs, clinical considerations and long-haul placement.", href: "/private-rehab-thailand" },
        { title: "Services and pricing guide", description: "Review IRN service routes and current pricing information.", href: "/services-pricing-guide" },
      ];
    }
    if (/(family|intervention|enabl|loved-one|refuses-treatment|talk-to-someone)/.test(article.slug)) {
      return [
        { title: "Family addiction guidance", description: "Plan conversations, boundaries and realistic next steps.", href: "/family-addiction-intervention-uk" },
        { title: "Treatment placement", description: "Prepare a suitable treatment option before a moment of willingness.", href: "/treatment-placement" },
        { title: "Addiction help in Cornwall", description: "Access remote assessment and support from across Cornwall.", href: "/addiction-help-cornwall" },
      ];
    }
    return [
      { title: "What we offer", description: "Compare IRN's placement, online and continuing-care pathways.", href: "/what-we-offer" },
      { title: "Confidential assessment", description: "Start with a private assessment of the current situation.", href: "/assessments" },
      { title: "Contact IRN", description: "Ask a question privately, without obligation or pressure.", href: "/contact" },
    ];
  })();
  const contextualCta = (() => {
    if (isEarlyFindingsArticle) {
      return {
        heading: "Take part in the ongoing research",
        description: "Have you been affected by a family member's addiction or compulsive behaviour? The anonymous UK Family Addiction Impact Survey 2026 remains open and will contribute to the final report.",
        primaryCta: { label: "Take the anonymous survey", href: EARLY_FINDINGS_SURVEY_URL },
        secondaryCta: { label: "Find family support", href: "/family-addiction-intervention-uk" },
      };
    }
    const slug = article.slug;
    if (slug === "cocaine-addiction") {
      return {
        heading: "Concerned about your cocaine use?",
        description: "A confidential assessment can help organise the pattern, risks and realistic treatment options. It is not a diagnosis or emergency service.",
        primaryCta: { label: "Start a drug-use assessment", href: "/assessments/drug-use" },
        secondaryCta: { label: "Compare treatment options", href: "/treatment-placement" },
      };
    }
    if (slug === "addiction-detox-uk") {
      return {
        heading: "Unsure whether withdrawal needs medical support?",
        description: "Use the detox assessment to organise the history and identify questions for a GP, prescriber, NHS service or treatment provider.",
        primaryCta: { label: "Start the detox assessment", href: "/assessments/detox" },
        secondaryCta: { label: "Explore treatment placement", href: "/treatment-placement" },
      };
    }
    if (slug === "what-happens-in-residential-rehabilitation") {
      return {
        heading: "Need help comparing residential treatment?",
        description: "Assessment-led placement can help compare providers by clinical capability, safety, location, cost and continuing care.",
        primaryCta: { label: "Explore treatment placement", href: "/treatment-placement" },
        secondaryCta: { label: "Take a confidential assessment", href: "/assessments" },
      };
    }
    if (slug === "dual-diagnosis") {
      return {
        heading: "Not sure how mental health and substance use fit together?",
        description: "A confidential recovery assessment can help organise concerns and identify sensible questions for the next professional conversation. It is not a diagnosis.",
        primaryCta: { label: "Start a recovery assessment", href: "/assessments" },
        secondaryCta: { label: "Explore treatment placement", href: "/treatment-placement" },
      };
    }
    if (slug === "addiction-support-for-families") {
      return {
        heading: "Get a clearer family plan",
        description: "A confidential family conversation can help separate urgent risk from longer-term decisions, clarify safe boundaries and identify realistic treatment routes. Your loved one does not need to be ready for you to seek guidance.",
        primaryCta: { label: "Explore family addiction guidance", href: "/family-addiction-intervention-uk" },
        secondaryCta: { label: "Start a recovery assessment", href: "/assessments" },
      };
    }
    if (/(family|intervention|enabl|loved-one|refuses-treatment|talk-to-someone)/.test(slug)) {
      return {
        heading: "Worried about someone you love?",
        description: "You can ask for family guidance before they agree to treatment. A confidential consultation can help you plan the conversation, boundaries and realistic treatment options.",
        primaryCta: { label: "Get family guidance", href: "/family-addiction-intervention-uk" },
        secondaryCta: { label: "Explore treatment placement", href: "/treatment-placement" },
      };
    }
    if (/(online|residential-rehab|willpower|relapse)/.test(slug)) {
      return {
        heading: "Need more structure than an article can provide?",
        description: "Compare structured online recovery support with residential treatment and understand which level of care fits your current situation.",
        primaryCta: { label: "Check online programme suitability", href: "/online-programme" },
        secondaryCta: { label: "Compare treatment options", href: "/treatment-placement" },
      };
    }
    if (/(rehab|detox|withdrawal|alcohol-dependency)/.test(slug)) {
      return {
        heading: "Need help making a treatment decision?",
        description: "A confidential conversation can clarify detox risk, private rehab, cost, location and whether residential care is the right next step.",
        primaryCta: { label: "Discuss treatment options", href: "/treatment-placement" },
        secondaryCta: { label: "Compare rehab costs", href: "/how-much-does-rehab-cost-uk" },
      };
    }
    return {
      heading: "Need guidance for your specific situation?",
      description: "Our articles offer general information, but every person's situation is different. A confidential conversation can help clarify the most appropriate next step.",
      primaryCta: { label: "Discuss your situation", href: "/contact" },
      secondaryCta: { label: "Take a free assessment", href: "/assessments" },
    };
  })();
  const ogImage = article.ogImage
    ? `${SITE_URL}${article.ogImage}`
    : article.image
      ? `${SITE_URL}${article.image}`
    : `${SITE_URL}/opengraph.jpg`;

  const faqSchema =
    article.faq && article.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: article.faq.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        }
      : null;

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.seoTitle ?? article.title,
    description: article.metaDescription ?? article.excerpt,
    author: {
      "@type": "Person",
      name: article.author,
      jobTitle: article.authorRole,
      url: `${SITE_URL}/craig-bilton`,
    },
    publisher: {
      "@type": "Organization",
      name: "Insight Recovery Network",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/favicon.svg`,
      },
    },
    datePublished: article.date,
    dateModified: article.updatedDate ?? article.date,
    url: `${SITE_URL}${canonicalPath}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}${canonicalPath}`,
    },
    image: {
      "@type": "ImageObject",
      url: ogImage,
      width: 1200,
      height: 630,
    },
    articleSection: article.category,
    inLanguage: "en-GB",
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Resources", item: `${SITE_URL}/resources` },
      { "@type": "ListItem", position: 3, name: article.title, item: `${SITE_URL}${canonicalPath}` },
    ],
  };
  const medicalWebPageSchema = article.medicalWebPage
    ? {
        "@context": "https://schema.org",
        "@type": "MedicalWebPage",
        "@id": `${SITE_URL}${canonicalPath}#medical-webpage`,
        name: article.title,
        description: article.metaDescription ?? article.excerpt,
        url: `${SITE_URL}${canonicalPath}`,
        inLanguage: "en-GB",
        datePublished: article.date,
        dateModified: article.updatedDate ?? article.date,
        author: {
          "@type": "Person",
          name: article.author,
          jobTitle: article.authorRole,
          url: `${SITE_URL}/craig-bilton`,
        },
        medicalAudience: {
          "@type": "MedicalAudience",
          audienceType: "Patient",
        },
      }
    : null;

  return (
    <Layout>
      <SEO
        title={article.title}
        fullTitle={article.seoTitle}
        description={article.metaDescription ?? article.excerpt}
        canonical={canonicalPath}
        ogImage={ogImage}
        ogType="article"
        datePublished={article.date}
        dateModified={article.updatedDate ?? article.date}
        author={article.author}
        section={article.category}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(blogSchema)}</script>
        {medicalWebPageSchema && (
          <script type="application/ld+json">
            {JSON.stringify(medicalWebPageSchema)}
          </script>
        )}
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        {faqSchema && (
          <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        )}
      </Helmet>

      {/* ── Article header ── */}
      <section className="py-12 md:py-20 border-b border-border/40">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-3xl mx-auto">
            <nav aria-label="Breadcrumb" className="mb-10 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              <Link href="/" className="hover:text-primary">Home</Link>
              <span aria-hidden="true">/</span>
              <Link href="/resources" className="inline-flex items-center gap-2 hover:text-primary" data-testid="link-back-to-resources">
                <ArrowLeft size={14} strokeWidth={1.5} /> All resources
              </Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page" className="normal-case tracking-normal">{article.title}</span>
            </nav>

            <span className="block text-[10px] font-semibold tracking-widest uppercase text-accent/80 mb-5">
              {article.seriesLabel ?? article.category}
            </span>

            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-primary leading-tight mb-6">
              {article.title}
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed mb-8">
              {article.excerpt}
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-border/40">
              <div className="flex flex-col gap-0.5">
                <Link href="/craig-bilton" className="text-sm font-medium text-primary hover:text-accent transition-colors">
                  {article.author}
                </Link>
                <span className="text-xs text-muted-foreground font-light">{article.authorRole}</span>
              </div>
              <div className="flex items-center gap-5 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} strokeWidth={1.5} />
                  {article.updatedDate
                    ? `Updated ${formatDate(article.updatedDate)}`
                    : formatDate(article.date)}
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

      {isEarlyFindingsArticle && (
        <nav aria-label="Early Findings series" className="border-b border-border/40 bg-secondary/20">
          <div className="container mx-auto px-6 md:px-12 py-5">
            <div className="max-w-3xl mx-auto">
              <p className="text-[10px] font-semibold tracking-widest uppercase text-accent/80 mb-3">
                UK Family Addiction Report 2026: Early Findings
              </p>
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-x-5">
                {EARLY_FINDINGS_SERIES.map((item, index) => {
                  const isCurrent = item.slug === article.slug;
                  return isCurrent ? (
                    <span key={item.slug} aria-current="page" className="text-sm font-medium text-primary">
                      {index + 1}. {item.label}
                    </span>
                  ) : (
                    <Link
                      key={item.slug}
                      href={`/resources/${item.slug}`}
                      className="text-sm text-muted-foreground hover:text-primary underline underline-offset-2"
                    >
                      {index + 1}. {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </nav>
      )}

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
                  alt={article.imageAlt ?? article.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Article body ── */}
      <article className="py-12 md:py-20">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-3xl mx-auto" data-testid="article-content">
            {parseContent(
              withoutEmbeddedFaq(article.content),
              article.supportingImages,
            )}
            {article.faq && article.faq.length > 0 && (
              <section className="mt-14 pt-9 border-t border-border/50" aria-labelledby="frequently-asked-questions">
                <h2 id="frequently-asked-questions" className="scroll-mt-24 font-serif text-2xl md:text-3xl text-primary mb-6">
                  Frequently asked questions
                </h2>
                <div className="space-y-4">
                  {article.faq.map((item) => (
                    <details key={item.question} className="group border border-border/50 bg-secondary/10 px-5 py-4">
                      <summary className="cursor-pointer list-none font-medium text-primary leading-relaxed marker:content-none">
                        {item.question}
                      </summary>
                      <p className="mt-3 text-sm md:text-base text-muted-foreground font-light leading-relaxed">
                        {parseInlineLinks(item.answer)}
                      </p>
                    </details>
                  ))}
                </div>
              </section>
            )}
            {article.sources && article.sources.length > 0 && (
              <aside className="mt-14 pt-8 border-t border-border/50" aria-labelledby="article-sources">
                <h2 id="article-sources" className="font-serif text-2xl text-primary mb-3">
                  Sources and further reading
                </h2>
                <p className="text-sm text-muted-foreground font-light leading-relaxed mb-5">
                  We use current clinical guidance and authoritative public-health information to support factual claims. Sources are checked when the article is updated.
                </p>
                <ul className="space-y-3">
                  {article.sources.map((source) => (
                    <li key={source.url} className="text-sm leading-relaxed">
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline underline-offset-2 hover:text-accent transition-colors"
                      >
                        {source.title}
                      </a>
                      <span className="text-muted-foreground">, {source.publisher}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-muted-foreground mt-6">
                  This article provides general information, not a diagnosis or individual medical advice. See our{" "}
                  <Link href="/clinical-disclaimer" className="underline underline-offset-2 hover:text-primary">
                    clinical disclaimer
                  </Link>.
                </p>
              </aside>
            )}
          </div>
        </div>
      </article>

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

      <RelatedServiceLinks heading="Related support and next steps" links={commercialLinks} />

      <CTASection
        heading={contextualCta.heading}
        description={contextualCta.description}
        primaryCta={contextualCta.primaryCta}
        secondaryCta={contextualCta.secondaryCta}
      />
    </Layout>
  );
}

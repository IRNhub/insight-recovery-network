import { useEffect } from "react";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { SEO } from "@/components/SEO";
import { Layout } from "@/components/layout/Layout";
import { CTASection } from "@/components/ui/cta-section";
import { ArticleCard } from "@/components/ui/article-card";
import { RelatedServiceLinks } from "@/components/ui/related-service-links";
import { PreferredSources } from "@/components/PreferredSources";
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
    "addiction-detox-uk",
    "detox-vs-rehab",
    "alcohol-withdrawal-symptoms-when-you-need-medical-help",
    "benzodiazepine-withdrawal",
    "opioid-detox",
    "cocaine-withdrawal",
    "ketamine-withdrawal",
  ],
  [
    "cocaine-addiction",
    "cocaine-withdrawal",
    "addiction-warning-signs",
    "why-cant-i-stop-how-addiction-works",
    "what-happens-in-residential-rehabilitation",
  ],
  [
    "cannabis-addiction",
    "cannabis-withdrawal",
    "addiction-warning-signs",
    "why-cant-i-stop-how-addiction-works",
    "mental-health-and-addiction",
    "dual-diagnosis",
    "addiction-detox-uk",
    "online-recovery-programmes",
  ],
  [
    "how-to-choose-private-rehab-centre-uk",
    "how-quickly-can-someone-enter-rehab",
    "28-day-vs-90-day-rehab",
    "what-happens-in-residential-rehabilitation",
    "private-rehab-vs-nhs-addiction-treatment",
    "online-addiction-support-vs-residential-rehab",
  ],
  [
    "ketamine-addiction",
    "ketamine-withdrawal",
    "addiction-warning-signs",
    "mental-health-and-addiction",
    "dual-diagnosis",
    "addiction-detox-uk",
    "online-recovery-programmes",
  ],
  [
    "benzodiazepine-addiction",
    "benzodiazepine-withdrawal",
    "addiction-detox-uk",
    "addiction-warning-signs",
    "mental-health-and-addiction",
    "dual-diagnosis",
    "online-recovery-programmes",
  ],
  [
    "prescription-drug-addiction",
    "benzodiazepine-addiction",
    "benzodiazepine-withdrawal",
    "opioid-detox",
    "addiction-detox-uk",
    "addiction-warning-signs",
    "why-cant-i-stop-how-addiction-works",
    "mental-health-and-addiction",
    "dual-diagnosis",
    "online-recovery-programmes",
  ],
  [
    "gambling-addiction",
    "why-cant-i-stop-how-addiction-works",
    "addiction-warning-signs",
    "mental-health-and-addiction",
    "relapse-prevention-plan",
    "what-to-do-after-relapse",
    "addiction-support-for-families",
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

/** Convert inline links and bold emphasis to rendered elements. */
function parseInlineLinks(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
  if (parts.length === 1) return [text];
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={idx} className="font-semibold text-primary">
          {part.slice(2, -2)}
        </strong>
      );
    }
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
                width={1600}
                height={900}
                className="block w-full aspect-video object-cover"
                loading="lazy"
                decoding="async"
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
    if (article.slug === "gambling-addiction") {
      return [
        { title: "NHS help for gambling problems", description: "Find gambling-specific NHS information and routes to specialist support.", href: "https://www.nhs.uk/live-well/addiction-support/gambling-addiction/" },
        { title: "Mental health and addiction", description: "Understand why gambling harm and mental-health needs should be assessed together.", href: "/resources/mental-health-and-addiction" },
        { title: "Support for families", description: "Plan boundaries, safeguarding and support for affected others.", href: "/resources/addiction-support-for-families" },
      ];
    }
    if (article.slug === "prescription-drug-addiction") {
      return [
        { title: "Prescription drug treatment", description: "Compare prescriber-led medicine review, specialist drug services and wider recovery support without assuming dependence is addiction.", href: "/prescription-drug-addiction-treatment" },
        { title: "Benzodiazepine withdrawal guide", description: "Understand why prescribed benzodiazepine withdrawal needs an individual prescriber-led plan.", href: "/resources/benzodiazepine-withdrawal" },
        { title: "Opioid detox and withdrawal", description: "Compare maintenance and detox decisions and understand reduced-tolerance risk.", href: "/resources/opioid-detox" },
        { title: "Detox suitability assessment", description: "Organise medicine, withdrawal, overdose and combination-risk questions before speaking with a prescriber or clinical service.", href: "/assessments/detox" },
        { title: "Treatment placement", description: "Compare private treatment settings when medical, mental-health or environmental risks require more structure.", href: "/treatment-placement" },
        { title: "Online recovery programme", description: "Explore continuing recovery support after prescribing and withdrawal risks have been clinically addressed.", href: "/online-programme" },
      ];
    }
    if (article.slug === "cannabis-addiction") {
      return [
        { title: "Cannabis addiction treatment", description: "Compare community, online and residential support against use, mental health and home stability.", href: "/cannabis-addiction-treatment" },
        { title: "Cannabis withdrawal guide", description: "Understand sleep, mood, appetite and craving changes without overstating medical risk.", href: "/resources/cannabis-withdrawal" },
        { title: "Drug-use assessment", description: "Organise concerns about cannabis use, control, withdrawal, mental health and daily functioning.", href: "/assessments/drug-use" },
        { title: "Online recovery programme", description: "Explore structured recovery support when the person is medically stable and online care is suitable.", href: "/online-programme" },
      ];
    }
    if (article.slug === "ketamine-addiction") {
      return [
        { title: "Ketamine addiction treatment", description: "Coordinate recovery support with a separate medical pathway for bladder, urinary or abdominal harm.", href: "/ketamine-addiction-treatment" },
        { title: "Ketamine withdrawal guide", description: "Understand psychological withdrawal and when physical symptoms need separate medical care.", href: "/resources/ketamine-withdrawal" },
        { title: "Drug-use assessment", description: "Organise concerns about ketamine use, control, physical symptoms and the next appropriate conversation.", href: "/assessments/drug-use" },
        { title: "Detox suitability assessment", description: "Review withdrawal and combination-risk questions when alcohol, benzodiazepines, opioids or other substances are also involved.", href: "/assessments/detox" },
      ];
    }
    if (article.slug === "cocaine-addiction") {
      return [
        { title: "Cocaine addiction treatment", description: "Compare evidence-based psychological, community, online and residential treatment routes.", href: "/cocaine-addiction-treatment" },
        { title: "Cocaine withdrawal guide", description: "Understand the crash, mental-health risks and support after stopping.", href: "/resources/cocaine-withdrawal" },
        { title: "Drug-use assessment", description: "Organise concerns about use, control, harm and the next appropriate conversation.", href: "/assessments/drug-use" },
        { title: "Online recovery programme", description: "Explore structured recovery support when online care is clinically suitable.", href: "/online-programme" },
      ];
    }
    if (article.slug === "addiction-detox-uk") {
      return [
        { title: "Detox suitability assessment", description: "Organise withdrawal history and risk questions before speaking with a clinical service.", href: "/assessments/detox" },
        { title: "Detox vs rehab", description: "Compare withdrawal management with the continuing treatment that follows.", href: "/resources/detox-vs-rehab" },
        { title: "Opioid detox and withdrawal", description: "Understand maintenance, detox, reduced tolerance and overdose prevention.", href: "/resources/opioid-detox" },
        { title: "Treatment placement", description: "Compare private detox and residential providers by clinical capability and fit.", href: "/treatment-placement" },
      ];
    }
    if (article.slug === "dual-diagnosis") {
      return [
        { title: "Dual diagnosis treatment", description: "Compare integrated provider capability for mental-health and addiction needs.", href: "/dual-diagnosis-treatment" },
        { title: "Recovery assessments", description: "Organise concerns before discussing co-occurring needs with an appropriate professional.", href: "/assessments" },
        { title: "Treatment placement", description: "Compare providers against mental-health, withdrawal, medication and safeguarding needs.", href: "/treatment-placement" },
      ];
    }
    if (article.slug === "mental-health-and-addiction") {
      return [
        { title: "Dual diagnosis treatment", description: "Compare integrated treatment routes without self-diagnosing from symptoms.", href: "/dual-diagnosis-treatment" },
        { title: "Recovery assessments", description: "Organise mental-health and addiction concerns before the next professional conversation.", href: "/assessments" },
        { title: "Treatment placement", description: "Compare providers against withdrawal, mental-health, medication and safeguarding needs.", href: "/treatment-placement" },
      ];
    }
    if (article.slug === "benzodiazepine-addiction") {
      return [
        { title: "Benzodiazepine treatment", description: "Compare prescriber-led withdrawal planning and wider recovery support without using a generic taper.", href: "/benzodiazepine-addiction-treatment" },
        { title: "Benzodiazepine withdrawal guide", description: "Understand why abrupt stopping can be unsafe and what a prescriber-led plan covers.", href: "/resources/benzodiazepine-withdrawal" },
        { title: "Detox suitability assessment", description: "Organise medicine, withdrawal and combination-risk questions before speaking with a prescriber or clinical service.", href: "/assessments/detox" },
        { title: "Treatment placement", description: "Compare providers when withdrawal history, multiple substances or other risks require greater clinical structure.", href: "/treatment-placement" },
      ];
    }
    if (article.slug === "understanding-alcohol-dependency") {
      return [
        { title: "Alcohol addiction treatment", description: "Compare withdrawal assessment, community, online and residential alcohol treatment routes.", href: "/alcohol-addiction-treatment" },
        { title: "Alcohol detox and withdrawal", description: "Understand when medically assisted withdrawal or urgent care may be needed.", href: "/resources/alcohol-withdrawal-symptoms-when-you-need-medical-help" },
        { title: "Alcohol and detox assessment", description: "Organise withdrawal and dependence questions before speaking with a medical service.", href: "/assessments/alcohol-detox" },
        { title: "Private alcohol rehab costs", description: "Review alcohol-specific cost drivers, inclusions and alternatives.", href: "/resources/private-alcohol-rehab-uk-costs-options-alternatives" },
      ];
    }
    if (article.slug === "alcohol-withdrawal-symptoms-when-you-need-medical-help") {
      return [
        { title: "Alcohol addiction treatment", description: "Compare treatment settings after withdrawal risk has been assessed.", href: "/alcohol-addiction-treatment" },
        { title: "Alcohol and detox assessment", description: "Organise withdrawal history and risk questions for a qualified service.", href: "/assessments/alcohol-detox" },
        { title: "UK addiction detox guide", description: "Compare community, residential and specialist inpatient withdrawal settings.", href: "/resources/addiction-detox-uk" },
        { title: "Detox vs rehab", description: "See how withdrawal management connects to continuing treatment.", href: "/resources/detox-vs-rehab" },
      ];
    }
    if (article.slug === "benzodiazepine-withdrawal") {
      return [
        { title: "Benzodiazepine treatment", description: "Connect qualified prescribing with psychological and recovery support.", href: "/benzodiazepine-addiction-treatment" },
        { title: "Benzodiazepine dependence guide", description: "Understand dependence, addiction, risks and treatment language.", href: "/resources/benzodiazepine-addiction" },
        { title: "Detox suitability assessment", description: "Organise medicines, withdrawal and combined-use questions.", href: "/assessments/detox" },
        { title: "Treatment placement", description: "Compare higher-support settings when risk or complexity requires them.", href: "/treatment-placement" },
      ];
    }
    if (article.slug === "opioid-detox") {
      return [
        { title: "UK addiction detox guide", description: "Compare withdrawal risks and settings across different substances.", href: "/resources/addiction-detox-uk" },
        { title: "Detox suitability assessment", description: "Organise history and risk questions before contacting a qualified service.", href: "/assessments/detox" },
        { title: "Treatment placement", description: "Compare external providers by prescribing, monitoring and continuing care.", href: "/treatment-placement" },
        { title: "Detox vs rehab", description: "Understand why withdrawal management must connect to continuing treatment.", href: "/resources/detox-vs-rehab" },
      ];
    }
    if (article.slug === "cocaine-withdrawal") {
      return [
        { title: "Cocaine addiction treatment", description: "Compare evidence-based community, online and residential support.", href: "/cocaine-addiction-treatment" },
        { title: "Cocaine addiction guide", description: "Understand signs, harms and the wider treatment pathway.", href: "/resources/cocaine-addiction" },
        { title: "Drug-use assessment", description: "Organise concerns about use, mood, other substances and safety.", href: "/assessments/drug-use" },
        { title: "Online recovery programme", description: "Explore structured support when the person is medically stable.", href: "/online-programme" },
      ];
    }
    if (article.slug === "ketamine-withdrawal") {
      return [
        { title: "Ketamine addiction treatment", description: "Coordinate recovery support with a separate physical-health pathway.", href: "/ketamine-addiction-treatment" },
        { title: "Ketamine addiction guide", description: "Understand addiction signs, bladder harm and broader treatment options.", href: "/resources/ketamine-addiction" },
        { title: "Drug-use assessment", description: "Organise concerns about use, control and physical symptoms.", href: "/assessments/drug-use" },
        { title: "Treatment placement", description: "Compare settings when greater structure is required.", href: "/treatment-placement" },
      ];
    }
    if (article.slug === "detox-vs-rehab") {
      return [
        { title: "UK addiction detox guide", description: "Understand substance-specific withdrawal risks and settings.", href: "/resources/addiction-detox-uk" },
        { title: "Residential rehabilitation", description: "See what assessment, therapy and aftercare should involve.", href: "/resources/what-happens-in-residential-rehabilitation" },
        { title: "Treatment placement", description: "Compare external detox and rehab providers by capability and fit.", href: "/treatment-placement" },
        { title: "Private rehab costs", description: "Compare costs only after identifying the required level of care.", href: "/how-much-does-rehab-cost-uk" },
      ];
    }
    if (isEarlyFindingsArticle) {
      return [
        { title: "Family addiction guidance", description: "Plan conversations, boundaries and practical next steps.", href: "/family-addiction-intervention-uk" },
        { title: "Treatment placement", description: "Compare suitable treatment options with assessment-led guidance.", href: "/treatment-placement" },
        { title: "All family support articles", description: "Explore further guidance for families affected by addiction.", href: "/resources" },
      ];
    }
    if (article.slug === "how-to-choose-private-rehab-centre-uk") {
      return [
        { title: "How quickly can someone enter rehab?", description: "See which assessment, capacity, detox and travel checks affect a safe admission timeline.", href: "/resources/how-quickly-can-someone-enter-rehab" },
        { title: "28-day vs longer-term rehab", description: "Compare treatment duration by assessed need, progress reviews and continuing care rather than package labels.", href: "/resources/28-day-vs-90-day-rehab" },
        { title: "Private rehab costs", description: "Compare complete pathway costs after establishing clinical fit.", href: "/how-much-does-rehab-cost-uk" },
        { title: "Treatment placement", description: "Get assessment-led help comparing suitable providers.", href: "/treatment-placement" },
      ];
    }
    if (article.slug === "cannabis-withdrawal") {
      return [
        { title: "Cannabis addiction guide", description: "Understand signs, harms and the wider evidence-led treatment picture.", href: "/resources/cannabis-addiction" },
        { title: "Cannabis addiction treatment", description: "Compare community, online and residential support after the early withdrawal period.", href: "/cannabis-addiction-treatment" },
        { title: "Drug-use assessment", description: "Organise use, withdrawal, mental-health and daily-functioning concerns.", href: "/assessments/drug-use" },
        { title: "Online recovery programme", description: "Explore structured support where the person is stable and online care is suitable.", href: "/online-programme" },
      ];
    }
    if (article.slug === "how-quickly-can-someone-enter-rehab") {
      return [
        { title: "How to choose a private rehab", description: "Use the clinical, regulatory, cost and aftercare checks before accepting a place.", href: "/resources/how-to-choose-private-rehab-centre-uk" },
        { title: "Treatment placement", description: "See how assessment-led provider comparison and admission planning works.", href: "/treatment-placement" },
        { title: "Detox suitability assessment", description: "Organise withdrawal history for a qualified clinical conversation.", href: "/assessments/detox" },
        { title: "Private rehab costs", description: "Review total pathway costs and written-inclusion questions before paying.", href: "/how-much-does-rehab-cost-uk" },
      ];
    }
    if (article.slug === "28-day-vs-90-day-rehab") {
      return [
        { title: "What happens in residential rehab?", description: "Understand assessment, therapy, daily structure and continuing care.", href: "/resources/what-happens-in-residential-rehabilitation" },
        { title: "How to choose a private rehab", description: "Check provider capability and governance before comparing programme length.", href: "/resources/how-to-choose-private-rehab-centre-uk" },
        { title: "Private rehab costs", description: "Compare the full pathway cost, including detox, extensions and aftercare.", href: "/how-much-does-rehab-cost-uk" },
        { title: "Treatment placement", description: "Compare duration and setting against assessed needs.", href: "/treatment-placement" },
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
    if (slug === "gambling-addiction") {
      return {
        heading: "Need gambling-specific support?",
        description: "Use NHS or commissioned gambling services for assessment and treatment. IRN can discuss its service limits and help you organise non-urgent next questions, but it is not a specialist gambling-treatment provider.",
        primaryCta: { label: "Find NHS gambling support", href: "https://www.nhs.uk/live-well/addiction-support/gambling-addiction/" },
        secondaryCta: { label: "Ask IRN about service limits", href: "/contact" },
      };
    }
    if (slug === "prescription-drug-addiction") {
      return {
        heading: "Concerned about prescription medicine dependence or withdrawal?",
        description: "The detox assessment can help organise the medicine list, withdrawal history, overdose risk and questions for a prescriber or clinical service. It does not provide a taper or replace medical assessment.",
        primaryCta: { label: "Start the detox assessment", href: "/assessments/detox" },
        secondaryCta: { label: "Explore treatment placement", href: "/treatment-placement" },
      };
    }
    if (slug === "alcohol-withdrawal-symptoms-when-you-need-medical-help") {
      return {
        heading: "Unsure whether alcohol withdrawal needs medical support?",
        description: "Use the alcohol and detox assessment to organise the history for a GP, NHS alcohol service or qualified detox provider. It cannot clear a self-detox.",
        primaryCta: { label: "Start the alcohol detox assessment", href: "/assessments/alcohol-detox" },
        secondaryCta: { label: "Compare treatment options", href: "/treatment-placement" },
      };
    }
    if (slug === "benzodiazepine-withdrawal" || slug === "opioid-detox") {
      return {
        heading: "Need help organising withdrawal and treatment questions?",
        description: "Use the detox assessment to prepare for a qualified clinical conversation. It does not prescribe, diagnose or approve a self-managed withdrawal.",
        primaryCta: { label: "Start the detox assessment", href: "/assessments/detox" },
        secondaryCta: { label: "Explore treatment placement", href: "/treatment-placement" },
      };
    }
    if (slug === "cocaine-withdrawal" || slug === "ketamine-withdrawal") {
      return {
        heading: "Ready to put structured recovery support in place?",
        description: "A drug-use assessment can organise the pattern, safety concerns and questions for the next appropriate service. It is not an emergency or medical assessment.",
        primaryCta: { label: "Start a drug-use assessment", href: "/assessments/drug-use" },
        secondaryCta: { label: "Compare treatment options", href: "/treatment-placement" },
      };
    }
    if (slug === "detox-vs-rehab") {
      return {
        heading: "Need help separating withdrawal care from longer treatment?",
        description: "Assessment-led placement can help compare external services by detox capability, rehabilitation model, safety and continuing care.",
        primaryCta: { label: "Explore treatment placement", href: "/treatment-placement" },
        secondaryCta: { label: "Start the detox assessment", href: "/assessments/detox" },
      };
    }
    if (slug === "cannabis-addiction") {
      return {
        heading: "Concerned that cannabis is becoming difficult to control?",
        description: "A confidential assessment can help organise the pattern, withdrawal, mental-health risks and realistic support options. It is educational and cannot diagnose cannabis dependence or assess an emergency.",
        primaryCta: { label: "Start a drug-use assessment", href: "/assessments/drug-use" },
        secondaryCta: { label: "Explore treatment options", href: "/treatment-placement" },
      };
    }
    if (slug === "cannabis-withdrawal") {
      return {
        heading: "Need support beyond the first withdrawal period?",
        description: "A drug-use assessment can help organise use, sleep, mood, cravings and realistic support options. It is educational and does not diagnose dependence or assess an emergency.",
        primaryCta: { label: "Start a drug-use assessment", href: "/assessments/drug-use" },
        secondaryCta: { label: "Compare cannabis treatment", href: "/cannabis-addiction-treatment" },
      };
    }
    if (slug === "how-quickly-can-someone-enter-rehab") {
      return {
        heading: "Need a time-sensitive but suitable placement?",
        description: "IRN can help organise the information, compare capable external providers and support admission planning without replacing emergency or clinical assessment.",
        primaryCta: { label: "Discuss treatment placement", href: "/contact" },
        secondaryCta: { label: "Review how placement works", href: "/treatment-placement" },
      };
    }
    if (slug === "28-day-vs-90-day-rehab") {
      return {
        heading: "Need help comparing treatment length and fit?",
        description: "Assessment-led placement can compare programme duration, clinical capability, cost and continuing care against the person's needs.",
        primaryCta: { label: "Discuss treatment options", href: "/contact" },
        secondaryCta: { label: "Compare rehab costs", href: "/how-much-does-rehab-cost-uk" },
      };
    }
    if (slug === "ketamine-addiction") {
      return {
        heading: "Concerned about ketamine use or health effects?",
        description: "A confidential assessment can help organise the pattern, risks and realistic treatment options. It is educational and cannot diagnose ketamine addiction or assess bladder, kidney or other physical damage.",
        primaryCta: { label: "Start a drug-use assessment", href: "/assessments/drug-use" },
        secondaryCta: { label: "Explore treatment placement", href: "/treatment-placement" },
      };
    }
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
    if (slug === "mental-health-and-addiction") {
      return {
        heading: "Not sure which need to address first?",
        description: "A confidential assessment can help organise concerns and identify a proportionate next step. It is educational, not a diagnosis or emergency service.",
        primaryCta: { label: "Explore the assessments", href: "/assessments" },
        secondaryCta: { label: "Discuss treatment options", href: "/treatment-placement" },
      };
    }
    if (slug === "benzodiazepine-addiction") {
      return {
        heading: "Concerned about benzodiazepine dependence or withdrawal?",
        description: "The detox assessment can help organise medicine, withdrawal and combination-risk questions before a conversation with a prescriber or clinical service. It does not provide a taper or replace medical assessment.",
        primaryCta: { label: "Start the detox assessment", href: "/assessments/detox" },
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
          "@id": `${SITE_URL}${canonicalPath}#faq`,
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
    "@type": "Article",
    "@id": `${SITE_URL}${canonicalPath}#article`,
    headline: article.seoTitle ?? article.title,
    description: article.metaDescription ?? article.excerpt,
    author: {
      "@type": "Person",
      "@id": `${SITE_URL}/#craig-bilton`,
      name: article.author,
      jobTitle: article.authorRole,
      url: `${SITE_URL}/about`,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
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
    ...(article.sources?.length
      ? { citation: article.sources.map((source) => source.url) }
      : {}),
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${SITE_URL}${canonicalPath}#breadcrumb`,
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
                <Link href="/about" className="text-sm font-medium text-primary hover:text-accent transition-colors">
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
                  width={1600}
                  height={900}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  sizes="(min-width: 1200px) 768px, (min-width: 768px) calc(100vw - 6rem), calc(100vw - 3rem)"
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

      <PreferredSources />

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

import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { AlertTriangle, ArrowRight, Check, ClipboardCheck, Network, ShieldCheck } from "lucide-react";
import { Link } from "wouter";
import { SEO } from "@/components/SEO";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { CTASection } from "@/components/ui/cta-section";
import { FAQSection } from "@/components/ui/faq-section";
import { RelatedServiceLinks } from "@/components/ui/related-service-links";
import { ServiceSummary } from "@/components/ui/service-summary";
import {
  getSubstanceTreatmentPage,
  SUBSTANCE_TREATMENT_REVIEW_DATE,
} from "@/data/substance-treatment-pages.js";
import NotFound from "@/pages/not-found";

const SITE_URL = "https://www.insightrecoverynetwork.com";
const highlightIcons = [ShieldCheck, ClipboardCheck, Network];

function pageJsonLd(page: NonNullable<ReturnType<typeof getSubstanceTreatmentPage>>) {
  const canonical = `${SITE_URL}${page.route}`;
  const reviewDateIso = page.reviewDateIso ?? "2026-08-28";

  return [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${canonical}#webpage`,
      url: canonical,
      name: page.fullTitle,
      description: page.metaDescription,
      inLanguage: "en-GB",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      primaryImageOfPage: {
        "@type": "ImageObject",
        "@id": `${canonical}#primaryimage`,
        url: `${SITE_URL}${page.heroImage}`,
        contentUrl: `${SITE_URL}${page.heroImage}`,
        width: 1600,
        height: 900,
        caption: page.heroAlt,
      },
      reviewedBy: {
        "@type": "Person",
        "@id": `${SITE_URL}/craig-bilton#person`,
        name: "Craig Bilton",
        url: `${SITE_URL}/craig-bilton`,
      },
      lastReviewed: reviewDateIso,
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${canonical}#service`,
      name: `${page.title} guidance and placement support`,
      serviceType: "Assessment-led addiction treatment navigation and recovery support",
      description: page.metaDescription,
      image: `${SITE_URL}${page.heroImage}`,
      provider: {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "Insight Recovery Network",
        url: SITE_URL,
      },
      areaServed: { "@type": "Country", name: "United Kingdom" },
      url: canonical,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: "Treatment placement",
          item: `${SITE_URL}/treatment-placement`,
        },
        { "@type": "ListItem", position: 3, name: page.title, item: canonical },
      ],
    },
  ];
}

export default function SubstanceTreatmentPage({ slug }: { slug: string }) {
  const page = getSubstanceTreatmentPage(slug);

  useEffect(() => {
    document
      .head.querySelectorAll('[data-prerendered-jsonld="true"]')
      .forEach((element) => element.remove());
  }, [slug]);

  if (!page) return <NotFound />;

  const relatedLinks = page.relatedLinks.map(([title, description, href]) => ({
    title,
    description,
    href,
  }));
  const faqs = page.faqs.map(([question, answer]) => ({ question, answer }));
  const reviewDate = page.reviewDate ?? SUBSTANCE_TREATMENT_REVIEW_DATE;

  return (
    <Layout>
      <SEO
        title={page.title}
        fullTitle={page.fullTitle}
        description={page.metaDescription}
        canonical={page.route}
        ogImage={`${SITE_URL}${page.ogImage}`}
        ogImageWidth={1200}
        ogImageHeight={630}
        ogImageAlt={page.heroAlt}
      />
      <Helmet>
        <meta name="robots" content="index, follow" />
        {pageJsonLd(page).map((schema) => (
          <script key={schema["@type"]} type="application/ld+json">
            {JSON.stringify(schema)}
          </script>
        ))}
      </Helmet>

      <section className="relative overflow-hidden border-y border-accent/15 bg-[linear-gradient(150deg,#F2EDE3_0%,#F8F6F1_55%,#E9E3D8_100%)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_20%,rgba(201,169,110,0.2),transparent_40%)]" />
        <div className="container relative mx-auto px-6 py-10 md:px-12 md:py-14 lg:py-20">
          <nav aria-label="Breadcrumb" className="mb-9 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span aria-hidden="true" className="mx-2">/</span>
            <Link href="/treatment-placement" className="hover:text-primary">Treatment placement</Link>
            <span aria-hidden="true" className="mx-2">/</span>
            <span aria-current="page" className="text-primary">{page.title}</span>
          </nav>

          <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(360px,520px)] lg:gap-14">
            <div>
              <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
                {page.eyebrow}
              </p>
              <h1 className="mb-6 max-w-4xl font-serif text-[2.55rem] font-medium leading-[1.04] tracking-tight text-primary md:text-6xl lg:text-[4rem]">
                {page.h1}
              </h1>
              <p className="max-w-3xl text-lg font-light leading-relaxed text-muted-foreground md:text-xl">
                {page.intro[0]}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href={page.cta.primary[1]} data-analytics-event={`${page.slug.replaceAll("-", "_")}_hero_cta_click`}>
                  <Button size="lg" className="h-12 w-full rounded-none px-7 text-sm sm:w-auto">
                    {page.cta.primary[0]} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/treatment-placement">
                  <Button variant="outline" size="lg" className="h-12 w-full rounded-none border-primary/25 bg-white/40 px-7 text-sm hover:bg-white/70 sm:w-auto">
                    How placement works
                  </Button>
                </Link>
              </div>
              <p className="mt-4 text-[11.5px] font-light tracking-wide text-muted-foreground/65">
                Confidential · No obligation · Clinical providers retain responsibility for care
              </p>
            </div>

            <div className="space-y-6 lg:mt-8">
              <figure className="aspect-video overflow-hidden bg-secondary/20 shadow-xl">
                <img
                  src={page.heroImage}
                  alt={page.heroAlt}
                  width={1600}
                  height={900}
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  sizes="(min-width: 1024px) 42vw, 100vw"
                  className="h-full w-full object-cover"
                />
              </figure>

              <aside className="border border-accent/30 bg-primary p-7 text-primary-foreground shadow-xl" aria-label="Important safety guidance">
                <AlertTriangle className="mb-5 h-6 w-6 text-accent" strokeWidth={1.5} />
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-accent">Safety comes first</p>
                <p className="text-sm leading-relaxed text-primary-foreground/80">{page.urgentNote}</p>
                <Link href="/clinical-disclaimer" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-accent">
                  Read the clinical disclaimer <ArrowRight size={15} />
                </Link>
              </aside>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border/40 bg-background py-10 md:py-14">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-3xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-accent/80">Treatment selection, not self-diagnosis</p>
            <h2 className="mb-5 font-serif text-3xl font-medium leading-tight text-primary md:text-4xl">
              Separate information from an individual clinical decision.
            </h2>
            <div className="space-y-5 text-base leading-relaxed text-muted-foreground md:text-lg">
              {page.intro.slice(1).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </div>
        </div>
      </section>

      <ServiceSummary
        who={page.summary.who}
        problem={page.summary.problem}
        applies={page.summary.applies}
        nextStep={page.summary.nextStep}
        updated={reviewDate}
      />

      <section className="border-b border-border/40 bg-secondary/10 py-12 md:py-16">
        <div className="container mx-auto grid gap-5 px-6 md:grid-cols-3 md:px-12">
          {page.highlights.map((item, index) => {
            const Icon = highlightIcons[index] ?? Check;
            return (
              <article key={item.title} className="border border-border/40 bg-background p-6">
                <Icon className="mb-5 h-6 w-6 text-accent" strokeWidth={1.5} />
                <h2 className="mb-3 font-serif text-xl text-primary">{item.title}</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </article>
            );
          })}
        </div>
      </section>

      <div className="bg-background">
        {page.sections.map((section, index) => (
          <section key={section.title} className={`border-b border-border/40 py-12 md:py-20 ${index % 2 ? "bg-secondary/10" : ""}`}>
            <div className="container mx-auto px-6 md:px-12">
              <div className="max-w-3xl">
                <h2 className="mb-6 font-serif text-3xl font-medium leading-tight text-primary md:text-4xl">{section.title}</h2>
                <div className="space-y-5 leading-relaxed text-muted-foreground">
                  {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
                {section.bullets?.length ? (
                  <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                    {section.bullets.map((item) => (
                      <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          </section>
        ))}
      </div>

      <section className="border-b border-border/40 bg-primary py-12 text-primary-foreground md:py-20">
        <div className="container mx-auto px-6 md:px-12">
          <div className="mb-9 max-w-3xl">
            <h2 className="mb-4 font-serif text-3xl font-medium md:text-4xl">{page.comparison.title}</h2>
            <p className="leading-relaxed text-primary-foreground/75">{page.comparison.introduction}</p>
          </div>
          <div className="hidden overflow-hidden border border-white/15 md:block">
            <table className="w-full border-collapse text-left">
              <thead className="bg-white/10"><tr>{page.comparison.columns.map((column) => <th key={column} className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.12em]">{column}</th>)}</tr></thead>
              <tbody>{page.comparison.rows.map((row) => <tr key={row[0]} className="border-t border-white/10 align-top"><th className="px-5 py-4 font-serif text-lg font-medium">{row[0]}</th><td className="px-5 py-4 text-sm leading-relaxed text-primary-foreground/75">{row[1]}</td><td className="px-5 py-4 text-sm leading-relaxed text-primary-foreground/75">{row[2]}</td></tr>)}</tbody>
            </table>
          </div>
          <div className="grid gap-4 md:hidden">
            {page.comparison.rows.map((row) => <article key={row[0]} className="border border-white/15 bg-white/5 p-5"><h3 className="mb-3 font-serif text-xl">{row[0]}</h3><p className="mb-2 text-sm leading-relaxed text-primary-foreground/75"><strong className="text-primary-foreground">{page.comparison.columns[1]}:</strong> {row[1]}</p><p className="text-sm leading-relaxed text-primary-foreground/75"><strong className="text-primary-foreground">{page.comparison.columns[2]}:</strong> {row[2]}</p></article>)}
          </div>
        </div>
      </section>

      <section className="border-b border-border/40 bg-background py-12 md:py-20">
        <div className="container mx-auto px-6 md:px-12">
          <div className="mb-10 max-w-3xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-accent/80">How IRN helps</p>
            <h2 className="font-serif text-3xl font-medium text-primary md:text-4xl">From immediate safety to continuing care</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {page.process.map(([title, body], index) => <article key={title} className="border-t-2 border-accent/60 pt-5"><p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-accent/80">Step {index + 1}</p><h3 className="mb-3 font-serif text-xl text-primary">{title}</h3><p className="text-sm leading-relaxed text-muted-foreground">{body}</p></article>)}
          </div>
          <div className="mt-10 max-w-4xl border-l-4 border-accent bg-secondary/20 p-6 text-sm leading-relaxed text-muted-foreground">{page.transparency}</div>
        </div>
      </section>

      <RelatedServiceLinks links={relatedLinks} heading="Related treatment and clinical guidance" />

      <section className="border-t border-border/40 bg-secondary/10 py-12 md:py-16" aria-labelledby="sources-heading">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-3xl">
            <h2 id="sources-heading" className="mb-4 font-serif text-2xl text-primary md:text-3xl">Clinical sources and review</h2>
            <p className="mb-5 text-sm leading-relaxed text-muted-foreground">General UK treatment information reviewed {reviewDate}. Sources support the clinical framing; they do not endorse Insight Recovery Network or replace an individual assessment.</p>
            <ul className="space-y-3">
              {page.sources.map(([title, href]) => <li key={href}><a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-start gap-2 text-sm font-medium text-primary underline decoration-accent/60 underline-offset-4 hover:text-accent">{title}<ArrowRight className="mt-0.5 h-4 w-4 shrink-0" /></a></li>)}
            </ul>
          </div>
        </div>
      </section>

      <FAQSection items={faqs} heading={`Questions about ${page.title.toLowerCase()}`} />
      <CTASection
        heading={page.cta.heading}
        description={page.cta.description}
        primaryCta={{ label: page.cta.primary[0], href: page.cta.primary[1] }}
        secondaryCta={{ label: page.cta.secondary[0], href: page.cta.secondary[1] }}
        analyticsEvent="treatment_placement_enquiry"
        sourcePage={page.slug}
        serviceInterest="treatment-placement"
      />
    </Layout>
  );
}

import { Helmet } from "react-helmet-async";
import { useEffect } from "react";
import { ArrowRight, Check, Globe2, ShieldCheck, Stethoscope } from "lucide-react";
import { Link } from "wouter";
import { SEO } from "@/components/SEO";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { CTASection } from "@/components/ui/cta-section";
import { FAQSection } from "@/components/ui/faq-section";
import { RelatedServiceLinks } from "@/components/ui/related-service-links";
import { ServiceSummary } from "@/components/ui/service-summary";
import {
  getPremiumTreatmentPage,
  PREMIUM_TREATMENT_REVIEW_DATE,
} from "@/data/premium-treatment-pages.js";
import NotFound from "@/pages/not-found";

const SITE_URL = "https://www.insightrecoverynetwork.com";

const highlightIcons = [Stethoscope, ShieldCheck, Globe2];

function pageJsonLd(page: NonNullable<ReturnType<typeof getPremiumTreatmentPage>>) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${SITE_URL}${page.route}#service`,
      name: page.h1,
      serviceType: "Assessment-led private addiction treatment placement guidance",
      description: page.metaDescription,
      provider: {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "Insight Recovery Network",
        url: SITE_URL,
      },
      areaServed: [
        { "@type": "Country", name: "United Kingdom" },
        { "@type": "Country", name: "Thailand" },
        { "@type": "Country", name: "South Africa" },
        { "@type": "Country", name: "Spain" },
        { "@type": "Country", name: "Sri Lanka" },
      ],
      url: `${SITE_URL}${page.route}`,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: "Treatment Placement",
          item: `${SITE_URL}/treatment-placement`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: page.title,
          item: `${SITE_URL}${page.route}`,
        },
      ],
    },
  ];
}

export default function PremiumTreatmentPage({ slug }: { slug: string }) {
  const page = getPremiumTreatmentPage(slug);
  useEffect(() => {
    document
      .head.querySelectorAll('[data-prerendered-jsonld="true"]')
      .forEach((element) => element.remove());
  }, [slug]);

  if (!page) return <NotFound />;

  const jsonLd = pageJsonLd(page);
  const relatedLinks = page.relatedLinks.map(([title, description, href]) => ({
    title,
    description,
    href,
  }));
  const faqs = page.faqs.map(([question, answer]) => ({ question, answer }));

  return (
    <Layout>
      <SEO
        title={page.title}
        fullTitle={page.fullTitle}
        description={page.metaDescription}
        canonical={page.route}
        ogImage={`${SITE_URL}${page.heroImage}`}
        ogImageWidth={1600}
        ogImageHeight={900}
        ogImageAlt={page.heroAlt}
      />
      <Helmet>
        <meta name="robots" content="index, follow" />
        {jsonLd.map((schema) => (
          <script key={schema["@type"]} type="application/ld+json">
            {JSON.stringify(schema)}
          </script>
        ))}
      </Helmet>

      <section className="border-b border-border/40 bg-primary pt-24 md:pt-28">
        <div className="container mx-auto px-0 md:px-12">
          <figure className="overflow-hidden bg-primary">
            <img
              src={page.heroImage}
              alt={page.heroAlt}
              width={1600}
              height={900}
              className="block h-auto w-full"
              fetchPriority="high"
              decoding="async"
            />
            <figcaption className="px-6 py-3 text-[11px] leading-relaxed text-primary-foreground/60 md:px-0">
              Illustrative setting. Insight Recovery Network does not claim to own or operate the depicted property.
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="border-b border-border/40 bg-background py-12 md:py-20">
        <div className="container mx-auto px-6 md:px-12">
          <nav aria-label="Breadcrumb" className="mb-8 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span aria-hidden="true" className="mx-2">/</span>
            <Link href="/treatment-placement" className="hover:text-primary">Treatment placement</Link>
            <span aria-hidden="true" className="mx-2">/</span>
            <span aria-current="page" className="text-primary">{page.title}</span>
          </nav>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16">
            <div className="max-w-3xl">
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-accent/80">
                {page.eyebrow}
              </p>
              <h1 className="mb-7 font-serif text-4xl font-medium leading-[1.08] tracking-tight text-primary md:text-5xl lg:text-[3.6rem]">
                {page.h1}
              </h1>
              <div className="space-y-5 text-lg leading-relaxed text-muted-foreground">
                {page.intro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link href="/contact" data-analytics-event={`${page.slug.replaceAll("-", "_")}_cta_click`}>
                  <Button size="lg" className="h-12 w-full rounded-none px-7 sm:w-auto">
                    Discuss treatment options
                  </Button>
                </Link>
                <Link href="/assessments">
                  <Button variant="outline" size="lg" className="h-12 w-full rounded-none px-7 sm:w-auto">
                    Request a confidential assessment
                  </Button>
                </Link>
              </div>
            </div>
            <aside className="border border-border/50 bg-secondary/20 p-6 lg:self-start" aria-label="Important guidance">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-accent/80">Clinical fit before comfort</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Premium accommodation can support treatment, but it cannot replace suitable detox, psychiatric care, qualified staffing, therapy or safe discharge planning.
              </p>
              <Link href="/resources/how-to-choose-private-rehab-centre-uk" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent">
                How to compare private rehab <ArrowRight size={15} />
              </Link>
            </aside>
          </div>
        </div>
      </section>

      <ServiceSummary
        who={page.summary.who}
        problem={page.summary.problem}
        applies={page.summary.applies}
        nextStep={page.summary.nextStep}
        updated={PREMIUM_TREATMENT_REVIEW_DATE}
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
                <h2 className="mb-6 font-serif text-3xl font-medium leading-tight text-primary md:text-4xl">
                  {section.title}
                </h2>
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
              <thead className="bg-white/10">
                <tr>{page.comparison.columns.map((column) => <th key={column} className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.12em]">{column}</th>)}</tr>
              </thead>
              <tbody>
                {page.comparison.rows.map((row) => (
                  <tr key={row[0]} className="border-t border-white/10 align-top">
                    <th className="px-5 py-4 font-serif text-lg font-medium">{row[0]}</th>
                    <td className="px-5 py-4 text-sm leading-relaxed text-primary-foreground/75">{row[1]}</td>
                    <td className="px-5 py-4 text-sm leading-relaxed text-primary-foreground/75">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid gap-4 md:hidden">
            {page.comparison.rows.map((row) => (
              <article key={row[0]} className="border border-white/15 bg-white/5 p-5">
                <h3 className="mb-3 font-serif text-xl">{row[0]}</h3>
                <p className="mb-2 text-sm leading-relaxed text-primary-foreground/75"><strong className="text-primary-foreground">{page.comparison.columns[1]}:</strong> {row[1]}</p>
                <p className="text-sm leading-relaxed text-primary-foreground/75"><strong className="text-primary-foreground">{page.comparison.columns[2]}:</strong> {row[2]}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border/40 bg-background py-12 md:py-20">
        <div className="container mx-auto px-6 md:px-12">
          <div className="mb-10 max-w-3xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-accent/80">How IRN helps</p>
            <h2 className="font-serif text-3xl font-medium text-primary md:text-4xl">From assessment to a practical treatment plan</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {page.process.map(([title, body], index) => (
              <article key={title} className="border-t-2 border-accent/60 pt-5">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-accent/80">Step {index + 1}</p>
                <h3 className="mb-3 font-serif text-xl text-primary">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
              </article>
            ))}
          </div>
          <div className="mt-10 max-w-3xl border-l-4 border-accent bg-secondary/20 p-6 text-sm leading-relaxed text-muted-foreground">
            {page.transparency}
          </div>
        </div>
      </section>

      <RelatedServiceLinks links={relatedLinks} heading="Compare related private treatment routes" />
      <FAQSection items={faqs} heading={`Questions about ${page.title.toLowerCase()}`} />
      <CTASection
        heading={page.cta.heading}
        description={page.cta.description}
        primaryCta={{ label: page.cta.primary[0], href: page.cta.primary[1] }}
        secondaryCta={{ label: page.cta.secondary[0], href: page.cta.secondary[1] }}
        analyticsEvent={`${page.slug.replaceAll("-", "_")}_cta_click`}
      />
    </Layout>
  );
}

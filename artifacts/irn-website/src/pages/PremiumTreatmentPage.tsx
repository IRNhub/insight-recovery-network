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

      <section className="relative overflow-hidden border-y border-accent/15 bg-[linear-gradient(155deg,#F2EDE3_0%,#F8F6F1_54%,#ECE6DB_100%)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_28%,rgba(201,169,110,0.2),transparent_42%)]" />
        <div className="container relative mx-auto px-6 py-8 md:px-12 md:py-12 lg:py-14">
          <nav aria-label="Breadcrumb" className="mb-8 text-xs text-muted-foreground md:mb-10">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span aria-hidden="true" className="mx-2">/</span>
            <Link href="/treatment-placement" className="hover:text-primary">Treatment placement</Link>
            <span aria-hidden="true" className="mx-2">/</span>
            <span aria-current="page" className="text-primary">{page.title}</span>
          </nav>

          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-6">
              <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
                {page.eyebrow}
              </p>
              <h1 className="mb-6 max-w-2xl font-serif text-[2.55rem] font-medium leading-[1.04] tracking-tight text-primary md:text-6xl lg:text-[3.65rem]">
                {page.h1}
              </h1>
              <p className="max-w-xl text-lg font-light leading-relaxed text-muted-foreground md:text-xl">
                {page.intro[0]}
              </p>

              <div className="mt-7 flex flex-col gap-2.5">
                {page.highlights.map((item) => (
                  <div key={item.title} className="flex items-center gap-3">
                    <div className="h-px w-5 flex-shrink-0 bg-accent/70" />
                    <span className="text-[13px] font-light text-muted-foreground/80">{item.title}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/get-help" data-analytics-event="treatment_placement_enquiry" data-source-page={page.slug} data-service-interest="treatment-placement" data-cta-location="hero">
                  <Button size="lg" className="h-12 w-full rounded-none px-7 text-sm sm:w-auto">
                    Discuss treatment options
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/treatment-placement">
                  <Button variant="outline" size="lg" className="h-12 w-full rounded-none border-primary/25 bg-white/40 px-7 text-sm hover:bg-white/70 sm:w-auto">
                    How placement works
                  </Button>
                </Link>
              </div>
              <p className="mt-4 text-[11.5px] font-light tracking-wide text-muted-foreground/65">
                Confidential · No obligation · UK and international options
              </p>
            </div>

            <figure className="relative lg:col-span-6">
              <div className="absolute -inset-3 rounded-2xl border border-accent/20 bg-accent/10" />
              <div className="relative aspect-square overflow-hidden rounded-xl shadow-2xl">
                <img
                  src={page.heroImage}
                  alt={page.heroAlt}
                  width={1600}
                  height={900}
                  className="h-full w-full object-cover"
                  style={{ objectPosition: "right center" }}
                  fetchPriority="high"
                  decoding="async"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary/75 via-primary/15 to-transparent px-5 pb-5 pt-20 text-primary-foreground">
                  <p className="font-serif text-base">Private treatment, compared carefully</p>
                  <p className="mt-1 text-[11px] text-white/70">Clinical fit · Privacy · Cost · Continuing care</p>
                </div>
              </div>
              <figcaption className="relative mt-3 text-[10.5px] leading-relaxed text-muted-foreground/65">
                Illustrative setting. IRN does not claim to own or operate the depicted property.
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="border-b border-border/40 bg-background py-10 md:py-14">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16">
            <div className="max-w-3xl">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-accent/80">Assessment before admission</p>
              <h2 className="mb-5 font-serif text-3xl font-medium leading-tight text-primary md:text-4xl">
                A private treatment decision built around fit, not presentation.
              </h2>
              <div className="space-y-5 text-base leading-relaxed text-muted-foreground md:text-lg">
                {page.intro.slice(1).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
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
        primaryEvent="treatment_placement_enquiry"
        sourcePage={page.slug}
        serviceInterest="treatment-placement"
        ctaLocation="final_cta"
      />
    </Layout>
  );
}

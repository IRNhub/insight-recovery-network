import { Helmet } from "react-helmet-async";
import { SEO } from "@/components/SEO";
import { Layout } from "@/components/layout/Layout";
import { Link } from "wouter";
import { CTASection } from "@/components/ui/cta-section";
import { getDestination } from "@/data/destinations";

const SITE_URL = "https://www.insightrecoverynetwork.com";

interface DestinationRehabProps {
  slug: string;
}

export default function DestinationRehab({ slug }: DestinationRehabProps) {
  const d = getDestination(slug);
  if (!d) return null;
  const canonicalUrl = `${SITE_URL}/${d.slug}`;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: d.faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${canonicalUrl}#service`,
    name: `Private Rehab Placement — ${d.country}`,
    serviceType: "Addiction treatment placement guidance",
    description: d.metaDescription,
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: { "@type": "Country", name: d.country },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "GBP",
      lowPrice: d.costLow,
      highPrice: d.costHigh,
      description: d.costIntro,
    },
  };

  return (
    <Layout>
      <SEO
        title={d.title}
        fullTitle={d.seoTitle}
        description={d.metaDescription}
        canonical={`/${d.slug}`}
        ogImage={`${SITE_URL}/opengraph.jpg`}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
      </Helmet>

      {/* Hero */}
      <section className="py-20 md:py-28 border-b border-border/40">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent/80 mb-5">
              {d.heroEyebrow}
            </p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.08] tracking-tight mb-8 text-primary">
              {d.heroHeading}
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mb-10">
              {d.heroIntro}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/contact">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Speak Confidentially
                </button>
              </Link>
              <Link href="/treatment-placement">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-7 py-3.5 border border-border text-sm font-medium hover:bg-muted transition-colors"
                >
                  How Placement Works
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why this destination */}
      <section className="py-16 md:py-24 border-b border-border/40">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-2xl mb-10">
            <h2 className="font-serif text-3xl md:text-4xl font-medium leading-tight mb-6 text-primary">
              {d.whyHeading}
            </h2>
            <p className="text-muted-foreground leading-relaxed">{d.whyIntro}</p>
          </div>
          <ul className="max-w-3xl space-y-3">
            {d.whyPoints.map((item, i) => (
              <li key={i} className="flex gap-3 text-muted-foreground leading-relaxed">
                <span className="text-accent mt-0.5 flex-shrink-0">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Costs */}
      <section className="py-16 md:py-24 border-b border-border/40 bg-secondary/20">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-medium leading-tight mb-6 text-primary">
                {d.costHeading}
              </h2>
              <p className="text-lg text-foreground leading-relaxed mb-6">{d.costIntro}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{d.costNote}</p>
            </div>
            <div className="border border-border/40 bg-white p-8">
              <h3 className="font-serif text-xl font-medium mb-5 text-primary">
                What treatment typically includes
              </h3>
              <ul className="space-y-3">
                {d.costIncludes.map((item, i) => (
                  <li key={i} className="flex gap-3 text-sm text-muted-foreground leading-relaxed">
                    <span className="text-accent mt-0.5 flex-shrink-0">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Who it suits */}
      <section className="py-16 md:py-24 border-b border-border/40">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-2xl mb-10">
            <h2 className="font-serif text-3xl md:text-4xl font-medium leading-tight text-primary">
              {d.whoHeading}
            </h2>
          </div>
          <ul className="max-w-3xl space-y-3 mb-8">
            {d.whoPoints.map((item, i) => (
              <li key={i} className="flex gap-3 text-muted-foreground leading-relaxed">
                <span className="text-accent mt-0.5 flex-shrink-0">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
            Not sure whether {d.country} is the right setting — or whether residential treatment is
            needed at all? Start with a{" "}
            <Link
              href="/assessments"
              className="text-foreground underline underline-offset-4 decoration-border hover:text-accent transition-colors"
            >
              free confidential assessment
            </Link>{" "}
            or read about{" "}
            <Link
              href="/treatment-placement"
              className="text-foreground underline underline-offset-4 decoration-border hover:text-accent transition-colors"
            >
              how our placement process works
            </Link>
            .
          </p>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 md:py-24 border-b border-border/40">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-2xl mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-medium leading-tight text-primary">
              Frequently asked questions
            </h2>
          </div>
          <div className="max-w-3xl space-y-8">
            {d.faqs.map((faq) => (
              <div key={faq.question} className="border-b border-border/40 pb-8 last:border-b-0">
                <h3 className="font-serif text-xl font-medium mb-3 text-primary">{faq.question}</h3>
                <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        heading={`Considering treatment in ${d.country}?`}
        body="A confidential conversation can clarify whether this is the right setting for your situation — clinically and practically. Independent guidance, no pressure, no commercial ties to any facility."
        primaryLabel="Speak confidentially"
        primaryHref="/contact"
        secondaryLabel="Take a free assessment"
        secondaryHref="/assessments"
      />
    </Layout>
  );
}

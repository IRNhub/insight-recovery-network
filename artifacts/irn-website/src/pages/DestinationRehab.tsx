import { SEO } from "@/components/SEO";
import { Layout } from "@/components/layout/Layout";
import { Link } from "wouter";
import { CTASection } from "@/components/ui/cta-section";
import { ServiceSummary } from "@/components/ui/service-summary";
import { RelatedServiceLinks } from "@/components/ui/related-service-links";
import { getDestination, destinations } from "@/data/destinations";

const SITE_URL = "https://www.insightrecoverynetwork.com";

interface DestinationRehabProps {
  slug: string;
}

export default function DestinationRehab({ slug }: DestinationRehabProps) {
  const d = getDestination(slug);
  if (!d) return null;
  const otherDestinations = destinations.filter((destination) => destination.slug !== d.slug);

  // NOTE: Service + FAQPage JSON-LD for this route are emitted once, server-side,
  // by scripts/prerender-meta.mjs (buildDestinationJsonLd) into the static HTML.
  // We deliberately do NOT also inject them here via Helmet, to avoid a duplicate
  // FAQPage on the rendered page (which Google Search Console flags as invalid).

  return (
    <Layout>
      <SEO
        title={d.title}
        fullTitle={d.seoTitle}
        description={d.metaDescription}
        canonical={`/${d.slug}`}
        ogImage={`${SITE_URL}${d.heroImage}`}
      />

      {/* Hero */}
      <section className="border-b border-border/40 bg-secondary/20">
        <div className="container mx-auto px-6 md:px-12 py-10 md:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.12fr)_minmax(360px,0.88fr)] gap-8 lg:gap-12 items-center">
            <div className="overflow-hidden border border-border/40 bg-primary shadow-sm">
              <img
                src={d.heroImage}
                alt={d.heroImageAlt}
                width={1717}
                height={916}
                className="block w-full aspect-[16/9] object-cover"
                fetchPriority="high"
                decoding="async"
              />
            </div>
            <div className="max-w-2xl">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent/80 mb-5">
                {d.heroEyebrow}
              </p>
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium leading-[1.08] tracking-tight mb-6 text-primary">
                {d.heroHeading}
              </h1>
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-8">
                {d.heroIntro}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/get-help" data-analytics-event="treatment_placement_enquiry" data-service-interest="treatment-placement" data-cta-location="hero">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    Book a confidential call
                  </button>
                </Link>
                <Link href="/assessments">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 px-7 py-3.5 border border-border text-sm font-medium hover:bg-muted transition-colors"
                  >
                    Take a free assessment
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ServiceSummary
        who={`People comparing private residential addiction treatment in ${d.country}, and families supporting that decision.`}
        problem="Explains likely fit, practical considerations and questions to ask before approaching a facility."
        applies={`Private treatment in ${d.country}; final suitability, admission and medical decisions remain with the chosen provider.`}
      />

      {/* Why this destination */}
      <section className="py-12 md:py-20 border-b border-border/40">
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
                <span className="text-accent mt-0.5 flex-shrink-0">, </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Costs */}
      <section className="py-12 md:py-20 border-b border-border/40 bg-secondary/20">
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
                    <span className="text-accent mt-0.5 flex-shrink-0">, </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Mid-page CTA: speak with Craig before contacting facilities */}
      <section className="py-12 md:py-16 border-b border-border/40 bg-primary">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent/90 mb-4">
              Before you contact facilities directly
            </p>
            <h2 className="font-serif text-2xl md:text-3xl font-medium leading-tight text-primary-foreground mb-4">
              Not sure whether {d.country} is clinically appropriate?
            </h2>
            <p className="text-primary-foreground/80 leading-relaxed font-light mb-7 max-w-2xl">
              Speak confidentially with Craig Bilton first. Facilities are naturally focused on their
              own programmes; our role is different. A short, assessment-led conversation can tell you
              whether {d.country} fits your situation clinically and practically before you commit to
              anyone.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/contact">
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-primary text-sm font-medium hover:bg-white/90 transition-colors w-full sm:w-auto"
                >
                  Book a confidential call
                </button>
              </Link>
              <Link href="/assessments">
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-white/25 text-primary-foreground text-sm font-medium hover:bg-white/10 transition-colors w-full sm:w-auto"
                >
                  Take a free assessment
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <RelatedServiceLinks
        heading="Compare treatment routes"
        links={[
          { title: "Treatment Placement", description: "See how assessment-led placement guidance works.", href: "/treatment-placement" },
          { title: "Private Rehab UK", description: "Compare treatment closer to home in the United Kingdom.", href: "/private-rehab-uk" },
          { title: "Private Rehab Alternatives", description: "Consider structured non-residential support where appropriate.", href: "/private-rehab-alternative-uk" },
          { title: "Luxury Rehab", description: "Compare premium treatment settings against clinical quality and aftercare.", href: "/luxury-rehab" },
          { title: "Executive Rehab", description: "Review discreet private treatment for professionals and business leaders.", href: "/executive-rehab" },
          { title: "Destination Rehab Guide", description: "Compare travel safety, costs and return-home planning across destinations.", href: "/destination-rehab" },
          ...otherDestinations.map((destination) => ({
            title: `Private Rehab ${destination.country}`,
            description: `Review treatment considerations for ${destination.country}.`,
            href: `/${destination.slug}`,
          })),
        ]}
      />

      {d.detailSections?.length ? (
        <section className="py-12 md:py-20 border-b border-border/40 bg-secondary/10">
          <div className="container mx-auto px-6 md:px-12">
            <div className="max-w-3xl mb-10">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent/80 mb-4">
                Treatment details
              </p>
              <h2 className="font-serif text-3xl md:text-4xl font-medium leading-tight text-primary mb-5">
                What to check before choosing rehab in {d.country}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                A suitable placement depends on the clinical programme, medical boundaries and practical plan, not the destination alone.
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {d.detailSections.map((section) => (
                <article key={section.heading} className="border border-border/40 bg-background p-7 md:p-8">
                  <h3 className="font-serif text-xl md:text-2xl font-medium text-primary mb-4">{section.heading}</h3>
                  <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                    {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  </div>
                  {section.points?.length ? (
                    <ul className="mt-5 space-y-2">
                      {section.points.map((point) => (
                        <li key={point} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                          <span className="text-accent mt-0.5 flex-shrink-0">, </span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Who it suits */}
      <section className="py-12 md:py-20 border-b border-border/40">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-2xl mb-10">
            <h2 className="font-serif text-3xl md:text-4xl font-medium leading-tight text-primary">
              {d.whoHeading}
            </h2>
          </div>
          <ul className="max-w-3xl space-y-3 mb-8">
            {d.whoPoints.map((item, i) => (
              <li key={i} className="flex gap-3 text-muted-foreground leading-relaxed">
                <span className="text-accent mt-0.5 flex-shrink-0">, </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          {d.clinicalNote && (
            <blockquote className="max-w-3xl border-l-2 border-accent pl-5 md:pl-6 mb-8">
              <p className="font-serif text-lg md:text-xl text-primary leading-relaxed italic">
                {d.clinicalNote}
              </p>
            </blockquote>
          )}
          <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
            Not sure whether {d.country} is the right setting, or whether residential treatment is
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
      <section className="py-12 md:py-20 border-b border-border/40">
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

      {/* Explore other destinations: internal linking */}
      <section className="py-12 md:py-20 border-b border-border/40 bg-secondary/20">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-2xl mb-8">
            <h2 className="font-serif text-2xl md:text-3xl font-medium leading-tight text-primary mb-4">
              Compare other treatment destinations
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              The right setting depends on clinical need, budget, family situation, and how much
              distance from home is helpful. Explore the alternatives, or start with{" "}
              <Link
                href="/treatment-placement"
                className="text-foreground underline underline-offset-4 decoration-border hover:text-accent transition-colors"
              >
                our placement overview
              </Link>
              .
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {destinations
              .filter((o) => o.slug !== d.slug)
              .map((o) => (
                <Link
                  key={o.slug}
                  href={`/${o.slug}`}
                  className="group border border-border/40 bg-white rounded-sm p-5 hover:border-accent/50 transition-colors block"
                >
                  <h3 className="font-serif text-lg font-medium text-primary group-hover:text-accent/90 transition-colors mb-1">
                    Private Rehab in {o.country}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    From around £{o.costLow.toLocaleString()} · guide range
                  </p>
                </Link>
              ))}
            <Link
              href="/private-rehab-uk"
              className="group border border-border/40 bg-white rounded-sm p-5 hover:border-accent/50 transition-colors block"
            >
              <h3 className="font-serif text-lg font-medium text-primary group-hover:text-accent/90 transition-colors mb-1">
                Private Rehab in the UK
              </h3>
              <p className="text-sm text-muted-foreground">
                Detox, residential treatment &amp; placement guidance
              </p>
            </Link>
          </div>
        </div>
      </section>

      <CTASection
        heading={`Considering treatment in ${d.country}?`}
        body="A confidential conversation can clarify whether this is the right setting for your situation, clinically and practically. No pressure, with relevant provider relationships explained transparently."
        primaryLabel="Book a confidential call"
        primaryHref="/get-help"
        primaryEvent="treatment_placement_enquiry"
        serviceInterest="treatment-placement"
        sourcePage={d.slug}
        secondaryLabel="Take a free assessment"
        secondaryHref="/assessments"
      />
    </Layout>
  );
}

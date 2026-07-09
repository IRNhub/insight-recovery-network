import { Helmet } from "react-helmet-async";
import { SEO } from "@/components/SEO";
import { Layout } from "@/components/layout/Layout";
import { getOgConfig, ogImageUrl } from "@/config/og-pages";
import { CTASection } from "@/components/ui/cta-section";
import { ServiceSummary } from "@/components/ui/service-summary";
import { FAQSection, type FAQItem } from "@/components/ui/faq-section";
import { RelatedServiceLinks } from "@/components/ui/related-service-links";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Shield, HeartHandshake, MapPin, ArrowRight } from "lucide-react";

import courtyardImg from "@/assets/tp-courtyard.webp";

const placementSteps = [
  {
    n: "1",
    title: "Understand the situation",
    body: "Assess urgency, risk, substance use history, mental health needs, family context, and practical requirements.",
  },
  {
    n: "2",
    title: "Identify suitable options",
    body: "Match needs against trusted providers, considering clinical fit, location, budget, length of stay, and environment.",
  },
  {
    n: "3",
    title: "Support admission planning",
    body: "Help coordinate communication, availability, documentation, travel considerations, and family questions.",
  },
  {
    n: "4",
    title: "Plan continuity of care",
    body: "Consider aftercare, online support, relapse prevention, and ongoing recovery structure.",
  },
];

const indications = [
  "Repeated relapse despite outpatient support",
  "High-risk alcohol or drug use",
  "Complex mental health alongside addiction",
  "Family unable to manage the situation safely",
  "Need for structured separation from current environment",
  "Previous treatment ended without strong aftercare",
];

const locations: Array<{ label: string; href?: string }> = [
  { label: "United Kingdom", href: "/private-rehab-uk" },
  { label: "South Africa", href: "/private-rehab-south-africa" },
  { label: "Thailand", href: "/private-rehab-thailand" },
  { label: "Spain", href: "/private-rehab-spain" },
  { label: "Sri Lanka", href: "/private-rehab-sri-lanka" },
];

const placementFaqs: FAQItem[] = [
  {
    question: "How does treatment placement work?",
    answer: "We first clarify the person's needs, risks, preferences, location and budget. We then explain suitable detox or residential options and support the practical steps towards admission; the treatment provider remains responsible for its own clinical assessment and care.",
  },
  {
    question: "Do you only place people in UK rehab facilities?",
    answer: "No. We provide guidance on options in the UK and selected international destinations including South Africa, Spain, Thailand and Sri Lanka. The right location depends on safety, treatment needs, travel, family involvement and affordability.",
  },
  {
    question: "Can Insight Recovery Network arrange medical detox?",
    answer: "We do not provide or prescribe detox. Where medically assisted withdrawal may be needed, we help people identify an appropriately regulated provider and encourage assessment by a qualified medical professional.",
  },
];

const comparison: Array<{
  country: string;
  href: string;
  bestFor: string;
  cost: string;
  advantage: string;
}> = [
  {
    country: "South Africa",
    href: "/private-rehab-south-africa",
    bestFor: "Longer treatment, relapse history, extended care, budget-sensitive families",
    cost: "From around £1,800/month up to around £10,000",
    advantage: "Best value for longer-term treatment and secondary care",
  },
  {
    country: "Spain",
    href: "/private-rehab-spain",
    bestFor: "UK proximity, family involvement, treatment close to home",
    cost: "Around £4,000 to £28,000 for 28 days",
    advantage: "Easy travel from the UK with a wide range of clinical and private options",
  },
  {
    country: "Thailand",
    href: "/private-rehab-thailand",
    bestFor: "Privacy, distance from triggers, established international centres",
    cost: "Around £8,000 to £15,000 for a standard 28-day stay",
    advantage: "Well-established international rehab market with structured residential care",
  },
  {
    country: "Sri Lanka",
    href: "/private-rehab-sri-lanka",
    bestFor: "Smaller, discreet, highly personalised treatment settings",
    cost: "Around £12,000 to £18,000 for a standard stay",
    advantage: "More intimate, individualised treatment environment",
  },
  {
    country: "United Kingdom",
    href: "/private-rehab-uk",
    bestFor: "Proximity, family involvement, ease of travel, NHS/private continuity",
    cost: "Varies widely by detox needs, length of stay and clinical intensity",
    advantage: "Closest to home, with detox and residential options nationwide",
  },
];

const treatmentOg = getOgConfig("/treatment-placement")!;

export default function TreatmentPlacement() {
  return (
    <Layout>
      <SEO
        title={treatmentOg.seoTitle ?? treatmentOg.title}
        description="Independent guidance on private rehab placement and detox across the UK and internationally. Insight Recovery Network assess your needs, identify the right facility, and manage the transition, confidentially and without pressure."
        canonical="/treatment-placement"
        ogImage={ogImageUrl(treatmentOg.file)}
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Private Rehab and Detox Placement",
            "description": "Independent, confidential guidance on private rehab, detox, and residential treatment placement in the UK and internationally.",
            "provider": { "@type": "Organization", "name": "Insight Recovery Network", "url": "https://www.insightrecoverynetwork.com" },
            "serviceType": "Addiction Treatment Placement",
            "areaServed": [
              { "@type": "Country", "name": "United Kingdom" },
              { "@type": "Place", "name": "International" },
            ],
            "url": "https://www.insightrecoverynetwork.com/treatment-placement",
          })}
        </script>
      </Helmet>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-background py-8 md:py-12 lg:py-14">
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,#162B3B,#162B3B 1px,transparent 1px,transparent 72px),repeating-linear-gradient(90deg,#162B3B,#162B3B 1px,transparent 1px,transparent 72px)",
          }}
        />
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">

            {/* Left: text */}
            <div className="lg:col-span-6 flex flex-col gap-5 md:gap-6">
              <span className="text-[9.5px] font-semibold tracking-[0.20em] uppercase text-accent/80">
                Treatment Placement
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-[3.4rem] font-serif text-primary leading-[1.08] tracking-tight">
                Private Rehab and Detox Placement Guidance
              </h1>
              <p className="text-base md:text-lg text-muted-foreground font-light leading-relaxed max-w-xl">
                Independent, confidential guidance to find the right detox, rehabilitation facility, or specialised care setting worldwide.
              </p>
              <div className="flex flex-col gap-2.5 pt-1">
                {[
                  "Independent of all treatment providers",
                  "Clinically matched to individual need",
                  "Access to vetted international facilities",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-px flex-shrink-0" style={{ background: "rgba(201,169,110,0.7)" }} />
                    <span className="text-[13px] text-muted-foreground/75 font-light">{item}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-3 pt-2">
                <Link href="/contact">
                  <Button
                    size="lg"
                    className="rounded-none h-12 md:h-14 px-7 md:px-10 text-sm md:text-base shadow-sm w-full sm:w-auto"
                  >
                    Book a confidential call
                  </Button>
                </Link>
                <p className="text-[11.5px] text-muted-foreground/60 font-light tracking-wide">
                  Private, discreet, clinically informed.
                </p>
              </div>
            </div>

            {/* Right: image */}
            <div className="lg:col-span-6 relative mt-4 lg:mt-0">
              <div className="relative" style={{ paddingBottom: "68%" }}>
                <div
                  className="absolute inset-0 translate-x-4 translate-y-4 md:translate-x-5 md:translate-y-5 rounded-xl"
                  style={{
                    background: "rgba(201,169,110,0.11)",
                    border: "1px solid rgba(201,169,110,0.22)",
                  }}
                />
                <img
                  src={courtyardImg}
                  alt="Private residential treatment setting at dusk"
                  className="absolute inset-0 w-full h-full object-cover rounded-xl z-10"
                  style={{ objectPosition: "center 60%" }}
                  fetchPriority="high"
                  loading="eager"
                />
                <div
                  className="absolute bottom-4 left-4 z-20 px-3.5 py-2.5 rounded-lg"
                  style={{ background: "rgba(22,43,59,0.82)", backdropFilter: "blur(8px)" }}
                >
                  <p className="font-serif text-white text-[12px] leading-tight">Vetted international providers</p>
                  <p className="text-white/55 text-[10.5px] font-light">Independent placement guidance</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <ServiceSummary
        who="Individuals or families considering private detox, residential rehabilitation or a more intensive treatment setting."
        problem="Makes complex treatment choices clearer and supports a safer, more appropriate placement decision."
        applies="Across the UK and selected international treatment destinations."
      />

      {/* ── Not all facilities section ── */}
      <section className="py-12 md:py-20" style={{ background: "rgba(246,244,240,0.55)" }}>
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start max-w-6xl mx-auto">

            {/* Left: copy */}
            <div className="flex flex-col gap-6">
              <span className="text-[9.5px] font-semibold tracking-[0.20em] uppercase text-accent/70 block">
                Why guidance matters
              </span>
              <h2 className="text-3xl md:text-4xl font-serif text-primary leading-tight">
                Not all facilities are appropriate for all individuals.
              </h2>
              <p className="text-[15px] text-muted-foreground font-light leading-relaxed">
                Finding a reputable rehab facility is difficult. Marketing materials often obscure clinical realities, and making the wrong choice at a critical moment can be detrimental to recovery.
              </p>
              <p className="text-[15px] text-muted-foreground font-light leading-relaxed">
                We provide independent, objective placement advice. We assess the clinical need, the individual's background, and the family's requirements, then map these against our vetted network of treatment providers.
              </p>

              <div className="flex flex-col gap-5 mt-2">
                {[
                  {
                    Icon: Shield,
                    title: "Independent Assessment",
                    body: "We evaluate the clinical appropriateness of facilities without bias or commercial incentive.",
                  },
                  {
                    Icon: HeartHandshake,
                    title: "Managed Transition",
                    body: "From initial admission logistics to discharge planning and aftercare, we manage the process.",
                  },
                ].map(({ Icon, title, body }) => (
                  <div key={title} className="flex items-start gap-4">
                    <div className="mt-0.5 flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg bg-secondary">
                      <Icon className="w-4 h-4 text-primary" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h4 className="font-serif text-[16px] text-primary mb-1">{title}</h4>
                      <p className="text-[13px] text-muted-foreground font-light leading-relaxed">{body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: International Network card */}
            <div
              className="border border-border/40 rounded-xl p-7 md:p-9 bg-white"
              style={{ boxShadow: "0 2px 12px rgba(22,43,59,0.07)" }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-secondary flex-shrink-0">
                  <MapPin className="w-4 h-4 text-accent" strokeWidth={1.5} />
                </div>
                <div>
                  <span className="text-[9px] font-semibold tracking-[0.18em] uppercase text-accent/70 block mb-0.5">
                    Coverage
                  </span>
                  <h3 className="text-[19px] font-serif text-primary leading-none">Our International Network</h3>
                </div>
              </div>

              <p className="text-[13.5px] text-muted-foreground font-light leading-relaxed mb-6">
                We maintain close relationships with selected, high-quality treatment partners across multiple regions to ensure we can meet specific clinical and environmental needs.
              </p>

              {/* Location pill tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {locations.map((loc) =>
                  loc.href ? (
                    <Link
                      key={loc.label}
                      href={loc.href}
                      className="text-[12px] font-light px-3.5 py-1.5 rounded-full border hover:border-accent/60 transition-colors"
                      style={{
                        color: "rgba(22,43,59,0.75)",
                        borderColor: "rgba(201,169,110,0.35)",
                        background: "rgba(201,169,110,0.07)",
                      }}
                    >
                      {loc.label}
                    </Link>
                  ) : (
                    <span
                      key={loc.label}
                      className="text-[12px] font-light px-3.5 py-1.5 rounded-full border"
                      style={{
                        color: "rgba(22,43,59,0.75)",
                        borderColor: "rgba(201,169,110,0.35)",
                        background: "rgba(201,169,110,0.07)",
                      }}
                    >
                      {loc.label}
                    </span>
                  )
                )}
              </div>

              <div className="w-full h-px mb-6" style={{ background: "rgba(22,43,59,0.08)" }} />

              <p className="text-[11.5px] text-muted-foreground/60 font-light leading-relaxed italic">
                Placement recommendations are made solely on clinical appropriateness and individual requirements. We offer careful, measured guidance without guarantees of specific outcomes.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── International options comparison ── */}
      <section id="international-options" className="py-12 md:py-20 bg-background scroll-mt-28">
        <div className="container mx-auto px-6 md:px-12">
          <div className="mb-8 md:mb-12 max-w-3xl">
            <span className="text-[9.5px] font-semibold tracking-[0.20em] uppercase text-accent/70 block mb-3">
              Comparing destinations
            </span>
            <h2 className="text-3xl md:text-4xl font-serif text-primary leading-tight mb-4">
              International treatment options at a glance.
            </h2>
            <p className="text-[15px] text-muted-foreground font-light leading-relaxed">
              A starting point, not a recommendation. The right destination depends on clinical need,
              detox and mental health risk, budget, and family circumstances, which is exactly what a
              confidential assessment works through. All costs are typical guide ranges only.
            </p>
          </div>

          {/* Desktop / tablet table */}
          <div className="hidden md:block overflow-hidden border border-border/40 rounded-xl bg-white" style={{ boxShadow: "0 2px 12px rgba(22,43,59,0.06)" }}>
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-primary text-primary-foreground">
                  <th className="font-serif font-medium text-[15px] px-5 py-4 w-[18%]">Destination</th>
                  <th className="font-sans font-medium text-[12px] tracking-wide uppercase px-5 py-4 w-[30%] text-primary-foreground/80">Best suited for</th>
                  <th className="font-sans font-medium text-[12px] tracking-wide uppercase px-5 py-4 w-[26%] text-primary-foreground/80">Typical guide cost</th>
                  <th className="font-sans font-medium text-[12px] tracking-wide uppercase px-5 py-4 w-[26%] text-primary-foreground/80">Key advantage</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, i) => (
                  <tr
                    key={row.country}
                    className={`border-t border-border/40 align-top transition-colors hover:bg-secondary/30 ${i % 2 === 1 ? "bg-secondary/15" : ""}`}
                  >
                    <td className="px-5 py-5">
                      <Link
                        href={row.href}
                        className="font-serif text-[17px] text-primary hover:text-accent transition-colors inline-flex items-center gap-1.5"
                      >
                        {row.country}
                        <ArrowRight className="w-3.5 h-3.5 text-accent" />
                      </Link>
                    </td>
                    <td className="px-5 py-5 text-[13.5px] text-muted-foreground font-light leading-relaxed">{row.bestFor}</td>
                    <td className="px-5 py-5 text-[13.5px] text-primary/85 font-light leading-relaxed">{row.cost}</td>
                    <td className="px-5 py-5 text-[13.5px] text-muted-foreground font-light leading-relaxed">{row.advantage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile stacked cards */}
          <div className="md:hidden flex flex-col gap-4">
            {comparison.map((row) => (
              <Link
                key={row.country}
                href={row.href}
                className="group block border border-border/40 rounded-xl bg-white p-5"
                style={{ boxShadow: "0 1px 4px rgba(22,43,59,0.05)" }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-serif text-lg text-primary group-hover:text-accent transition-colors">{row.country}</h3>
                  <ArrowRight className="w-4 h-4 text-accent flex-shrink-0" />
                </div>
                <dl className="flex flex-col gap-2.5">
                  <div>
                    <dt className="text-[10px] font-semibold tracking-[0.14em] uppercase text-accent/70 mb-0.5">Best suited for</dt>
                    <dd className="text-[13px] text-muted-foreground font-light leading-relaxed">{row.bestFor}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-semibold tracking-[0.14em] uppercase text-accent/70 mb-0.5">Typical guide cost</dt>
                    <dd className="text-[13px] text-primary/85 font-light leading-relaxed">{row.cost}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-semibold tracking-[0.14em] uppercase text-accent/70 mb-0.5">Key advantage</dt>
                    <dd className="text-[13px] text-muted-foreground font-light leading-relaxed">{row.advantage}</dd>
                  </div>
                </dl>
              </Link>
            ))}
          </div>

          <p className="text-[11.5px] text-muted-foreground/60 font-light leading-relaxed italic mt-5 max-w-3xl">
            Guide ranges only. Actual costs depend on the facility, length of stay, level of medical
            care required, and accommodation. Where detox is needed, withdrawal risk must be assessed
            before any placement or travel.
          </p>
        </div>
      </section>

      {/* ── How placement guidance works ── */}
      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-6 md:px-12">
          <div className="mb-10 md:mb-14">
            <span className="text-[9.5px] font-semibold tracking-[0.20em] uppercase text-accent/70 block mb-3">
              The process
            </span>
            <h2 className="text-3xl md:text-4xl font-serif text-primary leading-tight">
              How placement guidance works.
            </h2>
          </div>

          <div className="relative">
            {/* Horizontal connector: desktop only */}
            <div
              className="hidden md:block absolute top-[1.625rem] left-[calc(12.5%+1.25rem)] right-[calc(12.5%+1.25rem)] h-px pointer-events-none"
              style={{ background: "rgba(201,169,110,0.25)" }}
            />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-5 lg:gap-6">
              {placementSteps.map((s) => (
                <div
                  key={s.n}
                  className="flex flex-col items-center text-center bg-white border border-border/30 rounded-xl px-4 pt-5 pb-5 md:px-5 md:pt-6 md:pb-6"
                  style={{ boxShadow: "0 1px 4px rgba(22,43,59,0.05)" }}
                >
                  <div
                    className="w-12 h-12 flex items-center justify-center font-serif text-base mb-4 relative z-10"
                    style={{
                      background: "rgba(246,244,240,1)",
                      border: "1px solid rgba(201,169,110,0.50)",
                      color: "rgba(22,43,59,0.88)",
                      borderRadius: "50%",
                    }}
                  >
                    {s.n}
                  </div>
                  <h3 className="font-serif text-primary text-[15px] leading-snug mb-2">{s.title}</h3>
                  <p className="text-[12.5px] text-muted-foreground/65 font-light leading-relaxed">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── When treatment placement may be appropriate ── */}
      <section className="py-12 md:py-20" style={{ background: "rgba(246,244,240,0.55)" }}>
        <div className="container mx-auto px-6 md:px-12">
          <div className="mb-10 md:mb-14">
            <span className="text-[9.5px] font-semibold tracking-[0.20em] uppercase text-accent/70 block mb-3">
              Clinical indicators
            </span>
            <h2 className="text-3xl md:text-4xl font-serif text-primary leading-tight">
              When treatment placement may be appropriate.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
            {indications.map((item, i) => (
              <div
                key={item}
                className="flex items-start gap-4 bg-white border border-border/30 rounded-xl px-5 py-4"
                style={{ boxShadow: "0 1px 3px rgba(22,43,59,0.04)" }}
              >
                <span
                  className="flex-shrink-0 font-serif text-[10.5px] mt-0.5"
                  style={{ color: "rgba(201,169,110,0.85)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-[13.5px] text-primary/80 font-light leading-snug">{item}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-3 sm:items-center">
            <p className="text-sm text-muted-foreground font-light">
              Unsure about your risk level?
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/assessments/detox">
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary border border-primary/20 px-4 py-2 hover:bg-primary/5 transition-colors">
                  Detox Suitability Assessment
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
              <Link href="/assessments/alcohol-use">
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary border border-primary/20 px-4 py-2 hover:bg-primary/5 transition-colors">
                  Alcohol Use Assessment
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
              <Link href="/assessments/drug-use">
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary border border-primary/20 px-4 py-2 hover:bg-primary/5 transition-colors">
                  Drug Use Assessment
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <RelatedServiceLinks
        links={[
          { title: "Rehab Cost UK Guide", description: "Compare typical UK rehab, detox, overseas treatment and online recovery costs.", href: "/how-much-does-rehab-cost-uk" },
          { title: "Private Rehab UK", description: "Understand UK detox and residential rehabilitation options.", href: "/private-rehab-uk" },
          { title: "Private Rehab Alternatives", description: "Compare structured online support and other non-residential routes.", href: "/private-rehab-alternative-uk" },
          { title: "Online Recovery Programme", description: "Explore structured support for people who are medically stable.", href: "/online-programme" },
          { title: "Family Guidance", description: "Practical support for families deciding what to do next.", href: "/what-we-offer#family-guidance" },
          { title: "Detox Suitability Assessment", description: "Reflect on withdrawal risk before making changes to alcohol or drug use.", href: "/assessments/detox" },
        ]}
      />

      <FAQSection items={placementFaqs} />

      {/* ── CTA ── */}
      <CTASection
        heading="Need help choosing the right treatment setting?"
        description="Speak confidentially with our team. We will help you understand the available options without pressure or obligation."
        primaryCta={{ label: "Book a confidential call", href: "/contact" }}
        secondaryCta={{ label: "Take a free assessment", href: "/assessments/detox" }}
      />
    </Layout>
  );
}

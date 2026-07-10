import { SEO } from "@/components/SEO";
import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout/Layout";
import { ogImageUrl } from "@/config/og-pages";
import { CTASection } from "@/components/ui/cta-section";
import { ServiceSummary } from "@/components/ui/service-summary";
import { FAQSection, type FAQItem } from "@/components/ui/faq-section";
import { RelatedServiceLinks } from "@/components/ui/related-service-links";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

import heroImg from "@/assets/wwo-hero.webp";
import treatmentImg from "@/assets/wwo-treatment-placement.webp";
import onlineImg from "@/assets/wwo-online-programme.webp";
import digitalImg from "@/assets/wwo-insight-os.webp";
import familyImg from "@/assets/wwo-family-intervention.webp";
import professionalImg from "@/assets/professional-partnerships.webp";
import aftercareImg from "@/assets/aftercare-continuity.webp";

const services = [
  {
    n: "01",
    title: "Treatment Placement",
    href: "/treatment-placement",
    linkLabel: "Explore placement",
    img: treatmentImg,
    imgAlt: "Private treatment facility",
    imgPos: "center 55%",
    body: "Confidential guidance in identifying and securing the right detox or residential rehabilitation facility, from first conversation to admission, with access to our network of trusted international providers.",
    tags: ["Detox", "Residential Care", "International Options", "Family Guidance"],
  },
  {
    n: "02",
    title: "Online Programme",
    href: "/online-programme",
    linkLabel: "Explore programme",
    img: onlineImg,
    imgAlt: "Online recovery programme session",
    imgPos: "center 15%",
    body: "A structured digital recovery programme offering group support, one-to-one therapy, and relapse prevention planning for those who need flexibility without compromising quality of care.",
    tags: ["Groups", "1:1 Support", "Worksheets", "Relapse Prevention"],
  },
  {
    n: "03",
    title: "Insight OS",
    href: "/insight-os",
    linkLabel: "Explore OS",
    img: digitalImg,
    imgAlt: "Insight OS digital recovery platform",
    imgPos: "center 35%",
    body: "Our proprietary recovery platform. Daily check-ins, health scoring, journaling, and AI-assisted guidance work together to give you structure and clarity throughout the recovery journey.",
    tags: ["Daily Check-ins", "Journaling", "Recovery Tools", "AI Guidance"],
  },
];

const audiences = [
  {
    title: "Individuals seeking help",
    body: "Whether you are beginning to question your relationship with substances or are ready to take a decisive step, we provide clarity on the right level of support without pressure or judgement.",
  },
  {
    title: "Families unsure what to do next",
    body: "Addiction rarely affects just one person. We help families understand what is happening, what is possible, and how to act with care and firm boundaries, even when the person they love is not yet ready.",
  },
  {
    title: "Professionals managing complex situations",
    body: "HR teams, legal counsel, and Employee Assistance Programmes trust us to provide a discreet, clinically sound response when a sensitive situation arises with a key individual or team member.",
  },
  {
    title: "People leaving treatment who need aftercare",
    body: "The period after residential treatment is critical. We provide structured aftercare, digital recovery support through Insight OS, and ongoing clinical oversight to protect long-term recovery.",
  },
];

const steps = [
  {
    n: "1",
    title: "Confidential conversation",
    body: "Speak with one of our clinical team in complete confidence. No forms, no pressure, just a calm conversation to understand your situation.",
  },
  {
    n: "2",
    title: "Clinical recommendation",
    body: "Based on what you share, we make a clear, honest recommendation about which level of care or service is most appropriate.",
  },
  {
    n: "3",
    title: "Coordinated support",
    body: "We manage the logistics, from placement coordination to programme onboarding, so you can focus entirely on what matters.",
  },
  {
    n: "4",
    title: "Ongoing recovery structure",
    body: "Recovery does not end at discharge. We maintain continuity through Insight OS, regular reviews, and access to the wider clinical network.",
  },
];

const specialised = [
  {
    title: "Family & Intervention",
    body: "We support families in navigating complex, highly emotional situations with care, clarity, and boundaries. From strategic guidance to formal intervention planning, we provide the framework needed to initiate change safely.",
    img: familyImg,
    imgAlt: "Family consultation in a calm private room",
    imgPos: "center 30%",
    href: "/family-addiction-intervention-uk",
    cta: "Get family guidance",
  },
  {
    title: "Professional Partnerships",
    body: "We act as a discreet, expert resource for professionals, EAPs, HR teams, and legal counsel. When an organisation encounters a sensitive substance or mental health issue, we assess, advise, and coordinate a clinical response.",
    img: professionalImg,
    imgAlt: "Professionals reviewing notes in a private office",
    imgPos: "center 25%",
    href: "/confidential-addiction-help-professionals",
    cta: "Explore professional support",
  },
  {
    title: "Aftercare & Continuity Planning",
    body: "Sustained recovery requires structure beyond treatment. We design tailored aftercare plans integrating Insight OS, peer support, clinical oversight, and scheduled reviews to protect long-term wellbeing.",
    img: aftercareImg,
    imgAlt: "Calm planning scene with notebook and weekly plan tablet",
    imgPos: "center 40%",
    href: "/insight-os",
    cta: "Explore continuing care",
  },
];

const servicesFaqs: FAQItem[] = [
  {
    question: "Where should I start if I do not know what support is needed?",
    answer: "Start with a confidential call or one of the free assessments. We can then explain whether online support, family guidance, treatment placement or a regulated medical service appears to be the most appropriate next route.",
  },
  {
    question: "Does Insight Recovery Network provide medical treatment?",
    answer: "No. We are not a regulated healthcare provider and do not diagnose, prescribe or provide emergency care. Where medical detox or regulated treatment is required, we help people identify an appropriate provider.",
  },
  {
    question: "Can families ask for guidance before their loved one agrees to treatment?",
    answer: "Yes. Families can seek support to understand boundaries, communication, safety and realistic treatment options even when the person they are worried about is not ready to engage.",
  },
];

export default function WhatWeOffer() {
  return (
    <Layout>
      <SEO
        title="Addiction Counselling &amp; Recovery Services"
        description="Insight Recovery Network offers addiction counselling, private rehab placement, online recovery programmes, family intervention support, and relapse prevention tools, tailored to each individual's needs."
        canonical="/what-we-offer"
        ogImage={ogImageUrl("og-what-we-offer.png")}
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Addiction Recovery Support and Treatment Guidance",
            description: "Private treatment placement guidance, structured online recovery support, family guidance and digital recovery tools.",
            provider: { "@type": "Organization", name: "Insight Recovery Network", url: "https://www.insightrecoverynetwork.com" },
            areaServed: [{ "@type": "Country", name: "United Kingdom" }, { "@type": "Place", name: "International" }],
            url: "https://www.insightrecoverynetwork.com/what-we-offer",
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
                Our Services
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-[3.4rem] font-serif text-primary leading-[1.08] tracking-tight">
                Addiction Counselling and Recovery Services
              </h1>
              <p className="text-base md:text-lg text-muted-foreground font-light leading-relaxed max-w-xl">
                From the moment of crisis through to long-term wellbeing, we provide structured pathways for individuals, families, and professionals.
              </p>
              <div className="flex flex-col gap-2.5 pt-1">
                {[
                  "Treatment placement & detox guidance",
                  "Online recovery programme & digital tools",
                  "Specialised support for families & professionals",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-px flex-shrink-0" style={{ background: "rgba(201,169,110,0.7)" }} />
                    <span className="text-[13px] text-muted-foreground/75 font-light">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: image panel */}
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
                  src={heroImg}
                  alt="Clinical consultation and recovery guidance"
                  className="absolute inset-0 w-full h-full object-cover rounded-xl z-10"
                  style={{ objectPosition: "center" }}
                  fetchPriority="high"
                  loading="eager"
                />
                <div
                  className="absolute bottom-4 left-4 z-20 px-3.5 py-2.5 rounded-lg"
                  style={{ background: "rgba(22,43,59,0.82)", backdropFilter: "blur(8px)" }}
                >
                  <p className="font-serif text-white text-[12px] leading-tight">Recovery guidance</p>
                  <p className="text-white/55 text-[10.5px] font-light">Discreet · Clinical · Confidential</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <ServiceSummary
        who="Individuals, families and professionals looking for private addiction recovery guidance and structured support."
        problem="Clarifies which support route fits the situation and provides continuity from first enquiry through ongoing recovery."
        applies="Online across the UK and internationally, with placement guidance for UK and overseas treatment."
      />

      {/* ── Assessments callout ── */}
      <div
        style={{
          background: "rgba(201,169,110,0.07)",
          borderTop: "1px solid rgba(201,169,110,0.18)",
          borderBottom: "1px solid rgba(201,169,110,0.18)",
        }}
      >
        <div className="container mx-auto px-6 md:px-12 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4">
            <p className="text-sm text-muted-foreground font-light">
              Not sure which service is right for you?
            </p>
            <Link
              href="/assessments"
              className="text-sm font-medium text-primary hover:text-accent transition-colors flex items-center gap-1.5"
            >
              Take a free confidential assessment
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Core Services ── */}
      <section className="py-12 md:py-20" style={{ background: "rgba(246,244,240,0.55)" }}>
        <div className="container mx-auto px-6 md:px-12">
          <div className="mb-10 md:mb-14">
            <span className="text-[9.5px] font-semibold tracking-[0.20em] uppercase text-accent/70 block mb-3">
              Core services
            </span>
            <h2 className="text-3xl md:text-4xl font-serif text-primary leading-tight">
              Three structured pathways.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
            {services.map((s) => (
              <div
                key={s.n}
                className="group flex flex-col bg-white border border-border/40 rounded-xl overflow-hidden hover:border-primary/20 transition-all duration-300"
                style={{ boxShadow: "0 1px 4px rgba(22,43,59,0.05)", transition: "box-shadow 0.3s, border-color 0.3s" }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 6px 24px -4px rgba(22,43,59,0.12)")}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 1px 4px rgba(22,43,59,0.05)")}
              >
                {/* Image */}
                <div className="relative overflow-hidden" style={{ height: "196px" }}>
                  <img
                    src={s.img}
                    alt={s.imgAlt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    style={{ objectPosition: s.imgPos }}
                  />
                  <div
                    className="absolute top-3.5 left-3.5 flex items-center justify-center w-8 h-8 rounded-full"
                    style={{ background: "rgba(22,43,59,0.78)", backdropFilter: "blur(4px)" }}
                  >
                    <span className="font-serif text-[10px] text-white/90">{s.n}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-grow p-6">
                  <div className="w-5 h-px mb-4" style={{ background: "rgba(201,169,110,0.75)" }} />
                  <h3 className="text-[19px] font-serif text-primary mb-3 leading-snug">{s.title}</h3>
                  <p className="text-[13.5px] text-muted-foreground/80 font-light leading-relaxed mb-4 flex-grow">
                    {s.body}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {s.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-light px-2.5 py-1 rounded-full border"
                        style={{
                          color: "rgba(22,43,59,0.60)",
                          borderColor: "rgba(22,43,59,0.10)",
                          background: "rgba(246,244,240,0.85)",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={s.href}
                    className="inline-flex items-center text-[10.5px] font-semibold uppercase tracking-[0.15em] text-accent group-hover:text-primary transition-colors"
                  >
                    {s.linkLabel}
                    <ArrowRight className="ml-1.5 w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who We Support ── */}
      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-6 md:px-12">
          <div className="mb-10 md:mb-14">
            <span className="text-[9.5px] font-semibold tracking-[0.20em] uppercase text-accent/70 block mb-3">
              Who we support
            </span>
            <h2 className="text-3xl md:text-4xl font-serif text-primary leading-tight">
              Support shaped around the person, not the problem.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
            {audiences.map((a, i) => (
              <div
                key={a.title}
                className="flex gap-5 p-5 md:p-6 border border-border/30 rounded-xl bg-white"
                style={{ boxShadow: "0 1px 3px rgba(22,43,59,0.04)" }}
              >
                <div className="flex-shrink-0 pt-0.5">
                  <span className="font-serif text-[11px]" style={{ color: "rgba(201,169,110,0.85)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div>
                  <div className="w-4 h-px mb-3" style={{ background: "rgba(201,169,110,0.5)" }} />
                  <h3 className="font-serif text-primary text-[17px] leading-snug mb-2">{a.title}</h3>
                  <p className="text-[13px] text-muted-foreground/70 font-light leading-relaxed">{a.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How We Help You Find the Right Path ── */}
      <section className="py-12 md:py-20" style={{ background: "rgba(246,244,240,0.55)" }}>
        <div className="container mx-auto px-6 md:px-12">
          <div className="mb-10 md:mb-14">
            <span className="text-[9.5px] font-semibold tracking-[0.20em] uppercase text-accent/70 block mb-3">
              The process
            </span>
            <h2 className="text-3xl md:text-4xl font-serif text-primary leading-tight">
              How we help you find the right path.
            </h2>
          </div>

          <div className="relative">
            {/* Horizontal connector, desktop only */}
            <div
              className="hidden md:block absolute top-[1.625rem] left-[calc(12.5%+1.25rem)] right-[calc(12.5%+1.25rem)] h-px pointer-events-none"
              style={{ background: "rgba(201,169,110,0.25)" }}
            />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-5 lg:gap-6">
              {steps.map((s) => (
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

      {/* ── Specialised Guidance ── */}
      <section id="family-guidance" className="py-12 md:py-20 bg-primary text-primary-foreground relative overflow-hidden scroll-mt-28">
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,white,white 1px,transparent 1px,transparent 80px),repeating-linear-gradient(90deg,white,white 1px,transparent 1px,transparent 80px)",
          }}
        />

        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="mb-10 md:mb-14">
            <span className="text-[9.5px] font-semibold tracking-[0.20em] uppercase text-accent/60 block mb-3">
              Extended care
            </span>
            <h2 className="text-3xl md:text-4xl font-serif text-white leading-tight">Specialised Guidance</h2>
            <p className="mt-4 text-[15px] text-primary-foreground/60 font-light leading-relaxed max-w-lg">
              We extend our expertise beyond the individual to support the wider network affected by addiction and mental health challenges.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
            {specialised.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group flex flex-col rounded-xl border overflow-hidden transition hover:-translate-y-1 hover:border-accent/40"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  borderColor: "rgba(255,255,255,0.10)",
                }}
              >
                <div className="relative overflow-hidden flex-shrink-0" style={{ height: "200px" }}>
                  <img
                    src={item.img}
                    alt={item.imgAlt}
                    className="w-full h-full object-cover"
                    style={{ objectPosition: item.imgPos }}
                    loading="lazy"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to bottom, rgba(22,43,59,0.30) 0%, rgba(22,43,59,0.20) 50%, rgba(22,43,59,0.65) 100%)",
                    }}
                  />
                </div>
                <div className="flex flex-col flex-grow p-6 lg:p-7">
                  <div className="w-6 h-px mb-5" style={{ background: "rgba(201,169,110,0.70)" }} />
                  <h3 className="font-serif text-white text-[19px] leading-snug mb-3">{item.title}</h3>
                  <p className="text-[13.5px] text-primary-foreground/65 font-light leading-relaxed">{item.body}</p>
                  <span className="mt-5 inline-flex items-center text-[11px] font-semibold uppercase tracking-wide text-accent">
                    {item.cta}<ArrowRight className="ml-2 h-3.5 w-3.5 transition group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <RelatedServiceLinks
        links={[
          { title: "Treatment Placement", description: "Independent guidance for detox and residential rehabilitation options.", href: "/treatment-placement" },
          { title: "Private Rehab UK", description: "Understand UK residential treatment and provider checks.", href: "/private-rehab-uk" },
          { title: "Private Rehab Alternatives", description: "Compare online, community and residential support routes.", href: "/private-rehab-alternative-uk" },
          { title: "Online Recovery Programme", description: "Structured recovery support delivered around everyday life.", href: "/online-programme" },
          { title: "Detox Suitability Assessment", description: "Consider whether withdrawal may require medical support.", href: "/assessments/detox" },
          { title: "Family & Intervention Help", description: "Get a plan when someone you love is refusing treatment.", href: "/family-addiction-intervention-uk" },
        ]}
      />

      <FAQSection items={servicesFaqs} />

      {/* ── CTA ── */}
      <CTASection
        heading="Unsure which route is right?"
        description="Start with a confidential conversation. We will help you understand the options without pressure, judgement, or obligation."
        primaryCta={{ label: "Book a confidential call", href: "/contact" }}
        secondaryCta={{ label: "Take a free assessment", href: "/assessments" }}
      />
    </Layout>
  );
}

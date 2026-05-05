import { SEO } from "@/components/SEO";
import { Layout } from "@/components/layout/Layout";
import { PathwayCard } from "@/components/ui/pathway-card";
import { SectionHeader } from "@/components/ui/section-header";
import { CTASection } from "@/components/ui/cta-section";
import { ServicePreview } from "@/components/ui/service-preview";
import { Button } from "@/components/ui/button";
import { Fragment } from "react";
import { Shield, BookOpen, Map, Monitor } from "lucide-react";
import { Link } from "wouter";
import treatmentImg from "@/assets/hero-treatment-placement.png";
import onlineProgrammeImg from "@/assets/hero-online-programme.png";
import digitalToolsImg from "@/assets/hero-digital-tools.png";

const trustPoints = [
  "Private guidance",
  "Structured support",
  "Digital recovery tools",
  "Treatment pathways",
];

const pillars = [
  {
    title: "Online Programme",
    desc: "Groups, one-to-one support and relapse prevention planning.",
    href: "/online-programme",
  },
  {
    title: "Insight OS",
    desc: "Daily structure, journaling, check-ins and Anchor guidance.",
    href: "/insight-os",
  },
  {
    title: "Treatment Placement",
    desc: "Confidential guidance for detox, residential rehab and continuing care.",
    href: "/treatment-placement",
  },
];

export default function Home() {
  return (
    <Layout>
      <SEO
        title="Private Addiction & Mental Health Support"
        description="Private addiction and mental health support for individuals, families and professionals. Expert treatment placement, online recovery programmes, digital tools."
        canonical="/"
      />

      {/* ── Hero — premium three-pillar two-zone composition ── */}
      <section className="bg-background overflow-hidden">
        <div className="container mx-auto px-6 md:px-12 pt-28 md:pt-32 lg:pt-36 pb-16 md:pb-20 lg:pb-24">
          <div className="flex flex-col lg:flex-row lg:items-start gap-12 lg:gap-10 xl:gap-14">

            {/* ══ LEFT ZONE: copy + CTAs + trust + pillar summary ══ */}
            <div className="lg:w-[44%] xl:w-[42%] flex flex-col gap-0">

              {/* Eyebrow */}
              <span
                className="text-[9.5px] font-semibold tracking-[0.20em] uppercase text-accent/70 font-sans block mb-5"
                data-testid="text-hero-eyebrow"
              >
                Confidential online recovery, digital tools and treatment guidance
              </span>

              {/* Headline */}
              <h1
                className="font-serif text-primary leading-[1.07] tracking-tight mb-5"
                style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)" }}
                data-testid="text-hero-heading"
              >
                Recovery support that meets you where you are.
              </h1>

              {/* Subheading */}
              <p
                className="text-[15px] text-muted-foreground leading-relaxed font-light mb-7 max-w-[480px]"
                data-testid="text-hero-description"
              >
                Insight Recovery Network combines structured online recovery support, Insight OS digital recovery tools and confidential treatment placement guidance — for individuals, families and professionals.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3 mb-7">
                <Link href="/contact" data-testid="button-hero-primary">
                  <Button className="rounded-none h-12 px-7 text-sm">
                    Speak Confidentially
                  </Button>
                </Link>
                <Link href="/what-we-offer" data-testid="button-hero-secondary">
                  <Button variant="outline" className="rounded-none h-12 px-7 text-sm border-primary/20 hover:bg-primary/5">
                    Explore Support Options
                  </Button>
                </Link>
              </div>

              {/* Trust row */}
              <div className="flex flex-wrap items-center gap-y-1 mb-8 pb-8 border-b border-border/30">
                {trustPoints.map((item, i) => (
                  <Fragment key={item}>
                    {i > 0 && (
                      <span className="mx-2.5 text-border/40 text-xs select-none">·</span>
                    )}
                    <span className="text-[10.5px] text-muted-foreground/60 tracking-wide">{item}</span>
                  </Fragment>
                ))}
              </div>

              {/* Three-pillar compact summary */}
              <div className="flex flex-col gap-5">
                {pillars.map((p, i) => (
                  <div key={p.title} className="flex gap-4 items-start group">
                    {/* Champagne index */}
                    <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 mt-0.5">
                      <span
                        className="font-serif text-[11px] font-medium"
                        style={{ color: "rgba(201,169,110,0.85)" }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <Link href={p.href}>
                        <p className="font-serif text-primary text-[13px] leading-tight mb-1 group-hover:text-primary/70 transition-colors">
                          {p.title}
                        </p>
                      </Link>
                      <p className="text-muted-foreground/65 text-[12px] leading-snug font-light">
                        {p.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* ══ RIGHT ZONE: premium staggered image mosaic ══ */}
            <div className="lg:flex-1 min-w-0">

              {/* Desktop mosaic — hidden on mobile */}
              <div className="hidden md:block relative" style={{ height: "580px" }}>

                {/* Gap constants: left col = 56%, gap = 3%, right col = 41% */}

                {/* Online Recovery Programme — tall dominant left panel */}
                <div
                  className="absolute top-0 left-0 rounded-xl overflow-hidden group"
                  style={{
                    width: "56%", height: "100%",
                    boxShadow: "0 8px 32px -4px rgba(22,43,59,0.18), 0 0 0 1px rgba(22,43,59,0.07)",
                  }}
                >
                  <img
                    src={onlineProgrammeImg}
                    alt="A person attending a structured online recovery session from home"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                  {/* Label overlay */}
                  <div
                    className="absolute bottom-0 left-0 right-0 px-5 py-4"
                    style={{ background: "linear-gradient(to top, rgba(22,43,59,0.88) 0%, rgba(22,43,59,0.60) 60%, transparent 100%)" }}
                  >
                    <div className="w-5 h-px mb-2" style={{ background: "rgba(201,169,110,0.8)" }} />
                    <p className="font-serif text-white text-[13px] leading-tight mb-0.5">
                      Online Recovery Programme
                    </p>
                    <p className="text-white/55 text-[11px] font-light leading-snug">
                      Structured support from wherever you are.
                    </p>
                  </div>
                </div>

                {/* Digital Recovery Tools — top-right, secondary prominent */}
                <div
                  className="absolute top-0 right-0 rounded-xl overflow-hidden group"
                  style={{
                    width: "41%", height: "57%",
                    boxShadow: "0 8px 32px -4px rgba(22,43,59,0.18), 0 0 0 1px rgba(22,43,59,0.07)",
                  }}
                >
                  <img
                    src={digitalToolsImg}
                    alt="Insight OS digital recovery app on a phone"
                    className="w-full h-full object-cover object-[center_20%] transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                  <div
                    className="absolute bottom-0 left-0 right-0 px-4 py-3.5"
                    style={{ background: "linear-gradient(to top, rgba(22,43,59,0.88) 0%, rgba(22,43,59,0.55) 65%, transparent 100%)" }}
                  >
                    <div className="w-4 h-px mb-1.5" style={{ background: "rgba(201,169,110,0.8)" }} />
                    <p className="font-serif text-white text-[12px] leading-tight mb-0.5">
                      Digital Recovery Tools
                    </p>
                    <p className="text-white/55 text-[10.5px] font-light leading-snug">
                      Insight OS for daily recovery structure.
                    </p>
                  </div>
                </div>

                {/* Treatment Placement — bottom-right, supporting */}
                <div
                  className="absolute bottom-0 right-0 rounded-xl overflow-hidden group"
                  style={{
                    width: "41%", height: "40%",
                    boxShadow: "0 8px 32px -4px rgba(22,43,59,0.18), 0 0 0 1px rgba(22,43,59,0.07)",
                  }}
                >
                  <img
                    src={treatmentImg}
                    alt="A calm, private residential treatment setting surrounded by landscaped gardens"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                  <div
                    className="absolute bottom-0 left-0 right-0 px-4 py-3"
                    style={{ background: "linear-gradient(to top, rgba(22,43,59,0.88) 0%, rgba(22,43,59,0.50) 65%, transparent 100%)" }}
                  >
                    <div className="w-4 h-px mb-1.5" style={{ background: "rgba(201,169,110,0.8)" }} />
                    <p className="font-serif text-white text-[12px] leading-tight mb-0.5">
                      Treatment Placement
                    </p>
                    <p className="text-white/55 text-[10.5px] font-light leading-snug">
                      Private guidance when residential care is needed.
                    </p>
                  </div>
                </div>

              </div>

              {/* Mobile: clean stacked premium cards */}
              <div className="md:hidden flex flex-col gap-3">
                {[
                  {
                    img: onlineProgrammeImg,
                    alt: "Online recovery session",
                    title: "Online Recovery Programme",
                    desc: "Structured support from wherever you are.",
                    objPos: "center",
                  },
                  {
                    img: digitalToolsImg,
                    alt: "Insight OS app",
                    title: "Digital Recovery Tools",
                    desc: "Insight OS for daily recovery structure.",
                    objPos: "center 20%",
                  },
                  {
                    img: treatmentImg,
                    alt: "Private treatment setting",
                    title: "Treatment Placement",
                    desc: "Private guidance when residential care is needed.",
                    objPos: "center",
                  },
                ].map((panel) => (
                  <div
                    key={panel.title}
                    className="relative rounded-xl overflow-hidden"
                    style={{
                      height: "180px",
                      boxShadow: "0 4px 16px -4px rgba(22,43,59,0.16), 0 0 0 1px rgba(22,43,59,0.06)",
                    }}
                  >
                    <img
                      src={panel.img}
                      alt={panel.alt}
                      className="w-full h-full object-cover"
                      style={{ objectPosition: panel.objPos }}
                    />
                    <div
                      className="absolute bottom-0 left-0 right-0 px-4 py-3"
                      style={{ background: "linear-gradient(to top, rgba(22,43,59,0.85) 0%, transparent 100%)" }}
                    >
                      <p className="font-serif text-white text-[12px] leading-tight">{panel.title}</p>
                      <p className="text-white/55 text-[10.5px] font-light">{panel.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ── Pathways ── */}
      <section className="py-20 lg:py-28 bg-secondary/20">
        <div className="container mx-auto px-6 md:px-12">
          <SectionHeader
            label="Where to start"
            heading="Find the right path"
            className="mb-12"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
            <PathwayCard
              title="I need help for myself"
              description="If things feel difficult to manage alone, we can help you understand the right next step."
              href="/contact"
              linkLabel="Explore support"
              delay={0}
            />
            <PathwayCard
              title="I need help for someone else"
              description="Speak confidentially about concerns for a family member, partner, friend or colleague."
              href="/contact"
              linkLabel="Get guidance"
              delay={100}
            />
            <PathwayCard
              title="I am a professional or organisation"
              description="Explore digital recovery tools, treatment pathways and partnership options."
              href="/contact"
              linkLabel="Work with us"
              delay={200}
            />
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-start">
            <div className="lg:col-span-4 lg:sticky lg:top-32">
              <SectionHeader
                label="Our services"
                heading="Comprehensive care, quietly delivered"
                description="We offer discreet, recovery-informed support tailored to the needs of each individual, family or organisation."
              />
            </div>
            <div className="lg:col-span-7 lg:col-start-6 flex flex-col gap-12">
              <ServicePreview
                title="Treatment Placement"
                description="Confidential guidance in finding suitable detox, residential rehab or ongoing recovery support in the UK or internationally."
                href="/treatment-placement"
              />
              <ServicePreview
                title="Online Recovery Programme"
                description="Structured group support, one-to-one sessions and relapse prevention planning for people who need support without entering residential treatment."
                href="/online-programme"
              />
              <ServicePreview
                title="Insight OS"
                description="A dedicated digital recovery platform for check-ins, journaling, triggers, recovery planning and ongoing support."
                href="/insight-os"
              />
              <ServicePreview
                title="Family and Intervention Guidance"
                description="Support for families who are worried, overwhelmed or unsure how to approach the next conversation."
                href="/what-we-offer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Why IRN (dark trust section) ── */}
      <section className="py-24 lg:py-32 bg-primary text-primary-foreground relative overflow-hidden">
        {/* Subtle linework */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="trust-grid" width="56" height="56" patternUnits="userSpaceOnUse">
                <path d="M 56 0 L 0 0 0 56" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#trust-grid)" />
          </svg>
        </div>

        <div className="container mx-auto px-6 md:px-12 relative z-10">
          {/* Section header */}
          <div className="max-w-2xl mb-16">
            <span className="text-xs font-semibold tracking-widest uppercase text-accent/80 block mb-4">
              Why Insight Recovery Network
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-primary-foreground leading-tight mb-5">
              Private support with clinical depth.
            </h2>
            <p className="text-primary-foreground/65 leading-relaxed font-light max-w-xl">
              We help people and families make sense of complex situations with calm, confidential and practical guidance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
            <div className="flex flex-col gap-4" data-testid="trust-point-confidential">
              <Shield className="w-6 h-6 text-accent" strokeWidth={1.5} />
              <div className="w-8 h-px bg-accent/40" />
              <h3 className="text-lg font-serif text-primary-foreground">Confidential guidance</h3>
              <p className="text-primary-foreground/60 font-light text-sm leading-relaxed">
                Private conversations for individuals and families navigating sensitive challenges.
              </p>
            </div>
            <div className="flex flex-col gap-4" data-testid="trust-point-approach">
              <BookOpen className="w-6 h-6 text-accent" strokeWidth={1.5} />
              <div className="w-8 h-px bg-accent/40" />
              <h3 className="text-lg font-serif text-primary-foreground">Recovery-informed approach</h3>
              <p className="text-primary-foreground/60 font-light text-sm leading-relaxed">
                Support shaped by addiction, mental health and relapse prevention experience.
              </p>
            </div>
            <div className="flex flex-col gap-4" data-testid="trust-point-pathways">
              <Map className="w-6 h-6 text-accent" strokeWidth={1.5} />
              <div className="w-8 h-px bg-accent/40" />
              <h3 className="text-lg font-serif text-primary-foreground">Treatment pathway knowledge</h3>
              <p className="text-primary-foreground/60 font-light text-sm leading-relaxed">
                Guidance across detox, residential rehab, online support and continuing care.
              </p>
            </div>
            <div className="flex flex-col gap-4" data-testid="trust-point-digital">
              <Monitor className="w-6 h-6 text-accent" strokeWidth={1.5} />
              <div className="w-8 h-px bg-accent/40" />
              <h3 className="text-lg font-serif text-primary-foreground">Digital continuity</h3>
              <p className="text-primary-foreground/60 font-light text-sm leading-relaxed">
                Insight OS supports daily structure, reflection and long-term recovery management.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-6 md:px-12">
          <SectionHeader
            align="center"
            label="The process"
            heading="How it works"
            className="mb-16"
          />

          <div className="relative max-w-4xl mx-auto">
            {/* Connecting line — desktop only */}
            <div className="hidden md:block absolute top-7 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px bg-border/50" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12">
              {[
                {
                  n: "1",
                  title: "Tell us what is happening",
                  body: "Briefly share what you or someone close to you is facing. There is no need to have everything worked out.",
                },
                {
                  n: "2",
                  title: "Clarify the right level of support",
                  body: "We help you think through whether online support, treatment placement, family guidance or digital recovery tools are most appropriate.",
                },
                {
                  n: "3",
                  title: "Take the next step confidentially",
                  body: "We agree a practical next step and support you in moving forward with clarity.",
                },
              ].map(({ n, title, body }) => (
                <div key={n} className="flex flex-col items-center text-center group">
                  <div
                    className="w-14 h-14 flex items-center justify-center border border-accent/60 text-primary font-serif text-lg mb-6 relative z-10 transition-colors duration-300 group-hover:bg-accent/10 bg-background"
                    data-testid={`step-number-${n}`}
                  >
                    {n}
                  </div>
                  <h3 className="text-lg font-serif text-primary mb-3 leading-snug px-2">{title}</h3>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed px-4 max-w-[260px]">
                    {body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <CTASection
        heading="A private conversation can be the first step."
        description="You do not need to have everything worked out before making contact. A confidential conversation can help clarify what support may be appropriate."
        primaryCta={{ label: "Speak Confidentially", href: "/contact" }}
      />
    </Layout>
  );
}

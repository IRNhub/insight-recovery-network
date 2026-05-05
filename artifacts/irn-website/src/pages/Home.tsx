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
  "Clinically informed",
  "International options",
  "Digital recovery tools",
];

export default function Home() {
  return (
    <Layout>
      <SEO
        title="Private Addiction & Mental Health Support"
        description="Private addiction and mental health support for individuals, families and professionals. Expert treatment placement, online recovery programmes, digital tools."
        canonical="/"
      />

      {/* ── Hero — refined editorial layered composition ── */}
      <section className="relative overflow-hidden bg-background md:min-h-[800px] lg:min-h-[840px]">

        {/* Treatment Placement — wide cinematic image starting further left so there's no bare gap */}
        <div className="absolute inset-y-0 right-0 w-[76%] hidden md:block">
          <img
            src={treatmentImg}
            alt="A calm, private residential treatment setting surrounded by landscaped gardens"
            className="w-full h-full object-cover object-center"
          />
          {/* Left-edge gradient — image dissolves into ivory so text panel sits naturally on it */}
          <div className="absolute inset-y-0 left-0 w-[38%] bg-gradient-to-r from-background to-transparent" />
          <div className="absolute inset-y-0 left-[30%] w-[16%] bg-gradient-to-r from-background/30 to-transparent" />
        </div>

        {/* Soft champagne ambient glow behind the panel */}
        <div
          className="absolute pointer-events-none hidden md:block"
          style={{
            top: "8%", left: "0%",
            width: "480px", height: "440px",
            background: "radial-gradient(ellipse at 30% 40%, rgba(201,169,110,0.10) 0%, transparent 72%)",
          }}
        />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 md:px-12 pt-28 md:pt-32 lg:pt-36 pb-16 md:pb-20 lg:pb-24">

          {/* ── Editorial panel — main copy + supporting services as one unified block ── */}
          <div
            className="max-w-[448px]"
            style={{
              background: "rgba(246,244,240,0.96)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              boxShadow: "0 16px 48px -8px rgba(22,43,59,0.13), 0 0 0 1px rgba(201,169,110,0.20)",
            }}
          >

            {/* Main copy block */}
            <div className="px-8 pt-8 pb-7 md:px-9 md:pt-9 md:pb-7"
              style={{ borderBottom: "1px solid rgba(201,169,110,0.16)" }}
            >
              <span
                className="text-[9.5px] font-semibold tracking-[0.18em] uppercase text-accent/70 font-sans block mb-4"
                data-testid="text-hero-eyebrow"
              >
                Confidential addiction and mental health support
              </span>

              <h1
                className="font-serif text-primary leading-[1.07] tracking-tight mb-4"
                style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)" }}
                data-testid="text-hero-heading"
              >
                Private addiction and mental health support, built around the person.
              </h1>

              <p
                className="text-[14.5px] text-muted-foreground leading-relaxed font-light mb-6"
                data-testid="text-hero-description"
              >
                Confidential treatment placement, structured online recovery and digital tools — for individuals, families and professionals.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <Link href="/contact" data-testid="button-hero-primary">
                  <Button className="rounded-none h-11 px-6 text-sm w-full sm:w-auto">
                    Speak Confidentially
                  </Button>
                </Link>
                <Link href="/what-we-offer" data-testid="button-hero-secondary">
                  <Button variant="outline" className="rounded-none h-11 px-6 text-sm border-primary/20 hover:bg-primary/5 w-full sm:w-auto">
                    Explore Support Options
                  </Button>
                </Link>
              </div>

              {/* Trust row — inline dot-separated */}
              <div className="flex flex-wrap items-center gap-x-0 gap-y-1">
                {trustPoints.map((item, i) => (
                  <Fragment key={item}>
                    {i > 0 && (
                      <span className="mx-2 text-border/50 text-xs select-none">·</span>
                    )}
                    <span className="text-[10.5px] text-muted-foreground/65 tracking-wide">{item}</span>
                  </Fragment>
                ))}
              </div>
            </div>

            {/* ── Supporting services strip — attached below, same panel ── */}
            <div className="px-8 pt-5 pb-6 md:px-9 md:pt-5 md:pb-7">
              <p className="text-[9px] font-semibold tracking-[0.20em] uppercase text-muted-foreground/45 mb-4">
                Also supporting recovery through
              </p>
              <div className="grid grid-cols-2 gap-x-5 gap-y-3">

                {/* Online Recovery Programme */}
                <div className="flex gap-2.5 items-start">
                  <div
                    className="flex-shrink-0 w-8 h-8 overflow-hidden"
                    style={{ border: "1px solid rgba(22,43,59,0.10)" }}
                  >
                    <img
                      src={onlineProgrammeImg}
                      alt=""
                      aria-hidden="true"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-serif text-primary text-[11px] leading-tight mb-0.5">
                      Online Recovery Programme
                    </p>
                    <p className="text-muted-foreground/60 text-[10px] leading-snug font-light">
                      Structured group and one-to-one support.
                    </p>
                  </div>
                </div>

                {/* Digital Recovery Tools */}
                <div className="flex gap-2.5 items-start">
                  <div
                    className="flex-shrink-0 w-8 h-8 overflow-hidden"
                    style={{ border: "1px solid rgba(22,43,59,0.10)" }}
                  >
                    <img
                      src={digitalToolsImg}
                      alt=""
                      aria-hidden="true"
                      className="w-full h-full object-cover object-[center_20%]"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-serif text-primary text-[11px] leading-tight mb-0.5">
                      Digital Recovery Tools
                    </p>
                    <p className="text-muted-foreground/60 text-[10px] leading-snug font-light">
                      Insight OS for daily structure and reflection.
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Mobile-only image stack — below text panel */}
          <div className="mt-5 md:hidden flex flex-col gap-2.5">
            <div className="overflow-hidden">
              <img
                src={treatmentImg}
                alt="Private residential treatment setting"
                className="w-full h-52 object-cover"
              />
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="overflow-hidden">
                <img src={onlineProgrammeImg} alt="Online recovery session" className="w-full h-28 object-cover" />
              </div>
              <div className="overflow-hidden">
                <img src={digitalToolsImg} alt="Insight OS app" className="w-full h-28 object-cover object-[center_20%]" />
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

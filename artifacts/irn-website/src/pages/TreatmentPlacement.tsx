import { SEO } from "@/components/SEO";
import { Layout } from "@/components/layout/Layout";
import { CTASection } from "@/components/ui/cta-section";
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

const locations = ["United Kingdom", "South Africa", "Thailand", "Spain", "Sri Lanka"];

export default function TreatmentPlacement() {
  return (
    <Layout>
      <SEO
        title="Private Rehab Placement — UK &amp; International"
        description="Independent guidance on private rehab placement and detox across the UK and internationally. Insight Recovery Network assess your needs, identify the right facility, and manage the transition — confidentially and without pressure."
        canonical="/treatment-placement"
      />

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
                Navigating residential care with certainty.
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
                    Request Guidance
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

      {/* ── Not all facilities section ── */}
      <section className="py-14 md:py-24" style={{ background: "rgba(246,244,240,0.55)" }}>
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
                {locations.map((loc) => (
                  <span
                    key={loc}
                    className="text-[12px] font-light px-3.5 py-1.5 rounded-full border"
                    style={{
                      color: "rgba(22,43,59,0.75)",
                      borderColor: "rgba(201,169,110,0.35)",
                      background: "rgba(201,169,110,0.07)",
                    }}
                  >
                    {loc}
                  </span>
                ))}
              </div>

              <div className="w-full h-px mb-6" style={{ background: "rgba(22,43,59,0.08)" }} />

              <p className="text-[11.5px] text-muted-foreground/60 font-light leading-relaxed italic">
                Placement recommendations are made solely on clinical appropriateness and individual requirements. We offer careful, measured guidance without guarantees of specific outcomes.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── How placement guidance works ── */}
      <section className="py-14 md:py-24 bg-background">
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
            {/* Horizontal connector — desktop only */}
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
      <section className="py-14 md:py-24" style={{ background: "rgba(246,244,240,0.55)" }}>
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

      {/* ── CTA ── */}
      <CTASection
        heading="Need help choosing the right treatment setting?"
        description="Speak confidentially with our clinical team. We will help you understand the safest and most appropriate options without pressure or obligation."
        primaryCta={{ label: "Request Placement Guidance", href: "/contact" }}
      />
    </Layout>
  );
}

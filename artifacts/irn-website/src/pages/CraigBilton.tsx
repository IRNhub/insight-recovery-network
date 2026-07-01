import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";

const SITE_URL = "https://www.insightrecoverynetwork.com";
const HERO_IMAGE = "/craig-bilton-hero.webp";

const experiencePoints = [
  "More than 20 years' experience across addiction treatment, mental health support, residential rehabilitation, programme leadership, intervention work, and international treatment placement.",
  "Founder and Clinical Director of Insight Recovery Network, supporting individuals and families across the UK with treatment decisions, structured online recovery, relapse prevention, and aftercare.",
  "A recovery philosophy built around the idea that addiction meets legitimate needs in illegitimate ways, so recovery must address the underlying need rather than only the substance or behaviour.",
  "A clinically informed, non-12-step approach that respects the people helped by 12-step fellowships while recognising that recovery support must be flexible, individualised, and grounded in what we now understand about addiction.",
];

const focusAreas = [
  "Treatment placement and rehab suitability",
  "Online recovery programme design",
  "Family guidance and intervention planning",
  "Relapse prevention and aftercare structure",
  "Complex addiction and mental health presentations",
  "Digital recovery tools through Insight OS",
];

export default function CraigBilton() {
  return (
    <Layout>
      <SEO
        title="Craig Bilton"
        fullTitle="Craig Bilton | Founder of Insight Recovery Network"
        description="Craig Bilton is the Founder and Clinical Director of Insight Recovery Network, supporting individuals and families with addiction recovery, treatment placement, and structured online support."
        canonical="/craig-bilton"
        ogImage={`${SITE_URL}${HERO_IMAGE}`}
      />

      <section className="relative overflow-hidden bg-background py-12 md:py-16 lg:py-20 border-b border-border/40">
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,#162B3B,#162B3B 1px,transparent 1px,transparent 72px),repeating-linear-gradient(90deg,#162B3B,#162B3B 1px,transparent 1px,transparent 72px)",
          }}
        />
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="max-w-4xl">
            <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-accent/80 mb-5">
              Founder & Clinical Director
            </p>
            <h1 className="font-serif text-4xl md:text-6xl text-primary leading-tight mb-6">
              Craig Bilton
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed max-w-3xl">
              Craig Bilton founded Insight Recovery Network to provide clear, practical, confidential guidance for individuals and families navigating addiction, treatment decisions, relapse risk, and long-term recovery structure.
            </p>
          </div>

          <div
            className="relative mt-9 md:mt-12 overflow-hidden rounded-xl bg-[#07182f]"
            style={{
              aspectRatio: "1693 / 929",
              boxShadow: "0 18px 50px -16px rgba(22,43,59,0.28), 0 0 0 1px rgba(22,43,59,0.08)",
            }}
          >
            <img
              src={HERO_IMAGE}
              alt="Craig Bilton, Founder and Clinical Director of Insight Recovery Network"
              className="block h-full w-full object-cover object-center"
              width={1693}
              height={929}
              sizes="(min-width: 1280px) 1152px, (min-width: 768px) calc(100vw - 6rem), calc(100vw - 3rem)"
              fetchPriority="high"
              loading="eager"
              decoding="async"
            />
          </div>
        </div>
      </section>

      <section className="py-12 md:py-18">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-5">
              <h2 className="font-serif text-3xl md:text-4xl text-primary leading-tight mb-5">
                Professional experience with a practical recovery lens.
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Craig's work sits at the intersection of clinical best practice, lived recovery understanding, family systems, and real-world treatment navigation.
              </p>
            </div>
            <div className="lg:col-span-7 space-y-5">
              {experiencePoints.map((point) => (
                <div key={point} className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" strokeWidth={1.7} />
                  <p className="text-muted-foreground leading-relaxed">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-secondary/20 py-12 md:py-16">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-3xl mb-8">
            <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-accent/80 mb-4">
              Areas of focus
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-primary leading-tight">
              Support that is structured around fit, risk, and the person behind the addiction.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {focusAreas.map((area) => (
              <div key={area} className="border border-border/60 bg-background p-5">
                <p className="text-primary font-medium leading-snug">{area}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-18">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-3xl">
            <h2 className="font-serif text-3xl md:text-4xl text-primary leading-tight mb-5">
              A different way to think about recovery.
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-5">
              Insight Recovery Network does not treat addiction as simply a problem of willpower or moral failure. The work begins with understanding what the addiction has been doing for the person, what need it has been meeting, and how that need can be met in a way that does not keep costing them their life, relationships, work, or health.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              That means the emphasis is not only on stopping the substance or behaviour. It is on building enough structure, insight, support, and accountability for recovery to become a lived pattern rather than a temporary promise.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/contact">
                <Button size="lg" className="rounded-none h-12 px-8 w-full sm:w-auto">
                  Contact Craig
                  <ArrowRight className="w-4 h-4 ml-2" strokeWidth={1.8} />
                </Button>
              </Link>
              <Link href="/online-programme">
                <Button variant="outline" size="lg" className="rounded-none h-12 px-8 w-full sm:w-auto">
                  View online programme
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

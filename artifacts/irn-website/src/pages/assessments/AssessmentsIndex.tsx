import { Link } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { ogImageUrl } from "@/config/og-pages";
import { ArrowRight, Clock, Shield, Lock } from "lucide-react";
import { CTASection } from "@/components/ui/cta-section";
const assessmentsHeroImg = "/assessments-hero-brain.png";

const assessments = [
  {
    id: "alcohol-detox",
    title: "Alcohol & Detox Suitability Assessment",
    description:
      "Explore whether alcohol may be affecting your wellbeing and whether stopping suddenly could carry medical risk. Covers use patterns, withdrawal history, and detox safety.",
    href: "/assessments/alcohol-detox",
    duration: "10–15 minutes",
    forWhom: "For individuals drinking heavily who are considering stopping",
    featured: true,
  },
  {
    id: "alcohol-use",
    title: "Alcohol Use Assessment",
    description:
      "Reflect on your current relationship with alcohol and understand whether it may be affecting your health, relationships, or daily life.",
    href: "/assessments/alcohol-use",
    duration: "7–10 minutes",
    forWhom: "For individuals questioning their drinking",
    featured: false,
  },
  {
    id: "drug-use",
    title: "Drug Use & Substance Assessment",
    description:
      "Explore your relationship with substances and identify whether further professional support or treatment may be appropriate.",
    href: "/assessments/drug-use",
    duration: "7–10 minutes",
    forWhom: "For individuals concerned about substance use",
    featured: false,
  },
  {
    id: "detox",
    title: "Detox Suitability Assessment",
    description:
      "If you are considering stopping or reducing alcohol or substance use, this assessment highlights factors that may require professional or medical review. It cannot determine whether detox is medically safe.",
    href: "/assessments/detox",
    duration: "8–12 minutes",
    forWhom: "For those considering stopping or reducing use",
    featured: false,
  },
  {
    id: "anxiety",
    title: "Anxiety Self-Assessment",
    description:
      "Reflect on how anxiety may be affecting your thoughts, physical wellbeing, and daily life.",
    href: "/assessments/anxiety",
    duration: "6–8 minutes",
    forWhom: "For individuals experiencing worry or anxiety",
    featured: false,
  },
  {
    id: "depression",
    title: "Depression Self-Assessment",
    description:
      "Reflect on how low mood or depression may be affecting your energy, motivation, and sense of wellbeing.",
    href: "/assessments/depression",
    duration: "6–8 minutes",
    forWhom: "For individuals experiencing low mood or depression",
    featured: false,
  },
  {
    id: "adhd",
    title: "ADHD & Impulsivity Self-Reflection",
    description:
      "Explore patterns of attention, impulsivity, and restlessness that may be affecting your work, relationships, or daily life.",
    href: "/assessments/adhd-impulsivity",
    duration: "7–10 minutes",
    forWhom: "For individuals exploring attention and impulsivity patterns",
    featured: false,
  },
];

export default function AssessmentsIndex() {
  return (
    <Layout>
      <SEO
        title="Free Confidential Addiction and Mental Health Self-Assessments"
        description="Private self-assessments for alcohol use, drug use, detox suitability, anxiety, depression, and ADHD, with server-calculated, non-diagnostic results."
        canonical="/assessments"
        ogImage={ogImageUrl("og-assessments.png")}
      />

      {/* ── Hero, two-column layout ── */}
      <section
        style={{
          background: "linear-gradient(160deg, #F2EDE3 0%, #F6F4EF 50%, #EEE9DF 100%)",
          borderBottom: "1px solid rgba(201,169,110,0.2)",
        }}
      >
        <div className="container mx-auto px-6 md:px-12 py-10 md:py-14">
          <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-12">

            {/* Left: copy + trust indicators */}
            <div className="lg:w-[52%] flex flex-col">
              <div className="w-7 h-px mb-5" style={{ background: "#C9A96E" }} />
              <p className="text-[10px] font-semibold tracking-[0.20em] uppercase text-accent/70 font-sans mb-3">
                Private Self-Assessments
              </p>
              <h1 className="font-serif text-primary leading-tight mb-4" style={{ fontSize: "clamp(1.9rem, 3.5vw, 2.75rem)" }}>
                Free Confidential Addiction and Mental Health Assessments
              </h1>
              <p className="text-[15px] text-muted-foreground font-light leading-relaxed mb-3 max-w-xl">
                Clinically informed self-reflection tools to help you understand your current situation, whether that involves alcohol, substances, mental health, or patterns of attention and impulsivity.
              </p>
              <p className="text-xs text-muted-foreground/60 font-light leading-relaxed max-w-xl mb-6">
                These assessments are not diagnostic tools. They are designed to help you reflect and identify whether professional support may be helpful.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 text-sm text-muted-foreground font-light">
                <span className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                  Handled securely
                </span>
                <span className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                  Durable result page
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                  Most take under 15 minutes
                </span>
              </div>
              <Link href="/assessments/alcohol-use" className="mt-6 inline-flex w-full sm:w-fit items-center justify-center gap-2 bg-primary px-6 min-h-12 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                Start the free confidential assessment
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Right: hero image */}
            <div className="lg:flex-1">
              <div
                className="relative rounded-2xl overflow-hidden"
                style={{
                  boxShadow: "0 12px 40px -8px rgba(22,43,59,0.20), 0 0 0 1px rgba(22,43,59,0.06)",
                  aspectRatio: "16/11",
                }}
              >
                <img
                  src={assessmentsHeroImg}
                  alt="Illustration of a connected brain representing confidential mental health self-assessments"
                  className="w-full h-full object-cover"
                  style={{ objectPosition: "center 40%" }}
                  fetchPriority="high"
                  loading="eager"
                />
                <div
                  className="absolute bottom-4 left-4 px-3.5 py-2.5 rounded-lg flex items-center gap-2.5"
                  style={{ background: "rgba(22,43,59,0.84)", backdropFilter: "blur(8px)" }}
                >
                  <Shield className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                  <div>
                    <p className="font-serif text-white text-[11px] leading-tight">Confidential self-assessment</p>
                    <p className="text-white/50 text-[10px] font-light">Completely private · No account required</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Assessment grid ── */}
      <section className="py-10 md:py-14">
        <div className="container mx-auto px-6 md:px-12 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {assessments.map((assessment) => (
              <div
                key={assessment.id}
                className="flex flex-col bg-white border hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300"
                style={{
                  borderWidth: assessment.featured ? "2px" : "1px",
                  borderColor: assessment.featured
                    ? "rgba(201,169,110,0.55)"
                    : "rgba(22,43,59,0.12)",
                  boxShadow: assessment.featured
                    ? "0 2px 12px rgba(22,43,59,0.09)"
                    : "0 1px 4px rgba(22,43,59,0.05)",
                }}
              >
                <div className="p-6 flex flex-col flex-1">
                  {/* Badge row */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-5 h-px"
                      style={{ background: assessment.featured ? "#C9A96E" : "rgba(201,169,110,0.5)" }}
                    />
                    {assessment.featured && (
                      <span
                        className="text-[9px] font-semibold tracking-widest uppercase px-2.5 py-1"
                        style={{
                          background: "rgba(201,169,110,0.14)",
                          color: "rgba(201,169,110,0.95)",
                        }}
                      >
                        Featured
                      </span>
                    )}
                  </div>

                  <p className="text-[10px] font-semibold tracking-widest uppercase text-accent font-sans mb-2">
                    Self-Assessment
                  </p>
                  <h2 className="font-serif text-primary text-[17px] leading-snug mb-3">
                    {assessment.title}
                  </h2>
                  <p className="text-muted-foreground text-sm font-light leading-relaxed mb-3 flex-1">
                    {assessment.description}
                  </p>
                  <p className="text-xs text-muted-foreground/55 font-light italic mb-3">
                    {assessment.forWhom}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-light mb-5">
                    <Clock className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                    {assessment.duration}
                  </div>

                  <Link href={assessment.href}>
                    <button
                      className="inline-flex items-center gap-3 px-5 h-11 text-sm font-medium transition-colors w-full justify-center"
                      style={{
                        background: assessment.featured ? "#162B3B" : "rgba(22,43,59,0.88)",
                        color: "#F6F4F0",
                      }}
                    >
                      Begin Assessment
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Disclaimer ── */}
      <section className="pb-10 md:pb-12">
        <div className="container mx-auto px-6 md:px-12 max-w-5xl">
          <div className="border-t pt-6" style={{ borderColor: "rgba(201,169,110,0.25)" }}>
            <p className="text-xs text-muted-foreground/60 font-light leading-relaxed max-w-3xl">
              <strong className="font-medium text-foreground/50">Please note:</strong>{" "}
              These assessments are not diagnostic tools and do not replace medical, psychiatric, or clinical assessment by a qualified professional. They are designed to help you reflect on your current situation and identify whether professional support may be helpful. If you are in immediate danger or experiencing a medical emergency, call 999 or go to your nearest A&amp;E.
            </p>
          </div>
        </div>
      </section>

      <CTASection
        heading="Not sure which assessment to choose?"
        description="Tell us what is happening and we can help you identify a suitable, confidential starting point without pressure."
        primaryCta={{ label: "Speak confidentially", href: "/get-help" }}
        secondaryCta={{ label: "Start the alcohol use assessment", href: "/assessments/alcohol-use" }}
        primaryEvent="book_consultation_click"
        sourcePage="assessments"
        serviceInterest="free-assessment"
        ctaLocation="final_cta"
      />
    </Layout>
  );
}

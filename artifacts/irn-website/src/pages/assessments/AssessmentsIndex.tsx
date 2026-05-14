import { Link } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { ArrowRight, Clock, Shield, Lock } from "lucide-react";

const assessments = [
  {
    id: "alcohol-use",
    title: "Alcohol Use Assessment",
    description:
      "Reflect on your current relationship with alcohol and understand whether it may be affecting your health, relationships, or daily life.",
    href: "/assessments/alcohol-use",
    duration: "7–10 minutes",
    forWhom: "For individuals questioning their drinking",
    buttonLabel: "Start Alcohol Assessment",
  },
  {
    id: "drug-use",
    title: "Drug Use & Substance Assessment",
    description:
      "Explore your relationship with substances and identify whether further professional support or treatment may be appropriate.",
    href: "/assessments/drug-use",
    duration: "7–10 minutes",
    forWhom: "For individuals concerned about substance use",
    buttonLabel: "Start Drug Use Assessment",
  },
  {
    id: "detox",
    title: "Detox Suitability Assessment",
    description:
      "If you are considering stopping or reducing alcohol or substance use, this assessment helps identify the safest pathway — including whether medical supervision may be needed.",
    href: "/assessments/detox",
    duration: "8–12 minutes",
    forWhom: "For those considering stopping or reducing use",
    buttonLabel: "Start Detox Assessment",
  },
  {
    id: "anxiety",
    title: "Anxiety Self-Assessment",
    description:
      "Reflect on how anxiety may be affecting your thoughts, physical wellbeing, and daily life, and explore whether professional support could help.",
    href: "/assessments/anxiety",
    duration: "6–8 minutes",
    forWhom: "For individuals experiencing worry or anxiety",
    buttonLabel: "Start Anxiety Assessment",
  },
  {
    id: "depression",
    title: "Depression Self-Assessment",
    description:
      "Reflect on how low mood or depression may be affecting your energy, motivation, and sense of wellbeing.",
    href: "/assessments/depression",
    duration: "6–8 minutes",
    forWhom: "For individuals experiencing low mood or depression",
    buttonLabel: "Start Depression Assessment",
  },
  {
    id: "adhd",
    title: "ADHD & Impulsivity Self-Reflection",
    description:
      "Explore patterns of attention, impulsivity, and restlessness that may be affecting your work, relationships, or daily life.",
    href: "/assessments/adhd",
    duration: "7–10 minutes",
    forWhom: "For individuals exploring attention and impulsivity patterns",
    buttonLabel: "Start ADHD Assessment",
  },
  {
    id: "alcohol-detox",
    title: "Alcohol & Detox Suitability Assessment",
    description:
      "Explore whether alcohol may be affecting your wellbeing and whether stopping suddenly could carry medical risk. Covers use patterns, withdrawal history, and detox safety.",
    href: "/assessment/alcohol-detox",
    duration: "10–15 minutes",
    forWhom: "For individuals drinking heavily who are considering stopping",
    buttonLabel: "Start Assessment",
  },
];

export default function AssessmentsIndex() {
  return (
    <Layout>
      <SEO
        title="Free Confidential Self-Assessments — Insight Recovery Network"
        description="Free confidential self-assessments for alcohol use, drug use, detox suitability, anxiety, depression, and ADHD. Clinically informed, non-diagnostic, results sent to your email."
        canonical="/assessments"
      />

      {/* Hero */}
      <section
        className="py-20 md:py-28"
        style={{
          background:
            "linear-gradient(160deg, #F2EDE3 0%, #F6F4EF 50%, #EEE9DF 100%)",
          borderBottom: "1px solid rgba(201,169,110,0.2)",
        }}
      >
        <div className="container mx-auto px-6 md:px-12 max-w-3xl">
          <div className="w-8 h-px mb-8" style={{ background: "#C9A96E" }} />
          <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-4 font-sans">
            Clinical Self-Assessments
          </p>
          <h1 className="font-serif text-primary text-4xl md:text-5xl leading-tight mb-6">
            Free Confidential Assessments
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed max-w-2xl mb-4">
            Clinically informed self-reflection tools to help you understand your current situation — whether that involves alcohol, substances, mental health, or patterns of attention and impulsivity.
          </p>
          <p className="text-sm text-muted-foreground/70 font-light leading-relaxed max-w-2xl mb-8">
            These assessments are not diagnostic tools. They are designed to help you reflect and identify whether professional support may be helpful.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm text-muted-foreground font-light">
            <span className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-accent flex-shrink-0" />
              Completely confidential
            </span>
            <span className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-accent flex-shrink-0" />
              Results sent to your email
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-accent flex-shrink-0" />
              Most take under 15 minutes
            </span>
          </div>
        </div>
      </section>

      {/* Assessment grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6 md:px-12 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assessments.map((assessment) => (
              <div
                key={assessment.id}
                className="flex flex-col bg-white border border-border/50 hover:border-accent/50 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300"
                style={{ boxShadow: "0 1px 4px rgba(22,43,59,0.07)" }}
              >
                <div className="p-7 flex flex-col flex-1">
                  <div className="w-6 h-px mb-5" style={{ background: "#C9A96E" }} />
                  <p className="text-xs font-semibold tracking-widest uppercase text-accent font-sans mb-3">
                    Self-Assessment
                  </p>
                  <h2 className="font-serif text-primary text-xl leading-snug mb-3">
                    {assessment.title}
                  </h2>
                  <p className="text-muted-foreground text-sm font-light leading-relaxed mb-4 flex-1">
                    {assessment.description}
                  </p>
                  <p className="text-xs text-muted-foreground/60 font-light italic mb-4">
                    {assessment.forWhom}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-light mb-6">
                    <Clock className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                    {assessment.duration}
                  </div>
                  <Link href={assessment.href}>
                    <button className="inline-flex items-center gap-3 px-6 h-12 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors w-full justify-center">
                      {assessment.buttonLabel}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="pb-16 md:pb-20">
        <div className="container mx-auto px-6 md:px-12 max-w-3xl">
          <div
            className="border-t pt-8"
            style={{ borderColor: "rgba(201,169,110,0.25)" }}
          >
            <p className="text-xs text-muted-foreground font-light leading-relaxed">
              <strong className="font-medium text-foreground/70">Please note:</strong>{" "}
              These assessments are not diagnostic tools and do not replace medical, psychiatric, or clinical assessment by a qualified professional. They are designed to help you reflect on your current situation and identify whether professional support may be helpful. If you are in immediate danger or experiencing a medical emergency, call 999 or go to your nearest A&amp;E.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}

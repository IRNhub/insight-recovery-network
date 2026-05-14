import { Link } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { ArrowRight, Clock, Shield, Lock } from "lucide-react";

const activeAssessments = [
  {
    id: "alcohol-detox",
    title: "Alcohol & Detox Suitability Assessment",
    description:
      "Explore whether alcohol may be affecting your wellbeing, control, relationships, daily life, and whether stopping suddenly could carry medical risk.",
    href: "/assessment/alcohol-detox",
    duration: "10–15 minutes",
    buttonLabel: "Start Alcohol Assessment",
  },
];

const comingSoonAssessments = [
  {
    title: "Drug Use & Treatment Need Assessment",
    description:
      "Understand your current relationship with substances and whether structured support or treatment may be appropriate.",
  },
  {
    title: "Family Concern & Intervention Suitability Assessment",
    description:
      "For families concerned about a loved one. Explore whether intervention support or family guidance may be helpful.",
  },
  {
    title: "Recovery Readiness Assessment",
    description:
      "Reflect on where you are in the recovery process and what level of ongoing support may be most beneficial.",
  },
  {
    title: "Anxiety & Depression Impact Assessment",
    description:
      "Explore how anxiety or low mood may be affecting your daily functioning and whether professional support could help.",
  },
  {
    title: "ADHD & Impulsivity Screening",
    description:
      "A reflective screen for patterns of attention, impulsivity and hyperactivity that may benefit from further assessment.",
  },
];

export default function AssessmentsIndex() {
  return (
    <Layout>
      <SEO
        title="Free Confidential Assessments"
        description="Free confidential assessments to help you understand whether alcohol, drug use, mental health, detox risk, or recovery readiness may need further support."
        canonical="/assessments"
      />

      {/* Hero */}
      <section
        className="py-20 md:py-28"
        style={{
          background: "linear-gradient(160deg, #F2EDE3 0%, #F6F4EF 50%, #EEE9DF 100%)",
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
          <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed max-w-2xl">
            Free confidential assessments to help you understand whether alcohol, drug use, mental health, detox risk, or recovery readiness may need further support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mt-8 text-sm text-muted-foreground font-light">
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
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-6 md:px-12 max-w-5xl">

          {/* Active assessments */}
          <div className="mb-12">
            <h2 className="font-serif text-primary text-2xl mb-8">Available Now</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeAssessments.map((assessment) => (
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
                    <h3 className="font-serif text-primary text-xl leading-snug mb-3">
                      {assessment.title}
                    </h3>
                    <p className="text-muted-foreground text-sm font-light leading-relaxed mb-6 flex-1">
                      {assessment.description}
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

          {/* Coming soon assessments */}
          <div>
            <h2 className="font-serif text-primary text-2xl mb-8">Coming Soon</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {comingSoonAssessments.map((assessment) => (
                <div
                  key={assessment.title}
                  className="flex flex-col bg-white border border-border/30 opacity-70"
                  style={{ boxShadow: "0 1px 3px rgba(22,43,59,0.04)" }}
                >
                  <div className="p-6 flex flex-col flex-1">
                    <div className="w-5 h-px mb-4" style={{ background: "rgba(201,169,110,0.45)" }} />
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground font-sans">
                        Self-Assessment
                      </p>
                      <span
                        className="text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 font-sans"
                        style={{
                          background: "rgba(22,43,59,0.06)",
                          color: "rgba(22,43,59,0.50)",
                          border: "1px solid rgba(22,43,59,0.10)",
                        }}
                      >
                        Coming soon
                      </span>
                    </div>
                    <h3 className="font-serif text-primary text-base leading-snug mb-3">
                      {assessment.title}
                    </h3>
                    <p className="text-muted-foreground text-sm font-light leading-relaxed flex-1">
                      {assessment.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
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
              <strong className="font-medium text-foreground/70">Please note:</strong> These assessments are not diagnostic tools and do not replace medical, psychiatric, or clinical assessment. They are designed to help you reflect on your current situation and identify whether professional support may be helpful. If you are in immediate danger, call 999 or go to your nearest A&amp;E.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}

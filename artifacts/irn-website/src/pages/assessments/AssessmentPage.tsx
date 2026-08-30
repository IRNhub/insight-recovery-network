import { useEffect, useRef, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { AssessmentEngine } from "@/components/assessment/AssessmentEngine";
import { AssessmentResult } from "@/components/assessment/AssessmentResult";
import type { AssessmentAnswers, AuthoritativeAssessmentResult, PublicAssessmentConfig } from "@/types/assessment";
import { Shield, Clock, Lock } from "lucide-react";

interface AssessmentPageProps {
  assessmentKey: string;
  title: string;
  subtitle: string;
  estimatedMinutes: number;
  seoDescription: string;
  canonical: string;
}

type Phase = "intro" | "assessment" | "result";

const API_BASE = "/api";

export default function AssessmentPage({
  assessmentKey,
  title,
  subtitle,
  estimatedMinutes,
  seoDescription,
  canonical,
}: AssessmentPageProps) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<AuthoritativeAssessmentResult | null>(null);
  const [config, setConfig] = useState<PublicAssessmentConfig | null>(null);
  const [definitionError, setDefinitionError] = useState(false);
  const submissionKey = useRef(crypto.randomUUID());

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${API_BASE}/assessments/${assessmentKey}/definition`, {
      signal: controller.signal,
      cache: "no-store",
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Definition unavailable");
        const definition = await response.json() as Omit<
          PublicAssessmentConfig,
          "id" | "definitionVersion"
        > & { key: string; version: number };
        if (definition.key !== assessmentKey || !Number.isInteger(definition.version)) {
          throw new Error("Definition mismatch");
        }
        setConfig({
          id: definition.key,
          definitionVersion: definition.version,
          definitionHash: definition.definitionHash,
          title: definition.title,
          subtitle: definition.subtitle,
          estimatedMinutes: definition.estimatedMinutes,
          sections: definition.sections,
        });
      })
      .catch((error) => {
        if (error instanceof Error && error.name === "AbortError") return;
        setDefinitionError(true);
      });
    return () => controller.abort();
  }, [assessmentKey]);

  async function handleComplete(answers: AssessmentAnswers, consent: boolean) {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE}/assessments/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assessmentKey,
          definitionVersion: config?.definitionVersion,
          submissionKey: submissionKey.current,
          answers,
          ...(consent ? { consent: true } : {}),
        }),
      });

      const data = await response.json().catch(() => null) as {
        result?: AuthoritativeAssessmentResult;
        resultPath?: string;
      } | null;
      if (!response.ok || !data?.result) throw new Error("Assessment result was not saved");

      setResult(data.result);
      setPhase("result");
      window.history.replaceState(null, "", data.resultPath || `/assessment-results/${assessmentKey}`);
      window.scrollTo({
        top: 0,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCtaClick() {
    try {
      await fetch(`${API_BASE}/assessments/result/cta`, { method: "POST" });
    } catch {
      // A first-party operational event must never interrupt the pathway.
    }
  }

  const resultBands = config?.definitionVersion === 2 ? [
    { label: "Substance-specific needs profile", colour: "#2e7d52" },
    { label: "Independent safety guidance", colour: "#b08a2a" },
    { label: "No combined detox score", colour: "#c0622a" },
    { label: "Anonymous core result", colour: "#162B3B" },
  ] : [
    { label: "Lower Concern", colour: "#2e7d52" },
    { label: "Moderate Concern", colour: "#b08a2a" },
    { label: "Higher Concern", colour: "#c0622a" },
    { label: "Elevated Concern", colour: "#9b2a2a" },
  ];

  if (phase === "assessment" && config) {
    return (
      <Layout>
        <SEO
          title={title}
          description={seoDescription}
          canonical={canonical}
          noIndex={true}
        />
        <AssessmentEngine
          config={config}
          onComplete={handleComplete}
          isSubmitting={isSubmitting}
        />
      </Layout>
    );
  }

  if (phase === "result" && result) {
    return (
      <>
        <SEO
          title="Your Assessment Results"
          description="Your private assessment result from Insight Recovery Network."
          canonical={`${canonical}/result`}
          noIndex={true}
        />
        <AssessmentResult
          result={result}
          onCtaClick={handleCtaClick}
          onResultUpdate={setResult}
        />
      </>
    );
  }

  return (
    <Layout>
      <SEO
        title={title}
        description={seoDescription}
        canonical={canonical}
      />

      {/* Intro */}
      <section
        className="py-14 md:py-20"
        style={{
          background:
            "linear-gradient(160deg, #F2EDE3 0%, #F6F4EF 50%, #EEE9DF 100%)",
          borderBottom: "1px solid rgba(201,169,110,0.2)",
        }}
      >
        <div className="container mx-auto px-6 md:px-12 max-w-2xl">
          <div className="w-8 h-px mb-8" style={{ background: "#C9A96E" }} />
          <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-4 font-sans">
            Private Self-Assessment
          </p>
          <h1 className="font-serif text-primary text-4xl md:text-5xl leading-tight mb-6">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed mb-10">
            {subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mb-10 text-sm text-muted-foreground font-light">
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-accent" />
              Approximately {estimatedMinutes} minutes
            </span>
            <span className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-accent" />
              Handled securely
            </span>
            <span className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-accent" />
              Durable result page
            </span>
          </div>

          <button
            onClick={() => {
              if (!config) return;
              setPhase("assessment");
              window.scrollTo({
                top: 0,
                behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
              });
            }}
            disabled={!config}
            className="inline-flex items-center gap-3 px-8 h-14 text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
          >
            Begin Assessment
          </button>

          {definitionError && (
            <p role="alert" className="mt-4 text-sm text-red-700">
              The assessment definition could not be loaded. Please refresh the page before continuing.
            </p>
          )}

          <p className="text-xs text-muted-foreground font-light mt-6 leading-relaxed max-w-md">
            This assessment is not a diagnosis. It is designed to help you
            understand your current situation and identify a safe pathway
            forward. If you are in immediate danger, call 999.
          </p>
        </div>
      </section>

      {/* What it covers */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-6 md:px-12 max-w-2xl">
          <h2 className="font-serif text-primary text-2xl mb-8">
            What this assessment covers
          </h2>
          <div className="flex flex-col gap-5">
            {(config?.sections ?? []).map((section, i) => (
              <div key={section.id} className="flex items-start gap-5">
                <span
                  className="font-serif text-2xl leading-none flex-shrink-0 mt-0.5"
                  style={{ color: "#C9A96E" }}
                >
                  0{i + 1}
                </span>
                <div>
                  <p className="font-medium text-primary text-sm">
                    {section.title.replace(/Section \d+ of \d+, /, "")}
                  </p>
                  {section.description && (
                    <p className="text-muted-foreground font-light text-sm mt-1 leading-relaxed">
                      {section.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Result bands */}
      <section
        className="py-16 md:py-20 border-t border-border/30"
        style={{ background: "#F6F4F0" }}
      >
        <div className="container mx-auto px-6 md:px-12 max-w-2xl">
          <h2 className="font-serif text-primary text-2xl mb-2">
            How results are calculated
          </h2>
          <p className="text-muted-foreground font-light mb-8 leading-relaxed">
            Your profile is calculated on the server using fixed, versioned
            rules. Substance-use patterns, safety guidance and possible pathways
            are assessed separately, so an important answer cannot be hidden by
            an overall total.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {resultBands.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 bg-white border border-border/40 px-4 py-3"
              >
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ background: item.colour }}
                />
                <span className="text-sm font-light text-foreground">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground font-light mt-6 leading-relaxed">
            Your personalised interpretation is generated deterministically from
            the pattern across relevant domains. It remains complete if AI, email
            or IRN's contact system is unavailable and it is not a diagnosis.
          </p>
        </div>
      </section>
    </Layout>
  );
}

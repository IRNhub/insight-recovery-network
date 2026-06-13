import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { AssessmentEngine } from "@/components/assessment/AssessmentEngine";
import { AssessmentResult } from "@/components/assessment/AssessmentResult";
import { buildClinicalBrief } from "@/lib/assessment-scorer";
import type { AssessmentConfig, AssessmentAnswers, ScoreResult, AnchorReport } from "@/types/assessment";
import { Shield, Clock, Lock } from "lucide-react";

interface AssessmentPageProps {
  config: AssessmentConfig;
  seoDescription: string;
  canonical: string;
}

type Phase = "intro" | "assessment" | "result";

const API_BASE = "/api";

export default function AssessmentPage({ config, seoDescription, canonical }: AssessmentPageProps) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [anchorReport, setAnchorReport] = useState<AnchorReport | null>(null);
  const [assessmentId, setAssessmentId] = useState<number | undefined>(undefined);
  const [userName, setUserName] = useState("");
  const [isLoadingAnchor, setIsLoadingAnchor] = useState(false);

  async function handleComplete(answers: AssessmentAnswers, score: ScoreResult, consent: boolean) {
    setIsSubmitting(true);

    const name = typeof answers["name"] === "string" ? answers["name"] : "";
    const email = typeof answers["email"] === "string" ? answers["email"] : "";
    const phone = typeof answers["phone"] === "string" ? answers["phone"] : undefined;

    const clinicalBrief = buildClinicalBrief(config, answers, score);
    const tags = buildTags(score);

    setResult(score);
    setUserName(name);
    setIsLoadingAnchor(true);
    setPhase("result");
    setIsSubmitting(false);
    window.scrollTo({ top: 0, behavior: "smooth" });

    try {
      const response = await fetch(`${API_BASE}/assessments/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: config.id,
          name,
          email,
          phone: phone || undefined,
          consent,
          answers,
          scoreValue: score.value,
          scoreLevel: score.level,
          scoreLabel: score.label,
          bandName: score.bandName,
          redFlags: score.redFlags,
          advisories: score.advisories,
          tags,
          clinicalBrief,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.anchorReport) {
          setAnchorReport(data.anchorReport as AnchorReport);
        }
        if (typeof data.id === "number") {
          setAssessmentId(data.id);
        }
      }
    } catch {
      // Anchor unavailable — result still shown with deterministic content
    } finally {
      setIsLoadingAnchor(false);
    }
  }

  async function handleCtaClick() {
    if (!assessmentId) return;
    try {
      await fetch(`${API_BASE}/assessments/${assessmentId}/cta-clicked`, {
        method: "POST",
      });
    } catch {
      // Non-fatal — tracking failure should not interrupt navigation
    }
  }

  function buildTags(score: ScoreResult): string[] {
    const tags: string[] = [
      `assessment:${config.id}`,
      `score-level:${score.level}`,
    ];
    for (const flag of score.redFlags) {
      tags.push(`red-flag:${flag}`);
      if (flag === "mental-health-risk") {
        tags.push("mental-health-red-flag");
        tags.push("urgent-safeguarding");
        tags.push("crisis-support-recommended");
      }
    }
    for (const advisory of score.advisories) {
      tags.push(advisory);
    }
    if (score.value >= config.scoreThresholds.possibleDetoxRisk) {
      tags.push("priority:high");
    } else if (score.value >= config.scoreThresholds.higherConcern) {
      tags.push("priority:high");
    } else if (score.value >= config.scoreThresholds.moderateConcern) {
      tags.push("priority:medium");
    } else {
      tags.push("priority:standard");
    }
    return tags;
  }

  const showDetoxBand = config.scoreThresholds.possibleDetoxRisk < 100;

  const resultBands = [
    { label: "Lower Concern", colour: "#2e7d52" },
    { label: "Moderate Concern", colour: "#b08a2a" },
    { label: "Higher Concern", colour: "#c0622a" },
    ...(showDetoxBand
      ? [
          { label: "Possible Detox Risk", colour: "#9b2a2a" },
          { label: "Urgent Medical Advice Recommended", colour: "#6b1a1a" },
        ]
      : [{ label: "Urgent Support Recommended", colour: "#6b1a1a" }]),
  ];

  if (phase === "assessment") {
    return (
      <Layout>
        <SEO
          title={config.title}
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
      <Layout>
        <SEO
          title="Your Assessment Results"
          description="Your confidential assessment results from Insight Recovery Network."
          canonical={`${canonical}/result`}
          noIndex={true}
        />
        <AssessmentResult
          result={result}
          name={userName}
          anchorReport={anchorReport}
          isLoading={isLoadingAnchor}
          advisories={result.advisories}
          assessmentId={assessmentId}
          onCtaClick={handleCtaClick}
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO
        title={config.title}
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
            Clinical Self-Assessment
          </p>
          <h1 className="font-serif text-primary text-4xl md:text-5xl leading-tight mb-6">
            {config.title}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed mb-10">
            {config.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mb-10 text-sm text-muted-foreground font-light">
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-accent" />
              Approximately {config.estimatedMinutes} minutes
            </span>
            <span className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-accent" />
              Completely confidential
            </span>
            <span className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-accent" />
              Results sent to your email
            </span>
          </div>

          <button
            onClick={() => {
              setPhase("assessment");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="inline-flex items-center gap-3 px-8 h-14 text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Begin Assessment
          </button>

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
            {config.sections.map((section, i) => (
              <div key={section.id} className="flex items-start gap-5">
                <span
                  className="font-serif text-2xl leading-none flex-shrink-0 mt-0.5"
                  style={{ color: "#C9A96E" }}
                >
                  0{i + 1}
                </span>
                <div>
                  <p className="font-medium text-primary text-sm">
                    {section.title.replace(/Section \d+ of \d+ — /, "")}
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
            Scores are calculated using fixed clinical logic — not AI. Your
            result level is determined by your total score and the presence of
            any specific risk indicators.
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
            After your score is calculated, Anchor — our AI-assisted recovery
            guidance system — will generate a personalised interpretation. Anchor
            does not diagnose or give medical instructions.
          </p>
        </div>
      </section>
    </Layout>
  );
}

import { useState } from "react";
import { Link } from "wouter";
import { Shield, Phone, AlertTriangle, ChevronDown, ChevronUp, Calendar, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ScoreResult, AnchorReport } from "@/types/assessment";

interface AssessmentResultProps {
  result: ScoreResult;
  name: string;
  anchorReport: AnchorReport | null;
  isLoading?: boolean;
  advisories?: string[];
  assessmentId?: number;
  onCtaClick?: () => void;
}

const LEVEL_CONFIG = {
  "lower-concern": {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    badge: "bg-emerald-100 text-emerald-800",
    patternBg: "bg-emerald-50 border-emerald-200",
    icon: null,
  },
  "moderate-concern": {
    bg: "bg-amber-50",
    border: "border-amber-200",
    badge: "bg-amber-100 text-amber-800",
    patternBg: "bg-amber-50 border-amber-200",
    icon: null,
  },
  "higher-concern": {
    bg: "bg-orange-50",
    border: "border-orange-200",
    badge: "bg-orange-100 text-orange-800",
    patternBg: "bg-orange-50 border-orange-200",
    icon: null,
  },
  "possible-detox-risk": {
    bg: "bg-red-50",
    border: "border-red-200",
    badge: "bg-red-100 text-red-800",
    patternBg: "bg-red-50 border-red-200",
    icon: "warning",
  },
  "urgent-medical-advice": {
    bg: "bg-red-50",
    border: "border-red-200",
    badge: "bg-red-100 text-red-900",
    patternBg: "bg-red-50 border-red-200",
    icon: "urgent",
  },
};

function SkeletonLine({ width = "full" }: { width?: string }) {
  return (
    <div className={`h-4 bg-border/40 rounded animate-pulse w-${width}`} />
  );
}

function SectionSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <SkeletonLine />
      <SkeletonLine width="5/6" />
      <SkeletonLine width="4/5" />
    </div>
  );
}

export function AssessmentResult({
  result,
  name,
  anchorReport,
  isLoading,
  advisories = [],
  assessmentId,
  onCtaClick,
}: AssessmentResultProps) {
  const [anchorExpanded, setAnchorExpanded] = useState(false);
  const config = LEVEL_CONFIG[result.level];
  const firstName = name.split(" ")[0] ?? name;
  const isHighRisk =
    result.level === "possible-detox-risk" || result.level === "urgent-medical-advice";

  function handleCtaClick() {
    onCtaClick?.();
  }

  return (
    <div className="min-h-screen" style={{ background: "#F6F4F0" }}>
      {/* Header band */}
      <div className="bg-primary py-12 md:py-16">
        <div className="container mx-auto px-6 md:px-12 max-w-2xl">
          <p className="text-xs font-semibold tracking-widest uppercase text-accent font-sans mb-3">
            Assessment Complete
          </p>
          <h1 className="font-serif text-white text-3xl md:text-4xl leading-snug mb-2">
            {firstName}, here are your results.
          </h1>
          <p className="text-white/60 font-light text-sm">
            Your results have been sent to your email address.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12 max-w-2xl py-10 md:py-14 flex flex-col gap-6">

        {/* Score card */}
        <div className={`border p-7 ${config.bg} ${config.border}`}>
          {config.icon === "urgent" && (
            <div className="flex items-center gap-3 mb-4 p-3 bg-red-100 border border-red-200">
              <AlertTriangle className="w-5 h-5 text-red-700 flex-shrink-0" />
              <p className="text-sm font-semibold text-red-800">
                Please seek medical advice before making any changes to your drinking.
              </p>
            </div>
          )}
          {config.icon === "warning" && (
            <div className="flex items-center gap-3 mb-4 p-3 bg-red-100 border border-red-200">
              <AlertTriangle className="w-5 h-5 text-red-700 flex-shrink-0" />
              <p className="text-sm font-semibold text-red-800">
                Do not stop drinking suddenly — please speak with a clinician first.
              </p>
            </div>
          )}
          <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
            <span className={`inline-block text-xs font-bold tracking-widest uppercase px-3 py-1 ${config.badge}`}>
              {result.bandName}
            </span>
            <span className="text-2xl font-serif text-primary font-light">
              {result.value}
            </span>
          </div>
          <p className="text-foreground font-light leading-relaxed text-sm">{result.tagline}</p>
        </div>

        {/* Mental health advisory (non-urgent) */}
        {advisories.includes("mental-health-advisory") && (
          <div className="border border-amber-200 bg-amber-50 p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm font-light text-amber-900 leading-relaxed">
                <strong className="font-semibold">Emotional wellbeing note:</strong>{" "}
                You also reported significant low mood or anxiety. This does not automatically mean there is an immediate crisis, but it does suggest that emotional wellbeing should be part of any support plan. If these feelings become overwhelming or you feel unsafe, please seek urgent help immediately.
              </p>
            </div>
          </div>
        )}

        {/* What This May Suggest */}
        <div className="bg-white border border-border/50 p-7">
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold font-serif flex-shrink-0"
              style={{ background: "#162B3B" }}
            >
              A
            </div>
            <div>
              <p className="font-semibold text-primary text-sm">What This May Suggest</p>
              <p className="text-xs text-muted-foreground font-light">Anchor — Insight Recovery Network</p>
            </div>
          </div>
          {isLoading ? (
            <SectionSkeleton />
          ) : anchorReport ? (
            <p className="text-muted-foreground font-light leading-loose text-[15px]">
              {anchorReport.whatThisMaySuggest}
            </p>
          ) : (
            <p className="text-muted-foreground font-light text-sm italic">
              Interpretation unavailable at this time. Please contact us for guidance.
            </p>
          )}
        </div>

        {/* Key Patterns */}
        <div className="bg-white border border-border/50 p-7">
          <p className="font-semibold text-primary text-sm mb-4">Key Patterns Noticed</p>
          {isLoading ? (
            <div className="flex flex-col gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-8 bg-border/40 rounded animate-pulse" />
              ))}
            </div>
          ) : anchorReport?.keyPatterns && anchorReport.keyPatterns.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {anchorReport.keyPatterns.map((pattern, i) => (
                <span
                  key={i}
                  className={`text-xs font-medium px-3 py-1.5 border ${config.patternBg}`}
                >
                  {pattern}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground font-light text-sm italic">
              Patterns unavailable at this time.
            </p>
          )}
        </div>

        {/* What This Does Not Mean */}
        <div className="bg-white border border-border/50 p-7">
          <p className="font-semibold text-primary text-sm mb-3">What This Does Not Mean</p>
          {isLoading ? (
            <SectionSkeleton />
          ) : anchorReport ? (
            <p className="text-muted-foreground font-light leading-loose text-[15px]">
              {anchorReport.whatThisDoesNotMean}
            </p>
          ) : (
            <p className="text-muted-foreground font-light text-sm leading-relaxed">
              This screening result is not a diagnosis. It is designed to help you reflect on your current situation and identify whether further support may be helpful. A qualified professional can provide a fuller and more accurate assessment.
            </p>
          )}
        </div>

        {/* Suggested Next Steps */}
        <div className="bg-white border border-border/50 p-7">
          <p className="font-semibold text-primary text-sm mb-3">Suggested Next Steps</p>
          {isLoading ? (
            <SectionSkeleton />
          ) : anchorReport ? (
            <p className="text-muted-foreground font-light leading-loose text-[15px]">
              {anchorReport.suggestedNextSteps}
            </p>
          ) : (
            <p className="text-muted-foreground font-light text-sm leading-relaxed">
              Consider speaking with a professional if these patterns are affecting your daily life. Your GP is a good first point of contact, or you can reach out to Insight Recovery Network for a confidential conversation.
            </p>
          )}
        </div>

        {/* Safe message for high risk */}
        {isHighRisk && (
          <div className="border border-red-200 bg-red-50 p-6">
            <h3 className="font-serif text-primary text-lg mb-3">Important safety information</h3>
            <p className="text-sm font-light text-muted-foreground leading-relaxed mb-3">
              Your responses indicate that stopping or reducing alcohol suddenly could be medically unsafe. Alcohol withdrawal can in some cases cause serious complications.
            </p>
            <p className="text-sm font-semibold text-primary">
              Please do not stop drinking abruptly without speaking to a doctor or clinical specialist first.
            </p>
          </div>
        )}

        {/* CTA block */}
        <div className="bg-primary p-7 md:p-9">
          <h3 className="font-serif text-white text-xl md:text-2xl mb-2">
            {isLoading ? "Speak with us in confidence." : (anchorReport?.ctaText ? "Ready to take the next step?" : "Speak with us in confidence.")}
          </h3>
          {anchorReport?.ctaText && !isLoading && (
            <p className="text-white/70 font-light text-sm leading-relaxed mb-5">
              {anchorReport.ctaText}
            </p>
          )}
          {!anchorReport?.ctaText && (
            <p className="text-white/70 font-light text-sm leading-relaxed mb-5">
              A member of our team will reach out to you. There is no obligation, no pressure, and no judgement.
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/contact" onClick={handleCtaClick}>
              <Button
                className="rounded-none h-11 px-6 bg-white text-primary hover:bg-white/90 font-medium w-full sm:w-auto"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Book a confidential consultation
              </Button>
            </Link>
            <Link href="/services" onClick={handleCtaClick}>
              <Button
                variant="outline"
                className="rounded-none h-11 px-6 border-white/40 text-white hover:bg-white/10 font-light w-full sm:w-auto"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Explore support options
              </Button>
            </Link>
          </div>
          {assessmentId && (
            <p className="text-white/30 text-xs mt-4 font-light">Assessment #{assessmentId}</p>
          )}
        </div>

        {/* Expandable Detailed Anchor Insight */}
        {!isLoading && anchorReport && (
          <div className="bg-white border border-border/50">
            <button
              onClick={() => setAnchorExpanded((v) => !v)}
              className="w-full flex items-center justify-between px-7 py-5 text-left hover:bg-border/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold font-serif flex-shrink-0"
                  style={{ background: "#162B3B" }}
                >
                  A
                </div>
                <span className="font-medium text-primary text-sm">Detailed Anchor Insight</span>
              </div>
              {anchorExpanded ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              )}
            </button>

            {anchorExpanded && (
              <div className="px-7 pb-7 border-t border-border/30">
                <div className="pt-5 flex flex-col gap-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">What this may suggest</p>
                    <p className="text-muted-foreground font-light leading-loose text-[14px]">{anchorReport.whatThisMaySuggest}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Key patterns</p>
                    <ul className="list-disc list-inside space-y-1">
                      {anchorReport.keyPatterns.map((p, i) => (
                        <li key={i} className="text-muted-foreground font-light text-[14px]">{p}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">What this does not mean</p>
                    <p className="text-muted-foreground font-light leading-loose text-[14px]">{anchorReport.whatThisDoesNotMean}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Suggested next steps</p>
                    <p className="text-muted-foreground font-light leading-loose text-[14px]">{anchorReport.suggestedNextSteps}</p>
                  </div>
                  <div className="pt-2 border-t border-border/30">
                    <p className="text-xs text-muted-foreground font-light leading-relaxed">
                      Anchor is an AI-assisted guidance tool. This is not a diagnosis. It does not replace clinical assessment or professional medical advice. If you are in crisis, please contact your GP or call 999.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Trust footer */}
        <div className="flex items-start gap-3 py-4">
          <Shield className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
          <p className="text-xs text-muted-foreground font-light leading-relaxed">
            Your assessment responses are stored securely and never shared with third parties. Insight Recovery Network operates with complete confidentiality.
          </p>
        </div>
      </div>
    </div>
  );
}

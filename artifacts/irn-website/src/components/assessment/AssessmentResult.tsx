import { Link } from "wouter";
import { Shield, Phone, Mail, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ScoreResult } from "@/types/assessment";

interface AssessmentResultProps {
  result: ScoreResult;
  name: string;
  anchorResponse: string;
  isLoading?: boolean;
}

const LEVEL_CONFIG = {
  "lower-concern": {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    badge: "bg-emerald-100 text-emerald-800",
    icon: null,
  },
  "moderate-concern": {
    bg: "bg-amber-50",
    border: "border-amber-200",
    badge: "bg-amber-100 text-amber-800",
    icon: null,
  },
  "higher-concern": {
    bg: "bg-orange-50",
    border: "border-orange-200",
    badge: "bg-orange-100 text-orange-800",
    icon: null,
  },
  "possible-detox-risk": {
    bg: "bg-red-50",
    border: "border-red-200",
    badge: "bg-red-100 text-red-800",
    icon: "warning",
  },
  "urgent-medical-advice": {
    bg: "bg-red-50",
    border: "border-red-200",
    badge: "bg-red-100 text-red-900",
    icon: "urgent",
  },
};

export function AssessmentResult({ result, name, anchorResponse, isLoading }: AssessmentResultProps) {
  const config = LEVEL_CONFIG[result.level];
  const firstName = name.split(" ")[0] ?? name;
  const isHighRisk =
    result.level === "possible-detox-risk" || result.level === "urgent-medical-advice";

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

      <div className="container mx-auto px-6 md:px-12 max-w-2xl py-10 md:py-14 flex flex-col gap-8">

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
          <span className={`inline-block text-xs font-bold tracking-widest uppercase px-3 py-1 ${config.badge} mb-4`}>
            {result.label}
          </span>
          <p className="text-foreground font-light leading-relaxed">{result.tagline}</p>
        </div>

        {/* Anchor response */}
        <div className="bg-white border border-border/50 p-7 md:p-9">
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold font-serif"
              style={{ background: "#162B3B" }}
            >
              A
            </div>
            <div>
              <p className="font-semibold text-primary text-sm">Anchor</p>
              <p className="text-xs text-muted-foreground font-light">Recovery Guidance — Insight Recovery Network</p>
            </div>
          </div>

          {isLoading ? (
            <div className="flex flex-col gap-3">
              <div className="h-4 bg-border/40 rounded animate-pulse w-full" />
              <div className="h-4 bg-border/40 rounded animate-pulse w-5/6" />
              <div className="h-4 bg-border/40 rounded animate-pulse w-4/5" />
              <div className="h-4 bg-border/40 rounded animate-pulse w-full" />
              <div className="h-4 bg-border/40 rounded animate-pulse w-3/4" />
            </div>
          ) : anchorResponse ? (
            <div className="text-muted-foreground font-light leading-loose whitespace-pre-line text-[15px]">
              {anchorResponse}
            </div>
          ) : (
            <p className="text-muted-foreground font-light text-sm italic">
              Anchor's reflection is unavailable at this time. Please contact us directly — we are here to help.
            </p>
          )}

          <div className="mt-6 pt-6 border-t border-border/30">
            <p className="text-xs text-muted-foreground font-light leading-relaxed">
              Anchor is an AI-assisted guidance tool. This is not a diagnosis. It does not replace clinical assessment or professional medical advice. If you are in crisis, please contact your GP or call 999.
            </p>
          </div>
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

        {/* CTA */}
        <div className="bg-primary p-7 md:p-9">
          <h3 className="font-serif text-white text-xl md:text-2xl mb-3">
            Speak with us in confidence.
          </h3>
          <p className="text-white/70 font-light text-sm leading-relaxed mb-6">
            A member of our team will reach out to you. There is no obligation, no pressure, and no judgement.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/contact">
              <Button
                className="rounded-none h-11 px-6 bg-white text-primary hover:bg-white/90 font-medium"
              >
                <Mail className="w-4 h-4 mr-2" />
                Send a message
              </Button>
            </Link>
          </div>
        </div>

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

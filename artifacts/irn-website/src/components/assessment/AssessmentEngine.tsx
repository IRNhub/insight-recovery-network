import { useRef, useState } from "react";
import { Shield, ChevronRight, ChevronLeft, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { AssessmentConfig, AssessmentAnswers, ScoreResult } from "@/types/assessment";
import { scoreAssessment } from "@/lib/assessment-scorer";

interface AssessmentEngineProps {
  config: AssessmentConfig;
  onComplete: (answers: AssessmentAnswers, result: ScoreResult, consent: boolean) => Promise<void>;
  isSubmitting: boolean;
}

export function AssessmentEngine({ config, onComplete, isSubmitting }: AssessmentEngineProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState<AssessmentAnswers>({});
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const isCompleting = useRef(false);

  const section = config.sections[currentSection];
  const totalSections = config.sections.length;
  const progressPct = Math.round(((currentSection) / totalSections) * 100);
  const isLastSection = currentSection === totalSections - 1;

  function setAnswer(questionId: string, value: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
  }

  function validateSection(): boolean {
    const newErrors: Record<string, string> = {};
    for (const q of section.questions) {
      if (!q.required) continue;
      const val = answers[q.id];
      if (!val || (typeof val === "string" && val.trim() === "")) {
        newErrors[q.id] = "Please answer this question to continue.";
      }
      if (q.type === "email" && val && typeof val === "string") {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
          newErrors[q.id] = "Please enter a valid email address.";
        }
      }
    }
    if (isLastSection && !consent) {
      newErrors["_consent"] = "You must consent to continue.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleNext() {
    if (!validateSection()) return;
    if (isLastSection) {
      if (isCompleting.current) return;
      isCompleting.current = true;
      const result = scoreAssessment(config, answers);
      try {
        await onComplete(answers, result, consent);
      } finally {
        isCompleting.current = false;
      }
      return;
    }
    setCurrentSection((s) => s + 1);
    scrollToTop();
  }

  function handleBack() {
    setCurrentSection((s) => Math.max(0, s - 1));
    scrollToTop();
  }

  function scrollToTop() {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }

  return (
    <div className="min-h-screen" style={{ background: "#F6F4F0" }}>
      {/* Progress bar */}
      <div className="sticky top-[88px] z-30 bg-white border-b border-border/40 shadow-sm">
        <div className="container mx-auto px-6 md:px-12 py-3 flex items-center gap-4">
          <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground font-sans whitespace-nowrap">
            {currentSection + 1} / {totalSections}
          </span>
          <div className="flex-1 bg-border/30 h-1.5 rounded-full overflow-hidden" role="progressbar" aria-label="Assessment progress" aria-valuemin={0} aria-valuemax={totalSections} aria-valuenow={currentSection + 1}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progressPct + (1 / totalSections) * 100}%`,
                background: "linear-gradient(90deg, #C9A96E, #162B3B)",
              }}
            />
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap hidden sm:flex items-center gap-1.5">
            <Clock className="w-3 h-3" />
            ~{config.estimatedMinutes} min
          </span>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12 py-12 md:py-16 max-w-2xl">

        {/* Section heading */}
        <div className="mb-10">
          <div
            className="w-8 h-px mb-6"
            style={{ background: "#C9A96E" }}
          />
          <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3 font-sans">
            {section.id !== "contact-consent" ? section.title : "Your Details"}
          </p>
          <h2 className="text-2xl md:text-3xl font-serif text-primary leading-snug mb-3">
            {section.id === "contact-consent"
              ? "Where should we send your results?"
              : "Please answer honestly, your responses are completely confidential."}
          </h2>
          {section.description && (
            <p className="text-muted-foreground font-light leading-relaxed">
              {section.description}
            </p>
          )}
        </div>

        {/* Questions */}
        <div className="flex flex-col gap-10">
          {section.questions.map((question) => {
            const error = errors[question.id];
            return (
              <div key={question.id}>
                <div className="mb-4">
                  <p className="text-primary font-medium leading-snug mb-1">
                    {question.text}
                    {question.required && (
                      <span className="text-accent ml-1 text-base leading-none">*</span>
                    )}
                  </p>
                  {question.subtext && (
                    <p className="text-sm text-muted-foreground font-light mt-1 leading-relaxed">
                      {question.subtext}
                    </p>
                  )}
                </div>

                {/* Radio options */}
                {question.type === "radio" && question.options && (
                  <div className="flex flex-col gap-2.5" role="radiogroup" aria-label={question.text} aria-describedby={error ? `${question.id}-error` : undefined}>
                    {question.options.map((option) => {
                      const selected = answers[question.id] === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          role="radio"
                          aria-checked={selected}
                          onClick={() => setAnswer(question.id, option.value)}
                          className={cn(
                            "w-full text-left px-5 py-4 border transition-all duration-150 text-sm font-light leading-relaxed",
                            selected
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border/60 bg-white text-foreground hover:border-primary/40 hover:bg-secondary/30"
                          )}
                        >
                          <span className={cn(
                            "inline-block w-4 h-4 rounded-full border-2 mr-3 flex-shrink-0 align-middle",
                            selected
                              ? "border-primary-foreground bg-primary-foreground/20"
                              : "border-muted-foreground/40"
                          )} />
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Text / email / tel inputs */}
                {(question.type === "text" || question.type === "email" || question.type === "tel") && (
                  <Input
                    type={question.type}
                    value={typeof answers[question.id] === "string" ? answers[question.id] as string : ""}
                    onChange={(e) => setAnswer(question.id, e.target.value)}
                    placeholder={
                      question.type === "email"
                        ? "you@example.com"
                        : question.type === "tel"
                        ? "+44 7700 000000"
                        : "Your answer"
                    }
                    className="rounded-none h-12 border-input focus-visible:ring-1 focus-visible:ring-accent focus-visible:border-accent"
                    autoComplete={
                      question.type === "email" ? "email" : question.type === "tel" ? "tel" : "name"
                    }
                  />
                )}

                {error && (
                  <p id={`${question.id}-error`} role="alert" className="text-red-600 text-xs mt-2 font-medium">{error}</p>
                )}
              </div>
            );
          })}

          {/* Consent (last section only) */}
          {isLastSection && (
            <div>
              <button
                type="button"
                role="checkbox"
                aria-checked={consent}
                onClick={() => {
                  setConsent((c) => !c);
                  setErrors((prev) => {
                    const next = { ...prev };
                    delete next["_consent"];
                    return next;
                  });
                }}
                className={cn(
                  "w-full text-left flex items-start gap-4 p-5 border transition-all duration-150",
                  consent
                    ? "border-primary bg-primary/5"
                    : "border-border/60 bg-white hover:border-primary/40"
                )}
              >
                <div
                  className={cn(
                    "w-5 h-5 mt-0.5 flex-shrink-0 border-2 flex items-center justify-center transition-all",
                    consent ? "border-primary bg-primary" : "border-muted-foreground/40"
                  )}
                >
                  {consent && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <p className="text-sm font-light text-muted-foreground leading-relaxed">
                  I understand that completing this assessment does not create a therapeutic or clinical relationship. I consent to Insight Recovery Network using my details to send my results and to follow up confidentially.
                </p>
              </button>
              {errors["_consent"] && (
                <p role="alert" className="text-red-600 text-xs mt-2 font-medium">{errors["_consent"]}</p>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-12 pt-8 border-t border-border/30">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentSection === 0}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary rounded-none"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>

          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-accent" />
            <span className="text-xs text-muted-foreground font-light">Confidential</span>
          </div>

          <Button
            onClick={handleNext}
            disabled={isSubmitting || isCompleting.current}
            className="flex items-center gap-2 rounded-none h-11 px-7"
          >
            {isSubmitting
              ? "Processing…"
              : isLastSection
              ? "View My Results"
              : (
                <>
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
          </Button>
        </div>
      </div>
    </div>
  );
}

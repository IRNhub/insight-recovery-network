/**
 * UK Family Addiction Impact Survey 2026 – public survey page.
 *
 * Route: /research/family-addiction-impact-survey-2026
 * - Anonymous, no account required, no personal contact information collected.
 * - noindex,follow while responses are collected; excluded from sitemap.xml.
 * - Multi-step form with progress, review screen and double-submit protection.
 * - Question definitions are fetched from the API (single source of truth);
 *   final validation always happens server-side.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { PageHero } from "@/components/ui/page-hero";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
// TODO(Craig): replace with the supplied campaign image – add it to
// src/assets/ as family-addiction-impact-survey-2026-hero.webp (WebP,
// compressed) and update this import path accordingly.
import heroImage from "@/assets/hero-family-guidance.webp";

const SURVEY_SLUG = "family-addiction-impact-survey-2026";
const STORAGE_KEY = "irn_survey_fam2026";
const API_BASE = "/api";

interface PublicSurveyQuestion {
  questionKey: string;
  section: string;
  questionOrder: number;
  questionText: string;
  questionType: "single_choice" | "multi_choice" | "scale" | "short_text" | "long_text" | "yes_no" | "consent";
  options: {
    choices?: string[];
    scaleMin?: number;
    scaleMax?: number;
    scaleMinLabel?: string;
    scaleMaxLabel?: string;
    maxLength?: number;
  } | null;
  isRequired: boolean;
  helperText: string | null;
}

interface PublicSurvey {
  slug: string;
  title: string;
  description: string;
  status: "open" | "closed";
  questions: PublicSurveyQuestion[];
}

type AnswerValue = string | string[] | number;

interface StoredState {
  answers: Record<string, AnswerValue>;
  consentAccepted: boolean;
  quotationPermission: boolean;
  submissionToken: string;
  startedAt: number;
}

function makeToken(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `tok-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
  }
}

function loadStored(): StoredState {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as StoredState;
      if (parsed && parsed.submissionToken) return parsed;
    }
  } catch {
    // fall through to fresh state
  }
  return {
    answers: {},
    consentAccepted: false,
    quotationPermission: false,
    submissionToken: makeToken(),
    startedAt: Date.now(),
  };
}

async function fetchSurvey(): Promise<PublicSurvey> {
  const res = await fetch(`${API_BASE}/research/surveys/${SURVEY_SLUG}`);
  if (!res.ok) throw new Error("Survey unavailable");
  return res.json();
}

const PRIVACY_POINTS = [
  "Responses are anonymous.",
  "Please do not include names or identifying details in free-text answers.",
  "Results may be reported in aggregated form.",
  "Anonymous comments will only be quoted where separate permission has been given.",
  "This survey is not a clinical assessment.",
  "Completing the survey does not establish a clinical relationship with Insight Recovery Network.",
  "The survey is not suitable for urgent or emergency support.",
];

const REQUIRED_CONSENT_TEXT =
  "I confirm that I am aged 18 or over, understand that this survey is anonymous, and consent to my responses being analysed and reported in aggregated form by Insight Recovery Network.";

const QUOTATION_CONSENT_TEXT =
  "I agree that anonymous comments I provide may be quoted in reports, articles or media materials.";

export default function FamilyAddictionImpactSurvey() {
  const { data: survey, isLoading, isError } = useQuery({
    queryKey: ["public-survey", SURVEY_SLUG],
    queryFn: fetchSurvey,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  const [stored, setStored] = useState<StoredState>(() =>
    typeof window === "undefined"
      ? { answers: {}, consentAccepted: false, quotationPermission: false, submissionToken: makeToken(), startedAt: Date.now() }
      : loadStored(),
  );
  const [step, setStep] = useState(0);
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [responseCode, setResponseCode] = useState<string | null>(null);
  const [consentError, setConsentError] = useState("");
  const formTopRef = useRef<HTMLDivElement>(null);
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);
  const utmRef = useRef<{ source: string; medium: string; campaign: string; referral: string }>({
    source: "",
    medium: "",
    campaign: "",
    referral: "",
  });

  // Capture UTM parameters and referrer once on mount (first touch wins).
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      const storedUtm = window.sessionStorage.getItem(`${STORAGE_KEY}_utm`);
      if (storedUtm) {
        utmRef.current = JSON.parse(storedUtm);
      } else {
        utmRef.current = {
          source: url.searchParams.get("utm_source") || "",
          medium: url.searchParams.get("utm_medium") || "",
          campaign: url.searchParams.get("utm_campaign") || "",
          referral: document.referrer || "",
        };
        window.sessionStorage.setItem(`${STORAGE_KEY}_utm`, JSON.stringify(utmRef.current));
      }
    } catch {
      // Attribution should never block the survey.
    }
  }, []);

  // Persist in-progress answers between steps (temporary client-side state).
  useEffect(() => {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    } catch {
      // Storage may be unavailable (private browsing) – continue in memory.
    }
  }, [stored]);

  const sections = useMemo(() => {
    if (!survey) return [] as { name: string; questions: PublicSurveyQuestion[] }[];
    const ordered = [...survey.questions].sort((a, b) => a.questionOrder - b.questionOrder);
    const result: { name: string; questions: PublicSurveyQuestion[] }[] = [];
    for (const q of ordered) {
      const last = result[result.length - 1];
      if (last && last.name === q.section) last.questions.push(q);
      else result.push({ name: q.section, questions: [q] });
    }
    return result;
  }, [survey]);

  // Steps: 0 = intro/consent, 1..n = sections, n+1 = review
  const totalSteps = sections.length + 2;
  const reviewStep = sections.length + 1;

  function focusTop() {
    requestAnimationFrame(() => {
      formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      stepHeadingRef.current?.focus({ preventScroll: true });
    });
  }

  function setAnswer(key: string, value: AnswerValue) {
    setStored((prev) => ({ ...prev, answers: { ...prev.answers, [key]: value } }));
    setStepErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function toggleMultiChoice(key: string, choice: string) {
    const current = stored.answers[key];
    const list = Array.isArray(current) ? [...current] : [];
    const index = list.indexOf(choice);
    if (index >= 0) list.splice(index, 1);
    else list.push(choice);
    setAnswer(key, list);
  }

  function validateSection(index: number): boolean {
    const section = sections[index];
    if (!section) return true;
    const errors: Record<string, string> = {};
    for (const q of section.questions) {
      if (!q.isRequired) continue;
      const value = stored.answers[q.questionKey];
      const missing =
        value === undefined ||
        value === null ||
        (typeof value === "string" && value.trim() === "") ||
        (Array.isArray(value) && value.length === 0);
      if (missing) errors[q.questionKey] = "Please answer this question to continue.";
    }
    setStepErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleBeginSurvey() {
    if (!stored.consentAccepted) {
      setConsentError("Please confirm the required consent statement before starting the survey.");
      return;
    }
    setConsentError("");
    setStep(1);
    focusTop();
  }

  function handleContinue() {
    if (step >= 1 && step <= sections.length) {
      if (!validateSection(step - 1)) {
        focusTop();
        return;
      }
    }
    setStep((s) => Math.min(s + 1, reviewStep));
    focusTop();
  }

  function handleBack() {
    setStepErrors({});
    setStep((s) => Math.max(s - 1, 0));
    focusTop();
  }

  async function handleSubmit() {
    if (submitting || responseCode) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch(`${API_BASE}/research/surveys/${SURVEY_SLUG}/responses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionToken: stored.submissionToken,
          consentAccepted: stored.consentAccepted,
          quotationPermission: stored.quotationPermission,
          answers: stored.answers,
          startedAt: stored.startedAt,
          source: utmRef.current.source,
          medium: utmRef.current.medium,
          campaign: utmRef.current.campaign,
          referralUrl: utmRef.current.referral,
          website: "",
        }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok) {
        setResponseCode((data && data.responseCode) || "submitted");
        try {
          window.sessionStorage.removeItem(STORAGE_KEY);
        } catch {
          // non-fatal
        }
        focusTop();
      } else if (res.status === 409) {
        setSubmitError("This survey is now closed and no longer accepting responses.");
      } else {
        setSubmitError(
          (data && data.error) || "We could not submit your response. Please check your answers and try again.",
        );
      }
    } catch {
      setSubmitError("We could not reach the server. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function formatAnswer(q: PublicSurveyQuestion): string {
    const value = stored.answers[q.questionKey];
    if (value === undefined || value === null || (Array.isArray(value) && value.length === 0) || value === "") {
      return "Not answered";
    }
    if (Array.isArray(value)) return value.join("; ");
    return String(value);
  }

  const progressPercent = Math.round((Math.min(step, reviewStep) / (totalSteps - 1)) * 100);

  const stepTitle =
    step === 0
      ? "Introduction and consent"
      : step === reviewStep
        ? "Review and submit"
        : sections[step - 1]?.name ?? "";

  return (
    <Layout>
      <SEO
        title="UK Family Addiction Impact Survey 2026"
        description="An anonymous five-minute survey by Insight Recovery Network exploring how addiction affects families and the barriers to accessing help."
        canonical="/research/family-addiction-impact-survey-2026"
      />
      {/* noindex,follow while responses are collected; page is excluded from sitemap.xml */}
      <Helmet>
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <PageHero
        label="IRN Research 2026"
        heading="UK Family Addiction Impact Survey 2026"
        description={
          <>
            Help us better understand how addiction affects families, relationships and access to treatment.
            This anonymous five-minute survey will contribute to educational resources, research findings and
            media commentary developed by Insight Recovery Network.
          </>
        }
        primaryAction={{
          label: "Begin the Survey",
          onClick: () => {
            document.getElementById("survey")?.scrollIntoView({ behavior: "smooth", block: "start" });
          },
        }}
        footnote={<>Anonymous&ensp;•&ensp;Adults aged 18+&ensp;•&ensp;Approximately 5 minutes</>}
        image={{
          src: heroImage,
          alt: "A family sitting together in a calm home environment during a supportive conversation",
          width: 1536,
          height: 1024,
          loading: "eager",
        }}
      />

      <section id="survey" className="py-12 md:py-16 bg-background scroll-mt-24">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-3xl mx-auto" ref={formTopRef}>
            {isLoading && (
              <div className="flex items-center justify-center gap-3 py-24 text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                <span>Loading the survey…</span>
              </div>
            )}

            {(isError || (!isLoading && !survey)) && !isLoading && (
              <div className="border border-border/60 bg-card p-8 text-center">
                <AlertTriangle className="w-6 h-6 mx-auto mb-4 text-accent" aria-hidden="true" />
                <h2 className="font-serif text-2xl text-primary mb-2">The survey is not available right now</h2>
                <p className="text-muted-foreground font-light">
                  Please try again later, or return to the{" "}
                  <Link href="/" className="underline text-primary">
                    Insight Recovery Network homepage
                  </Link>
                  .
                </p>
              </div>
            )}

            {survey && survey.status === "closed" && !responseCode && (
              <div className="border border-border/60 bg-card p-8 text-center">
                <h2 className="font-serif text-2xl text-primary mb-3">This survey is now closed</h2>
                <p className="text-muted-foreground font-light mb-6">
                  Thank you for your interest. The UK Family Addiction Impact Survey 2026 is no longer
                  accepting responses. Aggregated findings may be published on our website in due course.
                </p>
                <Link href="/">
                  <Button variant="outline" className="rounded-none">
                    Return to insightrecoverynetwork.com
                  </Button>
                </Link>
              </div>
            )}

            {responseCode && (
              <div className="border border-border/60 bg-card p-8 md:p-12 text-center" role="status">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-6 text-accent" aria-hidden="true" />
                <h2 ref={stepHeadingRef} tabIndex={-1} className="font-serif text-2xl md:text-3xl text-primary mb-4 focus:outline-none">
                  Thank you for contributing to the UK Family Addiction Impact Survey 2026.
                </h2>
                <p className="text-muted-foreground font-light leading-relaxed mb-4">
                  Your response has been submitted anonymously. Your contribution will help Insight Recovery
                  Network better understand the experience of families affected by addiction and improve
                  future educational and research materials.
                </p>
                <p className="text-sm text-muted-foreground/80 font-light mb-8">
                  Please remember that this survey is not a clinical assessment or emergency service.
                </p>
                <Link href="/">
                  <Button className="rounded-none h-12 px-8">Return to insightrecoverynetwork.com</Button>
                </Link>
              </div>
            )}

            {survey && survey.status === "open" && !responseCode && (
              <div>
                {/* Progress indicator */}
                <div className="mb-10" aria-hidden="false">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold tracking-widest uppercase text-accent/80">
                      Step {Math.min(step + 1, totalSteps)} of {totalSteps}
                    </p>
                    <p className="text-xs text-muted-foreground">{stepTitle}</p>
                  </div>
                  <div
                    className="h-1 bg-border/50 w-full"
                    role="progressbar"
                    aria-valuenow={progressPercent}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label="Survey progress"
                  >
                    <div className="h-1 bg-accent transition-all duration-300" style={{ width: `${progressPercent}%` }} />
                  </div>
                </div>

                {/* Step 0: Introduction and consent */}
                {step === 0 && (
                  <div>
                    <h2 ref={stepHeadingRef} tabIndex={-1} className="font-serif text-2xl md:text-3xl text-primary mb-6 focus:outline-none">
                      Before you begin
                    </h2>
                    <div className="space-y-4 text-muted-foreground font-light leading-relaxed mb-8">
                      <p>
                        Insight Recovery Network is conducting an anonymous survey to better understand how
                        addiction affects families and the barriers people face when trying to access help.
                      </p>
                      <p>
                        The results may be used to produce aggregated research findings, educational articles,
                        reports and media commentary. The survey does not request names, contact information
                        or identifying clinical information.
                      </p>
                      <p>
                        The survey is intended for adults aged 18 or over who have been affected by the
                        addiction or compulsive behaviour of a family member, partner or someone close to them.
                      </p>
                      <p className="text-primary">Estimated completion time: approximately 5 minutes.</p>
                    </div>

                    <div className="border border-border/60 bg-card p-6 md:p-8 mb-8">
                      <h3 className="font-serif text-lg text-primary mb-4">Privacy note</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground font-light list-disc pl-5">
                        {PRIVACY_POINTS.map((point) => (
                          <li key={point}>{point}</li>
                        ))}
                      </ul>
                      <p className="text-sm text-muted-foreground font-light mt-4">
                        For more information about how we handle data, see our{" "}
                        <Link href="/privacy-policy" className="underline text-primary">
                          privacy policy
                        </Link>
                        .
                      </p>
                    </div>

                    <fieldset className="space-y-5 mb-8">
                      <legend className="sr-only">Consent</legend>
                      <div className="flex items-start gap-3">
                        <Checkbox
                          id="consent-required"
                          checked={stored.consentAccepted}
                          onCheckedChange={(checked) => {
                            setStored((prev) => ({ ...prev, consentAccepted: checked === true }));
                            if (checked === true) setConsentError("");
                          }}
                          aria-describedby={consentError ? "consent-error" : undefined}
                          className="mt-1"
                        />
                        <label htmlFor="consent-required" className="text-sm text-foreground leading-relaxed cursor-pointer">
                          {REQUIRED_CONSENT_TEXT} <span className="text-accent" aria-hidden="true">*</span>
                          <span className="sr-only">(required)</span>
                        </label>
                      </div>
                      <div className="flex items-start gap-3">
                        <Checkbox
                          id="consent-quotation"
                          checked={stored.quotationPermission}
                          onCheckedChange={(checked) =>
                            setStored((prev) => ({ ...prev, quotationPermission: checked === true }))
                          }
                          className="mt-1"
                        />
                        <label htmlFor="consent-quotation" className="text-sm text-foreground leading-relaxed cursor-pointer">
                          {QUOTATION_CONSENT_TEXT} <span className="text-muted-foreground">(optional)</span>
                        </label>
                      </div>
                    </fieldset>

                    {consentError && (
                      <p id="consent-error" role="alert" className="text-sm text-destructive mb-6">
                        {consentError}
                      </p>
                    )}

                    <Button onClick={handleBeginSurvey} className="rounded-none h-12 px-8">
                      Start the survey
                    </Button>
                  </div>
                )}

                {/* Section steps */}
                {step >= 1 && step <= sections.length && sections[step - 1] && (
                  <div>
                    <h2 ref={stepHeadingRef} tabIndex={-1} className="font-serif text-2xl md:text-3xl text-primary mb-8 focus:outline-none">
                      {sections[step - 1]!.name}
                    </h2>

                    {Object.keys(stepErrors).length > 0 && (
                      <div role="alert" className="border border-destructive/40 bg-destructive/5 p-4 mb-8 text-sm text-destructive">
                        Please answer the highlighted questions before continuing.
                      </div>
                    )}

                    <div className="space-y-10">
                      {sections[step - 1]!.questions.map((q) => (
                        <fieldset key={q.questionKey} className="border-0 p-0 m-0">
                          <legend className="text-base md:text-lg text-primary font-medium leading-snug mb-1">
                            {q.questionText}
                            {q.isRequired ? (
                              <>
                                {" "}
                                <span className="text-accent" aria-hidden="true">*</span>
                                <span className="sr-only">(required)</span>
                              </>
                            ) : (
                              <span className="text-muted-foreground text-sm font-light"> (optional)</span>
                            )}
                          </legend>
                          {q.helperText && (
                            <p className="text-sm text-muted-foreground font-light mb-3">{q.helperText}</p>
                          )}
                          {stepErrors[q.questionKey] && (
                            <p role="alert" className="text-sm text-destructive mb-3">
                              {stepErrors[q.questionKey]}
                            </p>
                          )}

                          {q.questionType === "single_choice" && (
                            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2" role="radiogroup" aria-label={q.questionText}>
                              {q.options?.choices?.map((choice) => {
                                const selected = stored.answers[q.questionKey] === choice;
                                return (
                                  <label
                                    key={choice}
                                    className={`flex items-center gap-3 border px-4 py-3 cursor-pointer transition-colors text-sm ${
                                      selected
                                        ? "border-primary bg-primary/5 text-primary"
                                        : "border-border/60 bg-card hover:border-primary/40 text-foreground"
                                    }`}
                                  >
                                    <input
                                      type="radio"
                                      name={q.questionKey}
                                      value={choice}
                                      checked={selected}
                                      onChange={() => setAnswer(q.questionKey, choice)}
                                      className="h-4 w-4 accent-[#162B3B] shrink-0"
                                    />
                                    <span>{choice}</span>
                                  </label>
                                );
                              })}
                            </div>
                          )}

                          {q.questionType === "multi_choice" && (
                            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {q.options?.choices?.map((choice) => {
                                const current = stored.answers[q.questionKey];
                                const selected = Array.isArray(current) && current.includes(choice);
                                return (
                                  <label
                                    key={choice}
                                    className={`flex items-center gap-3 border px-4 py-3 cursor-pointer transition-colors text-sm ${
                                      selected
                                        ? "border-primary bg-primary/5 text-primary"
                                        : "border-border/60 bg-card hover:border-primary/40 text-foreground"
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      name={q.questionKey}
                                      value={choice}
                                      checked={selected}
                                      onChange={() => toggleMultiChoice(q.questionKey, choice)}
                                      className="h-4 w-4 accent-[#162B3B] shrink-0"
                                    />
                                    <span>{choice}</span>
                                  </label>
                                );
                              })}
                              <p className="sm:col-span-2 text-xs text-muted-foreground font-light mt-1">
                                Select all that apply.
                              </p>
                            </div>
                          )}

                          {q.questionType === "scale" && (
                            <div className="mt-3">
                              <div
                                className="grid grid-cols-5 sm:grid-cols-10 gap-1.5"
                                role="radiogroup"
                                aria-label={q.questionText}
                              >
                                {Array.from(
                                  { length: (q.options?.scaleMax ?? 10) - (q.options?.scaleMin ?? 1) + 1 },
                                  (_, i) => (q.options?.scaleMin ?? 1) + i,
                                ).map((n) => {
                                  const selected = Number(stored.answers[q.questionKey]) === n;
                                  return (
                                    <label
                                      key={n}
                                      className={`flex items-center justify-center h-11 border cursor-pointer text-sm transition-colors ${
                                        selected
                                          ? "border-primary bg-primary text-primary-foreground"
                                          : "border-border/60 bg-card hover:border-primary/40 text-foreground"
                                      }`}
                                    >
                                      <input
                                        type="radio"
                                        name={q.questionKey}
                                        value={n}
                                        checked={selected}
                                        onChange={() => setAnswer(q.questionKey, n)}
                                        className="sr-only"
                                      />
                                      {n}
                                    </label>
                                  );
                                })}
                              </div>
                              <div className="flex justify-between mt-2 text-xs text-muted-foreground font-light">
                                <span>
                                  {q.options?.scaleMin ?? 1} = {q.options?.scaleMinLabel ?? "Lowest"}
                                </span>
                                <span>
                                  {q.options?.scaleMax ?? 10} = {q.options?.scaleMaxLabel ?? "Highest"}
                                </span>
                              </div>
                            </div>
                          )}

                          {(q.questionType === "long_text" || q.questionType === "short_text") && (
                            <div className="mt-3">
                              <Textarea
                                id={`q-${q.questionKey}`}
                                aria-label={q.questionText}
                                rows={q.questionType === "long_text" ? 5 : 2}
                                maxLength={q.options?.maxLength ?? (q.questionType === "long_text" ? 4000 : 500)}
                                value={typeof stored.answers[q.questionKey] === "string" ? (stored.answers[q.questionKey] as string) : ""}
                                onChange={(e) => setAnswer(q.questionKey, e.target.value)}
                                className="rounded-none bg-card"
                                placeholder="Your answer (optional)"
                              />
                            </div>
                          )}

                          {q.questionType === "yes_no" && (
                            <div className="mt-3 flex gap-2" role="radiogroup" aria-label={q.questionText}>
                              {["yes", "no"].map((choice) => {
                                const selected = stored.answers[q.questionKey] === choice;
                                return (
                                  <label
                                    key={choice}
                                    className={`flex items-center gap-3 border px-6 py-3 cursor-pointer capitalize text-sm ${
                                      selected
                                        ? "border-primary bg-primary/5 text-primary"
                                        : "border-border/60 bg-card hover:border-primary/40 text-foreground"
                                    }`}
                                  >
                                    <input
                                      type="radio"
                                      name={q.questionKey}
                                      value={choice}
                                      checked={selected}
                                      onChange={() => setAnswer(q.questionKey, choice)}
                                      className="h-4 w-4 accent-[#162B3B] shrink-0"
                                    />
                                    {choice}
                                  </label>
                                );
                              })}
                            </div>
                          )}
                        </fieldset>
                      ))}
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-4 mt-12">
                      <Button variant="outline" onClick={handleBack} className="rounded-none h-12 px-8">
                        Back
                      </Button>
                      <Button onClick={handleContinue} className="rounded-none h-12 px-8">
                        Continue
                      </Button>
                    </div>
                  </div>
                )}

                {/* Review step */}
                {step === reviewStep && (
                  <div>
                    <h2 ref={stepHeadingRef} tabIndex={-1} className="font-serif text-2xl md:text-3xl text-primary mb-4 focus:outline-none">
                      Review and submit
                    </h2>
                    <p className="text-muted-foreground font-light mb-8">
                      Please review your answers below. You can go back to change anything before submitting.
                      Your response is anonymous.
                    </p>

                    <div className="space-y-8 mb-10">
                      {sections.map((section, index) => (
                        <div key={section.name} className="border border-border/60 bg-card p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-serif text-lg text-primary">{section.name}</h3>
                            <button
                              type="button"
                              onClick={() => {
                                setStep(index + 1);
                                focusTop();
                              }}
                              className="text-xs font-semibold tracking-widest uppercase text-accent hover:text-primary transition-colors"
                            >
                              Edit
                            </button>
                          </div>
                          <dl className="space-y-3">
                            {section.questions.map((q) => (
                              <div key={q.questionKey}>
                                <dt className="text-sm text-muted-foreground font-light">{q.questionText}</dt>
                                <dd className="text-sm text-foreground mt-0.5">{formatAnswer(q)}</dd>
                              </div>
                            ))}
                          </dl>
                        </div>
                      ))}

                      <div className="border border-border/60 bg-card p-6">
                        <h3 className="font-serif text-lg text-primary mb-4">Consent</h3>
                        <dl className="space-y-3">
                          <div>
                            <dt className="text-sm text-muted-foreground font-light">Required consent</dt>
                            <dd className="text-sm text-foreground mt-0.5">Accepted</dd>
                          </div>
                          <div>
                            <dt className="text-sm text-muted-foreground font-light">Permission to quote anonymous comments</dt>
                            <dd className="text-sm text-foreground mt-0.5">
                              {stored.quotationPermission ? "Given" : "Not given"}
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </div>

                    {submitError && (
                      <div role="alert" className="border border-destructive/40 bg-destructive/5 p-4 mb-6 text-sm text-destructive">
                        {submitError}
                      </div>
                    )}

                    <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-4">
                      <Button variant="outline" onClick={handleBack} disabled={submitting} className="rounded-none h-12 px-8">
                        Back
                      </Button>
                      <Button onClick={handleSubmit} disabled={submitting} className="rounded-none h-12 px-8">
                        {submitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                            Submitting…
                          </>
                        ) : (
                          "Submit my response"
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}

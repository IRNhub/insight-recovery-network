import { AlertTriangle, CheckCircle2, ExternalLink, Shield } from "lucide-react";
import type { AuthoritativeAssessmentResult } from "@/types/assessment";
import { markAssessmentLinkedHelpJourney } from "@/lib/assessment-tracking-boundary";
import { AssessmentContactOptions } from "./AssessmentContactOptions";

interface AssessmentResultProps {
  result: AuthoritativeAssessmentResult;
  onCtaClick?: () => void;
  onResultUpdate?: (result: AuthoritativeAssessmentResult) => void;
}

const URGENT_ACTIONS = new Set(["urgent-same-day-assessment", "emergency-help-now"]);

function deliveryCopy(result: AuthoritativeAssessmentResult): string {
  if (result.delivery.email === "not-requested" && result.delivery.irnOs === "not-requested") {
    return "Your anonymous core result is complete and saved for secure recovery in this browser. No email or IRN follow-up has been requested.";
  }
  const email = result.delivery.email === "sent"
    ? "Your result email was accepted by our email provider."
    : result.delivery.email === "queued"
      ? "Your result email is awaiting delivery."
      : result.delivery.email === "failed"
        ? "We could not confirm email delivery. Please keep this page available."
        : "No result email was requested.";
  const irnOs = result.delivery.irnOs === "forwarded"
    ? "Your request was accepted by the IRN contact system."
    : result.delivery.irnOs === "queued"
      ? "Your contact request is awaiting transfer to IRN."
      : result.delivery.irnOs === "failed"
        ? "We could not confirm that IRN received your contact request. Please contact us directly if you want a response."
        : "No IRN contact request was made.";
  return `${email} ${irnOs}`;
}

export function AssessmentResult({ result, onCtaClick, onResultUpdate }: AssessmentResultProps) {
  const urgent = URGENT_ACTIONS.has(result.safety.action);
  const pathways = result.safety.suppressCommercialCtas
    ? result.pathways.filter((pathway) => !pathway.commercial)
    : result.pathways;

  function handlePathway(destination: string, commercial: boolean) {
    if (destination === "/get-help") markAssessmentLinkedHelpJourney();
    if (commercial) onCtaClick?.();
  }

  const SafetyBlock = (
    <section
      className={`border p-6 md:p-7 ${urgent ? "border-red-300 bg-red-50" : "border-amber-200 bg-amber-50"}`}
      aria-live={urgent ? "assertive" : "polite"}
    >
      <div className="flex items-start gap-3">
        {urgent ? (
          <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-700" />
        ) : (
          <Shield className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-700" />
        )}
        <div>
          <h2 className="font-serif text-xl text-primary">{result.safety.publicHeading}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{result.safety.limitation}</p>
        </div>
      </div>
      {result.safety.content.map((item) => (
        <div key={item.id} className="mt-5 border-t border-current/10 pt-5">
          <h3 className="font-semibold text-primary">{item.heading}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
          {item.actionText && <p className="mt-2 text-sm font-semibold text-primary">{item.actionText}</p>}
          {item.emergencyText && <p className="mt-2 text-sm font-semibold text-red-800">{item.emergencyText}</p>}
        </div>
      ))}
    </section>
  );

  return (
    <div className="min-h-screen bg-[#F6F4F0]">
      <header className="bg-primary py-12 md:py-16">
        <div className="container mx-auto max-w-3xl px-6 md:px-12">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent">Assessment complete</p>
          <h1 className="font-serif text-3xl leading-snug text-white md:text-4xl">Here are your results.</h1>
          <p className="mt-3 text-sm font-light leading-relaxed text-white/70" aria-live="polite">
            {deliveryCopy(result)}
          </p>
        </div>
      </header>

      <main className="container mx-auto flex max-w-3xl flex-col gap-6 px-6 py-10 md:px-12 md:py-14">
        {urgent && SafetyBlock}

        <section className="border border-border/60 bg-white p-6 md:p-7">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {result.instrument ? result.instrument.name : "IRN context profile"}
          </p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-serif text-2xl text-primary">
              {result.instrument ? result.instrument.band : result.screening.label}
            </h2>
            {result.instrument ? (
              <p className="text-sm font-semibold text-primary">
                {result.instrument.name} score: {result.instrument.rawScore} / {result.instrument.maximumScore}
              </p>
            ) : result.screening.displayScore && result.screening.value !== null && result.screening.maximumValue !== null ? (
              <p className="text-sm text-muted-foreground">
                {result.screening.value} of {result.screening.maximumValue}
              </p>
            ) : null}
          </div>
          <p className="mt-4 text-sm font-light leading-relaxed text-muted-foreground">{result.screening.explanation}</p>
        </section>

        <section className="border border-border/60 bg-white p-6 md:p-7">
          <h2 className="font-serif text-2xl text-primary">What your answers may suggest</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">{result.interpretation.summary}</p>
        </section>

        {result.interpretation.keyPatterns.length > 0 && (
          <section className="border border-border/60 bg-white p-6 md:p-7">
            <h2 className="font-serif text-2xl text-primary">Key patterns and why they matter</h2>
            <div className="mt-5 flex flex-col gap-5">
              {result.interpretation.keyPatterns.map((pattern) => (
                <article key={pattern.id} className="border-l-2 border-accent pl-4">
                  <h3 className="font-semibold text-primary">{pattern.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{pattern.statement}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    <strong className="font-semibold text-primary">Why this matters:</strong> {pattern.whyItMatters}
                  </p>
                </article>
              ))}
            </div>
          </section>
        )}

        {result.interpretation.whyThisMatters.length > 0 && (
          <section className="border border-border/60 bg-white p-6 md:p-7">
            <h2 className="font-serif text-2xl text-primary">Why this matters</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
              {result.interpretation.whyThisMatters.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </section>
        )}

        {!urgent && SafetyBlock}

        <section className="border border-border/60 bg-white p-6 md:p-7">
          <h2 className="font-serif text-2xl text-primary">Your domain profile</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {result.domains.map((domain) => (
              <article key={domain.id} className="border border-border/60 p-4">
                <h3 className="font-semibold text-primary">{domain.label}</h3>
                <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{domain.state.replace(/-/g, " ")}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{domain.summary}</p>
              </article>
            ))}
          </div>
        </section>

        {result.interpretation.protectiveFactors.length > 0 && (
          <section className="border border-emerald-200 bg-emerald-50 p-6 md:p-7">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-700" />
              <h2 className="font-serif text-xl text-primary">Protective factors</h2>
            </div>
            {result.interpretation.protectiveFactors.map((factor) => (
              <p key={factor.id} className="mt-3 text-sm leading-relaxed text-muted-foreground">{factor.statement}</p>
            ))}
          </section>
        )}

        <section className="border border-border/60 bg-white p-6 md:p-7">
          <h2 className="font-serif text-xl text-primary">What this result does not mean</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
            {result.interpretation.limitations.map((limitation) => <li key={limitation}>{limitation}</li>)}
          </ul>
        </section>

        <section className="border border-border/60 bg-white p-6 md:p-7">
          <h2 className="font-serif text-xl text-primary">What to consider next</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Use the safety guidance first. The pathways below are proportionate options based on the profile and do not replace individual medical or clinical assessment.
          </p>
        </section>

        <section className="border border-border/60 bg-white p-6 md:p-7">
          <h2 className="font-serif text-2xl text-primary">Appropriate pathways</h2>
          <div className="mt-5 flex flex-col gap-3">
            {pathways.map((pathway) => (
              <a
                key={pathway.id}
                href={pathway.destination}
                onClick={() => handlePathway(pathway.destination, pathway.commercial)}
                className="flex items-start justify-between gap-4 border border-border/60 p-4 transition-colors hover:border-primary/50 hover:bg-secondary/30"
              >
                <span>
                  <strong className="block text-sm text-primary">{pathway.label}</strong>
                  <span className="mt-1 block text-sm font-light leading-relaxed text-muted-foreground">{pathway.description}</span>
                </span>
                <ExternalLink className="mt-1 h-4 w-4 flex-shrink-0 text-muted-foreground" />
              </a>
            ))}
          </div>
        </section>

        {result.aiEnhancement.status === "available" && result.aiEnhancement.narrative && (
          <section className="border border-border/60 bg-white p-6 md:p-7">
            <h2 className="font-serif text-xl text-primary">Additional personalised explanation</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{result.aiEnhancement.narrative}</p>
          </section>
        )}

        {onResultUpdate && (
          <AssessmentContactOptions
            result={result}
            suppressCommercialContact={result.safety.suppressCommercialCtas}
            onResultUpdate={onResultUpdate}
          />
        )}

        <div className="flex items-start gap-3 py-4">
          <Shield className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
          <p className="text-xs font-light leading-relaxed text-muted-foreground">
            This screening and triage result was calculated by IRN's deterministic server-side assessment engine. It is not a diagnosis or medical clearance and does not replace professional assessment. IRN does not monitor assessment submissions as an emergency service, so use any displayed NHS or emergency pathway directly.
          </p>
        </div>
      </main>
    </div>
  );
}

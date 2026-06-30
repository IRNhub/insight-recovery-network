import { Link } from "wouter";

interface ServiceSummaryProps {
  who: string;
  problem: string;
  applies: string;
  nextStep?: string;
  updated?: string;
}

export function EditorialTrustNote({ updated = "30 June 2026" }: { updated?: string }) {
  return (
    <div className="flex flex-col gap-2 border-t border-border/40 pt-5 text-xs leading-relaxed text-muted-foreground">
      <p>
        Written by{" "}
        <Link href="/craig-bilton" className="font-medium text-primary underline underline-offset-2 hover:text-accent">
          Craig Bilton, Founder &amp; Clinical Director
        </Link>
        , drawing on 20+ years&apos; international addiction and mental health experience. Last reviewed {updated}.
      </p>
      <p>
        Insight Recovery Network is not a regulated healthcare provider, does not diagnose or prescribe, and is not an emergency or crisis service. In an emergency call 999 or attend A&amp;E. Read the{" "}
        <Link href="/clinical-disclaimer" className="underline underline-offset-2 hover:text-primary">
          clinical disclaimer
        </Link>.
      </p>
    </div>
  );
}

export function ServiceSummary({ who, problem, applies, nextStep = "Book a confidential call", updated }: ServiceSummaryProps) {
  const items = [
    { label: "Who this is for", value: who },
    { label: "What it helps solve", value: problem },
    { label: "Where it applies", value: applies },
    { label: "Next step", value: nextStep },
  ];
  const borderClasses = [
    "",
    "border-t sm:border-t-0 sm:border-l",
    "border-t sm:border-l-0 lg:border-t-0 lg:border-l",
    "border-t sm:border-l lg:border-t-0",
  ];

  return (
    <section className="border-b border-border/40 bg-secondary/15" aria-labelledby="service-summary-heading">
      <div className="container mx-auto px-6 md:px-12 py-8 md:py-10">
        <h2 id="service-summary-heading" className="sr-only">Service summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-border/40 bg-background">
          {items.map((item, index) => (
            <div
              key={item.label}
              className={`p-5 md:p-6 ${borderClasses[index]} border-border/40`}
            >
              <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-accent/80 mb-2">{item.label}</p>
              <p className="text-sm leading-relaxed text-primary">{item.value}</p>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <EditorialTrustNote updated={updated} />
        </div>
      </div>
    </section>
  );
}

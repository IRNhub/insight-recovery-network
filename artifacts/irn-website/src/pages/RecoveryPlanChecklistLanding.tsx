import { type FormEvent, useMemo, useState } from "react";
import { CheckCircle2, Mail, ShieldCheck } from "lucide-react";
import { Link } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

const checklistItems = [
  "Enough daily structure between therapy, groups, or check-ins",
  "A clear plan for cravings, emotional overwhelm, and high-risk moments",
  "A realistic response if there is a slip rather than panic or shame",
  "Aftercare that begins before discharge or before motivation fades",
  "Family and support roles that are clear, boundaried, and practical",
];

function captureLandingPage(): string {
  try {
    const stored = window.sessionStorage.getItem("irn_landing_page");
    if (stored) return stored;
    const value = `${window.location.pathname}${window.location.search}`;
    window.sessionStorage.setItem("irn_landing_page", value);
    return value;
  } catch {
    return `${window.location.pathname}${window.location.search}`;
  }
}

export default function RecoveryPlanChecklistLanding() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const formStartedAt = useMemo(() => Date.now(), []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    setIsError(false);

    try {
      const url = new URL(window.location.href);
      const response = await fetch("/api/resource-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          email,
          resourceSlug: "recovery-plan-checklist",
          consent,
          landingPage: captureLandingPage(),
          currentPage: `${window.location.pathname}${window.location.search}`,
          referrer: document.referrer || "",
          utmSource: url.searchParams.get("utm_source") || "",
          utmMedium: url.searchParams.get("utm_medium") || "",
          utmCampaign: url.searchParams.get("utm_campaign") || "",
          utmTerm: url.searchParams.get("utm_term") || "",
          utmContent: url.searchParams.get("utm_content") || "",
          formStartedAt,
          website: "",
        }),
      });

      if (!response.ok && response.status !== 204) {
        throw new Error(`Server responded with ${response.status}`);
      }

      setIsSuccess(true);
    } catch {
      setIsError(true);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Layout>
      <SEO
        title="Recovery Plan Checklist"
        fullTitle="Recovery Plan Checklist | Insight Recovery Network"
        description="A practical one-page checklist to help you assess whether a recovery plan, treatment programme, or aftercare structure is the right fit."
        canonical="/recovery-plan-checklist"
      />

      <section className="relative overflow-hidden bg-background py-14 md:py-24">
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,#162B3B,#162B3B 1px,transparent 1px,transparent 72px),repeating-linear-gradient(90deg,#162B3B,#162B3B 1px,transparent 1px,transparent 72px)",
          }}
        />

        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-7 max-w-3xl">
              <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-accent/80 mb-5">
                Free checklist
              </p>
              <h1 className="font-serif text-4xl md:text-6xl text-primary leading-tight mb-6">
                A good plan can still be the wrong fit.
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed mb-8">
                The most expensive recovery mistake is often choosing support that looks reassuring, but does not match the real risk, routine, relapse pattern, or aftercare need.
              </p>
              <div className="space-y-4">
                {checklistItems.map((item) => (
                  <div key={item} className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" strokeWidth={1.7} />
                    <p className="text-muted-foreground leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="border border-border/60 bg-white p-7 md:p-8 shadow-sm">
                {isSuccess ? (
                  <div>
                    <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center mb-6">
                      <Mail className="w-5 h-5" strokeWidth={1.8} />
                    </div>
                    <h2 className="font-serif text-3xl text-primary leading-tight mb-4">
                      Check your email for the checklist.
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      We have sent the Recovery Plan Checklist to the email address you provided. If it does not arrive within a few minutes, check your junk folder.
                    </p>
                    <Link href="/contact">
                      <Button variant="outline" className="rounded-none h-11 px-6">
                        Speak confidentially
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <>
                    <h2 className="font-serif text-3xl text-primary leading-tight mb-3">
                      Get the one-page checklist
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                      Enter your details and we will email you the checklist privately.
                    </p>

                    {isError && (
                      <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 text-sm mb-5">
                        We could not send the checklist right now. Please try again shortly.
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
                      <div>
                        <label className="block text-sm font-medium text-primary mb-2" htmlFor="firstName">
                          First name
                        </label>
                        <Input
                          id="firstName"
                          value={firstName}
                          onChange={(event) => setFirstName(event.target.value)}
                          required
                          minLength={1}
                          maxLength={80}
                          className="rounded-none h-12"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary mb-2" htmlFor="email">
                          Email address
                        </label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(event) => setEmail(event.target.value)}
                          required
                          className="rounded-none h-12"
                        />
                      </div>
                      <label className="flex items-start gap-3 text-sm text-muted-foreground leading-relaxed">
                        <Checkbox checked={consent} onCheckedChange={(checked) => setConsent(checked === true)} className="mt-0.5" />
                        <span>
                          I consent to Insight Recovery Network emailing me this checklist and contacting me about relevant support. I understand I can opt out at any time.
                        </span>
                      </label>
                      <Button type="submit" disabled={isPending || !consent} className="rounded-none h-12 px-7 w-full">
                        {isPending ? "Sending..." : "Email me the checklist"}
                      </Button>
                    </form>

                    <div className="flex items-start gap-2 mt-5 text-xs text-muted-foreground/70 leading-relaxed">
                      <ShieldCheck className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" strokeWidth={1.7} />
                      <span>Private, confidential, and designed for reflection. This is not a diagnosis or emergency service.</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

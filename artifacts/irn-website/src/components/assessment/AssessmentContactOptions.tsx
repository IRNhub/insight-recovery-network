import { useState } from "react";
import { Link } from "wouter";
import type { AssessmentContactRequest, AuthoritativeAssessmentResult } from "@/types/assessment";

interface AssessmentContactOptionsProps {
  result: AuthoritativeAssessmentResult;
  suppressCommercialContact: boolean;
  onResultUpdate: (result: AuthoritativeAssessmentResult) => void;
}

export function AssessmentContactOptions({
  result,
  suppressCommercialContact,
  onResultUpdate,
}: AssessmentContactOptionsProps) {
  const [dismissed, setDismissed] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [emailResult, setEmailResult] = useState(false);
  const [irnFollowUp, setIrnFollowUp] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const hasExistingRequest = result.delivery.email !== "not-requested" || result.delivery.irnOs !== "not-requested";

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setMessage(null);
    if (!emailResult && !irnFollowUp && !marketing) {
      setMessage("Choose at least one optional contact purpose, or continue without contacting IRN.");
      return;
    }
    if (!email.trim()) {
      setMessage("Enter an email address for the selected option.");
      return;
    }
    if (irnFollowUp && !name.trim()) {
      setMessage("Enter your name if you would like IRN to follow up.");
      return;
    }

    const request: AssessmentContactRequest = {
      ...(name.trim() ? { name: name.trim() } : {}),
      email: email.trim(),
      ...(phone.trim() ? { phone: phone.trim() } : {}),
      permissions: { emailResult, irnFollowUp, marketing },
    };

    setSubmitting(true);
    try {
      const response = await fetch("/api/assessments/result/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });
      const payload = await response.json().catch(() => null) as { result?: AuthoritativeAssessmentResult; error?: string } | null;
      if (!response.ok || !payload?.result) throw new Error(payload?.error || "Contact preferences could not be saved");
      onResultUpdate(payload.result);
      setMessage("Your selected preferences were saved. The delivery status below reflects what could be confirmed.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Contact preferences could not be saved. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (dismissed) {
    return (
      <section className="border border-border/60 bg-white p-6 md:p-7">
        <h2 className="font-serif text-xl text-primary">Continue without contacting IRN</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          No contact permission was requested. Your core result remains available in this browser while the secure result cookie is valid.
        </p>
      </section>
    );
  }

  return (
    <section className="border border-border/60 bg-white p-6 md:p-7">
      <h2 className="font-serif text-2xl text-primary">Optional save and contact choices</h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Your result is already complete. These choices are optional and each permission is separate.
      </p>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        Emailing the result sends the result content through Resend. IRN follow-up sends your contact details and a derived clinical summary to IRNOS, but not your raw answers. See the{" "}
        <Link href="/privacy-policy" className="underline underline-offset-2">Privacy Policy</Link>.
      </p>

      {hasExistingRequest && (
        <p className="mt-4 border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
          Email status: {result.delivery.email}. IRN follow-up status: {result.delivery.irnOs}.
        </p>
      )}

      <form onSubmit={submit} className="mt-6 space-y-5">
        <label className="flex items-start gap-3 text-sm text-foreground">
          <input type="checkbox" checked={emailResult} onChange={(event) => setEmailResult(event.target.checked)} className="mt-1" />
          <span><strong>Email me this result.</strong> Permission applies only to sending this assessment result.</span>
        </label>

        {!suppressCommercialContact && (
          <>
            <label className="flex items-start gap-3 text-sm text-foreground">
              <input type="checkbox" checked={irnFollowUp} onChange={(event) => setIrnFollowUp(event.target.checked)} className="mt-1" />
              <span><strong>Ask IRN to discuss this result with me.</strong> This permits a direct follow-up about appropriate support or treatment-navigation options.</span>
            </label>
            <label className="flex items-start gap-3 text-sm text-foreground">
              <input type="checkbox" checked={marketing} onChange={(event) => setMarketing(event.target.checked)} className="mt-1" />
              <span><strong>Optional marketing permission.</strong> This separately permits occasional information about IRN services. It is not required for an emailed result or IRN follow-up.</span>
            </label>
          </>
        )}

        {(emailResult || irnFollowUp || marketing) && (
          <div className="grid gap-4 sm:grid-cols-2">
            {irnFollowUp && (
              <label className="text-sm text-foreground">
                Name
                <input value={name} onChange={(event) => setName(event.target.value)} maxLength={120} autoComplete="name" className="mt-1 h-11 w-full border border-input px-3" required />
              </label>
            )}
            <label className="text-sm text-foreground">
              Email
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} maxLength={254} autoComplete="email" className="mt-1 h-11 w-full border border-input px-3" required />
            </label>
            {irnFollowUp && (
              <label className="text-sm text-foreground">
                Phone, optional
                <input type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} maxLength={80} autoComplete="tel" className="mt-1 h-11 w-full border border-input px-3" />
              </label>
            )}
          </div>
        )}

        {message && <p role="status" className="text-sm leading-relaxed text-muted-foreground">{message}</p>}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button type="submit" disabled={submitting} className="bg-primary px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">
            {submitting ? "Saving preferences…" : "Save selected preferences"}
          </button>
          <button type="button" onClick={() => setDismissed(true)} className="border border-border px-5 py-3 text-sm font-semibold text-primary">
            Continue without contacting IRN
          </button>
        </div>
      </form>
    </section>
  );
}

import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";
import { hasConsent } from "@/lib/consent";
import { readEnquiryAttribution } from "@/lib/enquiry-attribution";

type Method = "phone" | "email" | "whatsapp";
type FieldErrors = Record<string, string>;
const inputClass =
  "mt-2 block min-h-12 w-full rounded-md border border-input bg-white px-3 py-3 text-base text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

export function EnquiryForm({
  variant = "contact",
}: {
  variant?: "get-help" | "contact";
}) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const [location, navigate] = useLocation();
  const [method, setMethod] = useState<Method>("phone");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const submitting = useRef(false);
  const submissionId = useRef<string | undefined>(undefined);
  const lastPayload = useRef("");
  const trackedStart = useRef(false);
  const errorRef = useRef<HTMLDivElement>(null);
  const formName =
    variant === "get-help" ? "get_help_consultation" : "confidential_enquiry";

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    const form = event.currentTarget;
    const values = new FormData(form);
    const get = (name: string) => String(values.get(name) ?? "").trim();
    const contactNotes = [
      get("safeContact")
        ? `Safe contact / preferred time: ${get("safeContact")}`
        : "",
      method === "phone"
        ? `Voicemail: ${values.get("voicemail") ? "permission to leave a message" : "do not leave a message"}`
        : "",
    ]
      .filter(Boolean)
      .join("\n");
    const payload = {
      name: get("name"),
      email: method === "email" ? get("email") : "",
      phone: method === "email" ? "" : get("phone"),
      preferredContact: method,
      supportType: get("supportType") || "general",
      serviceInterest: get("serviceInterest") || "not-sure",
      message: [contactNotes, get("message")].filter(Boolean).join("\n\n"),
      consent: values.get("consent") === "on",
      website: get("website"),
      pageSource: location,
      ...readEnquiryAttribution(hasConsent("analytics")),
    };
    // Retry an unchanged request with the same key; edited content is a new request.
    const serialised = JSON.stringify(payload);
    if (!submissionId.current || lastPayload.current !== serialised)
      submissionId.current = crypto.randomUUID();
    lastPayload.current = serialised;
    submitting.current = true;
    setPending(true);
    setError("");
    setFieldErrors({});
    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          submissionId: submissionId.current,
        }),
        signal: AbortSignal.timeout(20_000),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || !Number.isSafeInteger(result?.id) || result.id < 1) {
        if (response.status === 422 && Array.isArray(result?.details)) {
          setFieldErrors(
            Object.fromEntries(
              result.details
                .filter(
                  (d: { field?: unknown; message?: unknown }) =>
                    typeof d.field === "string" &&
                    typeof d.message === "string",
                )
                .map((d: { field: string; message: string }) => [
                  d.field,
                  d.message,
                ]),
            ),
          );
        }
        throw new Error(
          response.status === 429
            ? "We have received several requests from this connection. Please wait a little before trying again, or contact us directly."
            : "Your enquiry has not been confirmed. Please check the details and try again, or contact us directly.",
        );
      }
      // Success requires a persisted server receipt. A 204 or arbitrary OK is not enough.
      trackEvent(
        variant === "get-help"
          ? "consultation_form_submit"
          : "contact_form_submit",
        { form_name: formName },
      );
      navigate("/thank-you");
    } catch (cause) {
      setError(
        cause instanceof Error &&
          !["TimeoutError", "AbortError"].includes(cause.name)
          ? cause.message
          : "We could not confirm receipt just now. Please try again, or contact us directly.",
      );
      submitting.current = false;
      requestAnimationFrame(() => errorRef.current?.focus());
    } finally {
      setPending(false);
    }
  }

  const message = (field: string) =>
    fieldErrors[field] ? (
      <p id={`enquiry-${field}-error`} className="mt-2 text-sm text-red-800">
        {fieldErrors[field]}
      </p>
    ) : null;
  return (
    <div
      id="book"
      className="scroll-mt-28 rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-8"
    >
      <h2 className="font-serif text-2xl text-primary">
        Request a private conversation
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Share as much or as little as you feel comfortable with. Fields marked *
        are required.
      </p>
      <noscript>
        <p className="mt-4 text-sm text-primary">
          To send this form, please enable JavaScript. You can also call or
          email us using the details on this page.
        </p>
      </noscript>
      <form
        method="post"
        action="/api/enquiries"
        inert={!ready}
        onSubmit={submit}
        onFocusCapture={() => {
          if (!trackedStart.current) {
            trackedStart.current = true;
            trackEvent(
              variant === "get-help"
                ? "consultation_form_start"
                : "contact_form_start",
              { form_name: formName },
            );
          }
        }}
        className="mt-6 space-y-5"
        aria-busy={pending}
      >
        <div className="sr-only" aria-hidden="true">
          <label>
            Leave this field empty
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        {error && (
          <div
            ref={errorRef}
            tabIndex={-1}
            role="alert"
            className="rounded-md border border-red-200 bg-red-50 p-4 text-sm leading-relaxed text-red-900"
          >
            {error}
            <p className="mt-2">
              <a className="underline" href="tel:+447415994475">
                Call IRN
              </a>{" "}
              or{" "}
              <a
                className="underline"
                href="mailto:info@insightrecoverynetwork.com"
              >
                email us
              </a>
              .
            </p>
          </div>
        )}
        <label
          className="block text-sm font-semibold text-primary"
          htmlFor="enquiry-name"
        >
          Your name *
          <input
            id="enquiry-name"
            name="name"
            autoComplete="name"
            required
            minLength={2}
            maxLength={120}
            className={inputClass}
            aria-invalid={!!fieldErrors.name}
            aria-describedby={
              fieldErrors.name ? "enquiry-name-error" : undefined
            }
          />
          {message("name")}
        </label>
        <fieldset>
          <legend className="text-sm font-semibold text-primary">
            How would you like us to contact you? *
          </legend>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {(["phone", "email", "whatsapp"] as const).map((value) => (
              <label
                key={value}
                className={`flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-md border px-2 text-sm ${method === value ? "border-primary bg-primary text-white" : "border-input text-primary"}`}
              >
                <input
                  className="accent-current"
                  type="radio"
                  name="preferredContact"
                  value={value}
                  checked={method === value}
                  onChange={() => setMethod(value)}
                />
                {value === "phone"
                  ? "Call"
                  : value === "email"
                    ? "Email"
                    : "WhatsApp"}
              </label>
            ))}
          </div>
        </fieldset>
        {method === "email" ? (
          <label
            className="block text-sm font-semibold text-primary"
            htmlFor="enquiry-email"
          >
            Email address *
            <input
              key="email"
              id="enquiry-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              className={inputClass}
              aria-invalid={!!fieldErrors.email}
              aria-describedby={
                fieldErrors.email ? "enquiry-email-error" : undefined
              }
            />
            {message("email")}
          </label>
        ) : (
          <label
            className="block text-sm font-semibold text-primary"
            htmlFor="enquiry-phone"
          >
            {method === "whatsapp" ? "WhatsApp number" : "Telephone number"} *
            <input
              key="phone"
              id="enquiry-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              required
              minLength={7}
              maxLength={35}
              title="Use your telephone number including the country code if outside the UK."
              className={inputClass}
              aria-invalid={!!fieldErrors.phone}
              aria-describedby={`enquiry-phone-hint${fieldErrors.phone ? " enquiry-phone-error" : ""}`}
            />
            <span
              id="enquiry-phone-hint"
              className="mt-2 block text-xs font-normal text-muted-foreground"
            >
              Include the country code if you are outside the UK.
            </span>
            {message("phone")}
          </label>
        )}
        <div className="grid gap-5 sm:grid-cols-2">
          <label
            className="block text-sm font-semibold text-primary"
            htmlFor="enquiry-support"
          >
            Who is the help for?
            <select
              id="enquiry-support"
              name="supportType"
              defaultValue="general"
              className={inputClass}
            >
              <option value="general">Prefer not to say yet</option>
              <option value="myself">Myself</option>
              <option value="someone-else">Someone I care about</option>
              <option value="professional">A professional enquiry</option>
            </select>
          </label>
          <label
            className="block text-sm font-semibold text-primary"
            htmlFor="enquiry-service"
          >
            What would you like help with?
            <select
              id="enquiry-service"
              name="serviceInterest"
              defaultValue="not-sure"
              className={inputClass}
            >
              <option value="not-sure">I am not sure yet</option>
              <option value="treatment-placement">
                Private rehab / detox options
              </option>
              <option value="family-support">
                Family support / intervention
              </option>
              <option value="online-programme">Online recovery support</option>
              <option value="insight-os">InsightOS</option>
              <option value="professional">Professional partnership</option>
            </select>
          </label>
        </div>
        <label
          className="block text-sm font-semibold text-primary"
          htmlFor="enquiry-message"
        >
          Anything you would like us to know?{" "}
          <span className="font-normal">(optional)</span>
          <textarea
            id="enquiry-message"
            name="message"
            rows={3}
            maxLength={2000}
            className={inputClass}
            aria-describedby="enquiry-message-hint"
          />
          <span
            id="enquiry-message-hint"
            className="mt-2 block text-xs font-normal text-muted-foreground"
          >
            Please avoid sending medical records or detailed information about
            another person.
          </span>
          {message("message")}
        </label>
        <details className="rounded-md border border-border p-4">
          <summary className="cursor-pointer text-sm font-semibold text-primary">
            A suitable time or a safer way to contact you
          </summary>
          <label
            htmlFor="enquiry-safe-contact"
            className="mt-4 block text-sm text-primary"
          >
            Contact preferences (optional)
            <input
              id="enquiry-safe-contact"
              name="safeContact"
              maxLength={300}
              className={inputClass}
              placeholder="For example, weekdays after 3pm"
            />
          </label>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            We will take these preferences into account. This does not book a
            specific appointment.
          </p>
        </details>
        {method === "phone" && (
          <label className="flex items-start gap-3 text-sm leading-relaxed text-primary">
            <input
              type="checkbox"
              name="voicemail"
              className="mt-1 h-4 w-4 shrink-0 accent-primary"
            />
            You may leave a voicemail if I do not answer.{" "}
            <span className="sr-only">Optional</span>
          </label>
        )}
        <label className="flex items-start gap-3 text-sm leading-relaxed text-primary">
          <input
            type="checkbox"
            name="consent"
            required
            className="mt-1 h-4 w-4 shrink-0 accent-primary"
          />
          <span>
            I agree that IRN can use my details to respond to this enquiry, as
            explained in the{" "}
            <Link
              href="/privacy-policy"
              className="underline underline-offset-2"
            >
              privacy policy
            </Link>
            . *
          </span>
        </label>
        <Button
          type="submit"
          disabled={pending || !ready}
          className="h-auto min-h-12 w-full whitespace-normal rounded-md px-5 py-3"
        >
          {pending ? (
            <>
              <Loader2
                className="h-4 w-4 animate-spin motion-reduce:animate-none"
                aria-hidden="true"
              />
              Sending your request…
            </>
          ) : (
            <>
              Request a private conversation
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </>
          )}
        </Button>
        <p className="text-xs leading-relaxed text-muted-foreground">
          We respond during our working hours. This form is not monitored as an
          emergency service.
        </p>
      </form>
    </div>
  );
}

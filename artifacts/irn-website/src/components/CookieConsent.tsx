import { useEffect, useState } from "react";
import { Link } from "wouter";
import {
  CONSENT_CHANGED_EVENT,
  getConsentPreferences,
  hasStoredConsent,
  saveConsentPreferences,
} from "@/lib/consent";

export const OPEN_COOKIE_SETTINGS_EVENT = "irn:open-cookie-settings";

export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS_EVENT));
}

export function CookieConsent() {
  const initial = getConsentPreferences();
  const [open, setOpen] = useState(() => !hasStoredConsent());
  const [showDetails, setShowDetails] = useState(false);
  const [analytics, setAnalytics] = useState(initial.analytics);
  const [preferredSources, setPreferredSources] = useState(initial.preferredSources);
  const [marketing, setMarketing] = useState(initial.marketing);

  useEffect(() => {
    const reopen = () => {
      const current = getConsentPreferences();
      setAnalytics(current.analytics);
      setPreferredSources(current.preferredSources);
      setMarketing(current.marketing);
      setShowDetails(true);
      setOpen(true);
    };
    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, reopen);
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, reopen);
  }, []);

  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener(CONSENT_CHANGED_EVENT, close);
    return () => window.removeEventListener(CONSENT_CHANGED_EVENT, close);
  }, []);

  if (!open) return null;

  function save(values: {
    analytics: boolean;
    preferredSources: boolean;
    marketing: boolean;
  }) {
    const { requiresReload } = saveConsentPreferences(values);
    setOpen(false);
    if (requiresReload) window.location.reload();
  }

  return (
    <section
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-consent-title"
      className="fixed inset-x-0 bottom-0 z-[100] border-t border-white/15 bg-primary text-primary-foreground shadow-[0_-12px_40px_rgba(0,0,0,0.25)]"
    >
      <div className="container mx-auto max-w-5xl px-6 py-6 md:px-12">
        <div className="flex flex-col gap-5">
          <div>
            <h2 id="cookie-consent-title" className="font-serif text-xl font-medium text-white">
              Your privacy choices
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-white/75">
              Necessary storage keeps the site working. With your permission, analytics helps us
              understand site use, Preferred Sources enables Google&apos;s optional publisher control,
              and marketing enables advertising technology. All are off by default. Forms, phone,
              email and WhatsApp work without them. Read our{" "}
              <Link href="/cookie-policy" className="underline underline-offset-2 hover:text-accent">
                Cookie Policy
              </Link>.
            </p>
          </div>

          {showDetails && (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              <ConsentChoice
                label="Necessary"
                description="Consent record, security and essential site operation. Always on."
                checked
                disabled
                onChange={() => undefined}
              />
              <ConsentChoice
                label="Analytics"
                description="Google Tag Manager and consented, aggregate GA4 measurement."
                checked={analytics}
                onChange={setAnalytics}
              />
              <ConsentChoice
                label="Preferred Sources"
                description="Google's optional publisher control, which receives the current page URL and may use your Google session."
                checked={preferredSources}
                onChange={setPreferredSources}
              />
              <ConsentChoice
                label="Marketing"
                description="Meta Pixel and advertising tags. No automatic health-page events."
                checked={marketing}
                onChange={setMarketing}
              />
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              onClick={() =>
                save({ analytics: true, preferredSources: true, marketing: true })
              }
              className="min-h-11 border border-accent bg-accent px-5 py-2.5 text-sm font-semibold text-primary hover:bg-accent/90"
            >
              Accept all
            </button>
            <button
              type="button"
              onClick={() =>
                save({ analytics: false, preferredSources: false, marketing: false })
              }
              className="min-h-11 border border-white/70 bg-transparent px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
            >
              Reject non-essential
            </button>
            {showDetails ? (
              <button
                type="button"
                onClick={() => save({ analytics, preferredSources, marketing })}
                className="min-h-11 border border-white/25 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/15"
              >
                Save choices
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowDetails(true)}
                className="min-h-11 px-2 py-2.5 text-sm font-semibold text-white underline underline-offset-4"
              >
                Choose settings
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
interface ConsentChoiceProps {
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}

function ConsentChoice({ label, description, checked, disabled, onChange }: ConsentChoiceProps) {
  return (
    <label className="flex cursor-pointer gap-3 border border-white/15 bg-white/5 p-4">
      <input
        type="checkbox"
        className="mt-1 h-4 w-4 accent-[#C9A96E]"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span>
        <span className="block text-sm font-semibold text-white">{label}</span>
        <span className="mt-1 block text-xs leading-relaxed text-white/65">{description}</span>
      </span>
    </label>
  );
}

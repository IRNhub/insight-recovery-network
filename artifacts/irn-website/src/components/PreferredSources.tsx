import { useEffect, useId, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { CONSENT_CHANGED_EVENT, getConsentPreferences } from "@/lib/consent";

const GOOGLE_PUBLISHER_SCRIPT_ID = "google-preferred-sources-publisher";
const GOOGLE_PUBLISHER_SCRIPT_SRC = "https://news.google.com/swg/js/v1/publisher.js";
const GOOGLE_PREFERRED_SOURCES_ORIGIN = "https://news.google.com";
const GOOGLE_ADD_PREFERRED_SOURCE_REQUEST = "AddPreferredSourceRequest";

export const IRN_PREFERRED_SOURCE_DEEPLINK =
  "https://www.google.com/preferences/source?q=insightrecoverynetwork.com";

export const PREFERRED_SOURCES_PAGE_ROUTES = [
  "/",
  "/about",
  "/about-insight-recovery-network",
  "/what-we-offer",
  "/treatment-placement",
  "/online-programme",
  "/online-addiction-recovery-programme-uk",
  "/private-rehab-alternative-uk",
  "/private-rehab-uk",
  "/how-much-does-rehab-cost-uk",
  "/addiction-help-cornwall",
  "/family-addiction-intervention-uk",
  "/confidential-addiction-help-professionals",
  "/resources",
  "/assessments",
  "/editorial-policy",
  "/media",
  "/luxury-rehab",
  "/executive-rehab",
  "/destination-rehab",
  "/alcohol-addiction-treatment",
  "/cocaine-addiction-treatment",
  "/cannabis-addiction-treatment",
  "/ketamine-addiction-treatment",
  "/benzodiazepine-addiction-treatment",
  "/prescription-drug-addiction-treatment",
  "/dual-diagnosis-treatment",
  "/private-rehab-thailand",
  "/private-rehab-south-africa",
  "/private-rehab-spain",
  "/private-rehab-sri-lanka",
] as const;

const preferredSourcesPageRoutes = new Set<string>(PREFERRED_SOURCES_PAGE_ROUTES);

function buttonLocation(pathname: string) {
  if (pathname === "/resources") return "resources_page";
  if (pathname.startsWith("/resources/")) return "article_page";
  return "other";
}

function isGoogleAddPreferredSourceRequest(data: unknown) {
  if (!data || typeof data !== "object") return false;
  const activity = data as {
    sentinel?: unknown;
    cmd?: unknown;
    payload?: { RESPONSE?: unknown };
  };
  const response = activity.payload?.RESPONSE;
  return (
    activity.sentinel === "__ACTIVITIES__" &&
    activity.cmd === "msg" &&
    Array.isArray(response) &&
    response[0] === GOOGLE_ADD_PREFERRED_SOURCE_REQUEST
  );
}

function trackPreferredSourceActivation() {
  trackEvent("preferred_source_click", {
    page_location: `${window.location.origin}${window.location.pathname}`,
    button_location: buttonLocation(window.location.pathname),
    destination_url: IRN_PREFERRED_SOURCE_DEEPLINK,
  });
}

interface PreferredSourceApi {
  init(options?: { lang?: string; theme?: "light" | "dark" }): void;
}

type PreferredSourceCallback = (api: PreferredSourceApi) => void;

interface PreferredSourceQueue {
  push(...callbacks: PreferredSourceCallback[]): unknown;
}

declare global {
  interface Window {
    PREFERRED_SOURCE?: PreferredSourceCallback[] | PreferredSourceQueue;
  }
}

export function shouldShowPreferredSources(pathname: string) {
  const normalisedPath =
    pathname !== "/" && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  return preferredSourcesPageRoutes.has(normalisedPath);
}

function queueGoogleButtonInitialisation() {
  const initialise: PreferredSourceCallback = (preferredSource) => {
    // Google marks each declarative container as initialised, so this safely
    // discovers a new button after an in-app route change without duplicating it.
    preferredSource.init();
  };

  const queue = window.PREFERRED_SOURCE;
  if (queue && !Array.isArray(queue)) {
    queue.push(initialise);
    return;
  }

  window.PREFERRED_SOURCE = [...(queue ?? []), initialise];
}

function loadGooglePublisherScript(onError: () => void) {
  queueGoogleButtonInitialisation();

  const existing = document.getElementById(
    GOOGLE_PUBLISHER_SCRIPT_ID,
  ) as HTMLScriptElement | null;
  if (existing) {
    if (existing.dataset.loadError === "true") onError();
    else existing.addEventListener("error", onError, { once: true });
    return () => existing.removeEventListener("error", onError);
  }

  const script = document.createElement("script");
  script.id = GOOGLE_PUBLISHER_SCRIPT_ID;
  script.async = true;
  script.src = GOOGLE_PUBLISHER_SCRIPT_SRC;
  script.dataset.irnPreferredSources = "true";
  const handleError = () => {
    script.dataset.loadError = "true";
    onError();
  };
  script.addEventListener("error", handleError, { once: true });
  document.head.appendChild(script);

  return () => script.removeEventListener("error", handleError);
}

export function PreferredSources() {
  const headingId = useId();
  const descriptionId = useId();
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const [preferredSourcesConsent, setPreferredSourcesConsent] = useState(
    () => getConsentPreferences().preferredSources,
  );
  const [scriptFailed, setScriptFailed] = useState(false);

  useEffect(() => {
    const handleConsentChange = (event: Event) => {
      const preferences = (event as CustomEvent<{ preferredSources: boolean }>).detail;
      setPreferredSourcesConsent(preferences.preferredSources);
    };
    window.addEventListener(CONSENT_CHANGED_EVENT, handleConsentChange);
    return () => window.removeEventListener(CONSENT_CHANGED_EVENT, handleConsentChange);
  }, []);

  useEffect(() => {
    if (!preferredSourcesConsent) return;
    setScriptFailed(false);
    return loadGooglePublisherScript(() => setScriptFailed(true));
  }, [preferredSourcesConsent]);

  useEffect(() => {
    if (!preferredSourcesConsent) return;

    const handleGoogleMessage = (event: MessageEvent) => {
      if (event.origin !== GOOGLE_PREFERRED_SOURCES_ORIGIN) return;
      const buttonIframe = googleButtonRef.current?.querySelector("iframe");
      if (!buttonIframe || event.source !== buttonIframe.contentWindow) return;
      if (!isGoogleAddPreferredSourceRequest(event.data)) return;
      trackPreferredSourceActivation();
    };

    window.addEventListener("message", handleGoogleMessage);
    return () => window.removeEventListener("message", handleGoogleMessage);
  }, [preferredSourcesConsent]);

  return (
    <section
      className="border-y border-border/40 bg-secondary/20 py-10 md:py-12"
      aria-labelledby={headingId}
      data-testid="preferred-sources-section"
    >
      <div className="container mx-auto px-6 md:px-12">
        <div className="mx-auto grid max-w-5xl items-center gap-7 border border-border/50 bg-background p-6 shadow-sm sm:p-8 md:grid-cols-[minmax(0,1fr)_minmax(240px,320px)] md:gap-10">
          <div>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
              Google Preferred Sources
            </p>
            <h2 id={headingId} className="font-serif text-2xl leading-tight text-primary md:text-3xl">
              Make Insight Recovery Network one of your preferred sources.
            </h2>
            <p id={descriptionId} className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
              Find more evidence-based addiction and mental health guidance from Insight Recovery Network on Google.
            </p>
          </div>

          <div className="flex min-h-[60px] w-full items-center md:justify-end">
            {preferredSourcesConsent && !scriptFailed ? (
              <div
                ref={googleButtonRef}
                {...{ "google-add-preferred-source-btn": "" }}
                data-theme="light"
                className="w-full max-w-[320px]"
                aria-describedby={descriptionId}
                data-testid="google-preferred-sources-button"
              />
            ) : (
              <a
                href={IRN_PREFERRED_SOURCE_DEEPLINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 w-full max-w-[320px] items-center justify-center border border-primary bg-primary px-5 py-3 text-center text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                aria-describedby={descriptionId}
                data-testid="preferred-sources-deeplink"
                onClick={trackPreferredSourceActivation}
              >
                Open Google Source Preferences
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

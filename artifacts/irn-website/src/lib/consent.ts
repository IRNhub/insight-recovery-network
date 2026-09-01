export type ConsentCategory =
  | "necessary"
  | "analytics"
  | "preferredSources"
  | "marketing";

export interface ConsentPreferences {
  necessary: true;
  analytics: boolean;
  preferredSources: boolean;
  marketing: boolean;
  version: 2;
  updatedAt: string;
}

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown> | IArguments>;
    fbq?: (...args: unknown[]) => void;
    _fbq?: (...args: unknown[]) => void;
  }
}

const STORAGE_KEY = "irn_cookie_consent_v2";
const LEGACY_STORAGE_KEY = "irn_cookie_consent_v1";
export const CONSENT_CHANGED_EVENT = "irn:consent-changed";
const GTM_ID = "GTM-59F8HXNV";
const META_PIXEL_ID = "984528117299181";

const DEFAULT_CONSENT: ConsentPreferences = {
  necessary: true,
  analytics: false,
  preferredSources: false,
  marketing: false,
  version: 2,
  updatedAt: "",
};

let gtmLoaded = false;
let metaLoaded = false;

function gtag(...args: unknown[]) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(arguments);
}

function storedPreferences(): ConsentPreferences | null {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    if (!value) return null;
    const parsed = JSON.parse(value) as Partial<ConsentPreferences>;
    if (
      parsed.version !== 2 ||
      typeof parsed.analytics !== "boolean" ||
      typeof parsed.preferredSources !== "boolean" ||
      typeof parsed.marketing !== "boolean"
    ) {
      return null;
    }
    return {
      necessary: true,
      analytics: parsed.analytics,
      preferredSources: parsed.preferredSources,
      marketing: parsed.marketing,
      version: 2,
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : "",
    };
  } catch {
    return null;
  }
}

export function hasStoredConsent() {
  return typeof window !== "undefined" && storedPreferences() !== null;
}

export function getConsentPreferences(): ConsentPreferences {
  if (typeof window === "undefined") return DEFAULT_CONSENT;
  return storedPreferences() ?? DEFAULT_CONSENT;
}

export function hasConsent(category: Exclude<ConsentCategory, "necessary">) {
  return getConsentPreferences()[category];
}

function setGoogleConsent(preferences: ConsentPreferences, command: "default" | "update") {
  gtag("consent", command, {
    analytics_storage: preferences.analytics ? "granted" : "denied",
    ad_storage: preferences.marketing ? "granted" : "denied",
    // Addiction-treatment browsing can imply special-category information.
    // Keep Google advertising user-data and personalisation disabled even when
    // the visitor permits basic marketing measurement.
    ad_user_data: "denied",
    ad_personalization: "denied",
    functionality_storage: "granted",
    security_storage: "granted",
    wait_for_update: command === "default" ? 500 : undefined,
  });
}

function loadGoogleTagManager() {
  if (gtmLoaded || document.querySelector(`script[data-irn-gtm="${GTM_ID}"]`)) return;
  gtmLoaded = true;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
  script.dataset.irnGtm = GTM_ID;
  document.head.appendChild(script);
}

function loadMetaPixel() {
  if (metaLoaded || document.querySelector(`script[data-irn-meta="${META_PIXEL_ID}"]`)) return;
  metaLoaded = true;

  const fbq = function (...args: unknown[]) {
    const queueingFbq = fbq as typeof fbq & {
      callMethod?: (...values: unknown[]) => void;
      queue: unknown[][];
      loaded: boolean;
      version: string;
      push: (...values: unknown[]) => void;
    };
    if (queueingFbq.callMethod) queueingFbq.callMethod(...args);
    else queueingFbq.queue.push(args);
  } as typeof window.fbq & {
    queue: unknown[][];
    loaded: boolean;
    version: string;
    push: (...values: unknown[]) => void;
  };

  fbq.queue = [];
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.push = fbq;
  window.fbq = fbq;
  window._fbq = fbq;

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_GB/fbevents.js";
  script.dataset.irnMeta = META_PIXEL_ID;
  document.head.appendChild(script);

  // Initialise only. Automatic PageView and health-context conversion events
  // are deliberately disabled because Meta Pixel requests can disclose the
  // current URL and page title to an advertising platform.
  window.fbq("init", META_PIXEL_ID);
}

function applyConsent(preferences: ConsentPreferences, command: "default" | "update") {
  setGoogleConsent(preferences, command);

  // GTM is non-essential and is loaded only when at least one Google-controlled
  // category has been granted. Container tags must also require their matching
  // Consent Mode category.
  if (preferences.analytics || preferences.marketing) loadGoogleTagManager();
  if (preferences.marketing) loadMetaPixel();
}

export function initialiseConsent() {
  if (typeof window === "undefined") return;
  const preferences = getConsentPreferences();
  setGoogleConsent(DEFAULT_CONSENT, "default");
  if (hasStoredConsent()) applyConsent(preferences, "update");
}

export function saveConsentPreferences(
  values: Pick<ConsentPreferences, "analytics" | "preferredSources" | "marketing">,
) {
  const previous = getConsentPreferences();
  const preferences: ConsentPreferences = {
    necessary: true,
    analytics: values.analytics,
    preferredSources: values.preferredSources,
    marketing: values.marketing,
    version: 2,
    updatedAt: new Date().toISOString(),
  };

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    window.localStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch {
    // Consent remains effective for this page even if storage is unavailable.
  }

  applyConsent(preferences, "update");
  window.dispatchEvent(
    new CustomEvent<ConsentPreferences>(CONSENT_CHANGED_EVENT, { detail: preferences }),
  );

  return {
    preferences,
    requiresReload:
      (previous.analytics && !preferences.analytics) ||
      (previous.preferredSources && !preferences.preferredSources) ||
      (previous.marketing && !preferences.marketing),
  };
}

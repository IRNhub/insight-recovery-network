import { hasConsent } from "@/lib/consent";

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown> | IArguments>;
  }
}

type AnalyticsValue = string | number | boolean | undefined;

export type AnalyticsEvent =
  | "spa_page_view"
  | "consultation_form_start"
  | "consultation_form_submit"
  | "contact_form_start"
  | "contact_form_submit"
  | "assessment_start"
  | "assessment_complete"
  | "phone_click"
  | "whatsapp_click"
  | "email_click"
  | "book_consultation_click"
  | "get_help_click"
  | "pricing_guide_view"
  | "treatment_placement_enquiry"
  | "online_programme_enquiry"
  | "family_support_enquiry"
  | "not_found_view";

export type ConversionEvent = Exclude<AnalyticsEvent, "spa_page_view">;

const SENSITIVE_PARAMETER =
  /(^|_)(name|email|phone|message|answer|response|clinical|diagnosis|score|result|risk|symptom|substance|assessment_type|free_text)(_|$)/i;
const recentEvents = new Map<string, number>();
let lastPageViewPath = "";

function deviceCategory() {
  if (window.matchMedia("(max-width: 767px)").matches) return "mobile";
  if (window.matchMedia("(max-width: 1023px)").matches) return "tablet";
  return "desktop";
}

function trafficSource() {
  const params = new URLSearchParams(window.location.search);
  const medium = (params.get("utm_medium") ?? "").toLowerCase();
  if (/cpc|ppc|paid|display/.test(medium)) return "paid";
  if (/social/.test(medium)) return "social";

  if (!document.referrer) return "direct_or_unknown";
  try {
    const referrer = new URL(document.referrer);
    if (referrer.origin === window.location.origin) return "internal";
    if (/google\.|bing\.|duckduckgo\.|yahoo\./i.test(referrer.hostname)) return "organic_search";
    if (/facebook\.|instagram\.|linkedin\.|t\.co$/i.test(referrer.hostname)) return "social";
    return "referral";
  } catch {
    return "direct_or_unknown";
  }
}

function safeParameters(parameters: Record<string, AnalyticsValue>) {
  return Object.fromEntries(
    Object.entries(parameters).filter(
      ([key, value]) =>
        !SENSITIVE_PARAMETER.test(key) &&
        value !== undefined &&
        (typeof value === "boolean" || typeof value === "number" || value.length <= 120),
    ),
  );
}

function eventFingerprint(event: AnalyticsEvent, parameters: Record<string, AnalyticsValue>) {
  return [
    event,
    window.location.pathname,
    parameters.form_name,
    parameters.cta_location,
    parameters.service_interest,
  ].join("|");
}

/**
 * Push a consented, privacy-screened event to GTM. Nothing is queued before
 * analytics consent, so a later opt-in cannot replay pre-consent behaviour.
 */
export function trackEvent(
  event: AnalyticsEvent,
  parameters: Record<string, AnalyticsValue> = {},
) {
  if (typeof window === "undefined" || !hasConsent("analytics")) return false;

  const filtered = safeParameters(parameters);
  const fingerprint = eventFingerprint(event, filtered);
  const now = Date.now();
  if (now - (recentEvents.get(fingerprint) ?? 0) < 1_000) return false;
  recentEvents.set(fingerprint, now);

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event,
    page_path: window.location.pathname,
    page_title: document.title,
    device_category: deviceCategory(),
    traffic_source: trafficSource(),
    ...filtered,
  });
  return true;
}

export function trackPageView() {
  if (typeof window === "undefined" || !hasConsent("analytics")) return false;
  const path = window.location.pathname;
  if (lastPageViewPath === path) return false;
  const tracked = trackEvent("spa_page_view");
  if (tracked) lastPageViewPath = path;
  return tracked;
}

function normaliseText(value: string | null | undefined) {
  return value?.replace(/\s+/g, " ").trim().slice(0, 120) || undefined;
}

function safeLinkTarget(anchor: HTMLAnchorElement) {
  const rawHref = anchor.getAttribute("href") ?? "";
  if (rawHref.startsWith("tel:")) return "telephone";
  if (rawHref.startsWith("mailto:")) return "email";

  try {
    const url = new URL(anchor.href, window.location.origin);
    return url.origin === window.location.origin ? url.pathname : url.hostname;
  } catch {
    return undefined;
  }
}

function isAnalyticsEvent(value: string): value is AnalyticsEvent {
  return [
    "spa_page_view",
    "consultation_form_start",
    "consultation_form_submit",
    "contact_form_start",
    "contact_form_submit",
    "assessment_start",
    "assessment_complete",
    "phone_click",
    "whatsapp_click",
    "email_click",
    "book_consultation_click",
    "get_help_click",
    "pricing_guide_view",
    "treatment_placement_enquiry",
    "online_programme_enquiry",
    "family_support_enquiry",
    "not_found_view",
  ].includes(value);
}

function inferredCtaEvent(anchor: HTMLAnchorElement): AnalyticsEvent | undefined {
  const rawHref = anchor.getAttribute("href") ?? "";
  const label = normaliseText(anchor.textContent)?.toLowerCase() ?? "";

  if (rawHref.startsWith("tel:")) return "phone_click";
  if (rawHref.startsWith("mailto:")) return "email_click";
  if (/^(https?:\/\/)?(wa\.me|api\.whatsapp\.com)\//i.test(rawHref)) return "whatsapp_click";

  try {
    const url = new URL(anchor.href, window.location.origin);
    const pathname = url.pathname.replace(/\/$/, "") || "/";
    if (pathname === "/services-pricing-guide") return "pricing_guide_view";
    if (pathname === "/get-help") return "get_help_click";
    if (pathname === "/contact" && /book|call|speak|contact|enquir|discuss/.test(label)) {
      return "book_consultation_click";
    }
  } catch {
    return undefined;
  }

  return undefined;
}

/** One delegated listener covers links rendered now or after a route change. */
export function installLeadClickTracking() {
  if (typeof document === "undefined") return () => undefined;

  const handleClick = (event: MouseEvent) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const anchor = target.closest("a[href]");
    if (!(anchor instanceof HTMLAnchorElement)) return;

    const explicitEvent = anchor.dataset.analyticsEvent;
    const eventName =
      explicitEvent && isAnalyticsEvent(explicitEvent)
        ? explicitEvent
        : inferredCtaEvent(anchor);
    if (!eventName) return;

    trackEvent(eventName, {
      link_target: safeLinkTarget(anchor),
      cta_location: normaliseText(anchor.dataset.ctaLocation),
      service_interest: normaliseText(anchor.dataset.serviceInterest),
    });
  };

  document.addEventListener("click", handleClick, { capture: true });
  return () => document.removeEventListener("click", handleClick, { capture: true });
}

export function safeReferrerPath(referrer: string) {
  if (!referrer) return "direct_or_unknown";
  try {
    const url = new URL(referrer);
    return url.origin === window.location.origin ? url.pathname : url.hostname;
  } catch {
    return "invalid_or_unknown";
  }
}

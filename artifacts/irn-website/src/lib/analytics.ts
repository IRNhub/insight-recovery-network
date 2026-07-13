declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

type AnalyticsValue = string | number | boolean | undefined;

export function trackEvent(
  event: string,
  parameters: Record<string, AnalyticsValue> = {},
) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event,
    page_path: window.location.pathname,
    ...parameters,
  });
}

const CTA_EVENTS: Record<string, string> = {
  "/treatment-placement": "treatment_placement_cta_click",
  "/online-programme": "online_programme_cta_click",
  "/online-addiction-recovery-programme-uk": "online_programme_cta_click",
  "/services-pricing-guide": "services_pricing_guide_click",
  "/contact": "contact_cta_click",
  "/insight-os": "insight_os_cta_click",
  "/luxury-rehab": "luxury_rehab_cta_click",
  "/executive-rehab": "executive_rehab_cta_click",
  "/destination-rehab": "destination_rehab_cta_click",
};

function normaliseText(value: string | null) {
  return value?.replace(/\s+/g, " ").trim().slice(0, 120) || undefined;
}

export function installLeadClickTracking() {
  if (typeof document === "undefined") return () => undefined;

  const handleClick = (event: MouseEvent) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const anchor = target.closest("a[href]");
    if (!(anchor instanceof HTMLAnchorElement)) return;

    const rawHref = anchor.getAttribute("href");
    if (!rawHref) return;

    const shared = {
      link_url: anchor.href,
      link_text: normaliseText(anchor.textContent),
    };

    const explicitEvent = anchor.dataset.analyticsEvent;
    if (explicitEvent) {
      trackEvent(explicitEvent, shared);
    }

    if (rawHref.startsWith("tel:")) {
      trackEvent("phone_link_click", shared);
      return;
    }
    if (rawHref.startsWith("mailto:")) {
      trackEvent("email_link_click", shared);
      return;
    }
    if (/^(https?:\/\/)?(wa\.me|api\.whatsapp\.com)\//i.test(rawHref)) {
      trackEvent("whatsapp_click", shared);
      return;
    }

    try {
      const pathname = new URL(anchor.href, window.location.origin).pathname.replace(/\/$/, "") || "/";
      const eventName = CTA_EVENTS[pathname];
      if (eventName) trackEvent(eventName, shared);
    } catch {
      // A malformed or browser-specific link should not affect navigation.
    }
  };

  document.addEventListener("click", handleClick, { capture: true });
  return () => document.removeEventListener("click", handleClick, { capture: true });
}

export {};

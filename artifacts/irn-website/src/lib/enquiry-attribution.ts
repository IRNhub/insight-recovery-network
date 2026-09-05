export type EnquiryAttribution = Record<
  | "landingPage"
  | "currentPage"
  | "referrer"
  | "utmSource"
  | "utmMedium"
  | "utmCampaign"
  | "utmTerm"
  | "utmContent",
  string
>;
const key = "irn_enquiry_source_v1";
const campaignFields = {
  utmSource: "utm_source",
  utmMedium: "utm_medium",
  utmCampaign: "utm_campaign",
  utmTerm: "utm_term",
  utmContent: "utm_content",
} as const;

export function safeSourcePath(value: string, origin: string) {
  if (!value) return "";
  try {
    const url = new URL(value, origin);
    if (url.origin !== origin) return url.hostname;
    if (/^\/(assessment|survey|research|admin)/.test(url.pathname)) return "/";
    return url.pathname.slice(0, 250);
  } catch {
    return "";
  }
}

/** Consent is decided by the caller. Never retain a query string or result identifier. */
export function sourceFromUrl(
  href: string,
  referrer: string,
): EnquiryAttribution {
  const url = new URL(href);
  const path = safeSourcePath(href, url.origin);
  const source: EnquiryAttribution = {
    landingPage: path,
    currentPage: path,
    referrer: safeSourcePath(referrer, url.origin),
    utmSource: "",
    utmMedium: "",
    utmCampaign: "",
    utmTerm: "",
    utmContent: "",
  };
  for (const [field, parameter] of Object.entries(campaignFields)) {
    const value = url.searchParams.get(parameter) ?? "";
    // Short campaign identifiers only; reject email/phone-like values and free text.
    if (/^[a-zA-Z][a-zA-Z0-9_-]{0,79}$/.test(value) && !/\d{7}/.test(value))
      source[field as keyof typeof campaignFields] = value;
  }
  return source;
}

export function captureEnquiryAttribution(allowed: boolean) {
  try {
    window.sessionStorage.removeItem("irn_landing_page");
    if (!allowed) {
      window.sessionStorage.removeItem(key);
      return;
    }
    if (!window.sessionStorage.getItem(key))
      window.sessionStorage.setItem(
        key,
        JSON.stringify(sourceFromUrl(window.location.href, document.referrer)),
      );
  } catch {
    /* Storage must never prevent an enquiry. */
  }
}

export function readEnquiryAttribution(allowed: boolean): EnquiryAttribution {
  const current = sourceFromUrl(window.location.href, "");
  const minimal = {
    ...current,
    landingPage: current.currentPage,
    referrer: "",
    utmSource: "",
    utmMedium: "",
    utmCampaign: "",
    utmTerm: "",
    utmContent: "",
  };
  if (!allowed) return minimal;
  try {
    const raw = JSON.parse(window.sessionStorage.getItem(key) ?? "null");
    if (
      raw &&
      Object.keys(minimal).every((field) => typeof raw[field] === "string")
    )
      return {
        ...Object.fromEntries(
          Object.keys(minimal).map((field) => [field, raw[field]]),
        ),
        currentPage: current.currentPage,
      } as EnquiryAttribution;
  } catch {
    /* Fall back to the current page. */
  }
  return sourceFromUrl(window.location.href, document.referrer);
}

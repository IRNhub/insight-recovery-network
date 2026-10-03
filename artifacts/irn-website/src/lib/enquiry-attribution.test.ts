import { test, afterEach } from "node:test";
import assert from "node:assert/strict";
import {
  captureEnquiryAttribution,
  readEnquiryAttribution,
  sourceFromUrl,
} from "./enquiry-attribution.ts";

const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
const originalDocument = Object.getOwnPropertyDescriptor(
  globalThis,
  "document",
);
afterEach(() => {
  for (const [key, descriptor] of [
    ["window", originalWindow],
    ["document", originalDocument],
  ] as const) {
    if (descriptor) Object.defineProperty(globalThis, key, descriptor);
    else Reflect.deleteProperty(globalThis, key);
  }
});
function browser(href: string) {
  const values = new Map<string, string>();
  const storage = {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
    removeItem: (key: string) => values.delete(key),
  };
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: { location: { href }, sessionStorage: storage },
  });
  Object.defineProperty(globalThis, "document", {
    configurable: true,
    value: { referrer: "https://google.com/search?q=private" },
  });
  return values;
}
test("source attribution excludes query strings, result IDs and personal campaign values", () => {
  const source = sourceFromUrl(
    "https://www.insightrecoverynetwork.com/assessment/results/private?utm_source=google&utm_term=test@example.com",
    "https://example.com/private?name=secret",
  );
  assert.equal(source.landingPage, "/");
  assert.equal(source.referrer, "example.com");
  assert.equal(source.utmTerm, "");
});
test("denied analytics consent stores no attribution and clears legacy storage", () => {
  const values = browser(
    "https://www.insightrecoverynetwork.com/get-help?utm_source=google",
  );
  values.set("irn_landing_page", "private query");
  captureEnquiryAttribution(false);
  assert.equal(values.size, 0);
  const source = readEnquiryAttribution(false);
  assert.equal(source.utmSource, "");
  assert.equal(source.referrer, "");
  assert.equal(source.currentPage, "/get-help");
});
test("consented attribution keeps first landing page and updates only current page", () => {
  const values = browser(
    "https://www.insightrecoverynetwork.com/private-rehab-uk?utm_source=google",
  );
  captureEnquiryAttribution(true);
  window.location.href = "https://www.insightrecoverynetwork.com/get-help";
  captureEnquiryAttribution(true);
  const source = readEnquiryAttribution(true);
  assert.equal(source.landingPage, "/private-rehab-uk");
  assert.equal(source.currentPage, "/get-help");
  assert.equal(source.utmSource, "google");
  captureEnquiryAttribution(false);
  assert.equal(values.size, 0);
});

test("retains real date-labelled campaigns across the enquiry journey", () => {
  for (const campaign of ["irn_growth_20260926", "process_addictions_20260916", "irn_2026_autumn", "irn_growth_20240229"]) {
    browser(`https://www.insightrecoverynetwork.com/private-rehab-spain?utm_source=facebook&utm_medium=social&utm_campaign=${campaign}`);
    captureEnquiryAttribution(true);
    window.location.href = "https://www.insightrecoverynetwork.com/get-help";
    const source = readEnquiryAttribution(true);
    assert.equal(source.utmCampaign, campaign);
    assert.equal(source.utmSource, "facebook");
    assert.equal(source.currentPage, "/get-help");
  }
});

test("date exception rejects impossible dates, contact-like numbers and other UTM fields", () => {
  for (const campaign of ["person07700900123", "person_07700900123", "irn_growth_20260229", "irn_growth_20261301", "irn_growth_20260931", "irn_growth_202609260", "test@example.com", "private free text"]) {
    const source = sourceFromUrl(`https://www.insightrecoverynetwork.com/?utm_campaign=${encodeURIComponent(campaign)}`, "");
    assert.equal(source.utmCampaign, "", campaign);
  }
  const source = sourceFromUrl("https://www.insightrecoverynetwork.com/?utm_campaign=irn_growth_20260926&utm_term=person_20260926&utm_content=person07700900123", "");
  assert.equal(source.utmTerm, "");
  assert.equal(source.utmContent, "");
});

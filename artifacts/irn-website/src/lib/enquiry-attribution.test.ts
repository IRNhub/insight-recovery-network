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

import { test } from "node:test";
import assert from "node:assert/strict";
import { enquiryInput, sanitiseEnquirySource } from "./enquiry-input.ts";

const request = {
  name: "Test Enquirer",
  preferredContact: "phone",
  phone: "+44 7700 900123",
  consent: true,
};
test("accepts one chosen contact method, optional message, and legacy two-contact requests", () => {
  const phone = enquiryInput.parse(request);
  assert.equal(phone.email, "");
  assert.equal(phone.message, "");
  assert.equal(
    enquiryInput.parse({
      ...request,
      preferredContact: "email",
      email: "test@example.com",
      phone: "",
    }).phone,
    "",
  );
  assert.equal(
    enquiryInput.parse({
      ...request,
      email: "test@example.com",
      serviceInterest: "intervention",
    }).serviceInterest,
    "family-support",
  );
});
test("rejects absent chosen contact, false consent, malformed or oversized data", () => {
  for (const change of [
    { phone: "" },
    { preferredContact: "email" },
    { consent: false },
    { name: "x".repeat(121) },
    { phone: "1234567890123456" },
    { email: "not-email" },
    { message: "x".repeat(2401) },
    { submissionId: "bad-key" },
  ])
    assert.equal(
      enquiryInput.safeParse({ ...request, ...change }).success,
      false,
    );
});
test("strips result identifiers and query strings and rejects personal campaign values", () => {
  const clean = sanitiseEnquirySource(
    enquiryInput.parse({
      ...request,
      landingPage: "/assessment/results/private-id?email=private@example.com",
      currentPage: "/get-help?token=secret#private",
      referrer: "https://google.com/search?q=private",
      utmSource: "google",
      utmCampaign: "private@example.com",
      utmTerm: "person07700900123",
    }),
  );
  assert.equal(clean.landingPage, "/");
  assert.equal(clean.currentPage, "/get-help");
  assert.equal(clean.referrer, "google.com");
  assert.equal(clean.utmSource, "google");
  assert.equal(clean.utmCampaign, "");
  assert.equal(clean.utmTerm, "");
});

test("server preserves dated campaign labels using the same narrow rule as the browser", () => {
  for (const campaign of ["irn_growth_20260926", "process_addictions_20260916", "irn_2026_autumn", "irn_growth_20240229"]) {
    const clean = sanitiseEnquirySource(enquiryInput.parse({ ...request, utmCampaign: campaign }));
    assert.equal(clean.utmCampaign, campaign);
  }
  for (const campaign of ["person07700900123", "person_07700900123", "irn_growth_20260229", "irn_growth_20261301", "irn_growth_20260931", "irn_growth_202609260", "test@example.com", "private free text"]) {
    const clean = sanitiseEnquirySource(enquiryInput.parse({ ...request, utmCampaign: campaign }));
    assert.equal(clean.utmCampaign, "", campaign);
  }
  const clean = sanitiseEnquirySource(enquiryInput.parse({ ...request, utmTerm: "person_20260926", utmContent: "person07700900123" }));
  assert.equal(clean.utmTerm, "");
  assert.equal(clean.utmContent, "");
});

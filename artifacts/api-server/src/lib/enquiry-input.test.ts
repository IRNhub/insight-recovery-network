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

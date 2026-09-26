import { test } from "node:test";
import assert from "node:assert/strict";
import { initialJourneyAnswers, buildEnquiryMessage, ENQUIRY_MESSAGE_MAX, SAFE_CONTACT_MAX } from "./enquiry-journey-data.ts";

test("context aliases map to accepted service and support values", () => {
  assert.deepEqual(initialJourneyAnswers({service: "placement", who: "someone"}), {service: "treatment-placement", who: "someone-else", discussion: ""});
  assert.equal(initialJourneyAnswers({service: "family"}).service, "family-support");
  assert.equal(initialJourneyAnswers({service: "online"}).service, "online-programme");
  assert.equal(initialJourneyAnswers({who: "not-sure"}).who, "general");
  assert.deepEqual(initialJourneyAnswers(), {who: "", service: "", discussion: ""});
});

test("safe-contact instructions and longest topic fit the server message budget", () => {
  const result = buildEnquiryMessage({message: "x".repeat(ENQUIRY_MESSAGE_MAX), safeContact: "s".repeat(SAFE_CONTACT_MAX), method: "phone", voicemail: true, discussion: "costs"});
  assert.ok(result.length <= 2400, `Message was ${result.length} characters`);
  assert.ok(result.endsWith("x".repeat(ENQUIRY_MESSAGE_MAX)));
  assert.ok(result.includes("s".repeat(SAFE_CONTACT_MAX)));
  assert.ok(result.includes("Discuss first: Costs and practical arrangements"));
});

test("phone notes explicitly deny voicemail by default and do not leak to other methods", () => {
  assert.equal(buildEnquiryMessage({message: "", safeContact: "", method: "phone", voicemail: false}), "Voicemail: do not leave a message");
  assert.equal(buildEnquiryMessage({message: "", safeContact: "", method: "whatsapp", voicemail: true}), "");
  assert.equal(buildEnquiryMessage({message: "  A short question  ", safeContact: "", method: "email", voicemail: false}), "A short question");
});

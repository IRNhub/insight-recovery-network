import { afterEach, describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  buildAssessmentLeadPayload,
  forwardAssessmentToIrnOs,
  type IrnOsAssessmentPayload,
} from "./irn-os.ts";

const originalFetch = globalThis.fetch;
const originalEndpoint = process.env.IRN_OS_LEAD_ENDPOINT;
const originalApiKey = process.env.IRN_OS_LEAD_API_KEY;

function assessment(overrides: Partial<IrnOsAssessmentPayload> = {}): IrnOsAssessmentPayload {
  return {
    assessmentId: "42",
    createdAt: new Date("2026-07-21T18:30:00.000Z"),
    name: "Test Person",
    email: "test@example.com",
    phone: "+447700900000",
    type: "alcohol-use",
    scoreValue: 17,
    scoreLevel: "higher-concern",
    bandName: "Higher Concern",
    redFlags: ["withdrawal-risk"],
    advisories: ["medical-advice"],
    tags: ["assessment:alcohol-use", "priority:high"],
    clinicalBrief: "Assessment: Alcohol Use\nScore: 17",
    answers: { frequency: "daily" },
    consent: true,
    submittedAt: "Tue, 21 Jul 2026 18:30:00 GMT",
    ...overrides,
  };
}

afterEach(() => {
  globalThis.fetch = originalFetch;
  if (originalEndpoint === undefined) delete process.env.IRN_OS_LEAD_ENDPOINT;
  else process.env.IRN_OS_LEAD_ENDPOINT = originalEndpoint;
  if (originalApiKey === undefined) delete process.env.IRN_OS_LEAD_API_KEY;
  else process.env.IRN_OS_LEAD_API_KEY = originalApiKey;
});

describe("buildAssessmentLeadPayload", () => {
  it("maps an assessment to the IRN OS ingest contract with full context", () => {
    const payload = buildAssessmentLeadPayload(assessment());

    assert.equal(payload.id, "website-assessment-42");
    assert.equal(payload.lead_id, "website-assessment-42");
    assert.equal(payload.full_name, "Test Person");
    assert.equal(payload.form_name, "Website assessment: alcohol-use");
    assert.equal(payload.service_interest, "free-assessment");
    assert.equal(payload.created_time, "2026-07-21T18:30:00.000Z");
    assert.deepEqual(payload.answers, { frequency: "daily" });
    assert.match(String(payload.message), /Higher Concern \(17\)/);
    assert.match(String(payload.message), /withdrawal-risk/);
    assert.match(String(payload.message), /Assessment: Alcohol Use/);
  });
});

describe("forwardAssessmentToIrnOs", () => {
  it("posts with bearer authentication and returns the created lead id", async () => {
    process.env.IRN_OS_LEAD_ENDPOINT = "https://irnos.example/api/leads";
    process.env.IRN_OS_LEAD_API_KEY = "secret-key";

    let request: { url: string; init?: RequestInit } | undefined;
    globalThis.fetch = async (input, init) => {
      request = { url: String(input), init };
      return new Response(JSON.stringify({ success: true, duplicate: false, leadId: "lead-123" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    };

    const result = await forwardAssessmentToIrnOs(assessment());

    assert.deepEqual(result, { forwarded: true, duplicate: false, leadId: "lead-123" });
    assert.equal(request?.url, "https://irnos.example/api/leads");
    assert.equal(request?.init?.method, "POST");
    assert.equal((request?.init?.headers as Record<string, string>).Authorization, "Bearer secret-key");
    const body = JSON.parse(String(request?.init?.body));
    assert.equal(body.id, "website-assessment-42");
    assert.equal(body.assessment_type, "alcohol-use");
  });

  it("returns the existing lead id when IRN OS deduplicates the contact", async () => {
    process.env.IRN_OS_LEAD_ENDPOINT = "https://irnos.example/api/leads";
    process.env.IRN_OS_LEAD_API_KEY = "secret-key";
    globalThis.fetch = async () => new Response(JSON.stringify({
      success: true,
      duplicate: true,
      existingId: "existing-lead",
    }), { status: 200, headers: { "Content-Type": "application/json" } });

    const result = await forwardAssessmentToIrnOs(assessment());

    assert.deepEqual(result, { forwarded: true, duplicate: true, leadId: "existing-lead" });
  });

  it("does not call the network when forwarding is not configured", async () => {
    delete process.env.IRN_OS_LEAD_ENDPOINT;
    delete process.env.IRN_OS_LEAD_API_KEY;
    globalThis.fetch = async () => {
      throw new Error("fetch should not be called");
    };

    const result = await forwardAssessmentToIrnOs(assessment());

    assert.deepEqual(result, { forwarded: false, error: "not_configured" });
  });
});

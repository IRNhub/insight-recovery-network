import { test } from "node:test";
import assert from "node:assert/strict";
import { safeAnalyticsParameters } from "./analytics-parameters.ts";

test("preserves only the two static enquiry form names", () => {
  for (const form_name of ["get_help_consultation", "confidential_enquiry"])
    assert.deepEqual(safeAnalyticsParameters({ form_name }), { form_name });
  for (const form_name of ["Test Person", "test@example.com", "other_form", "", undefined, 123])
    assert.deepEqual(safeAnalyticsParameters({ form_name }), {});
});

test("retains the existing sensitive-field block for contact and clinical input", () => {
  assert.deepEqual(safeAnalyticsParameters({
    form_name: "confidential_enquiry",
    name: "Test Person",
    email: "test@example.com",
    phone: "+447700900123",
    message: "Private message",
    assessment_type: "private",
    clinical_answer: "private",
    risk_score: 4,
    cta_location: "header",
  }), { form_name: "confidential_enquiry", cta_location: "header" });
});

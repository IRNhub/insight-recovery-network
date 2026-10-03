type AnalyticsValue = string | number | boolean | undefined;

const SENSITIVE_PARAMETER =
  /(^|_)(name|email|phone|message|answer|response|clinical|diagnosis|score|result|risk|symptom|substance|assessment_type|free_text)(_|$)/i;

// These are fixed interface identifiers, never a visitor's name or form input.
const FORM_NAMES = new Set(["get_help_consultation", "confidential_enquiry"]);

export function safeAnalyticsParameters(parameters: Record<string, AnalyticsValue>) {
  return Object.fromEntries(
    Object.entries(parameters).filter(([key, value]) => {
      if (key === "form_name") return typeof value === "string" && FORM_NAMES.has(value);
      return !SENSITIVE_PARAMETER.test(key) && value !== undefined &&
        (typeof value === "boolean" || typeof value === "number" || value.length <= 120);
    }),
  );
}

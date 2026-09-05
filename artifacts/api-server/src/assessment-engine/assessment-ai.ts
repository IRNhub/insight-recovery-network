import type { AuthoritativeAssessmentResult } from "./contracts.ts";

/**
 * Assessment AI is deliberately disabled in Phase A.
 *
 * The previous assessment integration used AI_INTEGRATIONS_OPENAI_* variables.
 * The production provider path could not be established as a direct, approved
 * OpenAI service rather than a Replit-managed integration. The authorised
 * deterministic result is therefore the complete user result.
 */
export function disabledAiEnhancement(): AuthoritativeAssessmentResult["aiEnhancement"] {
  return { status: "disabled" };
}

import { z } from "zod";
import type { AssessmentContactRequest } from "./contracts.ts";
import { AssessmentValidationError } from "./validate-answers.ts";

export const PHASE_B_CONTACT_NOTICE_VERSION = "phase-b-contact-2026-08-30";

const ContactRequestSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().min(5).max(80).optional(),
  permissions: z.object({
    emailResult: z.boolean(),
    irnFollowUp: z.boolean(),
    marketing: z.boolean(),
  }),
});

export function parseAssessmentContactRequest(raw: unknown): AssessmentContactRequest {
  const parsed = ContactRequestSchema.safeParse(raw);
  if (!parsed.success) {
    throw new AssessmentValidationError(parsed.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    })));
  }
  const { permissions } = parsed.data;
  if (!permissions.emailResult && !permissions.irnFollowUp && !permissions.marketing) {
    throw new AssessmentValidationError([
      { field: "permissions", message: "Select at least one optional contact purpose" },
    ]);
  }
  if (permissions.irnFollowUp && !parsed.data.name) {
    throw new AssessmentValidationError([
      { field: "name", message: "Name is required when requesting IRN follow-up" },
    ]);
  }
  return {
    ...parsed.data,
    privacyNoticeVersion: PHASE_B_CONTACT_NOTICE_VERSION,
  };
}

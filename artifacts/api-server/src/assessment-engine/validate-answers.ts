import { z } from "zod";
import type {
  AssessmentAnswers,
  AssessmentDefinition,
  AssessmentKey,
  ValidatedSubmission,
} from "./contracts.ts";
import { getDefinition, isAssessmentKey } from "./registry.ts";

const RawSubmissionSchema = z.object({
  assessmentKey: z.string().min(1).max(80),
  definitionVersion: z.number().int().positive(),
  submissionKey: z.string().uuid(),
  answers: z.record(z.string().min(1), z.union([z.string(), z.array(z.string())])),
  consent: z.literal(true),
});

export const PHASE_A_PRIVACY_NOTICE_VERSION = "phase-a-2026-08-30";

export class AssessmentValidationError extends Error {
  readonly issues: Array<{ field: string; message: string }>;

  constructor(issues: Array<{ field: string; message: string }>) {
    super("Assessment validation failed");
    this.name = "AssessmentValidationError";
    this.issues = issues;
  }
}

function validateText(type: string, value: string): string | null {
  const trimmed = value.trim();
  if (trimmed.length === 0) return "An answer is required";
  if (trimmed.length > 300) return "Answer is too long";
  if (type === "email" && !z.string().email().safeParse(trimmed).success) {
    return "Enter a valid email address";
  }
  if (type === "tel" && trimmed.length > 80) return "Phone number is too long";
  return null;
}

export function validateAnswers(
  definition: AssessmentDefinition,
  rawAnswers: AssessmentAnswers,
): AssessmentAnswers {
  const issues: Array<{ field: string; message: string }> = [];
  const questions = definition.sections.flatMap((section) => section.questions);
  const questionMap = new Map(questions.map((question) => [question.id, question]));

  for (const answerId of Object.keys(rawAnswers)) {
    if (!questionMap.has(answerId)) {
      issues.push({ field: `answers.${answerId}`, message: "Unknown question" });
    }
  }

  const cleanAnswers: AssessmentAnswers = {};
  for (const question of questions) {
    const answer = rawAnswers[question.id];
    if (answer === undefined || answer === "" || (Array.isArray(answer) && answer.length === 0)) {
      if (question.required) {
        issues.push({ field: `answers.${question.id}`, message: "An answer is required" });
      }
      continue;
    }

    if (question.type === "radio" || question.type === "checkbox") {
      if (!question.options) {
        issues.push({ field: `answers.${question.id}`, message: "Question has no approved options" });
        continue;
      }
      const values = Array.isArray(answer) ? answer : [answer];
      if (question.type === "radio" && values.length !== 1) {
        issues.push({ field: `answers.${question.id}`, message: "Select one answer" });
        continue;
      }
      const allowed = new Set(question.options.map((option) => option.value));
      const invalid = values.find((value) => !allowed.has(value));
      if (invalid) {
        issues.push({ field: `answers.${question.id}`, message: "Invalid answer option" });
        continue;
      }
      cleanAnswers[question.id] = question.type === "radio" ? values[0]! : [...new Set(values)];
      continue;
    }

    if (Array.isArray(answer)) {
      issues.push({ field: `answers.${question.id}`, message: "Expected a text answer" });
      continue;
    }
    const textError = validateText(question.type, answer);
    if (textError) {
      issues.push({ field: `answers.${question.id}`, message: textError });
      continue;
    }
    cleanAnswers[question.id] = answer.trim();
  }

  if (issues.length > 0) throw new AssessmentValidationError(issues);
  return cleanAnswers;
}

export function parseSubmissionPayload(raw: unknown): {
  submission: ValidatedSubmission;
  definition: AssessmentDefinition;
} {
  const parsed = RawSubmissionSchema.safeParse(raw);
  if (!parsed.success) {
    throw new AssessmentValidationError(
      parsed.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    );
  }

  if (!isAssessmentKey(parsed.data.assessmentKey)) {
    throw new AssessmentValidationError([
      { field: "assessmentKey", message: "Unknown assessment" },
    ]);
  }

  const assessmentKey = parsed.data.assessmentKey as AssessmentKey;
  const definition = getDefinition(assessmentKey, parsed.data.definitionVersion);
  if (!definition) {
    throw new AssessmentValidationError([
      { field: "definitionVersion", message: "Unknown assessment definition version" },
    ]);
  }

  return {
    definition,
    submission: {
      assessmentKey,
      definitionVersion: parsed.data.definitionVersion,
      submissionKey: parsed.data.submissionKey,
      answers: validateAnswers(definition, parsed.data.answers),
      consent: parsed.data.consent,
      privacyNoticeVersion: PHASE_A_PRIVACY_NOTICE_VERSION,
    },
  };
}

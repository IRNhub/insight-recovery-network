import { createHmac } from "node:crypto";

export type AssessmentRateLimitScope = "submit" | "contact";

export interface AssessmentRateLimitIncrement {
  scope: AssessmentRateLimitScope;
  keyHash: string;
  windowSeconds: number;
  maximum: number;
}

export interface AssessmentRateLimitDecision {
  limited: boolean;
  count: number;
  retryAfterSeconds: number;
}

export interface AssessmentRateLimitStore {
  increment(input: AssessmentRateLimitIncrement): Promise<AssessmentRateLimitDecision>;
  cleanupExpired(): Promise<number>;
}

export interface AssessmentRateLimiter {
  check(
    identifier: string,
    scope: AssessmentRateLimitScope,
    maximum: number,
  ): Promise<AssessmentRateLimitDecision>;
}

export const ASSESSMENT_RATE_LIMIT_WINDOW_SECONDS = 15 * 60;

export class AssessmentRateLimitUnavailableError extends Error {
  constructor(cause?: unknown) {
    super("Shared assessment rate limiter unavailable", { cause });
    this.name = "AssessmentRateLimitUnavailableError";
  }
}

export function deriveAssessmentRateLimitKey(
  identifier: string,
  scope: AssessmentRateLimitScope,
  secret: string,
): string {
  return createHmac("sha256", secret)
    .update(`irn-assessment-rate-limit:v1\0${scope}\0${identifier.trim().toLowerCase()}`)
    .digest("hex");
}

export function createAssessmentRateLimiter(
  store: AssessmentRateLimitStore,
  getSecret: () => string | undefined,
): AssessmentRateLimiter {
  return {
    async check(identifier, scope, maximum) {
      const secret = getSecret();
      if (!secret) throw new AssessmentRateLimitUnavailableError();
      if (!Number.isInteger(maximum) || maximum < 1) {
        throw new AssessmentRateLimitUnavailableError(new Error("Invalid assessment rate-limit maximum"));
      }

      const keyHash = deriveAssessmentRateLimitKey(identifier || "unknown", scope, secret);
      try {
        return await store.increment({
          scope,
          keyHash,
          windowSeconds: ASSESSMENT_RATE_LIMIT_WINDOW_SECONDS,
          maximum,
        });
      } catch (error) {
        if (error instanceof AssessmentRateLimitUnavailableError) throw error;
        throw new AssessmentRateLimitUnavailableError(error);
      }
    },
  };
}

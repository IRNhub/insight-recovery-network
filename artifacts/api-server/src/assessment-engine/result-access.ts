import { createHash, randomBytes } from "node:crypto";
import type { Request, Response } from "express";

export const RESULT_COOKIE = "irn_assessment_result";
const RESULT_COOKIE_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

export function createResultAccessToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashResultAccessToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function setResultAccessCookie(res: Response, token: string): void {
  res.cookie(RESULT_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/api/assessments",
    maxAge: RESULT_COOKIE_MAX_AGE_MS,
  });
}

export function readResultAccessToken(req: Request): string | null {
  const value = req.cookies?.[RESULT_COOKIE];
  return typeof value === "string" && value.length >= 32 ? value : null;
}

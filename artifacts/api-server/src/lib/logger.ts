import pino from "pino";
import { isProductionRuntime } from "./runtime-environment.ts";

const isProduction = isProductionRuntime();

export const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  redact: [
    "req.headers.authorization",
    "req.headers.cookie",
    "req.body",
    "res.headers['set-cookie']",
    "email",
    "phone",
    "answers",
    "clinicalBrief",
    "safetyAction",
    "safetyStatus",
    "resultToken",
    "accessToken",
    "*.email",
    "*.phone",
    "*.answers",
    "*.clinicalBrief",
    "*.safetyAction",
    "*.safetyStatus",
    "*.resultToken",
    "*.accessToken",
  ],
  ...(isProduction
    ? {}
    : {
        transport: {
          target: "pino-pretty",
          options: { colorize: true },
        },
      }),
});

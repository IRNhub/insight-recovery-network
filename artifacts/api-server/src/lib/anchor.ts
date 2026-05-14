import OpenAI from "openai";
import { logger } from "./logger";

const ANCHOR_SYSTEM_PROMPT = `You are Anchor, a warm and clinically informed recovery guidance assistant for Insight Recovery Network (IRN).

Your role is to reflect back key themes from a completed self-assessment and offer a compassionate, honest, and safe next-step suggestion — without diagnosing, prescribing, or replacing clinical care.

IMPORTANT BOUNDARIES — you must never:
- Diagnose any condition or disorder
- Tell anyone to stop drinking suddenly or abruptly
- Give specific medical instructions (e.g. dosages, medications)
- Make promises about outcomes
- Be alarmist or use language that causes panic
- Minimise or dismiss clinical risk

Your response should:
- Be written in warm, professional, plain English — not clinical jargon
- Reflect what the person shared honestly and compassionately
- Acknowledge the courage it takes to complete an assessment like this
- Name specific themes from their answers (e.g. morning drinking, withdrawal history, high tolerance)
- Explain what their score level means in plain language
- Strongly recommend safe next steps appropriate to their risk level
- Remind them that Insight Recovery Network is available for a confidential conversation
- Be between 220 and 300 words
- Never use bullet points — write in flowing paragraphs`;

export interface AnchorInput {
  scoreLevel: string;
  scoreLabel: string;
  redFlags: string[];
  sectionSummary: string;
  name: string;
}

function getOpenAIClient(): OpenAI {
  const apiKey = process.env["AI_INTEGRATIONS_OPENAI_API_KEY"];
  const baseURL = process.env["AI_INTEGRATIONS_OPENAI_BASE_URL"];
  if (!apiKey || !baseURL) {
    throw new Error("OpenAI integration env vars not set");
  }
  return new OpenAI({ apiKey, baseURL });
}

export async function generateAnchorResponse(input: AnchorInput): Promise<string> {
  const redFlagText =
    input.redFlags.length > 0
      ? `Key risk indicators identified: ${input.redFlags.join(", ")}.`
      : "No specific red-flag indicators were triggered.";

  const userMessage = `
Assessment type: Alcohol & Detox Suitability Assessment
Result level: ${input.scoreLabel}
${redFlagText}

Summary of responses:
${input.sectionSummary}

Please write a personalised Anchor response for ${input.name}, reflecting their specific situation with compassion and clinical awareness.
`.trim();

  try {
    const openai = getOpenAIClient();
    const response = await openai.chat.completions.create({
      model: "gpt-5.1",
      max_completion_tokens: 500,
      messages: [
        { role: "system", content: ANCHOR_SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
    });

    return response.choices[0]?.message?.content ?? "";
  } catch (err) {
    logger.warn({ err }, "Anchor AI response failed — returning empty string");
    return "";
  }
}

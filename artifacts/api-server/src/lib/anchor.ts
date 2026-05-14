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

const FALLBACK_TEMPLATES: Record<string, (firstName: string) => string> = {
  "lower-concern": (firstName) =>
    `${firstName}, thank you for taking the time to complete this assessment — it takes honesty and courage to look clearly at your relationship with alcohol, and that in itself is meaningful.

Based on what you shared, your responses suggest a lower level of clinical concern at this point in time. That is genuinely positive. It may mean that your drinking is not yet causing significant harm, or that you have a reasonable level of awareness and control. Even so, completing an assessment like this often reflects a quiet concern — and that concern is worth listening to.

The most useful thing you can do right now is stay curious about your relationship with alcohol. Patterns that feel manageable today can shift gradually over time, particularly during periods of stress, change, or difficulty. Staying aware of how much you drink, when, and why — is one of the most effective early tools available.

If anything you shared in this assessment continues to sit with you, or if your circumstances change, please do not hesitate to reach out. Insight Recovery Network offers confidential conversations with no obligation and no pressure. We are here to help you think things through, whatever stage you are at.`,

  "moderate-concern": (firstName) =>
    `${firstName}, completing this assessment is a meaningful step — one that takes honesty, and often a quiet recognition that something deserves attention. Thank you for doing that.

Your responses suggest a moderate level of concern. This does not mean you are in crisis, but it does suggest that your relationship with alcohol is having some impact on your daily life, and that your body and mind may be starting to adjust to a pattern that is worth addressing thoughtfully.

Moderate concern is actually a powerful place to be. It often means you are catching something early — before it becomes significantly harder to change. Many people find that having a conversation with a recovery professional at this stage makes a real difference, helping them understand their options and make informed, safe choices about how to move forward.

Insight Recovery Network is available for a confidential conversation whenever you are ready. There is no pressure, no judgement, and no obligation. We would simply encourage you to speak to someone — a GP, a trusted clinician, or a member of our team — sooner rather than later. You deserve support that matches the honesty you have shown today.`,

  "higher-concern": (firstName) =>
    `${firstName}, taking this assessment takes real courage, and the honesty you have brought to your answers reflects something important — a part of you that knows a change may be needed, and is willing to face that. That matters.

Your responses indicate a higher level of clinical concern. The pattern of drinking you have described suggests a significant level of dependence or harm, and some of what you have shared points to your body and mind having adapted to alcohol in ways that carry real risk. This is not a judgement — dependence is a physical and psychological process, not a moral failure.

At this level of concern, it is important that you speak to a clinician before making any significant changes to your drinking. Reducing or stopping alcohol when there is a higher level of physical dependence needs to be done carefully and with the right support in place. Going it alone is not the safest path at this stage.

Insight Recovery Network can help you understand your options and connect you with the right level of care. Please reach out to us — or to your GP — as soon as you are able. A confidential conversation costs nothing and could make all the difference.`,

  "possible-detox-risk": (firstName) =>
    `${firstName}, the fact that you have completed this assessment — and answered honestly — is significant. It suggests that some part of you is ready to face what is happening and take a step forward. That takes real courage, and it is the right instinct.

Your responses indicate that your current level of drinking carries a meaningful medical risk if you were to stop or reduce suddenly without support. This is not meant to alarm you — but it is important that you understand this clearly: making changes to your drinking at this stage should not be done alone or without clinical guidance.

Please do not attempt to stop or significantly reduce your alcohol intake without speaking to a doctor or specialist first. Withdrawal from alcohol at higher levels of dependence can involve serious physical symptoms, and the right support makes a significant difference to both safety and outcomes.

Insight Recovery Network is here for exactly this situation. We can help you understand the safest pathway forward, whether that involves a medically supported detox, residential treatment, or another form of structured care. Please reach out to us or your GP as a priority — you do not have to navigate this alone, and you should not try to.`,

  "urgent-medical-advice": (firstName) =>
    `${firstName}, completing this assessment when you are in this position takes genuine courage, and we want you to know that you are not alone in what you are facing.

Your responses indicate a high level of clinical risk, and it is important that we are direct with you: please seek medical advice before making any changes to your drinking. Based on what you have shared, stopping alcohol suddenly or without proper support could be medically dangerous. This is not something to manage alone.

Please contact your GP, call NHS 111, or reach out to Insight Recovery Network today. If at any point you feel unwell, confused, or experience shaking, sweating, or other worrying symptoms, please call 999 or go to your nearest A&E immediately.

We know this may feel overwhelming. The most important thing right now is simply to speak to someone qualified who can help you take the next step safely. Insight Recovery Network offers confidential, non-judgemental support and can help you access the right level of clinical care quickly. You have shown real bravery by completing this assessment — please use that same courage to reach out for the help that is available to you.`,
};

function getFallbackResponse(scoreLevel: string, name: string): string {
  const firstName = name.split(" ")[0] ?? name;
  const templateFn = FALLBACK_TEMPLATES[scoreLevel] ?? FALLBACK_TEMPLATES["moderate-concern"];
  return templateFn(firstName);
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

    const aiText = response.choices[0]?.message?.content ?? "";
    if (!aiText) {
      logger.warn("Anchor AI returned empty content — using fallback");
      return getFallbackResponse(input.scoreLevel, input.name);
    }
    return aiText;
  } catch (err) {
    logger.warn({ err }, "Anchor AI call failed — using static fallback response");
    return getFallbackResponse(input.scoreLevel, input.name);
  }
}

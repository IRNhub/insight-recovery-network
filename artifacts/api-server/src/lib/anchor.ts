import OpenAI from "openai";
import { logger } from "./logger";

export interface AnchorReport {
  whatThisMaySuggest: string;
  keyPatterns: string[];
  whatThisDoesNotMean: string;
  suggestedNextSteps: string;
  ctaText: string;
}

const ANCHOR_SYSTEM_PROMPT = `You are Anchor, a warm and clinically informed recovery guidance assistant for Insight Recovery Network (IRN).

You will receive a structured clinical brief from a completed self-assessment. Your task is to produce a structured, clinically responsible interpretation.

CLINICAL RULES — you must never:
- Diagnose any condition or disorder (never say "you have ADHD", "you have depression", "you have an anxiety disorder", "you have a substance use disorder")
- Tell anyone to stop drinking suddenly or abruptly
- Give specific medical instructions (dosages, medication names, treatment plans)
- Make promises about outcomes or recovery
- List, repeat, or paraphrase the person's individual answers back to them — the "notable elevated responses" in the brief are clinical data for you to INTERPRET and SYNTHESISE into insight, not content to recite
- Be alarmist or use language that causes panic
- Minimise or dismiss clinical risk

LANGUAGE TO USE:
- "Your responses fall within the [band] range"
- "Your score suggests..."
- "This pattern may be consistent with..."
- "This screening result suggests it may be worth..."
- "This is not a diagnosis"

Return ONLY a valid JSON object — no markdown, no code fences, no preamble — with exactly these five fields:

{
  "whatThisMaySuggest": "2–3 sentences. A meaningful interpretation of the overall result pattern. What does this score/band suggest clinically? What picture emerges from the domains? Write from the score and domain patterns — do NOT list individual answers.",
  "keyPatterns": ["pattern 1", "pattern 2", "pattern 3"],
  "whatThisDoesNotMean": "1–2 sentences. Clarify this is a screening tool, not a diagnosis. Note that symptoms can overlap with stress, burnout, trauma, sleep issues, or other factors relevant to this assessment type.",
  "suggestedNextSteps": "2–3 sentences. Practical, proportionate next steps for this severity level. Low: monitor, self-help. Moderate: consider structured support or a professional conversation. High: professional assessment strongly recommended. Risk: seek urgent or appropriate clinical support. Do not prescribe or promise outcomes.",
  "ctaText": "1 sentence. Soft and non-pushy. Mention that Insight Recovery Network offers a confidential consultation to help explore next steps."
}

For keyPatterns: provide 3 to 5 short clinical theme strings, each 2–6 words. Examples: "Attention regulation difficulties", "Emotional dysregulation", "Sleep disruption", "Functional impairment at work", "Avoidance behaviour", "Craving and loss of control", "Mood disturbance".

Tone: warm, calm, clinically credible, professional, plain English. Write directly to the person using "your" and "you". Be specific enough to feel personalised but do not overclaim.`;

const ANCHOR_MODELS = ["gpt-5.1", "gpt-5", "gpt-5-mini"] as const;

export interface AnchorInput {
  scoreLevel: string;
  scoreLabel: string;
  redFlags: string[];
  clinicalBrief: string;
  name: string;
}

function isModelNotFoundError(err: unknown): boolean {
  if (!(err instanceof OpenAI.APIError)) return false;
  if (err.status === 404) return true;
  const body = err.error as Record<string, unknown> | undefined;
  const code = body?.code as string | undefined;
  if (code === "model_not_found") return true;
  const msg = err.message?.toLowerCase() ?? "";
  return msg.includes("model") && (msg.includes("not found") || msg.includes("does not exist"));
}

const FALLBACK_REPORTS: Record<string, (assessmentType: string) => AnchorReport> = {
  "lower-concern": (type) => ({
    whatThisMaySuggest: `Your responses fall within the lower range for this ${type} assessment, suggesting that the patterns you have described are either mild or not currently causing significant disruption to your daily life. This is genuinely positive, and completing this assessment reflects a meaningful level of self-awareness.`,
    keyPatterns: ["Mild or infrequent symptoms", "Limited functional impact", "Good baseline awareness"],
    whatThisDoesNotMean: `This result is not a diagnosis, and it does not rule out any underlying condition. Screening tools capture a point in time — how you are feeling today may differ from other periods. Symptoms can also overlap with stress, burnout, sleep difficulties, or life circumstances.`,
    suggestedNextSteps: `At this level, staying curious and self-aware is the most valuable thing you can do. If your circumstances change or any symptoms begin to affect your daily life, speaking with a professional can be a helpful first step. Returning to this assessment in a few months can also help you track patterns over time.`,
    ctaText: `If you would like help understanding these results or want to talk through what you have shared, Insight Recovery Network offers confidential consultations with no obligation.`,
  }),
  "moderate-concern": (type) => ({
    whatThisMaySuggest: `Your responses fall within the moderate range for this ${type} assessment, suggesting that the patterns you have described are having a meaningful impact on some areas of your daily life. This does not mean you are in crisis — but it does indicate that what you are experiencing deserves attention and thoughtful support.`,
    keyPatterns: ["Moderate symptom frequency", "Some functional impact", "Patterns worth addressing", "Support likely beneficial"],
    whatThisDoesNotMean: `This result is not a diagnosis. A moderate screening score can reflect a range of experiences — including situational stress, burnout, sleep difficulties, or other contributing factors. A fuller professional assessment would provide a clearer and more nuanced picture.`,
    suggestedNextSteps: `At this level, it would be worth speaking with a professional — whether that is your GP, a therapist, or a recovery specialist. If you are not ready for that step, tracking your patterns over the next few weeks using a mood journal or self-monitoring tool can be a helpful starting point. You do not have to manage this alone.`,
    ctaText: `If you would like help understanding these results or exploring your options, Insight Recovery Network offers confidential consultations to help you think things through.`,
  }),
  "higher-concern": (type) => ({
    whatThisMaySuggest: `Your responses fall within the high range for this ${type} assessment, suggesting a significant pattern that is very likely affecting your daily functioning, relationships, and overall wellbeing. The picture that emerges warrants proper professional attention — not because anything is certain, but because what you are describing deserves to be taken seriously.`,
    keyPatterns: ["Significant symptom severity", "Functional impairment present", "Professional assessment recommended", "Early intervention valuable"],
    whatThisDoesNotMean: `This result is not a diagnosis. High screening scores are a starting point for proper assessment, not an endpoint. A qualified professional will be able to provide a much more accurate and personalised picture of what is happening and what support would help most.`,
    suggestedNextSteps: `At this level, a professional assessment is strongly recommended. This might begin with your GP as a first point of contact, or with a specialist in the area this assessment covers. The sooner you speak to someone, the sooner you can understand your options clearly and begin to feel more in control.`,
    ctaText: `Insight Recovery Network can help you take that next step — please reach out for a confidential consultation to explore what support might be most helpful.`,
  }),
  "possible-detox-risk": (_type) => ({
    whatThisMaySuggest: `Your responses fall within the range that indicates a meaningful medical risk associated with your current drinking pattern. This level of alcohol use suggests your body may have developed a degree of physical dependence, which carries specific clinical considerations that are important to understand before you make any changes.`,
    keyPatterns: ["Physical dependence indicators", "Withdrawal risk present", "Medical guidance required", "High-priority clinical concern"],
    whatThisDoesNotMean: `This result is not a formal diagnosis of alcohol use disorder. It is a strong indicator that your current situation warrants professional support before making any changes to your drinking — it is not a judgement, and it does not determine what recovery needs to look like for you.`,
    suggestedNextSteps: `Please do not attempt to stop or significantly reduce your alcohol intake suddenly without first speaking to a doctor or addiction specialist. Alcohol withdrawal at higher levels of dependence can involve serious medical complications. Please contact your GP, a specialist service, or Insight Recovery Network as a priority.`,
    ctaText: `Insight Recovery Network can help you understand the safest path forward — please reach out for a confidential conversation as soon as you are able.`,
  }),
  "urgent-medical-advice": (_type) => ({
    whatThisMaySuggest: `Your responses indicate a high level of clinical risk that requires immediate professional attention. This is not meant to alarm you — but it does mean that what you are currently experiencing is serious, and that the right support can make a significant and meaningful difference to both your safety and your wellbeing.`,
    keyPatterns: ["Urgent clinical concern", "Immediate professional support needed", "Safety considerations present", "High-priority response required"],
    whatThisDoesNotMean: `This result does not mean your situation is hopeless or that recovery is not possible. It means the level of support you need right now should come from a qualified professional — ideally today or as soon as possible.`,
    suggestedNextSteps: `Please reach out for professional help today. Contact your GP, call NHS 111, or speak to Insight Recovery Network directly. If you feel physically unwell, confused, or unsafe at any point, please call 999 or go to your nearest A&E. You do not need to manage this alone, and you do not need to have all the answers before you reach out.`,
    ctaText: `Insight Recovery Network is here to help — please reach out for a confidential conversation as a priority.`,
  }),
};

function getFallbackReport(scoreLevel: string, assessmentType: string): AnchorReport {
  const templateFn = FALLBACK_REPORTS[scoreLevel] ?? FALLBACK_REPORTS["moderate-concern"]!;
  return templateFn(assessmentType);
}

function getOpenAIClient(): OpenAI {
  const apiKey = process.env["AI_INTEGRATIONS_OPENAI_API_KEY"];
  const baseURL = process.env["AI_INTEGRATIONS_OPENAI_BASE_URL"];
  if (!apiKey || !baseURL) {
    throw new Error("OpenAI integration env vars not set");
  }
  return new OpenAI({ apiKey, baseURL });
}

function parseAnchorReport(text: string): AnchorReport | null {
  try {
    const cleaned = text
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();
    const parsed = JSON.parse(cleaned) as Record<string, unknown>;
    if (
      typeof parsed.whatThisMaySuggest === "string" &&
      Array.isArray(parsed.keyPatterns) &&
      typeof parsed.whatThisDoesNotMean === "string" &&
      typeof parsed.suggestedNextSteps === "string" &&
      typeof parsed.ctaText === "string"
    ) {
      return {
        whatThisMaySuggest: parsed.whatThisMaySuggest,
        keyPatterns: (parsed.keyPatterns as unknown[])
          .filter((p): p is string => typeof p === "string"),
        whatThisDoesNotMean: parsed.whatThisDoesNotMean,
        suggestedNextSteps: parsed.suggestedNextSteps,
        ctaText: parsed.ctaText,
      };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Generates a structured Anchor report using pre-computed scoring and a
 * clinical brief (NOT a raw Q&A transcript). The AI synthesises interpretation
 * from domain patterns rather than repeating individual answers.
 *
 * Returns an AnchorReport with 5 structured sections.
 * Model resolution: gpt-5.1 → gpt-5 → gpt-5-mini → static fallback.
 */
export async function generateAnchorResponse(input: AnchorInput): Promise<AnchorReport> {
  const redFlagText =
    input.redFlags.length > 0
      ? `Risk indicators: ${input.redFlags.join(", ")}.`
      : "No specific risk indicators triggered.";

  const userMessage = `
${input.clinicalBrief}

${redFlagText}

Please generate the structured Anchor interpretation for ${input.name}. Remember: synthesise the clinical pattern into insight — do not list or repeat the individual findings above.
`.trim();

  let openai: OpenAI;
  try {
    openai = getOpenAIClient();
  } catch (err) {
    logger.warn({ err }, "Anchor: OpenAI client could not be initialised — using static fallback");
    return getFallbackReport(input.scoreLevel, extractAssessmentType(input.clinicalBrief));
  }

  for (const model of ANCHOR_MODELS) {
    try {
      const response = await openai.chat.completions.create({
        model,
        max_completion_tokens: 600,
        messages: [
          { role: "system", content: ANCHOR_SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
      });

      const resolvedModel = response.model;
      const aiText = response.choices[0]?.message?.content ?? "";

      if (!aiText) {
        logger.warn({ requestedModel: model, resolvedModel }, "Anchor: AI returned empty content — using static fallback");
        return getFallbackReport(input.scoreLevel, extractAssessmentType(input.clinicalBrief));
      }

      const report = parseAnchorReport(aiText);
      if (!report) {
        logger.warn({ requestedModel: model, resolvedModel }, "Anchor: AI returned invalid JSON — using static fallback");
        return getFallbackReport(input.scoreLevel, extractAssessmentType(input.clinicalBrief));
      }

      logger.info({ requestedModel: model, resolvedModel }, "Anchor: structured report generated successfully");
      return report;
    } catch (err) {
      if (isModelNotFoundError(err)) {
        logger.warn({ requestedModel: model, err: (err as Error).message }, `Anchor: model "${model}" not found — trying next`);
        continue;
      }
      logger.warn({ requestedModel: model, err }, "Anchor: non-model error — using static fallback");
      return getFallbackReport(input.scoreLevel, extractAssessmentType(input.clinicalBrief));
    }
  }

  logger.warn({ triedModels: ANCHOR_MODELS }, "Anchor: all models unavailable — using static fallback");
  return getFallbackReport(input.scoreLevel, extractAssessmentType(input.clinicalBrief));
}

function extractAssessmentType(clinicalBrief: string): string {
  const match = clinicalBrief.match(/^Assessment: (.+)$/m);
  return match?.[1] ?? "this assessment";
}

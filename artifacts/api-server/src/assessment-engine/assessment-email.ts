import { Resend } from "resend";
import type { AuthoritativeAssessmentResult } from "./contracts.ts";

export interface AuthoritativeAssessmentEmail {
  name: string;
  email: string;
  result: AuthoritativeAssessmentResult;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildAuthoritativeAssessmentEmailText(data: AuthoritativeAssessmentEmail): string {
  const { result } = data;
  const safety = result.safety.content.flatMap((item) => [item.heading, item.body, item.actionText ?? ""]);
  const patterns = result.interpretation.keyPatterns.flatMap((pattern) => [
    pattern.title,
    pattern.statement,
    `Why this matters: ${pattern.whyItMatters}`,
  ]);
  const pathways = result.pathways.flatMap((pathway) => [pathway.label, pathway.description]);

  return [
    `Hello ${data.name.split(" ")[0] || data.name},`,
    "",
    "Your Insight Recovery Network assessment result",
    "",
    result.safety.publicHeading,
    result.safety.limitation,
    ...safety,
    "",
    `${result.screening.label}: ${result.screening.value} of ${result.screening.maximumValue}`,
    result.screening.explanation,
    "",
    result.interpretation.summary,
    ...patterns,
    "",
    "Possible next steps",
    ...pathways,
    "",
    ...result.interpretation.limitations,
    "",
    "Insight Recovery Network | https://www.insightrecoverynetwork.com",
  ].filter(Boolean).join("\n");
}

export function buildAuthoritativeAssessmentEmailHtml(data: AuthoritativeAssessmentEmail): string {
  const { result } = data;
  const safetyBlocks = result.safety.content.map((item) => `
    <div style="border-left:4px solid #9b2a2a;background:#fff7f7;padding:14px 16px;margin:12px 0;">
      <strong>${escapeHtml(item.heading)}</strong>
      <p style="line-height:1.6;margin:8px 0 0;">${escapeHtml(item.body)}</p>
      ${item.actionText ? `<p style="line-height:1.6;margin:8px 0 0;font-weight:600;">${escapeHtml(item.actionText)}</p>` : ""}
    </div>`).join("");
  const patterns = result.interpretation.keyPatterns.map((pattern) => `
    <li style="margin:0 0 14px;line-height:1.6;">
      <strong>${escapeHtml(pattern.title)}</strong><br />
      ${escapeHtml(pattern.statement)}<br />
      <span style="color:#555;">Why this matters: ${escapeHtml(pattern.whyItMatters)}</span>
    </li>`).join("");
  const pathways = result.pathways.map((pathway) => `
    <li style="margin:0 0 12px;line-height:1.6;">
      <strong>${escapeHtml(pathway.label)}</strong><br />${escapeHtml(pathway.description)}
    </li>`).join("");

  return `<!doctype html>
<html><body style="font-family:Arial,sans-serif;color:#162B3B;background:#F6F4F0;padding:24px;">
  <main style="max-width:640px;margin:auto;background:#fff;padding:32px;border:1px solid #ddd;">
    <h1 style="font-size:24px;margin-top:0;">Your assessment result</h1>
    <p>Hello ${escapeHtml(data.name.split(" ")[0] || data.name)},</p>
    <section style="margin:24px 0;">
      <h2 style="font-size:19px;">${escapeHtml(result.safety.publicHeading)}</h2>
      <p style="line-height:1.6;">${escapeHtml(result.safety.limitation)}</p>
      ${safetyBlocks}
    </section>
    <section style="margin:24px 0;">
      <h2 style="font-size:19px;">Screening profile</h2>
      <p><strong>${escapeHtml(result.screening.label)}</strong>: ${result.screening.value} of ${result.screening.maximumValue}</p>
      <p style="line-height:1.6;">${escapeHtml(result.screening.explanation)}</p>
    </section>
    <section style="margin:24px 0;">
      <h2 style="font-size:19px;">What your answers may suggest</h2>
      <p style="line-height:1.6;">${escapeHtml(result.interpretation.summary)}</p>
      ${patterns ? `<ul style="padding-left:20px;">${patterns}</ul>` : ""}
    </section>
    <section style="margin:24px 0;">
      <h2 style="font-size:19px;">Possible next steps</h2>
      <ul style="padding-left:20px;">${pathways}</ul>
    </section>
    <section style="border-top:1px solid #ddd;padding-top:16px;color:#555;font-size:13px;line-height:1.6;">
      ${result.interpretation.limitations.map((item) => `<p>${escapeHtml(item)}</p>`).join("")}
    </section>
  </main>
</body></html>`;
}

export async function sendAuthoritativeAssessmentEmail(
  data: AuthoritativeAssessmentEmail,
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.ENQUIRY_FROM_EMAIL;
  if (!apiKey || !from) {
    const error = new Error("Assessment email provider is not configured");
    error.name = "provider_not_configured";
    throw error;
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: data.email,
    subject: "Your assessment result | Insight Recovery Network",
    text: buildAuthoritativeAssessmentEmailText(data),
    html: buildAuthoritativeAssessmentEmailHtml(data),
  });

  if (error) {
    const deliveryError = new Error("Assessment email provider rejected the message");
    deliveryError.name = "provider_rejected";
    throw deliveryError;
  }
}

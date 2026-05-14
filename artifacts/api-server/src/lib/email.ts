import { Resend } from "resend";
import { logger } from "./logger";

interface EnquiryData {
  name: string;
  email: string;
  phone: string;
  preferredContact: string;
  supportType: string;
  message: string;
  consent: boolean;
  pageSource?: string;
  submittedAt: string;
}

const SUPPORT_TYPE_LABELS: Record<string, string> = {
  myself: "I need help for myself",
  "someone-else": "I need help for someone else",
  professional: "Professional or organisation enquiry",
  general: "General enquiry",
};

const CONTACT_LABELS: Record<string, string> = {
  email: "Email",
  phone: "Phone call",
  whatsapp: "WhatsApp",
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildNotificationHtml(data: EnquiryData): string {
  const rows: Array<[string, string]> = [
    ["Name", data.name],
    ["Email", data.email],
    ["Phone / WhatsApp", data.phone],
    ["Preferred Contact", CONTACT_LABELS[data.preferredContact] ?? data.preferredContact],
    ["Enquiry Type", SUPPORT_TYPE_LABELS[data.supportType] ?? data.supportType],
    ["Consent Accepted", data.consent ? "Yes" : "No"],
    ["Page Source", data.pageSource ?? "Unknown"],
    ["Date / Time Submitted", data.submittedAt],
  ];

  const tableRows = rows
    .map(
      ([label, value], i) => `
      <tr${i % 2 === 1 ? ' style="background:#f9f8f6;"' : ""}>
        <td style="padding:10px 0;color:#666;width:200px;vertical-align:top;font-weight:bold;">${escapeHtml(label)}</td>
        <td style="padding:10px 0;">${label === "Email" ? `<a href="mailto:${escapeHtml(value)}" style="color:#2c3e6b;">${escapeHtml(value)}</a>` : escapeHtml(value)}</td>
      </tr>`,
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="font-family:Georgia,serif;color:#1a1a2e;background:#f9f8f6;padding:32px;">
  <div style="max-width:620px;margin:0 auto;background:#ffffff;border:1px solid #e0ddd8;padding:40px;">
    <h2 style="color:#2c3e6b;font-size:22px;margin-top:0;">New IRN Website Enquiry</h2>
    <hr style="border:none;border-top:1px solid #e0ddd8;margin:24px 0;" />
    <table style="width:100%;border-collapse:collapse;font-size:15px;">
      ${tableRows}
    </table>
    <div style="margin-top:24px;">
      <div style="color:#666;font-weight:bold;margin-bottom:8px;">Message</div>
      <div style="background:#f9f8f6;border:1px solid #e0ddd8;padding:16px;font-size:15px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(data.message)}</div>
    </div>
    <hr style="border:none;border-top:1px solid #e0ddd8;margin:32px 0 16px;" />
    <p style="color:#999;font-size:12px;margin:0;">Submitted via the Insight Recovery Network contact form. The enquirer has consented to being contacted.</p>
  </div>
</body>
</html>`.trim();
}

function buildNotificationText(data: EnquiryData): string {
  return [
    "New IRN Website Enquiry",
    "",
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Phone / WhatsApp: ${data.phone}`,
    `Preferred Contact: ${CONTACT_LABELS[data.preferredContact] ?? data.preferredContact}`,
    `Enquiry Type: ${SUPPORT_TYPE_LABELS[data.supportType] ?? data.supportType}`,
    `Consent Accepted: ${data.consent ? "Yes" : "No"}`,
    `Page Source: ${data.pageSource ?? "Unknown"}`,
    `Date / Time Submitted: ${data.submittedAt}`,
    "",
    "Message:",
    data.message,
  ].join("\n");
}

interface AssessmentEmailData {
  name: string;
  email: string;
  phone?: string;
  type: string;
  scoreLabel: string;
  scoreLevel: string;
  scoreValue: number;
  redFlags: string[];
  tags: string[];
  sectionSummary: string;
  anchorResponse: string;
  submittedAt: string;
}

const RISK_COLOURS: Record<string, string> = {
  "lower-concern": "#2e7d52",
  "moderate-concern": "#b08a2a",
  "higher-concern": "#c0622a",
  "possible-detox-risk": "#9b2a2a",
  "urgent-medical-advice": "#6b1a1a",
};

function buildAssessmentResultHtml(data: AssessmentEmailData): string {
  const colour = RISK_COLOURS[data.scoreLevel] ?? "#162B3B";
  const isHighRisk = data.scoreLevel === "possible-detox-risk" || data.scoreLevel === "urgent-medical-advice";
  const safetyNote = isHighRisk
    ? `<div style="background:#fff0f0;border:1px solid #f5c6cb;padding:16px;margin-bottom:24px;font-size:14px;color:#721c24;line-height:1.6;">
        <strong>Important:</strong> Your results suggest that stopping or reducing alcohol suddenly could be unsafe. Please do not stop drinking abruptly without speaking to a clinician first. If you are in crisis, call 999 or go to your nearest A&amp;E.
       </div>`
    : "";
  const anchorBlock = data.anchorResponse
    ? `<div style="margin-top:24px;border-top:1px solid #e0ddd8;padding-top:24px;">
        <div style="font-weight:bold;color:#162B3B;margin-bottom:8px;font-size:14px;">A note from Anchor</div>
        <div style="background:#f9f8f6;border:1px solid #e0ddd8;padding:16px;font-size:14px;line-height:1.8;white-space:pre-wrap;">${escapeHtml(data.anchorResponse)}</div>
        <p style="color:#999;font-size:11px;margin-top:8px;">Anchor is an AI-assisted guidance tool. This is not a diagnosis and does not replace professional medical advice.</p>
       </div>`
    : "";

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="font-family:Georgia,serif;color:#1a1a2e;background:#f9f8f6;padding:32px;">
  <div style="max-width:620px;margin:0 auto;background:#ffffff;border:1px solid #e0ddd8;padding:40px;">
    <h2 style="color:#2c3e6b;font-size:22px;margin-top:0;">Your Assessment Results — Insight Recovery Network</h2>
    <p style="color:#555;font-size:15px;line-height:1.6;">Thank you for completing the <strong>${escapeHtml(data.type.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()))}</strong>. Your results are below.</p>
    <hr style="border:none;border-top:1px solid #e0ddd8;margin:24px 0;" />
    ${safetyNote}
    <div style="border-left:4px solid ${colour};padding:12px 16px;margin-bottom:24px;background:#fafaf8;">
      <div style="font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#888;margin-bottom:4px;">Result Level</div>
      <div style="font-size:20px;font-weight:bold;color:${colour};">${escapeHtml(data.scoreLabel)}</div>
    </div>
    ${anchorBlock}
    <hr style="border:none;border-top:1px solid #e0ddd8;margin:32px 0 16px;" />
    <p style="color:#555;font-size:14px;line-height:1.6;">A member of the Insight Recovery Network team may be in touch to follow up confidentially. If you would like to speak with us sooner, please reply to this email or visit <a href="https://www.insightrecoverynetwork.com/contact" style="color:#2c3e6b;">our contact page</a>.</p>
    <p style="color:#999;font-size:11px;margin-top:24px;">This assessment was completed on ${escapeHtml(data.submittedAt)}. Your responses are stored securely and are completely confidential.</p>
  </div>
</body>
</html>`.trim();
}

function buildAssessmentLeadHtml(data: AssessmentEmailData): string {
  const colour = RISK_COLOURS[data.scoreLevel] ?? "#162B3B";
  const isHighRisk = data.scoreLevel === "possible-detox-risk" || data.scoreLevel === "urgent-medical-advice";
  const urgencyBadge = isHighRisk
    ? `<div style="background:#fff0f0;border:1px solid #f5c6cb;padding:10px 16px;margin-bottom:20px;font-size:14px;color:#721c24;font-weight:bold;">⚠ HIGH RISK — Priority follow-up recommended</div>`
    : "";
  const redFlagRows = data.redFlags.length > 0
    ? `<tr><td style="padding:10px 0;color:#666;width:200px;vertical-align:top;font-weight:bold;">Red Flags</td><td style="padding:10px 0;color:#9b2a2a;">${escapeHtml(data.redFlags.join(", "))}</td></tr>`
    : "";
  const tagsRow = data.tags.length > 0
    ? `<tr style="background:#f9f8f6;"><td style="padding:10px 0;color:#666;width:200px;vertical-align:top;font-weight:bold;">Tags</td><td style="padding:10px 0;font-size:12px;">${escapeHtml(data.tags.join(", "))}</td></tr>`
    : "";

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="font-family:Georgia,serif;color:#1a1a2e;background:#f9f8f6;padding:32px;">
  <div style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #e0ddd8;padding:40px;">
    <h2 style="color:#2c3e6b;font-size:22px;margin-top:0;">New Assessment Lead — Insight Recovery Network</h2>
    <hr style="border:none;border-top:1px solid #e0ddd8;margin:24px 0;" />
    ${urgencyBadge}
    <div style="border-left:4px solid ${colour};padding:12px 16px;margin-bottom:24px;background:#fafaf8;">
      <div style="font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#888;margin-bottom:4px;">Result Level</div>
      <div style="font-size:20px;font-weight:bold;color:${colour};">${escapeHtml(data.scoreLabel)} (Score: ${data.scoreValue})</div>
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:15px;">
      <tr><td style="padding:10px 0;color:#666;width:200px;font-weight:bold;">Name</td><td style="padding:10px 0;">${escapeHtml(data.name)}</td></tr>
      <tr style="background:#f9f8f6;"><td style="padding:10px 0;color:#666;font-weight:bold;">Email</td><td style="padding:10px 0;"><a href="mailto:${escapeHtml(data.email)}" style="color:#2c3e6b;">${escapeHtml(data.email)}</a></td></tr>
      <tr><td style="padding:10px 0;color:#666;font-weight:bold;">Phone</td><td style="padding:10px 0;">${data.phone ? escapeHtml(data.phone) : "Not provided"}</td></tr>
      <tr style="background:#f9f8f6;"><td style="padding:10px 0;color:#666;font-weight:bold;">Assessment Type</td><td style="padding:10px 0;">${escapeHtml(data.type)}</td></tr>
      ${redFlagRows}
      ${tagsRow}
      <tr><td style="padding:10px 0;color:#666;font-weight:bold;">Submitted</td><td style="padding:10px 0;">${escapeHtml(data.submittedAt)}</td></tr>
    </table>
    <div style="margin-top:24px;">
      <div style="color:#666;font-weight:bold;margin-bottom:8px;">Section Summary</div>
      <div style="background:#f9f8f6;border:1px solid #e0ddd8;padding:16px;font-size:13px;line-height:1.7;white-space:pre-wrap;">${escapeHtml(data.sectionSummary)}</div>
    </div>
    ${data.anchorResponse ? `<div style="margin-top:24px;"><div style="color:#666;font-weight:bold;margin-bottom:8px;">Anchor Response (sent to client)</div><div style="background:#f9f8f6;border:1px solid #e0ddd8;padding:16px;font-size:13px;line-height:1.7;white-space:pre-wrap;">${escapeHtml(data.anchorResponse)}</div></div>` : ""}
    <hr style="border:none;border-top:1px solid #e0ddd8;margin:32px 0 16px;" />
    <p style="color:#999;font-size:11px;">Submitted via the IRN Assessment system. Confidential — do not forward.</p>
  </div>
</body>
</html>`.trim();
}

export async function sendAssessmentResultToUser(data: AssessmentEmailData): Promise<void> {
  const apiKey = process.env["RESEND_API_KEY"];
  const fromEmail = process.env["ENQUIRY_FROM_EMAIL"];

  if (!apiKey || !fromEmail) {
    logger.info("Resend not configured — skipping user result email");
    return;
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: fromEmail,
    to: data.email,
    subject: `Your Assessment Results — Insight Recovery Network`,
    html: buildAssessmentResultHtml(data),
    text: `Your Assessment Results\n\nResult: ${data.scoreLabel}\n\n${data.anchorResponse}\n\nInsight Recovery Network — www.insightrecoverynetwork.com`,
  });

  if (error) throw new Error(`Resend error: ${error.message}`);
  logger.info({ to: data.email }, "Assessment result email sent to user");
}

export async function sendAssessmentLeadToCraig(data: AssessmentEmailData): Promise<void> {
  const apiKey = process.env["RESEND_API_KEY"];
  const toEmail = process.env["ENQUIRY_TO_EMAIL"];
  const fromEmail = process.env["ENQUIRY_FROM_EMAIL"];

  if (!apiKey || !toEmail || !fromEmail) {
    logger.info("Resend not configured — skipping lead notification email");
    return;
  }

  const isHighRisk = data.scoreLevel === "possible-detox-risk" || data.scoreLevel === "urgent-medical-advice";
  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: fromEmail,
    to: toEmail,
    subject: `${isHighRisk ? "⚠ HIGH RISK — " : ""}New Assessment Lead: ${data.name} — ${data.scoreLabel}`,
    html: buildAssessmentLeadHtml(data),
    text: `New Assessment Lead\n\nName: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone ?? "Not provided"}\nScore: ${data.scoreLabel} (${data.scoreValue})\nRed Flags: ${data.redFlags.join(", ") || "None"}\nTags: ${data.tags.join(", ")}\n\nSection Summary:\n${data.sectionSummary}`,
  });

  if (error) throw new Error(`Resend error: ${error.message}`);
  logger.info({ to: toEmail }, "Assessment lead email sent to Craig");
}

export async function sendEnquiryNotification(data: EnquiryData): Promise<void> {
  const apiKey = process.env["RESEND_API_KEY"];
  const toEmail = process.env["ENQUIRY_TO_EMAIL"];
  const fromEmail = process.env["ENQUIRY_FROM_EMAIL"];

  if (!apiKey) {
    logger.info("RESEND_API_KEY not set — skipping email notification");
    return;
  }

  if (!toEmail) {
    logger.info("ENQUIRY_TO_EMAIL not set — skipping email notification");
    return;
  }

  if (!fromEmail) {
    logger.info("ENQUIRY_FROM_EMAIL not set — skipping email notification");
    return;
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from: fromEmail,
    to: toEmail,
    subject: "New IRN website enquiry",
    html: buildNotificationHtml(data),
    text: buildNotificationText(data),
  });

  if (error) {
    throw new Error(`Resend error: ${error.message}`);
  }

  logger.info({ to: toEmail }, "Enquiry notification email sent via Resend");
}

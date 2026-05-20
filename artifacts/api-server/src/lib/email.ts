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
  advisories: string[];
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
  const hasMentalHealthAdvisory = data.advisories.includes("mental-health-advisory");
  const hasMentalHealthRedFlag = data.redFlags.includes("mental-health-risk");
  const mentalHealthBlock = hasMentalHealthRedFlag
    ? `<div style="background:#fdf4ff;border:1px solid #d8b4fe;padding:14px 16px;margin-bottom:24px;font-size:14px;color:#4c1d95;line-height:1.7;">
        <strong>If you are having thoughts of self-harm or suicide:</strong> please reach out for support now. You can speak to the Samaritans at any time — call <strong>116 123</strong> (free, 24/7) or text <strong>SHOUT</strong> to <strong>85258</strong>. If you believe you are in immediate danger, call <strong>999</strong> or go to your nearest A&amp;E. You do not have to face this alone.
       </div>`
    : hasMentalHealthAdvisory
    ? `<div style="background:#fffbeb;border:1px solid #fcd34d;padding:14px 16px;margin-bottom:24px;font-size:14px;color:#78350f;line-height:1.6;">
        <strong>Emotional wellbeing note:</strong> You also reported significant low mood or anxiety. This does not automatically mean there is an immediate crisis, but it does suggest that emotional wellbeing should be part of any support plan. If these feelings become overwhelming or you feel unsafe, please seek urgent help immediately.
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
    ${mentalHealthBlock}
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
  const isDetoxMedicalRisk = data.scoreLevel === "possible-detox-risk" || data.scoreLevel === "urgent-medical-advice";
  const hasSafeguarding = data.tags.includes("urgent-safeguarding");
  const detoxBadge = isDetoxMedicalRisk
    ? `<div style="background:#fff0f0;border:1px solid #f5c6cb;padding:10px 16px;margin-bottom:10px;font-size:14px;color:#721c24;font-weight:bold;">⚠ HIGH RISK — Urgent medical advice priority. Priority follow-up recommended.</div>`
    : "";
  const safeguardingBadge = hasSafeguarding
    ? `<div style="background:#fdf4ff;border:1px solid #d8b4fe;padding:10px 16px;margin-bottom:20px;font-size:14px;color:#5b21b6;font-weight:bold;">⚠ URGENT SAFEGUARDING PRIORITY — Self-harm or suicidal ideation reported. Crisis support consideration required.</div>`
    : isDetoxMedicalRisk ? `<div style="margin-bottom:10px;"></div>` : "";
  const urgencyBadge = `${detoxBadge}${safeguardingBadge}`;
  const hasMentalHealthRedFlagLead = data.redFlags.includes("mental-health-risk");
  const hasMentalHealthAdvisoryLead = data.advisories.includes("mental-health-advisory");
  const redFlagRows = data.redFlags.length > 0
    ? `<tr><td style="padding:10px 0;color:#666;width:200px;vertical-align:top;font-weight:bold;">Red Flags</td><td style="padding:10px 0;color:#9b2a2a;">${escapeHtml(data.redFlags.join(", "))}</td></tr>`
    : "";
  const mentalHealthLeadRow = hasMentalHealthRedFlagLead
    ? `<tr style="background:#fdf4ff;"><td style="padding:10px 0;color:#666;width:200px;vertical-align:top;font-weight:bold;">Mental Health</td><td style="padding:10px 0;color:#5b21b6;font-size:13px;"><strong>⚠ Urgent safeguarding priority.</strong> Self-harm or suicidal ideation reported — <strong>mental-health-red-flag, urgent-safeguarding, crisis-support-recommended</strong>. Immediate crisis support consideration required.</td></tr>`
    : hasMentalHealthAdvisoryLead
    ? `<tr style="background:#fffbeb;"><td style="padding:10px 0;color:#666;width:200px;vertical-align:top;font-weight:bold;">Mental Health</td><td style="padding:10px 0;color:#78350f;font-size:13px;">Significant low mood or anxiety reported — <strong>mental-health-advisory</strong>. Not urgent escalation, but should be included in any support plan discussion.</td></tr>`
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
      ${mentalHealthLeadRow}
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
  const toEmail = process.env["ANCHOR_FEEDBACK_TO"];
  const ccEmail = process.env["ANCHOR_FEEDBACK_CC"];
  const fromEmail = process.env["ENQUIRY_FROM_EMAIL"];

  if (!apiKey || !toEmail || !fromEmail) {
    logger.info("ANCHOR_FEEDBACK_TO or ENQUIRY_FROM_EMAIL not set — skipping lead notification email");
    return;
  }

  const isDetoxMedicalRisk = data.scoreLevel === "possible-detox-risk" || data.scoreLevel === "urgent-medical-advice";
  const hasSafeguardingTag = data.tags.includes("urgent-safeguarding");
  let subjectPrefix = "";
  if (hasSafeguardingTag && isDetoxMedicalRisk) subjectPrefix = "⚠ SAFEGUARDING + MEDICAL — ";
  else if (hasSafeguardingTag) subjectPrefix = "⚠ SAFEGUARDING — ";
  else if (isDetoxMedicalRisk) subjectPrefix = "⚠ HIGH RISK — ";
  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: fromEmail,
    to: toEmail,
    ...(ccEmail ? { cc: ccEmail } : {}),
    subject: `${subjectPrefix}New Assessment Lead: ${data.name} — ${data.scoreLabel}`,
    html: buildAssessmentLeadHtml(data),
    text: `New Assessment Lead\n\nName: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone ?? "Not provided"}\nScore: ${data.scoreLabel} (${data.scoreValue})\nRed Flags: ${data.redFlags.join(", ") || "None"}\nTags: ${data.tags.join(", ")}\n\nSection Summary:\n${data.sectionSummary}`,
  });

  if (error) throw new Error(`Resend error: ${error.message}`);
  logger.info({ to: toEmail, cc: ccEmail }, "Assessment lead email sent");
}

interface AcknowledgementData {
  name: string;
  email: string;
}

function buildAcknowledgementHtml(data: AcknowledgementData, teamEmail: string): string {
  const firstName = escapeHtml(data.name.split(" ")[0] || data.name);
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="font-family:Georgia,serif;color:#1a1a2e;background:#f9f8f6;padding:32px;">
  <div style="max-width:620px;margin:0 auto;background:#ffffff;border:1px solid #e0ddd8;padding:40px 44px;">

    <div style="border-left:3px solid #C9A96E;padding-left:14px;margin-bottom:32px;">
      <p style="margin:0;font-size:11px;font-family:Arial,sans-serif;text-transform:uppercase;letter-spacing:2px;color:#C9A96E;">Insight Recovery Network</p>
    </div>

    <h1 style="color:#162B3B;font-size:22px;font-weight:normal;margin:0 0 20px;line-height:1.3;">We've received your enquiry.</h1>

    <p style="font-size:15px;line-height:1.8;color:#444;margin:0 0 18px;">Dear ${firstName},</p>

    <p style="font-size:15px;line-height:1.8;color:#444;margin:0 0 18px;">Thank you for reaching out to us. We have received your message and someone from our team will be in touch with you shortly.</p>

    <p style="font-size:15px;line-height:1.8;color:#444;margin:0 0 18px;">We understand that taking this step can feel significant, and we want you to know that every enquiry we receive is treated with care and complete confidentiality — whether you are seeking support for yourself or for someone you love.</p>

    <p style="font-size:15px;line-height:1.8;color:#444;margin:0 0 28px;">If you would prefer to speak with someone sooner, or have an urgent concern, you are welcome to contact us directly at <a href="mailto:${escapeHtml(teamEmail)}" style="color:#162B3B;text-decoration:underline;">${escapeHtml(teamEmail)}</a>.</p>

    <hr style="border:none;border-top:1px solid #e0ddd8;margin:0 0 28px;" />

    <p style="font-size:14px;line-height:1.8;color:#555;margin:0 0 6px;">Warm regards,</p>
    <p style="font-size:14px;line-height:1.8;color:#162B3B;font-weight:bold;margin:0 0 4px;">The Insight Recovery Network Team</p>
    <a href="https://www.insightrecoverynetwork.com" style="font-size:13px;color:#888;text-decoration:none;">www.insightrecoverynetwork.com</a>

    <p style="font-size:11px;color:#bbb;margin-top:32px;line-height:1.6;">This is an automated acknowledgement. Please do not reply directly to this message — instead contact us at <a href="mailto:${escapeHtml(teamEmail)}" style="color:#bbb;">${escapeHtml(teamEmail)}</a>.</p>
  </div>
</body>
</html>`.trim();
}

function buildAcknowledgementText(data: AcknowledgementData, teamEmail: string): string {
  const firstName = data.name.split(" ")[0] || data.name;
  return [
    "We've received your enquiry — Insight Recovery Network",
    "",
    `Dear ${firstName},`,
    "",
    "Thank you for reaching out to us. We have received your message and someone from our team will be in touch with you shortly.",
    "",
    "We understand that taking this step can feel significant, and we want you to know that every enquiry we receive is treated with care and complete confidentiality — whether you are seeking support for yourself or for someone you love.",
    "",
    `If you would prefer to speak with someone sooner, or have an urgent concern, you are welcome to contact us directly at ${teamEmail}.`,
    "",
    "Warm regards,",
    "The Insight Recovery Network Team",
    "www.insightrecoverynetwork.com",
  ].join("\n");
}

export async function sendAcknowledgementEmail(data: AcknowledgementData): Promise<void> {
  const apiKey = process.env["RESEND_API_KEY"];
  const fromEmail = process.env["ENQUIRY_FROM_EMAIL"];
  const teamEmail = process.env["GENERAL_ENQUIRY_TO"] ?? fromEmail ?? "";

  if (!apiKey || !fromEmail) {
    logger.info("Resend not configured — skipping acknowledgement email");
    return;
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from: fromEmail,
    to: data.email,
    ...(teamEmail ? { replyTo: teamEmail } : {}),
    subject: "We've received your enquiry — Insight Recovery Network",
    html: buildAcknowledgementHtml(data, teamEmail),
    text: buildAcknowledgementText(data, teamEmail),
  });

  if (error) {
    throw new Error(`Resend error: ${error.message}`);
  }

  logger.info({ to: data.email }, "Acknowledgement email sent to visitor");
}

export async function sendEnquiryNotification(data: EnquiryData): Promise<void> {
  const apiKey = process.env["RESEND_API_KEY"];
  const toEmail = process.env["GENERAL_ENQUIRY_TO"];
  const fromEmail = process.env["ENQUIRY_FROM_EMAIL"];

  if (!apiKey) {
    logger.info("RESEND_API_KEY not set — skipping email notification");
    return;
  }

  if (!toEmail) {
    logger.info("GENERAL_ENQUIRY_TO not set — skipping email notification");
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

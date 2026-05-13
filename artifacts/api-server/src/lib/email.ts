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

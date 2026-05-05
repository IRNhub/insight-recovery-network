import nodemailer from "nodemailer";
import { logger } from "./logger";

interface EnquiryData {
  name: string;
  email: string;
  phone: string;
  preferredContact: string;
  supportType: string;
  message: string;
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

function buildEmailHtml(data: EnquiryData): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="font-family: Georgia, serif; color: #1a1a2e; background: #f9f8f6; padding: 32px;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e0ddd8; padding: 40px;">
    <h2 style="color: #2c3e6b; font-size: 22px; margin-top: 0;">New Enquiry — Insight Recovery Network</h2>
    <hr style="border: none; border-top: 1px solid #e0ddd8; margin: 24px 0;" />
    <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
      <tr>
        <td style="padding: 10px 0; color: #666; width: 180px; vertical-align: top; font-weight: bold;">Name</td>
        <td style="padding: 10px 0;">${escapeHtml(data.name)}</td>
      </tr>
      <tr style="background: #f9f8f6;">
        <td style="padding: 10px 0; color: #666; vertical-align: top; font-weight: bold;">Email</td>
        <td style="padding: 10px 0;"><a href="mailto:${escapeHtml(data.email)}" style="color: #2c3e6b;">${escapeHtml(data.email)}</a></td>
      </tr>
      <tr>
        <td style="padding: 10px 0; color: #666; vertical-align: top; font-weight: bold;">Phone / WhatsApp</td>
        <td style="padding: 10px 0;">${escapeHtml(data.phone)}</td>
      </tr>
      <tr style="background: #f9f8f6;">
        <td style="padding: 10px 0; color: #666; vertical-align: top; font-weight: bold;">Preferred Contact</td>
        <td style="padding: 10px 0;">${escapeHtml(CONTACT_LABELS[data.preferredContact] ?? data.preferredContact)}</td>
      </tr>
      <tr>
        <td style="padding: 10px 0; color: #666; vertical-align: top; font-weight: bold;">Support Type</td>
        <td style="padding: 10px 0;">${escapeHtml(SUPPORT_TYPE_LABELS[data.supportType] ?? data.supportType)}</td>
      </tr>
    </table>
    <div style="margin-top: 24px;">
      <div style="color: #666; font-weight: bold; margin-bottom: 8px;">Message</div>
      <div style="background: #f9f8f6; border: 1px solid #e0ddd8; padding: 16px; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(data.message)}</div>
    </div>
    <hr style="border: none; border-top: 1px solid #e0ddd8; margin: 32px 0 16px;" />
    <p style="color: #999; font-size: 12px; margin: 0;">This enquiry was submitted via the Insight Recovery Network contact form. The enquirer has consented to being contacted.</p>
  </div>
</body>
</html>
  `.trim();
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildTransporter() {
  const host = process.env["SMTP_HOST"];
  const port = parseInt(process.env["SMTP_PORT"] ?? "587", 10);
  const user = process.env["SMTP_USER"];
  const pass = process.env["SMTP_PASS"];

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

function buildAcknowledgementHtml(data: EnquiryData): string {
  const fromEmail = process.env["SMTP_FROM"] ?? process.env["SMTP_USER"] ?? "hello@insightrecoverynetwork.com";
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="font-family: Georgia, serif; color: #1a1a2e; background: #f9f8f6; padding: 32px;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e0ddd8; padding: 40px;">
    <h2 style="color: #2c3e6b; font-size: 22px; margin-top: 0;">Thank you for reaching out</h2>
    <hr style="border: none; border-top: 1px solid #e0ddd8; margin: 24px 0;" />
    <p style="font-size: 16px; line-height: 1.7; margin-top: 0;">Dear ${escapeHtml(data.name)},</p>
    <p style="font-size: 16px; line-height: 1.7;">Thank you for contacting Insight Recovery Network. We have received your enquiry and a member of our team will be in touch with you shortly.</p>
    <p style="font-size: 16px; line-height: 1.7;">We understand that reaching out can take courage, and we want you to know that your message matters to us. You will hear from us as soon as possible — typically within one working day.</p>
    <p style="font-size: 16px; line-height: 1.7;">If you need to speak with someone sooner, or if anything urgent has come up in the meantime, please do not hesitate to contact us directly at <a href="mailto:${escapeHtml(fromEmail)}" style="color: #2c3e6b;">${escapeHtml(fromEmail)}</a>.</p>
    <p style="font-size: 16px; line-height: 1.7;">Take care,<br /><strong>The Insight Recovery Network Team</strong></p>
    <hr style="border: none; border-top: 1px solid #e0ddd8; margin: 32px 0 16px;" />
    <p style="color: #999; font-size: 12px; margin: 0;">You are receiving this email because you submitted an enquiry via the Insight Recovery Network contact form. If you did not submit this enquiry, please ignore this email or contact us at <a href="mailto:${escapeHtml(fromEmail)}" style="color: #999;">${escapeHtml(fromEmail)}</a>.</p>
  </div>
</body>
</html>
  `.trim();
}

export async function sendAcknowledgementEmail(data: EnquiryData): Promise<void> {
  const transporter = buildTransporter();

  if (!transporter) {
    logger.info("SMTP not configured — skipping acknowledgement email");
    return;
  }

  const fromEmail = process.env["SMTP_FROM"] ?? process.env["SMTP_USER"] ?? "hello@insightrecoverynetwork.com";
  const subject = "We've received your enquiry — Insight Recovery Network";

  await transporter.sendMail({
    from: fromEmail,
    to: data.email,
    subject,
    html: buildAcknowledgementHtml(data),
    text: [
      `Dear ${data.name},`,
      ``,
      `Thank you for contacting Insight Recovery Network. We have received your enquiry and a member of our team will be in touch with you shortly.`,
      ``,
      `We understand that reaching out can take courage, and we want you to know that your message matters to us. You will hear from us as soon as possible — typically within one working day.`,
      ``,
      `If you need to speak with someone sooner, or if anything urgent has come up in the meantime, please do not hesitate to contact us directly at ${fromEmail}.`,
      ``,
      `Take care,`,
      `The Insight Recovery Network Team`,
    ].join("\n"),
  });

  logger.info({ to: data.email }, "Acknowledgement email sent to enquirer");
}

export async function sendEnquiryNotification(data: EnquiryData): Promise<void> {
  const toEmail = process.env["ENQUIRY_TO_EMAIL"];

  if (!toEmail) {
    logger.info("ENQUIRY_TO_EMAIL not set — skipping email notification");
    return;
  }

  const transporter = buildTransporter();

  if (!transporter) {
    logger.info("SMTP not configured — skipping email notification");
    return;
  }

  const fromEmail = process.env["SMTP_FROM"] ?? process.env["SMTP_USER"] ?? "noreply@insightrecoverynetwork.com";
  const subject = `New enquiry from ${data.name} — Insight Recovery Network`;

  await transporter.sendMail({
    from: fromEmail,
    to: toEmail,
    subject,
    html: buildEmailHtml(data),
    text: [
      `New enquiry from the Insight Recovery Network contact form`,
      ``,
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Phone: ${data.phone}`,
      `Preferred contact: ${CONTACT_LABELS[data.preferredContact] ?? data.preferredContact}`,
      `Support type: ${SUPPORT_TYPE_LABELS[data.supportType] ?? data.supportType}`,
      ``,
      `Message:`,
      data.message,
    ].join("\n"),
  });

  logger.info({ to: toEmail }, "Enquiry notification email sent");
}

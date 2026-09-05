import { z } from "zod";

const optionalText = (maximum: number) =>
  z.string().trim().max(maximum).optional().default("");
export const enquiryInput = z
  .object({
    name: z.string().trim().min(2, "Please enter your name").max(120),
    email: optionalText(254).refine(
      (value) => !value || z.string().email().safeParse(value).success,
      "Please enter a valid email address",
    ),
    phone: optionalText(35).refine(
      (value) =>
        !value ||
        (/^[+0-9() .-]+$/.test(value) &&
          value.replace(/\D/g, "").length >= 7 &&
          value.replace(/\D/g, "").length <= 15),
      "Please enter a valid telephone number",
    ),
    preferredContact: z.enum(["email", "phone", "whatsapp"]),
    supportType: z
      .enum(["myself", "someone-else", "professional", "general"])
      .default("general"),
    serviceInterest: z
      .enum([
        "treatment-placement",
        "online-programme",
        "family-support",
        "intervention",
        "free-assessment",
        "insight-os",
        "professional",
        "not-sure",
      ])
      .default("not-sure")
      .transform((value) =>
        value === "intervention" ? ("family-support" as const) : value,
      ),
    message: optionalText(2400),
    consent: z.literal(true, {
      errorMap: () => ({
        message: "Please agree that IRN may respond to your enquiry",
      }),
    }),
    submissionId: z.string().uuid().optional(),
    website: optionalText(200),
    landingPage: optionalText(250),
    currentPage: optionalText(250),
    pageSource: optionalText(250),
    referrer: optionalText(250),
    utmSource: optionalText(80),
    utmMedium: optionalText(80),
    utmCampaign: optionalText(80),
    utmTerm: optionalText(80),
    utmContent: optionalText(80),
  })
  .superRefine((value, context) => {
    const field = value.preferredContact === "email" ? "email" : "phone";
    if (!value[field])
      context.addIssue({
        code: "custom",
        path: [field],
        message: `Please enter your ${field === "email" ? "email address" : "telephone number"}`,
      });
  });
export type EnquiryInput = z.infer<typeof enquiryInput>;

export function sanitiseEnquirySource(input: EnquiryInput): EnquiryInput {
  const result = { ...input };
  for (const field of [
    "landingPage",
    "currentPage",
    "pageSource",
    "referrer",
  ] as const) {
    const value = input[field];
    if (!value) continue;
    try {
      const url = new URL(value, "https://www.insightrecoverynetwork.com");
      result[field] =
        url.origin === "https://www.insightrecoverynetwork.com"
          ? /^\/(assessment|survey|research|admin)/.test(url.pathname)
            ? "/"
            : url.pathname
          : url.hostname;
    } catch {
      result[field] = "";
    }
  }
  for (const field of [
    "utmSource",
    "utmMedium",
    "utmCampaign",
    "utmTerm",
    "utmContent",
  ] as const) {
    if (
      !/^[a-zA-Z][a-zA-Z0-9_-]{0,79}$/.test(input[field]) ||
      /\d{7}/.test(input[field])
    )
      result[field] = "";
  }
  return result;
}

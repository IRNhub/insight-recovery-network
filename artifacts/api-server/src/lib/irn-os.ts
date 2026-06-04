import { logger } from "./logger";

interface IrnOsLeadPayload {
  enquiryId: string;
  createdAt: Date;
  name: string;
  email: string;
  phone: string;
  preferredContact: string;
  supportType: string;
  message: string;
  consent: boolean;
  landingPage?: string | null;
  currentPage?: string | null;
  referrer?: string | null;
  pageSource?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmTerm?: string | null;
  utmContent?: string | null;
  submittedAt: string;
}

export async function forwardEnquiryToIrnOs(payload: IrnOsLeadPayload): Promise<{
  forwarded: boolean;
  duplicate?: boolean;
  leadId?: string;
  error?: string;
}> {
  const endpoint = process.env.IRN_OS_LEAD_ENDPOINT;
  const apiKey = process.env.IRN_OS_LEAD_API_KEY;

  if (!endpoint || !apiKey) {
    logger.info("IRN OS lead forwarding not configured");
    return { forwarded: false, error: "not_configured" };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        ...payload,
        createdAt: payload.createdAt.toISOString(),
      }),
      signal: controller.signal,
    });

    const data = (await response.json().catch(() => null)) as any;

    if (!response.ok) {
      const error = data?.error || `IRN OS returned ${response.status}`;
      logger.warn({ error, status: response.status, enquiryId: payload.enquiryId }, "IRN OS lead forwarding failed");
      return { forwarded: false, error };
    }

    return {
      forwarded: true,
      duplicate: Boolean(data?.duplicate),
      leadId: typeof data?.leadId === "string" ? data.leadId : undefined,
    };
  } catch (err: any) {
    const error = err?.name === "AbortError" ? "IRN OS forwarding timed out" : err?.message || "Unknown IRN OS forwarding error";
    logger.warn({ error, enquiryId: payload.enquiryId }, "IRN OS lead forwarding failed");
    return { forwarded: false, error };
  } finally {
    clearTimeout(timeout);
  }
}

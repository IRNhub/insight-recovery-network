/**
 * IRN OS CRM integration helper.
 *
 * This module is the single integration point between the public marketing
 * website and the IRN OS platform. When the CRM webhook endpoint is ready,
 * replace IRN_OS_ENDPOINT with the real URL and remove the placeholder guard.
 *
 * The payload shape is intentionally stable so the API contract can be agreed
 * before the endpoint exists.
 */

export interface IrnOsLeadPayload {
  name: string;
  email: string;
  phone: string;
  preferredContactMethod: string;
  enquiryType: string;
  message: string;
  consentAccepted: boolean;
  source: "Website";
  pageSource: string;
  createdAt: string;
}

/**
 * Submits a lead to the IRN OS CRM.
 *
 * Currently a placeholder: the endpoint URL is not yet configured so the
 * function resolves successfully after a short delay to allow the frontend
 * to show a confirmation state. Replace IRN_OS_ENDPOINT with the real URL
 * when the CRM webhook is available.
 */
export async function submitLeadToIrnOs(payload: IrnOsLeadPayload): Promise<void> {
  const endpoint = import.meta.env.VITE_IRN_OS_ENDPOINT as string | undefined;

  if (!endpoint) {
    if (import.meta.env.DEV) {
      console.info("[IRN OS] Placeholder — no VITE_IRN_OS_ENDPOINT set. Lead payload:", {
        ...payload,
        email: "[redacted]",
        phone: "[redacted]",
      });
    }
    await new Promise<void>((resolve) => setTimeout(resolve, 800));
    return;
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`IRN OS endpoint responded with ${response.status}`);
  }
}

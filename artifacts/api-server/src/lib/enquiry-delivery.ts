import type { EnquiryStore } from "./enquiry-store.ts";

type Payload = {
  enquiryId: string;
  createdAt: Date;
  name: string;
  email: string;
  phone: string;
  preferredContact: string;
  supportType: string;
  serviceInterest: string;
  message: string;
  consent: boolean;
  submittedAt: string;
};
type Dependencies = {
  store: EnquiryStore;
  notify: (payload: Payload, idempotencyKey: string) => Promise<void>;
  forward: (
    payload: Payload,
  ) => Promise<{ forwarded: boolean; leadId?: string }>;
  warn: (details: {
    enquiryId: number;
    channel: string;
    attempt: number;
    code: string;
  }) => void;
};
export function createEnquiryDeliveryRunner({
  store,
  notify,
  forward,
  warn,
}: Dependencies) {
  return async function run(maximum = 10) {
    for (let index = 0; index < maximum; index++) {
      const delivery = await store.claim();
      if (!delivery) break;
      let code: "notification_failed" | "crm_unavailable" | "missing_enquiry" =
        delivery.channel === "crm" ? "crm_unavailable" : "notification_failed";
      try {
        const record = await store.payload(delivery.enquiry_id);
        if (!record) {
          code = "missing_enquiry";
          throw new Error(code);
        }
        const payload = {
          ...record,
          submittedAt: new Date(record.createdAt).toUTCString(),
        } as Payload;
        let externalId: string | undefined;
        if (delivery.channel === "notification")
          await notify(
            payload,
            `website-enquiry-${delivery.enquiry_id}-notification`,
          );
        else {
          const result = await forward(payload);
          if (!result.forwarded || !result.leadId) throw new Error(code);
          externalId = result.leadId;
        }
        await store.complete(delivery, externalId);
      } catch {
        await store.fail(delivery, code);
        warn({
          enquiryId: delivery.enquiry_id,
          channel: delivery.channel,
          attempt: delivery.attempts,
          code,
        });
      }
    }
  };
}

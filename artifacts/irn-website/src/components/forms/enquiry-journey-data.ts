export type SupportType = "myself" | "someone-else" | "professional" | "general";
export type ServiceInterest = "treatment-placement" | "family-support" | "online-programme" | "insight-os" | "professional" | "not-sure";
export type DiscussionTopic = "options" | "costs" | "next-steps" | "not-sure";
export type EnquiryJourneyOptions = {
  direct?: boolean;
  service?: ServiceInterest | "placement" | "private-placement" | "family" | "online";
  who?: SupportType | "someone" | "not-sure";
};
export type JourneyAnswers = {
  who: SupportType | "";
  service: ServiceInterest | "";
  discussion: DiscussionTopic | "";
};

export const discussionLabels: Record<DiscussionTopic, string> = {
  options: "Understanding the options",
  costs: "Costs and practical arrangements",
  "next-steps": "How to take the next step",
  "not-sure": "I am not sure yet",
};

export function initialJourneyAnswers(options: EnquiryJourneyOptions = {}): JourneyAnswers {
  const services: Record<string, ServiceInterest> = {
    placement: "treatment-placement", "private-placement": "treatment-placement",
    "treatment-placement": "treatment-placement", family: "family-support", "family-support": "family-support",
    online: "online-programme", "online-programme": "online-programme", "insight-os": "insight-os",
    professional: "professional", "not-sure": "not-sure",
  };
  const people: Record<string, SupportType> = {
    myself: "myself", someone: "someone-else", "someone-else": "someone-else",
    professional: "professional", general: "general", "not-sure": "general",
  };
  return { who: people[options.who ?? ""] ?? "", service: services[options.service ?? ""] ?? "", discussion: "" };
}

export const ENQUIRY_MESSAGE_MAX = 1900;
export const SAFE_CONTACT_MAX = 300;

/** Leave room within the API's 2,400-character limit for contact instructions and a topic. */
export function buildEnquiryMessage(input: {
  message: string;
  safeContact: string;
  method: "email" | "phone" | "whatsapp";
  voicemail: boolean;
  discussion?: DiscussionTopic | "";
}) {
  const notes = [
    input.discussion ? `Discuss first: ${discussionLabels[input.discussion]}` : "",
    input.safeContact.trim() ? `Safe contact / preferred time: ${input.safeContact.trim().slice(0, SAFE_CONTACT_MAX)}` : "",
    input.method === "phone" ? `Voicemail: ${input.voicemail ? "permission to leave a message" : "do not leave a message"}` : "",
  ].filter(Boolean).join("\n");
  return [notes, input.message.trim().slice(0, ENQUIRY_MESSAGE_MAX)].filter(Boolean).join("\n\n");
}

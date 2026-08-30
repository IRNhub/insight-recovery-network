import type { AssessmentConfig } from "@/types/assessment";

export const detoxAssessment: AssessmentConfig = {
  id: "detox-suitability",
  title: "Detox Suitability Assessment",
  subtitle:
    "If you are considering stopping or significantly reducing alcohol or other substances, this self-assessment highlights factors that may require professional or medical review. It cannot determine whether detox is medically safe.",
  estimatedMinutes: 10,
  scoreThresholds: {
    moderateConcern: 10,
    higherConcern: 20,
    possibleDetoxRisk: 30,
  },
  sections: [
    {
      id: "current-use",
      title: "Section 1 of 4: Current Use",
      description:
        "These questions help us understand your current level of alcohol or substance use.",
      questions: [
        {
          id: "substance-type",
          text: "Which substance are you primarily looking to stop or reduce?",
          type: "radio",
          required: true,
          options: [
            { value: "alcohol", label: "Alcohol", score: 0 },
            { value: "opiates", label: "Opiates (heroin, prescription opioids)", score: 2 },
            { value: "benzos", label: "Benzodiazepines (Valium, Xanax, Klonopin)", score: 3 },
            { value: "stimulants", label: "Stimulants (cocaine, amphetamines)", score: 1 },
            { value: "multiple", label: "Multiple substances", score: 4 },
            { value: "other", label: "Other", score: 1 },
          ],
        },
        {
          id: "frequency",
          text: "How often are you currently using?",
          type: "radio",
          required: true,
          options: [
            { value: "daily-heavy", label: "Every day, heavily", score: 6 },
            { value: "daily-moderate", label: "Every day, moderate amounts", score: 4 },
            { value: "most-days", label: "Most days", score: 2 },
            { value: "several-week", label: "Several times per week", score: 1 },
            { value: "less", label: "Weekly or less", score: 0 },
          ],
        },
        {
          id: "duration",
          text: "How long have you been using at your current level without a significant break?",
          type: "radio",
          required: true,
          options: [
            { value: "more-than-year", label: "More than a year", score: 4 },
            { value: "6-12-months", label: "6–12 months", score: 3 },
            { value: "1-6-months", label: "1–6 months", score: 2 },
            { value: "less-than-month", label: "Less than a month", score: 0 },
          ],
        },
      ],
    },
    {
      id: "withdrawal-history",
      title: "Section 2 of 4: Withdrawal and Safety History",
      description:
        "This section asks about previous withdrawal experiences. This is the most clinically important part of the assessment.",
      questions: [
        {
          id: "withdrawal-symptoms",
          text: "Have you ever experienced withdrawal symptoms when you stopped or significantly reduced your use?",
          subtext:
            "Symptoms can include sweating, shaking, rapid heartbeat, nausea, anxiety, severe insomnia, or agitation.",
          type: "radio",
          required: true,
          redFlagKey: "withdrawal-symptoms",
          options: [
            { value: "yes-severe", label: "Yes, severe symptoms", score: 10, redFlag: true },
            { value: "yes-mild", label: "Yes, mild to moderate symptoms", score: 5 },
            { value: "not-sure", label: "I am not sure", score: 2 },
            { value: "no", label: "No", score: 0 },
          ],
        },
        {
          id: "seizure-history",
          text: "Have you ever had a seizure (fit) when stopping or reducing use, or been told by a doctor that you are at risk of this?",
          type: "radio",
          required: true,
          redFlagKey: "seizure-history",
          options: [
            { value: "yes", label: "Yes", score: 15, redFlag: true },
            { value: "not-sure", label: "I am not sure", score: 3 },
            { value: "no", label: "No", score: 0 },
          ],
        },
        {
          id: "hallucinations",
          text: "Have you ever experienced hallucinations, seeing, hearing, or feeling things that were not there, during or after stopping use?",
          type: "radio",
          required: true,
          redFlagKey: "hallucinations",
          options: [
            { value: "yes", label: "Yes", score: 12, redFlag: true },
            { value: "not-sure", label: "I am not sure", score: 2 },
            { value: "no", label: "No", score: 0 },
          ],
        },
        {
          id: "previous-detox",
          text: "Have you previously been through a medicated or residential detox programme?",
          type: "radio",
          required: true,
          redFlagKey: "previous-detox-complications",
          options: [
            {
              value: "yes-complications",
              label: "Yes, and I experienced complications",
              score: 8,
              redFlag: true,
            },
            {
              value: "yes-no-complications",
              label: "Yes, without significant complications",
              score: 2,
            },
            {
              value: "tried-alone",
              label: "I have tried to stop alone, without medical support",
              score: 3,
            },
            { value: "no", label: "No", score: 0 },
          ],
        },
      ],
    },
    {
      id: "medical-context",
      title: "Section 3 of 4: Medical and Substance Context",
      description:
        "These questions help us understand any additional medical factors relevant to safe withdrawal.",
      questions: [
        {
          id: "medical-conditions",
          text: "Do you have any serious physical health conditions that a doctor is aware of?",
          subtext:
            "For example: heart or liver disease, diabetes, epilepsy, high blood pressure, or a recent serious illness.",
          type: "radio",
          required: true,
          redFlagKey: "serious-medical-conditions",
          options: [
            { value: "yes", label: "Yes", score: 6, redFlag: true },
            { value: "unsure", label: "I am not sure", score: 2 },
            { value: "no", label: "No", score: 0 },
          ],
        },
        {
          id: "benzodiazepines",
          text: "Do you regularly use benzodiazepines such as diazepam (Valium), lorazepam, or alprazolam (Xanax)?",
          subtext:
            "This includes prescribed or non-prescribed use. Combining benzodiazepines with alcohol significantly increases withdrawal risk.",
          type: "radio",
          required: true,
          redFlagKey: "benzodiazepine-use",
          options: [
            { value: "yes", label: "Yes, regularly", score: 8, redFlag: true },
            { value: "occasionally", label: "Occasionally", score: 4 },
            { value: "no", label: "No", score: 0 },
          ],
        },
        {
          id: "mental-health",
          text: "Are you currently experiencing significant low mood, anxiety, or any thoughts of self-harm or suicide?",
          type: "radio",
          required: true,
          redFlagKey: "mental-health-risk",
          options: [
            {
              value: "yes-self-harm",
              label: "Yes, including thoughts of self-harm or suicide",
              score: 12,
              redFlag: true,
            },
            {
              value: "yes-mood",
              label: "Yes, significant low mood or anxiety",
              score: 4,
              advisoryKey: "mental-health-advisory",
            },
            { value: "somewhat", label: "Somewhat", score: 2 },
            { value: "no", label: "Not particularly", score: 0 },
          ],
        },
      ],
    },
    {
      id: "readiness",
      title: "Section 4 of 4: Readiness",
      description:
        "This section helps us understand your current circumstances and motivation.",
      questions: [
        {
          id: "support",
          text: "Do you have a trusted person at home who could support you during a detox period if needed?",
          type: "radio",
          required: true,
          options: [
            { value: "yes", label: "Yes, reliably", score: 0 },
            { value: "possibly", label: "Possibly, but not reliably", score: 2 },
            { value: "no", label: "No, I would be alone", score: 3 },
          ],
        },
        {
          id: "motivation",
          text: "How would you describe your motivation to stop or significantly reduce your use?",
          type: "radio",
          required: true,
          options: [
            {
              value: "ready",
              label: "I am ready, I want to do whatever it takes",
              score: 0,
            },
            {
              value: "considering",
              label: "I am seriously considering making a change",
              score: 1,
            },
            {
              value: "unsure",
              label: "I am not sure if I want to stop",
              score: 2,
            },
          ],
        },
      ],
    },
    {
      id: "contact-consent",
      title: "Section 5 of 5: Your Details",
      description:
        "Your result will be calculated and saved securely. We will attempt to email a copy, and the useful personalised guidance does not depend on AI.",
      questions: [
        {
          id: "name",
          text: "Your name",
          type: "text",
          required: true,
        },
        {
          id: "email",
          text: "Your email address",
          subtext: "We will attempt to send a copy of the saved result here.",
          type: "email",
          required: true,
        },
        {
          id: "phone",
          text: "Your phone or WhatsApp number (optional)",
          subtext:
            "If you would prefer us to call or message you, include your number here.",
          type: "tel",
          required: false,
        },
      ],
    },
  ],
};

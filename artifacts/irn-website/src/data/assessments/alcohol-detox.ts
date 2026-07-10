import type { AssessmentConfig } from "@/types/assessment";

export const alcoholDetoxAssessment: AssessmentConfig = {
  id: "alcohol-detox",
  title: "Alcohol & Detox Suitability Assessment",
  subtitle:
    "This confidential assessment helps us understand your current relationship with alcohol and identify the safest pathway forward. There are no right or wrong answers.",
  estimatedMinutes: 8,
  scoreThresholds: {
    moderateConcern: 11,
    higherConcern: 22,
    possibleDetoxRisk: 33,
  },
  sections: [
    {
      id: "current-use",
      title: "Section 1 of 5: Current Alcohol Use",
      description:
        "The following questions help us understand the current pattern of your drinking.",
      questions: [
        {
          id: "frequency",
          text: "How often do you currently drink alcohol?",
          type: "radio",
          required: true,
          options: [
            { value: "daily", label: "Every day", score: 6 },
            { value: "4-6-days", label: "4–6 days per week", score: 4 },
            { value: "2-3-days", label: "2–3 days per week", score: 2 },
            { value: "weekly-less", label: "Weekly or less", score: 1 },
            { value: "rarely", label: "Rarely or not at all", score: 0 },
          ],
        },
        {
          id: "quantity",
          text: "On a typical drinking day, roughly how many standard drinks do you have?",
          subtext:
            "One standard drink = a small glass of wine, a single measure of spirits, or a half pint of beer.",
          type: "radio",
          required: true,
          options: [
            { value: "1-2", label: "1–2 drinks", score: 0 },
            { value: "3-4", label: "3–4 drinks", score: 2 },
            { value: "5-7", label: "5–7 drinks", score: 4 },
            { value: "8-12", label: "8–12 drinks", score: 6 },
            { value: "13-plus", label: "13 or more drinks", score: 8 },
          ],
        },
        {
          id: "morning-drinking",
          text: "Do you drink first thing in the morning, or within an hour or two of waking?",
          type: "radio",
          required: true,
          redFlagKey: "morning-drinking",
          options: [
            {
              value: "yes",
              label: "Yes, regularly",
              score: 8,
              redFlag: true,
            },
            { value: "sometimes", label: "Occasionally", score: 4 },
            { value: "no", label: "No", score: 0 },
          ],
        },
        {
          id: "sustained-heavy-use",
          text: "Have you been drinking heavily on most days for two weeks or longer without a significant break?",
          type: "radio",
          required: true,
          options: [
            { value: "yes", label: "Yes", score: 4 },
            { value: "no", label: "No", score: 0 },
          ],
        },
        {
          id: "polysubstance",
          text: "Do you use alcohol alongside other substances, such as recreational drugs, prescription medications, or sleep aids?",
          type: "radio",
          required: true,
          redFlagKey: "polysubstance-use",
          options: [
            {
              value: "yes-regularly",
              label: "Yes, regularly",
              score: 8,
              redFlag: true,
            },
            { value: "yes-sometimes", label: "Sometimes", score: 4 },
            { value: "no", label: "No", score: 0 },
          ],
        },
      ],
    },
    {
      id: "control-consequences",
      title: "Section 2 of 5: Control and Consequences",
      description:
        "These questions explore the impact your drinking has had on your daily life and your relationship with alcohol.",
      questions: [
        {
          id: "cut-down-attempts",
          text: "Have you tried to cut down or stop drinking in the past year?",
          type: "radio",
          required: true,
          options: [
            {
              value: "yes-multiple",
              label: "Yes, several times",
              score: 3,
            },
            { value: "yes-once", label: "Yes, once", score: 2 },
            {
              value: "no-tried",
              label: "No, but I would like to",
              score: 1,
            },
            {
              value: "no-not-wanted",
              label: "No, I have not tried",
              score: 0,
            },
          ],
        },
        {
          id: "consequences",
          text: "Has your drinking caused significant problems in your relationships, work, finances, or legally?",
          type: "radio",
          required: true,
          options: [
            { value: "yes-serious", label: "A lot", score: 4 },
            { value: "yes-some", label: "Moderately", score: 2 },
            { value: "minor", label: "A little", score: 1 },
            { value: "no", label: "Not at all", score: 0 },
          ],
        },
        {
          id: "dependence-feeling",
          text: "Do you feel that you need to drink in order to feel normal, function day-to-day, or manage anxiety?",
          type: "radio",
          required: true,
          options: [
            { value: "yes", label: "Yes, regularly", score: 6 },
            { value: "sometimes", label: "Sometimes", score: 3 },
            { value: "no", label: "No", score: 0 },
          ],
        },
        {
          id: "tolerance",
          text: "Have you noticed that you need to drink more than you used to in order to feel the same effect?",
          type: "radio",
          required: true,
          options: [
            { value: "yes", label: "Yes, noticeably", score: 4 },
            { value: "somewhat", label: "Somewhat", score: 2 },
            { value: "no", label: "No", score: 0 },
          ],
        },
        {
          id: "cravings",
          text: "Do you experience strong urges or cravings for alcohol, particularly when you haven't had a drink for a while?",
          type: "radio",
          required: true,
          options: [
            { value: "frequently", label: "Yes, frequently", score: 4 },
            { value: "sometimes", label: "Sometimes", score: 2 },
            { value: "rarely", label: "Rarely", score: 1 },
            { value: "never", label: "Never", score: 0 },
          ],
        },
      ],
    },
    {
      id: "detox-safety",
      title: "Section 3 of 5: Detox and Safety",
      description:
        "This section asks about physical symptoms and previous experiences. This information is essential for assessing the safest way to reduce or stop drinking.",
      questions: [
        {
          id: "withdrawal-symptoms",
          text: "Have you ever experienced withdrawal symptoms when you have stopped or significantly reduced your drinking?",
          subtext:
            "Withdrawal symptoms can include: sweating, shaking or tremors, rapid heartbeat, nausea, anxiety, and difficulty sleeping.",
          type: "radio",
          required: true,
          redFlagKey: "withdrawal-symptoms",
          options: [
            {
              value: "yes-severe",
              label: "Yes, severe symptoms",
              score: 10,
              redFlag: true,
            },
            { value: "yes-mild", label: "Yes, mild symptoms", score: 5 },
            { value: "not-sure", label: "I am not sure", score: 2 },
            { value: "no", label: "No", score: 0 },
          ],
        },
        {
          id: "seizure-history",
          text: "Have you ever had a seizure (fit) when stopping or reducing alcohol, or been told by a doctor that you are at risk of this?",
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
          text: "Have you ever experienced hallucinations, seeing, hearing, or feeling things that were not there, when stopping or reducing alcohol?",
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
          id: "benzodiazepines",
          text: "Do you regularly use benzodiazepines such as diazepam (Valium), lorazepam, or alprazolam (Xanax)?",
          subtext:
            "This includes prescribed or non-prescribed use. Combining benzodiazepines with alcohol significantly increases risk during withdrawal.",
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
          id: "ghb-use",
          text: "Do you use GHB, GBL, or ketamine, with or without alcohol?",
          subtext:
            "These substances carry significant additional risks during alcohol withdrawal and require specialist assessment.",
          type: "radio",
          required: true,
          redFlagKey: "ghb-gbl-use",
          options: [
            { value: "yes", label: "Yes", score: 10, redFlag: true },
            { value: "occasionally", label: "Occasionally", score: 5 },
            { value: "no", label: "No", score: 0 },
          ],
        },
      ],
    },
    {
      id: "mental-health-readiness",
      title: "Section 4 of 5: Health and Recovery Readiness",
      description:
        "This section helps us understand your overall health context and how ready you feel to make a change.",
      questions: [
        {
          id: "medical-conditions",
          text: "Do you have any serious physical health conditions that a doctor is aware of?",
          subtext:
            "For example: heart or liver disease, diabetes, epilepsy, high blood pressure, or recent serious illness.",
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
          id: "previous-detox",
          text: "Have you previously been through a medicated alcohol detox or residential rehabilitation programme?",
          type: "radio",
          required: true,
          redFlagKey: "previous-detox-complications",
          options: [
            {
              value: "yes-complications",
              label: "Yes, and I had complications",
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
        {
          id: "mental-health",
          text: "Are you currently experiencing significant low mood, anxiety, or any thoughts of harming yourself?",
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
        {
          id: "motivation",
          text: "How would you describe your motivation to make a change with your drinking?",
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
              label: "I am seriously considering making changes",
              score: 1,
            },
            {
              value: "unsure",
              label: "I am not sure if I want to change",
              score: 2,
            },
            {
              value: "not-ready",
              label: "I am not yet ready to make changes",
              score: 3,
            },
          ],
        },
      ],
    },
    {
      id: "contact-consent",
      title: "Section 5 of 5: Your Details",
      description:
        "Your results will be sent to you securely. We will also send a brief, personalised note from Anchor, our recovery guidance system, reflecting what you have shared.",
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
          subtext: "Your result and Anchor's reflection will be sent here.",
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

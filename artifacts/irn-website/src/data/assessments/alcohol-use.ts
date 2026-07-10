import type { AssessmentConfig } from "@/types/assessment";

export const alcoholUseAssessment: AssessmentConfig = {
  id: "alcohol-use",
  title: "Alcohol Use Assessment",
  subtitle:
    "This assessment helps you reflect on your relationship with alcohol and understand whether it may be affecting your wellbeing, health, or daily life. There are no right or wrong answers.",
  estimatedMinutes: 8,
  scoreThresholds: {
    moderateConcern: 8,
    higherConcern: 16,
    possibleDetoxRisk: 100,
  },
  sections: [
    {
      id: "drinking-pattern",
      title: "Section 1 of 4: Drinking Pattern",
      description:
        "These questions help us understand the current pattern of your drinking.",
      questions: [
        {
          id: "frequency",
          text: "How often do you currently drink alcohol?",
          type: "radio",
          required: true,
          options: [
            { value: "daily", label: "Every day", score: 4 },
            { value: "4-6-days", label: "4–6 days per week", score: 3 },
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
            { value: "3-4", label: "3–4 drinks", score: 1 },
            { value: "5-7", label: "5–7 drinks", score: 2 },
            { value: "8-12", label: "8–12 drinks", score: 4 },
            { value: "13-plus", label: "13 or more drinks", score: 6 },
          ],
        },
        {
          id: "binge",
          text: "How often do you drink six or more standard drinks on a single occasion?",
          type: "radio",
          required: true,
          options: [
            { value: "daily", label: "Daily or almost daily", score: 4 },
            { value: "weekly", label: "At least weekly", score: 3 },
            { value: "monthly", label: "At least monthly", score: 2 },
            { value: "less-than-monthly", label: "Less than monthly", score: 1 },
            { value: "never", label: "Never", score: 0 },
          ],
        },
        {
          id: "morning-drinking",
          text: "Do you drink first thing in the morning, or within an hour or two of waking?",
          type: "radio",
          required: true,
          redFlagKey: "morning-drinking",
          options: [
            { value: "yes", label: "Yes, regularly", score: 4, redFlag: true },
            { value: "sometimes", label: "Occasionally", score: 2 },
            { value: "no", label: "No", score: 0 },
          ],
        },
      ],
    },
    {
      id: "control-dependence",
      title: "Section 2 of 4: Control and Dependence",
      description:
        "These questions explore your relationship with alcohol and how much control you feel you have over your drinking.",
      questions: [
        {
          id: "unable-to-stop",
          text: "How often have you found that once you started drinking, you were unable to stop before you intended to?",
          type: "radio",
          required: true,
          options: [
            { value: "often", label: "Often or always", score: 4 },
            { value: "sometimes", label: "Sometimes", score: 2 },
            { value: "rarely", label: "Rarely", score: 1 },
            { value: "never", label: "Never", score: 0 },
          ],
        },
        {
          id: "need-to-function",
          text: "Do you feel that you need alcohol in order to feel normal, function day-to-day, or manage anxiety?",
          type: "radio",
          required: true,
          options: [
            { value: "yes", label: "Yes, regularly", score: 4 },
            { value: "sometimes", label: "Sometimes", score: 2 },
            { value: "rarely", label: "Rarely", score: 1 },
            { value: "no", label: "No", score: 0 },
          ],
        },
        {
          id: "tolerance",
          text: "Have you noticed that you need to drink more than you used to in order to feel the same effect?",
          type: "radio",
          required: true,
          options: [
            { value: "yes", label: "Yes, noticeably", score: 3 },
            { value: "somewhat", label: "Somewhat", score: 2 },
            { value: "no", label: "No", score: 0 },
          ],
        },
      ],
    },
    {
      id: "consequences",
      title: "Section 3 of 4: Consequences and Impact",
      description:
        "These questions help us understand the impact drinking has had on your life and relationships.",
      questions: [
        {
          id: "life-problems",
          text: "Has your drinking caused significant problems in your relationships, work, finances, or legal situation?",
          type: "radio",
          required: true,
          options: [
            { value: "yes-serious", label: "A lot", score: 4 },
            { value: "some-extent", label: "Moderately", score: 2 },
            { value: "minor", label: "A little", score: 1 },
            { value: "no", label: "Not at all", score: 0 },
          ],
        },
        {
          id: "guilt",
          text: "How often have you felt guilt or shame about your drinking, or regretted something you did while drinking?",
          type: "radio",
          required: true,
          options: [
            { value: "often", label: "Often", score: 3 },
            { value: "sometimes", label: "Sometimes", score: 2 },
            { value: "rarely", label: "Rarely", score: 1 },
            { value: "never", label: "Never", score: 0 },
          ],
        },
        {
          id: "cut-down",
          text: "Have you tried to cut down or stop drinking but found it difficult?",
          type: "radio",
          required: true,
          options: [
            { value: "yes-multiple", label: "Yes, several times", score: 3 },
            { value: "yes-once", label: "Yes, once", score: 2 },
            { value: "want-to", label: "I would like to but haven't tried", score: 1 },
            { value: "no", label: "No", score: 0 },
          ],
        },
      ],
    },
    {
      id: "wellbeing-safety",
      title: "Section 4 of 4: Your Wellbeing",
      description:
        "This final section asks about your overall mental and emotional wellbeing.",
      questions: [
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
      id: "contact-consent",
      title: "Section 5 of 5: Your Details",
      description:
        "Your results will be sent to you securely. We will also include a brief personalised note from Anchor, our recovery guidance system, reflecting what you have shared.",
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

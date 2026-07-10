import type { AssessmentConfig } from "@/types/assessment";

export const depressionAssessment: AssessmentConfig = {
  id: "depression",
  title: "Depression Self-Assessment",
  subtitle:
    "This assessment helps you reflect on how low mood or depression may be affecting your daily life, energy levels, and sense of wellbeing. There are no right or wrong answers.",
  estimatedMinutes: 7,
  scoreThresholds: {
    moderateConcern: 10,
    higherConcern: 20,
    possibleDetoxRisk: 100,
  },
  sections: [
    {
      id: "mood-emotional-wellbeing",
      title: "Section 1 of 3: Mood and Emotional Wellbeing",
      description:
        "Over the past two weeks, how often have the following affected you?",
      questions: [
        {
          id: "low-mood",
          text: "Feeling down, depressed, or hopeless",
          type: "radio",
          required: true,
          options: [
            { value: "nearly-every-day", label: "Every day or almost every day", score: 6 },
            { value: "more-than-half", label: "Most days", score: 4 },
            { value: "several-days", label: "Some days", score: 2 },
            { value: "not-at-all", label: "Rarely or not at all", score: 0 },
          ],
        },
        {
          id: "loss-of-interest",
          text: "Little interest or pleasure in things you used to enjoy",
          type: "radio",
          required: true,
          options: [
            { value: "nearly-every-day", label: "Every day or almost every day", score: 6 },
            { value: "more-than-half", label: "Most days", score: 4 },
            { value: "several-days", label: "Some days", score: 2 },
            { value: "not-at-all", label: "Rarely or not at all", score: 0 },
          ],
        },
        {
          id: "worthlessness",
          text: "Feeling worthless, or experiencing excessive guilt about things",
          type: "radio",
          required: true,
          options: [
            { value: "nearly-every-day", label: "Every day or almost every day", score: 4 },
            { value: "more-than-half", label: "Most days", score: 3 },
            { value: "several-days", label: "Some days", score: 1 },
            { value: "not-at-all", label: "Rarely or not at all", score: 0 },
          ],
        },
        {
          id: "hopelessness",
          text: "Feeling that things will not improve, or that there is little point in trying",
          type: "radio",
          required: true,
          options: [
            {
              value: "nearly-every-day",
              label: "Every day or almost every day",
              score: 4,
              advisoryKey: "mental-health-advisory",
            },
            { value: "more-than-half", label: "Most days", score: 3 },
            { value: "several-days", label: "Some days", score: 1 },
            { value: "not-at-all", label: "Rarely or not at all", score: 0 },
          ],
        },
      ],
    },
    {
      id: "energy-physical",
      title: "Section 2 of 3: Energy, Sleep and Concentration",
      description:
        "Over the past two weeks, how often have the following affected you?",
      questions: [
        {
          id: "fatigue",
          text: "Feeling tired or having little energy, even after rest",
          type: "radio",
          required: true,
          options: [
            { value: "nearly-every-day", label: "Every day or almost every day", score: 4 },
            { value: "more-than-half", label: "Most days", score: 3 },
            { value: "several-days", label: "Some days", score: 1 },
            { value: "not-at-all", label: "Rarely or not at all", score: 0 },
          ],
        },
        {
          id: "sleep",
          text: "Trouble sleeping, either too little, too much, or waking in the early hours and being unable to get back to sleep",
          type: "radio",
          required: true,
          options: [
            { value: "nearly-every-day", label: "Every day or almost every day", score: 3 },
            { value: "more-than-half", label: "Most days", score: 2 },
            { value: "several-days", label: "Some days", score: 1 },
            { value: "not-at-all", label: "Rarely or not at all", score: 0 },
          ],
        },
        {
          id: "concentration",
          text: "Trouble concentrating on things such as reading, conversations, or work",
          type: "radio",
          required: true,
          options: [
            { value: "nearly-every-day", label: "Every day or almost every day", score: 3 },
            { value: "more-than-half", label: "Most days", score: 2 },
            { value: "several-days", label: "Some days", score: 1 },
            { value: "not-at-all", label: "Rarely or not at all", score: 0 },
          ],
        },
        {
          id: "appetite",
          text: "Noticeable changes in appetite, eating much less or much more than usual",
          type: "radio",
          required: true,
          options: [
            { value: "nearly-every-day", label: "Every day or almost every day", score: 3 },
            { value: "more-than-half", label: "Most days", score: 2 },
            { value: "several-days", label: "Some days", score: 1 },
            { value: "not-at-all", label: "Rarely or not at all", score: 0 },
          ],
        },
      ],
    },
    {
      id: "safety-coping",
      title: "Section 3 of 3: Coping and Safety",
      description:
        "These questions help us understand how you are currently coping and whether any urgent support may be needed.",
      questions: [
        {
          id: "substance-coping",
          text: "Are you currently using alcohol or other substances more than usual to help cope with how you feel?",
          type: "radio",
          required: true,
          options: [
            {
              value: "yes-significantly",
              label: "Yes, noticeably more than usual",
              score: 4,
              advisoryKey: "mental-health-advisory",
            },
            { value: "somewhat", label: "Somewhat", score: 2 },
            { value: "no", label: "No", score: 0 },
          ],
        },
        {
          id: "withdrawal",
          text: "Have you been withdrawing from family, friends, or social activities more than usual?",
          type: "radio",
          required: true,
          options: [
            { value: "yes-significantly", label: "Yes, significantly", score: 3 },
            { value: "somewhat", label: "Somewhat", score: 1 },
            { value: "no", label: "No", score: 0 },
          ],
        },
        {
          id: "self-harm",
          text: "Do you have any thoughts of harming yourself, or that you would be better off not being here?",
          type: "radio",
          required: true,
          redFlagKey: "mental-health-risk",
          options: [
            {
              value: "yes-significant",
              label: "Yes, these thoughts are significant or recurring",
              score: 15,
              redFlag: true,
            },
            {
              value: "passing-thoughts",
              label: "I have had some passing thoughts",
              score: 6,
              advisoryKey: "mental-health-advisory",
            },
            { value: "no", label: "No", score: 0 },
          ],
        },
      ],
    },
    {
      id: "contact-consent",
      title: "Section 4 of 4: Your Details",
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

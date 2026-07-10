import type { AssessmentConfig } from "@/types/assessment";

export const adhdAssessment: AssessmentConfig = {
  id: "adhd",
  title: "ADHD & Impulsivity Self-Reflection",
  subtitle:
    "This assessment invites you to reflect on patterns of attention, impulsivity, and restlessness that may be affecting your daily life, work, and relationships. There are no right or wrong answers.",
  estimatedMinutes: 8,
  scoreThresholds: {
    moderateConcern: 12,
    higherConcern: 22,
    possibleDetoxRisk: 100,
  },
  sections: [
    {
      id: "attention-focus",
      title: "Section 1 of 3: Attention and Focus",
      description:
        "These questions explore how attention and concentration show up for you day-to-day.",
      questions: [
        {
          id: "sustaining-attention",
          text: "How often do you have difficulty sustaining attention on tasks or activities that require prolonged mental effort, such as reading, completing work, or following conversations?",
          type: "radio",
          required: true,
          options: [
            { value: "very-often", label: "Every day or almost every day", score: 4 },
            { value: "often", label: "Most days", score: 3 },
            { value: "sometimes", label: "Some days", score: 2 },
            { value: "rarely", label: "Rarely or not at all", score: 0 },
          ],
        },
        {
          id: "distraction",
          text: "How often are you easily distracted by external stimuli, background noise, or unrelated thoughts?",
          type: "radio",
          required: true,
          options: [
            { value: "very-often", label: "Every day or almost every day", score: 4 },
            { value: "often", label: "Most days", score: 3 },
            { value: "sometimes", label: "Some days", score: 2 },
            { value: "rarely", label: "Rarely or not at all", score: 0 },
          ],
        },
        {
          id: "losing-things",
          text: "How often do you lose important items, forget appointments, or fail to follow through on commitments, despite intending to?",
          type: "radio",
          required: true,
          options: [
            { value: "very-often", label: "Every day or almost every day", score: 3 },
            { value: "often", label: "Most days", score: 2 },
            { value: "sometimes", label: "Some days", score: 1 },
            { value: "rarely", label: "Rarely or not at all", score: 0 },
          ],
        },
        {
          id: "task-switching",
          text: "How often do you start tasks or projects but then move on to something else before finishing?",
          type: "radio",
          required: true,
          options: [
            { value: "very-often", label: "Every day or almost every day", score: 4 },
            { value: "often", label: "Most days", score: 3 },
            { value: "sometimes", label: "Some days", score: 2 },
            { value: "rarely", label: "Rarely or not at all", score: 0 },
          ],
        },
      ],
    },
    {
      id: "hyperactivity-restlessness",
      title: "Section 2 of 3: Hyperactivity, Impulsivity and Emotional Regulation",
      description:
        "These questions explore restlessness, impulsive behaviour, and emotional responses.",
      questions: [
        {
          id: "restlessness",
          text: "How often do you feel physically restless, find it hard to sit still, or feel an internal sense of being driven or unable to slow down?",
          type: "radio",
          required: true,
          options: [
            { value: "very-often", label: "Every day or almost every day", score: 4 },
            { value: "often", label: "Most days", score: 3 },
            { value: "sometimes", label: "Some days", score: 2 },
            { value: "rarely", label: "Rarely or not at all", score: 0 },
          ],
        },
        {
          id: "interrupting",
          text: "How often do you interrupt others, blurt out answers, or find it hard to wait your turn in conversations or queues?",
          type: "radio",
          required: true,
          options: [
            { value: "very-often", label: "Every day or almost every day", score: 3 },
            { value: "often", label: "Most days", score: 2 },
            { value: "sometimes", label: "Some days", score: 1 },
            { value: "rarely", label: "Rarely or not at all", score: 0 },
          ],
        },
        {
          id: "impulsive-decisions",
          text: "How often do you make impulsive decisions, acting without fully thinking through the consequences?",
          type: "radio",
          required: true,
          options: [
            { value: "very-often", label: "Every day or almost every day", score: 4 },
            { value: "often", label: "Most days", score: 3 },
            { value: "sometimes", label: "Some days", score: 2 },
            { value: "rarely", label: "Rarely or not at all", score: 0 },
          ],
        },
        {
          id: "emotional-regulation",
          text: "How often do you experience sudden or intense shifts in mood, become easily frustrated, or find your emotions feel disproportionate to the situation?",
          type: "radio",
          required: true,
          options: [
            { value: "very-often", label: "Every day or almost every day", score: 3 },
            { value: "often", label: "Most days", score: 2 },
            { value: "sometimes", label: "Some days", score: 1 },
            { value: "rarely", label: "Rarely or not at all", score: 0 },
          ],
        },
      ],
    },
    {
      id: "impact-and-context",
      title: "Section 3 of 3: Impact and Wellbeing",
      description:
        "These questions help us understand the impact these patterns have on your life and how long they have been present.",
      questions: [
        {
          id: "life-impact",
          text: "How much are these patterns causing problems at work, in your relationships, or in managing your daily life?",
          type: "radio",
          required: true,
          options: [
            { value: "significantly", label: "A lot", score: 4 },
            { value: "moderately", label: "Moderately", score: 3 },
            { value: "mildly", label: "A little", score: 2 },
            { value: "not-much", label: "Not at all", score: 0 },
          ],
        },
        {
          id: "duration",
          text: "Have these patterns been present for most of your life, or are they relatively recent?",
          type: "radio",
          required: true,
          options: [
            { value: "lifelong", label: "For most of my life, since childhood or early adulthood", score: 3 },
            { value: "several-years", label: "For several years", score: 2 },
            { value: "recent", label: "Only in the past year or two", score: 1 },
            { value: "not-sure", label: "I am not sure", score: 1 },
          ],
        },
        {
          id: "mental-health",
          text: "Are you currently experiencing significant low mood, anxiety, or any thoughts of self-harm?",
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

import type { AssessmentConfig } from "@/types/assessment";

export const drugUseAssessment: AssessmentConfig = {
  id: "drug-use",
  title: "Drug Use & Substance Assessment",
  subtitle:
    "This private self-assessment helps you reflect on your relationship with substances and whether further professional guidance may be appropriate. It does not diagnose a substance-use disorder or establish withdrawal safety.",
  estimatedMinutes: 8,
  scoreThresholds: {
    moderateConcern: 8,
    higherConcern: 15,
    possibleDetoxRisk: 100,
  },
  sections: [
    {
      id: "substance-use-patterns",
      title: "Section 1 of 4: Substance Use Patterns",
      description:
        "These questions help us understand the pattern of your substance use. This includes recreational drugs, cannabis, prescription medications used not as prescribed, or any other substances.",
      questions: [
        {
          id: "frequency",
          text: "In the past 12 months, how often have you used substances other than alcohol?",
          subtext:
            "This includes recreational drugs, cannabis, prescription medications not as prescribed, or other substances.",
          type: "radio",
          required: true,
          options: [
            { value: "daily", label: "Daily or almost daily", score: 6 },
            { value: "several-week", label: "Several times per week", score: 4 },
            { value: "weekly", label: "Weekly", score: 2 },
            { value: "monthly", label: "Monthly or less", score: 1 },
            { value: "rarely-never", label: "Rarely or not at all", score: 0 },
          ],
        },
        {
          id: "polysubstance",
          text: "Have you used more than one substance regularly at the same time (including combining substances with alcohol)?",
          type: "radio",
          required: true,
          redFlagKey: "polysubstance-use",
          options: [
            { value: "yes-regularly", label: "Yes, regularly", score: 4, redFlag: true },
            { value: "yes-sometimes", label: "Sometimes", score: 2 },
            { value: "no", label: "No", score: 0 },
          ],
        },
        {
          id: "coping-use",
          text: "Have you used substances to cope with stress, anxiety, emotional pain, or to manage how you feel?",
          type: "radio",
          required: true,
          options: [
            { value: "yes-regularly", label: "Yes, regularly", score: 4 },
            { value: "sometimes", label: "Sometimes", score: 2 },
            { value: "rarely", label: "Rarely", score: 1 },
            { value: "no", label: "No", score: 0 },
          ],
        },
        {
          id: "risky-use",
          text: "Have you ever used substances in ways that felt dangerous, reckless, or out of control?",
          type: "radio",
          required: true,
          options: [
            { value: "yes-regularly", label: "Yes, more than once", score: 4 },
            { value: "yes-once", label: "Yes, on one occasion", score: 2 },
            { value: "no", label: "No", score: 0 },
          ],
        },
      ],
    },
    {
      id: "control-dependence",
      title: "Section 2 of 4: Control and Dependence",
      description:
        "These questions explore how much control you feel you have over your substance use.",
      questions: [
        {
          id: "cut-down",
          text: "Have you tried to stop or reduce your substance use, but found it difficult?",
          type: "radio",
          required: true,
          options: [
            { value: "yes-multiple", label: "Yes, several times", score: 4 },
            { value: "yes-once", label: "Yes, once", score: 2 },
            { value: "not-tried", label: "I haven't tried, but I'd like to", score: 1 },
            { value: "no", label: "No", score: 0 },
          ],
        },
        {
          id: "cravings",
          text: "Do you experience strong urges or cravings to use substances?",
          type: "radio",
          required: true,
          options: [
            { value: "frequently", label: "Yes, frequently", score: 4 },
            { value: "sometimes", label: "Sometimes", score: 2 },
            { value: "rarely", label: "Rarely", score: 1 },
            { value: "never", label: "Never", score: 0 },
          ],
        },
        {
          id: "withdrawal",
          text: "Have you ever experienced physical or psychological withdrawal symptoms when you tried to stop or reduce your use?",
          subtext:
            "This may include anxiety, sweating, shaking, difficulty sleeping, or strong psychological discomfort.",
          type: "radio",
          required: true,
          redFlagKey: "withdrawal-symptoms",
          options: [
            { value: "yes-severe", label: "Yes, severe symptoms", score: 6, redFlag: true },
            { value: "yes-mild", label: "Yes, mild symptoms", score: 3 },
            { value: "not-sure", label: "I am not sure", score: 1 },
            { value: "no", label: "No", score: 0 },
          ],
        },
      ],
    },
    {
      id: "consequences",
      title: "Section 3 of 4: Consequences and Impact",
      description:
        "These questions help us understand how substance use may be affecting your life.",
      questions: [
        {
          id: "life-problems",
          text: "Has substance use caused significant problems in your relationships, work, finances, or legal situation?",
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
          id: "concern-from-others",
          text: "Have close family members, friends, or a professional expressed concern about your substance use?",
          type: "radio",
          required: true,
          options: [
            { value: "yes-multiple", label: "Yes, more than one person", score: 3 },
            { value: "yes-one", label: "Yes, one person", score: 2 },
            { value: "not-that-i-know", label: "Not that I know of", score: 0 },
          ],
        },
        {
          id: "continued-despite-harm",
          text: "Have you continued using substances even when you knew it was causing harm to yourself or others?",
          type: "radio",
          required: true,
          options: [
            { value: "yes-regularly", label: "Yes, regularly", score: 4 },
            { value: "yes-sometimes", label: "Sometimes", score: 2 },
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

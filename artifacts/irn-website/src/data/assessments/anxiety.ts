import type { AssessmentConfig } from "@/types/assessment";

export const anxietyAssessment: AssessmentConfig = {
  id: "anxiety",
  title: "Anxiety Self-Assessment",
  subtitle:
    "This assessment helps you reflect on how anxiety may be affecting your thoughts, feelings, physical wellbeing, and daily life. There are no right or wrong answers.",
  estimatedMinutes: 7,
  scoreThresholds: {
    moderateConcern: 8,
    higherConcern: 15,
    possibleDetoxRisk: 100,
  },
  sections: [
    {
      id: "anxiety-symptoms",
      title: "Section 1 of 3: Anxiety Symptoms",
      description:
        "Over the past two weeks, how often have the following affected you?",
      questions: [
        {
          id: "feeling-anxious",
          text: "Feeling nervous, anxious, or on edge",
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
          id: "uncontrollable-worry",
          text: "Not being able to stop or control worrying",
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
          id: "sense-of-dread",
          text: "Feeling afraid that something awful might happen",
          type: "radio",
          required: true,
          options: [
            { value: "nearly-every-day", label: "Every day or almost every day", score: 4 },
            { value: "more-than-half", label: "Most days", score: 3 },
            { value: "several-days", label: "Some days", score: 2 },
            { value: "not-at-all", label: "Rarely or not at all", score: 0 },
          ],
        },
        {
          id: "racing-thoughts",
          text: "Racing thoughts or difficulty switching off mentally, even when trying to rest",
          type: "radio",
          required: true,
          options: [
            { value: "nearly-every-day", label: "Every day or almost every day", score: 4 },
            { value: "more-than-half", label: "Most days", score: 3 },
            { value: "several-days", label: "Some days", score: 2 },
            { value: "not-at-all", label: "Rarely or not at all", score: 0 },
          ],
        },
      ],
    },
    {
      id: "physical-behavioural",
      title: "Section 2 of 3: Physical and Behavioural Responses",
      description:
        "These questions explore how anxiety affects you physically and what strategies you use to manage it.",
      questions: [
        {
          id: "physical-symptoms",
          text: "How often do you experience physical anxiety symptoms such as a racing heart, shortness of breath, sweating, trembling, or muscle tension?",
          type: "radio",
          required: true,
          options: [
            { value: "nearly-every-day", label: "Every day or almost every day", score: 4 },
            { value: "more-than-half", label: "Most days", score: 3 },
            { value: "several-days", label: "Some days", score: 2 },
            { value: "not-at-all", label: "Rarely or not at all", score: 0 },
          ],
        },
        {
          id: "avoidance",
          text: "Do you avoid certain situations, places, or social interactions because of anxiety?",
          type: "radio",
          required: true,
          options: [
            { value: "yes-significantly", label: "Yes, it significantly limits what I do", score: 4 },
            { value: "yes-sometimes", label: "Yes, sometimes", score: 2 },
            { value: "rarely", label: "Rarely", score: 1 },
            { value: "no", label: "No", score: 0 },
          ],
        },
        {
          id: "substance-coping",
          text: "Do you use alcohol or other substances to manage anxiety or calm down?",
          type: "radio",
          required: true,
          redFlagKey: "substance-anxiety-coping",
          options: [
            { value: "yes-regularly", label: "Yes, regularly", score: 4, redFlag: true },
            { value: "occasionally", label: "Occasionally", score: 2 },
            { value: "no", label: "No", score: 0 },
          ],
        },
      ],
    },
    {
      id: "impact-and-safety",
      title: "Section 3 of 3: Impact and Wellbeing",
      description:
        "These questions help us understand the overall impact of anxiety on your life.",
      questions: [
        {
          id: "work-impact",
          text: "How much has anxiety affected your ability to work, study, or manage everyday tasks?",
          type: "radio",
          required: true,
          options: [
            { value: "significantly", label: "A lot", score: 4 },
            { value: "moderately", label: "Moderately", score: 3 },
            { value: "mildly", label: "A little", score: 2 },
            { value: "not-at-all", label: "Not at all", score: 0 },
          ],
        },
        {
          id: "relationship-impact",
          text: "How much has anxiety affected your relationships or social life?",
          type: "radio",
          required: true,
          options: [
            { value: "significantly", label: "A lot", score: 4 },
            { value: "moderately", label: "Moderately", score: 2 },
            { value: "mildly", label: "A little", score: 1 },
            { value: "not-at-all", label: "Not at all", score: 0 },
          ],
        },
        {
          id: "duration",
          text: "How long have you been experiencing anxiety at this level?",
          type: "radio",
          required: true,
          options: [
            { value: "more-than-year", label: "More than a year", score: 3 },
            { value: "6-12-months", label: "6–12 months", score: 2 },
            { value: "1-6-months", label: "1–6 months", score: 1 },
            { value: "less-than-month", label: "Less than a month", score: 0 },
          ],
        },
        {
          id: "self-harm",
          text: "Are you currently experiencing any thoughts of self-harm or suicide?",
          type: "radio",
          required: true,
          redFlagKey: "mental-health-risk",
          options: [
            {
              value: "yes-significant",
              label: "Yes, these thoughts are significant or recurring",
              score: 12,
              redFlag: true,
            },
            {
              value: "passing-thoughts",
              label: "I have had some passing thoughts",
              score: 4,
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

/*
 * Generated immutable snapshot of the seven production assessment definitions.
 * Source baseline: c774da65c9cc81d983a94d06935e3c55a2c912fa
 * Do not edit this version in place. Create a new definition version instead.
 */

import type { AssessmentKey, AssessmentSection } from "./contracts.ts";

export interface LegacyDefinitionSnapshot {
  id: AssessmentKey;
  title: string;
  subtitle: string;
  estimatedMinutes: number;
  scoreThresholds: {
    moderateConcern: number;
    higherConcern: number;
    possibleDetoxRisk: number;
  };
  sections: AssessmentSection[];
}

export const legacyDefinitionSnapshotV1 = {
  "alcohol-use": {
    "id": "alcohol-use",
    "title": "Alcohol Use Assessment",
    "subtitle": "This assessment helps you reflect on your relationship with alcohol and understand whether it may be affecting your wellbeing, health, or daily life. There are no right or wrong answers.",
    "estimatedMinutes": 8,
    "scoreThresholds": {
      "moderateConcern": 8,
      "higherConcern": 16,
      "possibleDetoxRisk": 100
    },
    "sections": [
      {
        "id": "drinking-pattern",
        "title": "Section 1 of 4: Drinking Pattern",
        "description": "These questions help us understand the current pattern of your drinking.",
        "questions": [
          {
            "id": "frequency",
            "text": "How often do you currently drink alcohol?",
            "type": "radio",
            "required": true,
            "options": [
              {
                "value": "daily",
                "label": "Every day",
                "score": 4
              },
              {
                "value": "4-6-days",
                "label": "4–6 days per week",
                "score": 3
              },
              {
                "value": "2-3-days",
                "label": "2–3 days per week",
                "score": 2
              },
              {
                "value": "weekly-less",
                "label": "Weekly or less",
                "score": 1
              },
              {
                "value": "rarely",
                "label": "Rarely or not at all",
                "score": 0
              }
            ]
          },
          {
            "id": "quantity",
            "text": "On a typical drinking day, roughly how many standard drinks do you have?",
            "subtext": "One standard drink = a small glass of wine, a single measure of spirits, or a half pint of beer.",
            "type": "radio",
            "required": true,
            "options": [
              {
                "value": "1-2",
                "label": "1–2 drinks",
                "score": 0
              },
              {
                "value": "3-4",
                "label": "3–4 drinks",
                "score": 1
              },
              {
                "value": "5-7",
                "label": "5–7 drinks",
                "score": 2
              },
              {
                "value": "8-12",
                "label": "8–12 drinks",
                "score": 4
              },
              {
                "value": "13-plus",
                "label": "13 or more drinks",
                "score": 6
              }
            ]
          },
          {
            "id": "binge",
            "text": "How often do you drink six or more standard drinks on a single occasion?",
            "type": "radio",
            "required": true,
            "options": [
              {
                "value": "daily",
                "label": "Daily or almost daily",
                "score": 4
              },
              {
                "value": "weekly",
                "label": "At least weekly",
                "score": 3
              },
              {
                "value": "monthly",
                "label": "At least monthly",
                "score": 2
              },
              {
                "value": "less-than-monthly",
                "label": "Less than monthly",
                "score": 1
              },
              {
                "value": "never",
                "label": "Never",
                "score": 0
              }
            ]
          },
          {
            "id": "morning-drinking",
            "text": "Do you drink first thing in the morning, or within an hour or two of waking?",
            "type": "radio",
            "required": true,
            "redFlagKey": "morning-drinking",
            "options": [
              {
                "value": "yes",
                "label": "Yes, regularly",
                "score": 4,
                "redFlag": true
              },
              {
                "value": "sometimes",
                "label": "Occasionally",
                "score": 2
              },
              {
                "value": "no",
                "label": "No",
                "score": 0
              }
            ]
          }
        ]
      },
      {
        "id": "control-dependence",
        "title": "Section 2 of 4: Control and Dependence",
        "description": "These questions explore your relationship with alcohol and how much control you feel you have over your drinking.",
        "questions": [
          {
            "id": "unable-to-stop",
            "text": "How often have you found that once you started drinking, you were unable to stop before you intended to?",
            "type": "radio",
            "required": true,
            "options": [
              {
                "value": "often",
                "label": "Often or always",
                "score": 4
              },
              {
                "value": "sometimes",
                "label": "Sometimes",
                "score": 2
              },
              {
                "value": "rarely",
                "label": "Rarely",
                "score": 1
              },
              {
                "value": "never",
                "label": "Never",
                "score": 0
              }
            ]
          },
          {
            "id": "need-to-function",
            "text": "Do you feel that you need alcohol in order to feel normal, function day-to-day, or manage anxiety?",
            "type": "radio",
            "required": true,
            "options": [
              {
                "value": "yes",
                "label": "Yes, regularly",
                "score": 4
              },
              {
                "value": "sometimes",
                "label": "Sometimes",
                "score": 2
              },
              {
                "value": "rarely",
                "label": "Rarely",
                "score": 1
              },
              {
                "value": "no",
                "label": "No",
                "score": 0
              }
            ]
          },
          {
            "id": "tolerance",
            "text": "Have you noticed that you need to drink more than you used to in order to feel the same effect?",
            "type": "radio",
            "required": true,
            "options": [
              {
                "value": "yes",
                "label": "Yes, noticeably",
                "score": 3
              },
              {
                "value": "somewhat",
                "label": "Somewhat",
                "score": 2
              },
              {
                "value": "no",
                "label": "No",
                "score": 0
              }
            ]
          }
        ]
      },
      {
        "id": "consequences",
        "title": "Section 3 of 4: Consequences and Impact",
        "description": "These questions help us understand the impact drinking has had on your life and relationships.",
        "questions": [
          {
            "id": "life-problems",
            "text": "Has your drinking caused significant problems in your relationships, work, finances, or legal situation?",
            "type": "radio",
            "required": true,
            "options": [
              {
                "value": "yes-serious",
                "label": "A lot",
                "score": 4
              },
              {
                "value": "some-extent",
                "label": "Moderately",
                "score": 2
              },
              {
                "value": "minor",
                "label": "A little",
                "score": 1
              },
              {
                "value": "no",
                "label": "Not at all",
                "score": 0
              }
            ]
          },
          {
            "id": "guilt",
            "text": "How often have you felt guilt or shame about your drinking, or regretted something you did while drinking?",
            "type": "radio",
            "required": true,
            "options": [
              {
                "value": "often",
                "label": "Often",
                "score": 3
              },
              {
                "value": "sometimes",
                "label": "Sometimes",
                "score": 2
              },
              {
                "value": "rarely",
                "label": "Rarely",
                "score": 1
              },
              {
                "value": "never",
                "label": "Never",
                "score": 0
              }
            ]
          },
          {
            "id": "cut-down",
            "text": "Have you tried to cut down or stop drinking but found it difficult?",
            "type": "radio",
            "required": true,
            "options": [
              {
                "value": "yes-multiple",
                "label": "Yes, several times",
                "score": 3
              },
              {
                "value": "yes-once",
                "label": "Yes, once",
                "score": 2
              },
              {
                "value": "want-to",
                "label": "I would like to but haven't tried",
                "score": 1
              },
              {
                "value": "no",
                "label": "No",
                "score": 0
              }
            ]
          }
        ]
      },
      {
        "id": "wellbeing-safety",
        "title": "Section 4 of 4: Your Wellbeing",
        "description": "This final section asks about your overall mental and emotional wellbeing.",
        "questions": [
          {
            "id": "mental-health",
            "text": "Are you currently experiencing significant low mood, anxiety, or any thoughts of self-harm or suicide?",
            "type": "radio",
            "required": true,
            "redFlagKey": "mental-health-risk",
            "options": [
              {
                "value": "yes-self-harm",
                "label": "Yes, including thoughts of self-harm or suicide",
                "score": 12,
                "redFlag": true
              },
              {
                "value": "yes-mood",
                "label": "Yes, significant low mood or anxiety",
                "score": 4,
                "advisoryKey": "mental-health-advisory"
              },
              {
                "value": "somewhat",
                "label": "Somewhat",
                "score": 2
              },
              {
                "value": "no",
                "label": "Not particularly",
                "score": 0
              }
            ]
          }
        ]
      },
      {
        "id": "contact-consent",
        "title": "Section 5 of 5: Your Details",
        "description": "Your result will be calculated and saved securely. We will attempt to email a copy, and the useful personalised guidance does not depend on AI.",
        "questions": [
          {
            "id": "name",
            "text": "Your name",
            "type": "text",
            "required": true
          },
          {
            "id": "email",
            "text": "Your email address",
            "subtext": "We will attempt to send a copy of the saved result here.",
            "type": "email",
            "required": true
          },
          {
            "id": "phone",
            "text": "Your phone or WhatsApp number (optional)",
            "subtext": "If you would prefer us to call or message you, include your number here.",
            "type": "tel",
            "required": false
          }
        ]
      }
    ]
  },
  "alcohol-detox": {
    "id": "alcohol-detox",
    "title": "Alcohol & Detox Suitability Assessment",
    "subtitle": "This private self-assessment explores your current relationship with alcohol and highlights when professional advice may be appropriate. It cannot determine whether detox is medically safe.",
    "estimatedMinutes": 8,
    "scoreThresholds": {
      "moderateConcern": 11,
      "higherConcern": 22,
      "possibleDetoxRisk": 33
    },
    "sections": [
      {
        "id": "current-use",
        "title": "Section 1 of 5: Current Alcohol Use",
        "description": "The following questions help us understand the current pattern of your drinking.",
        "questions": [
          {
            "id": "frequency",
            "text": "How often do you currently drink alcohol?",
            "type": "radio",
            "required": true,
            "options": [
              {
                "value": "daily",
                "label": "Every day",
                "score": 6
              },
              {
                "value": "4-6-days",
                "label": "4–6 days per week",
                "score": 4
              },
              {
                "value": "2-3-days",
                "label": "2–3 days per week",
                "score": 2
              },
              {
                "value": "weekly-less",
                "label": "Weekly or less",
                "score": 1
              },
              {
                "value": "rarely",
                "label": "Rarely or not at all",
                "score": 0
              }
            ]
          },
          {
            "id": "quantity",
            "text": "On a typical drinking day, roughly how many standard drinks do you have?",
            "subtext": "One standard drink = a small glass of wine, a single measure of spirits, or a half pint of beer.",
            "type": "radio",
            "required": true,
            "options": [
              {
                "value": "1-2",
                "label": "1–2 drinks",
                "score": 0
              },
              {
                "value": "3-4",
                "label": "3–4 drinks",
                "score": 2
              },
              {
                "value": "5-7",
                "label": "5–7 drinks",
                "score": 4
              },
              {
                "value": "8-12",
                "label": "8–12 drinks",
                "score": 6
              },
              {
                "value": "13-plus",
                "label": "13 or more drinks",
                "score": 8
              }
            ]
          },
          {
            "id": "morning-drinking",
            "text": "Do you drink first thing in the morning, or within an hour or two of waking?",
            "type": "radio",
            "required": true,
            "redFlagKey": "morning-drinking",
            "options": [
              {
                "value": "yes",
                "label": "Yes, regularly",
                "score": 8,
                "redFlag": true
              },
              {
                "value": "sometimes",
                "label": "Occasionally",
                "score": 4
              },
              {
                "value": "no",
                "label": "No",
                "score": 0
              }
            ]
          },
          {
            "id": "sustained-heavy-use",
            "text": "Have you been drinking heavily on most days for two weeks or longer without a significant break?",
            "type": "radio",
            "required": true,
            "options": [
              {
                "value": "yes",
                "label": "Yes",
                "score": 4
              },
              {
                "value": "no",
                "label": "No",
                "score": 0
              }
            ]
          },
          {
            "id": "polysubstance",
            "text": "Do you use alcohol alongside other substances, such as recreational drugs, prescription medications, or sleep aids?",
            "type": "radio",
            "required": true,
            "redFlagKey": "polysubstance-use",
            "options": [
              {
                "value": "yes-regularly",
                "label": "Yes, regularly",
                "score": 8,
                "redFlag": true
              },
              {
                "value": "yes-sometimes",
                "label": "Sometimes",
                "score": 4
              },
              {
                "value": "no",
                "label": "No",
                "score": 0
              }
            ]
          }
        ]
      },
      {
        "id": "control-consequences",
        "title": "Section 2 of 5: Control and Consequences",
        "description": "These questions explore the impact your drinking has had on your daily life and your relationship with alcohol.",
        "questions": [
          {
            "id": "cut-down-attempts",
            "text": "Have you tried to cut down or stop drinking in the past year?",
            "type": "radio",
            "required": true,
            "options": [
              {
                "value": "yes-multiple",
                "label": "Yes, several times",
                "score": 3
              },
              {
                "value": "yes-once",
                "label": "Yes, once",
                "score": 2
              },
              {
                "value": "no-tried",
                "label": "No, but I would like to",
                "score": 1
              },
              {
                "value": "no-not-wanted",
                "label": "No, I have not tried",
                "score": 0
              }
            ]
          },
          {
            "id": "consequences",
            "text": "Has your drinking caused significant problems in your relationships, work, finances, or legally?",
            "type": "radio",
            "required": true,
            "options": [
              {
                "value": "yes-serious",
                "label": "A lot",
                "score": 4
              },
              {
                "value": "yes-some",
                "label": "Moderately",
                "score": 2
              },
              {
                "value": "minor",
                "label": "A little",
                "score": 1
              },
              {
                "value": "no",
                "label": "Not at all",
                "score": 0
              }
            ]
          },
          {
            "id": "dependence-feeling",
            "text": "Do you feel that you need to drink in order to feel normal, function day-to-day, or manage anxiety?",
            "type": "radio",
            "required": true,
            "options": [
              {
                "value": "yes",
                "label": "Yes, regularly",
                "score": 6
              },
              {
                "value": "sometimes",
                "label": "Sometimes",
                "score": 3
              },
              {
                "value": "no",
                "label": "No",
                "score": 0
              }
            ]
          },
          {
            "id": "tolerance",
            "text": "Have you noticed that you need to drink more than you used to in order to feel the same effect?",
            "type": "radio",
            "required": true,
            "options": [
              {
                "value": "yes",
                "label": "Yes, noticeably",
                "score": 4
              },
              {
                "value": "somewhat",
                "label": "Somewhat",
                "score": 2
              },
              {
                "value": "no",
                "label": "No",
                "score": 0
              }
            ]
          },
          {
            "id": "cravings",
            "text": "Do you experience strong urges or cravings for alcohol, particularly when you haven't had a drink for a while?",
            "type": "radio",
            "required": true,
            "options": [
              {
                "value": "frequently",
                "label": "Yes, frequently",
                "score": 4
              },
              {
                "value": "sometimes",
                "label": "Sometimes",
                "score": 2
              },
              {
                "value": "rarely",
                "label": "Rarely",
                "score": 1
              },
              {
                "value": "never",
                "label": "Never",
                "score": 0
              }
            ]
          }
        ]
      },
      {
        "id": "detox-safety",
        "title": "Section 3 of 5: Detox and Safety",
        "description": "This section asks about physical symptoms and previous experiences. This information is essential for assessing the safest way to reduce or stop drinking.",
        "questions": [
          {
            "id": "withdrawal-symptoms",
            "text": "Have you ever experienced withdrawal symptoms when you have stopped or significantly reduced your drinking?",
            "subtext": "Withdrawal symptoms can include: sweating, shaking or tremors, rapid heartbeat, nausea, anxiety, and difficulty sleeping.",
            "type": "radio",
            "required": true,
            "redFlagKey": "withdrawal-symptoms",
            "options": [
              {
                "value": "yes-severe",
                "label": "Yes, severe symptoms",
                "score": 10,
                "redFlag": true
              },
              {
                "value": "yes-mild",
                "label": "Yes, mild symptoms",
                "score": 5
              },
              {
                "value": "not-sure",
                "label": "I am not sure",
                "score": 2
              },
              {
                "value": "no",
                "label": "No",
                "score": 0
              }
            ]
          },
          {
            "id": "seizure-history",
            "text": "Have you ever had a seizure (fit) when stopping or reducing alcohol, or been told by a doctor that you are at risk of this?",
            "type": "radio",
            "required": true,
            "redFlagKey": "seizure-history",
            "options": [
              {
                "value": "yes",
                "label": "Yes",
                "score": 15,
                "redFlag": true
              },
              {
                "value": "not-sure",
                "label": "I am not sure",
                "score": 3
              },
              {
                "value": "no",
                "label": "No",
                "score": 0
              }
            ]
          },
          {
            "id": "hallucinations",
            "text": "Have you ever experienced hallucinations, seeing, hearing, or feeling things that were not there, when stopping or reducing alcohol?",
            "type": "radio",
            "required": true,
            "redFlagKey": "hallucinations",
            "options": [
              {
                "value": "yes",
                "label": "Yes",
                "score": 12,
                "redFlag": true
              },
              {
                "value": "not-sure",
                "label": "I am not sure",
                "score": 2
              },
              {
                "value": "no",
                "label": "No",
                "score": 0
              }
            ]
          },
          {
            "id": "benzodiazepines",
            "text": "Do you regularly use benzodiazepines such as diazepam (Valium), lorazepam, or alprazolam (Xanax)?",
            "subtext": "This includes prescribed or non-prescribed use. Combining benzodiazepines with alcohol significantly increases risk during withdrawal.",
            "type": "radio",
            "required": true,
            "redFlagKey": "benzodiazepine-use",
            "options": [
              {
                "value": "yes",
                "label": "Yes, regularly",
                "score": 8,
                "redFlag": true
              },
              {
                "value": "occasionally",
                "label": "Occasionally",
                "score": 4
              },
              {
                "value": "no",
                "label": "No",
                "score": 0
              }
            ]
          },
          {
            "id": "ghb-use",
            "text": "Do you use GHB, GBL, or ketamine, with or without alcohol?",
            "subtext": "These substances carry significant additional risks during alcohol withdrawal and require specialist assessment.",
            "type": "radio",
            "required": true,
            "redFlagKey": "ghb-gbl-use",
            "options": [
              {
                "value": "yes",
                "label": "Yes",
                "score": 10,
                "redFlag": true
              },
              {
                "value": "occasionally",
                "label": "Occasionally",
                "score": 5
              },
              {
                "value": "no",
                "label": "No",
                "score": 0
              }
            ]
          }
        ]
      },
      {
        "id": "mental-health-readiness",
        "title": "Section 4 of 5: Health and Recovery Readiness",
        "description": "This section helps us understand your overall health context and how ready you feel to make a change.",
        "questions": [
          {
            "id": "medical-conditions",
            "text": "Do you have any serious physical health conditions that a doctor is aware of?",
            "subtext": "For example: heart or liver disease, diabetes, epilepsy, high blood pressure, or recent serious illness.",
            "type": "radio",
            "required": true,
            "redFlagKey": "serious-medical-conditions",
            "options": [
              {
                "value": "yes",
                "label": "Yes",
                "score": 6,
                "redFlag": true
              },
              {
                "value": "unsure",
                "label": "I am not sure",
                "score": 2
              },
              {
                "value": "no",
                "label": "No",
                "score": 0
              }
            ]
          },
          {
            "id": "previous-detox",
            "text": "Have you previously been through a medicated alcohol detox or residential rehabilitation programme?",
            "type": "radio",
            "required": true,
            "redFlagKey": "previous-detox-complications",
            "options": [
              {
                "value": "yes-complications",
                "label": "Yes, and I had complications",
                "score": 8,
                "redFlag": true
              },
              {
                "value": "yes-no-complications",
                "label": "Yes, without significant complications",
                "score": 2
              },
              {
                "value": "tried-alone",
                "label": "I have tried to stop alone, without medical support",
                "score": 3
              },
              {
                "value": "no",
                "label": "No",
                "score": 0
              }
            ]
          },
          {
            "id": "mental-health",
            "text": "Are you currently experiencing significant low mood, anxiety, or any thoughts of harming yourself?",
            "type": "radio",
            "required": true,
            "redFlagKey": "mental-health-risk",
            "options": [
              {
                "value": "yes-self-harm",
                "label": "Yes, including thoughts of self-harm or suicide",
                "score": 12,
                "redFlag": true
              },
              {
                "value": "yes-mood",
                "label": "Yes, significant low mood or anxiety",
                "score": 4,
                "advisoryKey": "mental-health-advisory"
              },
              {
                "value": "somewhat",
                "label": "Somewhat",
                "score": 2
              },
              {
                "value": "no",
                "label": "Not particularly",
                "score": 0
              }
            ]
          },
          {
            "id": "motivation",
            "text": "How would you describe your motivation to make a change with your drinking?",
            "type": "radio",
            "required": true,
            "options": [
              {
                "value": "ready",
                "label": "I am ready, I want to do whatever it takes",
                "score": 0
              },
              {
                "value": "considering",
                "label": "I am seriously considering making changes",
                "score": 1
              },
              {
                "value": "unsure",
                "label": "I am not sure if I want to change",
                "score": 2
              },
              {
                "value": "not-ready",
                "label": "I am not yet ready to make changes",
                "score": 3
              }
            ]
          }
        ]
      },
      {
        "id": "contact-consent",
        "title": "Section 5 of 5: Your Details",
        "description": "Your result will be calculated and saved securely. We will attempt to email a copy, and the useful personalised guidance does not depend on AI.",
        "questions": [
          {
            "id": "name",
            "text": "Your name",
            "type": "text",
            "required": true
          },
          {
            "id": "email",
            "text": "Your email address",
            "subtext": "We will attempt to send a copy of the saved result here.",
            "type": "email",
            "required": true
          },
          {
            "id": "phone",
            "text": "Your phone or WhatsApp number (optional)",
            "subtext": "If you would prefer us to call or message you, include your number here.",
            "type": "tel",
            "required": false
          }
        ]
      }
    ]
  },
  "drug-use": {
    "id": "drug-use",
    "title": "Drug Use & Substance Assessment",
    "subtitle": "This private self-assessment helps you reflect on your relationship with substances and whether further professional guidance may be appropriate. It does not diagnose a substance-use disorder or establish withdrawal safety.",
    "estimatedMinutes": 8,
    "scoreThresholds": {
      "moderateConcern": 8,
      "higherConcern": 15,
      "possibleDetoxRisk": 100
    },
    "sections": [
      {
        "id": "substance-use-patterns",
        "title": "Section 1 of 4: Substance Use Patterns",
        "description": "These questions help us understand the pattern of your substance use. This includes recreational drugs, cannabis, prescription medications used not as prescribed, or any other substances.",
        "questions": [
          {
            "id": "frequency",
            "text": "In the past 12 months, how often have you used substances other than alcohol?",
            "subtext": "This includes recreational drugs, cannabis, prescription medications not as prescribed, or other substances.",
            "type": "radio",
            "required": true,
            "options": [
              {
                "value": "daily",
                "label": "Daily or almost daily",
                "score": 6
              },
              {
                "value": "several-week",
                "label": "Several times per week",
                "score": 4
              },
              {
                "value": "weekly",
                "label": "Weekly",
                "score": 2
              },
              {
                "value": "monthly",
                "label": "Monthly or less",
                "score": 1
              },
              {
                "value": "rarely-never",
                "label": "Rarely or not at all",
                "score": 0
              }
            ]
          },
          {
            "id": "polysubstance",
            "text": "Have you used more than one substance regularly at the same time (including combining substances with alcohol)?",
            "type": "radio",
            "required": true,
            "redFlagKey": "polysubstance-use",
            "options": [
              {
                "value": "yes-regularly",
                "label": "Yes, regularly",
                "score": 4,
                "redFlag": true
              },
              {
                "value": "yes-sometimes",
                "label": "Sometimes",
                "score": 2
              },
              {
                "value": "no",
                "label": "No",
                "score": 0
              }
            ]
          },
          {
            "id": "coping-use",
            "text": "Have you used substances to cope with stress, anxiety, emotional pain, or to manage how you feel?",
            "type": "radio",
            "required": true,
            "options": [
              {
                "value": "yes-regularly",
                "label": "Yes, regularly",
                "score": 4
              },
              {
                "value": "sometimes",
                "label": "Sometimes",
                "score": 2
              },
              {
                "value": "rarely",
                "label": "Rarely",
                "score": 1
              },
              {
                "value": "no",
                "label": "No",
                "score": 0
              }
            ]
          },
          {
            "id": "risky-use",
            "text": "Have you ever used substances in ways that felt dangerous, reckless, or out of control?",
            "type": "radio",
            "required": true,
            "options": [
              {
                "value": "yes-regularly",
                "label": "Yes, more than once",
                "score": 4
              },
              {
                "value": "yes-once",
                "label": "Yes, on one occasion",
                "score": 2
              },
              {
                "value": "no",
                "label": "No",
                "score": 0
              }
            ]
          }
        ]
      },
      {
        "id": "control-dependence",
        "title": "Section 2 of 4: Control and Dependence",
        "description": "These questions explore how much control you feel you have over your substance use.",
        "questions": [
          {
            "id": "cut-down",
            "text": "Have you tried to stop or reduce your substance use, but found it difficult?",
            "type": "radio",
            "required": true,
            "options": [
              {
                "value": "yes-multiple",
                "label": "Yes, several times",
                "score": 4
              },
              {
                "value": "yes-once",
                "label": "Yes, once",
                "score": 2
              },
              {
                "value": "not-tried",
                "label": "I haven't tried, but I'd like to",
                "score": 1
              },
              {
                "value": "no",
                "label": "No",
                "score": 0
              }
            ]
          },
          {
            "id": "cravings",
            "text": "Do you experience strong urges or cravings to use substances?",
            "type": "radio",
            "required": true,
            "options": [
              {
                "value": "frequently",
                "label": "Yes, frequently",
                "score": 4
              },
              {
                "value": "sometimes",
                "label": "Sometimes",
                "score": 2
              },
              {
                "value": "rarely",
                "label": "Rarely",
                "score": 1
              },
              {
                "value": "never",
                "label": "Never",
                "score": 0
              }
            ]
          },
          {
            "id": "withdrawal",
            "text": "Have you ever experienced physical or psychological withdrawal symptoms when you tried to stop or reduce your use?",
            "subtext": "This may include anxiety, sweating, shaking, difficulty sleeping, or strong psychological discomfort.",
            "type": "radio",
            "required": true,
            "redFlagKey": "withdrawal-symptoms",
            "options": [
              {
                "value": "yes-severe",
                "label": "Yes, severe symptoms",
                "score": 6,
                "redFlag": true
              },
              {
                "value": "yes-mild",
                "label": "Yes, mild symptoms",
                "score": 3
              },
              {
                "value": "not-sure",
                "label": "I am not sure",
                "score": 1
              },
              {
                "value": "no",
                "label": "No",
                "score": 0
              }
            ]
          }
        ]
      },
      {
        "id": "consequences",
        "title": "Section 3 of 4: Consequences and Impact",
        "description": "These questions help us understand how substance use may be affecting your life.",
        "questions": [
          {
            "id": "life-problems",
            "text": "Has substance use caused significant problems in your relationships, work, finances, or legal situation?",
            "type": "radio",
            "required": true,
            "options": [
              {
                "value": "yes-serious",
                "label": "A lot",
                "score": 4
              },
              {
                "value": "some-extent",
                "label": "Moderately",
                "score": 2
              },
              {
                "value": "minor",
                "label": "A little",
                "score": 1
              },
              {
                "value": "no",
                "label": "Not at all",
                "score": 0
              }
            ]
          },
          {
            "id": "concern-from-others",
            "text": "Have close family members, friends, or a professional expressed concern about your substance use?",
            "type": "radio",
            "required": true,
            "options": [
              {
                "value": "yes-multiple",
                "label": "Yes, more than one person",
                "score": 3
              },
              {
                "value": "yes-one",
                "label": "Yes, one person",
                "score": 2
              },
              {
                "value": "not-that-i-know",
                "label": "Not that I know of",
                "score": 0
              }
            ]
          },
          {
            "id": "continued-despite-harm",
            "text": "Have you continued using substances even when you knew it was causing harm to yourself or others?",
            "type": "radio",
            "required": true,
            "options": [
              {
                "value": "yes-regularly",
                "label": "Yes, regularly",
                "score": 4
              },
              {
                "value": "yes-sometimes",
                "label": "Sometimes",
                "score": 2
              },
              {
                "value": "no",
                "label": "No",
                "score": 0
              }
            ]
          }
        ]
      },
      {
        "id": "wellbeing-safety",
        "title": "Section 4 of 4: Your Wellbeing",
        "description": "This final section asks about your overall mental and emotional wellbeing.",
        "questions": [
          {
            "id": "mental-health",
            "text": "Are you currently experiencing significant low mood, anxiety, or any thoughts of self-harm or suicide?",
            "type": "radio",
            "required": true,
            "redFlagKey": "mental-health-risk",
            "options": [
              {
                "value": "yes-self-harm",
                "label": "Yes, including thoughts of self-harm or suicide",
                "score": 12,
                "redFlag": true
              },
              {
                "value": "yes-mood",
                "label": "Yes, significant low mood or anxiety",
                "score": 4,
                "advisoryKey": "mental-health-advisory"
              },
              {
                "value": "somewhat",
                "label": "Somewhat",
                "score": 2
              },
              {
                "value": "no",
                "label": "Not particularly",
                "score": 0
              }
            ]
          }
        ]
      },
      {
        "id": "contact-consent",
        "title": "Section 5 of 5: Your Details",
        "description": "Your result will be calculated and saved securely. We will attempt to email a copy, and the useful personalised guidance does not depend on AI.",
        "questions": [
          {
            "id": "name",
            "text": "Your name",
            "type": "text",
            "required": true
          },
          {
            "id": "email",
            "text": "Your email address",
            "subtext": "We will attempt to send a copy of the saved result here.",
            "type": "email",
            "required": true
          },
          {
            "id": "phone",
            "text": "Your phone or WhatsApp number (optional)",
            "subtext": "If you would prefer us to call or message you, include your number here.",
            "type": "tel",
            "required": false
          }
        ]
      }
    ]
  },
  "detox-suitability": {
    "id": "detox-suitability",
    "title": "Detox Suitability Assessment",
    "subtitle": "If you are considering stopping or significantly reducing alcohol or other substances, this self-assessment highlights factors that may require professional or medical review. It cannot determine whether detox is medically safe.",
    "estimatedMinutes": 10,
    "scoreThresholds": {
      "moderateConcern": 10,
      "higherConcern": 20,
      "possibleDetoxRisk": 30
    },
    "sections": [
      {
        "id": "current-use",
        "title": "Section 1 of 4: Current Use",
        "description": "These questions help us understand your current level of alcohol or substance use.",
        "questions": [
          {
            "id": "substance-type",
            "text": "Which substance are you primarily looking to stop or reduce?",
            "type": "radio",
            "required": true,
            "options": [
              {
                "value": "alcohol",
                "label": "Alcohol",
                "score": 0
              },
              {
                "value": "opiates",
                "label": "Opiates (heroin, prescription opioids)",
                "score": 2
              },
              {
                "value": "benzos",
                "label": "Benzodiazepines (Valium, Xanax, Klonopin)",
                "score": 3
              },
              {
                "value": "stimulants",
                "label": "Stimulants (cocaine, amphetamines)",
                "score": 1
              },
              {
                "value": "multiple",
                "label": "Multiple substances",
                "score": 4
              },
              {
                "value": "other",
                "label": "Other",
                "score": 1
              }
            ]
          },
          {
            "id": "frequency",
            "text": "How often are you currently using?",
            "type": "radio",
            "required": true,
            "options": [
              {
                "value": "daily-heavy",
                "label": "Every day, heavily",
                "score": 6
              },
              {
                "value": "daily-moderate",
                "label": "Every day, moderate amounts",
                "score": 4
              },
              {
                "value": "most-days",
                "label": "Most days",
                "score": 2
              },
              {
                "value": "several-week",
                "label": "Several times per week",
                "score": 1
              },
              {
                "value": "less",
                "label": "Weekly or less",
                "score": 0
              }
            ]
          },
          {
            "id": "duration",
            "text": "How long have you been using at your current level without a significant break?",
            "type": "radio",
            "required": true,
            "options": [
              {
                "value": "more-than-year",
                "label": "More than a year",
                "score": 4
              },
              {
                "value": "6-12-months",
                "label": "6–12 months",
                "score": 3
              },
              {
                "value": "1-6-months",
                "label": "1–6 months",
                "score": 2
              },
              {
                "value": "less-than-month",
                "label": "Less than a month",
                "score": 0
              }
            ]
          }
        ]
      },
      {
        "id": "withdrawal-history",
        "title": "Section 2 of 4: Withdrawal and Safety History",
        "description": "This section asks about previous withdrawal experiences. This is the most clinically important part of the assessment.",
        "questions": [
          {
            "id": "withdrawal-symptoms",
            "text": "Have you ever experienced withdrawal symptoms when you stopped or significantly reduced your use?",
            "subtext": "Symptoms can include sweating, shaking, rapid heartbeat, nausea, anxiety, severe insomnia, or agitation.",
            "type": "radio",
            "required": true,
            "redFlagKey": "withdrawal-symptoms",
            "options": [
              {
                "value": "yes-severe",
                "label": "Yes, severe symptoms",
                "score": 10,
                "redFlag": true
              },
              {
                "value": "yes-mild",
                "label": "Yes, mild to moderate symptoms",
                "score": 5
              },
              {
                "value": "not-sure",
                "label": "I am not sure",
                "score": 2
              },
              {
                "value": "no",
                "label": "No",
                "score": 0
              }
            ]
          },
          {
            "id": "seizure-history",
            "text": "Have you ever had a seizure (fit) when stopping or reducing use, or been told by a doctor that you are at risk of this?",
            "type": "radio",
            "required": true,
            "redFlagKey": "seizure-history",
            "options": [
              {
                "value": "yes",
                "label": "Yes",
                "score": 15,
                "redFlag": true
              },
              {
                "value": "not-sure",
                "label": "I am not sure",
                "score": 3
              },
              {
                "value": "no",
                "label": "No",
                "score": 0
              }
            ]
          },
          {
            "id": "hallucinations",
            "text": "Have you ever experienced hallucinations, seeing, hearing, or feeling things that were not there, during or after stopping use?",
            "type": "radio",
            "required": true,
            "redFlagKey": "hallucinations",
            "options": [
              {
                "value": "yes",
                "label": "Yes",
                "score": 12,
                "redFlag": true
              },
              {
                "value": "not-sure",
                "label": "I am not sure",
                "score": 2
              },
              {
                "value": "no",
                "label": "No",
                "score": 0
              }
            ]
          },
          {
            "id": "previous-detox",
            "text": "Have you previously been through a medicated or residential detox programme?",
            "type": "radio",
            "required": true,
            "redFlagKey": "previous-detox-complications",
            "options": [
              {
                "value": "yes-complications",
                "label": "Yes, and I experienced complications",
                "score": 8,
                "redFlag": true
              },
              {
                "value": "yes-no-complications",
                "label": "Yes, without significant complications",
                "score": 2
              },
              {
                "value": "tried-alone",
                "label": "I have tried to stop alone, without medical support",
                "score": 3
              },
              {
                "value": "no",
                "label": "No",
                "score": 0
              }
            ]
          }
        ]
      },
      {
        "id": "medical-context",
        "title": "Section 3 of 4: Medical and Substance Context",
        "description": "These questions help us understand any additional medical factors relevant to safe withdrawal.",
        "questions": [
          {
            "id": "medical-conditions",
            "text": "Do you have any serious physical health conditions that a doctor is aware of?",
            "subtext": "For example: heart or liver disease, diabetes, epilepsy, high blood pressure, or a recent serious illness.",
            "type": "radio",
            "required": true,
            "redFlagKey": "serious-medical-conditions",
            "options": [
              {
                "value": "yes",
                "label": "Yes",
                "score": 6,
                "redFlag": true
              },
              {
                "value": "unsure",
                "label": "I am not sure",
                "score": 2
              },
              {
                "value": "no",
                "label": "No",
                "score": 0
              }
            ]
          },
          {
            "id": "benzodiazepines",
            "text": "Do you regularly use benzodiazepines such as diazepam (Valium), lorazepam, or alprazolam (Xanax)?",
            "subtext": "This includes prescribed or non-prescribed use. Combining benzodiazepines with alcohol significantly increases withdrawal risk.",
            "type": "radio",
            "required": true,
            "redFlagKey": "benzodiazepine-use",
            "options": [
              {
                "value": "yes",
                "label": "Yes, regularly",
                "score": 8,
                "redFlag": true
              },
              {
                "value": "occasionally",
                "label": "Occasionally",
                "score": 4
              },
              {
                "value": "no",
                "label": "No",
                "score": 0
              }
            ]
          },
          {
            "id": "mental-health",
            "text": "Are you currently experiencing significant low mood, anxiety, or any thoughts of self-harm or suicide?",
            "type": "radio",
            "required": true,
            "redFlagKey": "mental-health-risk",
            "options": [
              {
                "value": "yes-self-harm",
                "label": "Yes, including thoughts of self-harm or suicide",
                "score": 12,
                "redFlag": true
              },
              {
                "value": "yes-mood",
                "label": "Yes, significant low mood or anxiety",
                "score": 4,
                "advisoryKey": "mental-health-advisory"
              },
              {
                "value": "somewhat",
                "label": "Somewhat",
                "score": 2
              },
              {
                "value": "no",
                "label": "Not particularly",
                "score": 0
              }
            ]
          }
        ]
      },
      {
        "id": "readiness",
        "title": "Section 4 of 4: Readiness",
        "description": "This section helps us understand your current circumstances and motivation.",
        "questions": [
          {
            "id": "support",
            "text": "Do you have a trusted person at home who could support you during a detox period if needed?",
            "type": "radio",
            "required": true,
            "options": [
              {
                "value": "yes",
                "label": "Yes, reliably",
                "score": 0
              },
              {
                "value": "possibly",
                "label": "Possibly, but not reliably",
                "score": 2
              },
              {
                "value": "no",
                "label": "No, I would be alone",
                "score": 3
              }
            ]
          },
          {
            "id": "motivation",
            "text": "How would you describe your motivation to stop or significantly reduce your use?",
            "type": "radio",
            "required": true,
            "options": [
              {
                "value": "ready",
                "label": "I am ready, I want to do whatever it takes",
                "score": 0
              },
              {
                "value": "considering",
                "label": "I am seriously considering making a change",
                "score": 1
              },
              {
                "value": "unsure",
                "label": "I am not sure if I want to stop",
                "score": 2
              }
            ]
          }
        ]
      },
      {
        "id": "contact-consent",
        "title": "Section 5 of 5: Your Details",
        "description": "Your result will be calculated and saved securely. We will attempt to email a copy, and the useful personalised guidance does not depend on AI.",
        "questions": [
          {
            "id": "name",
            "text": "Your name",
            "type": "text",
            "required": true
          },
          {
            "id": "email",
            "text": "Your email address",
            "subtext": "We will attempt to send a copy of the saved result here.",
            "type": "email",
            "required": true
          },
          {
            "id": "phone",
            "text": "Your phone or WhatsApp number (optional)",
            "subtext": "If you would prefer us to call or message you, include your number here.",
            "type": "tel",
            "required": false
          }
        ]
      }
    ]
  },
  "anxiety": {
    "id": "anxiety",
    "title": "Anxiety Self-Assessment",
    "subtitle": "This assessment helps you reflect on how anxiety may be affecting your thoughts, feelings, physical wellbeing, and daily life. There are no right or wrong answers.",
    "estimatedMinutes": 7,
    "scoreThresholds": {
      "moderateConcern": 8,
      "higherConcern": 15,
      "possibleDetoxRisk": 100
    },
    "sections": [
      {
        "id": "anxiety-symptoms",
        "title": "Section 1 of 3: Anxiety Symptoms",
        "description": "Over the past two weeks, how often have the following affected you?",
        "questions": [
          {
            "id": "feeling-anxious",
            "text": "Feeling nervous, anxious, or on edge",
            "type": "radio",
            "required": true,
            "options": [
              {
                "value": "nearly-every-day",
                "label": "Every day or almost every day",
                "score": 6
              },
              {
                "value": "more-than-half",
                "label": "Most days",
                "score": 4
              },
              {
                "value": "several-days",
                "label": "Some days",
                "score": 2
              },
              {
                "value": "not-at-all",
                "label": "Rarely or not at all",
                "score": 0
              }
            ]
          },
          {
            "id": "uncontrollable-worry",
            "text": "Not being able to stop or control worrying",
            "type": "radio",
            "required": true,
            "options": [
              {
                "value": "nearly-every-day",
                "label": "Every day or almost every day",
                "score": 6
              },
              {
                "value": "more-than-half",
                "label": "Most days",
                "score": 4
              },
              {
                "value": "several-days",
                "label": "Some days",
                "score": 2
              },
              {
                "value": "not-at-all",
                "label": "Rarely or not at all",
                "score": 0
              }
            ]
          },
          {
            "id": "sense-of-dread",
            "text": "Feeling afraid that something awful might happen",
            "type": "radio",
            "required": true,
            "options": [
              {
                "value": "nearly-every-day",
                "label": "Every day or almost every day",
                "score": 4
              },
              {
                "value": "more-than-half",
                "label": "Most days",
                "score": 3
              },
              {
                "value": "several-days",
                "label": "Some days",
                "score": 2
              },
              {
                "value": "not-at-all",
                "label": "Rarely or not at all",
                "score": 0
              }
            ]
          },
          {
            "id": "racing-thoughts",
            "text": "Racing thoughts or difficulty switching off mentally, even when trying to rest",
            "type": "radio",
            "required": true,
            "options": [
              {
                "value": "nearly-every-day",
                "label": "Every day or almost every day",
                "score": 4
              },
              {
                "value": "more-than-half",
                "label": "Most days",
                "score": 3
              },
              {
                "value": "several-days",
                "label": "Some days",
                "score": 2
              },
              {
                "value": "not-at-all",
                "label": "Rarely or not at all",
                "score": 0
              }
            ]
          }
        ]
      },
      {
        "id": "physical-behavioural",
        "title": "Section 2 of 3: Physical and Behavioural Responses",
        "description": "These questions explore how anxiety affects you physically and what strategies you use to manage it.",
        "questions": [
          {
            "id": "physical-symptoms",
            "text": "How often do you experience physical anxiety symptoms such as a racing heart, shortness of breath, sweating, trembling, or muscle tension?",
            "type": "radio",
            "required": true,
            "options": [
              {
                "value": "nearly-every-day",
                "label": "Every day or almost every day",
                "score": 4
              },
              {
                "value": "more-than-half",
                "label": "Most days",
                "score": 3
              },
              {
                "value": "several-days",
                "label": "Some days",
                "score": 2
              },
              {
                "value": "not-at-all",
                "label": "Rarely or not at all",
                "score": 0
              }
            ]
          },
          {
            "id": "avoidance",
            "text": "Do you avoid certain situations, places, or social interactions because of anxiety?",
            "type": "radio",
            "required": true,
            "options": [
              {
                "value": "yes-significantly",
                "label": "Yes, it significantly limits what I do",
                "score": 4
              },
              {
                "value": "yes-sometimes",
                "label": "Yes, sometimes",
                "score": 2
              },
              {
                "value": "rarely",
                "label": "Rarely",
                "score": 1
              },
              {
                "value": "no",
                "label": "No",
                "score": 0
              }
            ]
          },
          {
            "id": "substance-coping",
            "text": "Do you use alcohol or other substances to manage anxiety or calm down?",
            "type": "radio",
            "required": true,
            "redFlagKey": "substance-anxiety-coping",
            "options": [
              {
                "value": "yes-regularly",
                "label": "Yes, regularly",
                "score": 4,
                "redFlag": true
              },
              {
                "value": "occasionally",
                "label": "Occasionally",
                "score": 2
              },
              {
                "value": "no",
                "label": "No",
                "score": 0
              }
            ]
          }
        ]
      },
      {
        "id": "impact-and-safety",
        "title": "Section 3 of 3: Impact and Wellbeing",
        "description": "These questions help us understand the overall impact of anxiety on your life.",
        "questions": [
          {
            "id": "work-impact",
            "text": "How much has anxiety affected your ability to work, study, or manage everyday tasks?",
            "type": "radio",
            "required": true,
            "options": [
              {
                "value": "significantly",
                "label": "A lot",
                "score": 4
              },
              {
                "value": "moderately",
                "label": "Moderately",
                "score": 3
              },
              {
                "value": "mildly",
                "label": "A little",
                "score": 2
              },
              {
                "value": "not-at-all",
                "label": "Not at all",
                "score": 0
              }
            ]
          },
          {
            "id": "relationship-impact",
            "text": "How much has anxiety affected your relationships or social life?",
            "type": "radio",
            "required": true,
            "options": [
              {
                "value": "significantly",
                "label": "A lot",
                "score": 4
              },
              {
                "value": "moderately",
                "label": "Moderately",
                "score": 2
              },
              {
                "value": "mildly",
                "label": "A little",
                "score": 1
              },
              {
                "value": "not-at-all",
                "label": "Not at all",
                "score": 0
              }
            ]
          },
          {
            "id": "duration",
            "text": "How long have you been experiencing anxiety at this level?",
            "type": "radio",
            "required": true,
            "options": [
              {
                "value": "more-than-year",
                "label": "More than a year",
                "score": 3
              },
              {
                "value": "6-12-months",
                "label": "6–12 months",
                "score": 2
              },
              {
                "value": "1-6-months",
                "label": "1–6 months",
                "score": 1
              },
              {
                "value": "less-than-month",
                "label": "Less than a month",
                "score": 0
              }
            ]
          },
          {
            "id": "self-harm",
            "text": "Are you currently experiencing any thoughts of self-harm or suicide?",
            "type": "radio",
            "required": true,
            "redFlagKey": "mental-health-risk",
            "options": [
              {
                "value": "yes-significant",
                "label": "Yes, these thoughts are significant or recurring",
                "score": 12,
                "redFlag": true
              },
              {
                "value": "passing-thoughts",
                "label": "I have had some passing thoughts",
                "score": 4,
                "advisoryKey": "mental-health-advisory"
              },
              {
                "value": "no",
                "label": "No",
                "score": 0
              }
            ]
          }
        ]
      },
      {
        "id": "contact-consent",
        "title": "Section 4 of 4: Your Details",
        "description": "Your result will be calculated and saved securely. We will attempt to email a copy, and the useful personalised guidance does not depend on AI.",
        "questions": [
          {
            "id": "name",
            "text": "Your name",
            "type": "text",
            "required": true
          },
          {
            "id": "email",
            "text": "Your email address",
            "subtext": "We will attempt to send a copy of the saved result here.",
            "type": "email",
            "required": true
          },
          {
            "id": "phone",
            "text": "Your phone or WhatsApp number (optional)",
            "subtext": "If you would prefer us to call or message you, include your number here.",
            "type": "tel",
            "required": false
          }
        ]
      }
    ]
  },
  "depression": {
    "id": "depression",
    "title": "Depression Self-Assessment",
    "subtitle": "This assessment helps you reflect on how low mood or depression may be affecting your daily life, energy levels, and sense of wellbeing. There are no right or wrong answers.",
    "estimatedMinutes": 7,
    "scoreThresholds": {
      "moderateConcern": 10,
      "higherConcern": 20,
      "possibleDetoxRisk": 100
    },
    "sections": [
      {
        "id": "mood-emotional-wellbeing",
        "title": "Section 1 of 3: Mood and Emotional Wellbeing",
        "description": "Over the past two weeks, how often have the following affected you?",
        "questions": [
          {
            "id": "low-mood",
            "text": "Feeling down, depressed, or hopeless",
            "type": "radio",
            "required": true,
            "options": [
              {
                "value": "nearly-every-day",
                "label": "Every day or almost every day",
                "score": 6
              },
              {
                "value": "more-than-half",
                "label": "Most days",
                "score": 4
              },
              {
                "value": "several-days",
                "label": "Some days",
                "score": 2
              },
              {
                "value": "not-at-all",
                "label": "Rarely or not at all",
                "score": 0
              }
            ]
          },
          {
            "id": "loss-of-interest",
            "text": "Little interest or pleasure in things you used to enjoy",
            "type": "radio",
            "required": true,
            "options": [
              {
                "value": "nearly-every-day",
                "label": "Every day or almost every day",
                "score": 6
              },
              {
                "value": "more-than-half",
                "label": "Most days",
                "score": 4
              },
              {
                "value": "several-days",
                "label": "Some days",
                "score": 2
              },
              {
                "value": "not-at-all",
                "label": "Rarely or not at all",
                "score": 0
              }
            ]
          },
          {
            "id": "worthlessness",
            "text": "Feeling worthless, or experiencing excessive guilt about things",
            "type": "radio",
            "required": true,
            "options": [
              {
                "value": "nearly-every-day",
                "label": "Every day or almost every day",
                "score": 4
              },
              {
                "value": "more-than-half",
                "label": "Most days",
                "score": 3
              },
              {
                "value": "several-days",
                "label": "Some days",
                "score": 1
              },
              {
                "value": "not-at-all",
                "label": "Rarely or not at all",
                "score": 0
              }
            ]
          },
          {
            "id": "hopelessness",
            "text": "Feeling that things will not improve, or that there is little point in trying",
            "type": "radio",
            "required": true,
            "options": [
              {
                "value": "nearly-every-day",
                "label": "Every day or almost every day",
                "score": 4,
                "advisoryKey": "mental-health-advisory"
              },
              {
                "value": "more-than-half",
                "label": "Most days",
                "score": 3
              },
              {
                "value": "several-days",
                "label": "Some days",
                "score": 1
              },
              {
                "value": "not-at-all",
                "label": "Rarely or not at all",
                "score": 0
              }
            ]
          }
        ]
      },
      {
        "id": "energy-physical",
        "title": "Section 2 of 3: Energy, Sleep and Concentration",
        "description": "Over the past two weeks, how often have the following affected you?",
        "questions": [
          {
            "id": "fatigue",
            "text": "Feeling tired or having little energy, even after rest",
            "type": "radio",
            "required": true,
            "options": [
              {
                "value": "nearly-every-day",
                "label": "Every day or almost every day",
                "score": 4
              },
              {
                "value": "more-than-half",
                "label": "Most days",
                "score": 3
              },
              {
                "value": "several-days",
                "label": "Some days",
                "score": 1
              },
              {
                "value": "not-at-all",
                "label": "Rarely or not at all",
                "score": 0
              }
            ]
          },
          {
            "id": "sleep",
            "text": "Trouble sleeping, either too little, too much, or waking in the early hours and being unable to get back to sleep",
            "type": "radio",
            "required": true,
            "options": [
              {
                "value": "nearly-every-day",
                "label": "Every day or almost every day",
                "score": 3
              },
              {
                "value": "more-than-half",
                "label": "Most days",
                "score": 2
              },
              {
                "value": "several-days",
                "label": "Some days",
                "score": 1
              },
              {
                "value": "not-at-all",
                "label": "Rarely or not at all",
                "score": 0
              }
            ]
          },
          {
            "id": "concentration",
            "text": "Trouble concentrating on things such as reading, conversations, or work",
            "type": "radio",
            "required": true,
            "options": [
              {
                "value": "nearly-every-day",
                "label": "Every day or almost every day",
                "score": 3
              },
              {
                "value": "more-than-half",
                "label": "Most days",
                "score": 2
              },
              {
                "value": "several-days",
                "label": "Some days",
                "score": 1
              },
              {
                "value": "not-at-all",
                "label": "Rarely or not at all",
                "score": 0
              }
            ]
          },
          {
            "id": "appetite",
            "text": "Noticeable changes in appetite, eating much less or much more than usual",
            "type": "radio",
            "required": true,
            "options": [
              {
                "value": "nearly-every-day",
                "label": "Every day or almost every day",
                "score": 3
              },
              {
                "value": "more-than-half",
                "label": "Most days",
                "score": 2
              },
              {
                "value": "several-days",
                "label": "Some days",
                "score": 1
              },
              {
                "value": "not-at-all",
                "label": "Rarely or not at all",
                "score": 0
              }
            ]
          }
        ]
      },
      {
        "id": "safety-coping",
        "title": "Section 3 of 3: Coping and Safety",
        "description": "These questions help us understand how you are currently coping and whether any urgent support may be needed.",
        "questions": [
          {
            "id": "substance-coping",
            "text": "Are you currently using alcohol or other substances more than usual to help cope with how you feel?",
            "type": "radio",
            "required": true,
            "options": [
              {
                "value": "yes-significantly",
                "label": "Yes, noticeably more than usual",
                "score": 4,
                "advisoryKey": "mental-health-advisory"
              },
              {
                "value": "somewhat",
                "label": "Somewhat",
                "score": 2
              },
              {
                "value": "no",
                "label": "No",
                "score": 0
              }
            ]
          },
          {
            "id": "withdrawal",
            "text": "Have you been withdrawing from family, friends, or social activities more than usual?",
            "type": "radio",
            "required": true,
            "options": [
              {
                "value": "yes-significantly",
                "label": "Yes, significantly",
                "score": 3
              },
              {
                "value": "somewhat",
                "label": "Somewhat",
                "score": 1
              },
              {
                "value": "no",
                "label": "No",
                "score": 0
              }
            ]
          },
          {
            "id": "self-harm",
            "text": "Do you have any thoughts of harming yourself, or that you would be better off not being here?",
            "type": "radio",
            "required": true,
            "redFlagKey": "mental-health-risk",
            "options": [
              {
                "value": "yes-significant",
                "label": "Yes, these thoughts are significant or recurring",
                "score": 15,
                "redFlag": true
              },
              {
                "value": "passing-thoughts",
                "label": "I have had some passing thoughts",
                "score": 6,
                "advisoryKey": "mental-health-advisory"
              },
              {
                "value": "no",
                "label": "No",
                "score": 0
              }
            ]
          }
        ]
      },
      {
        "id": "contact-consent",
        "title": "Section 4 of 4: Your Details",
        "description": "Your result will be calculated and saved securely. We will attempt to email a copy, and the useful personalised guidance does not depend on AI.",
        "questions": [
          {
            "id": "name",
            "text": "Your name",
            "type": "text",
            "required": true
          },
          {
            "id": "email",
            "text": "Your email address",
            "subtext": "We will attempt to send a copy of the saved result here.",
            "type": "email",
            "required": true
          },
          {
            "id": "phone",
            "text": "Your phone or WhatsApp number (optional)",
            "subtext": "If you would prefer us to call or message you, include your number here.",
            "type": "tel",
            "required": false
          }
        ]
      }
    ]
  },
  "adhd": {
    "id": "adhd",
    "title": "ADHD & Impulsivity Self-Reflection",
    "subtitle": "This assessment invites you to reflect on patterns of attention, impulsivity, and restlessness that may be affecting your daily life, work, and relationships. There are no right or wrong answers.",
    "estimatedMinutes": 8,
    "scoreThresholds": {
      "moderateConcern": 12,
      "higherConcern": 22,
      "possibleDetoxRisk": 100
    },
    "sections": [
      {
        "id": "attention-focus",
        "title": "Section 1 of 3: Attention and Focus",
        "description": "These questions explore how attention and concentration show up for you day-to-day.",
        "questions": [
          {
            "id": "sustaining-attention",
            "text": "How often do you have difficulty sustaining attention on tasks or activities that require prolonged mental effort, such as reading, completing work, or following conversations?",
            "type": "radio",
            "required": true,
            "options": [
              {
                "value": "very-often",
                "label": "Every day or almost every day",
                "score": 4
              },
              {
                "value": "often",
                "label": "Most days",
                "score": 3
              },
              {
                "value": "sometimes",
                "label": "Some days",
                "score": 2
              },
              {
                "value": "rarely",
                "label": "Rarely or not at all",
                "score": 0
              }
            ]
          },
          {
            "id": "distraction",
            "text": "How often are you easily distracted by external stimuli, background noise, or unrelated thoughts?",
            "type": "radio",
            "required": true,
            "options": [
              {
                "value": "very-often",
                "label": "Every day or almost every day",
                "score": 4
              },
              {
                "value": "often",
                "label": "Most days",
                "score": 3
              },
              {
                "value": "sometimes",
                "label": "Some days",
                "score": 2
              },
              {
                "value": "rarely",
                "label": "Rarely or not at all",
                "score": 0
              }
            ]
          },
          {
            "id": "losing-things",
            "text": "How often do you lose important items, forget appointments, or fail to follow through on commitments, despite intending to?",
            "type": "radio",
            "required": true,
            "options": [
              {
                "value": "very-often",
                "label": "Every day or almost every day",
                "score": 3
              },
              {
                "value": "often",
                "label": "Most days",
                "score": 2
              },
              {
                "value": "sometimes",
                "label": "Some days",
                "score": 1
              },
              {
                "value": "rarely",
                "label": "Rarely or not at all",
                "score": 0
              }
            ]
          },
          {
            "id": "task-switching",
            "text": "How often do you start tasks or projects but then move on to something else before finishing?",
            "type": "radio",
            "required": true,
            "options": [
              {
                "value": "very-often",
                "label": "Every day or almost every day",
                "score": 4
              },
              {
                "value": "often",
                "label": "Most days",
                "score": 3
              },
              {
                "value": "sometimes",
                "label": "Some days",
                "score": 2
              },
              {
                "value": "rarely",
                "label": "Rarely or not at all",
                "score": 0
              }
            ]
          }
        ]
      },
      {
        "id": "hyperactivity-restlessness",
        "title": "Section 2 of 3: Hyperactivity, Impulsivity and Emotional Regulation",
        "description": "These questions explore restlessness, impulsive behaviour, and emotional responses.",
        "questions": [
          {
            "id": "restlessness",
            "text": "How often do you feel physically restless, find it hard to sit still, or feel an internal sense of being driven or unable to slow down?",
            "type": "radio",
            "required": true,
            "options": [
              {
                "value": "very-often",
                "label": "Every day or almost every day",
                "score": 4
              },
              {
                "value": "often",
                "label": "Most days",
                "score": 3
              },
              {
                "value": "sometimes",
                "label": "Some days",
                "score": 2
              },
              {
                "value": "rarely",
                "label": "Rarely or not at all",
                "score": 0
              }
            ]
          },
          {
            "id": "interrupting",
            "text": "How often do you interrupt others, blurt out answers, or find it hard to wait your turn in conversations or queues?",
            "type": "radio",
            "required": true,
            "options": [
              {
                "value": "very-often",
                "label": "Every day or almost every day",
                "score": 3
              },
              {
                "value": "often",
                "label": "Most days",
                "score": 2
              },
              {
                "value": "sometimes",
                "label": "Some days",
                "score": 1
              },
              {
                "value": "rarely",
                "label": "Rarely or not at all",
                "score": 0
              }
            ]
          },
          {
            "id": "impulsive-decisions",
            "text": "How often do you make impulsive decisions, acting without fully thinking through the consequences?",
            "type": "radio",
            "required": true,
            "options": [
              {
                "value": "very-often",
                "label": "Every day or almost every day",
                "score": 4
              },
              {
                "value": "often",
                "label": "Most days",
                "score": 3
              },
              {
                "value": "sometimes",
                "label": "Some days",
                "score": 2
              },
              {
                "value": "rarely",
                "label": "Rarely or not at all",
                "score": 0
              }
            ]
          },
          {
            "id": "emotional-regulation",
            "text": "How often do you experience sudden or intense shifts in mood, become easily frustrated, or find your emotions feel disproportionate to the situation?",
            "type": "radio",
            "required": true,
            "options": [
              {
                "value": "very-often",
                "label": "Every day or almost every day",
                "score": 3
              },
              {
                "value": "often",
                "label": "Most days",
                "score": 2
              },
              {
                "value": "sometimes",
                "label": "Some days",
                "score": 1
              },
              {
                "value": "rarely",
                "label": "Rarely or not at all",
                "score": 0
              }
            ]
          }
        ]
      },
      {
        "id": "impact-and-context",
        "title": "Section 3 of 3: Impact and Wellbeing",
        "description": "These questions help us understand the impact these patterns have on your life and how long they have been present.",
        "questions": [
          {
            "id": "life-impact",
            "text": "How much are these patterns causing problems at work, in your relationships, or in managing your daily life?",
            "type": "radio",
            "required": true,
            "options": [
              {
                "value": "significantly",
                "label": "A lot",
                "score": 4
              },
              {
                "value": "moderately",
                "label": "Moderately",
                "score": 3
              },
              {
                "value": "mildly",
                "label": "A little",
                "score": 2
              },
              {
                "value": "not-much",
                "label": "Not at all",
                "score": 0
              }
            ]
          },
          {
            "id": "duration",
            "text": "Have these patterns been present for most of your life, or are they relatively recent?",
            "type": "radio",
            "required": true,
            "options": [
              {
                "value": "lifelong",
                "label": "For most of my life, since childhood or early adulthood",
                "score": 3
              },
              {
                "value": "several-years",
                "label": "For several years",
                "score": 2
              },
              {
                "value": "recent",
                "label": "Only in the past year or two",
                "score": 1
              },
              {
                "value": "not-sure",
                "label": "I am not sure",
                "score": 1
              }
            ]
          },
          {
            "id": "mental-health",
            "text": "Are you currently experiencing significant low mood, anxiety, or any thoughts of self-harm?",
            "type": "radio",
            "required": true,
            "redFlagKey": "mental-health-risk",
            "options": [
              {
                "value": "yes-self-harm",
                "label": "Yes, including thoughts of self-harm or suicide",
                "score": 12,
                "redFlag": true
              },
              {
                "value": "yes-mood",
                "label": "Yes, significant low mood or anxiety",
                "score": 4,
                "advisoryKey": "mental-health-advisory"
              },
              {
                "value": "somewhat",
                "label": "Somewhat",
                "score": 2
              },
              {
                "value": "no",
                "label": "Not particularly",
                "score": 0
              }
            ]
          }
        ]
      },
      {
        "id": "contact-consent",
        "title": "Section 4 of 4: Your Details",
        "description": "Your result will be calculated and saved securely. We will attempt to email a copy, and the useful personalised guidance does not depend on AI.",
        "questions": [
          {
            "id": "name",
            "text": "Your name",
            "type": "text",
            "required": true
          },
          {
            "id": "email",
            "text": "Your email address",
            "subtext": "We will attempt to send a copy of the saved result here.",
            "type": "email",
            "required": true
          },
          {
            "id": "phone",
            "text": "Your phone or WhatsApp number (optional)",
            "subtext": "If you would prefer us to call or message you, include your number here.",
            "type": "tel",
            "required": false
          }
        ]
      }
    ]
  }
} satisfies Record<AssessmentKey, LegacyDefinitionSnapshot>;

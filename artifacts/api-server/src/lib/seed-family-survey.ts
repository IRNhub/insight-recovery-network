/**
 * Idempotent seed for the UK Family Addiction Impact Survey 2026.
 *
 * Runs at server boot (mirrors seedArticlesIfEmpty). Safe to run on every
 * deployment:
 * - The survey is inserted only if the slug does not already exist.
 * - Questions are upserted by (surveyId, questionKey); rerunning updates
 *   text/options in place and never duplicates rows.
 * - The survey status is NEVER changed by the seed after creation, so an
 *   Open survey stays open across deploys. It is created as Draft unless
 *   SURVEY_FAMILY_2026_PUBLISH=true is set at first deploy.
 */
import { db, surveysTable, surveyQuestionsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { ensureSurveyTables } from "./survey-tables";
import { logger } from "./logger";

export const FAMILY_SURVEY_SLUG = "family-addiction-impact-survey-2026";
export const FAMILY_SURVEY_CODE_PREFIX = "FAM-2026";

const PREFER_NOT = "Prefer not to say";

interface SeedQuestion {
  questionKey: string;
  section: string;
  questionText: string;
  questionType: "single_choice" | "multi_choice" | "scale" | "short_text" | "long_text" | "yes_no" | "consent";
  options?: {
    choices?: string[];
    scaleMin?: number;
    scaleMax?: number;
    scaleMinLabel?: string;
    scaleMaxLabel?: string;
    maxLength?: number;
  };
  isRequired: boolean;
  helperText?: string;
}

export const SECTION_EXPERIENCE = "About your experience";
export const SECTION_SEEKING_HELP = "Seeking help";
export const SECTION_FAMILY_IMPACT = "Family impact";
export const SECTION_TREATMENT = "Treatment and support";
export const SECTION_REFLECTION = "Reflection";

const FREE_TEXT_HELPER = "Please do not include names or identifying details.";

export const FAMILY_SURVEY_QUESTIONS: SeedQuestion[] = [
  {
    questionKey: "relationship",
    section: SECTION_EXPERIENCE,
    questionText: "What is your relationship to the person whose addiction or behaviour affected you?",
    questionType: "single_choice",
    options: {
      choices: ["Partner or spouse", "Parent", "Child", "Sibling", "Other relative", "Friend", "Colleague", "Other", PREFER_NOT],
    },
    isRequired: true,
  },
  {
    questionKey: "main_addiction",
    section: SECTION_EXPERIENCE,
    questionText: "Which addiction or compulsive behaviour had the greatest impact?",
    questionType: "single_choice",
    options: {
      choices: [
        "Alcohol",
        "Cocaine or other stimulants",
        "Cannabis",
        "Opioids",
        "Prescription medication",
        "Gambling",
        "Trading or cryptocurrency-related behaviour",
        "Sexual or pornography-related behaviour",
        "Gaming",
        "Multiple substances or behaviours",
        "Other",
        PREFER_NOT,
      ],
    },
    isRequired: true,
  },
  {
    questionKey: "same_household",
    section: SECTION_EXPERIENCE,
    questionText: "Was the person living in the same household as you during the period you are describing?",
    questionType: "single_choice",
    options: { choices: ["Yes", "No", "Some of the time", PREFER_NOT] },
    isRequired: true,
  },
  {
    questionKey: "children_in_household",
    section: SECTION_EXPERIENCE,
    questionText: "Were children under the age of 18 living in the household?",
    questionType: "single_choice",
    options: { choices: ["Yes", "No", PREFER_NOT] },
    isRequired: true,
  },
  {
    questionKey: "time_before_help",
    section: SECTION_SEEKING_HELP,
    questionText: "Approximately how long did the problem affect the family before professional help was first sought?",
    questionType: "single_choice",
    options: {
      choices: [
        "Less than 3 months",
        "3 to 6 months",
        "6 to 12 months",
        "1 to 2 years",
        "2 to 5 years",
        "More than 5 years",
        "Professional help has not yet been sought",
        "Unsure",
      ],
    },
    isRequired: true,
  },
  {
    questionKey: "help_delays",
    section: SECTION_SEEKING_HELP,
    questionText: "What delayed the family from seeking professional help?",
    questionType: "multi_choice",
    options: {
      choices: [
        "The person denied there was a problem",
        "The family hoped the situation would improve",
        "Fear of conflict",
        "Fear the person would leave",
        "Cost of treatment",
        "Uncertainty about where to get help",
        "Shame or stigma",
        "Concern about children",
        "Concern about work or reputation",
        "Previous treatment had not worked",
        "The family disagreed about what to do",
        "The person was not willing to accept help",
        "Help was sought quickly",
        "Other",
        PREFER_NOT,
      ],
    },
    isRequired: true,
  },
  {
    questionKey: "help_types_tried",
    section: SECTION_SEEKING_HELP,
    questionText: "What types of help did the family try?",
    questionType: "multi_choice",
    options: {
      choices: [
        "GP or primary-care doctor",
        "NHS or public addiction service",
        "Private therapist or counsellor",
        "Psychiatrist",
        "Family intervention",
        "Residential rehabilitation",
        "Outpatient programme",
        "Online recovery programme",
        "Mutual-aid group",
        "Family support group",
        "Religious or spiritual support",
        "Informal family support only",
        "No professional help",
        "Other",
      ],
    },
    isRequired: true,
  },
  {
    questionKey: "accepted_help",
    section: SECTION_SEEKING_HELP,
    questionText: "Did the person eventually accept professional help?",
    questionType: "single_choice",
    options: { choices: ["Yes", "No", "Partially", "Help has not yet been offered", "Unsure"] },
    isRequired: true,
  },
  {
    questionKey: "impact_emotional",
    section: SECTION_FAMILY_IMPACT,
    questionText: "How significantly did the situation affect your emotional wellbeing?",
    questionType: "scale",
    options: { scaleMin: 1, scaleMax: 10, scaleMinLabel: "Very little impact", scaleMaxLabel: "Extremely severe impact" },
    isRequired: true,
  },
  {
    questionKey: "impact_relationships",
    section: SECTION_FAMILY_IMPACT,
    questionText: "How significantly did the situation affect family relationships?",
    questionType: "scale",
    options: { scaleMin: 1, scaleMax: 10, scaleMinLabel: "Very little impact", scaleMaxLabel: "Extremely severe impact" },
    isRequired: true,
  },
  {
    questionKey: "impact_financial",
    section: SECTION_FAMILY_IMPACT,
    questionText: "Did the situation affect the family financially?",
    questionType: "single_choice",
    options: {
      choices: [
        "No noticeable financial impact",
        "Minor financial impact",
        "Moderate financial impact",
        "Serious financial impact",
        "Severe or long-term financial impact",
        "Unsure",
        PREFER_NOT,
      ],
    },
    isRequired: true,
  },
  {
    questionKey: "areas_affected",
    section: SECTION_FAMILY_IMPACT,
    questionText: "Which areas of family life were affected?",
    questionType: "multi_choice",
    options: {
      choices: [
        "Trust",
        "Communication",
        "Parenting",
        "Intimacy",
        "Mental health",
        "Physical health",
        "Employment",
        "Education",
        "Housing",
        "Finances",
        "Legal issues",
        "Social relationships",
        "Safety",
        "Other",
        PREFER_NOT,
      ],
    },
    isRequired: true,
  },
  {
    questionKey: "felt_responsible",
    section: SECTION_FAMILY_IMPACT,
    questionText: "Did you feel responsible for keeping the person safe or preventing the situation from getting worse?",
    questionType: "single_choice",
    options: { choices: ["Often", "Sometimes", "Rarely", "Never", "Unsure", PREFER_NOT] },
    isRequired: true,
  },
  {
    questionKey: "concealed_behaviour",
    section: SECTION_FAMILY_IMPACT,
    questionText: "Did you ever conceal, minimise or explain the person's behaviour to other people?",
    questionType: "single_choice",
    options: { choices: ["Often", "Sometimes", "Rarely", "Never", "Unsure", PREFER_NOT] },
    isRequired: true,
  },
  {
    questionKey: "family_disagreements",
    section: SECTION_FAMILY_IMPACT,
    questionText: "Did disagreements arise within the family about how to respond?",
    questionType: "single_choice",
    options: { choices: ["Frequently", "Sometimes", "Rarely", "Never", PREFER_NOT] },
    isRequired: true,
  },
  {
    questionKey: "support_would_have_helped",
    section: SECTION_TREATMENT,
    questionText: "Which form of support do you believe would have helped the family sooner?",
    questionType: "multi_choice",
    options: {
      choices: [
        "Clearer information about addiction",
        "Advice about boundaries",
        "Family therapy",
        "Intervention support",
        "Faster access to treatment",
        "More affordable treatment",
        "Support for children",
        "Support for partners",
        "Support for parents",
        "Help comparing treatment options",
        "Online support",
        "Residential treatment",
        "Medical or psychiatric support",
        "Workplace support",
        "Other",
        "Unsure",
      ],
    },
    isRequired: true,
  },
  {
    questionKey: "confidence_treatment_options",
    section: SECTION_TREATMENT,
    questionText: "Before seeking help, how confident did you feel about understanding the available treatment options?",
    questionType: "scale",
    options: { scaleMin: 1, scaleMax: 10, scaleMinLabel: "Not confident at all", scaleMaxLabel: "Completely confident" },
    isRequired: true,
  },
  {
    questionKey: "treatment_concerns",
    section: SECTION_TREATMENT,
    questionText: "Which concerns made treatment difficult to consider?",
    questionType: "multi_choice",
    options: {
      choices: [
        "Cost",
        "Waiting lists",
        "Location",
        "Work commitments",
        "Childcare",
        "Confidentiality",
        "Fear of judgement",
        "Fear the person would refuse",
        "Fear the person would leave treatment",
        "Previous negative treatment experience",
        "Uncertainty about treatment quality",
        "Uncertainty about whether residential treatment was necessary",
        "Concern about overseas treatment",
        "No major concerns",
        "Other",
      ],
    },
    isRequired: true,
  },
  {
    questionKey: "wish_understood",
    section: SECTION_REFLECTION,
    questionText: "What do you wish you had understood earlier?",
    questionType: "long_text",
    options: { maxLength: 4000 },
    isRequired: false,
    helperText: FREE_TEXT_HELPER,
  },
  {
    questionKey: "advice_to_families",
    section: SECTION_REFLECTION,
    questionText: "What would you say to another family currently facing a similar situation?",
    questionType: "long_text",
    options: { maxLength: 4000 },
    isRequired: false,
    helperText: FREE_TEXT_HELPER,
  },
  {
    questionKey: "professionals_should_understand",
    section: SECTION_REFLECTION,
    questionText:
      "Is there anything else you believe professionals, services or the public should understand about the impact of addiction on families?",
    questionType: "long_text",
    options: { maxLength: 4000 },
    isRequired: false,
    helperText: FREE_TEXT_HELPER,
  },
  {
    questionKey: "country",
    section: SECTION_REFLECTION,
    questionText: "Which country are you currently based in?",
    questionType: "single_choice",
    options: {
      choices: [
        "United Kingdom",
        "South Africa",
        "Ireland",
        "United States",
        "Canada",
        "Australia",
        "New Zealand",
        "Other",
        PREFER_NOT,
      ],
    },
    isRequired: true,
  },
];

export async function seedFamilySurvey(): Promise<void> {
  try {
    await ensureSurveyTables();

    let [survey] = await db.select().from(surveysTable).where(eq(surveysTable.slug, FAMILY_SURVEY_SLUG));

    if (!survey) {
      const initialStatus = process.env.SURVEY_FAMILY_2026_PUBLISH === "true" ? "open" : "draft";
      [survey] = await db
        .insert(surveysTable)
        .values({
          slug: FAMILY_SURVEY_SLUG,
          title: "UK Family Addiction Impact Survey 2026",
          description:
            "Insight Recovery Network is conducting an anonymous survey to better understand how addiction affects families and the barriers people face when trying to access help.",
          status: initialStatus,
          isPublic: initialStatus === "open",
          isNoIndex: true,
          opensAt: initialStatus === "open" ? new Date() : null,
          createdBy: "seed",
        })
        .returning();
      logger.info({ slug: FAMILY_SURVEY_SLUG, status: initialStatus }, "Seeded family survey");
    }

    if (!survey) return;

    for (let i = 0; i < FAMILY_SURVEY_QUESTIONS.length; i++) {
      const q = FAMILY_SURVEY_QUESTIONS[i]!;
      const [existing] = await db
        .select()
        .from(surveyQuestionsTable)
        .where(and(eq(surveyQuestionsTable.surveyId, survey.id), eq(surveyQuestionsTable.questionKey, q.questionKey)));

      if (existing) {
        await db
          .update(surveyQuestionsTable)
          .set({
            section: q.section,
            questionOrder: i + 1,
            questionText: q.questionText,
            questionType: q.questionType,
            options: q.options ?? null,
            isRequired: q.isRequired,
            helperText: q.helperText ?? null,
            updatedAt: new Date(),
          })
          .where(eq(surveyQuestionsTable.id, existing.id));
      } else {
        await db.insert(surveyQuestionsTable).values({
          surveyId: survey.id,
          questionKey: q.questionKey,
          section: q.section,
          questionOrder: i + 1,
          questionText: q.questionText,
          questionType: q.questionType,
          options: q.options ?? null,
          isRequired: q.isRequired,
          helperText: q.helperText ?? null,
        });
      }
    }
  } catch (err) {
    logger.error({ err }, "Family survey seed failed");
  }
}

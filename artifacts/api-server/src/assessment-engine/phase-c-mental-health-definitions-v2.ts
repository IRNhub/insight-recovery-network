import type {
  AssessmentDefinition,
  AssessmentKey,
  AssessmentOption,
  AssessmentQuestion,
  AssessmentSection,
  ClinicalApprovalMetadata,
  DomainRule,
  InterpretationRule,
  PathwayDefinition,
  SafetyRule,
  ValidatedInstrumentDefinition,
} from "./contracts.ts";

type PhaseCKey = Extract<AssessmentKey, "anxiety" | "depression" | "adhd">;

const PHASE_C_CLINICAL_APPROVAL: ClinicalApprovalMetadata = {
  status: "approved",
  reference: "IRN-ASSESSMENT-FINAL-CLINICAL-CORRECTION-2026-08-30",
  approvedBy: "Craig Bilton, Clinical Director",
  approvedAt: "2026-08-30",
  notes: "Adult-only clinical architecture, context wording, shared safety mappings, deterministic findings and pathways approved following the final correction pass. This is not legal, privacy, medical-device, regulatory or instrument-licensing approval.",
};

const ADULT_ONLY = {
  questionId: "age-eligibility",
  allowedValues: ["adult"],
  ineligibleHeading: "This assessment is designed for adults aged 18 or over",
  ineligibleBody: "We will not score or submit this adult questionnaire for someone under 18. A GP, school or college wellbeing service, or an appropriate child and young-person mental-health service can help identify a suitable assessment and support pathway. If there is immediate danger, call 999 or go to A&E.",
  pathways: [
    {
      label: "Speak with a GP",
      description: "A GP can discuss age-appropriate assessment and local support.",
      destination: "https://www.nhs.uk/service-search/find-a-gp",
    },
    {
      label: "Find urgent mental-health help",
      description: "Use NHS guidance if support is needed urgently or there is concern about safety.",
      destination: "https://www.nhs.uk/nhs-services/mental-health-services/where-to-get-urgent-help-for-mental-health/",
    },
  ],
};

function option(
  value: string,
  label: string,
  score = 0,
  instrumentThreshold = false,
): AssessmentOption {
  return { value, label, score, ...(instrumentThreshold ? { instrumentThreshold: true } : {}) };
}

function radio(
  id: string,
  text: string,
  options: AssessmentOption[],
  extra: Partial<AssessmentQuestion> = {},
): AssessmentQuestion {
  return { id, text, type: "radio", required: true, options, ...extra };
}

const ADULT_CONDITION = { all: [{ questionId: "age-eligibility", equals: "adult" }] };

function adultSection(section: AssessmentSection): AssessmentSection {
  return { ...section, displayWhen: ADULT_CONDITION };
}

function eligibilitySection(): AssessmentSection {
  return {
    id: "adult-eligibility",
    title: "Age eligibility",
    description: "These questionnaires and pathways are configured for adults. No under-18 response will be scored or submitted.",
    questions: [
      radio("age-eligibility", "Are you aged 18 or over?", [
        option("adult", "Yes, I am 18 or over"),
        option("under-18", "No, I am under 18"),
      ]),
    ],
  };
}

const TWO_WEEK_FREQUENCY = [
  option("not-at-all", "Not at all", 0),
  option("several-days", "Several days", 1),
  option("more-than-half", "More than half the days", 2),
  option("nearly-every-day", "Nearly every day", 3),
];

const CONTEXT_FREQUENCY = [
  option("not-at-all", "Not at all"),
  option("occasionally", "Occasionally", 1),
  option("often", "Often", 2),
  option("most-or-all", "Most or all of the time", 3),
];

function sharedSafetySection(): AssessmentSection {
  return adultSection({
    id: "independent-safety",
    title: "Independent safety check",
    description: "This answer is handled separately from the questionnaire score. It is used to select guidance, not to predict suicide or assign a suicide-risk label.",
    questions: [
      radio("mental-health-safety", "Which statement best describes any thoughts of self-harm or suicide?", [
        option("none", "I have not had these thoughts"),
        option("historical-non-current", "I have had these thoughts in the past, but they are not current", 1),
        option("passing-current", "I have current passing thoughts", 2),
        option("recurring-increasing", "I have current thoughts that are recurring, increasing or becoming harder to manage", 3),
        option("cannot-remain-safe", "I am currently concerned that I may not be able to remain safe", 4),
        option("recent-attempt-immediate-danger", "There has been a recent attempt or there is current immediate danger", 5),
      ]),
    ],
  });
}

function sharedMentalHealthSafetyRules(key: PhaseCKey): SafetyRule[] {
  const rule = (entry: Omit<SafetyRule, "version" | "approval">): SafetyRule => ({
    ...entry,
    version: 2,
    approval: PHASE_C_CLINICAL_APPROVAL,
  });
  return [
    rule({
      id: `mental-health.historical-non-current.${key}.v2`,
      action: "additional-caution",
      all: [{ questionId: "mental-health-safety", equals: "historical-non-current" }],
      evidenceQuestionIds: ["mental-health-safety"],
      contentId: "mental-health-support",
      pathwayIds: ["gp-review"],
      suppressCommercialCtas: false,
    }),
    rule({
      id: `mental-health.passing-current.${key}.v2`,
      action: "clinical-review-recommended",
      all: [{ questionId: "mental-health-safety", equals: "passing-current" }],
      evidenceQuestionIds: ["mental-health-safety"],
      contentId: "mental-health-current-review",
      pathwayIds: ["gp-review", "samaritans"],
      suppressCommercialCtas: true,
    }),
    rule({
      id: `mental-health.recurring-increasing.${key}.v2`,
      action: "urgent-same-day-assessment",
      all: [{ questionId: "mental-health-safety", equals: "recurring-increasing" }],
      evidenceQuestionIds: ["mental-health-safety"],
      contentId: "mental-health-urgent",
      pathwayIds: ["urgent-mental-health", "samaritans"],
      suppressCommercialCtas: true,
    }),
    rule({
      id: `mental-health.cannot-remain-safe.${key}.v2`,
      action: "emergency-help-now",
      all: [{ questionId: "mental-health-safety", equals: "cannot-remain-safe" }],
      evidenceQuestionIds: ["mental-health-safety"],
      contentId: "mental-health-emergency",
      pathwayIds: ["emergency-999", "samaritans"],
      suppressCommercialCtas: true,
    }),
    rule({
      id: `mental-health.recent-attempt-immediate-danger.${key}.v2`,
      action: "emergency-help-now",
      all: [{ questionId: "mental-health-safety", equals: "recent-attempt-immediate-danger" }],
      evidenceQuestionIds: ["mental-health-safety"],
      contentId: "mental-health-emergency",
      pathwayIds: ["emergency-999", "samaritans"],
      suppressCommercialCtas: true,
    }),
  ];
}

function domain(
  id: string,
  label: string,
  questionIds: string[],
  elevatedText: string,
  whyItMatters: string,
): DomainRule {
  return { id, label, questionIds, elevatedText, whyItMatters };
}

function interpretation(
  id: string,
  priority: number,
  domainIds: string[],
  statement: string,
  whyItMatters: string,
  extra: Partial<InterpretationRule> = {},
): InterpretationRule {
  return {
    id,
    priority,
    domainIds,
    minimumState: "elevated",
    statement,
    whyItMatters,
    approval: PHASE_C_CLINICAL_APPROVAL,
    ...extra,
  };
}

const PATHWAYS: PathwayDefinition[] = [
  { id: "emergency-999", category: "emergency", label: "Call 999 or go to A&E", description: "Use emergency services now if you may not remain safe, there has been a recent attempt, or there is immediate danger.", destination: "tel:999", commercial: false },
  { id: "samaritans", category: "nhs-specialist", label: "Call Samaritans on 116 123", description: "Confidential emotional support is available at any time.", destination: "tel:116123", commercial: false },
  { id: "urgent-mental-health", category: "urgent-medical", label: "Seek urgent mental-health support today", description: "Contact NHS 111 and select the mental-health option, your GP, or an appropriate local crisis service today.", destination: "tel:111", commercial: false },
  { id: "gp-review", category: "gp", label: "Speak with your GP or a qualified clinician", description: "A professional can review symptoms, safety, physical health, medication and other explanations that an online screen cannot establish.", destination: "https://www.nhs.uk/service-search/find-a-gp", commercial: false },
  { id: "nhs-talking-therapies", category: "nhs-specialist", label: "Explore NHS Talking Therapies", description: "Adults in England can check local NHS Talking Therapies options, including self-referral where available.", destination: "https://www.nhs.uk/service-search/mental-health/find-an-NHS-talking-therapies-service/", commercial: false, assessmentKeys: ["anxiety", "depression"] },
  { id: "formal-adhd", category: "formal-assessment", label: "Discuss a formal ADHD assessment", description: "A specialist assessment considers developmental history, impairment across settings and other possible explanations. Screening alone cannot diagnose ADHD.", destination: "https://www.nhs.uk/conditions/attention-deficit-hyperactivity-disorder-adhd/diagnosis/", commercial: false, assessmentKeys: ["adhd"] },
  { id: "nhs-substance-service", category: "nhs-specialist", label: "Discuss alcohol or drug coping with an appropriate service", description: "Substance use as a coping strategy deserves its own confidential assessment and should not be folded into a mental-health screening score.", destination: "https://www.nhs.uk/live-well/addiction-support/drug-addiction-getting-help/", commercial: false },
  { id: "self-guided", category: "self-guided", label: "Review practical information and monitor the pattern", description: "Use reliable information and seek professional support if symptoms, impact or safety concerns persist or increase.", destination: "/resources", commercial: false },
  { id: "irn-consultation", category: "irn-consultation", label: "Discuss mental-health support options with IRN", description: "IRN can discuss appropriate support and treatment-navigation options. IRN is not an emergency or diagnostic service.", destination: "/get-help", commercial: true },
];

const GAD_7_INSTRUMENT: ValidatedInstrumentDefinition = {
  kind: "gad-7",
  name: "GAD-7",
  version: "GAD-7",
  questionIds: ["gad7-1", "gad7-2", "gad7-3", "gad7-4", "gad7-5", "gad7-6", "gad7-7"],
  maximumScore: 21,
  bands: [
    { minimumScore: 0, maximumScore: 4, label: "Minimal anxiety", level: "lower-concern" },
    { minimumScore: 5, maximumScore: 9, label: "Mild anxiety", level: "moderate-concern" },
    { minimumScore: 10, maximumScore: 14, label: "Moderate anxiety", level: "higher-concern" },
    { minimumScore: 15, maximumScore: 21, label: "Severe anxiety", level: "elevated-concern" },
  ],
  explanation: "The GAD-7 is a validated symptom screener, not a diagnosis. Its 0 to 21 score uses only the seven GAD-7 responses. IRN context and the independent safety check do not change it.",
  permissionStatus: "confirmed",
  sourceUrl: "https://www.phqscreeners.com/",
  citation: "Spitzer RL, Kroenke K, Williams JBW, Löwe B. A brief measure for assessing generalized anxiety disorder: the GAD-7. Archives of Internal Medicine. 2006.",
};

const PHQ_9_INSTRUMENT: ValidatedInstrumentDefinition = {
  kind: "phq-9",
  name: "PHQ-9",
  version: "PHQ-9",
  questionIds: ["phq9-1", "phq9-2", "phq9-3", "phq9-4", "phq9-5", "phq9-6", "phq9-7", "phq9-8", "phq9-9"],
  maximumScore: 27,
  bands: [
    { minimumScore: 0, maximumScore: 4, label: "Minimal depression", level: "lower-concern" },
    { minimumScore: 5, maximumScore: 9, label: "Mild depression", level: "moderate-concern" },
    { minimumScore: 10, maximumScore: 14, label: "Moderate depression", level: "higher-concern" },
    { minimumScore: 15, maximumScore: 19, label: "Moderately severe depression", level: "elevated-concern" },
    { minimumScore: 20, maximumScore: 27, label: "Severe depression", level: "elevated-concern" },
  ],
  explanation: "The PHQ-9 is a validated symptom screener, not a diagnosis. Its 0 to 27 score uses only the nine PHQ-9 responses. Item 9 also enters the separate safety engine and is never presented as a suicide-risk score.",
  permissionStatus: "confirmed",
  sourceUrl: "https://www.phqscreeners.com/",
  citation: "Kroenke K, Spitzer RL, Williams JBW. The PHQ-9: validity of a brief depression severity measure. Journal of General Internal Medicine. 2001.",
};

const ASRS_INSTRUMENT: ValidatedInstrumentDefinition = {
  kind: "asrs-v1.1-6q",
  name: "Adult ADHD Self-Report Scale (ASRS-v1.1) Screener",
  version: "v1.1 six-question screener",
  questionIds: ["asrs-1", "asrs-2", "asrs-3", "asrs-4", "asrs-5", "asrs-6"],
  maximumScore: 6,
  bands: [
    { minimumScore: 0, maximumScore: 3, label: "ASRS screening threshold not reached", level: "lower-concern" },
    { minimumScore: 4, maximumScore: 6, label: "ASRS screening threshold reached", level: "higher-concern" },
  ],
  explanation: "This uses the original ASRS-v1.1 six-question shaded-box method: four or more threshold responses means the screening threshold is reached. A screening result cannot diagnose ADHD. IRN context and safety answers do not change the result.",
  permissionStatus: "confirmed",
  sourceUrl: "https://www.hcp.med.harvard.edu/ncs/asrs.php",
  citation: "Kessler RC et al. The World Health Organization Adult ADHD Self-Report Scale (ASRS): a short screening scale for use in the general population. Psychological Medicine. 2005. © World Health Organization 2003. All rights reserved.",
};

function anxietySections(): AssessmentSection[] {
  return [
    eligibilitySection(),
    adultSection({
      id: "gad-7",
      title: "GAD-7",
      description: "Over the last 2 weeks, how often have you been bothered by the following problems?",
      questions: [
        radio("gad7-1", "Feeling nervous, anxious, or on edge", TWO_WEEK_FREQUENCY),
        radio("gad7-2", "Not being able to stop or control worrying", TWO_WEEK_FREQUENCY),
        radio("gad7-3", "Worrying too much about different things", TWO_WEEK_FREQUENCY),
        radio("gad7-4", "Trouble relaxing", TWO_WEEK_FREQUENCY),
        radio("gad7-5", "Being so restless that it is hard to sit still", TWO_WEEK_FREQUENCY),
        radio("gad7-6", "Becoming easily annoyed or irritable", TWO_WEEK_FREQUENCY),
        radio("gad7-7", "Feeling afraid, as if something awful might happen", TWO_WEEK_FREQUENCY),
      ],
    }),
    adultSection({
      id: "anxiety-context",
      title: "Anxiety context and impact",
      description: "These IRN questions provide context only. They do not change the GAD-7 score.",
      questions: [
        radio("anxiety-duration", "How long has this anxiety pattern been present?", [option("under-two-weeks", "Less than two weeks"), option("two-eight-weeks", "Two to eight weeks", 1), option("two-six-months", "Two to six months", 2), option("over-six-months", "More than six months", 3)]),
        radio("anxiety-avoidance", "How much are you avoiding situations, tasks, places or people because of anxiety?", [option("none", "Not at all"), option("some", "A little", 1), option("regular", "Regularly", 2), option("major", "Avoidance is substantially restricting my life", 3)]),
        radio("anxiety-functioning", "How much is anxiety affecting your overall day-to-day functioning?", [option("none", "Not at all"), option("mild", "A little", 1), option("moderate", "A noticeable amount", 2), option("severe", "Severely", 3)]),
        radio("anxiety-work-study", "How much is anxiety affecting work, study or important responsibilities?", CONTEXT_FREQUENCY),
        radio("anxiety-social", "How much is anxiety affecting relationships or social contact?", CONTEXT_FREQUENCY),
        radio("anxiety-substance-coping", "Are you using alcohol, medication outside a prescription, or other drugs to manage anxiety?", [option("no", "No"), option("occasionally", "Occasionally", 1), option("often", "Often", 2), option("most-days", "Most days", 3)]),
        radio("anxiety-coping", "Are coping strategies, routines or previous attempts helping?", [option("helping", "Yes, they are helping"), option("partly", "Partly", 1), option("not-helping", "Not much", 2), option("none", "I do not currently have helpful strategies", 2)]),
        radio("support", "Do you currently have professional or trusted-person support?", [option("yes", "Yes"), option("limited", "Some, but it is limited", 1), option("no", "No", 2)]),
        radio("readiness", "How ready do you feel to seek or continue support?", [option("not-ready", "Not ready at the moment"), option("considering", "Considering it", 1), option("ready", "Ready to seek support", 1), option("already-changing", "Already receiving or arranging support", 1)]),
      ],
    }),
    sharedSafetySection(),
  ];
}

function depressionSections(): AssessmentSection[] {
  return [
    eligibilitySection(),
    adultSection({
      id: "phq-9",
      title: "PHQ-9",
      description: "Over the last 2 weeks, how often have you been bothered by any of the following problems?",
      questions: [
        radio("phq9-1", "Little interest or pleasure in doing things", TWO_WEEK_FREQUENCY),
        radio("phq9-2", "Feeling down, depressed, or hopeless", TWO_WEEK_FREQUENCY),
        radio("phq9-3", "Trouble falling or staying asleep, or sleeping too much", TWO_WEEK_FREQUENCY),
        radio("phq9-4", "Feeling tired or having little energy", TWO_WEEK_FREQUENCY),
        radio("phq9-5", "Poor appetite or overeating", TWO_WEEK_FREQUENCY),
        radio("phq9-6", "Feeling bad about yourself - or that you are a failure or have let yourself or your family down", TWO_WEEK_FREQUENCY),
        radio("phq9-7", "Trouble concentrating on things, such as reading the newspaper or watching television", TWO_WEEK_FREQUENCY),
        radio("phq9-8", "Moving or speaking so slowly that other people could have noticed? Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual", TWO_WEEK_FREQUENCY),
        radio("phq9-9", "Thoughts that you would be better off dead or of hurting yourself in some way", TWO_WEEK_FREQUENCY),
      ],
    }),
    adultSection({
      id: "depression-context",
      title: "Depression context and impact",
      description: "These IRN questions provide context only. They do not change the PHQ-9 score.",
      questions: [
        radio("depression-duration", "How long has this broader pattern been present?", [option("under-two-weeks", "Less than two weeks"), option("two-eight-weeks", "Two to eight weeks", 1), option("two-six-months", "Two to six months", 2), option("over-six-months", "More than six months", 3)]),
        radio("depression-functioning", "How much is this pattern affecting day-to-day functioning?", [option("none", "Not at all"), option("mild", "A little", 1), option("moderate", "A noticeable amount", 2), option("severe", "Severely", 3)]),
        radio("depression-isolation", "How much have you withdrawn from other people or usual activities?", [option("none", "Not at all"), option("some", "A little", 1), option("regular", "Regularly", 2), option("major", "Substantially", 3)]),
        radio("depression-substance-coping", "Are you using alcohol, medication outside a prescription, or other drugs to manage how you feel?", [option("no", "No"), option("occasionally", "Occasionally", 1), option("often", "Often", 2), option("most-days", "Most days", 3)]),
        radio("depression-routine", "Are stable routines or positive activities currently helping?", [option("yes", "Yes"), option("partly", "Partly", 1), option("rarely", "Rarely", 2), option("none", "I do not currently have a stable routine or helpful activity", 2)]),
        radio("support", "Do you currently have professional or trusted-person support?", [option("yes", "Yes"), option("limited", "Some, but it is limited", 1), option("no", "No", 2)]),
        radio("readiness", "How ready do you feel to seek or continue support?", [option("not-ready", "Not ready at the moment"), option("considering", "Considering it", 1), option("ready", "Ready to seek support", 1), option("already-changing", "Already receiving or arranging support", 1)]),
      ],
    }),
    sharedSafetySection(),
  ];
}

const ASRS_OPTIONS = {
  q1235: [
    option("never", "Never"),
    option("rarely", "Rarely"),
    option("sometimes", "Sometimes"),
    option("often", "Often", 1, true),
    option("very-often", "Very Often", 1, true),
  ],
  q46: [
    option("never", "Never"),
    option("rarely", "Rarely"),
    option("sometimes", "Sometimes", 1, true),
    option("often", "Often", 1, true),
    option("very-often", "Very Often", 1, true),
  ],
};

function adhdSections(): AssessmentSection[] {
  return [
    eligibilitySection(),
    adultSection({
      id: "asrs-v1-1",
      title: "Adult ADHD Self-Report Scale (ASRS-v1.1) Screener",
      description: "Please answer the questions below, rating yourself on each of the criteria shown. As you answer each question, select the option that best describes how you have felt and conducted yourself over the past 6 months. Threshold responses retain the official shaded-box scoring. © World Health Organization 2003. All rights reserved.",
      questions: [
        radio("asrs-1", "How often do you have trouble wrapping up the final details of a project, once the challenging parts have been done?", ASRS_OPTIONS.q1235),
        radio("asrs-2", "How often do you have difficulty getting things in order when you have to do a task that requires organization?", ASRS_OPTIONS.q1235),
        radio("asrs-3", "How often do you have problems remembering appointments or obligations?", ASRS_OPTIONS.q1235),
        radio("asrs-4", "When you have a task that requires a lot of thought, how often do you avoid or delay getting started?", ASRS_OPTIONS.q46),
        radio("asrs-5", "How often do you fidget or squirm with your hands or feet when you have to sit down for a long time?", ASRS_OPTIONS.q1235),
        radio("asrs-6", "How often do you feel overly active and compelled to do things, like you were driven by a motor?", ASRS_OPTIONS.q46),
      ],
    }),
    adultSection({
      id: "adhd-context",
      title: "Developmental, functional and differential context",
      description: "These IRN questions do not change the ASRS result. They help explain why formal assessment must consider childhood, multiple settings, impairment and alternative explanations.",
      questions: [
        radio("adhd-distractibility", "How often are you easily distracted when trying to focus?", CONTEXT_FREQUENCY),
        radio("adhd-impulsivity", "How often do you act or speak before considering the consequences?", CONTEXT_FREQUENCY),
        radio("adhd-emotional-regulation", "How often do rapid frustration or emotional reactions affect what you do?", CONTEXT_FREQUENCY),
        radio("adhd-childhood", "Were similar attention, organisation, restlessness or impulsivity difficulties present before age 12?", [option("clear", "Yes, there is clear childhood evidence", 3), option("possible", "Possibly, but the evidence is unclear", 1), option("no", "No, not that I know of"), option("unsure", "I am unsure")]),
        radio("adhd-settings", "In how many settings do these difficulties currently cause problems?", [option("none", "They do not currently cause problems"), option("one", "One setting only", 1), option("multiple", "Two or more settings, such as home and work or education", 3), option("unclear", "It is unclear", 1)]),
        radio("adhd-functioning", "How much do these difficulties affect day-to-day functioning?", [option("none", "Not at all"), option("mild", "A little", 1), option("moderate", "A noticeable amount", 2), option("severe", "Severely", 3)]),
        radio("adhd-work-study", "How much do they affect work, education or important responsibilities?", CONTEXT_FREQUENCY),
        radio("adhd-relationships", "How much do they affect relationships or social situations?", CONTEXT_FREQUENCY),
        radio("adhd-sleep", "Could insufficient or disrupted sleep be contributing to these difficulties?", [option("unlikely", "Unlikely"), option("possibly", "Possibly", 1), option("likely", "Likely", 2), option("unsure", "Unsure", 1)]),
        radio("adhd-mood-anxiety", "Are anxiety or depression symptoms currently overlapping with these difficulties?", [option("no", "No"), option("possibly", "Possibly", 1), option("yes", "Yes", 2), option("unsure", "Unsure", 1)]),
        radio("adhd-trauma", "Could trauma-related symptoms be contributing to concentration, restlessness or emotional regulation difficulties?", [option("no", "No"), option("possibly", "Possibly", 1), option("yes", "Yes", 2), option("prefer-not", "Prefer not to say")]),
        radio("adhd-substance-overlap", "Could alcohol, medication outside a prescription, or other drug use be contributing to or used to manage these difficulties?", [option("no", "No"), option("possibly", "Possibly", 1), option("yes", "Yes", 3), option("prefer-not", "Prefer not to say")]),
        radio("support", "Do you currently have professional or trusted-person support?", [option("yes", "Yes"), option("limited", "Some, but it is limited", 1), option("no", "No", 2)]),
        radio("readiness", "How ready do you feel to discuss these difficulties with a qualified professional?", [option("not-ready", "Not ready at the moment"), option("considering", "Considering it", 1), option("ready", "Ready to seek support or assessment", 1), option("already-changing", "Already receiving or arranging support", 1)]),
      ],
    }),
    sharedSafetySection(),
  ];
}

const anxietyDomains = [
  domain("anxiety-symptoms", "Anxiety symptom burden", GAD_7_INSTRUMENT.questionIds, "Anxiety symptoms are prominent in the GAD-7 response pattern.", "Symptom burden is useful when interpreted alongside duration, avoidance, functioning and safety."),
  domain("avoidance-functioning", "Avoidance and functioning", ["anxiety-avoidance", "anxiety-functioning", "anxiety-work-study", "anxiety-social"], "Avoidance and effects on daily functioning stand out.", "Avoidance can bring short-term relief while reinforcing anxiety and restricting daily life."),
  domain("persistence-coping", "Persistence and coping attempts", ["anxiety-duration", "anxiety-coping"], "The pattern appears persistent despite limited benefit from current coping attempts.", "Persistent symptoms despite attempts to cope can support seeking a more structured assessment or intervention."),
  domain("substance-overlap", "Substance use as coping", ["anxiety-substance-coping"], "Alcohol, medication or other drug use appears relevant as a coping strategy.", "Substance coping can complicate anxiety and deserves a separate, non-judgemental assessment."),
  domain("readiness-support", "Support and readiness", ["support", "readiness"], "Available support or readiness is relevant to the next practical step.", "Support and readiness can help engagement, but never reduce a required safety action."),
];

const anxietyInterpretations = [
  interpretation("anxiety.avoidance-functioning.v2", 110, ["anxiety-symptoms", "avoidance-functioning"], "Your responses suggest that avoidance may be reinforcing the anxiety. Situations that feel difficult are increasingly being avoided, and this appears to be affecting day-to-day functioning.", "Understanding this interaction can help a professional choose support that addresses both symptoms and the cycle of avoidance."),
  interpretation("anxiety.persistent-coping.v2", 100, ["anxiety-symptoms", "persistence-coping"], "The anxiety pattern appears persistent, while current coping strategies are providing limited relief.", "Persistent symptoms despite coping attempts can justify reviewing whether more structured support would be useful."),
  interpretation("anxiety.substance-coping.v2", 95, ["anxiety-symptoms", "substance-overlap"], "Anxiety symptoms appear alongside using alcohol, medication or other drugs to cope.", "Both needs should be considered separately because short-term relief can obscure or reinforce a more complex pattern."),
];

const depressionDomains = [
  domain("depression-symptoms", "Depression symptom burden", PHQ_9_INSTRUMENT.questionIds.slice(0, 8), "Low mood, reduced interest and associated symptoms are prominent in the PHQ-9 response pattern.", "The PHQ-9 symptom pattern is useful when interpreted alongside functioning, duration, support and safety."),
  domain("functioning-withdrawal", "Functioning and withdrawal", ["depression-functioning", "depression-isolation", "depression-routine"], "Reduced functioning, withdrawal or loss of routine stands out.", "Withdrawal and reduced activity can make it harder to regain routine and positive reinforcement."),
  domain("persistence", "Duration", ["depression-duration"], "The broader pattern appears persistent.", "Duration adds context to the two-week PHQ-9 window but does not change its score."),
  domain("substance-overlap", "Substance use as coping", ["depression-substance-coping"], "Alcohol, medication or other drug use appears relevant as a coping strategy.", "Substance coping can worsen mood or complicate recovery and deserves its own assessment."),
  domain("readiness-support", "Support and readiness", ["support", "readiness"], "Available support or readiness is relevant to the next practical step.", "Support and willingness to seek help can be useful context, but never downgrade safety guidance."),
];

const depressionInterpretations = [
  interpretation("depression.symptoms-withdrawal.v2", 110, ["depression-symptoms", "functioning-withdrawal"], "The pattern is not limited to feeling low. Reduced interest, low energy and withdrawing from other people appear to be occurring together, which can make it harder to regain routine and positive activity.", "The interaction between symptoms and withdrawal can be more informative for planning support than the total score alone."),
  interpretation("depression.persistent-impact.v2", 100, ["depression-symptoms", "persistence"], "Depression symptoms appear to form part of a longer-lasting pattern rather than a brief change alone.", "A professional can explore duration, causes, physical health and treatment options that the two-week screen cannot establish."),
  interpretation("depression.substance-coping.v2", 95, ["depression-symptoms", "substance-overlap"], "Depression symptoms appear alongside using alcohol, medication or other drugs to cope.", "Mood support and substance-use support may both be relevant and should not be collapsed into one severity label."),
];

const adhdDomains = [
  domain("attention-organisation", "Attention and organisation", ["asrs-1", "asrs-2", "asrs-3", "asrs-4", "adhd-distractibility"], "Attention, organisation, task initiation or distractibility difficulties stand out.", "These symptoms can support formal assessment but also overlap with sleep, anxiety, depression, trauma and substance effects."),
  domain("restlessness-impulsivity", "Restlessness, impulsivity and regulation", ["asrs-5", "asrs-6", "adhd-impulsivity", "adhd-emotional-regulation"], "Restlessness, impulsivity or emotional regulation difficulties stand out.", "The pattern and its consequences matter more than any one symptom."),
  domain("developmental-context", "Childhood and multiple-setting context", ["adhd-childhood", "adhd-settings"], "There is evidence of childhood persistence and difficulties across more than one setting.", "A specialist assessment considers developmental onset and impairment in multiple settings before diagnosing ADHD."),
  domain("functional-impact", "Functional impact", ["adhd-functioning", "adhd-work-study", "adhd-relationships"], "The reported difficulties have a notable effect on functioning, responsibilities or relationships.", "Clinically meaningful impairment is an important part of formal assessment."),
  domain("mental-health-overlap", "Anxiety, depression, sleep and trauma context", ["adhd-sleep", "adhd-mood-anxiety", "adhd-trauma"], "Sleep, anxiety, depression or trauma-related overlap may be contributing to the pattern.", "These factors can resemble or intensify ADHD-like symptoms and deserve appropriate assessment in their own right."),
  domain("substance-overlap", "Substance-use context", ["adhd-substance-overlap"], "Alcohol, medication or other drug use may be contributing to or used to manage the difficulties.", "Substance effects and coping use should be assessed separately during diagnostic work."),
  domain("readiness-support", "Support and readiness", ["support", "readiness"], "Available support or readiness is relevant to the next practical step.", "Support can help engagement but cannot establish a diagnosis or reduce a safety action."),
];

const adhdInterpretations = [
  interpretation("adhd.context-uncertain.v2", 130, ["attention-organisation", "developmental-context", "functional-impact"], "Your responses show notable attention and organisation difficulties, but the information about childhood symptoms, problems across different settings or functional impact is less clear. That makes formal assessment important before concluding that ADHD is the explanation.", "ADHD diagnosis requires a developmental and functional assessment, and similar symptoms can have other causes.", {
    minimumDomainIds: ["attention-organisation"],
    any: [
      { questionId: "adhd-childhood", oneOf: ["no", "unsure", "possible"] },
      { questionId: "adhd-settings", oneOf: ["none", "one", "unclear"] },
      { questionId: "adhd-functioning", oneOf: ["none", "mild"] },
    ],
  }),
  interpretation("adhd.multi-setting-impact.v2", 115, ["attention-organisation", "developmental-context", "functional-impact"], "Attention and organisation difficulties appear alongside childhood persistence, problems in more than one setting and meaningful functional impact.", "This pattern can support seeking a formal specialist assessment, but the screening result still cannot diagnose ADHD."),
  interpretation("adhd.restlessness-impact.v2", 105, ["restlessness-impulsivity", "functional-impact"], "Restlessness, impulsivity or emotional regulation difficulties appear alongside meaningful day-to-day impact.", "A formal assessment can examine how persistent and pervasive this pattern is and whether another explanation fits better."),
  interpretation("adhd.differential-overlap.v2", 100, ["attention-organisation", "mental-health-overlap"], "ADHD-like difficulties appear alongside sleep, anxiety, depression or trauma-related factors that may overlap with them.", "A careful assessment should examine these explanations rather than treating a positive screen as diagnostic."),
  interpretation("adhd.substance-overlap.v2", 95, ["attention-organisation", "substance-overlap"], "ADHD-like difficulties appear alongside substance effects or substance use as a coping strategy.", "Both areas need separate assessment because intoxication, withdrawal and coping patterns can affect attention, sleep and impulse control."),
];

function phaseCDefinition(
  key: PhaseCKey,
  title: string,
  subtitle: string,
  estimatedMinutes: number,
  sections: AssessmentSection[],
  instrument: ValidatedInstrumentDefinition,
  domains: DomainRule[],
  safetyRules: SafetyRule[],
  interpretations: InterpretationRule[],
): AssessmentDefinition {
  return {
    key,
    version: 2,
    definitionHash: "",
    status: "active",
    effectiveDate: "2026-08-30",
    engineVersion: "phase-c-v2",
    title,
    subtitle,
    estimatedMinutes,
    eligibility: ADULT_ONLY,
    sections,
    scoring: {
      kind: "irn-descriptive-profile",
      profileLabel: "IRN mental-health context profile",
      explanation: "IRN contextual domains are interpreted separately and never alter the validated questionnaire score.",
    },
    instrument,
    domainRules: domains,
    safetyRules,
    interpretationRules: interpretations,
    pathwayRules: PATHWAYS.filter((pathway) => !pathway.assessmentKeys || pathway.assessmentKeys.includes(key)),
    clinicalApproval: PHASE_C_CLINICAL_APPROVAL,
  };
}

const phqItemNineRule: SafetyRule = {
  id: "phq9.item9.positive.v2",
  version: 2,
  action: "clinical-review-recommended",
  all: [{ questionId: "phq9-9", oneOf: ["several-days", "more-than-half", "nearly-every-day"] }],
  evidenceQuestionIds: ["phq9-9"],
  contentId: "phq9-item9-review",
  pathwayIds: ["gp-review", "samaritans"],
  suppressCommercialCtas: true,
  approval: PHASE_C_CLINICAL_APPROVAL,
};

export const phaseCMentalHealthDefinitionsV2: AssessmentDefinition[] = [
  phaseCDefinition(
    "anxiety",
    "Adult Anxiety Assessment",
    "An anonymous adult GAD-7 screening result with separate IRN context, independent safety guidance and appropriate next-step pathways. It cannot diagnose an anxiety disorder.",
    7,
    anxietySections(),
    GAD_7_INSTRUMENT,
    anxietyDomains,
    sharedMentalHealthSafetyRules("anxiety"),
    anxietyInterpretations,
  ),
  phaseCDefinition(
    "depression",
    "Adult Depression Assessment",
    "An anonymous adult PHQ-9 screening result with separate IRN context, independent self-harm safety guidance and appropriate next-step pathways. It cannot diagnose depression.",
    8,
    depressionSections(),
    PHQ_9_INSTRUMENT,
    depressionDomains,
    [...sharedMentalHealthSafetyRules("depression"), phqItemNineRule],
    depressionInterpretations,
  ),
  phaseCDefinition(
    "adhd",
    "Adult ADHD and Impulsivity Assessment",
    "An anonymous adult ASRS-v1.1 six-question screening result with separate developmental, functional, differential and safety context. A screening result cannot diagnose ADHD.",
    9,
    adhdSections(),
    ASRS_INSTRUMENT,
    adhdDomains,
    sharedMentalHealthSafetyRules("adhd"),
    adhdInterpretations,
  ),
];

export const phaseCInstrumentPermissionDecision = {
  gad7: "Pfizer states that the PHQ screeners, including GAD-7, may be reproduced without formal permission when the published terms are followed.",
  phq9: "Pfizer states that PHQ-9 may be reproduced without formal permission when the published terms are followed.",
  asrs: "Harvard's National Comorbidity Survey states that the ASRS-v1.1 six-question screener is available without formal permission when the required citation, copyright notice, response options, scoring and shaded thresholds are retained.",
};

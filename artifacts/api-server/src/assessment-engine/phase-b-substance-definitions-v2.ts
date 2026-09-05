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
} from "./contracts.ts";

const PHASE_B_CLINICAL_APPROVAL: ClinicalApprovalMetadata = {
  status: "approved",
  reference: "IRN-ASSESSMENT-FINAL-CLINICAL-CORRECTION-2026-08-30",
  approvedBy: "Craig Bilton, Clinical Director",
  approvedAt: "2026-08-30",
  notes: "Clinical architecture, wording, mappings, actions and pathways approved following the final correction pass. This is not legal, privacy, medical-device, regulatory or instrument-licensing approval.",
};

const INSTRUMENT_PERMISSION_DECISION = {
  audit: "WHO AUDIT reproduction in a commercial/company-sponsored service requires written permission. No permission was supplied, so the active v2 definition does not reproduce or claim AUDIT.",
  assist: "WHO ASSIST is all-rights-reserved, intended for health-care administration, and commercial reproduction permission was not supplied. The active v2 definition is therefore an IRN descriptive profile, not ASSIST or ASSIST-like.",
};

function option(value: string, label: string, score = 0): AssessmentOption {
  return { value, label, score };
}

function radio(
  id: string,
  text: string,
  options: AssessmentOption[],
  extra: Partial<AssessmentQuestion> = {},
): AssessmentQuestion {
  return { id, text, type: "radio", required: true, options, ...extra };
}

function checkbox(
  id: string,
  text: string,
  options: AssessmentOption[],
  extra: Partial<AssessmentQuestion> = {},
): AssessmentQuestion {
  return { id, text, type: "checkbox", required: true, options, ...extra };
}

function yesNo(id: string, text: string, extra: Partial<AssessmentQuestion> = {}): AssessmentQuestion {
  return radio(id, text, [option("no", "No"), option("yes", "Yes", 3)], extra);
}

const FREQUENCY = [
  option("never", "Never"),
  option("monthly-or-less", "Monthly or less", 1),
  option("two-four-month", "Two to four times a month", 2),
  option("two-three-week", "Two to three times a week", 3),
  option("four-plus-week", "Four or more times a week", 4),
];

const SYMPTOM_FREQUENCY = [
  option("never", "Never"),
  option("less-than-monthly", "Less than monthly", 1),
  option("monthly", "Monthly", 2),
  option("weekly", "Weekly", 3),
  option("daily-or-almost-daily", "Daily or almost daily", 4),
];

const PREGNANCY_OPTIONS = [
  option("no", "No"),
  option("yes", "Yes", 3),
  option("possible", "Possibly or unsure", 2),
  option("not-applicable", "Not applicable"),
  option("prefer-not-to-say", "Prefer not to say"),
];

function mentalHealthQuestion(): AssessmentQuestion {
  return radio("mental-health", "Are low mood, self-harm or suicidal thoughts part of your current situation?", [
    option("no", "No"),
    option("yes-mood", "Low mood or emotional difficulty, without current self-harm or suicidal thoughts", 2),
    option("yes-self-harm", "Current or recurring thoughts of self-harm or suicide", 4),
  ]);
}

function alcoholSections(mode: "use" | "detox"): AssessmentSection[] {
  return [
    {
      id: "alcohol-consumption",
      title: "Alcohol pattern",
      description: "These questions describe alcohol exposure. They form part of an IRN profile and are not presented as AUDIT.",
      questions: [
        radio("alcohol-frequency", "How often do you drink alcohol?", FREQUENCY),
        radio("alcohol-quantity", "On a typical drinking day, approximately how many drinks do you have?", [
          option("one-two", "One or two"),
          option("three-four", "Three or four", 1),
          option("five-six", "Five or six", 2),
          option("seven-nine", "Seven to nine", 3),
          option("ten-plus", "Ten or more", 4),
        ]),
        radio("alcohol-heavy-occasion", "How often do you have six or more drinks on one occasion?", SYMPTOM_FREQUENCY),
      ],
    },
    {
      id: "alcohol-control-impact",
      title: "Control, dependence indicators and impact",
      questions: [
        radio("alcohol-impaired-control", "How often in the past year have you found it difficult to stop drinking once you had started?", SYMPTOM_FREQUENCY),
        radio("alcohol-responsibility-impact", "How often in the past year has drinking affected responsibilities or activities that mattered to you?", SYMPTOM_FREQUENCY),
        radio("alcohol-morning-relief", "How often in the past year have you had a drink in the morning to relieve discomfort or get going after drinking?", SYMPTOM_FREQUENCY),
        radio("alcohol-tolerance", "Have you needed more alcohol than before to get the same effect?", [
          option("no", "No"),
          option("possibly", "Possibly or occasionally", 2),
          option("yes", "Yes", 4),
        ]),
        radio("alcohol-consequences", "Has alcohol contributed to physical, emotional, relationship, work, financial or legal consequences?", [
          option("no", "No"),
          option("past", "Yes, but not in the past year", 1),
          option("current", "Yes, in the past year", 4),
        ]),
        radio("alcohol-concern", "Has anyone expressed concern about your drinking or suggested that you cut down?", [
          option("no", "No"),
          option("past", "Yes, but not in the past year", 1),
          option("current", "Yes, in the past year", 3),
        ]),
        radio("alcohol-attempts", "Have you tried to cut down or stop and found it difficult to maintain the change?", [
          option("no", "No"),
          option("not-tried", "I have not tried", 1),
          option("some-difficulty", "Yes, with some difficulty", 2),
          option("repeated-difficulty", "Yes, repeatedly", 4),
        ]),
      ],
    },
    {
      id: "alcohol-withdrawal-safety",
      title: "Withdrawal and safety",
      description: mode === "detox"
        ? "These answers help determine what level of professional assessment should happen before changing alcohol use. They do not medically clear detoxification."
        : "Withdrawal and safety are assessed independently from the alcohol-use profile.",
      questions: [
        radio("alcohol-current-withdrawal", "Are you currently experiencing symptoms after reducing, stopping or delaying alcohol?", [
          option("none", "No current symptoms"),
          option("mild", "Mild symptoms such as sweating, tremor, nausea, anxiety or poor sleep", 2),
          option("moderate", "Marked tremor, repeated vomiting, pronounced agitation or symptoms that are difficult to manage", 4),
          option("severe", "Severe or rapidly worsening symptoms such as pronounced shaking, repeated vomiting or agitation, without a current seizure, marked confusion or severe hallucinations", 6),
        ]),
        radio("alcohol-current-acute", "Are you currently having any of these acute symptoms?", [
          option("none", "None of these"),
          option("seizure", "A seizure or convulsion", 8),
          option("confusion", "Marked confusion or disorientation", 8),
          option("hallucinations", "Severe hallucinations or seeing/hearing things that are not there", 8),
        ]),
        radio("alcohol-previous-withdrawal", "Have you previously experienced alcohol withdrawal symptoms?", [
          option("no", "No"),
          option("mild", "Yes, mild symptoms", 2),
          option("significant", "Yes, significant symptoms", 4),
        ]),
        yesNo("alcohol-prior-seizure", "Have you ever had a seizure or convulsion during alcohol withdrawal?"),
        yesNo("alcohol-prior-hallucination-confusion", "Have you ever had hallucinations, marked confusion or delirium during alcohol withdrawal?"),
        radio("alcohol-previous-detox", "Have you previously had a planned alcohol detoxification?", [
          option("no", "No"),
          option("uncomplicated", "Yes, without a known serious complication", 1),
          option("complicated", "Yes, with a seizure, delirium, hospital transfer or another serious complication", 5),
        ]),
        radio("alcohol-intended-change", "Are you planning a substantial reduction or stopping alcohol soon?", [
          option("no", "No immediate change planned"),
          option("supported", "Yes, with professional support already arranged", 1),
          option("abrupt", "Yes, I plan to stop or reduce sharply without an assessment", 4),
          option("unsure", "I am unsure how to change safely", 2),
        ]),
        checkbox("alcohol-co-use", "Which other substances or sedating medicines are currently relevant? Select all that apply, or leave blank if none.", [
          option("benzodiazepines", "Benzodiazepines or sleeping tablets", 3),
          option("ghb-gbl", "GHB or GBL", 4),
          option("opioids", "Opioids", 3),
          option("other-sedatives", "Other sedating medicines or substances", 2),
          option("other", "Another substance", 1),
        ], { required: false }),
      ],
    },
    {
      id: "alcohol-context",
      title: "Health, support and next-step context",
      questions: [
        yesNo("medical-vulnerability", "Do you have a significant current medical condition, take important prescribed medication, or feel medically unwell?"),
        radio("pregnancy", "Are you currently pregnant or could you be pregnant?", PREGNANCY_OPTIONS),
        radio("support", "Is a trusted person available to support you if you decide to make a change?", [
          option("yes", "Yes"),
          option("limited", "Possibly, but support is limited", 1),
          option("no", "No", 2),
        ]),
        radio("readiness", "How do you currently feel about making a change?", [
          option("not-ready", "I am not ready at the moment"),
          option("considering", "I am considering it", 1),
          option("ready", "I am ready to take a next step", 1),
          option("already-changing", "I have already started making changes", 1),
        ]),
        mentalHealthQuestion(),
      ],
    },
  ];
}

const SUBSTANCES = [
  option("alcohol", "Alcohol"),
  option("benzodiazepines", "Benzodiazepines or sleeping tablets"),
  option("opioids", "Opioids, including heroin or prescribed opioids"),
  option("ghb-gbl", "GHB or GBL"),
  option("stimulants", "Cocaine, crack cocaine, amphetamines or other stimulants"),
  option("cannabis", "Cannabis"),
  option("ketamine", "Ketamine"),
  option("other", "Another substance"),
];

function selectedSubstance(value: string) {
  return { all: [{ questionId: "substances", includes: value }] };
}

function substanceBranchSections(): AssessmentSection[] {
  return [
    {
      id: "substance-alcohol",
      title: "Alcohol-specific questions",
      displayWhen: selectedSubstance("alcohol"),
      questions: [
        radio("substance-alcohol-frequency", "How often are you currently drinking alcohol?", FREQUENCY),
        radio("substance-alcohol-morning-relief", "Do you drink in the morning or to relieve discomfort after reducing or delaying alcohol?", [option("no", "No"), option("sometimes", "Sometimes", 2), option("frequently", "Frequently", 4)]),
        radio("substance-alcohol-withdrawal", "Are you currently experiencing alcohol-withdrawal symptoms?", [option("none", "No"), option("mild", "Mild symptoms", 2), option("significant", "Significant symptoms", 4), option("severe", "Severe or rapidly worsening symptoms without a current seizure, marked confusion or severe hallucinations", 6)]),
        radio("substance-alcohol-current-acute", "Are you currently having a seizure, marked confusion or severe hallucinations?", [option("none", "None of these"), option("seizure", "A seizure or convulsion", 8), option("confusion", "Marked confusion", 8), option("hallucinations", "Severe hallucinations", 8)]),
        yesNo("substance-alcohol-prior-seizure", "Have you previously had a seizure during alcohol withdrawal?"),
        yesNo("substance-alcohol-prior-confusion", "Have you previously had hallucinations, marked confusion or delirium during alcohol withdrawal?"),
      ],
    },
    {
      id: "substance-benzodiazepines",
      title: "Benzodiazepine-specific questions",
      displayWhen: selectedSubstance("benzodiazepines"),
      questions: [
        radio("substance-benz-frequency", "How often are you currently using benzodiazepines or sleeping tablets?", [option("occasional", "Occasionally"), option("several-week", "Several days a week", 2), option("daily", "Daily", 4), option("multiple-daily", "More than once daily", 5)]),
        radio("substance-benz-duration", "Approximately how long has this pattern continued?", [option("under-two-weeks", "Under two weeks"), option("two-eight-weeks", "Two to eight weeks", 1), option("two-six-months", "Two to six months", 2), option("over-six-months", "More than six months", 3)]),
        radio("substance-benz-abrupt", "Are you planning to stop or reduce benzodiazepines abruptly?", [option("no", "No"), option("unsure", "Unsure", 2), option("yes", "Yes", 4)]),
        radio("substance-benz-withdrawal", "Are you currently experiencing symptoms after reducing, stopping or delaying a dose?", [option("none", "No"), option("mild", "Mild anxiety, poor sleep or physical discomfort", 2), option("significant", "Marked agitation, tremor, confusion or other significant symptoms", 4), option("severe", "A seizure or another severe acute symptom", 8)]),
        yesNo("substance-benz-prior-seizure", "Have you previously had a seizure or serious complication during benzodiazepine withdrawal?"),
        checkbox("substance-benz-co-use", "Which other depressant substances are currently relevant? Select all that apply, or leave blank if none.", [option("alcohol", "Alcohol", 3), option("opioids", "Opioids", 4), option("other-sedatives", "Other sedatives", 3)], { required: false }),
      ],
    },
    {
      id: "substance-opioids",
      title: "Opioid-specific questions",
      displayWhen: selectedSubstance("opioids"),
      questions: [
        radio("substance-opioid-type", "Which opioid category is most relevant?", [option("heroin", "Heroin or illicit opioids", 2), option("prescribed", "Prescribed opioid pain medication", 1), option("non-prescribed", "Prescription opioids used outside the prescription", 2), option("synthetic", "A synthetic or unknown opioid", 3), option("unsure", "Unsure", 2)]),
        radio("substance-opioid-frequency", "How often are you currently using opioids?", [option("less-weekly", "Less than weekly"), option("weekly", "Weekly", 1), option("most-days", "Most days", 3), option("daily", "Daily or more often", 4)]),
        checkbox("substance-opioid-route", "Which routes are currently relevant? Select all that apply.", [option("oral", "Swallowed"), option("smoked", "Smoked", 1), option("snorted", "Snorted", 1), option("injected", "Injected", 3), option("other", "Other", 1)]),
        yesNo("substance-opioid-recent-abstinence", "Have you recently had a period of abstinence or substantially reduced use?"),
        radio("substance-opioid-reduced-tolerance", "Could your opioid tolerance be lower than it was previously?", [option("no", "No"), option("unsure", "Unsure", 2), option("yes", "Yes", 4)]),
        yesNo("substance-opioid-overdose-history", "Have you ever experienced an opioid overdose?"),
        radio("substance-opioid-overdose-now", "Is anyone currently unresponsive, difficult to wake, breathing abnormally, or showing blue or grey lips?", [option("no", "No"), option("unresponsive", "Yes, unresponsive or difficult to wake", 8), option("breathing", "Yes, breathing is slow, irregular or stopped", 8), option("colour", "Yes, lips or skin look blue or grey", 8)]),
        checkbox("substance-opioid-co-use", "Which other substances are currently used with opioids? Select all that apply, or leave blank if none.", [option("alcohol", "Alcohol", 3), option("benzodiazepines", "Benzodiazepines", 4), option("other-sedatives", "Other sedatives", 3), option("stimulants", "Stimulants", 2)], { required: false }),
      ],
    },
    {
      id: "substance-ghb-gbl",
      title: "GHB or GBL-specific questions",
      displayWhen: selectedSubstance("ghb-gbl"),
      questions: [
        radio("substance-ghb-frequency", "How often are you currently using GHB or GBL?", [option("less-weekly", "Less than weekly"), option("weekly", "Weekly", 1), option("most-days", "Most days", 3), option("daily", "Daily", 4), option("multiple-daily", "Multiple times daily", 6)]),
        radio("substance-ghb-last-use", "When was your last use?", [option("under-six-hours", "Within the past six hours", 3), option("six-twelve-hours", "Six to twelve hours ago", 2), option("twelve-twenty-four", "Twelve to twenty-four hours ago", 1), option("over-day", "More than a day ago")]),
        yesNo("substance-ghb-dependence", "Do you use GHB or GBL to prevent withdrawal symptoms or feel unable to extend the time between doses?"),
        radio("substance-ghb-intended-change", "Are you planning to stop or substantially reduce GHB or GBL soon?", [option("no", "No immediate change planned"), option("supported", "Yes, with specialist or medical support already arranged", 1), option("abrupt", "Yes, I plan to stop or reduce sharply without an assessment", 4), option("unsure", "I am unsure how to change safely", 2)]),
        radio("substance-ghb-withdrawal", "Are you currently experiencing symptoms after reducing or delaying GHB or GBL?", [option("none", "No"), option("mild", "Mild anxiety, tremor or poor sleep", 2), option("significant", "Marked agitation, confusion or hallucinations", 5), option("severe", "A seizure, severe confusion or another acute severe symptom", 8)]),
        checkbox("substance-ghb-co-use", "Which other substances are currently relevant? Select all that apply, or leave blank if none.", [option("alcohol", "Alcohol", 3), option("benzodiazepines", "Benzodiazepines", 3), option("opioids", "Opioids", 4), option("other", "Other substances", 1)], { required: false }),
      ],
    },
    {
      id: "substance-stimulants",
      title: "Cocaine or stimulant-specific questions",
      displayWhen: selectedSubstance("stimulants"),
      questions: [
        radio("substance-stimulant-frequency", "How often are you currently using cocaine or other stimulants?", [option("less-weekly", "Less than weekly"), option("weekly", "Weekly", 1), option("several-week", "Several days a week", 3), option("daily-binge", "Daily or in sustained binges", 5)]),
        radio("substance-stimulant-acute", "Are you currently experiencing any of these symptoms?", [option("none", "None of these"), option("chest-pain", "Chest pain, collapse or severe breathing difficulty", 8), option("severe-agitation", "Severe agitation or aggression, rapidly worsening hallucinations with unsafe behaviour, sudden marked confusion, or immediate danger", 7), option("psychosis", "Paranoia, hallucinations or loss of contact with reality, without immediate danger or unsafe behaviour", 7)]),
        radio("substance-stimulant-sleep", "How much sleep have you had recently?", [option("usual", "My usual amount"), option("reduced", "Reduced sleep", 1), option("very-little", "Very little sleep for more than one night", 4), option("none-two-days", "Almost no sleep for two days or more", 6)]),
        yesNo("substance-stimulant-mental-health", "Has stimulant use caused significant anxiety, low mood, paranoia, agitation or other psychological effects?"),
      ],
    },
    {
      id: "substance-cannabis",
      title: "Cannabis-specific questions",
      displayWhen: selectedSubstance("cannabis"),
      questions: [
        radio("substance-cannabis-frequency", "How often are you currently using cannabis?", [option("less-weekly", "Less than weekly"), option("weekly", "Weekly", 1), option("most-days", "Most days", 3), option("daily", "Daily or more often", 4)]),
        yesNo("substance-cannabis-control", "Do you find it difficult to limit or stop cannabis once you intend to?"),
        yesNo("substance-cannabis-impact", "Is cannabis having a meaningful effect on work, education, relationships, finances or daily functioning?"),
        yesNo("substance-cannabis-withdrawal", "Do you experience irritability, sleep difficulty, anxiety or other symptoms when you stop or reduce cannabis?"),
        radio("substance-cannabis-psychological", "Has cannabis contributed to anxiety, paranoia, low mood or other psychological difficulty?", [option("no", "No"), option("mild", "Mild or occasional", 1), option("significant", "Significant or recurring", 4)]),
      ],
    },
    {
      id: "substance-ketamine",
      title: "Ketamine-specific questions",
      displayWhen: selectedSubstance("ketamine"),
      questions: [
        radio("substance-ketamine-frequency", "How often are you currently using ketamine?", [option("less-weekly", "Less than weekly"), option("weekly", "Weekly", 1), option("several-week", "Several days a week", 3), option("daily", "Daily or more often", 5)]),
        yesNo("substance-ketamine-control", "Do you find it difficult to limit or stop ketamine once you intend to?"),
        radio("substance-ketamine-urinary", "Are you experiencing urinary or bladder symptoms?", [option("none", "No"), option("mild", "Mild urgency or discomfort", 2), option("significant", "Pain, marked urgency, blood in urine or significant symptoms", 6)]),
        yesNo("substance-ketamine-impact", "Is ketamine having a meaningful effect on daily functioning, relationships, work, education or finances?"),
        yesNo("substance-ketamine-mental-health", "Has ketamine contributed to significant low mood, anxiety, dissociation or other psychological effects?"),
      ],
    },
    {
      id: "substance-other",
      title: "Other substance context",
      displayWhen: selectedSubstance("other"),
      questions: [
        { id: "substance-other-name", text: "Which other substance is relevant?", type: "text", required: true },
        radio("substance-other-current-symptoms", "Are you currently experiencing significant or rapidly worsening symptoms?", [option("no", "No"), option("mild", "Mild symptoms", 1), option("significant", "Significant symptoms", 4), option("severe", "Severe or rapidly worsening symptoms", 7)]),
      ],
    },
  ];
}

function substanceDefinitionSections(mode: "drug-use" | "detox"): AssessmentSection[] {
  return [
    {
      id: "substance-selection",
      title: "Substances and intended change",
      description: "Select every substance that is currently relevant. Follow-up questions will appear only for the selected substance contexts.",
      questions: [
        checkbox("substances", "Which substances are currently relevant to you? Select all that apply.", SUBSTANCES),
        ...(mode === "detox" ? [
          radio("intended-change", "What change are you considering?", [option("none", "No immediate change"), option("gradual-supported", "A gradual change with support", 1), option("abrupt", "Stopping or reducing sharply", 4), option("unsure", "Unsure how to change safely", 2)]),
        ] : []),
      ],
    },
    ...substanceBranchSections(),
    ...(mode === "drug-use" ? [{
      id: "substance-needs",
      title: "Control, consequences and support needs",
      questions: [
        radio("drug-control", "Across the substances selected, how difficult is it to limit or stop when you intend to?", [option("not-difficult", "Not difficult"), option("sometimes", "Sometimes difficult", 2), option("often", "Often difficult", 3), option("unable", "I feel unable to control it", 5)]),
        radio("drug-consequences", "Have substance use consequences continued despite concern or attempts to change?", [option("no", "No"), option("past", "In the past, but not currently", 1), option("some", "Some current consequences", 3), option("significant", "Significant current consequences", 5)]),
        radio("drug-attempts", "Have you tried to reduce or stop and found it difficult to maintain the change?", [option("no", "No"), option("not-tried", "I have not tried", 1), option("some-difficulty", "Yes, with some difficulty", 2), option("repeated-difficulty", "Yes, repeatedly", 4)]),
      ],
    } satisfies AssessmentSection] : []),
    {
      id: "substance-context",
      title: "Health, support and next steps",
      questions: [
        yesNo("medical-vulnerability", "Do you have a significant current medical condition, take important prescribed medication, or feel medically unwell?"),
        radio("pregnancy", "Are you currently pregnant or could you be pregnant?", PREGNANCY_OPTIONS),
        radio("support", "Is a trusted person available to support you if you decide to make a change?", [option("yes", "Yes"), option("limited", "Possibly, but support is limited", 1), option("no", "No", 2)]),
        radio("readiness", "How do you currently feel about a next step?", [option("not-ready", "Not ready at the moment"), option("considering", "Considering it", 1), option("ready", "Ready to seek support", 1), option("already-changing", "Already making changes", 1)]),
        mentalHealthQuestion(),
      ],
    },
  ];
}

function safetyRule(rule: Omit<SafetyRule, "version" | "approval">): SafetyRule {
  return { ...rule, version: 2, approval: PHASE_B_CLINICAL_APPROVAL };
}

function sharedMentalHealthRules(key: AssessmentKey): SafetyRule[] {
  return [
    safetyRule({ id: `mental-health.significant.${key}.v2`, action: "urgent-same-day-assessment", all: [{ questionId: "mental-health", equals: "yes-self-harm" }], evidenceQuestionIds: ["mental-health"], contentId: "mental-health-urgent", pathwayIds: ["urgent-mental-health", "samaritans"], suppressCommercialCtas: true }),
    safetyRule({ id: `mental-health.mood.${key}.v2`, action: "additional-caution", all: [{ questionId: "mental-health", equals: "yes-mood" }], evidenceQuestionIds: ["mental-health"], contentId: "mental-health-support", pathwayIds: ["gp-review"], suppressCommercialCtas: false }),
  ];
}

function alcoholSafetyRules(key: "alcohol-use" | "alcohol-detox"): SafetyRule[] {
  return [
    ...sharedMentalHealthRules(key),
    safetyRule({ id: `alcohol.current-emergency.${key}.v2`, action: "emergency-help-now", all: [{ questionId: "alcohol-current-acute", oneOf: ["seizure", "confusion", "hallucinations"] }], evidenceQuestionIds: ["alcohol-current-acute"], contentId: "alcohol-withdrawal-emergency", pathwayIds: ["emergency-999"], suppressCommercialCtas: true }),
    safetyRule({ id: `alcohol.current-severe.${key}.v2`, action: "urgent-same-day-assessment", all: [{ questionId: "alcohol-current-withdrawal", equals: "severe" }], evidenceQuestionIds: ["alcohol-current-withdrawal"], contentId: "alcohol-withdrawal-urgent", pathwayIds: ["urgent-medical"], suppressCommercialCtas: true }),
    safetyRule({ id: `alcohol.current-moderate.${key}.v2`, action: "urgent-same-day-assessment", all: [{ questionId: "alcohol-current-withdrawal", equals: "moderate" }], evidenceQuestionIds: ["alcohol-current-withdrawal"], contentId: "alcohol-withdrawal-urgent", pathwayIds: ["urgent-medical", "detox-clinical-review"], suppressCommercialCtas: false }),
    safetyRule({ id: `alcohol.current-mild.${key}.v2`, action: "clinical-review-recommended", all: [{ questionId: "alcohol-current-withdrawal", equals: "mild" }], evidenceQuestionIds: ["alcohol-current-withdrawal"], contentId: "alcohol-withdrawal-review", pathwayIds: ["detox-clinical-review"], suppressCommercialCtas: false }),
    safetyRule({ id: `alcohol.prior-seizure.${key}.v2`, action: "clinical-review-recommended", all: [{ questionId: "alcohol-prior-seizure", equals: "yes" }], evidenceQuestionIds: ["alcohol-prior-seizure"], contentId: "alcohol-withdrawal-review", pathwayIds: ["detox-clinical-review"], suppressCommercialCtas: false }),
    safetyRule({ id: `alcohol.prior-seizure-abrupt.${key}.v2`, action: "urgent-same-day-assessment", all: [{ questionId: "alcohol-prior-seizure", equals: "yes" }, { questionId: "alcohol-intended-change", equals: "abrupt" }], evidenceQuestionIds: ["alcohol-prior-seizure", "alcohol-intended-change"], contentId: "alcohol-withdrawal-urgent", pathwayIds: ["urgent-medical", "detox-clinical-review"], suppressCommercialCtas: false }),
    safetyRule({ id: `alcohol.prior-confusion.${key}.v2`, action: "clinical-review-recommended", all: [{ questionId: "alcohol-prior-hallucination-confusion", equals: "yes" }], evidenceQuestionIds: ["alcohol-prior-hallucination-confusion"], contentId: "alcohol-withdrawal-review", pathwayIds: ["detox-clinical-review"], suppressCommercialCtas: false }),
    safetyRule({ id: `alcohol.prior-confusion-abrupt.${key}.v2`, action: "urgent-same-day-assessment", all: [{ questionId: "alcohol-prior-hallucination-confusion", equals: "yes" }, { questionId: "alcohol-intended-change", equals: "abrupt" }], evidenceQuestionIds: ["alcohol-prior-hallucination-confusion", "alcohol-intended-change"], contentId: "alcohol-withdrawal-urgent", pathwayIds: ["urgent-medical"], suppressCommercialCtas: true }),
    safetyRule({ id: `alcohol.complicated-detox.${key}.v2`, action: "clinical-review-recommended", all: [{ questionId: "alcohol-previous-detox", equals: "complicated" }], evidenceQuestionIds: ["alcohol-previous-detox"], contentId: "alcohol-withdrawal-review", pathwayIds: ["detox-clinical-review"], suppressCommercialCtas: false }),
    safetyRule({ id: `alcohol.morning-relief.${key}.v2`, action: "clinical-review-recommended", all: [{ questionId: "alcohol-morning-relief", oneOf: ["weekly", "daily-or-almost-daily"] }], evidenceQuestionIds: ["alcohol-morning-relief"], contentId: "alcohol-withdrawal-review", pathwayIds: ["detox-clinical-review"], suppressCommercialCtas: false }),
    safetyRule({ id: `alcohol.abrupt-with-dependence.${key}.v2`, action: "urgent-same-day-assessment", all: [{ questionId: "alcohol-intended-change", equals: "abrupt" }], any: [{ questionId: "alcohol-tolerance", equals: "yes" }, { questionId: "alcohol-morning-relief", oneOf: ["weekly", "daily-or-almost-daily"] }, { questionId: "alcohol-previous-withdrawal", equals: "significant" }, { questionId: "alcohol-previous-detox", equals: "complicated" }, { questionId: "alcohol-prior-seizure", equals: "yes" }, { questionId: "alcohol-prior-hallucination-confusion", equals: "yes" }], evidenceQuestionIds: ["alcohol-intended-change", "alcohol-tolerance", "alcohol-morning-relief", "alcohol-previous-withdrawal", "alcohol-previous-detox", "alcohol-prior-seizure", "alcohol-prior-hallucination-confusion"], contentId: "alcohol-withdrawal-urgent", pathwayIds: ["urgent-medical"], suppressCommercialCtas: true }),
    safetyRule({ id: `alcohol.benzodiazepine-couse.${key}.v2`, action: "clinical-review-recommended", all: [{ questionId: "alcohol-co-use", includes: "benzodiazepines" }], evidenceQuestionIds: ["alcohol-co-use"], contentId: "benzodiazepine-withdrawal-review", pathwayIds: ["detox-clinical-review"], suppressCommercialCtas: false }),
    safetyRule({ id: `alcohol.ghb-couse.${key}.v2`, action: "clinical-review-recommended", all: [{ questionId: "alcohol-co-use", includes: "ghb-gbl" }], evidenceQuestionIds: ["alcohol-co-use"], contentId: "ghb-gbl-withdrawal-review", pathwayIds: ["detox-clinical-review"], suppressCommercialCtas: false }),
    safetyRule({ id: `alcohol.opioid-couse.${key}.v2`, action: "clinical-review-recommended", all: [{ questionId: "alcohol-co-use", includes: "opioids" }], evidenceQuestionIds: ["alcohol-co-use"], contentId: "opioid-overdose-caution", pathwayIds: ["nhs-substance-service", "gp-review"], suppressCommercialCtas: true }),
    safetyRule({ id: `pregnancy.${key}.v2`, action: "clinical-review-recommended", all: [{ questionId: "pregnancy", oneOf: ["yes", "possible"] }], evidenceQuestionIds: ["pregnancy"], contentId: "pregnancy-substance-review", pathwayIds: ["pregnancy-specialist", "gp-review", "nhs-substance-service"], suppressCommercialCtas: false }),
    safetyRule({ id: `medical-vulnerability.${key}.v2`, action: "clinical-review-recommended", all: [{ questionId: "medical-vulnerability", equals: "yes" }], evidenceQuestionIds: ["medical-vulnerability"], contentId: "medical-vulnerability-review", pathwayIds: ["gp-review"], suppressCommercialCtas: false }),
  ];
}

function substanceSafetyRules(key: "drug-use" | "detox-suitability"): SafetyRule[] {
  return [
    ...sharedMentalHealthRules(key),
    safetyRule({ id: `alcohol.current-emergency.${key}.v2`, action: "emergency-help-now", all: [{ questionId: "substance-alcohol-current-acute", oneOf: ["seizure", "confusion", "hallucinations"] }], evidenceQuestionIds: ["substance-alcohol-current-acute", "substances"], contentId: "alcohol-withdrawal-emergency", pathwayIds: ["emergency-999"], suppressCommercialCtas: true }),
    safetyRule({ id: `alcohol.current-severe.${key}.v2`, action: "urgent-same-day-assessment", all: [{ questionId: "substance-alcohol-withdrawal", equals: "severe" }], evidenceQuestionIds: ["substance-alcohol-withdrawal", "substances"], contentId: "alcohol-withdrawal-urgent", pathwayIds: ["urgent-medical"], suppressCommercialCtas: true }),
    safetyRule({ id: `alcohol.current-significant.${key}.v2`, action: "urgent-same-day-assessment", all: [{ questionId: "substance-alcohol-withdrawal", equals: "significant" }], evidenceQuestionIds: ["substance-alcohol-withdrawal", "substances"], contentId: "alcohol-withdrawal-urgent", pathwayIds: ["urgent-medical", "detox-clinical-review"], suppressCommercialCtas: false }),
    safetyRule({ id: `alcohol.current-mild.${key}.v2`, action: "clinical-review-recommended", all: [{ questionId: "substance-alcohol-withdrawal", equals: "mild" }], evidenceQuestionIds: ["substance-alcohol-withdrawal", "substances"], contentId: "alcohol-withdrawal-review", pathwayIds: ["detox-clinical-review"], suppressCommercialCtas: false }),
    safetyRule({ id: `alcohol.prior-seizure.${key}.v2`, action: "clinical-review-recommended", all: [{ questionId: "substance-alcohol-prior-seizure", equals: "yes" }], evidenceQuestionIds: ["substance-alcohol-prior-seizure", "substances"], contentId: "alcohol-withdrawal-review", pathwayIds: ["detox-clinical-review"], suppressCommercialCtas: false }),
    safetyRule({ id: `alcohol.prior-confusion.${key}.v2`, action: "clinical-review-recommended", all: [{ questionId: "substance-alcohol-prior-confusion", equals: "yes" }], evidenceQuestionIds: ["substance-alcohol-prior-confusion", "substances"], contentId: "alcohol-withdrawal-review", pathwayIds: ["detox-clinical-review"], suppressCommercialCtas: false }),
    safetyRule({ id: `alcohol.morning-relief.${key}.v2`, action: "clinical-review-recommended", all: [{ questionId: "substance-alcohol-morning-relief", oneOf: ["sometimes", "frequently"] }], evidenceQuestionIds: ["substance-alcohol-morning-relief", "substances"], contentId: "alcohol-withdrawal-review", pathwayIds: ["detox-clinical-review"], suppressCommercialCtas: false }),
    ...(key === "detox-suitability" ? [
      safetyRule({ id: `alcohol.prior-seizure-abrupt.${key}.v2`, action: "urgent-same-day-assessment", all: [{ questionId: "substance-alcohol-prior-seizure", equals: "yes" }, { questionId: "intended-change", equals: "abrupt" }], evidenceQuestionIds: ["substance-alcohol-prior-seizure", "intended-change"], contentId: "alcohol-withdrawal-urgent", pathwayIds: ["urgent-medical", "detox-clinical-review"], suppressCommercialCtas: false }),
      safetyRule({ id: `alcohol.prior-confusion-abrupt.${key}.v2`, action: "urgent-same-day-assessment", all: [{ questionId: "substance-alcohol-prior-confusion", equals: "yes" }, { questionId: "intended-change", equals: "abrupt" }], evidenceQuestionIds: ["substance-alcohol-prior-confusion", "intended-change"], contentId: "alcohol-withdrawal-urgent", pathwayIds: ["urgent-medical", "detox-clinical-review"], suppressCommercialCtas: false }),
      safetyRule({ id: `benzodiazepine.global-abrupt.${key}.v2`, action: "urgent-same-day-assessment", all: [{ questionId: "intended-change", equals: "abrupt" }, { questionId: "substance-benz-frequency", oneOf: ["several-week", "daily", "multiple-daily"] }], evidenceQuestionIds: ["intended-change", "substance-benz-frequency"], contentId: "benzodiazepine-withdrawal-urgent", pathwayIds: ["urgent-medical"], suppressCommercialCtas: true }),
      safetyRule({ id: `ghb.global-abrupt.${key}.v2`, action: "urgent-same-day-assessment", all: [{ questionId: "intended-change", equals: "abrupt" }, { questionId: "substance-ghb-frequency", oneOf: ["most-days", "daily", "multiple-daily"] }], evidenceQuestionIds: ["intended-change", "substance-ghb-frequency"], contentId: "ghb-gbl-withdrawal-urgent", pathwayIds: ["urgent-medical"], suppressCommercialCtas: true }),
    ] : []),
    safetyRule({ id: `benzodiazepine.current-severe.${key}.v2`, action: "emergency-help-now", all: [{ questionId: "substance-benz-withdrawal", equals: "severe" }], evidenceQuestionIds: ["substance-benz-withdrawal", "substances"], contentId: "benzodiazepine-withdrawal-emergency", pathwayIds: ["emergency-999"], suppressCommercialCtas: true }),
    safetyRule({ id: `benzodiazepine.current-significant.${key}.v2`, action: "urgent-same-day-assessment", all: [{ questionId: "substance-benz-withdrawal", equals: "significant" }], evidenceQuestionIds: ["substance-benz-withdrawal", "substances"], contentId: "benzodiazepine-withdrawal-urgent", pathwayIds: ["urgent-medical", "detox-clinical-review"], suppressCommercialCtas: false }),
    safetyRule({ id: `benzodiazepine.current-mild.${key}.v2`, action: "clinical-review-recommended", all: [{ questionId: "substance-benz-withdrawal", equals: "mild" }], evidenceQuestionIds: ["substance-benz-withdrawal", "substances"], contentId: "benzodiazepine-withdrawal-review", pathwayIds: ["detox-clinical-review"], suppressCommercialCtas: false }),
    safetyRule({ id: `benzodiazepine.abrupt.${key}.v2`, action: "urgent-same-day-assessment", all: [{ questionId: "substance-benz-abrupt", equals: "yes" }, { questionId: "substance-benz-frequency", oneOf: ["several-week", "daily", "multiple-daily"] }], evidenceQuestionIds: ["substance-benz-abrupt", "substance-benz-frequency"], contentId: "benzodiazepine-withdrawal-urgent", pathwayIds: ["urgent-medical"], suppressCommercialCtas: true }),
    safetyRule({ id: `benzodiazepine.prior-seizure.${key}.v2`, action: "clinical-review-recommended", all: [{ questionId: "substance-benz-prior-seizure", equals: "yes" }], evidenceQuestionIds: ["substance-benz-prior-seizure"], contentId: "benzodiazepine-withdrawal-review", pathwayIds: ["detox-clinical-review"], suppressCommercialCtas: false }),
    safetyRule({ id: `ghb.current-severe.${key}.v2`, action: "emergency-help-now", all: [{ questionId: "substance-ghb-withdrawal", equals: "severe" }], evidenceQuestionIds: ["substance-ghb-withdrawal", "substances"], contentId: "ghb-gbl-withdrawal-emergency", pathwayIds: ["emergency-999"], suppressCommercialCtas: true }),
    safetyRule({ id: `ghb.current-significant.${key}.v2`, action: "urgent-same-day-assessment", all: [{ questionId: "substance-ghb-withdrawal", equals: "significant" }], evidenceQuestionIds: ["substance-ghb-withdrawal", "substances"], contentId: "ghb-gbl-withdrawal-urgent", pathwayIds: ["urgent-medical", "detox-clinical-review"], suppressCommercialCtas: false }),
    safetyRule({ id: `ghb.current-mild.${key}.v2`, action: "clinical-review-recommended", all: [{ questionId: "substance-ghb-withdrawal", equals: "mild" }], evidenceQuestionIds: ["substance-ghb-withdrawal", "substances"], contentId: "ghb-gbl-withdrawal-review", pathwayIds: ["detox-clinical-review"], suppressCommercialCtas: false }),
    safetyRule({ id: `ghb.frequent.${key}.v2`, action: "clinical-review-recommended", all: [{ questionId: "substance-ghb-frequency", oneOf: ["daily", "multiple-daily"] }], evidenceQuestionIds: ["substance-ghb-frequency", "substances"], contentId: "ghb-gbl-withdrawal-review", pathwayIds: ["detox-clinical-review"], suppressCommercialCtas: false }),
    safetyRule({ id: `ghb.frequent-imminent.${key}.v2`, action: "urgent-same-day-assessment", all: [{ questionId: "substance-ghb-frequency", oneOf: ["daily", "multiple-daily"] }, { questionId: "substance-ghb-intended-change", equals: "abrupt" }], evidenceQuestionIds: ["substance-ghb-frequency", "substance-ghb-intended-change", "substances"], contentId: "ghb-gbl-withdrawal-urgent", pathwayIds: ["urgent-medical"], suppressCommercialCtas: true }),
    safetyRule({ id: `ghb.dependence.${key}.v2`, action: "clinical-review-recommended", all: [{ questionId: "substance-ghb-dependence", equals: "yes" }], evidenceQuestionIds: ["substance-ghb-dependence", "substances"], contentId: "ghb-gbl-withdrawal-review", pathwayIds: ["detox-clinical-review"], suppressCommercialCtas: false }),
    safetyRule({ id: `opioid.overdose-current.${key}.v2`, action: "emergency-help-now", all: [{ questionId: "substance-opioid-overdose-now", oneOf: ["unresponsive", "breathing", "colour"] }], evidenceQuestionIds: ["substance-opioid-overdose-now", "substances"], contentId: "opioid-overdose-emergency", pathwayIds: ["emergency-999"], suppressCommercialCtas: true }),
    safetyRule({ id: `opioid.daily-harm-reduction.${key}.v2`, action: "no-immediate-warning-identified", all: [{ questionId: "substance-opioid-frequency", equals: "daily" }], evidenceQuestionIds: ["substance-opioid-frequency", "substances"], contentId: "opioid-harm-reduction", pathwayIds: ["nhs-substance-service"], suppressCommercialCtas: false }),
    safetyRule({ id: `opioid.reduced-tolerance.${key}.v2`, action: "clinical-review-recommended", all: [{ questionId: "substance-opioid-reduced-tolerance", oneOf: ["yes", "unsure"] }], evidenceQuestionIds: ["substance-opioid-reduced-tolerance", "substances"], contentId: "opioid-tolerance-review", pathwayIds: ["nhs-substance-service"], suppressCommercialCtas: false }),
    safetyRule({ id: `opioid.recent-abstinence.${key}.v2`, action: "clinical-review-recommended", all: [{ questionId: "substance-opioid-recent-abstinence", equals: "yes" }], evidenceQuestionIds: ["substance-opioid-recent-abstinence", "substances"], contentId: "opioid-tolerance-review", pathwayIds: ["nhs-substance-service"], suppressCommercialCtas: false }),
    safetyRule({ id: `opioid.overdose-history.${key}.v2`, action: "clinical-review-recommended", all: [{ questionId: "substance-opioid-overdose-history", equals: "yes" }], evidenceQuestionIds: ["substance-opioid-overdose-history", "substances"], contentId: "opioid-overdose-caution", pathwayIds: ["nhs-substance-service"], suppressCommercialCtas: false }),
    safetyRule({ id: `opioid.sedative-couse.${key}.v2`, action: "clinical-review-recommended", all: [{ questionId: "substance-opioid-co-use", oneOf: ["alcohol", "benzodiazepines", "other-sedatives"] }], evidenceQuestionIds: ["substance-opioid-co-use", "substances"], contentId: "opioid-overdose-caution", pathwayIds: ["nhs-substance-service", "gp-review"], suppressCommercialCtas: true }),
    safetyRule({ id: `opioid.benzodiazepine-selection.${key}.v2`, action: "clinical-review-recommended", all: [{ questionId: "substances", includes: "opioids" }, { questionId: "substances", includes: "benzodiazepines" }], evidenceQuestionIds: ["substances"], contentId: "opioid-overdose-caution", pathwayIds: ["nhs-substance-service", "gp-review"], suppressCommercialCtas: true }),
    safetyRule({ id: `stimulant.chest-pain.${key}.v2`, action: "emergency-help-now", all: [{ questionId: "substance-stimulant-acute", equals: "chest-pain" }], evidenceQuestionIds: ["substance-stimulant-acute", "substances"], contentId: "stimulant-emergency", pathwayIds: ["emergency-999"], suppressCommercialCtas: true }),
    safetyRule({ id: `stimulant.immediate-danger.${key}.v2`, action: "emergency-help-now", all: [{ questionId: "substance-stimulant-acute", equals: "severe-agitation" }], evidenceQuestionIds: ["substance-stimulant-acute", "substances"], contentId: "stimulant-emergency", pathwayIds: ["emergency-999"], suppressCommercialCtas: true }),
    safetyRule({ id: `stimulant.psychosis.${key}.v2`, action: "urgent-same-day-assessment", all: [{ questionId: "substance-stimulant-acute", equals: "psychosis" }], evidenceQuestionIds: ["substance-stimulant-acute", "substances"], contentId: "stimulant-urgent", pathwayIds: ["urgent-medical", "urgent-mental-health"], suppressCommercialCtas: true }),
    safetyRule({ id: `stimulant.sleep-mental-health.${key}.v2`, action: "clinical-review-recommended", any: [{ questionId: "substance-stimulant-sleep", oneOf: ["very-little", "none-two-days"] }, { questionId: "substance-stimulant-mental-health", equals: "yes" }], evidenceQuestionIds: ["substance-stimulant-sleep", "substance-stimulant-mental-health"], contentId: "stimulant-mental-health-review", pathwayIds: ["gp-review", "nhs-substance-service"], suppressCommercialCtas: false }),
    safetyRule({ id: `ketamine.urinary.${key}.v2`, action: "clinical-review-recommended", all: [{ questionId: "substance-ketamine-urinary", oneOf: ["mild", "significant"] }], evidenceQuestionIds: ["substance-ketamine-urinary", "substances"], contentId: "ketamine-urinary-review", pathwayIds: ["gp-review"], suppressCommercialCtas: false }),
    safetyRule({ id: `cannabis.psychological.${key}.v2`, action: "additional-caution", all: [{ questionId: "substance-cannabis-psychological", equals: "significant" }], evidenceQuestionIds: ["substance-cannabis-psychological", "substances"], contentId: "cannabis-support-review", pathwayIds: ["gp-review", "nhs-substance-service"], suppressCommercialCtas: false }),
    safetyRule({ id: `polysubstance.${key}.v2`, action: "clinical-review-recommended", all: [{ questionId: "substances", minimumSelections: 2 }], evidenceQuestionIds: ["substances"], contentId: "polysubstance-review", pathwayIds: ["nhs-substance-service"], suppressCommercialCtas: false }),
    safetyRule({ id: `pregnancy.${key}.v2`, action: "clinical-review-recommended", all: [{ questionId: "pregnancy", oneOf: ["yes", "possible"] }], evidenceQuestionIds: ["pregnancy"], contentId: "pregnancy-substance-review", pathwayIds: ["pregnancy-specialist", "gp-review", "nhs-substance-service"], suppressCommercialCtas: false }),
    safetyRule({ id: `medical-vulnerability.${key}.v2`, action: "clinical-review-recommended", all: [{ questionId: "medical-vulnerability", equals: "yes" }], evidenceQuestionIds: ["medical-vulnerability"], contentId: "medical-vulnerability-review", pathwayIds: ["gp-review"], suppressCommercialCtas: false }),
    safetyRule({ id: `other.current-severe.${key}.v2`, action: "urgent-same-day-assessment", all: [{ questionId: "substance-other-current-symptoms", equals: "severe" }], evidenceQuestionIds: ["substance-other-current-symptoms", "substance-other-name"], contentId: "withdrawal-urgent", pathwayIds: ["urgent-medical"], suppressCommercialCtas: false }),
    safetyRule({ id: `other.current-significant.${key}.v2`, action: "urgent-same-day-assessment", all: [{ questionId: "substance-other-current-symptoms", equals: "significant" }], evidenceQuestionIds: ["substance-other-current-symptoms", "substance-other-name"], contentId: "withdrawal-urgent", pathwayIds: ["urgent-medical"], suppressCommercialCtas: false }),
    safetyRule({ id: `other.current-mild.${key}.v2`, action: "clinical-review-recommended", all: [{ questionId: "substance-other-current-symptoms", equals: "mild" }], evidenceQuestionIds: ["substance-other-current-symptoms", "substance-other-name"], contentId: "withdrawal-review", pathwayIds: ["gp-review", "nhs-substance-service"], suppressCommercialCtas: false }),
  ];
}

const PATHWAYS: PathwayDefinition[] = [
  { id: "emergency-999", category: "emergency", label: "Call 999 or go to A&E", description: "Use emergency services now for an acute medical emergency or immediate danger.", destination: "tel:999", commercial: false },
  { id: "samaritans", category: "nhs-specialist", label: "Call Samaritans on 116 123", description: "Confidential emotional support is available at any time.", destination: "tel:116123", commercial: false },
  { id: "urgent-mental-health", category: "urgent-medical", label: "Seek urgent mental-health support today", description: "Contact your GP, NHS 111 or an appropriate local crisis service today.", destination: "tel:111", commercial: false },
  { id: "urgent-medical", category: "urgent-medical", label: "Seek urgent medical advice today", description: "Contact NHS 111, your GP or an appropriate urgent medical service today.", destination: "tel:111", commercial: false },
  { id: "gp-review", category: "gp", label: "Speak with your GP or a qualified clinician", description: "A professional can review medical, mental-health and medication factors that an online assessment cannot establish.", destination: "https://www.nhs.uk/service-search/find-a-gp", commercial: false },
  { id: "nhs-substance-service", category: "nhs-specialist", label: "Contact a local drug and alcohol service", description: "Local NHS or commissioned services can provide confidential substance-specific assessment and support.", destination: "https://www.nhs.uk/live-well/addiction-support/drug-addiction-getting-help/", commercial: false },
  { id: "pregnancy-specialist", category: "nhs-specialist", label: "Contact your GP, midwife or maternity service", description: "Seek prompt, non-judgemental medical and maternity advice, with specialist substance support where appropriate.", destination: "https://www.nhs.uk/pregnancy/finding-out/your-nhs-pregnancy-journey/", commercial: false },
  { id: "detox-clinical-review", category: "detox-provider", label: "Arrange a substance-specific clinical assessment", description: "A medically informed assessment can determine whether withdrawal support or supervision may be required.", destination: "/get-help", commercial: true },
  { id: "self-guided", category: "self-guided", label: "Review practical information and monitor the pattern", description: "Use reliable information and seek professional help if symptoms, impact or safety concerns increase.", destination: "/resources", commercial: false },
  { id: "irn-consultation", category: "irn-consultation", label: "Discuss appropriate options with IRN", description: "IRN can help with treatment navigation and support options. IRN is not an emergency medical service.", destination: "/get-help", commercial: true },
  { id: "irn-online-programme", category: "irn-online-programme", label: "Explore structured online recovery support", description: "IRN can discuss whether structured online support is appropriate for your needs.", destination: "/online-programme", commercial: true },
  { id: "treatment-placement", category: "residential-placement", label: "Discuss treatment-placement options", description: "Where more intensive support may be appropriate, IRN can help explore UK and international treatment options.", destination: "/treatment-placement", commercial: true },
];

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
): InterpretationRule {
  return { id, priority, domainIds, minimumState: "elevated", statement, whyItMatters, approval: PHASE_B_CLINICAL_APPROVAL };
}

const SUBSTANCE_EXPOSURE_IDS = [
  "substance-alcohol-frequency", "substance-benz-frequency", "substance-benz-duration",
  "substance-opioid-frequency", "substance-opioid-route", "substance-ghb-frequency",
  "substance-ghb-last-use", "substance-stimulant-frequency", "substance-cannabis-frequency",
  "substance-ketamine-frequency",
];

const SUBSTANCE_SAFETY_IDS = [
  "substance-alcohol-withdrawal", "substance-alcohol-current-acute", "substance-alcohol-prior-seizure",
  "substance-alcohol-prior-confusion", "substance-benz-withdrawal", "substance-benz-prior-seizure",
  "substance-ghb-withdrawal", "substance-opioid-overdose-now", "substance-stimulant-acute",
  "substance-other-current-symptoms",
];

function definitionBase(
  key: AssessmentKey,
  title: string,
  subtitle: string,
  sections: AssessmentSection[],
  domainRules: DomainRule[],
  safetyRules: SafetyRule[],
  interpretationRules: InterpretationRule[],
  profileLabel: string,
): AssessmentDefinition {
  return {
    key,
    version: 2,
    definitionHash: "",
    status: "active",
    effectiveDate: "2026-08-30",
    engineVersion: "phase-b-v2",
    title,
    subtitle,
    estimatedMinutes: key === "detox-suitability" ? 10 : 8,
    sections,
    scoring: {
      kind: "irn-descriptive-profile",
      profileLabel,
      explanation: "This is an IRN-developed descriptive needs profile. It has no combined total, is not a diagnosis, and is separate from the safety guidance.",
    },
    instrument: null,
    domainRules,
    safetyRules,
    interpretationRules,
    pathwayRules: PATHWAYS,
    clinicalApproval: {
      ...PHASE_B_CLINICAL_APPROVAL,
      notes: `${PHASE_B_CLINICAL_APPROVAL.notes} ${key.startsWith("alcohol") ? INSTRUMENT_PERMISSION_DECISION.audit : INSTRUMENT_PERMISSION_DECISION.assist}`,
    },
  };
}

const alcoholUseDomains = [
  domain("consumption", "Alcohol exposure", ["alcohol-frequency", "alcohol-quantity", "alcohol-heavy-occasion"], "Alcohol exposure is a prominent part of the pattern.", "Frequency and quantity are best understood alongside control, impact and withdrawal indicators."),
  domain("impaired-control", "Impaired control", ["alcohol-impaired-control", "alcohol-attempts"], "Difficulty controlling alcohol or maintaining change stands out.", "Impaired control can be more informative than frequency alone."),
  domain("dependence-indicators", "Dependence indicators", ["alcohol-morning-relief", "alcohol-tolerance", "alcohol-previous-withdrawal"], "Tolerance, relief drinking or withdrawal history stands out.", "These indicators require separate withdrawal assessment and are not established by a total score."),
  domain("consequences", "Consequences", ["alcohol-responsibility-impact", "alcohol-consequences", "alcohol-concern"], "Alcohol-related consequences or concern are prominent.", "Continued difficulty despite consequences can support seeking structured help."),
  domain("withdrawal", "Withdrawal safety", ["alcohol-current-withdrawal", "alcohol-current-acute", "alcohol-prior-seizure", "alcohol-prior-hallucination-confusion", "alcohol-previous-detox"], "Withdrawal history or current symptoms require particular attention.", "A single complication can change safety advice independently of the wider profile."),
  domain("co-use", "Other substances", ["alcohol-co-use"], "Other sedating substances are relevant to the pattern.", "Co-use can change overdose and withdrawal considerations."),
  domain("readiness-support", "Readiness and support", ["support", "readiness"], "Available support or readiness may affect the practical next step.", "Support helps planning but cannot override a medical safety concern."),
];

const alcoholInterpretations = [
  interpretation("alcohol.control-dependence.v2", 100, ["impaired-control", "dependence-indicators"], "The more significant pattern is the combination of difficulty controlling alcohol with tolerance, relief drinking or withdrawal indicators.", "This combination supports a fuller professional assessment before deciding how to change alcohol use."),
  interpretation("alcohol.exposure-withdrawal.v2", 95, ["consumption", "withdrawal"], "Alcohol exposure appears alongside withdrawal history or current symptoms.", "Withdrawal guidance must remain separate and can outweigh an otherwise less prominent needs profile."),
  interpretation("alcohol.control-consequences.v2", 90, ["impaired-control", "consequences"], "Difficulty controlling alcohol appears alongside consequences or concern from other people.", "That interaction can indicate a more established support need than either feature alone."),
  interpretation("alcohol.couse-withdrawal.v2", 85, ["co-use", "withdrawal"], "Other sedating substances appear alongside alcohol-withdrawal considerations.", "The exact combination needs substance-specific clinical assessment rather than a combined online score."),
];

const substanceDomains = [
  domain("substance-exposure", "Substance-specific exposure", SUBSTANCE_EXPOSURE_IDS, "The selected substance-use pattern is prominent.", "The exact substance, frequency and route shape the relevant risks and support needs."),
  domain("control-consequences", "Control and consequences", ["drug-control", "drug-consequences", "drug-attempts", "substance-cannabis-control", "substance-cannabis-impact", "substance-ketamine-control", "substance-ketamine-impact"], "Control or functional consequences stand out.", "Difficulty changing despite consequences can indicate a need for more structured support."),
  domain("withdrawal-complications", "Withdrawal and complication history", SUBSTANCE_SAFETY_IDS, "Current symptoms or complication history require particular attention.", "Withdrawal syndromes differ by substance and cannot be reduced to one universal detox score."),
  domain("overdose-tolerance", "Overdose and tolerance", ["substance-opioid-recent-abstinence", "substance-opioid-reduced-tolerance", "substance-opioid-overdose-history", "substance-opioid-overdose-now", "substance-opioid-co-use"], "Overdose or reduced-tolerance factors stand out.", "Opioid overdose considerations are separate from withdrawal discomfort and need their own response."),
  domain("psychological-impact", "Psychological impact", ["substance-stimulant-mental-health", "substance-stimulant-sleep", "substance-cannabis-psychological", "substance-ketamine-mental-health", "mental-health"], "Psychological or sleep-related effects are prominent.", "Mental-health effects and self-harm needs require a response separate from substance severity."),
  domain("physical-health", "Physical-health context", ["substance-stimulant-acute", "substance-ketamine-urinary", "medical-vulnerability", "pregnancy"], "Physical-health vulnerability is relevant to the next step.", "An online profile cannot medically assess current symptoms, pregnancy or significant health conditions."),
  domain("polysubstance", "Polysubstance context", ["substances", "substance-benz-co-use", "substance-opioid-co-use", "substance-ghb-co-use"], "More than one substance or sedative combination is relevant.", "Substance combinations can materially change overdose, withdrawal and treatment-planning considerations."),
  domain("readiness-support", "Readiness and support", ["support", "readiness", "intended-change"], "Readiness, intended change or available support stands out.", "Practical support can help planning, but it does not replace substance-specific clinical assessment."),
];

const substanceInterpretations = [
  interpretation("substance.exposure-control.v2", 100, ["substance-exposure", "control-consequences"], "The more important pattern is the combination of substance exposure with difficulty controlling use or ongoing consequences.", "That interaction is more useful than a generic total and can support a substance-specific professional assessment."),
  interpretation("substance.withdrawal-health.v2", 98, ["withdrawal-complications", "physical-health"], "Withdrawal or complication indicators appear alongside physical-health vulnerability.", "The safest next step depends on the selected substance and individual medical context."),
  interpretation("substance.opioid-polysubstance.v2", 96, ["overdose-tolerance", "polysubstance"], "Overdose or reduced-tolerance factors appear alongside another substance or sedative context.", "This combination can increase overdose risk and warrants substance-specific harm-reduction and clinical advice."),
  interpretation("substance.psychological-control.v2", 92, ["psychological-impact", "control-consequences"], "Psychological effects appear alongside difficulty controlling use or functional consequences.", "Both substance-use and mental-health needs should be considered rather than treating one as merely part of a score."),
];

export const phaseBSubstanceDefinitionsV2: AssessmentDefinition[] = [
  definitionBase(
    "alcohol-use",
    "Alcohol Use and Support Needs Assessment",
    "An anonymous IRN-developed profile of alcohol patterns, impact and independent withdrawal safety. It is not AUDIT.",
    alcoholSections("use"),
    alcoholUseDomains,
    alcoholSafetyRules("alcohol-use"),
    alcoholInterpretations,
    "IRN alcohol-use needs profile",
  ),
  definitionBase(
    "alcohol-detox",
    "Alcohol Change and Withdrawal Assessment",
    "An anonymous assessment of alcohol patterns, withdrawal safety and the level of professional assessment to consider before changing alcohol use. It cannot medically clear detoxification.",
    alcoholSections("detox"),
    alcoholUseDomains.map((item) => item.id === "consumption" ? { ...item, id: "current-exposure", label: "Current alcohol exposure" } : item),
    alcoholSafetyRules("alcohol-detox"),
    alcoholInterpretations,
    "IRN alcohol and withdrawal needs profile",
  ),
  definitionBase(
    "drug-use",
    "Substance Use and Support Needs Assessment",
    "An anonymous, substance-specific IRN needs profile. It is not WHO ASSIST and does not use an ASSIST-like score.",
    substanceDefinitionSections("drug-use"),
    substanceDomains,
    substanceSafetyRules("drug-use"),
    substanceInterpretations,
    "IRN substance-use needs profile",
  ),
  definitionBase(
    "detox-suitability",
    "Substance-Specific Change and Withdrawal Assessment",
    "An anonymous, branched assessment of substance-specific withdrawal, overdose and health considerations. It does not determine whether detoxification is medically safe.",
    substanceDefinitionSections("detox"),
    substanceDomains,
    substanceSafetyRules("detox-suitability"),
    substanceInterpretations,
    "IRN substance-specific change and safety profile",
  ),
];

export const phaseBInstrumentPermissionDecision = INSTRUMENT_PERMISSION_DECISION;

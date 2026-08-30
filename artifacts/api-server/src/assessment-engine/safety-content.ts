import type { SafetyContent, SafetyContentId } from "./contracts.ts";

const CONTENT: Record<SafetyContentId, SafetyContent> = {
  "screening-limitation": {
    id: "screening-limitation",
    heading: "About your result",
    body: "Your answers haven't identified an immediate warning sign within this screening tool. This does not mean that an online assessment can rule out medical or mental-health concerns. If you're worried about your symptoms, substance use or safety, seek professional advice.",
  },
  "mental-health-support": {
    id: "mental-health-support",
    heading: "Your wellbeing deserves attention",
    body: "You reported thoughts or emotional difficulties that should not be reduced to an ordinary assessment score. Consider speaking with your GP or a qualified mental-health professional, even if the rest of your result is in a lower range.",
    emergencyText: "If you feel unable to keep yourself safe, call 999 or go to A&E. You can also call Samaritans on 116 123.",
  },
  "mental-health-current-review": {
    id: "mental-health-current-review",
    heading: "Please arrange prompt mental-health support",
    body: "You reported current passing thoughts of self-harm or suicide. This assessment cannot determine or predict risk. A qualified professional should discuss these thoughts with you promptly and help you decide what support is needed.",
    actionText: "Contact your GP, NHS 111 or an appropriate local mental-health service. You can also call Samaritans on 116 123.",
    emergencyText: "If the thoughts become more frequent, you are concerned about staying safe, or there is immediate danger, call 999 or go to A&E.",
  },
  "phq9-item9-review": {
    id: "phq9-item9-review",
    heading: "Your response to the thoughts-of-harm question needs separate attention",
    body: "You selected a response other than 'Not at all' to PHQ-9 item 9. That item is not a suicide-risk score and cannot establish intent or immediate danger. It does mean that these thoughts should be discussed directly with a qualified professional.",
    actionText: "Use the separate safety guidance in this result and contact your GP, NHS 111 or an appropriate mental-health service promptly.",
    emergencyText: "If you are concerned that you may not remain safe, call 999 or go to A&E. You can also call Samaritans on 116 123.",
  },
  "mental-health-urgent": {
    id: "mental-health-urgent",
    heading: "Please seek urgent mental-health support today",
    body: "Your answer indicates significant or recurring thoughts of self-harm or suicide. This assessment cannot determine or predict risk, but this answer needs prompt support from a qualified professional.",
    actionText: "Contact your GP, NHS 111 or an appropriate local mental-health crisis service today.",
    emergencyText: "If you feel unable to keep yourself safe, call 999 or go to A&E. You can also call Samaritans on 116 123.",
  },
  "mental-health-emergency": {
    id: "mental-health-emergency",
    heading: "Please get emergency help now",
    body: "Your answer indicates that immediate help is needed. This online assessment cannot provide emergency care.",
    actionText: "Call 999 or go to A&E now. If possible, ask someone you trust to stay with you while help is arranged.",
    emergencyText: "You can also call Samaritans on 116 123 for immediate emotional support.",
  },
  "alcohol-withdrawal-review": {
    id: "alcohol-withdrawal-review",
    heading: "Alcohol withdrawal should be assessed",
    body: "Your answers include an indicator that can be relevant to physical dependence or alcohol withdrawal. A clinician should assess this before you make a substantial change to your drinking.",
    actionText: "Do not stop or sharply reduce alcohol without first obtaining appropriate medical advice if you may be dependent.",
  },
  "alcohol-withdrawal-urgent": {
    id: "alcohol-withdrawal-urgent",
    heading: "Please seek urgent medical advice about alcohol withdrawal",
    body: "Your answers include a history or symptom associated with potentially complicated alcohol withdrawal. Abruptly stopping or sharply reducing alcohol may be unsafe when physical dependence is possible. This assessment cannot establish whether withdrawal would be safe outside medical care.",
    actionText: "Seek urgent medical advice today before stopping or sharply reducing alcohol.",
    emergencyText: "If you are currently having a seizure, marked confusion or severe hallucinations, call 999 or go to A&E.",
  },
  "alcohol-withdrawal-emergency": {
    id: "alcohol-withdrawal-emergency",
    heading: "Please get emergency medical help now",
    body: "Your answers indicate a current symptom that may be associated with a serious alcohol-withdrawal complication. This assessment cannot provide emergency care or determine the cause.",
    actionText: "Call 999 or go to A&E now. Do not attempt to manage this through an online assessment.",
  },
  "benzodiazepine-withdrawal-review": {
    id: "benzodiazepine-withdrawal-review",
    heading: "Benzodiazepine withdrawal needs medical guidance",
    body: "Your answers indicate regular benzodiazepine use or a benzodiazepine-related detox need. Abrupt changes can be unsafe and require individual medical advice.",
    actionText: "Speak with a doctor or appropriately qualified service before reducing or stopping benzodiazepines.",
  },
  "benzodiazepine-withdrawal-urgent": {
    id: "benzodiazepine-withdrawal-urgent",
    heading: "Please seek urgent medical help about benzodiazepine withdrawal",
    body: "Your answers indicate current severe symptoms or a previous serious complication in the context of benzodiazepine use. Abrupt changes can be unsafe.",
    actionText: "Seek urgent medical advice today. Call 999 or go to A&E for a current seizure, marked confusion or another acute emergency.",
  },
  "benzodiazepine-withdrawal-emergency": {
    id: "benzodiazepine-withdrawal-emergency",
    heading: "Please get emergency medical help now",
    body: "A current seizure or another severe acute symptom after reducing, stopping or delaying benzodiazepines requires emergency medical assessment.",
    actionText: "Call 999 or go to A&E now. Do not attempt to manage this through an online assessment.",
  },
  "ghb-gbl-withdrawal-review": {
    id: "ghb-gbl-withdrawal-review",
    heading: "GHB or GBL withdrawal needs specialist assessment",
    body: "Your answers identify GHB or GBL use in a context where withdrawal may require prompt specialist assessment. This screening tool cannot medically clear a detox plan.",
    actionText: "Seek advice from a doctor or specialist substance service before stopping or reducing use.",
  },
  "ghb-gbl-withdrawal-urgent": {
    id: "ghb-gbl-withdrawal-urgent",
    heading: "Please seek urgent specialist help about GHB or GBL withdrawal",
    body: "Frequent GHB or GBL use with current withdrawal symptoms can require prompt specialist medical assessment. This is not alcohol-withdrawal guidance and the assessment cannot determine a safe detox setting.",
    actionText: "Seek urgent medical advice today. Call 999 for a seizure, marked confusion, severe agitation or another acute emergency.",
  },
  "ghb-gbl-withdrawal-emergency": {
    id: "ghb-gbl-withdrawal-emergency",
    heading: "Please get emergency medical help now",
    body: "A seizure, severe confusion or another acute severe symptom after reducing or delaying GHB or GBL requires emergency medical assessment.",
    actionText: "Call 999 or go to A&E now. Do not attempt to manage this through an online assessment.",
  },
  "opioid-harm-reduction": {
    id: "opioid-harm-reduction",
    heading: "No immediate warning does not mean opioid use is safe",
    body: "Daily opioid use carries overdose risk even when this assessment has not identified an immediate warning. No immediate warning does not mean that opioid use is safe. Risk can increase after abstinence or reduced use because tolerance may fall, and alcohol, benzodiazepines or other sedatives can make overdose more likely. Ask an appropriate local service about take-home naloxone and how to use it.",
    actionText: "Contact an appropriate local drug service or clinician to discuss safer use, treatment options and obtaining naloxone where relevant.",
    emergencyText: "If someone is unresponsive, difficult to wake, breathing abnormally, or has blue or grey lips or skin, call 999 now. Give naloxone if it is available and you know how to use it.",
  },
  "opioid-overdose-caution": {
    id: "opioid-overdose-caution",
    heading: "Opioid and sedative use needs prominent overdose guidance",
    body: "Using opioids with alcohol, benzodiazepines or other sedatives can increase the risk of severe sedation, abnormal breathing and overdose. Risk also depends on dose, tolerance, recent abstinence and overdose history, which this assessment cannot resolve. Ask an appropriate local service about take-home naloxone and how to use it.",
    actionText: "Speak with a clinician or local drug service about the exact combination, safer next steps and obtaining naloxone where relevant.",
    emergencyText: "If someone is unresponsive, difficult to wake, breathing abnormally, has collapsed, or has blue or grey lips or skin, call 999 now. Give naloxone if it is available and you know how to use it.",
  },
  "opioid-overdose-emergency": {
    id: "opioid-overdose-emergency",
    heading: "Possible opioid overdose needs emergency help now",
    body: "Unresponsiveness, abnormal or slowed breathing, blue or grey lips, or inability to wake can indicate an opioid overdose.",
    actionText: "Call 999 now. Give naloxone if it is available and you know how to use it, and follow the emergency call handler's instructions.",
  },
  "opioid-tolerance-review": {
    id: "opioid-tolerance-review",
    heading: "Reduced tolerance can increase overdose risk",
    body: "After abstinence or a substantial reduction, opioid tolerance can fall. Returning to an amount that was previously tolerated can be dangerous and may cause overdose. Alcohol, benzodiazepines and other sedatives increase that risk further. Ask an appropriate local service about take-home naloxone and how to use it.",
    actionText: "Contact an appropriate clinician or local drug service to discuss safer next steps and obtaining naloxone where relevant.",
  },
  "stimulant-urgent": {
    id: "stimulant-urgent",
    heading: "Please seek urgent medical help for current stimulant-related symptoms",
    body: "Chest pain, severe agitation, severe confusion or psychotic symptoms in the context of cocaine or stimulant use require urgent assessment. This is not alcohol-style detox guidance.",
    actionText: "Call 999 for chest pain, collapse, severe breathing difficulty or immediate danger. Otherwise seek urgent medical or mental-health support today.",
  },
  "stimulant-emergency": {
    id: "stimulant-emergency",
    heading: "Please get emergency medical help now",
    body: "Chest pain, collapse, severe breathing difficulty, severe agitation or immediate danger in the context of stimulant use requires emergency help.",
    actionText: "Call 999 or go to A&E now. Do not attempt to manage this through an online assessment.",
  },
  "stimulant-mental-health-review": {
    id: "stimulant-mental-health-review",
    heading: "Stimulant-related sleep and mental-health effects need review",
    body: "Severe sleep loss, paranoia, agitation or other psychological effects can worsen quickly and need an individual professional assessment.",
    actionText: "Seek prompt medical or mental-health advice and avoid treating this as a routine detox score.",
  },
  "ketamine-urinary-review": {
    id: "ketamine-urinary-review",
    heading: "Urinary or bladder symptoms need medical review",
    body: "Pain, urgency, blood in the urine or other urinary symptoms in the context of ketamine use should be assessed by a medical professional.",
    actionText: "Contact your GP, NHS 111 or another appropriate medical service, particularly if symptoms are significant or worsening.",
  },
  "cannabis-support-review": {
    id: "cannabis-support-review",
    heading: "Cannabis-related psychological effects deserve support",
    body: "Anxiety, paranoia, low mood or functional difficulty can be important even though cannabis is not assessed through an alcohol-style medical-detox model.",
    actionText: "Consider speaking with your GP, a mental-health professional or a local drug service.",
  },
  "pregnancy-substance-review": {
    id: "pregnancy-substance-review",
    heading: "Pregnancy changes the appropriate clinical advice",
    body: "Alcohol, medication and other substance use during pregnancy needs individual, non-judgemental medical advice. An online assessment cannot determine the safest change plan.",
    actionText: "Contact your GP, midwife, maternity service or an appropriate specialist substance service promptly.",
  },
  "polysubstance-review": {
    id: "polysubstance-review",
    heading: "Using more than one substance needs clinical review",
    body: "Combining substances can change intoxication, overdose and withdrawal risks. A generic score cannot safely account for every combination.",
    actionText: "Discuss the exact substances and pattern of use with a qualified professional before attempting detoxification.",
  },
  "withdrawal-review": {
    id: "withdrawal-review",
    heading: "Withdrawal symptoms need clinical review",
    body: "Your answers include a withdrawal-related concern. The safest response depends on the substance, current symptoms, pattern of use and medical context.",
    actionText: "Seek professional advice before attempting to stop or substantially reduce use.",
  },
  "withdrawal-urgent": {
    id: "withdrawal-urgent",
    heading: "Please seek urgent medical advice about withdrawal",
    body: "Your answers include severe withdrawal symptoms or a previous serious complication. This online assessment cannot determine whether detoxification is medically safe.",
    actionText: "Seek urgent medical advice today before attempting further reduction or detoxification.",
    emergencyText: "If you are currently having a seizure, marked confusion, severe hallucinations or another acute medical emergency, call 999 or go to A&E.",
  },
  "medical-vulnerability-review": {
    id: "medical-vulnerability-review",
    heading: "Your medical context should be reviewed",
    body: "You reported a medical factor that may affect the safety or setting of detoxification. A generic online result cannot account for this safely.",
    actionText: "Discuss your medical history and current medication with a qualified clinician before attempting detoxification.",
  },
};

export function getSafetyContent(id: SafetyContentId): SafetyContent {
  return CONTENT[id];
}

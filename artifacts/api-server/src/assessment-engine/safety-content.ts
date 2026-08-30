import type { SafetyContent, SafetyContentId } from "./contracts.ts";

const CONTENT: Record<SafetyContentId, SafetyContent> = {
  "screening-limitation": {
    id: "screening-limitation",
    heading: "About this safety check",
    body: "Your answers have not identified an immediate warning sign within this screening tool. An online assessment cannot rule out medical or mental-health risk, and you should seek professional help whenever you feel concerned or unsafe.",
  },
  "mental-health-support": {
    id: "mental-health-support",
    heading: "Your wellbeing deserves attention",
    body: "You reported thoughts or emotional difficulties that should not be reduced to an ordinary assessment score. Consider speaking with your GP or a qualified mental-health professional, even if the rest of your result is in a lower range.",
    emergencyText: "If you feel unable to keep yourself safe, call 999 or go to A&E. You can also call Samaritans on 116 123.",
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
    body: "Your answers include a history or symptom associated with potentially complicated alcohol withdrawal. This assessment cannot establish whether withdrawal would be safe outside medical care.",
    actionText: "Seek urgent medical advice today before stopping or substantially reducing alcohol.",
    emergencyText: "If you are currently having a seizure, marked confusion or severe hallucinations, call 999 or go to A&E.",
  },
  "benzodiazepine-withdrawal-review": {
    id: "benzodiazepine-withdrawal-review",
    heading: "Benzodiazepine withdrawal needs medical guidance",
    body: "Your answers indicate regular benzodiazepine use or a benzodiazepine-related detox need. Abrupt changes can be unsafe and require individual medical advice.",
    actionText: "Speak with a doctor or appropriately qualified service before reducing or stopping benzodiazepines.",
  },
  "ghb-gbl-withdrawal-review": {
    id: "ghb-gbl-withdrawal-review",
    heading: "GHB or GBL withdrawal needs specialist assessment",
    body: "Your answers identify GHB or GBL use in a context where withdrawal may require prompt specialist assessment. This screening tool cannot medically clear a detox plan.",
    actionText: "Seek advice from a doctor or specialist substance service before stopping or reducing use.",
  },
  "opioid-overdose-caution": {
    id: "opioid-overdose-caution",
    heading: "Opioid safety needs individual assessment",
    body: "Opioid risk depends on the substance, dose, tolerance, recent abstinence, other sedatives and overdose history. The current screening cannot safely resolve those factors.",
    actionText: "Speak with a doctor or specialist substance service before attempting detoxification.",
    emergencyText: "If someone is unresponsive or breathing abnormally, call 999 immediately.",
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

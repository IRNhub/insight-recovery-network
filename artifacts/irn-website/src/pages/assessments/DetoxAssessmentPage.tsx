import AssessmentPage from "./AssessmentPage";
import { detoxAssessment } from "@/data/assessments/detox";

export default function DetoxAssessmentPage() {
  return (
    <AssessmentPage
      config={detoxAssessment}
      seoDescription="Take our free confidential detox suitability assessment. If you are considering stopping alcohol or substances, find out what level of medical support may be needed."
      canonical="/assessments/detox"
    />
  );
}

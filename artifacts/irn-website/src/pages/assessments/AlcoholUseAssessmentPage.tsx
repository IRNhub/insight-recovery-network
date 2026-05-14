import AssessmentPage from "./AssessmentPage";
import { alcoholUseAssessment } from "@/data/assessments/alcohol-use";

export default function AlcoholUseAssessmentPage() {
  return (
    <AssessmentPage
      config={alcoholUseAssessment}
      seoDescription="Take our free confidential alcohol use assessment. Reflect on whether drinking may be affecting your health, relationships, or daily life, and find out what support may help."
      canonical="/assessments/alcohol-use"
    />
  );
}

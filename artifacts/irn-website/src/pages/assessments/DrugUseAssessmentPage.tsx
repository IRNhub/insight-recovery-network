import AssessmentPage from "./AssessmentPage";
import { drugUseAssessment } from "@/data/assessments/drug-use";

export default function DrugUseAssessmentPage() {
  return (
    <AssessmentPage
      config={drugUseAssessment}
      seoDescription="Take our free confidential drug use and substance assessment. Reflect on whether substance use may be affecting your life and whether professional support could help."
      canonical="/assessments/drug-use"
    />
  );
}

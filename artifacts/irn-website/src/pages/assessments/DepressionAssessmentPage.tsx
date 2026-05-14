import AssessmentPage from "./AssessmentPage";
import { depressionAssessment } from "@/data/assessments/depression";

export default function DepressionAssessmentPage() {
  return (
    <AssessmentPage
      config={depressionAssessment}
      seoDescription="Take our free confidential depression self-assessment. Reflect on how low mood may be affecting your energy, motivation, and daily life, and explore what professional support may help."
      canonical="/assessments/depression"
    />
  );
}

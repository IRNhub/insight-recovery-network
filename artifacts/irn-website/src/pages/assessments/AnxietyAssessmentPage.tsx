import AssessmentPage from "./AssessmentPage";
import { anxietyAssessment } from "@/data/assessments/anxiety";

export default function AnxietyAssessmentPage() {
  return (
    <AssessmentPage
      config={anxietyAssessment}
      seoDescription="Take our free confidential anxiety self-assessment. Reflect on how anxiety may be affecting your thoughts, physical health, and daily life, and explore what support may help."
      canonical="/assessments/anxiety"
    />
  );
}

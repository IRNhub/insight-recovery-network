import AssessmentPage from "./AssessmentPage";
import { adhdAssessment } from "@/data/assessments/adhd";

export default function AdhdAssessmentPage() {
  return (
    <AssessmentPage
      config={adhdAssessment}
      seoDescription="Take our free confidential ADHD and impulsivity self-reflection. Explore whether patterns of attention, restlessness, or impulsivity may be affecting your work, relationships, or daily life."
      canonical="/assessments/adhd-impulsivity"
    />
  );
}

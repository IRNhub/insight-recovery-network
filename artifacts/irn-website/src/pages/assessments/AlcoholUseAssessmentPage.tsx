import AssessmentPage from "./AssessmentPage";

export default function AlcoholUseAssessmentPage() {
  return (
    <AssessmentPage
      assessmentKey="alcohol-use"
      title="Alcohol Use and Support Needs Assessment"
      subtitle="An anonymous IRN-developed profile of alcohol patterns, impact and independent withdrawal safety. It does not provide a diagnosis or use a combined score."
      estimatedMinutes={8}
      seoDescription="Complete an anonymous alcohol use and support-needs assessment with separate pattern, withdrawal-safety and next-step guidance."
      canonical="/assessments/alcohol-use"
    />
  );
}

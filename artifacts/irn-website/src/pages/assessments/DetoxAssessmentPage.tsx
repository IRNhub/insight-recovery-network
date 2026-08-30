import AssessmentPage from "./AssessmentPage";

export default function DetoxAssessmentPage() {
  return (
    <AssessmentPage
      assessmentKey="detox-suitability"
      title="Substance-Specific Change and Withdrawal Assessment"
      subtitle="An anonymous, branched assessment of substance-specific withdrawal, overdose and health considerations. It cannot determine whether detoxification is medically safe."
      estimatedMinutes={10}
      seoDescription="Complete an anonymous substance-specific change and withdrawal assessment to identify answers that may require professional review."
      canonical="/assessments/detox"
    />
  );
}

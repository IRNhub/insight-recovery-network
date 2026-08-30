import AssessmentPage from "./AssessmentPage";

export default function AlcoholDetoxAssessment() {
  return (
    <AssessmentPage
      assessmentKey="alcohol-detox"
      title="Alcohol & Detox Suitability Assessment"
      subtitle="This private self-assessment explores your current relationship with alcohol and highlights when professional advice may be appropriate. It cannot determine whether detox is medically safe."
      estimatedMinutes={8}
      seoDescription="Complete our confidential alcohol and detox suitability assessment. Explore relevant patterns and receive safe, server-calculated guidance about possible next steps."
      canonical="/assessments/alcohol-detox"
    />
  );
}

import AssessmentPage from "./AssessmentPage";

export default function DetoxAssessmentPage() {
  return (
    <AssessmentPage
      assessmentKey="detox-suitability"
      title="Detox Suitability Assessment"
      subtitle="If you are considering stopping or significantly reducing alcohol or other substances, this self-assessment highlights factors that may require professional or medical review. It cannot determine whether detox is medically safe."
      estimatedMinutes={10}
      seoDescription="Use this private detox-needs self-assessment to identify substance-specific answers that may require professional review. It does not provide medical clearance."
      canonical="/assessments/detox"
    />
  );
}

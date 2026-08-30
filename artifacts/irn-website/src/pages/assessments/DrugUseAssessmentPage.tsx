import AssessmentPage from "./AssessmentPage";

export default function DrugUseAssessmentPage() {
  return (
    <AssessmentPage
      assessmentKey="drug-use"
      title="Drug Use & Substance Assessment"
      subtitle="This private self-assessment helps you reflect on your relationship with substances and whether further professional guidance may be appropriate. It does not diagnose a substance-use disorder or establish withdrawal safety."
      estimatedMinutes={8}
      seoDescription="Take our free confidential drug use and substance assessment. Reflect on whether substance use may be affecting your life and whether professional support could help."
      canonical="/assessments/drug-use"
    />
  );
}

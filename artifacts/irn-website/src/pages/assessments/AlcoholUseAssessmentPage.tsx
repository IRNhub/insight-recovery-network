import AssessmentPage from "./AssessmentPage";

export default function AlcoholUseAssessmentPage() {
  return (
    <AssessmentPage
      assessmentKey="alcohol-use"
      title="Alcohol Use Assessment"
      subtitle="This assessment helps you reflect on your relationship with alcohol and understand whether it may be affecting your wellbeing, health, or daily life. There are no right or wrong answers."
      estimatedMinutes={8}
      seoDescription="Take our free confidential alcohol use assessment. Reflect on whether drinking may be affecting your health, relationships, or daily life, and find out what support may help."
      canonical="/assessments/alcohol-use"
    />
  );
}

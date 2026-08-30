import AssessmentPage from "./AssessmentPage";

export default function DepressionAssessmentPage() {
  return (
    <AssessmentPage
      assessmentKey="depression"
      title="Depression Self-Assessment"
      subtitle="This assessment helps you reflect on how low mood or depression may be affecting your daily life, energy levels, and sense of wellbeing. There are no right or wrong answers."
      estimatedMinutes={7}
      seoDescription="Take our free confidential depression self-assessment. Reflect on how low mood may be affecting your energy, motivation, and daily life, and explore what professional support may help."
      canonical="/assessments/depression"
    />
  );
}

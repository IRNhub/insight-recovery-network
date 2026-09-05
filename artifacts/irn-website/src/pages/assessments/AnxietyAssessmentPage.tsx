import AssessmentPage from "./AssessmentPage";

export default function AnxietyAssessmentPage() {
  return (
    <AssessmentPage
      assessmentKey="anxiety"
      title="Anxiety Self-Assessment"
      subtitle="This assessment helps you reflect on how anxiety may be affecting your thoughts, feelings, physical wellbeing, and daily life. There are no right or wrong answers."
      estimatedMinutes={7}
      seoDescription="Take our free confidential anxiety self-assessment. Reflect on how anxiety may be affecting your thoughts, physical health, and daily life, and explore what support may help."
      canonical="/assessments/anxiety"
    />
  );
}

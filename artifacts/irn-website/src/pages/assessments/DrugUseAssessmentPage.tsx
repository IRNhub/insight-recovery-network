import AssessmentPage from "./AssessmentPage";

export default function DrugUseAssessmentPage() {
  return (
    <AssessmentPage
      assessmentKey="drug-use"
      title="Substance Use and Support Needs Assessment"
      subtitle="An anonymous, substance-specific IRN needs profile covering use patterns, impact and relevant safety considerations. It does not diagnose a substance-use disorder or establish withdrawal safety."
      estimatedMinutes={8}
      seoDescription="Complete an anonymous substance-specific needs assessment covering patterns, impact, safety guidance and possible support pathways."
      canonical="/assessments/drug-use"
    />
  );
}

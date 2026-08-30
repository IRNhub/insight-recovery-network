import type {
  AssessmentAnswers,
  AssessmentDefinition,
  EvaluationResult,
} from "./contracts.ts";
import { buildInterpretation } from "./build-interpretation.ts";
import { evaluateDomains } from "./evaluate-domains.ts";
import { evaluateInstrument, evaluateInstrumentResult } from "./evaluate-instrument.ts";
import { evaluateSafety } from "./evaluate-safety.ts";
import { selectPathways } from "./select-pathways.ts";

export function evaluateAssessment(
  definition: AssessmentDefinition,
  answers: AssessmentAnswers,
): EvaluationResult {
  const screening = evaluateInstrument(definition, answers);
  const instrument = evaluateInstrumentResult(definition, answers);
  const domains = evaluateDomains(definition, answers);
  const safety = evaluateSafety(definition, answers);
  const interpretation = buildInterpretation(definition, answers, screening, domains);
  const pathways = selectPathways(definition, screening, safety, domains);
  return { answers, screening, instrument, domains, safety, interpretation, pathways };
}

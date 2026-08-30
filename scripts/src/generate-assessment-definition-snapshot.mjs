import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, "../..");
const definitions = [
  ["alcohol-use", "alcohol-use.ts", "alcoholUseAssessment"],
  ["alcohol-detox", "alcohol-detox.ts", "alcoholDetoxAssessment"],
  ["drug-use", "drug-use.ts", "drugUseAssessment"],
  ["detox-suitability", "detox.ts", "detoxAssessment"],
  ["anxiety", "anxiety.ts", "anxietyAssessment"],
  ["depression", "depression.ts", "depressionAssessment"],
  ["adhd", "adhd.ts", "adhdAssessment"],
];

const output = {};
for (const [key, file, exportName] of definitions) {
  const source = path.join(
    root,
    "artifacts/irn-website/src/data/assessments",
    file,
  );
  const module = await import(pathToFileURL(source));
  output[key] = module[exportName];
}

const destination = path.join(
  root,
  "artifacts/api-server/src/assessment-engine/legacy-definition-snapshot-v1.ts",
);
const source = `/*\n * Generated immutable snapshot of the seven production assessment definitions.\n * Source baseline: c774da65c9cc81d983a94d06935e3c55a2c912fa\n * Do not edit this version in place. Create a new definition version instead.\n */\n\nimport type { AssessmentKey, AssessmentSection } from \"./contracts.ts\";\n\nexport interface LegacyDefinitionSnapshot {\n  id: AssessmentKey;\n  title: string;\n  subtitle: string;\n  estimatedMinutes: number;\n  scoreThresholds: {\n    moderateConcern: number;\n    higherConcern: number;\n    possibleDetoxRisk: number;\n  };\n  sections: AssessmentSection[];\n}\n\nexport const legacyDefinitionSnapshotV1 = ${JSON.stringify(output, null, 2)} satisfies Record<AssessmentKey, LegacyDefinitionSnapshot>;\n`;

await writeFile(destination, source, "utf8");
console.log(`Wrote ${destination}`);

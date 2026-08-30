import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { materialisePhaseBClinicalFixtures } from "./phase-b-clinical-fixtures.ts";

const outputPath = resolve(
  process.cwd(),
  "docs/assessment-platform/phase-b-clinical-fixtures.json",
);

const pack = {
  title: "IRN Assessment Platform Phase B Clinical Director Fixture Pack",
  generatedAt: "2026-08-30",
  approvalStatus: "PENDING CLINICAL DIRECTOR APPROVAL",
  instrumentDecision: "No validated instrument result is included because commercial reproduction permission for WHO AUDIT and WHO ASSIST was not supplied or conclusively established.",
  fixtures: materialisePhaseBClinicalFixtures(),
};

await writeFile(outputPath, `${JSON.stringify(pack, null, 2)}\n`, "utf8");
console.log(`Generated ${pack.fixtures.length} Phase B clinical fixtures at ${outputPath}`);

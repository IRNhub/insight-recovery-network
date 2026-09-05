import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { materialisePhaseCClinicalFixtures } from "./phase-c-clinical-fixtures.ts";

const outputPath = resolve(
  process.cwd(),
  "docs/assessment-platform/phase-c-clinical-fixtures.json",
);

const pack = {
  title: "IRN Assessment Platform Phase C Clinical Director Fixture Pack",
  generatedAt: "2026-08-30",
  approvalStatus: "CLINICAL DIRECTOR APPROVED 30 AUGUST 2026",
  clinicalDirectorApprovalDate: "2026-08-30",
  fixtures: materialisePhaseCClinicalFixtures(),
};

await writeFile(outputPath, `${JSON.stringify(pack, null, 2)}\n`, "utf8");
console.log(`Generated ${pack.fixtures.length} Phase C clinical fixtures at ${outputPath}`);

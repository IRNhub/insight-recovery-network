---
name: Assessment system architecture
description: How the IRN self-assessment pipeline works end-to-end — scoring, AI brief, result display.
---

## Architecture overview

Scoring is fully deterministic (no AI involved):
- `scoreAssessment(config, answers)` → `ScoreResult` with `value`, `level`, `bandName`, `redFlags`, `advisories`
- `level` is one of: lower-concern / moderate-concern / higher-concern / possible-detox-risk / urgent-medical-advice
- `bandName` is per-assessment clinical language (PHQ-9/GAD-7/AUDIT/ASRS-aligned)

The AI (Anchor) only writes interpretation text, never determines risk levels.

## Key principle: clinical brief not Q&A transcript

`buildClinicalBrief(config, answers, scoreResult)` replaces the old `buildSectionSummary`.
- Sends domain-level analysis: section name, section score/max, only **elevated** responses (score ≥ 50% of question max, or flagged)
- Excludes contact-consent section entirely
- Phrases findings as clinical themes, not "Q: ... A: ..." pairs
- This prevents Anchor from listing answers back verbatim

**Why:** The old `buildSectionSummary` sent every Q&A pair; the AI reflected them verbatim. The clinical brief gives the AI enough context to synthesise interpretation without being a transcript to read back.

## Result display

`AssessmentResult.tsx` expects `anchorReport: AnchorReport | null`, NOT a string.
- Score card renders immediately (deterministic)
- 5 Anchor sections render with loading skeletons while API responds
- CTA click fires `POST /api/assessments/:id/cta-clicked` (non-blocking)

## Assessment page files

Two separate components do the same job (legacy structure):
- `AlcoholDetoxAssessment.tsx` — handles alcohol-detox assessment
- `AssessmentPage.tsx` — handles all other assessments (anxiety, depression, adhd, alcohol-use, drug-use)

Both must be kept in sync when changing the submission flow.

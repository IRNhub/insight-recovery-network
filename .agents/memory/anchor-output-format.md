---
name: Anchor output format
description: Anchor AI returns AnchorReport JSON (5 fields), never a plain string. Fallbacks return same shape.
---

## AnchorReport interface

```typescript
interface AnchorReport {
  whatThisMaySuggest: string;   // 2-3 sentences, clinical interpretation
  keyPatterns: string[];        // 3-5 short theme strings (2-6 words each)
  whatThisDoesNotMean: string;  // 1-2 sentences, screening tool disclaimer
  suggestedNextSteps: string;   // 2-3 sentences, proportionate to severity
  ctaText: string;              // 1 sentence, soft IRN CTA
}
```

## API response

`POST /api/assessments/submit` returns `{ id, anchorReport, createdAt }`.
Frontend stores `anchorReport` in state and passes it to `AssessmentResult`.

## Fallback

If all AI models fail OR JSON parsing fails, `getFallbackReport(scoreLevel, assessmentType)` returns a hardcoded `AnchorReport` for that level. The fallback always returns the same 5-field structure.

**Why:** Returning structured JSON (not a string) means the UI can render each section independently, show loading skeletons per section, and format patterns as chips. A string return type would require fragile parsing on the frontend.

## DB storage

`anchorResponse` (text column) stores a plain-text version of the report for email fallback. The full structured report is returned in the API response and used by the frontend — it is NOT stored as JSON in the DB (no anchorSections column).

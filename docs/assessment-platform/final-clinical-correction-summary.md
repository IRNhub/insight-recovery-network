# IRN Assessment Platform Final Clinical Correction Summary

Date: 30 August 2026

Base: Phase C commit `e2251da0c749bf7c8aab693a165de7cd4f305cd5`

Status: Clinical Director approved the corrected clinical architecture, rules, user wording and pathways on 30 August 2026. This is not legal, privacy, regulatory, medical-device, deployment or production-release approval.

This summary covers only fixtures whose user-visible result, safety action, input state, safety content or pathway changed in the correction pass. All 67 regenerated fixtures also changed from pending to the recorded Clinical Director approval status and received new definition hashes.

| Altered fixture(s) | Previous state | Corrected state | Reason |
|---|---|---|---|
| `alcohol-use-abrupt-dependence` | Clinical review; alcohol review content; commercial pathway available | Urgent same-day; alcohol urgent content; commercial CTA suppressed | Possible physical dependence plus intended abrupt cessation needs urgent medical advice before stopping or sharply reducing. |
| `alcohol-use-current-severe-withdrawal` | Vague severe answer mapped directly to emergency | Explicit non-acute severe/worsening answer maps to urgent same-day; only the separate seizure/confusion/severe-hallucination states map to emergency | Prevent a vague severity label from creating an unsupported emergency decision while preserving a specific emergency boundary. |
| `drug-benzodiazepine-regular`, `detox-benzodiazepine` | Regular/daily benzodiazepine use plus abrupt reduction remained clinical review | Urgent same-day with benzodiazepine-specific withdrawal content; commercial CTA suppressed | Abrupt reduction after regular use needs urgent medical assessment. |
| `drug-ghb-frequent` | Multiple-daily GHB/GBL use alone remained clinical review | Synthetic input now includes planned abrupt cessation and maps to urgent same-day; commercial CTA suppressed | Frequency plus imminent abrupt change is the clinically relevant urgent combination. |
| `alcohol-detox-prior-seizure`, `detox-alcohol`, `detox-ghb`, `detox-other-severe` | Urgent result could retain an ordinary commercial pathway | Urgent result contains only non-commercial urgent/clinical pathways | Remove sales pressure from all urgent same-day presentations. |
| `alcohol-use-opioids`, `alcohol-detox-polysubstance`, `drug-opioid-sedative`, `detox-polysubstance` | Clinical co-use result could retain an ordinary commercial CTA; some outputs lacked the enhanced opioid module | Enhanced opioid overdose/naloxone guidance; NHS substance and GP routes lead; commercial CTA suppressed | Sedative combinations increase overdose risk and should prioritise harm reduction and clinical routes. |
| `drug-opioid-daily` | Routine result used only generic screening-limitation wording | Routine safety action retained, with dedicated opioid harm reduction, overdose signs, sedative/tolerance cautions and naloxone advice | No immediate warning must not be mistaken for opioid safety. |
| `drug-opioid-reduced-tolerance`, `drug-opioid-prior-overdose`, `detox-opioid` | Opioid caution described overdose risk but naloxone advice was less prominent | Overdose, reduced-tolerance, sedative and naloxone advice is explicit in the safety block | Reduced tolerance and previous overdose require prominent actionable harm reduction. |
| `alcohol-use-pregnancy-dependence`, `detox-pregnancy` | Generic GP/IRN-led pathway ordering | GP/midwife/maternity and specialist substance pathways lead before any IRN option | Pregnancy needs non-judgemental maternity and medical care before commercial navigation. |
| `depression-lower-item9`, `depression-recurring-thoughts` | PHQ-9 item 9 and shared safety text appeared as two blocks | One shared clinical safety block includes the item-9 limitation; both triggering rules and evidence remain recorded | Reduce duplication without losing the PHQ-9 score contribution or safety evidence. |
| `anxiety-minimal`, `depression-minimal`, `depression-low-mood-low-impact` | Professional pathway could appear before self-guided support | Self-guided information appears first; professional support remains available | Minimal profiles need a proportionate first step rather than over-medicalisation. |
| `alcohol-use-minimal`, `alcohol-use-prominent-exposure`, `alcohol-detox-no-dependence`, `alcohol-detox-limited-support`, `drug-cannabis-consequences`, `detox-cannabis`; routine anxiety, depression and ADHD fixtures using `screening-limitation` | S0 heading could be read as broad reassurance | Heading is `About your result`; body states that the screen cannot rule out medical or mental-health concerns | Remove implied safety clearance while retaining proportionate routine guidance. |

The fixture counts remain unchanged: 41 Phase B plus 26 Phase C. Validated GAD-7, PHQ-9 and ASRS scoring, bands and context isolation are unchanged.

## Boundaries still open

- WHO AUDIT and WHO ASSIST reproduction, scoring and commercial-use permission remain unresolved; neither instrument is reproduced or claimed.
- Legal, UK GDPR/privacy, regulatory, medical-device classification, safeguarding-process and production configuration reviews remain separate release gates.
- No migration, production data operation, push, merge or deployment is part of this clinical correction record.

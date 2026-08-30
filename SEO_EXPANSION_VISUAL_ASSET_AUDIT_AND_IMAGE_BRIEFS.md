# Insight Recovery Network SEO Visual Asset Audit and Image Briefs

Audit date: 30 August 2026
Scope: Batch 1 visual remediation, Batch 2 retrospective audit, Batch 3 implementation and the visual-content gate for every future SEO expansion batch
Companion tracker: [SEO_EXPANSION_TRACKER.csv](./SEO_EXPANSION_TRACKER.csv)

## Outcome

All eight Batch 2 pages have now been audited at asset level. The pre-implementation audit found that each page needed at least one replacement asset, with deliberately proportionate requirements:

- seven pages needed a new, page-specific hero because the prior image was reused, text-heavy, visually promotional or liable to misrepresent the page;
- the general detox hub already had a page-specific concept, but its branded hero and supporting images were advertising-led and contained readable fabricated paperwork, so the set needed replacement;
- the benzodiazepine and ketamine withdrawal pages could reuse one strong, relevant IRN supporting image each;
- detox-versus-rehab and the rehab-cost page did not need additional supporting photography because their comparison and price modules carried the explanatory load;
- every page needed a dedicated 1200 × 630 Open Graph crop derived from its approved hero, with no baked-in text or logo.

The briefs below remain the production and acceptance record. A later implementation pass used user-supplied master images; no Replit AI, Replit image generation, stock sourcing or placeholder imagery was used.

## Supplied-master implementation status

Seven user-supplied hero masters passed the visual gate and were implemented as exact 1600 × 900 WebP heroes with separate 1200 × 630 WebP Open Graph crops. The implemented files are compressed to approximately 52–140 KB each, use literal ALT text, and retain the existing page layouts.

`Opioid detox.png` was not implemented because the prominent readable “Community Treatment Service / Support · Recovery · Health” sign conflicts with the no-readable-text rule and could imply a real provider. The existing generic opioid hero and OG image remain temporarily, with the unresolved status recorded in the tracker. No substitute was introduced.

The approved benzodiazepine and ketamine supporting-image reuses are implemented after their assessment sections. New supporting assets are still required for alcohol withdrawal, opioid detox and cocaine withdrawal. The general detox hub still needs replacements for its two existing branded/readable-text supporting images. Detox-versus-rehab and the rehab-cost page require no supporting photography.

The current architecture uses directly referenced static WebP assets, so WebP was retained rather than adding an unneeded picture-source abstraction solely for AVIF. Both hero and social files have fixed intrinsic dimensions, and the existing 16:9 containers reserve layout space before loading.

## Batch 1 treatment-page visual remediation

The live audit on 29 August 2026 confirmed that all six Batch 1 treatment pages rendered **zero visible on-page images**. Each page used the generic `/og-home.png` social asset, but that file was metadata only and did not satisfy the visible-content requirement. With no rendered image, there was no on-page image ALT implementation and no visible supporting image.

Potential repository reuses were reviewed visually rather than accepted by filename. The cocaine, cannabis, ketamine, benzodiazepine and dual-diagnosis candidates were rejected because they contained a visible IRN logo or graphic panel, repeated the client-and-practitioner-at-a-desk pattern, contained paperwork-led compositions, or belonged to a broader authority article. No existing asset genuinely satisfied the six-page brief, and no unrelated image was reused.

| Page | Visible hero before remediation | Visible supporting image | OG before remediation | Dedicated hero implemented | Literal ALT text | Dedicated OG | Image performance |
|---|---|---|---|---|---|---|---|
| `/alcohol-addiction-treatment` | None | None; not required because the structured comparison and service modules provide the mid-page explanatory visuals | `/og-home.png` | `/alcohol-addiction-treatment-uk-hero.webp` — an adult preparing walking shoes and a bag for a structured morning | “Adult preparing walking shoes and a bag for a structured recovery morning.” | `/alcohol-addiction-treatment-uk-og.webp` | 1600 × 900 WebP hero, 53 KB; 1200 × 630 WebP OG, 33 KB; explicit dimensions, eager loading and high fetch priority |
| `/cocaine-addiction-treatment` | None | None; not required because the structured comparison and service modules provide the mid-page explanatory visuals | `/og-home.png` | `/cocaine-addiction-treatment-uk-hero.webp` — an adult preparing for planned exercise at a community track | “Adult tying running shoes beside a wet community athletics track.” | `/cocaine-addiction-treatment-uk-og.webp` | 1600 × 900 WebP hero, 134 KB; 1200 × 630 WebP OG, 76 KB; explicit dimensions, eager loading and high fetch priority |
| `/benzodiazepine-addiction-treatment` | None | None; not required because the structured comparison and service modules provide the mid-page explanatory visuals | `/og-home.png` | `/benzodiazepine-addiction-treatment-uk-hero.webp` — side-by-side support in a community pharmacy rather than a seated desk consultation | “Adult reviewing an unlabelled appointment card with a healthcare professional in a community pharmacy.” | `/benzodiazepine-addiction-treatment-uk-og.webp` | 1600 × 900 WebP hero, 70 KB; 1200 × 630 WebP OG, 42 KB; explicit dimensions, eager loading and high fetch priority |
| `/dual-diagnosis-treatment` | None | None; not required because the structured comparison and service modules provide the mid-page explanatory visuals | `/og-home.png` | `/dual-diagnosis-treatment-uk-hero.webp` — an adult walking with two joined-up support professionals | “Adult walking with two support professionals in a community wellbeing centre courtyard.” | `/dual-diagnosis-treatment-uk-og.webp` | 1600 × 900 WebP hero, 132 KB; 1200 × 630 WebP OG, 79 KB; explicit dimensions, eager loading and high fetch priority |
| `/ketamine-addiction-treatment` | None | None; not required because the structured comparison and service modules provide the mid-page explanatory visuals | `/og-home.png` | `/ketamine-addiction-treatment-uk-hero.webp` — an adult leaving an ordinary community health centre after follow-up | “Adult leaving a community health centre after a planned medical appointment.” | `/ketamine-addiction-treatment-uk-og.webp` | 1600 × 900 WebP hero, 112 KB; 1200 × 630 WebP OG, 68 KB; explicit dimensions, eager loading and high fetch priority |
| `/cannabis-addiction-treatment` | None | None; not required because the structured comparison and service modules provide the mid-page explanatory visuals | `/og-home.png` | `/cannabis-addiction-treatment-uk-hero.webp` — an adult re-engaging with a morning routine and prepared workspace | “Adult preparing to start the day beside a made bed and home workspace.” | `/cannabis-addiction-treatment-uk-og.webp` | 1600 × 900 WebP hero, 80 KB; 1200 × 630 WebP OG, 48 KB; explicit dimensions, eager loading and high fetch priority |

All six final assets are single continuous photographs. They contain no drug imagery, readable fake text, logos, watermarks, split-screen treatment or staged distress. The complete generation prompts are retained in `BATCH_1_TREATMENT_HERO_GENERATION_PROMPTS.md`.

Production-preview QA passed at 1280 × 720 desktop and 390 × 844 mobile. Each hero rendered at the intended 16:9 ratio without horizontal overflow or console errors; the mobile layout stacked the image above the existing safety panel. Static assertions separately verify the visible hero, literal ALT text, dedicated OG asset, schema image and performance limits for every treatment route.

## Batch 2 pre-implementation asset audit

| Page | Current hero and dimensions | Dedicated hero needed? | Supporting editorial assessment | Existing IRN reuse | Existing ALT text | OG/social status | Recommended output and placement | Decision |
|---|---|---|---|---|---|---|---|---|
| `/resources/benzodiazepine-withdrawal` | Reuses `/benzodiazepine-addiction-uk-hero.webp`, 1672 × 941, 16:9; small visible IRN mark | Yes. The scene is relevant but belongs to the broader addiction pillar and is not page-specific. | One assessment/planning image materially improves the safe-taper section. | Reuse `/benzodiazepine-dependence-clinical-assessment.webp`, 1672 × 941, after the safe-planning or assessment section. It is credible, unbranded and directly relevant. | “Adult discussing a safe benzodiazepine withdrawal plan with a qualified healthcare professional.” Accurate for the current hero; replace with the new brief ALT when the hero changes. | Current 1200 × 630 OG is reused from the addiction pillar. Replace with a page-specific crop. | New 1600 × 900 hero at the article masthead; new 1200 × 630 OG crop; reuse one 16:9 supporting image in the body. | Brief required; supporting reuse approved. |
| `/resources/opioid-detox` | Reuses `/addiction-detox-uk-safe-assessment-hero.webp`, 1600 × 900, 16:9; prominent branded panel | Yes. The generic detox consultation does not depict the maintenance-versus-detox and reduced-tolerance decision. | One supporting planning image would improve comprehension and trust in a long, safety-led page. | No current IRN asset is sufficiently opioid-specific without misleading the reader. | “Adult discussing opioid detox, maintenance treatment and overdose safety with a qualified professional.” The current generic image does not visibly support all of these claims; replace with a literal ALT. | Current 1200 × 630 OG is reused from the general detox hub. Replace. | New 1600 × 900 hero at the article masthead; new 1200 × 630 OG crop; one 1600 × 900 supporting image after the maintenance-versus-detox explanation. | Hero, OG and supporting brief required. |
| `/resources/cocaine-withdrawal` | Reuses `/cocaine-addiction-signs-treatment-uk-hero.webp`, 1600 × 900, 16:9; contemplative scene with large branded panel | Yes. It depicts broad addiction/recovery rather than safe support through a crash and low mood. | One recovery-planning image would materially support the early-recovery section. | Do not reuse the current cocaine supporting images: both have prominent branding, and the planner contains readable fabricated text. | “Adult discussing cocaine withdrawal, low mood and recovery support with a practitioner.” The current hero shows a person alone and therefore does not match the ALT. | Current 1200 × 630 OG is reused from the addiction pillar. Replace. | New 1600 × 900 hero at the article masthead; new 1200 × 630 OG crop; one 1600 × 900 supporting image after the section on professional support or early recovery. | Hero, OG and supporting brief required; current ALT needs correction on replacement. |
| `/resources/ketamine-withdrawal` | Reuses `/ketamine-addiction-uk-hero.webp`, 1672 × 941, 16:9; small visible IRN mark | Yes. Broad planning is relevant but does not own the withdrawal and physical-assessment intent. | One integrated assessment image materially clarifies that physical symptoms and recovery support need separate but connected attention. | Reuse `/ketamine-uropathy-integrated-assessment.webp`, 1672 × 941, after the urinary/abdominal symptom or assessment section. It is unbranded and directly relevant. | “Adult discussing ketamine withdrawal and physical symptoms with a recovery practitioner.” Broadly accurate, but a recovery practitioner should not imply medical assessment; the new ALT removes that ambiguity. | Current 1200 × 630 OG is reused from the addiction pillar. Replace. | New 1600 × 900 hero at the article masthead; new 1200 × 630 OG crop; reuse one 16:9 supporting image in the body. | Brief required; supporting reuse approved. |
| `/resources/detox-vs-rehab` | Reuses `/addiction-detox-uk-safe-assessment-hero.webp`, 1600 × 900, 16:9; also used by the detox hub and opioid page | Yes. A comparison page needs a distinct visual that communicates two linked stages without depicting illness. | No extra supporting photography is needed. The existing comparison table and content structure explain the distinction more effectively. | No existing IRN hero clearly communicates the comparison without text overlays or duplication. | “Adult comparing withdrawal management and longer-term rehabilitation with a treatment professional.” Conceptually appropriate but not literally supported by the generic image. | Current 1200 × 630 OG is reused from the detox hub. Replace. | New 1600 × 900 hero at the article masthead and a dedicated 1200 × 630 OG crop. | Hero and OG brief required; supporting image not required. |
| `/resources/addiction-detox-uk` | Dedicated `/addiction-detox-uk-safe-assessment-hero.webp`, 1600 × 900, plus two 1600 × 900 supporting images; all use a large branded panel, and the supporting images contain readable fabricated paperwork | Yes, but lower urgency than the substance-specific pages. The concept is appropriate; the treatment is advertising-led rather than documentary. | Two supporting images still add real value: assessment first, continuing-care planning later. Replace the current branded/fake-text versions rather than remove the placements. | Do not reuse the current set in future pages. Existing placement logic and captions can remain. | Hero: “Adult having a confidential detox assessment with an addiction professional.” Supporting ALTs describe an assessment and an aftercare plan. The descriptions are sound, but should be replaced with literal ALTs matching the new photographs. | Dedicated 1200 × 630 OG exists, but it inherits the promotional treatment. Replace with the new page-specific hero crop. | New 1600 × 900 hero at the article masthead; new 1200 × 630 OG crop; two 1600 × 900 supporting images at “What a detox assessment should cover” and “Why aftercare matters”. | Full image-set brief required; page layout remains unchanged. |
| `/resources/alcohol-withdrawal-symptoms-when-you-need-medical-help` | Dedicated `/article-alcohol-withdrawal-symptoms-medical-help.png`, 1659 × 948, approximately 1.75:1; contains multiple symptom labels and a slogan | Yes. The text-heavy composite is synthetic and frames symptoms rather than calm assessment and safe planning. | One assessment image would materially improve trust and break up the long safety article. | No audited IRN image is both alcohol-specific and compliant enough to reuse here. | “Private clinical consultation representing alcohol detox assessment and withdrawal safety.” Reasonable but abstract; replace with a literal scene description. | No separate page-specific 1200 × 630 asset; the hero falls back as the social image. Create a dedicated crop. | New 1600 × 900 hero at the article masthead; new 1200 × 630 OG crop; one 1600 × 900 supporting image after the assessment/setting section. | Hero, OG and supporting brief required. |
| `/how-much-does-rehab-cost-uk` | Dedicated `/how-much-does-rehab-cost-uk-hero.webp`, 1717 × 916, approximately 1.87:1; contains prominent branding and readable illustrative prices | Yes, highest priority. Baked-in figures can become inaccurate and conflict with reviewed on-page ranges. | No supporting photography is needed; the price tables, inclusions and methodology modules are the useful visuals. | No existing IRN image is a safe replacement for the cost-decision intent. | “Insight Recovery Network private rehab cost guide for the UK.” Generic and not a literal description of the image. | The hero is also used for OG; there is no separate 1200 × 630 crop. Replace both. | New 1600 × 900 hero at the page masthead and a dedicated 1200 × 630 OG crop. | Hero and OG brief required; supporting image not required. |

## Production standard for all briefs

These requirements apply to every image below:

- premium, highly realistic editorial healthcare and recovery photography in a credible British context;
- dignified, non-stigmatising people in ordinary consultation rooms or homes, with natural anatomy and skin texture;
- calm natural or warm window light; muted navy, charcoal, cream and natural wood;
- documentary observation rather than an advert, staged campaign or dramatic reconstruction;
- no readable text, fake forms, fake interfaces, logos, watermarks, forced smiles, exaggerated distress, white coats, stethoscopes or artificial clinical environments;
- no visible illicit drugs, white powder, needles, paraphernalia, intoxication, police/criminal imagery, restraints, collapsed people, stereotypical despair or before-and-after treatment;
- withdrawal and detox imagery must centre assessment, planning, supported treatment navigation and recovery rather than extreme symptoms;
- master delivery as colour-managed WebP at 1600 × 900 (16:9), with room for responsive cropping; separate Open Graph crop at 1200 × 630 (1.91:1); body images at 1600 × 900 unless stated otherwise.

## Individual image briefs

### 1. Benzodiazepine withdrawal and detox

1. **Page URL:** `/resources/benzodiazepine-withdrawal`.
2. **Image purpose:** Dedicated hero showing careful, prescriber-led withdrawal planning; distinguish this page from the broader benzodiazepine-addiction pillar. Supply a matching OG crop. The approved existing assessment image will provide the single supporting visual.
3. **Scene description:** A calm adult and a qualified prescriber or appropriate healthcare professional reviewing a gradual, personalised medication-change plan at a table. The plan is represented through blank or fully defocused papers and a simple calendar-like layout with no legible detail.
4. **People/objects required:** Two adults; discreet notebook, pen and water; one or two unbranded medicine boxes may be present but turned away with no label or tablets visible.
5. **Composition and camera perspective:** Eye-level, medium-wide documentary frame from slightly across the table. Both people engaged with the plan; leave calm negative space for responsive crop but do not add text.
6. **Emotional tone:** Serious, collaborative and reassuring; attentive expressions, no fear, relief performance or forced smile.
7. **UK context:** Ordinary British GP, prescribing-service or independent consultation room; understated furniture and believable UK professional clothing.
8. **IRN visual palette/style:** Muted navy clothing, cream walls, charcoal accents, natural oak, warm window light, realistic texture.
9. **Crop/aspect ratio:** Hero 1600 × 900, 16:9; OG 1200 × 630, 1.91:1. Keep faces and the shared planning gesture inside the central 70% safe area. Place at the article masthead.
10. **Suggested ALT text:** “Adult reviewing a gradual benzodiazepine withdrawal plan with a qualified prescriber.”
11. **Explicit exclusions:** No dose, drug or schedule text; no loose tablets; no abrupt-stopping symbolism; no clinician-as-authority pose, white coat, stethoscope, logo, watermark, distress or dramatic symptom depiction.

Approved supporting reuse: `/benzodiazepine-dependence-clinical-assessment.webp`, after the section explaining assessment or safe planning. Suggested page-specific ALT: “Adult and healthcare professional reviewing medicine history and withdrawal safety in a quiet consultation.”

### 2. Opioid detox and withdrawal

1. **Page URL:** `/resources/opioid-detox`.
2. **Image purpose:** Hero and supporting editorial set that communicates an assessed choice between maintenance treatment and detox, followed by continuing-care planning; supply a matching OG crop.
3. **Scene description:** Hero: an adult and a qualified drug-treatment professional calmly discussing two possible care pathways using blank cards or an unlabelled diagram. Supporting image: the same adult reviewing a simple follow-up and support plan before leaving the consultation.
4. **People/objects required:** Two adults; notebook, pen, phone placed face down and water. No medication or injecting equipment is necessary.
5. **Composition and camera perspective:** Hero at eye level, medium-wide, three-quarter view of the shared table; supporting image closer on collaborative planning hands and faces, with all paper detail illegible.
6. **Emotional tone:** Grounded, careful and non-judgmental; the adult is involved in the decision rather than passive or rescued.
7. **UK context:** Credible local drug-and-alcohol service or modest British consultation room, not a hospital set; everyday clothing and furnishings.
8. **IRN visual palette/style:** Navy and charcoal clothing, cream and natural wood interior, soft overcast or window light, observational realism.
9. **Crop/aspect ratio:** Hero and supporting image 1600 × 900, 16:9; OG 1200 × 630. Keep the consultation gesture central. Hero at masthead; support after the maintenance-versus-detox section.
10. **Suggested ALT text:** Hero: “Adult comparing opioid treatment pathways with a qualified drug-treatment professional.” Supporting: “Adult and practitioner planning follow-up support after an opioid treatment assessment.”
11. **Explicit exclusions:** No heroin, pills, syringes, naloxone theatre, drug paraphernalia, staged withdrawal, intoxication, collapsed person, restraint, police, visible dose or medication advice, hospital drama, logos or readable text.

### 3. Cocaine withdrawal

1. **Page URL:** `/resources/cocaine-withdrawal`.
2. **Image purpose:** Hero and one supporting editorial image that frame the crash, low mood and cravings through calm human support and a practical early-recovery plan; supply a matching OG crop.
3. **Scene description:** Hero: an adult in a quiet daytime consultation speaking with a recovery practitioner, posture tired but engaged, with daylight suggesting a return to routine. Supporting image: the adult and practitioner arranging blank cards into a simple week or support structure.
4. **People/objects required:** Two adults; notebook, pen, water and phone face down; blank planning cards only.
5. **Composition and camera perspective:** Hero at seated eye level, medium-wide with both faces visible; supporting image at a slightly higher three-quarter angle focused on the collaborative plan while retaining human connection.
6. **Emotional tone:** Calm, candid and hopeful without cheerfulness; acknowledge fatigue and concern without despair.
7. **UK context:** Ordinary British home consultation or independent therapy room in daylight; believable, modest surroundings.
8. **IRN visual palette/style:** Charcoal and navy clothing, warm cream, natural wood, soft daylight, subtle documentary grain and natural skin detail.
9. **Crop/aspect ratio:** Hero and supporting image 1600 × 900, 16:9; OG 1200 × 630. Masthead hero; support after professional-help or early-recovery planning content.
10. **Suggested ALT text:** Hero: “Adult discussing low mood and support after stopping cocaine with a recovery practitioner.” Supporting: “Adult and practitioner building a practical plan for cravings and early recovery.”
11. **Explicit exclusions:** No cocaine, powder, rolled notes, cards implying drug use, paraphernalia, nightclub scene, staged intoxication, chest-clutching drama, suicidal imagery, forced optimism, logos, readable plans or fake interface text.

### 4. Ketamine withdrawal

1. **Page URL:** `/resources/ketamine-withdrawal`.
2. **Image purpose:** Dedicated hero that shows recovery support and appropriate medical-navigation awareness without implying that a recovery practitioner diagnoses urinary or abdominal symptoms; supply a matching OG crop.
3. **Scene description:** A young or middle-aged adult and a recovery professional calmly reviewing two connected next steps: addiction support and a separate medical appointment. Use two blank cards or two unlabelled folders as a visual cue, with no text.
4. **People/objects required:** Two adults; two blank folders or cards, notebook, water and phone face down. No medication or bodily-symptom props.
5. **Composition and camera perspective:** Eye-level, medium-wide frame; both people visible, with the two-pathway gesture between them. Avoid an examination-room composition.
6. **Emotional tone:** Attentive, practical and validating; concern is acknowledged without pain performance or alarm.
7. **UK context:** Ordinary British recovery consultation room with easy access to daylight; everyday professional and casual clothing.
8. **IRN visual palette/style:** Muted navy wall or clothing, charcoal, cream and oak, natural side light, premium editorial realism.
9. **Crop/aspect ratio:** Hero 1600 × 900, 16:9; OG 1200 × 630. Keep people and the two-pathway gesture within the central safe area. Place at the article masthead.
10. **Suggested ALT text:** “Adult planning recovery support and separate medical follow-up for ketamine-related concerns.”
11. **Explicit exclusions:** No ketamine, powder, paraphernalia, staged bladder or abdominal pain, bathroom scene, medical examination, anatomy graphics, fake test results, white coats, logos or readable text.

Approved supporting reuse: `/ketamine-uropathy-integrated-assessment.webp`, after the urinary/abdominal symptoms or assessment section. Suggested page-specific ALT: “Adult discussing ketamine use and physical-health concerns in a joined-up assessment.”

### 5. Detox versus rehab

1. **Page URL:** `/resources/detox-vs-rehab`.
2. **Image purpose:** A distinct comparison hero that communicates detox as one possible stage and rehabilitation as longer-term change, without presenting either as universally required; supply a matching OG crop.
3. **Scene description:** An adult and treatment-navigation professional at a table considering two unlabelled pathways represented by two blank folders, with one pathway leading visually to a second-stage set of support cards. The scene should feel like a choice conversation, not a flowchart.
4. **People/objects required:** Two adults; two plain folders, a small set of blank cards, notebook and water.
5. **Composition and camera perspective:** Eye-level medium-wide; balanced composition with the adult and adviser on opposite sides and the two options central. Preserve clarity when cropped wider for social.
6. **Emotional tone:** Informed, calm and neutral; no implication that one pathway is superior.
7. **UK context:** Modest British treatment-navigation or consultation setting, understated and non-clinical.
8. **IRN visual palette/style:** Navy, charcoal, cream and oak; warm window light; documentary still rather than graphic advertising.
9. **Crop/aspect ratio:** Hero 1600 × 900, 16:9; OG 1200 × 630, 1.91:1. Place at the article masthead. No body image required.
10. **Suggested ALT text:** “Adult comparing detox and longer-term rehabilitation options with a treatment adviser.”
11. **Explicit exclusions:** No split-screen before-and-after device, detox bed, staged withdrawal, rehab luxury imagery, arrows or labels, fake brochures, logos, readable text, medicine or clinical props.

### 6. Addiction detox UK hub

1. **Page URL:** `/resources/addiction-detox-uk`.
2. **Image purpose:** Replace the promotional current set with a coherent documentary sequence: confidential assessment, appropriate-setting discussion and continuing-care planning. Supply a matching OG crop from the hero.
3. **Scene description:** Hero: adult and qualified professional conducting a broad detox-suitability conversation. Supporting image one: a closer view of assessment, using blank notes and a respectful shared-table interaction. Supporting image two: the adult and practitioner agreeing a continuing-care plan before detox ends, using blank cards rather than a written diagram.
4. **People/objects required:** Two adults throughout, ideally the same pair for continuity; notebook, pen, water and blank cards. No medicine is necessary.
5. **Composition and camera perspective:** Hero at eye-level medium-wide; support one at a three-quarter angle; support two slightly wider with forward-looking body language. Maintain natural variation without looking like three frames from an advert.
6. **Emotional tone:** Safe, measured and collaborative; neither crisis nor celebration.
7. **UK context:** Credible British independent consultation room or community treatment setting; ordinary furniture and restrained professional dress.
8. **IRN visual palette/style:** Muted navy, charcoal, cream and natural wood; soft window light; honest skin texture and ordinary environment.
9. **Crop/aspect ratio:** All masters 1600 × 900, 16:9; hero OG 1200 × 630. Hero at masthead; supporting images retain existing placements after “What a detox assessment should cover” and “Why aftercare matters”.
10. **Suggested ALT text:** Hero: “Adult having a confidential detox assessment with a qualified addiction professional.” Support one: “Adult and professional reviewing health, substance use and support needs during a detox assessment.” Support two: “Adult and practitioner planning continuing recovery support before detox ends.”
11. **Explicit exclusions:** No staged withdrawal, distressed or collapsed person, bedroom monitoring, medicine, needles, drug imagery, fabricated assessment form, legible notes, brand panel, logo, clinical costume or hospital set.

### 7. Alcohol detox and withdrawal safety

1. **Page URL:** `/resources/alcohol-withdrawal-symptoms-when-you-need-medical-help`.
2. **Image purpose:** Hero and one supporting image that communicate early assessment, medical-risk awareness and a planned care setting without attempting to depict severe withdrawal; supply a matching OG crop.
3. **Scene description:** Hero: an adult in a calm consultation describing their drinking and previous withdrawal experience to a qualified healthcare professional. Supporting image: the pair considering the safest treatment setting and practical support, with plain unlabelled folders or cards.
4. **People/objects required:** Two adults; notebook, pen, water and blank folders. No alcohol containers are needed.
5. **Composition and camera perspective:** Seated eye-level, medium-wide hero with open, non-confrontational body language; supporting image closer on the shared decision, with papers out of focus.
6. **Emotional tone:** Serious, safe and compassionate; no panic, shame, shaking performance or dramatic rescue.
7. **UK context:** British GP, alcohol service or independent consultation room that feels real rather than staged; everyday clothing and muted interior.
8. **IRN visual palette/style:** Navy and charcoal clothing, cream walls, natural wood and warm side light; premium documentary photography.
9. **Crop/aspect ratio:** Hero and supporting image 1600 × 900, 16:9; OG 1200 × 630. Hero at masthead; support after the assessment or setting section.
10. **Suggested ALT text:** Hero: “Adult discussing alcohol withdrawal risk with a qualified healthcare professional.” Supporting: “Adult and healthcare professional considering a safe setting and support plan for alcohol withdrawal.”
11. **Explicit exclusions:** No alcohol bottles, drinking, shaking hands, sweat effects, seizure depiction, restraints, ambulance drama, staged confusion, medication, withdrawal checklist, logos, readable text or emergency theatre.

### 8. UK rehab costs

1. **Page URL:** `/how-much-does-rehab-cost-uk`.
2. **Image purpose:** Evergreen hero that communicates careful comparison of treatment value, inclusions and total pathway cost without embedding prices that can become inaccurate; supply a matching OG crop.
3. **Scene description:** An adult or couple and a treatment adviser calmly comparing two or three unbranded provider information folders and a blank budget page. The human decision and questions matter more than the paperwork.
4. **People/objects required:** Two or three adults; plain folders, calculator placed naturally, notebook, pen and laptop with screen turned away or fully defocused.
5. **Composition and camera perspective:** Eye-level medium-wide from the client side of the table; adviser included but not dominant. Allow the folders to suggest comparison without legible content.
6. **Emotional tone:** Thoughtful, transparent and unpressured; no sales pitch, luxury aspiration or financial alarm.
7. **UK context:** British home or independent advisory consultation room; ordinary professional clothing and familiar understated interior.
8. **IRN visual palette/style:** Muted navy, charcoal, cream and natural oak; warm window light; credible editorial realism.
9. **Crop/aspect ratio:** Hero 1600 × 900, 16:9; OG 1200 × 630, 1.91:1. Keep faces and comparison gesture within the centre. Place at page masthead. No body image required.
10. **Suggested ALT text:** “Adult comparing private rehabilitation options and likely costs with a treatment adviser.”
11. **Explicit exclusions:** No readable prices, pound-sign graphics, fake quote sheets, fake provider names, sales handshake, luxury resort imagery, cash, credit cards, distress, logo, watermark, medical props or guaranteed-savings implication.

## Automatic visual-content gate for future batches

Every new or substantially improved SEO page must complete the following before publication:

1. Inventory every current image, file path, pixel dimensions, aspect ratio, page placement, caption, ALT text and OG reference. Review the actual pixels; filenames, metadata and ALT text alone are not evidence of relevance or quality.
2. Record and validate **five independent statuses** for every page:
   - `Visible hero image`: whether a dedicated hero is required, whether it is actually rendered in the page masthead, its source path and its placement. A metadata-only image does not count.
   - `Visible supporting image(s)`: whether supporting editorial imagery is required, the number actually rendered and its content placement; record a reason when it is genuinely not required.
   - `Open Graph image`: the dedicated social asset and its live metadata URL. This status never satisfies the visible-hero or visible-supporting-image status.
   - `ALT text`: literal, page-specific ALT for every meaningful rendered image, plus an explicit decision for any intentionally decorative image.
   - `Image performance`: intrinsic width and height, encoded format, file size, loading mode, fetch priority, responsive sizing, layout-shift reservation and successful HTTP delivery.
3. Decide separately whether a dedicated hero is needed, whether supporting editorial images add comprehension or trust, and whether an existing IRN image is genuinely suitable for reuse.
4. Reject reuse where it creates topic ambiguity, duplicates a pillar hero, contains readable fabricated material, relies on a promotional brand panel, repeats an overused consultation composition or conflicts with the page’s clinical scope.
5. A page is **visually complete** only when every required visible image is implemented and verified, ALT text and performance checks pass, and the OG status is independently complete. `OG complete / visible hero missing` is an explicit failure state and must never be reported as visual completion.
6. Record `Hero image status`, `Supporting image status`, `Image brief status`, `ALT text status`, `OG image status` and `Image performance status` in the master tracker.
7. If a bespoke asset is needed, create a page-specific brief containing the 11 required fields used above. Use an approved independent Codex image-generation capability only when authorised; otherwise output the brief for external production. Never invoke Replit AI or Replit image generation, automatically source stock, or introduce a placeholder.
8. Prepare descriptive ALT text from what the final approved image literally shows. Do not use ALT to make clinical or service claims that are not visible.
9. Require a 1600 × 900 master and a dedicated 1200 × 630 social crop unless the page template documents a different need. Avoid baked-in text and keep key subjects inside both crop-safe areas.
10. Automated image assertions must inspect rendered page HTML—not only metadata—and fail when a required masthead image is absent, hidden, broken, dimensionless, missing its approved ALT, incorrectly lazy-loaded above the fold or replaced by an OG-only asset.
11. Verify desktop, 390 px mobile and social crops after implementation, including visibility, focal crop, intrinsic dimensions, ALT output, Open Graph metadata, broken-image behaviour, console output and horizontal overflow.
12. Treat incomplete asset production as a tracked dependency, not permission to use a misleading generic image. A page may retain its current asset temporarily only when the tracker records the gap and the image does not create a safety or factual risk.

The visual gate supplements clinical, editorial and technical acceptance. It does not permit a page redesign or broaden IRN’s clinical claims.

## Batch 3 implemented visual audit

The Batch 3 visual gate was completed before local commit. Five bespoke masters were generated through the built-in Codex image-generation capability and visually inspected. Replit AI, Replit Agent, Replit Assistant, Replit suggestions, Replit image generation, stock sourcing and placeholders were not used.

| Page | Visible hero | Visible supporting images | Open Graph image | Literal ALT text | Performance and delivery |
|---|---|---|---|---|---|
| `/prescription-drug-addiction-treatment` | `/prescription-drug-addiction-treatment-uk-hero.webp`, 1600 × 900 WebP, 44 KB; visible in masthead | None required. Highlights, treatment-setting comparison and process modules provide the supporting visual hierarchy. | `/prescription-drug-addiction-treatment-uk-og.webp`, 1200 × 630 WebP, 27 KB | “Adult preparing an unlabelled medicine box and notebook for a medication review at home.” | Explicit dimensions, aspect-ratio reservation, eager loading, high fetch priority, responsive sizes, dedicated ImageObject and desktop/mobile render pass. |
| `/resources/cannabis-withdrawal` | `/cannabis-withdrawal-uk-hero.webp`, 1600 × 900 WebP, 66 KB; visible below the article masthead | None required. Timeline, symptom explanation and safety guidance carry the body content. | `/cannabis-withdrawal-uk-og.webp`, 1200 × 630 WebP, 40 KB | “Adult filling a glass of water beside an open kitchen window in the early morning.” | Explicit dimensions, aspect-ratio reservation, eager loading, high fetch priority, responsive sizes, dedicated ImageObject and desktop/mobile render pass. |
| `/resources/how-quickly-can-someone-enter-rehab` | `/how-quickly-enter-private-rehab-uk-hero.webp`, 1600 × 900 WebP, 50 KB; visible below the article masthead | None required. Admission pathway, readiness checklist and provider questions carry the body explanation. | `/how-quickly-enter-private-rehab-uk-og.webp`, 1200 × 630 WebP, 32 KB | “Adult holding house keys during a phone conversation beside a front window.” | Explicit dimensions, aspect-ratio reservation, eager loading, high fetch priority, responsive sizes, dedicated ImageObject and desktop/mobile render pass. |
| `/resources/28-day-vs-90-day-rehab` | `/28-day-vs-longer-rehab-uk-hero.webp`, 1600 × 900 WebP, 58 KB; visible below the article masthead | None required. Comparison table, progress-review checklist and continuing-care pathway carry the decision. | `/28-day-vs-longer-rehab-uk-og.webp`, 1200 × 630 WebP, 37 KB | “Two adults preparing vegetables and crockery together in a communal kitchen.” | Explicit dimensions, aspect-ratio reservation, eager loading, high fetch priority, responsive sizes, dedicated ImageObject and desktop/mobile render pass. |
| `/treatment-placement` | `/treatment-placement-navigation-hero.webp`, 1600 × 900 WebP, 118 KB; visible in masthead | None required. Process, destination comparison, decision-guide directory and service modules provide the supporting structure. | `/treatment-placement-navigation-og.webp`, 1200 × 630 WebP, 67 KB | “Adult standing where two coastal footpaths divide.” | Explicit dimensions, aspect-ratio reservation, eager loading, high fetch priority, responsive sizes, dedicated ImageObject and desktop/mobile render pass. |

The previous treatment-placement courtyard asset was reviewed visually and rejected for this page because it contains fabricated readable `RESIDENTIAL TREATMENT` signage and presents a luxury facility as if it were a real provider. It remains untouched elsewhere in the repository but is no longer imported by the treatment-placement page. The replacement communicates assessment and navigation without depicting a clinic, a drug, treatment equipment or distress.

All five final masters are single continuous photographs. None contains visible drugs, pills, paraphernalia, staged intoxication, fake clinical environments, readable fabricated material, logos, watermarks, forced smiles, dramatic distress, a collage, diptych, split screen, storyboard or multiple panels.

### Batch 3 brief 1: prescription drug dependence and addiction treatment

1. **URL:** `/prescription-drug-addiction-treatment`.
2. **Image purpose and placement:** Visible masthead hero and source for a separate social crop; communicate careful review and planning without giving medicine instructions.
3. **Scene:** A calm adult at an ordinary British kitchen table in natural morning light, preparing for a medication-review conversation.
4. **People and objects:** One adult, a closed blank medicine box, plain notebook, pen, ceramic mug and phone; no visible medicine, labels or paperwork text.
5. **Composition:** Landscape editorial frame with the adult right of centre and quiet negative space; one continuous scene.
6. **Emotional tone:** Reflective, steady and dignified; no fear, shame, euphoria or crisis.
7. **UK context:** Modest British home, familiar window and kitchen materials, ordinary clothing.
8. **IRN palette and style:** Muted navy, charcoal, cream and natural wood; premium realistic British editorial photography; natural daylight.
9. **Crop and placement:** 1600 × 900 hero plus 1200 × 630 OG crop; keep the face, hands and blank box inside the central crop-safe area.
10. **ALT text:** “Adult preparing an unlabelled medicine box and notebook for a medication review at home.”
11. **Exclusions:** No pills, blister packs, syringes, dosage charts, readable labels, fake prescriptions, white coats, fake clinic, logos, watermarks, forced smile, dramatic distress or multiple scenes.

**Final production prompt:** Premium realistic British editorial recovery photograph in natural morning daylight. One middle-aged adult sits alone at a modest British kitchen table, calmly preparing for a medication-review conversation. He holds a completely blank closed white medicine box beside a plain notebook, pen, dark ceramic mug and phone. No medicine or pills are visible. Frame a wide landscape scene with the adult right of centre, quiet cream wall and natural oak surfaces, muted navy and charcoal clothing, restrained depth of field and dignified non-stigmatising mood. No readable text anywhere, no labels, no logo, no watermark, no fake prescription, no white coat, no clinical room, no visible drugs or paraphernalia, no staged distress and no forced smile. Keep the face, hands and blank box safe for both 16:9 and 1.91:1 crops. ONE single continuous photograph only. Do not create a collage, diptych, split screen, storyboard, before-and-after image, inset image or multiple panels.

Generated source: `/Users/craigbilton/.codex/generated_images/01a05177-bb41-7170-b9b7-fe535e1f9ef3/exec-8d5e25cf-27e2-43cd-90a3-3cf740335f79.png`.

### Batch 3 brief 2: cannabis withdrawal

1. **URL:** `/resources/cannabis-withdrawal`.
2. **Image purpose and placement:** Visible article hero and source for a separate social crop; represent sleep disruption, self-care and the start of a steadier routine without depicting cannabis.
3. **Scene:** One adult filling a glass of water at an open kitchen window in the early morning.
4. **People and objects:** One adult, plain glass, tap and ordinary kitchen objects without text or branding.
5. **Composition:** Landscape frame with the person and glass inside the central area, real terraced homes softly visible beyond the window.
6. **Emotional tone:** Quiet, slightly tired but composed and hopeful; no distress performance.
7. **UK context:** Modest British terrace kitchen and overcast dawn light.
8. **IRN palette and style:** Muted navy, charcoal, cream and natural wood; realistic British editorial photography.
9. **Crop and placement:** 1600 × 900 hero plus 1200 × 630 OG crop; preserve the face, hands, water and open window in both crops.
10. **ALT text:** “Adult filling a glass of water beside an open kitchen window in the early morning.”
11. **Exclusions:** No cannabis, smoke, vape, drugs, paraphernalia, fake clinical setting, readable text, logos, watermark, forced smile, dramatic distress or multiple scenes.

**Final production prompt:** Premium realistic British editorial recovery photograph at dawn in a modest terraced-house kitchen. One adult in understated navy clothing fills a clear glass of water beside an open window, pausing in a quiet early-morning routine. Soft overcast daylight, cream walls, natural wood and charcoal details, with ordinary British terraced homes softly visible outside. The person looks slightly tired but composed, dignified and safe, with no staged emotion. Landscape composition with the person, hands, water and window held inside the central crop-safe area. No cannabis, smoke, vape, drugs, paraphernalia, fake medical setting, readable text, logos, watermark or forced smile. ONE single continuous photograph only. Do not create a collage, diptych, split screen, storyboard, before-and-after image, inset image or multiple panels.

Generated source: `/Users/craigbilton/.codex/generated_images/01a05177-bb41-7170-b9b7-fe535e1f9ef3/exec-0677947b-65f1-4969-bee0-875261040738.png`.

### Batch 3 brief 3: private rehab admission timing

1. **URL:** `/resources/how-quickly-can-someone-enter-rehab`.
2. **Image purpose and placement:** Visible article hero and source for a separate social crop; show practical preparation and a phone assessment without suggesting guaranteed admission.
3. **Scene:** One adult speaking on a phone beside the front window of an ordinary British home while holding house keys.
4. **People and objects:** One adult, phone, keys, coat hooks and front-hall furniture; no suitcase, ticket or provider material.
5. **Composition:** Wide landscape frame with person and keys centrally protected and daylight from the window.
6. **Emotional tone:** Focused, calm and purposeful; neither celebratory nor distressed.
7. **UK context:** Familiar British terraced-house entrance and street architecture.
8. **IRN palette and style:** Muted navy, charcoal, cream and natural wood; premium realistic British editorial photography.
9. **Crop and placement:** 1600 × 900 hero plus 1200 × 630 OG crop; retain the face, phone and keys in both crops.
10. **ALT text:** “Adult holding house keys during a phone conversation beside a front window.”
11. **Exclusions:** No ambulance, hospital, clinic, suitcase packed as a guarantee, readable documents, provider logo, watermark, forced smile, panic, visible substances or multiple scenes.

**Final production prompt:** Premium realistic British editorial recovery photograph in soft natural daylight. One adult stands in the entrance of an ordinary British terraced home, calmly speaking on a phone while holding a small set of house keys. A coat hangs on simple wall hooks and the front window shows a softly focused British residential street. The mood is focused and purposeful, suggesting assessment and practical preparation rather than a guaranteed admission. Muted navy and charcoal clothing, cream plaster and natural wood. Wide landscape composition with face, phone and keys within the centre for 16:9 and 1.91:1 crops. No clinic, ambulance, suitcase, readable paperwork, signs, logos, watermark, visible drugs, distress or forced smile. ONE single continuous photograph only. Do not create a collage, diptych, split screen, storyboard, before-and-after image, inset image or multiple panels.

Generated source: `/Users/craigbilton/.codex/generated_images/01a05177-bb41-7170-b9b7-fe535e1f9ef3/exec-582c1180-2f3d-4185-942c-28afd0c70b1d.png`.

### Batch 3 brief 4: 28-day versus longer-term rehab

1. **URL:** `/resources/28-day-vs-90-day-rehab`.
2. **Image purpose and placement:** Visible article hero and source for a separate social crop; communicate routine, participation and time for recovery without using a calendar graphic.
3. **Scene:** Two adults quietly preparing vegetables and crockery together in a modest communal kitchen.
4. **People and objects:** Two adults, vegetables, plain chopping board, crockery and ordinary kitchen utensils; no staff uniforms or treatment branding.
5. **Composition:** One continuous wide scene with both people working naturally rather than posing.
6. **Emotional tone:** Cooperative, grounded and everyday; no forced smiles or institutional atmosphere.
7. **UK context:** Modest British communal kitchen with familiar cabinetry and window light.
8. **IRN palette and style:** Muted navy, charcoal, cream and natural wood; natural daylight and premium editorial realism.
9. **Crop and placement:** 1600 × 900 hero plus 1200 × 630 OG crop; keep both people and the shared task central.
10. **ALT text:** “Two adults preparing vegetables and crockery together in a communal kitchen.”
11. **Exclusions:** No calendar numbers, clocks as a gimmick, institutional signage, white coats, fake therapy group, readable text, logos, watermark, distress or multiple panels.

**Final production prompt:** Premium realistic British editorial recovery photograph in natural daylight. Two adults in ordinary understated navy and charcoal clothing prepare a simple meal together in a modest communal kitchen, one cutting vegetables on a plain wooden board while the other arranges unbranded crockery. The interaction is natural, quiet and cooperative, suggesting routine, participation and time to practise everyday recovery skills. Cream cabinetry, natural wood and a soft British window light, with no institutional or luxury styling. Wide landscape frame with both people and the shared task centred for 16:9 and 1.91:1 crops. No calendar graphics, numbers, signage, readable text, logos, watermark, white coats, staged therapy, distress or forced smiles. ONE single continuous photograph only. Do not create a collage, diptych, split screen, storyboard, before-and-after image, inset image or multiple panels.

Generated source: `/Users/craigbilton/.codex/generated_images/01a05177-bb41-7170-b9b7-fe535e1f9ef3/exec-d84ea9a5-e597-4453-aba0-e5176e504795.png`.

### Batch 3 brief 5: treatment-placement navigation

1. **URL:** `/treatment-placement`.
2. **Image purpose and placement:** Replace the rejected fabricated-signage courtyard hero and provide a separate social crop; communicate assessment, choice and safe navigation.
3. **Scene:** One adult standing where two footpaths divide on a British coastal headland.
4. **People and objects:** One adult in practical clothing with a small plain backpack; natural paths, dry-stone wall, muted sea and headland.
5. **Composition:** Landscape frame with the path fork clearly visible and the person inside the central crop-safe area.
6. **Emotional tone:** Calm, reflective and steady; not lost, distressed or triumphant.
7. **UK context:** Recognisable British coastal landscape with overcast natural light and dry-stone boundaries.
8. **IRN palette and style:** Muted navy, charcoal, cream, moss and natural stone; premium realistic British editorial photography.
9. **Crop and placement:** 1600 × 900 hero plus 1200 × 630 OG crop; keep the person and fork readable in both crops.
10. **ALT text:** “Adult standing where two coastal footpaths divide.”
11. **Exclusions:** No treatment centre, clinic, sign, readable text, luxury property, compass graphic, logo, watermark, visible drugs, distress, forced smile or multiple scenes.

**Final production prompt:** Premium realistic British editorial recovery photograph on a quiet coastal headland under soft overcast natural daylight. One mature adult in understated navy outdoor clothing and a small plain backpack stands calmly where two footpaths divide, looking across the route before choosing a direction. Include a dry-stone wall, muted green and straw grass, distant sea and recognisably British landscape. The person is reflective and steady, not lost or distressed. Wide landscape composition with the person and the fork in the paths held safely in the centre for both 16:9 and 1.91:1 crops. Muted navy, charcoal, cream, moss and natural stone. No treatment building, clinic, signs, readable text, luxury property, compass graphic, logos, watermark, visible drugs, dramatic distress or forced smile. ONE single continuous photograph only. Do not create a collage, diptych, split screen, storyboard, before-and-after image, inset image or multiple panels.

Generated source: `/Users/craigbilton/.codex/generated_images/01a05177-bb41-7170-b9b7-fe535e1f9ef3/exec-6e2c3ad3-540f-4ac2-9c8f-cab9b375779b.png`.

Batch 3 rendered QA passed at 1440 × 1000 and 390 × 844 for all five pages. Each page has one H1, a visible and correctly cropped hero, literal ALT text, no horizontal overflow and no browser console warnings or errors. Static checks separately verify the dedicated OG URL, ImageObject schema, dimensions, loading priority, responsive sizes and file-size ceilings.

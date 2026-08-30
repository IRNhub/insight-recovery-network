# SEO Expansion Batch 1, Batch 2 and Batch 3 Implementation Report

Implementation date: 28 August 2026
Branch: `agent/seo-commercial-expansion-20260828`
Original audit baseline: `origin/main` at `259fd94`
Reconciled implementation base: `origin/main` at `ce096b2`

## Outcome

The first two SEO expansion batches are implemented and ready for deployment review. The original audit covered an 83-URL production sitemap. Batch 1 adds six substance-specific commercial treatment guides; Batch 2 adds five net-new detox, withdrawal and comparison resources while improving three established routes; and the concurrently published prescription-drug authority article is integrated from the latest upstream base. This branch now generates 95 indexable sitemap URLs. The established treatment, detox, alcohol-withdrawal and cost hubs remain canonical, avoiding competing thin routes.

## Batch 1 new indexable routes

| Route | Purpose | Authority pillar |
|---|---|---|
| `/alcohol-addiction-treatment` | Alcohol assessment, withdrawal-safety and treatment-setting decisions | `/resources/understanding-alcohol-dependency` |
| `/cocaine-addiction-treatment` | Psychological treatment and community, online or residential setting decisions | `/resources/cocaine-addiction` |
| `/cannabis-addiction-treatment` | Treatment intensity based on use, mental health and home stability | `/resources/cannabis-addiction` |
| `/ketamine-addiction-treatment` | Addiction support coordinated with a separate medical pathway for physical harm | `/resources/ketamine-addiction` |
| `/benzodiazepine-addiction-treatment` | Prescriber-led withdrawal planning connected to recovery support | `/resources/benzodiazepine-addiction` |
| `/dual-diagnosis-treatment` | Integrated addiction and mental-health provider capability | `/resources/dual-diagnosis` and `/resources/mental-health-and-addiction` |

Every route has unique title, description, self-canonical and H1; visible breadcrumb, safety guidance, review information, official UK sources and five FAQs; WebPage, Service, BreadcrumbList and FAQPage JSON-LD; contextual assessment and enquiry calls to action; and explicit statements that IRN does not diagnose, prescribe, provide medical detox or operate the facilities it may discuss.

## Batch 1 architecture and internal links

- Added a shared content source and a shared React page template so browser and static outputs remain aligned.
- Linked `/treatment-placement` to all six treatment guides.
- Linked each guide back to its authority pillar and onward to appropriate assessment, detox, cost, online, residential and disclaimer routes.
- Added direct reciprocal links from all six authority pillars in both the React article experience and raw prerendered HTML.
- Added a visible treatment-guide directory and governance links to the React resource hub.
- Added a complete raw-HTML resource directory, including every published article, the six treatment guides and the previously orphaned trust/support pages.
- Extended static SEO verification to fail if any sitemap URL has no incoming raw-HTML link.

## Batch 1 technical SEO changes

- Added the six routes to the application router, prerender output, exact production rewrites and generated sitemap.
- Added content-aware `2026-08-28` lastmod values to the new pages and materially updated hubs.
- Removed production trailing-slash rewrite blocks and added one-hop non-root trailing-slash 301 handling that preserves query strings.
- Added a 301 from the public `insight-recovery-network.replit.app` hostname to the canonical `www` hostname while leaving `*.replit.dev` previews unchanged.
- Updated the legacy `/alcohol-treatment` route to redirect to the new alcohol treatment guide. The risk-sensitive `/alcohol-detox` redirect remains unchanged.
- Preserved true 404 behavior and existing noindex rules for private and utility routes.

## Files added

- `SEO_EXPANSION_MASTER_PLAN.md`
- `SEO_EXPANSION_TRACKER.csv`
- `SEO_EXPANSION_IMPLEMENTATION_REPORT.md`
- `SEO_EXPANSION_VISUAL_ASSET_AUDIT_AND_IMAGE_BRIEFS.md`
- `artifacts/irn-website/src/data/substance-treatment-pages.js`
- `artifacts/irn-website/src/data/substance-treatment-pages.d.ts`
- `artifacts/irn-website/src/pages/SubstanceTreatmentPage.tsx`
- `artifacts/irn-website/src/data/article-batch-2-detox-withdrawal.ts`

## Files changed

- `artifacts/irn-website/src/App.tsx`
- `artifacts/irn-website/src/pages/TreatmentPlacement.tsx`
- `artifacts/irn-website/src/pages/ResourceDetail.tsx`
- `artifacts/irn-website/src/pages/ResourcesList.tsx`
- `artifacts/irn-website/scripts/prerender-meta.mjs`
- `artifacts/irn-website/scripts/verify-static-seo.mjs`
- `artifacts/irn-website/vite.config.ts`
- `artifacts/irn-website/.replit-artifact/artifact.toml`
- `artifacts/irn-website/index.html`
- `artifacts/irn-website/src/components/layout/Layout.tsx`
- `artifacts/irn-website/src/data/approved-articles.ts`
- `artifacts/irn-website/src/data/substance-treatment-pages.js`
- `artifacts/irn-website/src/pages/RehabCostUK.tsx`

## Batch 1 verification completed

- TypeScript: passed with `CI=true pnpm --filter @workspace/irn-website run typecheck`.
- Production build: passed, including prerender, survey rendering, asset compression and static SEO verification.
- Static SEO verification: passed for 89 sitemap URLs; it checks exact routing, canonicals, indexability, article bodies, new-page content depth and schema, reciprocal pillar links, complete resource-hub discovery and zero raw-HTML sitemap orphans.
- Desktop visual QA: alcohol treatment page rendered with the intended hierarchy, safety panel and calls to action.
- Mobile QA at 390 by 844: all six pages rendered with one H1, correct canonical, safety guidance, five FAQs, source links and no horizontal overflow.
- Browser console: no warnings or errors during six-route QA.
- HTTP QA: new route 200; trailing slash 301; bare host 301; public Replit host 301; `/alcohol-treatment` one-hop 301; unknown route true 404 with `X-Robots-Tag: noindex, nofollow`.

The existing Rollup large-chunk warning remains at roughly 1.34 MB uncompressed for the main bundle. It predates this batch and is recorded as a P2 performance task in the master plan.

## Batch 2: detox, withdrawal and commercial decisions

### Authority reconciliation

Five authority articles published after the original audit were reviewed before the final route set was accepted: `/resources/mental-health-and-addiction`, `/resources/benzodiazepine-addiction`, `/resources/ketamine-addiction`, `/resources/cannabis-addiction` and the concurrent upstream `/resources/prescription-drug-addiction` publication. They remain the informational pillars. Batch 2 links from them into the relevant treatment and withdrawal decisions instead of repeating their signs, harms or general-treatment content. The prescription-drug pillar links to both the benzodiazepine-withdrawal and opioid-detox guides.

### New routes

| Route | Search intent owned | Primary supporting pillar |
|---|---|---|
| `/resources/benzodiazepine-withdrawal` | Benzodiazepine withdrawal safety and prescriber-led planning | `/resources/benzodiazepine-addiction` |
| `/resources/opioid-detox` | Opioid detox, maintenance-versus-detox and reduced-tolerance safety | `/resources/addiction-detox-uk` pending a future opioid authority pillar |
| `/resources/cocaine-withdrawal` | Cocaine crash, cravings, mental-health risk and recovery support | `/resources/cocaine-addiction` |
| `/resources/ketamine-withdrawal` | Psychological withdrawal and separate physical-harm assessment | `/resources/ketamine-addiction` |
| `/resources/detox-vs-rehab` | Withdrawal management versus continuing rehabilitation | `/resources/addiction-detox-uk` and the residential-rehab guide |

### Improved routes

| Route | Improvement |
|---|---|
| `/resources/addiction-detox-uk` | Added the visible substance-specific withdrawal and detox directory, reciprocal links and an explicit regulated-provider boundary. |
| `/resources/alcohol-withdrawal-symptoms-when-you-need-medical-help` | Preserved the indexed URL while expanding it to own alcohol-detox and withdrawal-safety intent with current clinical sources, emergency escalation and no self-detox instructions. |
| `/how-much-does-rehab-cost-uk` | Added a visible breadcrumb, WebPage/Service/BreadcrumbList/FAQPage schema, reviewed source links, transparent price methodology, detox-decision links and clear illustrative-range qualifications. |

No separate `/resources/alcohol-detox` page was created because it would compete with the improved alcohol-withdrawal URL. The legacy `/alcohol-detox` 301 remains pointed at `/treatment-placement`. Proposed home-detox and when-medical-detox pages were also consolidated into the strengthened hub and decision pages. Cannabis withdrawal remains planned for Batch 3 rather than being rushed into this release.

### Internal links and discovery

- Added a prominent withdrawal-and-detox directory to `/resources` and the general detox hub.
- Added reciprocal links from the prescription-drug, benzodiazepine, cocaine and ketamine authority articles and Batch 1 treatment pages to their matching withdrawal guides.
- Added contextual commercial calls to action that distinguish information, non-medical recovery support, assessment-led navigation and external clinical care.
- Connected `/treatment-placement`, `/how-much-does-rehab-cost-uk` and the detox-versus-rehab guide so users can move from safety information to a treatment-setting decision.
- Kept all 95 sitemap URLs reachable in raw HTML; the build fails if an indexed page becomes orphaned.

### Technical implementation

- Added five exact production rewrites and five content-aware sitemap entries; after reconciliation with the upstream prescription-drug article, the production build generates 95 indexed URLs and 50 full article pages.
- Extended the shared article source and prerender loader so browser and raw crawler output use the same Batch 2 content.
- Added unique SEO titles, descriptions, Open Graph metadata, self-canonicals, one H1, visible breadcrumbs and Article/MedicalWebPage/BreadcrumbList/FAQPage JSON-LD to each detox/withdrawal resource.
- Removed static-shell JSON-LD after hydration before the live global schema is injected, preventing duplicate `WebSite` markup while preserving complete raw HTML for non-JavaScript crawlers.
- Extended static verification to reject duplicate indexed titles or descriptions, multiple or missing H1s, missing source links, missing provider boundaries, missing reciprocal links and raw-HTML orphans.
- Preserved canonical-host 301s, query-preserving trailing-slash 301s, true 404s and noindex utility rules.

### Clinical and source review

- Every Batch 2 withdrawal guide states that IRN is not a regulated healthcare provider and does not diagnose, prescribe or provide medical detox.
- No taper schedule, dose, medication protocol or self-detox procedure is included.
- Alcohol and benzodiazepine pages warn against abrupt self-directed change where dependence may be present.
- Opioid content distinguishes maintenance treatment from detox and explains loss-of-tolerance risk without treatment instructions.
- Cocaine content includes urgent mental-health and suicide-risk escalation; ketamine content directs bladder, abdominal and other physical symptoms to medical assessment.
- Current primary sources are linked from NICE, NHS and GOV.UK/DHSC guidance, with NHS trust clinical material used where it adds ketamine-specific physical-harm context.

### Batch 2 validation

- TypeScript passed with `CI=true pnpm --filter @workspace/irn-website run typecheck`.
- The complete production build passed for 95 sitemap URLs and 50 full article pages, including asset compression.
- Automated verification confirmed unique titles and meta descriptions, exactly one H1 per indexed route, correct canonicals, indexability, content depth, schema, official sources, clinical boundaries, reciprocal links and zero raw-HTML orphans.
- Desktop and 390 by 844 mobile browser checks covered all eight Batch 2 routes: no horizontal overflow, correct H1/title/canonical, present image ALT attributes, visible safety guidance and valid contextual calls to action. The later asset-level review below identifies where existing ALT wording is conceptual or does not literally match the reused image and supplies replacements.
- Hydrated cost-page schema resolves to one each of Organization, WebSite, Person, WebPage, Service, BreadcrumbList and FAQPage, with no residual static or prerender page-schema copy.
- HTTP checks passed for new-route 200, query-preserving trailing-slash 301, canonical-host 301 and true unknown-route 404 with `X-Robots-Tag: noindex, nofollow`.
- The existing large-main-chunk warning is approximately 1.46 MB uncompressed and 416 KB gzip after reconciling Batch 2 with the new upstream authority article. It remains a P2 performance item and does not fail the build.

### Batch 3 priorities

1. Build an opioid-addiction authority pillar before a commercial opioid-treatment page, with named clinical review and no medication instructions.
2. Evaluate `/prescription-drug-addiction-treatment` as the next commercial page now that its authority pillar exists, but only with medicine-specific clinical review and no taper or prescribing content.
3. Assess `/resources/cannabis-withdrawal` against Search Console query evidence and the existing cannabis authority/treatment pages before publishing.
4. Strengthen one high-value treatment-decision cluster: admission speed, UK-versus-overseas total pathway cost, or an established destination comparison, chosen from query and enquiry evidence.
5. Add Search Console and qualified-enquiry data to the tracker, then use impressions, average position, CTR and assisted conversions to select the next release.
6. Reduce the main JavaScript chunk through route-level/shared-import analysis without weakening raw-HTML prerendering.

## Deployment acceptance

No push or deployment was performed. After deployment approval, re-crawl the live sitemap and verify the production edge preserves the tested 301 behavior for the public Replit hostname and all non-root trailing slashes. Then submit or refresh the sitemap in Search Console and populate the blank tracker fields as query and conversion data accumulates.

## Batch 2 visual asset addendum

The eight Batch 2 pages received a retrospective visual audit after the content and technical implementation. No page was redesigned and no Replit AI, Replit image generation, stock sourcing or placeholder imagery was used.

- Seven pages needed a new page-specific hero. The general detox hub also needed a replacement set because its prior hero and supporting images used advertising-led branded treatment imagery and readable fabricated paperwork.
- Benzodiazepine and ketamine withdrawal could each reuse one existing, unbranded and directly relevant IRN assessment image.
- Cocaine withdrawal and the general detox hub could not reuse their prior supporting images because they contain prominent brand panels and/or readable fabricated content.
- Detox-versus-rehab and the rehab-cost page did not need supporting photography; their comparison and pricing modules are more useful.
- All eight pages needed a dedicated 1200 × 630 social crop with their replacement hero. The rehab-cost asset was the highest-priority replacement because it baked readable illustrative prices into the image.

The complete asset inventory, placement decisions, existing ALT review, recommended dimensions, eight individual image briefs and automatic future-batch gate are recorded in [SEO_EXPANSION_VISUAL_ASSET_AUDIT_AND_IMAGE_BRIEFS.md](./SEO_EXPANSION_VISUAL_ASSET_AUDIT_AND_IMAGE_BRIEFS.md). The five corresponding status fields have been added to the master tracker.

### Supplied-master implementation

Seven user-supplied hero masters passed the visual gate and are implemented as compressed 1600 × 900 WebP images with separate 1200 × 630 Open Graph crops. Literal ALT text replaced conceptual or mismatched descriptions, and fixed intrinsic dimensions plus the existing 16:9 containers reserve layout space. The approved benzodiazepine and ketamine assessment images are now reused once each in the corresponding withdrawal article.

The supplied opioid image was deliberately not implemented because prominent readable fabricated service signage conflicts with the approved exclusions and could imply a real provider. The previous generic opioid hero and OG image remain temporarily; the tracker records the blocked replacement and unresolved ALT status. Supporting imagery also remains outstanding for alcohol withdrawal, opioid detox and cocaine withdrawal, together with the two general-detox supporting-image replacements.

Post-asset validation passed: TypeScript, the complete production build, 95-URL sitemap and 50-article prerender, static SEO verification, exact built-HTML hero/OG/ALT assertions, derived-image dimension checks, and desktop/mobile browser QA across all seven updated pages. Browser QA found no broken images, horizontal overflow, console warnings or console errors. The implementation retains the site’s established static WebP architecture. No push or deployment was performed.

## Batch 3: prescription treatment, cannabis withdrawal and treatment decisions

### Reconciliation and selection

Batch 3 began from an isolated worktree at verified production commit `7d48cf723e71d9d937ec1a986a5bed78fb7f43a7`. The stale, dirty `website-source` checkout was preserved. A fetch confirmed that `origin/main` still matched the handoff commit.

No authority article had been published after `/resources/prescription-drug-addiction`. The repository mentions an existing 28-article authority programme, but does not contain the remaining publication schedule, and it contains no Search Console query or qualified-enquiry export. Batch selection therefore used the master plan, live content architecture and duplication risk while recording the missing evidence rather than inventing it.

Seven page actions were completed:

1. New commercial page: `/prescription-drug-addiction-treatment`.
2. New clinical resource: `/resources/cannabis-withdrawal`.
3. New admission decision guide: `/resources/how-quickly-can-someone-enter-rehab`.
4. New duration decision guide: `/resources/28-day-vs-90-day-rehab`.
5. Substantial improvement to `/treatment-placement` as the central decision hub.
6. Reciprocal internal-link restructuring across authority, treatment, provider-choice, cost and private-rehab paths.
7. Initial-bundle remediation by deferring the full article index until search or a resource route needs it.

The opioid commercial page remains deferred. Creating it before the authority-programme schedule exposes the intended opioid pillar and before named clinical review would risk both duplication and unsafe sequencing. A new inpatient-versus-outpatient page was also not created because the existing online-versus-residential guide substantially owns that decision. Existing private-versus-NHS, provider-choice, residential and cost URLs were strengthened instead of duplicated.

### New route implementation

All four new routes have unique titles, descriptions and H1s, self-canonicals, explicit production rewrites, sitemap inclusion, visible breadcrumbs, static body content, FAQs, relevant schema, source lists and contextual calls to action.

The prescription treatment page distinguishes expected physical dependence and withdrawal from addiction or a broader substance-use pattern. It gives no medicine doses, taper schedules or prescribing instructions. Current prescribers, GPs, specialist services and external providers retain clinical responsibility.

The cannabis withdrawal guide uses a cautious variable timeline, explains that symptoms and duration differ between people, distinguishes typical withdrawal from the potentially dangerous withdrawal associated with alcohol or benzodiazepines, and directs urgent mental-health or safety deterioration to appropriate services.

The admission guide makes no same-day guarantee. It explains the role of assessment, withdrawal risk, medical stability, records, provider capacity, travel, payment and the external provider’s final admission decision.

The duration guide rejects a universal 28-day or 90-day optimum. It explains how detox time, severity, co-occurring needs, progress reviews, discharge environment, cost and continuing care affect an individual plan.

### Treatment-placement hub and internal links

`/treatment-placement` now has a visible treatment-decision directory covering provider choice, admission timing, programme duration, private-versus-NHS care, online-versus-residential care and cost. It also exposes all seven substance-specific treatment guides in raw HTML.

Reciprocal links now connect:

- the prescription authority pillar, prescription treatment page, benzodiazepine-withdrawal guide and opioid-detox guide;
- the cannabis authority pillar, cannabis-withdrawal guide and cannabis-treatment page;
- treatment placement, private rehab, private-rehab alternatives, provider choice, admission speed, duration and cost;
- every new article to the existing resource hub and relevant treatment path.

The automated raw-HTML orphan check still passes for every sitemap URL.

### Visual-content gate

Five dedicated single-photograph hero masters were generated with the built-in Codex image-generation capability. No Replit AI, Replit suggestions, Replit image generation, stock sourcing or placeholder imagery was used. Each approved source was visually inspected before derivation into a 1600 × 900 WebP hero and separate 1200 × 630 WebP social crop.

The four new pages each receive a distinct visible hero, literal ALT text, dedicated OG image, intrinsic dimensions, eager loading, high fetch priority, responsive sizes and ImageObject schema. Supporting photography is intentionally not required: the prescription page uses highlights, a treatment-setting comparison and a process; cannabis withdrawal uses a timeline and symptom/safety structure; admission uses a readiness pathway and provider questions; duration uses a comparison table, review checklist and continuing-care pathway.

The existing treatment-placement courtyard image was rejected because it contained fabricated readable `RESIDENTIAL TREATMENT` signage and visually implied a luxury provider. The page now uses a British coastal-path decision scene, a separate OG crop and ImageObject schema. The prior asset remains untouched in the repository but is no longer imported by this page.

All five briefs, final production prompts, ALT decisions, output paths and supporting-image rationales are recorded in `SEO_EXPANSION_VISUAL_ASSET_AUDIT_AND_IMAGE_BRIEFS.md`. The deliberately outstanding Batch 2 alcohol-withdrawal, opioid-detox, cocaine-withdrawal and general-detox supporting-image tasks remain unchanged. The rejected opioid replacement remains rejected and no substitute placeholder was introduced.

### Sources and clinical boundaries

Content was checked against current NICE, NHS, NHS England, GOV.UK/DHSC, OHID and CQC material, plus peer-reviewed cannabis-withdrawal literature. These sources do not endorse IRN. Every affected page states the relevant boundary: IRN does not diagnose, prescribe, provide medical detox, supervise inpatient medical care or operate the external facilities it may discuss. Emergency guidance uses 999/A&E where appropriate.

### Performance result

The prior initial bundle included the full article corpus through `Navbar → SearchModal → article-loader → articles`. Search is now lazily loaded only when opened. The global entry chunk fell from 1,498.06 kB uncompressed / 427.97 kB gzip to 383.21 kB / 120.94 kB. The 1,102.85 kB / 303.03 kB article-data chunk is deferred to resource/search use, so it no longer blocks ordinary initial page loads. Static prerendering and raw-HTML discovery are unchanged.

### Batch 3 validation

- TypeScript passes with `CI=true pnpm --filter @workspace/irn-website run typecheck`.
- The full production build passes, including favicon/OG generation, Vite, prerendering, static verification and Brotli/gzip compression.
- The generated sitemap contains 99 indexable URLs and all four new routes; 53 full articles are prerendered.
- Automated Batch 3 checks validate content depth, exact canonicals, one H1, indexability, explicit rewrites, schema, official sources, clinical boundaries, visible heroes, literal ALT, 1600 × 900 and 1200 × 630 WebP dimensions, file-size ceilings, eager/high-priority loading, responsive sizes, dedicated OG metadata, ImageObject schema and reciprocal internal links.
- Rendered browser QA passes at 1440 × 1000 and 390 × 844 on all five affected routes, with correct hero visibility and ALT, no horizontal overflow and no console warnings or errors.
- `git diff --check` and a final repository-status review remain part of local commit acceptance.

### Deployment and Search Console

No push or deployment was performed. The production deployment ID and live site remain unchanged. Because no Batch 3 URL is deployed, no Search Console inspection request should be made yet. After approved deployment, request indexing for the four new routes, refresh the sitemap, and inspect the updated treatment-placement URL. Record impressions, clicks, average position, CTR and qualified/assisted enquiries in the tracker rather than selecting the next batch from rankings alone.

### Recommended Batch 4 sequence

1. Reconcile the 28-article authority schedule again. If the opioid authority pillar is released, review it first and only then consider a named-clinical-review opioid treatment page.
2. Complete the four deliberately outstanding Batch 2 supporting-image tasks without placeholders or the rejected opioid-signage asset.
3. Use real Search Console and qualified-enquiry evidence to decide between an international cost/placement decision, a genuinely distinct outpatient decision page or targeted improvement of existing high-impression URLs.
4. Consider splitting the large resource article corpus into a lightweight search/list index plus on-demand article bodies, but only if measurements justify the additional architecture work.

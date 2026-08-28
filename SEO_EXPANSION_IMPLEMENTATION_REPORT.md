# SEO Expansion P1 Implementation Report

Implementation date: 28 August 2026
Branch: `agent/seo-commercial-expansion-20260828`
Baseline: `origin/main` at `259fd94`

## Outcome

The first P1 batch is implemented and ready for deployment review. Production currently exposes 83 indexable sitemap URLs; this branch generates 89 by adding six substance-specific commercial treatment guides. The existing `/treatment-placement` route remains the broad addiction-treatment hub, avoiding a competing `/addiction-treatment-uk` page.

## New indexable routes

| Route | Purpose | Authority pillar |
|---|---|---|
| `/alcohol-addiction-treatment` | Alcohol assessment, withdrawal-safety and treatment-setting decisions | `/resources/understanding-alcohol-dependency` |
| `/cocaine-addiction-treatment` | Psychological treatment and community, online or residential setting decisions | `/resources/cocaine-addiction` |
| `/cannabis-addiction-treatment` | Treatment intensity based on use, mental health and home stability | `/resources/cannabis-addiction` |
| `/ketamine-addiction-treatment` | Addiction support coordinated with a separate medical pathway for physical harm | `/resources/ketamine-addiction` |
| `/benzodiazepine-addiction-treatment` | Prescriber-led withdrawal planning connected to recovery support | `/resources/benzodiazepine-addiction` |
| `/dual-diagnosis-treatment` | Integrated addiction and mental-health provider capability | `/resources/dual-diagnosis` and `/resources/mental-health-and-addiction` |

Every route has unique title, description, self-canonical and H1; visible breadcrumb, safety guidance, review information, official UK sources and five FAQs; WebPage, Service, BreadcrumbList and FAQPage JSON-LD; contextual assessment and enquiry calls to action; and explicit statements that IRN does not diagnose, prescribe, provide medical detox or operate the facilities it may discuss.

## Architecture and internal links

- Added a shared content source and a shared React page template so browser and static outputs remain aligned.
- Linked `/treatment-placement` to all six treatment guides.
- Linked each guide back to its authority pillar and onward to appropriate assessment, detox, cost, online, residential and disclaimer routes.
- Added direct reciprocal links from all six authority pillars in both the React article experience and raw prerendered HTML.
- Added a visible treatment-guide directory and governance links to the React resource hub.
- Added a complete raw-HTML resource directory, including every published article, the six treatment guides and the previously orphaned trust/support pages.
- Extended static SEO verification to fail if any sitemap URL has no incoming raw-HTML link.

## Technical SEO changes

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
- `artifacts/irn-website/src/data/substance-treatment-pages.js`
- `artifacts/irn-website/src/data/substance-treatment-pages.d.ts`
- `artifacts/irn-website/src/pages/SubstanceTreatmentPage.tsx`

## Files changed

- `artifacts/irn-website/src/App.tsx`
- `artifacts/irn-website/src/pages/TreatmentPlacement.tsx`
- `artifacts/irn-website/src/pages/ResourceDetail.tsx`
- `artifacts/irn-website/src/pages/ResourcesList.tsx`
- `artifacts/irn-website/scripts/prerender-meta.mjs`
- `artifacts/irn-website/scripts/verify-static-seo.mjs`
- `artifacts/irn-website/vite.config.ts`
- `artifacts/irn-website/.replit-artifact/artifact.toml`

## Verification completed

- TypeScript: passed with `CI=true pnpm --filter @workspace/irn-website run typecheck`.
- Production build: passed, including prerender, survey rendering, asset compression and static SEO verification.
- Static SEO verification: passed for 89 sitemap URLs; it checks exact routing, canonicals, indexability, article bodies, new-page content depth and schema, reciprocal pillar links, complete resource-hub discovery and zero raw-HTML sitemap orphans.
- Desktop visual QA: alcohol treatment page rendered with the intended hierarchy, safety panel and calls to action.
- Mobile QA at 390 by 844: all six pages rendered with one H1, correct canonical, safety guidance, five FAQs, source links and no horizontal overflow.
- Browser console: no warnings or errors during six-route QA.
- HTTP QA: new route 200; trailing slash 301; bare host 301; public Replit host 301; `/alcohol-treatment` one-hop 301; unknown route true 404 with `X-Robots-Tag: noindex, nofollow`.

The existing Rollup large-chunk warning remains at roughly 1.34 MB uncompressed for the main bundle. It predates this batch and is recorded as a P2 performance task in the master plan.

## Deployment acceptance

After deployment, re-crawl the live sitemap and verify the production edge preserves the tested 301 behavior for the public Replit hostname and all non-root trailing slashes. Then submit or refresh the sitemap in Search Console and populate the blank tracker fields as query and conversion data accumulates.

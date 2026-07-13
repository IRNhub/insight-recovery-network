# Insight Recovery Network SEO and Lead Generation Implementation Report

Date: 13 July 2026

Site: https://www.insightrecoverynetwork.com

Scope: Technical SEO, commercial content, AI-search readiness, internal linking, local relevance, lead measurement and production QA

## 1. Executive summary

The site now presents Insight Recovery Network more clearly as an independent addiction treatment-placement, online recovery and advisory service. The work prioritised pages with direct commercial or lead value, strengthened articles already attracting search visibility, added a substantive Cornwall regional hub, expanded the Thailand placement page and introduced consistent lead-event tracking.

The production build now pre-renders 71 indexable URLs. The sitemap, canonicals, article bodies, noindex rules and true 404 handling pass the existing static SEO verifier. All 14 content-edited routes were checked in a production preview at desktop and mobile widths. Browser QA also identified and resolved an article hydration fault that previously replaced pre-rendered article content with an error for visitors.

The starting figures supplied in the brief, approximately 26 organic visits, 10 ranking keywords, 48 referring domains and Domain Rating 14, should be treated as the measurement baseline. They were not independently verified because Search Console, GA4 and backlink-platform exports were not provided.

## 2. Audit findings

### Technical SEO

Strengths found:

- Vite build-time pre-rendering already provided crawler-readable HTML.
- Canonical tags, robots.txt, sitemap generation and true 404 routing were already part of the build workflow.
- Global organisation, website and person structured data were already present.
- Google Tag Manager and Meta Pixel were already installed.

Gaps addressed:

- Cornwall had no dedicated regional service hub.
- Article pages lacked visible and structured breadcrumbs in the React experience.
- Article modified dates were not exposed in social metadata.
- Article client rendering could fail in production preview despite valid static HTML.
- Commercial article relationships relied too heavily on category matching.
- Important treatment, cost, online, pricing and Insight OS actions lacked consistent analytics events.

### Content, intent and AI-search readiness

Gaps addressed:

- The homepage and organisation pages did not state the commercial proposition as directly as the service model requires.
- Treatment placement needed clearer independence, fee-transparency and urgent-care boundaries.
- The rehab-cost page needed an immediate answer and a route to the pricing guide.
- The Thailand page needed programme length, inclusions, clinical scope, travel, admissions, family, suitability and provider-boundary detail.
- Several ranking articles needed direct answers, stronger titles, safer next-step language and commercial pathways.
- Related articles were not organised into explicit relapse, alcohol, family and rehab/cost clusters.

### Local relevance

Gaps addressed:

- There was no Cornwall page supporting Newquay, Truro, Redruth, Falmouth or St Austell searches.
- The new page now states clearly that IRN is an online advisory and recovery network based in Newquay and does not own or operate a residential rehab centre in Cornwall.

### Conversion and measurement

Gaps addressed:

- Phone, email, WhatsApp, contact-form and key service CTA actions were not consistently exposed as named data-layer events.
- The contact form did not distinguish starting the form from a confirmed successful submission.
- The homepage service presentation omitted Insight OS and lacked direct pricing and Cornwall pathways.

### Performance and accessibility

Strengths found:

- Most service artwork is already supplied as WebP.
- The app uses semantic headings, labelled navigation, responsive layouts and descriptive calls to action.

Remaining risks:

- The main JavaScript bundle is 942.5 kB minified and 268.3 kB gzip, which triggers Vite's 500 kB warning.
- The resources hero PNG is about 2.03 MB and the About hero PNG is about 1.88 MB.
- Some UI library source maps generate non-blocking Vite warnings.

## 3. Files changed

- `artifacts/irn-website/.replit-artifact/artifact.toml`: added production rewrites for the Cornwall page.
- `artifacts/irn-website/index.html`: shortened homepage title and description while preserving tracking and static metadata.
- `artifacts/irn-website/public/og-what-we-offer.png`: regenerated the What We Offer social image after title changes.
- `artifacts/irn-website/scripts/prerender-meta.mjs`: synchronised static metadata and content, added Cornwall pre-rendering and schema, expanded destination output, updated the sitemap and added static internal links.
- `artifacts/irn-website/src/App.tsx`: registered Cornwall and installed central lead-click tracking.
- `artifacts/irn-website/src/components/SEO.tsx`: added article modified-time metadata.
- `artifacts/irn-website/src/components/WhatsAppFloat.tsx`: removed duplicate local tracking in favour of central tracking.
- `artifacts/irn-website/src/components/forms/ContactForm.tsx`: added form-start and confirmed-success events.
- `artifacts/irn-website/src/components/layout/Footer.tsx`: added a Cornwall internal link.
- `artifacts/irn-website/src/config/og-pages.ts`: improved treatment-placement and What We Offer titles.
- `artifacts/irn-website/src/data/articles.ts`: improved six priority article titles, descriptions, direct answers, dates and image text where relevant.
- `artifacts/irn-website/src/data/destinations.ts`: expanded Thailand content, metadata, claims boundaries and decision-support sections.
- `artifacts/irn-website/src/lib/analytics.ts`: added privacy-conscious data-layer event handling.
- `artifacts/irn-website/src/pages/AddictionHelpCornwall.tsx`: added the regional service hub.
- `artifacts/irn-website/src/pages/AboutInsightRecoveryNetwork.tsx`: clarified the independent placement, online and advisory model.
- `artifacts/irn-website/src/pages/DestinationRehab.tsx`: rendered new destination detail sections and supplied hero image dimensions.
- `artifacts/irn-website/src/pages/Home.tsx`: strengthened commercial pathways, added Insight OS and improved metadata.
- `artifacts/irn-website/src/pages/PrivateRehabAlternativeUK.tsx`: added a direct comparison of online, outpatient, NHS and residential routes.
- `artifacts/irn-website/src/pages/RehabCostUK.tsx`: added an immediate price answer, disclaimer and pricing-guide link.
- `artifacts/irn-website/src/pages/ResourceDetail.tsx`: added topic clusters, breadcrumbs, commercial links, modified dates and a reliable bundled-article fallback.
- `artifacts/irn-website/src/pages/TreatmentPlacement.tsx`: strengthened proposition, fee disclosure, FAQs and urgent-care language.
- `artifacts/irn-website/src/pages/WhatWeOffer.tsx`: differentiated the service overview and clarified the audience and pathways.

## 4. Pages changed and why

- `/`: clearer treatment-placement proposition; four commercial service paths; pricing, contact and Cornwall links; shorter search snippet.
- `/what-we-offer`: differentiated overview of placement, online recovery, family support and digital tools.
- `/about-insight-recovery-network`: explicit independent advisory positioning and ownership boundaries.
- `/private-rehab-alternative-uk`: direct comparison of alternatives and when residential care may be safer.
- `/treatment-placement`: clearer matching process, transparency, fees and urgent-risk boundaries.
- `/private-rehab-thailand`: expanded cost, duration, inclusions, detox, trauma, mental-health, travel, family, admissions and suitability content.
- `/how-much-does-rehab-cost-uk`: immediate £8,000 to £20,000+ 28-day guide range, disclaimer and pricing-guide link.
- `/addiction-help-cornwall`: new regional assessment, online-support, family-guidance and placement hub.
- `/resources/relapse-meaning`: improved relapse-intent title and description.
- `/resources/slip-lapse-relapse-difference`: sharper direct-answer title and description.
- `/resources/how-to-choose-private-rehab-centre-uk`: immediate 12-check answer, metadata, image text and better UK rehab link.
- `/resources/why-cant-i-stop-how-addiction-works`: immediate explanatory answer, metadata and image text.
- `/resources/understanding-alcohol-dependency`: direct definition, withdrawal warning and safer next-step language.
- `/resources/private-alcohol-rehab-uk-costs-options-alternatives`: stronger cost-intent metadata and related commercial pathways.

All article detail routes also inherit the improved breadcrumb, related-service, topic-cluster and bundled-content behaviour.

## 5. Technical SEO improvements

- Added Cornwall routing, static HTML, canonical, sitemap entry and production rewrites.
- Kept React metadata and pre-render metadata aligned for all changed static pages.
- Added `BreadcrumbList` data to article pages and the Cornwall hub.
- Added visible Home, Resources and article breadcrumbs.
- Added `article:modified_time` for updated articles.
- Preserved and expanded `Service`, `FAQPage`, `BlogPosting`, `Organisation`, `WebSite` and `Person` data where appropriate.
- Confirmed one canonical and one indexable HTML target for all 71 sitemap URLs through the static verifier.
- Confirmed true 404 handling and `noindex` behaviour.
- Confirmed every internal page link found across 78 generated HTML files resolves to a generated route.

## 6. Content and AI-search improvements

- Added direct answers near the top of cost, rehab-choice, addiction-mechanism and alcohol-dependency content.
- Structured Thailand and Cornwall content around questions that can be extracted accurately by search and answer engines.
- Added explicit statements about what IRN does and does not provide.
- Added suitability, limitation, emergency and medical-detox boundaries to reduce ambiguity.
- Used descriptive headings, short explanatory sections and visible FAQs.
- Updated article dates only where substantive search-facing content or metadata changed.
- Preserved British English and avoided unsupported superiority, outcome or ownership claims.

## 7. Internal-linking improvements

- Added homepage links to treatment placement, online support, Insight OS, assessments, costs, the pricing guide, contact and Cornwall.
- Added Cornwall to the global footer and static pre-render footer.
- Built explicit article clusters for relapse, alcohol, family and rehab/cost topics.
- Added contextual commercial links from relevant articles to placement, rehab cost, Thailand, online support, family guidance, assessments, Cornwall and the pricing guide.
- Improved the rehab-choice article link from a generic placement destination to the private-rehab UK guide.

## 8. Conversion improvements

- Added Insight OS as a homepage service card.
- Added direct pricing, confidential-contact and Cornwall paths beneath the service grid.
- Added fee and commercial-relationship disclosure to treatment placement.
- Added clearer primary and secondary CTAs to Cornwall and the priority service pages.
- Retained emergency and withdrawal boundaries beside decision points.
- Ensured CTA labels describe the next action rather than using generic wording.

## 9. Performance improvements and remaining work

Implemented:

- Added intrinsic width and height to destination hero images.
- Added eager decoding and fetch priority to the main destination image.
- Reused existing WebP service assets rather than introducing new large artwork.
- Retained the existing Brotli and gzip production compression step.

Recommended next engineering pass:

1. Convert `resources-hero` and `About_US_Hero` PNG files to correctly sized AVIF or WebP variants.
2. Split the 942.5 kB main JavaScript chunk, beginning with admin, assessment and large UI dependencies.
3. Remove the mixed static and dynamic import of the assessment scorer.
4. Run field Core Web Vitals from Search Console after deployment, with particular attention to LCP on Home, Resources and About.

## 10. Accessibility and mobile findings

- All 14 content-edited routes have exactly one visible H1 at 390 px and 1,440 px widths.
- No edited route produced horizontal overflow at either width.
- No main-content image on the tested routes lacked an `alt` attribute.
- Cornwall mobile and Thailand desktop hero layouts passed visual inspection.
- The unknown-route experience has a clear H1, a route home and `noindex` metadata.
- No browser console errors or warnings were recorded during final route QA.

## 11. Analytics and conversion recommendations

Data-layer events implemented:

| Event | Classification | Trigger |
| --- | --- | --- |
| `contact_form_started` | Micro-conversion | First focus anywhere in the confidential enquiry form |
| `contact_form_submit_success` | Primary lead | Successful server response after a valid form submission |
| `phone_link_click` | Primary lead | Any telephone link |
| `email_link_click` | Primary lead | Any email link |
| `whatsapp_click` | Primary lead | Any WhatsApp link |
| `treatment_placement_cta_click` | Commercial micro-conversion | Link to treatment placement |
| `online_programme_cta_click` | Commercial micro-conversion | Link to either online programme route |
| `services_pricing_guide_click` | Commercial micro-conversion | Link to the services pricing guide |
| `insight_os_cta_click` | Product micro-conversion | Link to Insight OS |

The events pass page path, destination URL and short link text only. They do not pass form values, names, phone numbers or other user-supplied personal information.

GTM and GA4 follow-up:

1. Create GA4 Event tags for each custom event above.
2. Mark `contact_form_submit_success`, `phone_link_click`, `email_link_click` and `whatsapp_click` as key events.
3. Keep `contact_form_started` and service CTA events as diagnostic micro-conversions.
4. Deduplicate any existing thank-you conversion against `contact_form_submit_success` before using both for bidding.
5. Validate events in GTM Preview and GA4 DebugView after production deployment.
6. Build a funnel by landing page, service CTA, form start and successful enquiry.

## 12. Verification results

- Website TypeScript check: passed.
- Website production build: passed.
- Static SEO verifier: passed for all 71 sitemap URLs.
- Article body, canonical, noindex and true-404 consistency checks: passed.
- Internal link scan: passed across 78 generated HTML files.
- Git whitespace/error check: passed.
- Edited-source em dash scan: passed.
- Desktop and mobile browser QA: passed on all 14 content-edited routes.
- Browser console: no warnings or errors during final QA.
- Lint: no lint script is declared in the website package.
- Automated tests: no test script is declared in the website package.

Non-blocking build warnings remain for three UI-library source maps, the mixed assessment-scorer import and the large main JavaScript chunk.

## 13. Search Console reindexing priorities

Request indexing after deployment in this order:

1. `/addiction-help-cornwall`
2. `/treatment-placement`
3. `/private-rehab-thailand`
4. `/how-much-does-rehab-cost-uk`
5. `/`
6. `/what-we-offer`
7. `/about-insight-recovery-network`
8. `/private-rehab-alternative-uk`
9. `/resources/how-to-choose-private-rehab-centre-uk`
10. `/resources/relapse-meaning`
11. `/resources/slip-lapse-relapse-difference`
12. `/resources/understanding-alcohol-dependency`
13. `/resources/private-alcohol-rehab-uk-costs-options-alternatives`
14. `/resources/why-cant-i-stop-how-addiction-works`

Then resubmit `/sitemap.xml` and inspect the rendered HTML, canonical and indexing status for each priority URL.

## 14. Backlink and off-site authority recommendations

1. Secure accurate citations and links from Cornwall wellbeing, community, business and professional directories that accept remote advisory services.
2. Build relationships with therapists, interventionists, sober companions, private GPs and family-support organisations that can link to the most relevant service or guide page.
3. Offer Craig Bilton as a named expert source for journalist requests concerning rehab choice, relapse, family boundaries, treatment costs and overseas treatment.
4. Publish data-led or expert-led resources that earn links naturally, such as an annually updated UK private rehab cost guide and a provider-comparison checklist.
5. Seek destination-relevant links from legitimate treatment partners only where the relationship and editorial basis can be stated transparently.
6. Reclaim unlinked brand and founder mentions and correct inconsistent name, address, phone and URL citations.
7. Avoid bulk directory submissions, paid guest-post networks, exact-match anchor campaigns and links that imply IRN owns treatment facilities.

## 15. What to monitor over the next 28 days

### Days 1 to 3

- Confirm deployment, sitemap fetch, canonical tags, structured data and 404 response behaviour.
- Use URL Inspection for the 14 priority pages.
- Confirm GA4 custom events and lead deduplication in DebugView.

### Days 4 to 14

- Track impressions, clicks, average position and click-through rate by changed URL and query.
- Watch Cornwall discovery and destination indexing separately from the established article cluster.
- Compare service CTA clicks, form starts and successful enquiries by landing page.
- Review any crawl errors, duplicate-title reports or unexpected canonical selection.

### Days 15 to 28

- Identify pages gaining impressions but not clicks and test titles or descriptions only where the query intent is clear.
- Identify articles generating visits but no service actions and improve the most relevant contextual CTA.
- Compare treatment placement, rehab cost, Thailand and Cornwall assisted-conversion paths.
- Review Core Web Vitals and prioritise image conversion or code splitting if LCP or INP remains weak.
- Record new referring domains, link quality and which commercial pages receive authority.

Primary 28-day success indicators:

- More non-brand impressions and clicks to treatment-placement, cost, Thailand and Cornwall pages.
- Improved CTR on the six updated articles.
- Growth in service CTA clicks and form starts without a fall in completion rate.
- Confirmed phone, email, WhatsApp and successful-form leads in GA4.
- No indexing regression across the 71-URL sitemap.

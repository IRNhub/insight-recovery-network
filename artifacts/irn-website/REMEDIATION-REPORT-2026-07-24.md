# Insight Recovery Network remediation report

Date: 24 July 2026
Scope: controlled SEO, conversion analytics, consent, internal linking and private-rehab hero remediation
Release status: **not deployed**

## Executive outcome

The remediation pass is complete in the local worktree. It adds consent-gated measurement, replaces the mixed legacy event vocabulary with a single event contract, makes `/get-help` an indexable commercial enquiry page, marks `/clinical-disclaimer` `noindex, follow`, removes that disclaimer from the sitemap, repairs robots rules, strengthens raw-HTML internal discovery, and optimises the `/private-rehab-uk` hero image.

The production build, TypeScript check and static SEO verifier pass. The generated sitemap contains 73 indexable URLs; every sitemap entry passed the verifier's status/canonical/indexability rules and the generated raw-HTML link graph has no orphaned indexable page. No deployment, GTM publish, GA4 configuration change, GSC submission or Meta configuration change has been made.

## 1. Prioritised findings used for this pass

### P0 — measurement and privacy

- GTM and Meta were loaded before an explicit choice. The implementation did not provide a persistent reject/settings mechanism aligned with analytics and marketing categories.
- Existing analytics names and conversion calls were inconsistent. Some form conversion logic could run before a successful API response, making failures and valid leads hard to distinguish.
- SPA navigation needed one explicit page-view event per route with the route-specific title, without relying on GA4 enhanced-measurement history tracking.
- Addiction-treatment URLs, titles, assessment answers and free-text content must not be sent to advertising platforms as health-interest signals. Meta automatic `PageView` and `Lead` events were therefore unsuitable.

### P1 — crawl control and commercial intent

- Bot-specific `robots.txt` groups weakened the intended global crawl rules.
- `/clinical-disclaimer` had no independent search purpose but was indexable and present in the sitemap.
- `/get-help` was excluded from indexing even though it is the clearest enquiry/admissions route.
- The raw-HTML resource hub did not guarantee a crawler-visible route to every published article.
- The home title and private-rehab page targeting needed clearer separation.

### P2 — conversion paths and performance

- Primary commercial CTAs were split between `/contact`, `/get-help` and unclassified links.
- The private-rehab hero depended on a 2.25 MB PNG with no responsive AVIF/WebP alternatives.
- The high-intent page set needed an explicit intent map to prevent future title/H1 overlap.

## 2. Analytics implementation

All events enter GTM through `window.dataLayer` only after analytics consent. Events generated before consent are not queued or replayed. A one-second event fingerprint prevents accidental duplicate clicks/submissions; SPA page views have a separate pathname guard.

Every consented event includes only:

- `event`
- `page_path`
- `page_title`
- `device_category`
- `traffic_source`
- where applicable: `form_name`, `cta_location`, `link_target`, `service_interest`, `attempted_path`, `referrer_path`

The central filter rejects keys containing name, email, phone, message, answers/responses, clinical details, diagnosis, score/result, risk, symptom, substance, assessment type and free text. The runtime test confirmed that `email`, `phone` and `assessment_score` were removed while an allowed `service_interest` value was retained.

### Event mapping

| Event | Trigger | Parameters beyond common context | Recommended GA4 key event? |
|---|---|---|---|
| `spa_page_view` | Once after each SPA route/title change; once on post-load analytics opt-in | none | No |
| `consultation_form_start` | First focus inside the `/get-help` form | `form_name` | No |
| `consultation_form_submit` | Only after the `/api/enquiries` response is successful | `form_name`, `service_interest` | **Yes** |
| `contact_form_start` | First focus inside the general contact form | `form_name` | No |
| `contact_form_submit` | Only after the `/api/enquiries` response is successful | `form_name`, `service_interest` | **Yes** |
| `assessment_start` | User deliberately starts an assessment | none | No |
| `assessment_complete` | Only after the assessment submission API response is successful | none | **Yes** |
| `phone_click` | Delegated click on `tel:` | `link_target` | No |
| `whatsapp_click` | Delegated click on the approved WhatsApp destination | `link_target`, optional CTA context | **Yes** |
| `email_click` | Delegated click on `mailto:` | `link_target` | No |
| `book_consultation_click` | Consultation/contact CTA | CTA and service context | No |
| `get_help_click` | CTA to `/get-help` | CTA and service context | No |
| `pricing_guide_view` | Pricing-guide link, view or download action | CTA context | No |
| `treatment_placement_enquiry` | Placement-specific commercial CTA | CTA and service context | **Yes** |
| `online_programme_enquiry` | Online-programme commercial CTA | CTA and service context | **Yes** |
| `family_support_enquiry` | Family/intervention commercial CTA | CTA and service context | **Yes** |
| `not_found_view` | Rendered 404 route | `attempted_path`, `referrer_path` | No |

Recommended primary lead key events are the two successful form submits plus the service-specific enquiry events. `assessment_complete` and `whatsapp_click` can be secondary key events if the business wants to optimise to assisted rather than submitted enquiries. Start events, clicks and page views should not be treated as leads.

## 3. Consent and health-data controls

- Necessary storage is always on.
- Analytics and marketing are off by default.
- `Accept all`, `Reject non-essential` and `Choose settings` are equally available in the first layer.
- Footer `Cookie Settings` reopens the detailed preferences.
- Forms, telephone, email, internal navigation and WhatsApp remain available when non-essential consent is rejected.
- GTM loads only when analytics or marketing is granted. Its tags still need matching GTM consent requirements.
- Meta loads only when marketing is granted.
- Meta is initialised without automatic `PageView` or `Lead`; the old noscript pixel was removed.
- Google `ad_user_data` and `ad_personalization` remain denied even when basic marketing is granted. This is deliberate because treatment browsing can imply special-category health information.
- Revoking a previously granted category reloads the document so already loaded third-party code is removed.
- Cookie and privacy policies now describe the implemented categories and controls.

## 4. Technical SEO remediation

### Robots and indexability

The robots file now has one authoritative wildcard group:

```text
User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/
Disallow: /api/
Disallow: /recovery-plan-checklist/checklist

Sitemap: https://www.insightrecoverynetwork.com/sitemap.xml
```

`/clinical-disclaimer` now renders a self-referencing canonical and `noindex, follow`, and is absent from the generated sitemap. `/get-help` now renders `index, follow`, has a self-referencing canonical, appears in the sitemap, and has distinct commercial metadata and crawler-visible content.

### `/get-help` commercial positioning

- Title: `Get Private Addiction Help | Treatment Guidance UK`
- H1: `Speak to Someone About Private Addiction Treatment`
- Purpose: private paid treatment guidance and triage for adults
- Routes offered: rehab placement, structured online recovery, family support and professional intervention guidance
- Boundaries: not emergency/NHS crisis care and not an under-18 service
- Primary action: confidential first discussion

### Internal discovery

The crawler-visible resource directory now links every published article under meaningful topic headings. It also links commercial/help, about, professional support, checklist, editorial and media routes. The verifier constructs a graph from the generated raw HTML and fails the build if an indexable page has no inbound internal link; the final graph passed with zero orphans.

### Redirects

The Vite/Replit production server now returns a server-side `301` from a non-root trailing-slash URL to the non-trailing version while preserving the complete query string. Examples verified locally:

- `/private-rehab-uk/?utm_source=test&next=a%3Fb` → `/private-rehab-uk?utm_source=test&next=a%3Fb`
- `/resources/?utm_source=test` → `/resources?utm_source=test`
- `/get-help/` → `/get-help`
- `/clinical-disclaimer/` → `/clinical-disclaimer`
- `/` remains `200`

Existing canonical-host and protocol behavior must be rechecked through the Replit custom-domain edge after deployment because the local preview cannot reproduce its TLS/domain routing.

## 5. High-intent intent map

| Route | Primary intent | Target theme | Current title/H1 distinction | Cannibalisation risk after pass |
|---|---|---|---|---|
| `/` | Discover the available help routes | addiction-treatment guidance and rehab placement | Umbrella title; H1 focuses on choosing rehab/detox/support | Low |
| `/get-help` | Contact/admissions triage | private addiction help and treatment guidance | Explicit “speak to someone” enquiry intent | Low |
| `/treatment-placement` | Understand independent placement help | assessment-led rehab/detox provider selection | Provider-choice/process intent | Low |
| `/private-rehab-uk` | Compare/select UK private rehab | private rehab UK | UK category plus assessment-led choice | Low |
| `/how-much-does-rehab-cost-uk` | Research prices | UK private rehab cost | Cost-specific title and H1 | Low |
| `/private-rehab-alternative-uk` | Compare alternatives | online, outpatient and NHS alternatives | Alternative/modality intent | Low |
| `/luxury-rehab` | Research premium treatment | luxury/private international treatment | Premium environment/service intent | Low |
| `/executive-rehab` | Find discreet work-compatible care | executive rehab | Professional/business-leader need | Low |
| `/destination-rehab` | Compare overseas destinations | treatment abroad | Cross-destination comparison page | Low |
| `/private-rehab-thailand` | Evaluate one destination | Thailand costs and placement | Country-specific decision page | Low |
| `/private-rehab-south-africa` | Evaluate one destination | South Africa costs and placement | Country-specific decision page | Low |
| `/private-rehab-spain` | Evaluate one destination | Spain costs and placement | Country-specific decision page | Low |
| `/private-rehab-sri-lanka` | Evaluate one destination | Sri Lanka costs and placement | Country-specific decision page | Low |
| `/online-programme` | Evaluate IRN's paid programme | structured online recovery programme | Product/service page | Low–moderate |
| `/online-addiction-recovery-programme-uk` | Research online recovery category | online addiction recovery UK | Informational category guide | Low–moderate; keep differentiated from product pricing and enrolment |
| `/family-addiction-intervention-uk` | Get help for another person | family addiction help/intervention | Family problem/next-step intent | Low |

No new public page was created.

## 6. Private-rehab hero performance

The `/private-rehab-uk` hero now uses a responsive `<picture>` with AVIF and WebP variants at 480, 768, 1024 and 1536 pixels, with the existing PNG as fallback. The image has intrinsic `1536 × 1024` dimensions, `loading="eager"`, `fetchpriority="high"` and async decoding.

| Asset | Bytes |
|---|---:|
| Original PNG | 2,245,523 |
| 480 AVIF / WebP | 10,507 / 15,902 |
| 768 AVIF / WebP | 18,378 / 30,794 |
| 1024 AVIF / WebP | 26,690 / 46,746 |
| 1536 AVIF / WebP | 44,457 / 84,416 |

The main JavaScript bundle remains a performance risk at approximately 953 KB uncompressed / 272 KB gzip. It was not split further in this tightly scoped pass. Core Web Vitals field validation should be repeated after release once sufficient traffic is available.

## 7. Verification completed

| Check | Result |
|---|---|
| Production Vite build | Pass; 1,941 modules transformed |
| Static prerender | Pass; 40 regular routes, 4 country routes and 35 articles |
| Sitemap generation | Pass; 73 indexable URLs |
| Static SEO verifier | Pass; canonicals, noindex rules, article bodies, 404 handling and sitemap consistency |
| Raw-HTML orphan assertion | Pass; zero indexable orphans |
| TypeScript `--noEmit` | Pass |
| `git diff --check` | Pass |
| Default/rejected consent browser test | Pass; no GTM or Meta scripts |
| Analytics-only browser test | Pass; GTM present, Meta absent |
| Marketing browser test | Pass; Meta present, no noscript tracking image |
| Consent revocation browser test | Pass; reload removes third-party scripts |
| Enquiry form with rejected consent | Pass; form present and submit control enabled |
| `/get-help` rendered metadata | Pass; correct title, H1, canonical and `index, follow` |
| `/clinical-disclaimer` raw metadata | Pass; self-canonical and `noindex, follow`; absent from sitemap |
| Event runtime/deduplication test | Pass; one page view per pathname, submit deduped, sensitive test parameters stripped |
| Trailing-slash redirects/query preservation | Pass locally |
| Responsive private-rehab image markup | Pass in rendered browser DOM |

Build warnings retained for follow-up: three existing sourcemap warnings, an assessment scorer split warning, and the large main JavaScript chunk.

The workspace's existing package links were stale, so validation used a compatible cached Node dependency toolchain. Before another developer rebuilds from a clean checkout, run the repository's normal `pnpm install` workflow; no dependency or lockfile change is part of this remediation.

No real production enquiry, email, CRM, Zapier or assessment record was created during testing. The frontend still posts to the same enquiry and assessment API endpoints. A controlled staging submission must verify downstream delivery before release; that cannot be proved from a static/local build without creating an external record.

## 8. Manual platform actions required

### Google Tag Manager

1. Back up the current container and create a new workspace/version.
2. Configure the GA4 configuration/Google tag with automatic page-view sending disabled (`send_page_view: false`). Do not also use History Change page-view triggers.
3. Create Custom Event triggers for the exact event names in the mapping table. Remove or pause legacy triggers such as `irn_enquiry_conversion`, old form-submit listeners, click triggers that duplicate the app's phone/WhatsApp events, and direct Meta lead/page-view tags.
4. Send only the allow-listed event parameters. Do not create variables from form fields, assessment answers, query-string free text, URL fragments or DOM text that may contain health information.
5. Require `analytics_storage` for GA4 tags. Require `ad_storage` for basic advertising tags. Do not override the application's denied `ad_user_data` or `ad_personalization` settings.
6. Preview the container in all three states: no choice/rejected, analytics only, and analytics plus marketing. Confirm exactly one event for each deliberate action.
7. Publish only after GA4 DebugView and the consent-state tests pass.

### Google Analytics 4

1. Mark only the agreed successful lead events as key events. Do not mark page views, start events or generic clicks as conversions.
2. Register only useful, non-sensitive custom dimensions such as `service_interest`, `cta_location` and `device_category`.
3. Check DebugView for one `spa_page_view` per route and one successful submit per API-confirmed enquiry.
4. Review data retention, Google Signals, ads personalisation and data sharing against current legal advice. For this service, keep Signals and ads personalisation off unless a documented lawful basis and DPIA support them.
5. Add internal/developer traffic filters so preview and QA sessions do not contaminate reporting.

### Google Search Console

1. After deployment, inspect the live robots file and sitemap, then resubmit `https://www.insightrecoverynetwork.com/sitemap.xml`.
2. Request indexing for `/get-help`, `/private-rehab-uk`, `/treatment-placement` and other revised commercial routes.
3. Validate that `/clinical-disclaimer` changes to excluded by `noindex` over time; do not use the temporary removal tool unless urgent deindexing is required.
4. Monitor duplicate-title/canonical reports and query overlap between the home, placement and private-rehab pages for at least 4–8 weeks.

### Meta

1. Expect browser pixel activity to reduce because automatic PageView and Lead events have been deliberately removed.
2. Do not re-enable URL/title-bearing health-page events or upload assessment/enquiry details.
3. If Meta conversion measurement is commercially required, obtain privacy/legal approval and design a restricted server-side event using a non-sensitive event name, consent proof and no URL, title, diagnosis, treatment interest, assessment content or free text. Test it in Events Manager before any release.

### Release and business verification

1. Deploy first to a Replit staging/custom-domain equivalent if available.
2. Repeat edge checks for HTTP→HTTPS, non-www→www and trailing slash behavior in no more than one redirect hop.
3. Submit one clearly identified test enquiry for each public form and one test assessment. Confirm database creation, acknowledgement email, internal notification, CRM/Zapier delivery and the correct success-only analytics event. Delete or label those test records according to the retention policy.
4. Confirm the GTM container version ID and GA4 key-event changes in the release log.
5. Re-run PageSpeed Insights and inspect real-user Core Web Vitals after sufficient post-release traffic.

## 9. Remediation files

Core measurement and consent:

- `index.html`
- `src/main.tsx`
- `src/App.tsx`
- `src/lib/analytics.ts`
- `src/lib/consent.ts` (new)
- `src/components/CookieConsent.tsx` (new)
- `src/components/layout/Footer.tsx`
- `src/components/layout/Navbar.tsx`
- `src/components/WhatsAppFloat.tsx`
- `src/components/forms/ContactForm.tsx`
- `src/components/assessment/AssessmentEngine.tsx`
- `src/pages/GetHelp.tsx`
- `src/pages/assessments/AssessmentPage.tsx`
- `src/pages/assessments/AlcoholDetoxAssessment.tsx`
- `src/pages/ServicesPricingGuide.tsx`
- `src/pages/not-found.tsx`

Technical SEO and crawl controls:

- `public/robots.txt`
- `public/sitemap.xml`
- `scripts/prerender-meta.mjs`
- `scripts/verify-static-seo.mjs`
- `src/components/SEO.tsx`
- `src/pages/legal/ClinicalDisclaimer.tsx`
- `src/pages/legal/CookiePolicy.tsx`
- `src/pages/legal/PrivacyPolicy.tsx`
- `vite.config.ts`

Intent, conversion-path and CTA alignment:

- `src/pages/Home.tsx`
- `src/pages/TreatmentPlacement.tsx`
- `src/pages/PrivateRehabUK.tsx`
- `src/pages/PrivateRehabAlternativeUK.tsx`
- `src/pages/RehabCostUK.tsx`
- `src/pages/PremiumTreatmentPage.tsx`
- `src/pages/DestinationRehab.tsx`
- `src/pages/OnlineProgramme.tsx`
- `src/pages/OnlineAddictionRecoveryUK.tsx`
- `src/pages/FamilyInterventionUK.tsx`
- `src/pages/ProfessionalAddictionSupport.tsx`
- `src/pages/AddictionHelpCornwall.tsx`
- `src/pages/About.tsx`
- `src/pages/AboutInsightRecoveryNetwork.tsx`
- `src/pages/WhatWeOffer.tsx`
- `src/pages/ResourcesList.tsx`
- `src/pages/ResourceDetail.tsx`
- `src/pages/assessments/AssessmentsIndex.tsx`
- `src/components/ui/cta-section.tsx`

New responsive assets:

- `public/private-rehab-uk-hero-{480,768,1024,1536}.avif`
- `public/private-rehab-uk-hero-{480,768,1024,1536}.webp`

The repository already contained unrelated uncommitted API/schema and website changes before this pass. They were preserved and are not represented as remediation work in this report.

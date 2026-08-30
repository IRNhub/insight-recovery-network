# Prerender and React parity architecture

Date: 24 July 2026
Status: architecture decision recorded before parity code changes
Deployment: on hold

## Current architecture

### React output

- Route components in `src/pages/` render visible content.
- Each route uses `src/components/SEO.tsx` with `react-helmet-async` for title, description, canonical, robots, Open Graph and Twitter metadata.
- Article metadata and Article/FAQ/Breadcrumb JSON-LD are derived from the selected object in `src/data/articles.ts` by `src/pages/ResourceDetail.tsx`.
- Important commercial routes are already partly wired to the in-scope, untracked `src/data/route-parity.js` configuration and `src/components/RouteSchemas.tsx` component found in the worktree at the start of this task.
- `src/main.tsx` uses `createRoot`. It replaces the static fallback rather than hydrating it.

### Static output

- `scripts/prerender-meta.mjs` runs after the Vite build.
- It copies `dist/public/index.html` into flat route HTML files.
- The `PAGES` array independently defines titles, descriptions, canonicals, manually written fallback HTML and some route JSON-LD.
- `buildStaticServiceEnhancement()` adds another manually maintained layer of service summaries, related links and selected FAQs.
- Article bodies and article JSON-LD are generated from the shared article dataset, but article title-tag branding is handled separately.
- Metadata/schema tags written by the static pass are marked `data-prerendered-meta` and `data-prerendered-jsonld` so page components can remove or replace them after the React mount.

## Duplication and drift

| Concern | React source | Static source before this pass | Risk |
|---|---|---|---|
| Commercial title/description/canonical | Page `<SEO>` props, now partly `route-parity.js` | `PAGES` objects | Direct drift |
| H1 and hero introduction | Page JSX, now partly `route-parity.js` | Handwritten `PAGES[].body` | Direct drift |
| Primary CTA | Page JSX and shared CTA config on migrated routes | Handwritten anchors in `PAGES[].body` | Stale conversion route |
| Service schema | Route JSX / `RouteSchemas` | `PAGES[].jsonLd` on selected routes only | Schema available only after JS |
| FAQ schema | Local page FAQ arrays | Separate static FAQ arrays or none | Conflicting/partial FAQs |
| Article title | `SEO` automatically adds site suffix | `article.pageTitle` written directly | Brand suffix drift |
| Core fallback sections | React JSX | Large handcrafted HTML strings | Claims and headings can diverge |

## Smallest safe architecture

Retain Vite, React, `createRoot` and the post-build static generator. Do not introduce SSR or another framework.

Use `src/data/route-parity.js` as the shared contract for the eight parity-critical commercial routes; the representative article continues to use the shared article dataset:

- title
- description
- canonical path and indexability
- H1 and hero introduction
- primary CTA label/destination/analytics classification
- Service/WebPage/Breadcrumb schema fields
- shared visible FAQs where applicable
- a small set of parity-critical section headings/highlights used by the raw fallback and verified against the browser page

`scripts/prerender-meta.mjs` will import that same JavaScript module, overlay the matching `PAGES` entries, generate the parity-critical hero/CTA from it, and inject the same schema entities. React will continue using `SEO` and `RouteSchemas` backed by the same module.

The large handcrafted fallbacks remain for non-parity routes. For the eight audited commercial routes, the shared contract becomes authoritative for the fields that affect search intent, conversion and structured data. Automated tests will fail if the raw and mounted outputs disagree on those fields or if a required shared heading is missing from the mounted page.

Article bodies continue to use `src/data/articles.ts`. A single title helper in the prerender script will match the `SEO` component convention: `Article Title | Insight Recovery Network`.

## Mount and cleanup contract

Continuing with `createRoot` is acceptable for this pass because the initial HTML already contains meaningful content and the mounted route restores the full page. The parity verifier must confirm after mount:

- exactly one title
- exactly one canonical
- exactly one description
- exactly one robots directive
- one entity for each expected JSON-LD `@id`/type
- no surviving `data-prerendered-meta` or `data-prerendered-jsonld` elements
- the shared H1, hero copy and primary CTA are still present

This approach removes the identified ongoing duplication without a framework migration or broad content rewrite.

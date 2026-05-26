---
name: IRN SEO Architecture
description: How SEO metadata, schemas, and OG images are structured and where to update them for the IRN website.
---

## Dual-layer metadata pattern
Every page's SEO metadata lives in two places — both must be kept in sync:
1. **React component** (`src/pages/*.tsx`) — used by JS-rendered browsers and Google's JS crawler. Uses `<SEO>` component (react-helmet-async) for title/description/canonical/ogImage, and `<Helmet>` for page-level JSON-LD schemas.
2. **Prerender script** (`scripts/prerender-meta.mjs`) — static HTML for non-JS crawlers. Each page has a `body:` template with H1 and visible content, plus top-level `title`, `description`, `ogImage` fields.

## OG images
- Source of truth: `src/config/og-pages.ts` — `OG_PAGES` array.
- Generated at build time via `scripts/generate-og-images.ts` (runs first in the build script).
- Pages that use OG images must import `ogImageUrl` from `@/config/og-pages` and pass to `<SEO ogImage={}>`.
- To add a new OG image: add entry to OG_PAGES, add `ogImage` prop in React page, update prerender ogImage field, then run build.

## Global JSON-LD schemas
- Organization, WebSite, Person (Craig Bilton) schemas are in `Layout.tsx` via `<Helmet>` — injected on every page.
- Service/SoftwareApplication schemas are inline in each service page via `<Helmet>`.

## H1 update checklist
When changing a page H1, update in BOTH:
1. React page JSX (what JS-rendered users see)
2. `prerender-meta.mjs` PAGES body HTML (what non-JS crawlers see)

**Why:** The prerender generates static HTML from the body template. It does not extract content from the React component — it's independently authored. Updating only the React page leaves crawler-visible H1s stale.

## Contact email
Correct emails are `info@insightrecoverynetwork.com` (general) and `craig@insightrecoverynetwork.com` (clinical). Never `support@`.

## www vs non-www canonical
Canonical domain is **https://www.insightrecoverynetwork.com** (with www).
All SITE_URL references, JSON-LD schemas, OG tags, sitemap, and canonicals must use www.
The bare domain is redirected to www in two places:
1. `App.tsx` Router() — client-side, checks `window.location.hostname === "insightrecoverynetwork.com"`
2. `vite.config.ts` serverRedirectsPlugin — server-side 301 (only applies when vite preview runs)

## The /assessments and /resources directory-redirect loop
Both routes exist as BOTH a `.html` file AND a same-named directory in `dist/public/`.
The static server (CDN) sees the directory and issues a 302 to the trailing-slash URL.
**Never use `window.location.replace()` for trailing-slash stripping** — it causes a
full page reload which re-triggers the directory redirect = infinite loop.
The fix: use `history.replaceState() + dispatchEvent(new PopStateEvent("popstate"))`.
This rewrites the URL client-side without any HTTP request to the server.

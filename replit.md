# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Primary artifact is the Insight Recovery Network Phase 1 marketing website.

## Artifacts

### IRN Website (`artifacts/irn-website`) — served at `/`
Premium, mobile-first marketing website for Insight Recovery Network. React + Vite + TypeScript + Tailwind CSS. No backend — frontend only.

**Pages:**
- `/` — Home
- `/about` — About
- `/what-we-offer` — What We Offer
- `/treatment-placement` — Treatment Placement
- `/online-programme` — Online Programme
- `/insight-os` — Insight OS
- `/contact` — Contact (frontend-only form with confirmation state)
- `/resources` — Resources list with category filter
- `/resources/:slug` — Individual article detail page

**Design:** Playfair Display (serif headings) + Plus Jakarta Sans (body). Palette: deep navy/charcoal, warm ivory background, muted gold accent, soft sage. No backend connected. Contact form is frontend-only.

**Components:** Layout, Navbar, Footer, Button, SectionHeader, PageHero, PathwayCard, ServicePreview, CTASection, ContactForm, ArticleCard — all in `artifacts/irn-website/src/components/`

**Article data:** Static TypeScript data at `artifacts/irn-website/src/data/articles.ts` — 6 seed articles across 4 categories (Addiction & Substances, Treatment Options, Recovery & Wellbeing, Mental Health, Family & Relationships). Metadata includes slug, author, authorRole, date, readingTime, category, and full article content.

### API Server (`artifacts/api-server`) — served at `/api`
Express 5 API server. Currently only has a health check endpoint. Will be extended for contact form submission in Phase 2.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite + Tailwind CSS + wouter (routing) + react-hook-form + zod
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM (not yet used)
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally
- `pnpm --filter @workspace/irn-website run dev` — run IRN website locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## User Preferences

### Blog / Resources content rules
1. Never auto-generate blog articles. Only add articles when the user provides the final approved article text.
2. Add supplied article text exactly as provided — do not shorten, summarise, rewrite, or replace any part.
3. Preserve all headings, subheadings, paragraphs, FAQs, internal links, calls to action, and clinical disclaimers exactly as written.
4. Each article must support: `seoTitle` (unique `<title>` tag), `metaDescription` (unique meta description), canonical URL, `ogTitle` and `ogDescription` (Open Graph), Article JSON-LD schema, and sitemap inclusion.
5. If an existing article has thin content, flag it for review — do not silently replace it with more thin content.
6. Article fields live in `artifacts/irn-website/src/data/articles.ts` (`Article` interface). Use `publishedStatus: "draft"` or `"unlisted"` to hide an article without deleting it. Default is published (no field = published).
7. After any blog/article changes, always provide the direct URL so it can be manually reviewed.
8. Writing tone: professional, human, clinically informed, calm, discreet, and specific to Insight Recovery Network. Avoid generic AI marketing language, exaggerated claims, and anything clinically unsafe.

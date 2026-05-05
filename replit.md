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

**Design:** Playfair Display (serif headings) + Plus Jakarta Sans (body). Palette: deep navy/charcoal, warm ivory background, muted gold accent, soft sage. No backend connected. Contact form is frontend-only.

**Components:** Layout, Navbar, Footer, Button, SectionHeader, PageHero, PathwayCard, ServicePreview, CTASection, ContactForm — all in `artifacts/irn-website/src/components/`

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

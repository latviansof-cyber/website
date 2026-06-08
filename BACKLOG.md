# DLA Website – Product Backlog (Jira-style)

> Project: **Latvian Association of Darwin (Dārvinas Latviešu Apvienība)** website
> Stack: **Next.js 15 (App Router) + React 19 + Tailwind CSS v4 + Payload CMS 3 + Cloudflare Workers (OpenNext)**
> Convention: tickets prefixed `DLA-` (Darwin Latvian Association).
> Status legend: `To Do` | `In Progress` | `Blocked` | `Done`

 ---

## Epic DLA-100 – Static bilingual frontend (Phase 1, no CMS)

Build the public marketing site in English and Latvian, using the copy provided by the client and a layout inspired by https://www.uaant.org.au. No Payload collections are wired yet — all content is hard-coded in components so the structure can later be swapped for CMS-driven data.

| Ticket | Title | Type | Priority | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| DLA-101 | Create `BACKLOG.md` task tracker | Chore | Medium | Done | This file. |
| DLA-102 | Tailwind CSS v4 styling via Play CDN (CDN chosen because sandbox blocks `npm install`; will be replaced by `@tailwindcss/postcss` build step in CI) | Task | High | Done | `preview/index.html` uses `cdn.tailwindcss.com`; production will switch to PostCSS build. |
| DLA-103 | Build `SiteHeader` (logo, nav, EN/LV switcher) | Story | High | Done | `components/SiteHeader.tsx` – sticky, semantic `<header>` + `<nav>`, skip link, mobile sub-nav. |
| DLA-104 | Build `Hero` section with association name (EN + LV) | Story | High | Done | `components/Hero.tsx` – gradient banner, eyebrow, balanced H1, CTA. |
| DLA-105 | Build `About` section (EN + LV body text) | Story | High | Done | `components/TextSection.tsx` with `id="about"`, semantic landmark, EN + LV copy. |
| DLA-106 | Build `History` section (EN + LV body text) | Story | High | Done | `components/TextSection.tsx` with `id="history"`, semantic landmark, EN + LV copy. |
| DLA-107 | Build `Events` grid with 5 cards (EN + LV) | Story | High | Done | `components/Events.tsx` – 1/2/3-column responsive grid, accent chips per event. |
| DLA-108 | Build `SiteFooter` (contact, copyright, social placeholders) | Story | Medium | Done | `components/SiteFooter.tsx` – 3-column grid, copyright, email, sitemap. |
| DLA-109 | Implement i18n context (`LanguageProvider`) with EN/LV toggle, persisted in `localStorage` | Story | High | Done | `i18n/LanguageProvider.tsx` – typed `Lang = "en" \| "lv"`, `localStorage` key `dla.lang`, navigator fallback. |
| DLA-110 | Translate all UI chrome (nav, buttons, footer) | Task | Medium | Done | `i18n/content.ts` carries `nav`, `hero`, `footer`, and chrome strings for both languages. |
| DLA-111 | Replace `app/(frontend)/page.tsx` with bilingual site | Task | High | Done | `page.tsx` now mounts `LanguageProvider` + `SiteHeader` + sections + `SiteFooter`. |
| DLA-112 | Provide offline preview + production-ready source | Task | Medium | Done | `preview/index.html` mirrors the React components and is openable directly in a browser; production build uses the same content map. |

**Definition of Done for DLA-100**

 - [x] Static preview renders without errors (`preview/index.html`)
 - [x] Language switcher flips all visible copy between EN and LV
 - [x] Layout is responsive (tested 320px → 1280px breakpoints)
 - [x] No console errors; Tailwind utility classes apply correctly
 - [x] All semantic landmarks present (`<header> <nav> <main> <section id="…"> <footer>`)

 ---

## Epic DLA-200 – Payload CMS data model (Phase 2)

| Ticket | Title | Type | Priority | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| DLA-201 | Add `Pages` global with `about`, `history` rich text (EN + LV) | Story | High | To Do | Use `localized: true` arrays/fields. |
| DLA-202 | Add `Events` collection (title, body, order, date) localized | Story | High | To Do | Slug + draft/publish workflow. |
| DLA-203 | Add `SiteSettings` global (association name, contact email, social URLs) | Story | Medium | To Do | Drives header/footer. |
| DLA-204 | Add `Media` collection + R2 storage adapter (already present) | Task | Medium | To Do | Verify bucket binding in `wrangler.jsonc`. |
| DLA-205 | Seed dev DB with current hard-coded copy | Task | Medium | To Do | Migration script. |
| DLA-206 | Switch frontend sections to fetch from Payload Local API | Story | High | To Do | Replace hard-coded constants. |

 ---

## Epic DLA-300 – i18n routing & polish (Phase 3)

| Ticket | Title | Type | Priority | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| DLA-301 | Move from client-side toggle to `/en/...` and `/lv/...` routes | Story | Medium | To Do | Use `next-intl` or App Router `[locale]` segment. |
| DLA-302 | Add `<html lang>` and SEO meta per locale | Task | Medium | To Do | OpenGraph + hreflang. |
| DLA-303 | Add sitemap and robots | Task | Low | To Do | Per-locale URLs. |
| DLA-304 | Accessibility audit (axe, focus order, contrast) | Task | Medium | To Do |  |
| DLA-305 | Performance pass: image optimization, font subsetting | Task | Low | To Do |  |

 ---

## Epic DLA-400 – Deployment to Cloudflare (Phase 4)

| Ticket | Title | Type | Priority | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| DLA-401 | Verify `wrangler.jsonc` bindings (D1, R2, secrets) | Task | High | To Do | Already scaffolded in template. |
| DLA-402 | Configure `open-next.config.ts` for production | Task | High | To Do |  |
| DLA-403 | Add `pnpm deploy:database` and `pnpm deploy:app` workflow docs | Task | Medium | To Do | Update `README.md`. |
| DLA-404 | Custom domain + DNS | Task | Medium | To Do |  |
| DLA-405 | Smoke-test production preview (`pnpm preview`) | Task | Medium | To Do |  |

 ---

## How to use this file

1. Pick the next ticket with `Status: To Do` in priority order.
2. Change its status to `In Progress` while you work on it.
3. When finished, change it to `Done` and tick the DoD items in the relevant epic.
4. Add new discovered work as a new row with the next `DLA-###` number.


---


---

## Status legend

`To Do` � `In Progress` � `Blocked` � `Done`

## Done (merged into main)

| Ticket | Title | Notes |
| --- | --- | --- |
| DLA-101 | Create `BACKLOG.md` task tracker | Initial Jira-style backlog. |
| DLA-102 | Tailwind v4 styling + offline preview | Play CDN preview, styles.css in src. |
| DLA-103 | SiteHeader with EN/LV switcher | v1 of header. |
| DLA-104 | Hero section with association name | v1 of hero. |
| DLA-105 | About section | v1 copy block. |
| DLA-106 | History section | v1 copy block. |
| DLA-107 | Events grid (5 cards) | v1 list. |
| DLA-108 | SiteFooter | v1 of footer. |
| DLA-109 | i18n context (LanguageProvider) | v1 client context. |
| DLA-110 | Translate all UI chrome | Bilingual content map. |
| DLA-111 | Wire bilingual page.tsx | v0 home shell. |
| DLA-251 | Tailwind v4 wiring (`postcss.config.mjs` + `globals.css`) | Tailwind v4 with `@tailwindcss/postcss`, `@theme` design tokens. |
| DLA-252 | Polish components (frosted header, decorative hero, refined cards) | New `ui/` primitives (Container / Section / Eyebrow / Chip / Button). |
| DLA-351 | Zod runtime validation for content | `src/lib/validation.ts` + safe module-load validation in `i18n/content.ts`. |
| DLA-352 | Safe LanguageProvider persistence | `LangSchema.safeParse` around `localStorage`. |
| DLA-451 | Configure Jest for App Router + RTL | `jest.config.ts`, `jest.setup.ts`, `tests/unit/`. |
| DLA-452 | Unit tests: `LanguageSwitcher` state changes | 4 tests. |
| DLA-453 | Unit tests: zod validation logic | 9 tests. |
| DLA-501 | Audit fixes (jest config + TODO comments + unused import) | Renames `setupFilesAfterEach` > `setupFilesAfterEnv`; drops unused `within` import; adds 4 `TODO(DLA-�)` markers. |

---

## To Do (next iteration)

### Phase 2 � Payload CMS data model

| Ticket | Title | Priority | Notes |
| --- | --- | --- | --- |
| DLA-201 | `Pages` global with `about`, `history` rich text (EN + LV) | High | Use `localized: true` arrays/fields. |
| DLA-202 | `Events` collection (title, body, order, date) localized | High | Slug + draft/publish workflow. |
| DLA-203 | `SiteSettings` global (association name, contact email, social URLs) | Medium | Drives header/footer brand strings (replaces hard-coded "DLA" mark in `SiteHeader.tsx`). |
| DLA-204 | `Media` collection + R2 storage adapter | Medium | Adapter already installed (`@payloadcms/storage-r2`); verify bucket binding. |
| DLA-205 | Seed dev DB with current hard-coded copy | Medium | Migration script. |
| DLA-206 | Switch frontend sections to fetch from Payload Local API | High | Replace `contentByLang` in `i18n/content.ts` with `payload.findGlobal({ slug: 'pages' })`. |

### Phase 3 � i18n routing & polish

| Ticket | Title | Priority | Notes |
| --- | --- | --- | --- |
| DLA-301 | Move from client-side toggle to `/en/...` and `/lv/...` routes | High | App Router `[locale]` segment; `LanguageProvider` falls back to URL locale. Fixes "flash of English" issue (see TODO in `LanguageProvider.tsx`). |
| DLA-302 | Add `<html lang>` and SEO meta per locale | Medium | OpenGraph + hreflang. |
| DLA-303 | Add sitemap and robots | Low | Per-locale URLs. |
| DLA-304 | Accessibility audit (axe, focus order, contrast) | Medium |  |
| DLA-305 | Performance pass: image optimization, font subsetting | Low |  |

### Phase 4 � Deployment to Cloudflare

| Ticket | Title | Priority | Notes |
| --- | --- | --- | --- |
| DLA-401 | Verify `wrangler.jsonc` bindings (D1, R2, secrets) | High | Already scaffolded in template. |
| DLA-402 | Configure `open-next.config.ts` for production | High |  |
| DLA-403 | Document `pnpm deploy:database` and `pnpm deploy:app` workflow | Medium | Update `README.md`. |
| DLA-404 | Custom domain + DNS | Medium |  |
| DLA-405 | Smoke-test production preview (`pnpm preview`) | Medium |  |

### Maintenance

| Ticket | Title | Priority | Notes |
| --- | --- | --- | --- |
| DLA-502 | Sync `package.json` / `package-lock.json` with `pnpm install` output | Low | Workspace drift is benign (pnpm normalises JSON + adds `tailwindcss` + `@tailwindcss/postcss` to devDeps); commit as a single "chore" so future clones don't re-run the install. |

---


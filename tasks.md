# DLA Website – Task Checklist

**Status:** Tracking completed and pending work. Generated 2026-07-28.

---

## Phase 1 — Static Bilingual Frontend ✅

- [x] Bilingual English/Latvian site with React components
- [x] Language switching via `LanguageProvider` context
- [x] Responsive layout (320px–1280px)
- [x] Tailwind v4 with design tokens
- [x] Jest unit tests for core components

---

## Phase 2 — Payload CMS & Frontend Integration ✅

### Section 0: Critical Security

- [x] **DLA-SEC-1** — Validate `PAYLOAD_SECRET` at startup (no empty fallback) — `src/payload.config.ts:35-38`

### Section 1: CMS Data Schemas

- [x] **DLA-201** — Create `Pages` Global with rich text `about` + `history` (EN/LV)
- [x] **DLA-202** — Create `Events` Collection with localized event listing
- [x] **DLA-203** — Create `SiteSettings` Global for brand name, contact, social links
- [x] **DLA-204** — Configure `Media` Collection + R2 storage adapter
- [x] **DLA-207** — Add SEO `meta` field group to `SpecialPages` Collection
- [x] **DLA-208** — Create `DonationSettings` Global for bank/PayID details

### Section 2: Frontend → CMS Integration

- [x] **DLA-206** — Replace hardcoded `content.ts` data with Payload Local API calls
  - [x] `src/lib/pages.ts` uses `getPayloadClient()`
  - [x] `src/lib/events.ts` uses `getPayloadClient()`
  - [x] `src/lib/homepage.ts` uses `getPayloadClient()`
  - [x] `src/lib/footer.ts` uses `getPayloadClient()`
  - [x] `src/lib/navigation.ts` uses `getPayloadClient()`
  - [x] `src/lib/siteSettings.ts` uses `getPayloadClient()`
  - [x] `src/lib/donationSettings.ts` uses `getPayloadClient()`
  - [x] `src/lib/specialPages.ts` uses `getPayloadClient()`
- [x] **DLA-205** — Seed dev database with current hardcoded content (`src/seed.ts`)

---

## Phase 3 — Bug Fixes & Code Quality ✅

- [x] **DLA-209** — Rewrite `DonationWidget` tests to match actual component
- [x] **DLA-210** — Fix `getWebsiteEvents()` to return `fallbackEvents` on error
- [x] **DLA-211** — Extract duplicate `slugValidator` to shared utility
- [x] **DLA-212** — Extract duplicate `mediaURL` helper to shared module (`src/lib/media.ts`)
- [x] **DLA-213** — Replace array index React keys with stable keys
- [x] **DLA-214** — Replace inline `style` in Hero with Tailwind utilities
- [x] **DLA-215** — Add error handling + `useCallback` to clipboard `handleCopy` (`src/app/(frontend)/donate/DonationWidget.tsx:63`)
- [x] **DLA-216** — Replace opaque TODO(DLA-NNN) comments with self-describing text
- [x] **DLA-217** — Add special pages (about, privacy, etc.) to sitemap (`src/app/sitemap.ts`)
- [x] **DLA-218** — Fix E2E tests to check actual DLA content, not Payload template

---

## Phase 4 — i18n URL Routing ✅

- [x] **DLA-301** — Move from client-side toggle to `/en/...` and `/lv/...` routes
  - [x] Add `[locale]` dynamic segment to all routes under `(frontend)`
  - [x] Update `LanguageProvider` to detect locale from URL path
  - [x] Add `generateStaticParams` for `['en', 'lv']`
  - [x] Update all internal links to include locale prefix
- [x] **DLA-302** — Add `<html lang>` and locale-specific SEO meta
  - [x] Update `<html>` lang attribute based on URL locale
  - [x] Add canonical URLs for each locale
  - [x] Add hreflang links for EN/LV versions
- [x] **DLA-303** — Generate per-locale sitemap
- [x] **DLA-304** — Accessibility audit (axe, focus order, contrast)
- [x] **DLA-305** — Performance optimization (images, fonts)

---

## Phase 5 — Deployment to Cloudflare ✅

- [x] **DLA-401** — Verify `wrangler.jsonc` bindings (D1, R2, secrets)
- [x] **DLA-402** — Configure `open-next.config.ts` for production
- [x] **DLA-403** — Document deploy workflow in README (`pnpm deploy`, `pnpm deploy:database`, `pnpm deploy:app`)
- [x] **DLA-404** — Set up custom domain + DNS
- [x] **DLA-405** — Smoke-test production preview

---

## Maintenance ✅

- [x] **DLA-502** — Sync `package.json` / lockfile with `pnpm install` output

---

## Code Quality, Accessibility, SEO & UX Issues

### High Priority

- [x] **CQ-001** — Add `aria-hidden` to mobile navigation on desktop screens
  - **File:** `src/app/(frontend)/components/SiteHeader.tsx:81`
  - **Issue:** Mobile nav is hidden via CSS `sm:hidden` but not with `aria-hidden`, so screen readers may still announce it on desktop
  - **Fix:** Add `className="... sm:hidden sm:aria-hidden"`

- [x] **CQ-002** — Fix hardcoded `<html lang="en"` in frontend layout
  - **Files:** `src/app/(frontend)/layout.tsx:73`
  - **Issue:** Language is always `en` server-side, causes SEO issues and accessibility problems
  - **Fix:** Dynamic lang based on language state or request header (full fix deferred to DLA-301) — DONE in Phase 4 DLA-302

- [x] **CQ-003** — Replace array index React keys with stable identifiers
  - **File:** `src/app/(frontend)/components/TextSection.tsx:40` — uses `key={idx}`
  - **Issue:** React will re-render and lose state if paragraph order changes
  - **Fix:** Use `key={`p-${idx}`}` or better, use content hash

- [x] **SEO-001** — Add missing locale-specific hreflang links
  - **Files:** `src/app/(frontend)/layout.tsx`, `src/app/(frontend)/[slug]/page.tsx`, `src/app/(frontend)/donate/page.tsx`
  - **Issue:** No `hreflang` links to alternate language versions; search engines can't crawl Latvian variant
  - **Impact:** Duplicate content penalty, Latvian version not indexed separately
  - **Fix:** Add `alternates: { languages: { 'en-AU': '...', 'lv': '...' } }` to metadata — DONE in Phase 4 DLA-302

- [x] **SEO-002** — Add `og:locale:alternate` for Latvian in open graph
  - **Files:** `src/app/(frontend)/layout.tsx`, dynamic page metadata
  - **Issue:** Only `en_AU` locale in OG, no Latvian alternate declared
  - **Fix:** Add `alternateLocale: ['lv_LV']` to all OG metadata — DONE in Phase 4 DLA-302

- [x] **CQ-004** — Missing form error `aria-describedby` and `aria-invalid`
  - **File:** `src/app/(frontend)/donate/DonationWidget.tsx:295` (custom amount input)
  - **Issue:** Error state not announced to screen readers
  - **Fix:** Add `aria-describedby={errorId}` to input, `aria-invalid={!!error}` and `role="alert"` to error message

- [x] **CQ-005** — Tab buttons lack proper `role` and `aria-selected`
  - **File:** `src/app/(frontend)/components/Events.tsx:73-88` (upcoming/past tabs)
  - **Issue:** Tabs have `onClick` but no ARIA semantics for screen readers
  - **Fix:** Add `role="tablist"` to container, `role="tab"` to buttons, `aria-selected={activeTab === ...}`

### Medium Priority

- [x] **A-001** — Missing donation button keyboard focus indicator
  - **File:** `src/app/(frontend)/donate/DonationWidget.tsx` donate buttons
  - **Issue:** Buttons use `hover:` styles but no `focus-visible:` for keyboard accessibility
  - **Fix:** Add `focus-visible:ring-2 focus-visible:ring-offset-2`

- [x] **A-002** — Image loading performance — no lazy loading
  - **Files:** `src/app/(frontend)/components/TextSection.tsx:46`, `Events.tsx:133`, `ContentPage.tsx:60`
  - **Issue:** All images load eagerly; above-fold images should load early but below-fold should be lazy
  - **Fix:** Add `loading="lazy"` to non-hero images, `loading="eager"` to hero image

- [x] **A-003** — Missing Next.js Image component usage
  - **Files:** Multiple image tags using plain `<img>`
  - **Issue:** No automatic optimization, responsive sizing, or format conversion (WebP)
  - **Fix:** Replace `<img>` with `<Image>` from `next/image` for optimization

- [x] **CQ-006** — Hardcoded TODO comments still in code
  - **Files:** `src/app/(frontend)/page.tsx:52`, `src/app/(frontend)/i18n/LanguageProvider.tsx:79`
  - **Issue:** TODO comments reference completed tickets (DLA-201, DLA-203, DLA-302)
  - **Fix:** Remove or replace with self-describing comments about current status

- [x] **P-001** — No loading state on form submission
  - **File:** `src/app/(frontend)/donate/DonationWidget.tsx:52-59` (handleSubmit)
  - **Issue:** Button doesn't show loading state; user can't tell if submission is processing
  - **Fix:** Add `isLoading` state and disable submit button during processing

- [x] **P-002** — Missing page loading skeleton
  - **Files:** `src/app/(frontend)/page.tsx`, `src/app/(frontend)/[slug]/page.tsx`
  - **Issue:** Data loads with `force-dynamic`, no loading UI between page load and data fetch
  - **Fix:** Use React Suspense with skeleton components for page cards, events list

- [x] **CQ-007** — Console.log statements in production code
  - **Files:** `src/seed.ts` (multiple), `src/lib/specialPages.ts:265`, `src/lib/donationSettings.ts:93`
  - **Issue:** Debug logging left in production; clutters browser console
  - **Fix:** Remove or wrap in `if (process.env.NODE_ENV === 'development')`

### Low Priority / UX Polish

- [x] **UX-001** — No visual feedback when copying donation details to clipboard
  - **File:** `src/app/(frontend)/donate/DonationWidget.tsx:63`
  - **Issue:** User doesn't know copy succeeded; button doesn't change appearance
  - **Fix:** Show brief toast message or button state change on successful copy

- [x] **P-003** — Google Fonts missing `fetchpriority="high"`
  - **File:** `src/app/(frontend)/layout.tsx:76-78`
  - **Issue:** Fonts not prioritized; may cause layout shift
  - **Fix:** Add `fetchpriority="high"` to font link

- [x] **P-004** — Decorative SVG elements not optimized
  - **File:** `src/app/(frontend)/components/SiteHeader.tsx:66` (heart icon)
  - **Issue:** Inline SVG on every page load; no caching
  - **Fix:** Convert to static SVG asset or use optimized icon library

- [x] **A-004** — Mobile nav items not keyboard accessible
  - **File:** `src/app/(frontend)/components/SiteHeader.tsx:81-101`
  - **Issue:** Mobile nav links have no focus indicators
  - **Fix:** Add `focus-visible:` styles to mobile nav links

- [x] **SEO-003** — Missing `noindex` on draft/staging content
  - **Files:** `src/collections/SpecialPages.ts`, `src/collections/Pages.ts`
  - **Issue:** Draft pages may be accidentally indexed if leaked in URLs
  - **Fix:** Ensure `robots.index: false` for non-published content

- [x] **CQ-008** — No error boundary for component failures
  - **Files:** `src/app/(frontend)/components/Events.tsx`, `src/app/(frontend)/donate/DonationWidget.tsx`
  - **Issue:** Component errors crash entire page; no graceful fallback
  - **Fix:** Wrap in error boundary component

- [x] **CQ-009** — Regex in `handleCustomChange` has edge cases
  - **File:** `src/app/(frontend)/donate/DonationWidget.tsx:48-49`
  - **Issue:** `1.2.3` becomes `1.23`; `...` becomes `0`; edge cases not handled
  - **Fix:** Validate on submit instead of during input; clear feedback for invalid input

- [x] **P-005** — No caching headers on static assets
  - **Files:** Images in `public/images/`
  - **Issue:** Browser doesn't cache images; every page load fetches from server
  - **Fix:** Set `Cache-Control: public, max-age=31536000` on image responses

---

## Performance & Technical Debt

- [x] **PERF-001** — `getWebsitePage()` over-fetches all pages
  - **File:** `src/lib/pages.ts:305-307`
  - **Issue:** Fetches 100 pages every request to get 1; O(n) search on every page load
  - **Fix:** Add targeted Payload query with `where: { slug: { equals: slug } }`
  - **Impact:** ~10x faster page loads on dynamic routes

- [x] **TECH-001** — Missing unit tests for data modules
  - **Files:** No tests for `src/lib/pages.ts`, `src/lib/events.ts`, `src/lib/donationSettings.ts`, etc.
  - **Issue:** Payload API changes could break site silently
  - **Fix:** Add Jest tests for fallback logic and error handling

- [x] **TECH-002** — No integration tests for Payload migrations
  - **Files:** `src/migrations/`
  - **Issue:** Schema migrations not validated; could corrupt database
  - **Fix:** Add Vitest integration tests that run migrations against test D1

---

## Known Issues & Deferred Work

### Deferred Items (All Resolved)

- ✅ **A-1:** Language flash on first paint (solved by DLA-301)
- ✅ **CQ-002:** Dynamic `<html lang>` attribute (solved by DLA-302)

### Deferred to Performance Phase

- **B-5:** `getWebsitePage()` over-fetches all pages
- **P-003, P-004, P-005:** Font and image optimization

---

## Summary

**Phase 1:** ✅ Complete  
**Phase 2:** ✅ Complete  
**Phase 3:** ✅ Complete  
**Phase 4:** ✅ Complete  
**Phase 5:** ✅ Complete  

**🚀 All phases complete — Ready to deploy to Cloudflare**

---

## Remaining Code Quality Issues (Optional Enhancements)

**Code Quality Issues Found:** 26 items  
**Priority:** 7 high, 8 medium, 11 low  

**Optional future improvements (not blocking deployment):**
1. Fix critical SEO issues (additional hreflang refinements) 
2. Fix accessibility issues (aria-hidden, aria-selected, focus states) 
3. Replace `<img>` with Next.js Image component for optimization
4. Remove console.log from production code 

# DLA Website – Product Backlog

> Project: **Latvian Association of Darwin (Dārvinas Latviešu Apvienība)** website
> Stack: **Next.js 15 (App Router) + React 19 + Tailwind CSS v4 + Payload CMS 3 + Cloudflare Workers (OpenNext)**
> Ticket prefix: `DLA-`

---

## Phase 1 — Static bilingual frontend ✅ **Complete**

- Bilingual English/Latvian site with React components
- Language switching via `LanguageProvider` context
- Responsive layout (320px–1280px)
- Tailwind v4 with design tokens
- Jest unit tests for core components

**Key principle for remaining phases:** move hardcoded content into Payload CMS so editors can update text without code changes. Accept zero or minimal hardcoded fallbacks.

---

## Current Phase: Phase 2 — Payload CMS & Frontend Integration

### SECTION 0: Critical Security (do FIRST, blocks everything)

| Ticket | Title | Priority |
|--------|-------|----------|
| DLA-SEC-1 | Validate `PAYLOAD_SECRET` at startup — no empty fallback | **Critical** |
| DLA-SEC-2 | Replace `as any` logger with typed interface | **High** |

**DLA-SEC-1: Validate `PAYLOAD_SECRET` at startup**

- **Why:** `PAYLOAD_SECRET` currently falls back to `''` (empty string) if the env var is missing. An empty secret is trivially guessable, letting attackers forge session tokens and take over the admin panel.
- **Action:** Remove the `|| ''` fallback in `src/payload.config.ts:77`. Add a startup check that throws a clear error with remediation steps if `PAYLOAD_SECRET` is not set.
- **AC:** Server refuses to start without a proper secret; error message tells you how to generate one.

**DLA-SEC-2: Replace `as any` logger with proper interface**

- **Why:** The `cloudflareLogger` object in `src/payload.config.ts:46` is typed as `any`, bypassing all TypeScript checks. If Payload's logger API changes in a future version, there will be no compile error — only a runtime crash.
- **Action:** Define a local `PayloadLogger` interface with all required methods (`trace`, `debug`, `info`, `warn`, `error`, `fatal`, `silent`). Type the logger object against it. Remove the `as any` cast.
- **AC:** No `as any` on logger; TypeScript catches API mismatches at compile time.

---

### SECTION 1: CMS Data Schemas (build the admin-editable content containers)

| Ticket | Title | Priority |
|--------|-------|----------|
| DLA-201 | Create `Pages` Global — rich text `about` + `history` (EN/LV) | **High** |
| DLA-202 | Create `Events` Collection — localized event listing | **High** |
| DLA-203 | Create `SiteSettings` Global — brand name, contact, social links | **Medium** |
| DLA-204 | Configure `Media` Collection + R2 storage adapter | **Medium** |
| DLA-207 | Add SEO `meta` field group to `SpecialPages` Collection | **High** |
| DLA-208 | Create `DonationSettings` Global — bank/PayID details | **High** |

---

**DLA-201: Create `Pages` Global — rich text `about` + `history`**

- **Why:** Currently, the "About Us" and "History" text lives in hardcoded `src/app/(frontend)/i18n/content.ts`. Editors can't change it without a developer. These are the two most frequently updated content sections.
- **What:** A new Payload **Global** (singleton, single entry) with two bilingual rich text fields — `about` and `history` — using the Lexical WYSIWYG editor (already configured).
- **Depends on:** DLA-SEC-1, DLA-SEC-2 (for safe admin access)
- **Action:**
  1. Create `src/globals/Pages.ts` with slug `pages`, following the pattern in `src/globals/Homepage.ts`
  2. Use bilingual `en`/`lv` tabs with `type: 'richText'` fields for `about` and `history`
  3. Register in `src/payload.config.ts` globals array
  4. Create `src/lib/pagesGlobal.ts` — a fetch helper (pattern: `src/lib/homepage.ts`)
  5. Update `src/app/(frontend)/components/TextSection.tsx` to fetch from CMS instead of hardcoded `content.ts`
- **AC:** Editor can write/edit "About Us" and "History" with bold, italic, links, headings in admin panel; changes appear on homepage without code deploy.

---

**DLA-202: Create `Events` Collection — localized event listing**

- **Why:** Events are currently static/hardcoded in `content.ts`. The association needs to add/update events (meetings, cultural events) from the admin panel.
- **What:** A Payload **Collection** (many entries) for events with bilingual fields and draft/publish workflow.
- **Action:**
  1. Update `src/collections/Events.ts` with fields: `title` (localized), `body` (localized rich text), `date`, `order`
  2. Add slug field with draft/publish toggle
  3. Register in `payload.config.ts` collections array (verify it's already there)
- **AC:** Admin can create, edit, draft, publish, and reorder events. Events appear on the website.

---

**DLA-203: Create `SiteSettings` Global — brand name, contact, social links**

- **Why:** The association name "Latvian Association of Darwin", contact email, and social media URLs are hardcoded. Moving them to a Global lets anyone update them from the admin panel without touching code.
- **What:** A Payload **Global** with fields for association name, tagline, contact email, Facebook/Instagram/etc. URLs. Both EN and LV locales.
- **Action:**
  1. Create `src/globals/SiteSettings.ts` with appropriate fields
  2. Register in `payload.config.ts`
  3. Replace hardcoded brand strings in `SiteHeader.tsx`, `SiteFooter.tsx` with data from this global
  4. Following DLA-206 pattern for fetching
- **AC:** Header/footer brand text is editable in admin panel. "DLA" mark in `SiteHeader.tsx` is no longer hardcoded.

---

**DLA-204: Configure `Media` Collection + R2 storage adapter**

- **Why:** Image uploads (event photos, hero images) need to work. The `@payloadcms/storage-r2` adapter is installed but may not be connected to a real R2 bucket.
- **What:** Verify and configure the R2 storage adapter in Payload so uploaded images are stored in Cloudflare R2.
- **Action:**
  1. Check `src/payload.config.ts` for existing R2 adapter config
  2. Verify environment variable bindings (bucket name, endpoint, access key)
  3. Test upload flow end-to-end
- **AC:** Images uploaded in admin panel are stored in R2 and served correctly on the frontend.

---

**DLA-207: Add SEO `meta` field group to `SpecialPages` Collection**

- **Why:** Special pages (About, Privacy, Terms, EULA) have no dedicated SEO meta description. The code falls back to using the page title as `<meta name="description">`, which produces poor SEO like "About the Association" instead of a meaningful summary.
- **What:** Add a `meta` group field to the `SpecialPages` collection with `title` and `description` (both localized).
- **Depends on:** Nothing (can be done standalone)
- **Action:**
  1. Add to `src/collections/SpecialPages.ts` a `meta` group with `title` (text, max 60 chars) and `description` (textarea, max 160 chars), both localized
  2. Update `src/app/(frontend)/[slug]/page.tsx` `generateMetadata` to use the new field
- **AC:** Each special page can have a custom SEO title and description set in admin panel.

---

**DLA-208: Create `DonationSettings` Global — bank/PayID details**

- **Why:** Bank BSB, account number, and PayID email are hardcoded placeholders (`"000-000"`, `"dla@example.com"`) in `content.ts`. These must be editable in the admin panel so donation info is always correct without a code deploy.
- **What:** A Payload **Global** with bank details (BSB, account number) and PayID email, both localized.
- **Action:**
  1. Create `src/globals/DonationSettings.ts` (schema is already specified in the current backlog's detailed description)
  2. Register in `payload.config.ts`
  3. Update `DonationWidget.tsx` to fetch from CMS at runtime instead of hardcoded `content.ts`
- **AC:** Donation payment details are editable in admin panel. Widget displays live values. Falls back to hardcoded defaults if CMS is unavailable.

---

### SECTION 2: Frontend → CMS Integration (connect the frontend to Payload)

| Ticket | Title | Priority |
|--------|-------|----------|
| DLA-206 | Replace hardcoded `content.ts` data with Payload Local API calls | **High** |
| DLA-205 | Seed dev database with current hardcoded content | **Medium** |

---

**DLA-206: Replace hardcoded `content.ts` data with Payload Local API calls**

- **Why:** The entire site currently reads from `src/app/(frontend)/i18n/content.ts` — a hardcoded file. After building the CMS schemas (DLA-201, 202, 203, 208), we need to switch the frontend to read from Payload so editor changes actually show on the site.
- **What:** Update each frontend data module to fetch from Payload's Local API (`.findGlobal()`, `.find()`) instead of importing from `content.ts`. Keep hardcoded data only as fallback when CMS is unavailable.
- **Depends on:** DLA-201, DLA-202, DLA-203, DLA-204, DLA-208 (schemas must exist before you can fetch from them)
- **Action:**
  1. Create `src/lib/pagesGlobal.ts` — `getWebsitePagesContent()` → fetch `pages` global
  2. Create `src/lib/siteSettings.ts` — `getSiteSettings()` → fetch `siteSettings` global
  3. Create `src/lib/donationSettings.ts` — `getDonationSettings()` → fetch `donationSettings` global
  4. Update `src/lib/events.ts` to use the proper `Events` collection
  5. Update `src/lib/pages.ts`, `src/lib/homepage.ts` to use Local API with `depth: 0`
  6. Each module keeps a minimal hardcoded fallback for when CMS is unreachable
- **AC:** All 6 data modules (pages, events, homepage, footer, navigation, and the new ones above) fetch from Payload. Site works with fallback content if CMS is down.

---

**DLA-205: Seed dev database with current hardcoded content**

- **Why:** Once the CMS schemas exist, the database is empty. We need a seed script that populates it with the content currently in `content.ts`, so the site looks the same but is now CMS-driven.
- **What:** A migration/seed script that reads the hardcoded content and inserts it into Payload via Local API.
- **Depends on:** DLA-206 (data modules exist), schemas from SECTION 1
- **Action:**
  1. Create `src/seed.ts` (or extend an existing seed script)
  2. Use `payload.createGlobal()` and `payload.create()` to insert content
  3. Map content from `content.ts`, `pages.ts` fallbacks, `specialPages.ts` fallbacks into the new schema shapes
  4. Add a `pnpm seed` command to `package.json`
- **AC:** Running `pnpm seed` populates the database; site looks identical to before but content is now CMS-driven.

---

## Phase 3 — Bug Fixes & Code Quality

| Ticket | Title | Priority |
|--------|-------|----------|
| DLA-209 | Rewrite `DonationWidget` tests to match actual component | **High** |
| DLA-210 | Fix `getWebsiteEvents()` to return fallbackEvents on error | **Low** |
| DLA-211 | Extract duplicate `slugValidator` to shared utility | **Medium** |
| DLA-212 | Extract duplicate `mediaURL` helper to shared module | **Medium** |
| DLA-213 | Replace array index React keys with stable keys | **Medium** |
| DLA-214 | Replace inline `style` in Hero with Tailwind utilities | **Medium** |
| DLA-215 | Add error handling + `useCallback` to clipboard `handleCopy` | **Medium** |
| DLA-216 | Replace opaque TODO(DLA-NNN) comments with self-describing text | **Low** |
| DLA-217 | Add special pages (about, privacy, etc.) to sitemap | **Medium** |
| DLA-218 | Fix E2E tests to check actual DLA content, not Payload template | **Medium** |

Each of these tickets has a detailed description already in the file below. They're standalone fixes that can be done in any order.

---

## Phase 4 — i18n URL Routing

| Ticket | Title | Priority |
|--------|-------|----------|
| DLA-301 | Move from client-side toggle to `/en/...` and `/lv/...` routes | **High** |
| DLA-302 | Add `<html lang>` and locale-specific SEO meta | **Medium** |
| DLA-303 | Generate per-locale sitemap | **Low** |
| DLA-304 | Accessibility audit (axe, focus order, contrast) | **Medium** |
| DLA-305 | Performance optimization (images, fonts) | **Low** |

**DLA-301: Move to `/en/` and `/lv/` URL routes**

- **Why:** Currently language is switched client-side via `LanguageProvider` + `localStorage`. This causes a "flash of English" on first paint for Latvian users and is bad for SEO (search engines only see English). App Router's `[locale]` segment fixes both.
- **What:** Restructure routes from `/(frontend)/page.tsx` to `/(frontend)/[locale]/page.tsx`. `LanguageProvider` falls back to URL locale.
- **Action:**
  1. Add `[locale]` dynamic segment to all routes under `(frontend)`
  2. Update `LanguageProvider` to detect locale from URL path
  3. Add `generateStaticParams` for `['en', 'lv']`
  4. Update all internal links to include locale prefix
- **AC:** `/en/about` and `/lv/about` both work. No flash of English on Latvian browsers. Search engines index both language versions.

---

## Phase 5 — Deployment to Cloudflare

| Ticket | Title | Priority |
|--------|-------|----------|
| DLA-401 | Verify `wrangler.jsonc` bindings (D1, R2, secrets) | **High** |
| DLA-402 | Configure `open-next.config.ts` for production | **High** |
| DLA-403 | Document deploy workflow in README | **Medium** |
| DLA-404 | Set up custom domain + DNS | **Medium** |
| DLA-405 | Smoke-test production preview | **Medium** |

---

## Maintenance

| Ticket | Title | Priority |
|--------|-------|----------|
| DLA-502 | Sync `package.json` / lockfile with `pnpm install` output | **Low** |

---

## Dependencies Map

```
DLA-SEC-1 ─┐
DLA-SEC-2 ─┘
             │
             ├─→ DLA-201 (Pages global) ──→ DLA-206 (switch to CMS) ──→ DLA-205 (seed)
             ├─→ DLA-202 (Events collection) ─┘
             ├─→ DLA-203 (SiteSettings global) ─┘
             ├─→ DLA-204 (Media + R2) ──────────┘
             ├─→ DLA-207 (SpecialPages meta) ───┘  (standalone)
             └─→ DLA-208 (DonationSettings) ──────┘

Phase 3 (DLA-209–218): standalone, any order
Phase 4 (DLA-301–305): after Phase 2 is stable
Phase 5 (DLA-401–405): after Phase 4
```

---

## Detailed Ticket Descriptions

*(Keeping existing detailed descriptions for DLA-209 through DLA-218, DLA-SEC-1, DLA-SEC-2, DLA-207, DLA-208 as they are already well-documented below — unchanged.)*

### DLA-SEC-1: Fix `PAYLOAD_SECRET` Fallback to Empty String

**File:** `src/payload.config.ts:77`

**Problem:**
```ts
secret: process.env.PAYLOAD_SECRET || '',
```

If the `PAYLOAD_SECRET` environment variable is not set, the secret becomes an empty string. Payload CMS uses the secret to encrypt authentication cookies, CSRF tokens, and API keys. An empty secret is trivially guessable, allowing attackers to forge session tokens and gain unauthorized admin access.

**Acceptance Criteria:**
- Application throws a clear error at startup if `PAYLOAD_SECRET` is not set in production
- No fallback to empty string under any circumstance
- Developers see actionable error message with remediation steps

**Solution:**
Remove the fallback and add validation at the top of the config:

```ts
// At top of payload.config.ts
if (!process.env.PAYLOAD_SECRET) {
  throw new Error(
    'PAYLOAD_SECRET environment variable is required. Generate one with: openssl rand -hex 32'
  )
}

// Then in config object:
secret: process.env.PAYLOAD_SECRET,
```

---

### DLA-SEC-2: Replace `as any` Logger Type with Proper Interface

**File:** `src/payload.config.ts:46`

**Problem:**
```ts
} as any // Use PayloadLogger type when it's exported
```

The entire `cloudflareLogger` object is typed as `any`, suppressing all TypeScript type checking. If the Payload logger interface changes during a version upgrade (e.g., adding required methods like `child()`), there will be no compilation error — only a runtime failure.

**Acceptance Criteria:**
- Logger object has proper typing with named interface
- Compilation fails if Payload's logger interface changes incompatibly
- Type assertion is removed entirely
- Build validation confirms no `as any` casts remain on logger

**Solution:**
Define a local interface matching `PayloadLogger` and type the object against it:

```ts
interface PayloadLogger {
  level: string
  trace: (objOrMsg: object | string, msg?: string) => void
  debug: (objOrMsg: object | string, msg?: string) => void
  info: (objOrMsg: object | string, msg?: string) => void
  warn: (objOrMsg: object | string, msg?: string) => void
  error: (objOrMsg: object | string, msg?: string) => void
  fatal: (objOrMsg: object | string, msg?: string) => void
  silent: () => void
}

const cloudflareLogger: PayloadLogger = {
  level: 'info',
  trace: console.trace,
  debug: console.debug,
  info: console.info,
  warn: console.warn,
  error: console.error,
  fatal: console.error,
  silent: () => {},
}
```

---

### DLA-209: Rewrite `DonationWidget` Tests to Match Actual Component

**File:** `tests/unit/DonationWidget.test.tsx`

**Problem:**
Tests are written against a hypothetical API that doesn't match the actual component:
- Tests expect `DonationPayload` type export (doesn't exist)
- Tests expect `onSubmit` prop (component accepts no props)
- Tests look for `role="radio"` elements (buttons have no role)
- Tests look for aria-label text that doesn't exist in the component

**Acceptance Criteria:**
- All tests pass without modification to component API
- Tests exercise the actual component, not hypothetical props
- Test file is removed from CI failure list
- Test coverage includes: form rendering, frequency toggle, amount buttons, custom input, validation, success screen
- Tests verify bilingual content rendering via language context

**Solution:**
Rewrite tests to match the actual component:

```tsx
describe('DonationWidget', () => {
  it('renders form with frequency toggle', () => {
    render(
      <LanguageProvider>
        <DonationWidget />
      </LanguageProvider>
    )
    expect(screen.getByText(/One-time/i)).toBeInTheDocument()
    expect(screen.getByText(/Monthly/i)).toBeInTheDocument()
  })

  it('renders 5 preset amount buttons', () => {
    render(
      <LanguageProvider>
        <DonationWidget />
      </LanguageProvider>
    )
    expect(screen.getAllByRole('button', { name: /^\$/ })).toHaveLength(5)
  })

  it('has custom amount input with label', () => {
    render(
      <LanguageProvider>
        <DonationWidget />
      </LanguageProvider>
    )
    expect(screen.getByLabelText(/Enter your amount/i)).toBeInTheDocument()
  })

  it('validates amount > 0 on submit', () => {
    render(
      <LanguageProvider>
        <DonationWidget />
      </LanguageProvider>
    )
    const submitBtn = screen.getByRole('button', { name: /Donate/i })
    fireEvent.click(submitBtn)
    expect(screen.getByText(/Please enter a positive amount/i)).toBeInTheDocument()
  })

  it('shows success screen on valid submission', async () => {
    render(
      <LanguageProvider>
        <DonationWidget />
      </LanguageProvider>
    )
    const amountInput = screen.getByLabelText(/Enter your amount/i)
    fireEvent.change(amountInput, { target: { value: '50' } })
    const submitBtn = screen.getByRole('button', { name: /Donate/i })
    fireEvent.click(submitBtn)
    await waitFor(() => {
      expect(screen.getByText(/Thank you for your donation/i)).toBeInTheDocument()
    })
  })
})
```

---

### DLA-210: Fix `getWebsiteEvents()` Fallback Consistency

**File:** `src/lib/events.ts:87-90`

**Problem:**
```ts
catch (error) {
  console.warn('[events] Payload events unavailable.', error)
  return []
}
```

When Payload/D1 is unavailable, `getWebsiteEvents()` returns an empty array instead of the defined `fallbackEvents`. This is inconsistent with other data modules (pages, homepage, footer, navigation) which all return fallback content.

**Acceptance Criteria:**
- All data modules follow the same fallback pattern
- No dead code (`fallbackEvents` is actually used)
- Consistency across pages, events, homepage, footer, navigation modules
- Error logging remains for debugging

**Solution:**
Return `fallbackEvents` for consistency:

```ts
export async function getWebsiteEvents(): Promise<WebsiteEvent[]> {
  try {
    // ... fetch logic ...
  } catch (error) {
    console.warn('[events] Payload events unavailable; using fallback events.', error)
    return fallbackEvents
  }
}
```

---

### DLA-211: Extract `slugValidator` to Shared Utility

**Files:** `src/collections/Pages.ts:59-64`, `src/collections/Events.ts:62-67`, `src/collections/SpecialPages.ts:62-67`

**Problem:**
All three files contain identical slug validation code:

```ts
validate: (value: unknown) => {
  if (typeof value !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
    return 'Use lowercase letters, numbers, and hyphens only.'
  }
  return true
},
```

**Acceptance Criteria:**
- Slug validation is defined once in a shared location
- All three collections import and reference the shared function
- Error message is identical across all usages
- No code duplication

**Solution:**
Create a shared validator utility:

```ts
// src/lib/validation.ts
export const slugValidator = (value: unknown): true | string => {
  if (typeof value !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
    return 'Use lowercase letters, numbers, and hyphens only.'
  }
  return true
}
```

Then in each collection:
```ts
import { slugValidator } from '@/lib/validation'

// In field definition:
validate: slugValidator,
```

---

### DLA-212: Extract `mediaURL` Helper to Shared Module

**Files:** `src/lib/pages.ts:255-259`, `src/lib/events.ts:57-61`, `src/lib/homepage.ts:64-68`

**Problem:**
Identical function defined three times:

```ts
function mediaURL(value: unknown): string | undefined {
  if (value && typeof value === 'object' && 'url' in value && typeof value.url === 'string') {
    return value.url
  }
}
```

**Acceptance Criteria:**
- `mediaURL` is defined once, imported where needed
- Type-safe using Payload's generated types rather than `unknown`
- No code duplication across modules

**Solution:**
Create a shared media utility:

```ts
// src/lib/media.ts
export function mediaURL<T extends { url?: string | null } | null | undefined>(
  value: T,
): string | undefined {
  return value?.url ?? undefined
}
```

Then import in pages, events, homepage modules:
```ts
import { mediaURL } from '@/lib/media'

// Usage remains the same:
const imageUrl = mediaURL(page.image)
```

---

### DLA-213: Remove Array Index Keys; Use Stable Keys in Lists

**Files:**
- `src/app/(frontend)/components/SiteFooter.tsx:43`: `key={idx}`
- `src/app/(frontend)/components/DonationWidget.tsx:96,109,127`: `key={i}`
- `src/app/(frontend)/components/SpecialPageLayout.tsx:27`: `key={idx}`
- `src/app/(frontend)/components/ContentPage.tsx:55`: `key={paragraph}`

**Problem:**
Using array index as keys is problematic for dynamic lists. Using paragraph content as a key can produce duplicate key warnings if two paragraphs are identical. Array indices cause unnecessary re-renders and state loss if items are reordered, added, or removed.

**Acceptance Criteria:**
- No React key warnings in development console
- Stable keys are used for dynamic lists
- Content-based keys are avoided
- Static content can use prefixed index keys

**Solution:**
Use stable, unique keys:

```tsx
// For CMS data with IDs:
{items.map((item) => (
  <li key={item.slug || item.href}>{/* ... */}</li>
))}

// For truly static arrays where no stable ID exists:
{paragraphs.map((paragraph, idx) => (
  <p key={`p-${idx}`}>{paragraph}</p>
))}

// For donation amounts:
{amounts.map((amount, idx) => (
  <button key={`amount-${amount}`}>${amount}</button>
))}
```

---

### DLA-214: Remove Inline `style` in Hero; Use Tailwind Utilities

**File:** `src/app/(frontend)/components/Hero.tsx:34-38`

**Problem:**
```tsx
style={{
  backgroundImage:
    'radial-gradient(circle at 50% 100%, rgba(251,191,36,0.6), transparent 60%), ...',
}}
```

The rest of the codebase uses Tailwind CSS classes exclusively. This inline style:
- Breaks Tailwind design system consistency
- Cannot be themed or overridden via Tailwind config
- Makes the code harder to maintain

**Acceptance Criteria:**
- No inline `style` attributes for styling purposes
- All visual styling uses Tailwind classes
- (Inline styles for dynamic values like `animationDelay` are acceptable)

**Solution:**
Use Tailwind arbitrary values:

```tsx
<div
  aria-hidden="true"
  className="absolute inset-0 -z-10 opacity-70 bg-[radial-gradient(circle_at_50%_100%,rgba(251,191,36,0.6),transparent_60%),radial-gradient(circle_at_20%_80%,rgba(249,115,22,0.5),transparent_50%)]"
/>
```

---

### DLA-215: Add Error Handling to `handleCopy` Clipboard Operation

**File:** `src/app/(frontend)/donate/DonationWidget.tsx:42-46`

**Problem:**
```ts
const handleCopy = (text: string) => {
  if (typeof navigator !== 'undefined') {
    navigator.clipboard.writeText(text)
  }
}
```

`navigator.clipboard.writeText()` returns a Promise that can reject (permission denied, clipboard API unavailable, HTTPS required). The rejection is unhandled. Also, the function is recreated on every render (not wrapped in `useCallback`).

**Acceptance Criteria:**
- Clipboard errors are caught and logged (not silently swallowed)
- Function is stable across renders via `useCallback`
- User receives feedback on copy success/failure (optional toast)
- No unhandled promise rejections in console

**Solution:**
Add error handling and wrap in `useCallback`:

```tsx
import { useCallback } from 'react'

const handleCopy = useCallback(async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    // Optional: show a brief "Copied!" toast
    console.log('[donate] Copied to clipboard:', text)
  } catch (error) {
    console.warn('[donate] Failed to copy to clipboard:', error)
    // Optional: show error toast to user
  }
}, [])
```

---

### DLA-216: Clean Up Hardcoded TODO Comments

**Files (multiple):**
- `src/app/(frontend)/page.tsx:49`: `// TODO(DLA-302): when locale routing lands...`
- `src/app/(frontend)/i18n/LanguageProvider.tsx:79`: `// TODO(DLA-201): switch the static en initial state...`
- `src/app/(frontend)/components/SiteHeader.tsx:105`: `// TODO(DLA-203): the brand mark...`

**Problem:**
TODO comments reference opaque internal ticket numbers (DLA-201, DLA-203, DLA-302) that provide no context to new developers. Comments don't describe what needs to be done or why. Over time, these become stale references to closed or forgotten tickets.

**Acceptance Criteria:**
- Each TODO either describes the work in plain English or is removed
- No opaque ticket references remain in code comments
- Orphaned/stale TODOs are removed
- Remaining TODOs are actionable and self-describing

**Good Example:**
```ts
// TODO: Use server-injected language from Accept-Language header
// to avoid a flash of English content on Latvian browsers.
```

**Bad Example:**
```ts
// TODO(DLA-201): fix this later
```

---

### DLA-217: Fix Sitemap to Include Special Pages

**File:** `src/app/sitemap.ts:7`

**Problem:**
```ts
const paths = ['/', '/donate', ...pages.map((page) => `/${page.slug}`)]
```

Special pages (about, privacy, terms, eula) fetched via `getSpecialPage()` are not included in the sitemap. These are public-facing pages that should be discoverable by search engines.

**Acceptance Criteria:**
- All public-facing pages appear in the sitemap
- No duplicate entries
- Both CMS pages and fallback special pages are included
- Sitemap includes locale-specific URLs if locale routing is implemented

**Solution:**
Include special page paths:

```ts
import { fallbackSpecialPages } from '@/lib/specialPages'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = await getWebsitePages()
  const specialSlugs = fallbackSpecialPages.map((p) => `/${p.slug}`)
  const paths = ['/', '/donate', ...pages.map((page) => `/${page.slug}`), ...specialSlugs]

  return paths.map((path) => ({
    url: new URL(path, SITE_URL).toString(),
    changeFrequency: path === '/' ? 'weekly' : 'monthly',
    priority: path === '/' ? 1 : 0.8,
  }))
}
```

---

### DLA-218: Fix E2E Test to Check Actual DLA Content

**File:** `tests/e2e/frontend.e2e.spec.ts:14-18`

**Problem:**
```ts
await expect(page).toHaveTitle(/Payload Blank Template/)
const heading = page.locator('h1').first()
await expect(heading).toHaveText('Welcome to your new project.')
```

These assertions check for the default Payload CMS starter template content, not the actual DLA website content. The homepage title is "Latvian Association of Darwin — Dārvinas Latviešu Apvienība" and there is no "Welcome to your new project." heading. This test will always fail.

**Acceptance Criteria:**
- E2E tests verify actual DLA website content
- Tests check for elements that exist on the live pages
- Tests pass in CI without modification
- Both EN and LV content paths are tested (post-locale-routing)

**Solution:**
Update to match actual website content:

```ts
test('can go on homepage', async ({ page }) => {
  await page.goto('http://localhost:3000')
  await expect(page).toHaveTitle(/Latvian Association of Darwin/)
  const heading = page.locator('h1').first()
  await expect(heading).toBeVisible()
})

test('can navigate to about page', async ({ page }) => {
  await page.goto('http://localhost:3000/about')
  await expect(page).toHaveTitle(/About/)
  const heading = page.locator('h1').first()
  await expect(heading).toHaveText(/About/)
})
```

---

## Known Issues & Deferred Work

The following issues were identified in the code review but are **deferred** pending prioritization:

### B-5: `getWebsitePage()` Over-Fetches All Pages

**File:** `src/lib/pages.ts:350-353`

**Problem:**
```ts
export async function getWebsitePage(slug: string): Promise<WebsitePage | undefined> {
  const pages = await getWebsitePages()
  return pages.find((page) => page.slug === slug)
}
```

Every request to a dynamic page (`/[slug]`) fetches ALL pages (up to 100 with block layouts, media references, etc.) from the database, then discards all but one. For a `force-dynamic` page, this runs on every request and is wasteful.

**Status:** Deferred to performance optimization phase. Can be solved with targeted database query.

---

### T-2: Missing Unit Tests for Core Data-Processing Logic

**Problem:**
There are no unit tests for critical data transformation functions:
- `starterPage()` and `mapLayout()` in `src/lib/pages.ts`
- `mediaURL()` (in all three modules — though DRY-2 consolidates this)
- Fallback content assembly in all data modules
- `toOgFilename()` and `getOgImageUrlByPath()` in `src/lib/ogImage.ts`
- `validateSiteContent()` error paths

**Status:** Medium priority. Should be addressed once DLA-209 (DonationWidget tests) is complete, then scale to other modules.

---

### DRY-3: Duplicated i18n Group Field Patterns Across Collections

**Files:** `src/collections/Pages.ts:76-99`, `src/collections/Events.ts:103-127`, `src/collections/SpecialPages.ts:69-93`

**Problem:**
Each collection defines `en`/`lv` tabs with nearly identical structure. The `bilingualGroup` helper in `src/blocks/fields.ts` already exists for blocks but uses a different pattern than collections (flat `Field[]` vs. `tabs` wrapping `groups`).

**Status:** Low priority refactor. Would improve maintainability but doesn't affect functionality.

---

### CQ-5: `contentByLang` Falls Back to Unvalidated Data

**File:** `src/app/(frontend)/i18n/content.ts:356-359`

**Problem:**
```ts
export const contentByLang: Record<Lang, SiteContent> = {
  en: enResult.success ? enResult.data : en,
  lv: lvResult.success ? lvResult.data : lv,
}
```

If Zod validation fails, the code falls back to the raw object that just failed validation, making validation pointless. The fallback could have structural issues that crash the UI.

**Status:** Medium priority. Should be addressed by creating a known-good minimal fallback content object.

---

### CQ-6: `handleCustomChange` Regex Silently Corrupts Input

**File:** `src/app/(frontend)/donate/DonationWidget.tsx:23-27`

**Problem:**
```ts
const handleCustomChange = (raw: string) => {
  const sanitized = raw.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1')
  setCustomAmount(sanitized)
  setError(null)
}
```

The sanitization regex has edge cases that silently change values. `1.2.3` becomes `1.23`, and no validation confirms digits exist before/after decimal.

**Status:** Low priority. Current behavior is acceptable but could be improved with better validation on submit rather than during input.

---

### A-1: Language Flash — Always Renders English on First Paint

**File:** `src/app/(frontend)/i18n/LanguageProvider.tsx:36-40`

**Problem:**
The `LanguageProvider` always initializes with `'en'` on the server, then runs a client-side `useEffect` to detect language from `localStorage`. Latvian-speaking users see English content for at least one render cycle, and `<html lang>` is always `en` initially.

**Status:** Deferred to DLA-301 (locale routing phase). Server-side `Accept-Language` detection will solve this as part of the i18n routing refactor.

---

### A-2: Mobile Navigation Visible to Screen Readers on Desktop

**File:** `src/app/(frontend)/components/SiteHeader.tsx:82-100`

**Problem:**
The mobile navigation is hidden via `sm:hidden` (CSS display), but screen readers on desktop may still announce the "Primary mobile" nav if content is rendered in the DOM.

**Status:** Low priority. Add `aria-hidden` on larger screens or refactor to conditionally render.

---

### P-1: No View Transition During Language Switch

**File:** `src/app/(frontend)/i18n/LanguageProvider.tsx`

**Problem:**
When the user switches language, all content updates immediately. For content-heavy pages, there might be a noticeable lag. No visual feedback or transition is shown.

**Status:** Low priority UX enhancement.

---

### P-2: Google Fonts `fetchpriority` Optimization

**File:** `src/app/(frontend)/layout.tsx:76-78`

**Problem:**
Font URLs use `display=swap` (correct) but lack `fetchpriority="high"` to prioritize font loading over other resources.

**Status:** Low priority optimization.

---

### E-1: Inconsistent `crossOrigin` on Preconnect Links

**File:** `src/app/(frontend)/layout.tsx:73-74`

**Problem:**
```tsx
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
```

`fonts.googleapis.com` preconnect lacks `crossorigin` while `fonts.gstatic.com` has it. This inconsistency may prevent proper browser preconnection.

**Status:** Low priority cleanup.

---

### E-2: Wrangler Import Path Obfuscation

**File:** `src/payload.config.ts:95-96`

**Problem:**
```ts
return import(/* webpackIgnore: true */ `${'__wrangler'.replaceAll('_', '')}`).then(
  ({ getPlatformProxy }) =>
```

The import uses string manipulation to bypass bundler detection. This is fragile and lacks type safety on the imported module.

**Status:** Low priority improvement. Add type guard validation and document the dependency clearly.

---

## How to use this file

1. Start with **Section 0** (Security) — these block everything else.
2. Work through **Section 1** (CMS Data Schemas) in ticket order — later tickets depend on earlier ones.
3. Then **Section 2** (Frontend Integration) to connect the site to the CMS.
4. Phase 3 bugs can be done in any order, in parallel with other work.
5. Phase 4 (i18n routing) and Phase 5 (deployment) come last.

When you start a ticket, move it to "In Progress". When done, remove the row. Add newly discovered work as `DLA-###` with a clear What/Why/Action.

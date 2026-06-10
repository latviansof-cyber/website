# DLA Website – Product Backlog (Jira-style)

> Project: **Latvian Association of Darwin (Dārvinas Latviešu Apvienība)** website
> Stack: **Next.js 15 (App Router) + React 19 + Tailwind CSS v4 + Payload CMS 3 + Cloudflare Workers (OpenNext)**
> Convention: tickets prefixed `DLA-` (Darwin Latvian Association).
> Status legend: `To Do` | `In Progress` | `Blocked` | `Done`

---

## Summary

**Phase 1 (DLA-100) – Static bilingual frontend** ✅ **Complete**
- Bilingual English/Latvian site with React components
- Language switching via `LanguageProvider` context
- Responsive layout (320px–1280px)
- Tailwind v4 with design tokens
- Jest unit tests for core components
- All items merged to main

**Current Phase: DLA-200 onwards** – CMS data model, i18n routing, Cloudflare deployment

---

## To Do (next iteration)

### Phase 2 – Payload CMS data model

| Ticket | Title | Priority | Notes |
| --- | --- | --- | --- |
| DLA-201 | `Pages` global with `about`, `history` rich text (EN + LV) | High | Use `localized: true` arrays/fields. |
| DLA-202 | `Events` collection (title, body, order, date) localized | High | Slug + draft/publish workflow. |
| DLA-203 | `SiteSettings` global (association name, contact email, social URLs) | Medium | Drives header/footer brand strings (replaces hard-coded "DLA" mark in `SiteHeader.tsx`). |
| DLA-204 | `Media` collection + R2 storage adapter | Medium | Adapter already installed (`@payloadcms/storage-r2`); verify bucket binding. |
| DLA-205 | Seed dev DB with current hard-coded copy | Medium | Migration script. |
| DLA-206 | Switch frontend sections to fetch from Payload Local API | High | Replace `contentByLang` in `i18n/content.ts` with `payload.findGlobal({ slug: 'pages' })`. |
| DLA-207 | Add `meta` field to `SpecialPages` collection | High | For custom SEO title/description per special page. (Issue B-3) |
| DLA-208 | Create `DonationSettings` global for bank/PayID details | High | Move hardcoded donation payment details to CMS. (Issue B-4) |

### Phase 2b – Bug Fixes & Test Corrections

| Ticket | Title | Priority | Notes |
| --- | --- | --- | --- |
| DLA-209 | Rewrite `DonationWidget` tests to match actual component | High | Tests expect props/exports that don't exist. (Issue B-1) |
| DLA-210 | Fix `getWebsiteEvents()` fallback consistency | Low | Return `fallbackEvents` when CMS unavailable, not empty array. (Issue B-2) |
| DLA-211 | Extract `slugValidator` to shared utility | Medium | Remove duplication across 3 collections. (Issue DRY-1) |
| DLA-212 | Extract `mediaURL` helper to shared module | Medium | Remove duplication across 3 data modules. (Issue DRY-2) |
| DLA-213 | Remove array index keys; use stable keys in lists | Medium | Fix React key warnings in multiple components. (Issue CQ-1) |
| DLA-214 | Remove inline `style` in Hero; use Tailwind utilities | Medium | Hero gradient should use arbitrary Tailwind values. (Issue CQ-2) |
| DLA-215 | Add error handling to `handleCopy` clipboard operation | Medium | Wrap in useCallback, catch rejection, add logging. (Issue CQ-3) |
| DLA-216 | Clean up hardcoded TODO comments (DLA-NNN refs) | Low | Make TODOs self-describing or remove. (Issue CQ-4) |
| DLA-217 | Fix sitemap to include special pages | Medium | About, Privacy, Terms, EULA should be in sitemap.ts. (Issue CQ-7) |
| DLA-218 | Fix E2E test to check actual DLA content | Medium | Tests reference Payload default template. (Issue T-1) |

### Phase 3 – i18n routing & polish

| Ticket | Title | Priority | Notes |
| --- | --- | --- | --- |
| DLA-301 | Move from client-side toggle to `/en/...` and `/lv/...` routes | High | App Router `[locale]` segment; `LanguageProvider` falls back to URL locale. Fixes "flash of English" issue (see TODO in `LanguageProvider.tsx`). |
| DLA-302 | Add `<html lang>` and SEO meta per locale | Medium | OpenGraph + hreflang. |
| DLA-303 | Add sitemap and robots | Low | Per-locale URLs. |
| DLA-304 | Accessibility audit (axe, focus order, contrast) | Medium |  |
| DLA-305 | Performance pass: image optimization, font subsetting | Low |  |

### Phase 4 – Deployment to Cloudflare

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

## Critical Security Issues (Must Address Before Production)

These issues from the code review must be fixed before the application is deployed to production:

| Ticket | Title | Priority | Notes |
| --- | --- | --- | --- |
| DLA-SEC-1 | Fix `PAYLOAD_SECRET` fallback to empty string | Critical | S-1: Secret must not default to empty. Causes auth bypass. Add validation at startup. |
| DLA-SEC-2 | Replace `as any` logger type with proper interface | High | S-2: Type safety on logger. Define local interface matching Payload's logger contract. |

**Action:** Before deployment, ensure both SEC-1 and SEC-2 are completed. Add to CI/CD pre-production checklist.

---

## Detailed Ticket Descriptions

### DLA-SEC-1: Fix `PAYLOAD_SECRET` Fallback to Empty String

**Issue:** [S-1] `PAYLOAD_SECRET` Falls Back to Empty String

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

**Issue:** [S-2] `as any` Type Assertion on Logger Bypasses All Type Safety

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

### DLA-207: Add `meta` Field to `SpecialPages` Collection

**Issue:** [B-3] Special Pages Have No Dedicated Meta Description Field

**File:** `src/collections/SpecialPages.ts`

**Problem:**
```ts
// In src/app/(frontend)/[slug]/page.tsx:35
const description = page
  ? (page.meta.description || page.en.excerpt)
  : specialPage!.en.title  // <-- Uses title as description (poor SEO)
```

Special pages (About, Privacy, Terms, etc.) have no dedicated `meta.description` field in the Payload collection. The code falls back to using the page title as the meta description, which produces poor SEO (`<meta name="description" content="About the Association">` instead of a meaningful summary).

**Acceptance Criteria:**
- `SpecialPages` collection has a `meta` group with `title` and `description` fields
- Both fields are localized (EN + LV)
- `generateMetadata` uses the description field, falling back to content excerpt if empty
- Admin panel shows a dedicated field for custom SEO metadata per special page
- Description field has character count indicator (50-160 chars recommended)

**Solution:**
Add to the `SpecialPages` collection schema:

```ts
{
  name: 'meta',
  type: 'group',
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      label: 'Meta Title (SEO)',
      maxLength: 60,
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      label: 'Meta Description (SEO)',
      maxLength: 160,
    },
  ],
}
```

---

### DLA-208: Create `DonationSettings` Global for Bank/PayID Details

**Issue:** [B-4] Bank & PayID Details Are Hardcoded Placeholders

**File:** `src/app/(frontend)/i18n/content.ts:146-155`

**Problem:**
```ts
bankBsb: '000-000', // To be updated
bankAccount: '00000000', // To be updated
payIdEmail: 'dla@example.com', // To be updated
```

Placeholder bank details and PayID email are hardcoded in `content.ts`. These should be managed in the Payload CMS admin panel so they can be updated without code deployment. Currently, if these placeholders are displayed to users, donations could be sent to the wrong account.

**Acceptance Criteria:**
- A `donationSettings` global exists in Payload with localized bank/PayID fields
- Editors can update payment details in admin panel without code changes
- `DonationWidget` fetches settings from CMS at runtime
- Fallback to hardcoded defaults if CMS is unavailable
- Validation warns if placeholder values remain in production
- Both EN and LV locales are supported

**Solution:**
Create a new global in Payload:

```ts
// src/globals/DonationSettings.ts
import { GlobalConfig } from 'payload'

export const DonationSettings: GlobalConfig = {
  slug: 'donationSettings',
  label: 'Donation Settings',
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'bankDetails',
      type: 'group',
      label: 'Bank Transfer Details',
      fields: [
        {
          name: 'bsb',
          type: 'text',
          label: 'BSB Code',
          localized: true,
          required: true,
        },
        {
          name: 'accountNumber',
          type: 'text',
          label: 'Account Number',
          localized: true,
          required: true,
        },
      ],
    },
    {
      name: 'payIdEmail',
      type: 'email',
      label: 'PayID Email',
      localized: true,
      required: true,
    },
  ],
}
```

Then update `DonationWidget` to fetch from CMS:

```ts
export async function DonationWidget() {
  const settings = await getPayloadClient().findGlobal({
    slug: 'donationSettings',
  })
  return <DonationForm settings={settings} />
}
```

---

### DLA-209: Rewrite `DonationWidget` Tests to Match Actual Component

**Issue:** [B-1] Test Suite Is Disconnected from Component Implementation

**File:** `tests/unit/DonationWidget.test.tsx`

**Problem:**
Tests are written against a hypothetical API that doesn't match the actual component:
- Tests expect `DonationPayload` type export (doesn't exist)
- Tests expect `onSubmit` prop (component accepts no props)
- Tests look for `role="radio"` elements (buttons have no role)
- Tests look for aria-label text that doesn't exist in the component

**Verdict:** The component implementation is correct; the tests are aspirational/incorrect. Tests must be rewritten to match the actual component behavior.

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

**Issue:** [B-2] Events Fallback Defined But Not Used

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

**Issue:** [DRY-1] Slug Validation Duplicated Across Three Collections

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

**Issue:** [DRY-2] `mediaURL` Helper Duplicated Across Three Modules

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

**Issue:** [CQ-1] Array Index Used as React Key in Multiple Components

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

**Issue:** [CQ-2] Inline `style` Attribute Breaks Tailwind Consistency

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

**Issue:** [CQ-3] `handleCopy` Unhandled Promise Rejection Risk

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

**Issue:** [CQ-4] Hardcoded Opaque TODO References (DLA-NNN)

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

**Issue:** [CQ-7] Sitemap Missing Special Pages

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

**Issue:** [T-1] Frontend E2E Test References Default Payload Template Content

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

### DLA-218: Fix E2E Test to Check Actual DLA Content

**Issue:** [T-1] Frontend E2E Test References Default Payload Template Content

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

The following issues were identified in the code review but are marked as **deferred** or **accepted as-is** pending prioritization:

### B-5: `getWebsitePage()` Over-Fetches All Pages

**Issue:** [B-5] `getWebsitePage()` Fetches All Pages Then Filters by Slug

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

**Issue:** [T-2] Missing Unit Tests for Core Data-Processing Logic

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

**Issue:** [DRY-3] Duplicated i18n Group Field Patterns Across Collections

**Files:** `src/collections/Pages.ts:76-99`, `src/collections/Events.ts:103-127`, `src/collections/SpecialPages.ts:69-93`

**Problem:**
Each collection defines `en`/`lv` tabs with nearly identical structure. The `bilingualGroup` helper in `src/blocks/fields.ts` already exists for blocks but uses a different pattern than collections (flat `Field[]` vs. `tabs` wrapping `groups`).

**Status:** Low priority refactor. Would improve maintainability but doesn't affect functionality.

---

### CQ-5: `contentByLang` Falls Back to Unvalidated Data

**Issue:** [CQ-5] `contentByLang` Falls Back to Unvalidated Data on Validation Failure

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

**Issue:** [CQ-6] `handleCustomChange` Regex Quietly Corrupts Input

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

**Issue:** [A-1] Language Flash: Always Renders English on First Paint

**File:** `src/app/(frontend)/i18n/LanguageProvider.tsx:36-40`

**Problem:**
The `LanguageProvider` always initializes with `'en'` on the server, then runs a client-side `useEffect` to detect language from `localStorage`. Latvian-speaking users see English content for at least one render cycle, and `<html lang>` is always `en` initially.

**Status:** Deferred to DLA-301 (locale routing phase). Server-side `Accept-Language` detection will solve this as part of the i18n routing refactor.

---

### A-2: Mobile Navigation Visible to Screen Readers on Desktop

**Issue:** [A-2] Mobile Navigation Visible to Screen Readers on Desktop

**File:** `src/app/(frontend)/components/SiteHeader.tsx:82-100`

**Problem:**
The mobile navigation is hidden via `sm:hidden` (CSS display), but screen readers on desktop may still announce the "Primary mobile" nav if content is rendered in the DOM.

**Status:** Low priority. Add `aria-hidden` on larger screens or refactor to conditionally render. Already mostly accessible.

---

### P-1: No View Transition During Language Switch

**Issue:** [P-1] No View Transition or Loading State During Language Switch

**File:** `src/app/(frontend)/i18n/LanguageProvider.tsx`

**Problem:**
When the user switches language, all content updates immediately. For content-heavy pages, there might be a noticeable lag. No visual feedback or transition is shown.

**Status:** Low priority UX enhancement. Could be addressed with CSS transitions or a brief loading state post-i18n-routing.

---

### P-2: Google Fonts `fetchpriority` Optimization

**Issue:** [P-2] Google Fonts Loaded Without `fetchpriority=high`

**File:** `src/app/(frontend)/layout.tsx:76-78`

**Problem:**
Font URLs use `display=swap` (correct) but lack `fetchpriority="high"` to prioritize font loading over other resources.

**Status:** Low priority optimization. Would improve Core Web Vitals slightly.

---

### E-1: Inconsistent `crossOrigin` on Preconnect Links

**Issue:** [E-1] Inconsistent `crossOrigin` on Preconnect Links

**File:** `src/app/(frontend)/layout.tsx:73-74`

**Problem:**
```tsx
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
```

`fonts.googleapis.com` preconnect lacks `crossorigin` while `fonts.gstatic.com` has it. This inconsistency may prevent proper browser preconnection.

**Status:** Low priority cleanup. Add `crossOrigin="anonymous"` to both for consistency.

---

### E-2: Wrangler Import Path Obfuscation

**Issue:** [E-2] Wrangler Import Path Obfuscation

**File:** `src/payload.config.ts:95-96`

**Problem:**
```ts
return import(/* webpackIgnore: true */ `${'__wrangler'.replaceAll('_', '')}`).then(
  ({ getPlatformProxy }) =>
```

The import uses string manipulation to bypass bundler detection. This is fragile and lacks type safety on the imported module.

**Status:** Low priority improvement. Add type guard validation and document the dependency clearly. Refactor when updating Payload or wrangler versions.

---



---

## How to use this file

1. Pick the next ticket with highest priority in the "To Do" section.
2. Change `To Do` to `In Progress` while you work on it.
3. When finished, remove the row from the table (task is done, no need to track it).
4. Add new discovered work as a new row with the next `DLA-###` number.

# TODO Vivaldi: Public SEO + KV Publish Cache

This document is a junior-friendly task list for reducing Cloudflare D1 operations on the production SonicJS site and fixing missing crawler routes.

Production app is SonicJS, not Payload. It does not use the upstream SonicJS package directly; it uses our local SonicJS fork:

- App root: `_SonicJS/latviansof`
- SonicJS fork root: `_SonicJS/darwin-sonicjs`
- Local fork package used by the app: `_SonicJS/darwin-sonicjs/packages/core`
- App dependency confirming this: `_SonicJS/latviansof/package.json` has `"@sonicjs-cms/core": "file:../darwin-sonicjs/packages/core"`
- Main Worker entry: `_SonicJS/latviansof/src/index.ts`
- Public site router: `_SonicJS/latviansof/src/site/index.ts`
- Public D1 content helpers: `_SonicJS/latviansof/src/site/utils/content.ts`
- Worker bindings: `_SonicJS/latviansof/wrangler.jsonc`

Rule of thumb:

- Public website-specific work goes in `_SonicJS/latviansof`.
- Reusable CMS/admin/auth behavior goes in our fork under `_SonicJS/darwin-sonicjs/packages/core`.
- Do not assume upstream SonicJS docs or package behavior unless checked against the local fork.

## Goal

Move public visitor traffic away from D1 reads.

Admin/editor traffic can keep using D1. Public traffic should eventually read from KV snapshots only:

- `/robots.txt`: static text, no D1.
- `/sitemap.xml`: generated from published content and stored in KV.
- Public pages: one KV read by URL, no D1.
- Keep D1 fallback at first. Disable it only later, after KV publishing is proven stable.

## Current Findings

- `https://latviansofdarwin.org.au/robots.txt` returns `404`.
- There is no visible sitemap route in `_SonicJS/latviansof` or `_SonicJS/darwin-sonicjs/packages/core/src`.
- Public site routes in `_SonicJS/latviansof/src/site/index.ts` directly call D1 helpers.
- `/:lang` homepage currently reads pages, events, trusted partners, navigation, footer, and site settings.
- `/:lang/:slug`, `/:lang/events/:slug`, and `/:lang/donate` also call D1 helpers directly.
- The collection `cache` settings in `_SonicJS/latviansof/src/collections/*.collection.ts` do not currently protect these custom public SSR routes.
- `CACHE_KV` already exists in `_SonicJS/latviansof/wrangler.jsonc`, binding name `CACHE_KV`.

## Suggested KV Key Design

Use simple current-only keys. Do not store historical versions in KV for this first implementation.

```txt
public:site:sitemap = JSON array of current URL paths
public:site:sitemap.xml = current XML sitemap string
public:site:robots.txt = current robots string
public:site:generatedAt = publish timestamp

public:site:page:/en = JSON page payload
public:site:page:/lv = JSON page payload
public:site:page:/en/about = JSON page payload
public:site:page:/lv/about = JSON page payload
public:site:page:/en/events/jani = JSON page payload
public:site:page:/lv/events/jani = JSON page payload
```

Keep the key names in one file as constants so they are not duplicated.

Recommended new file:

- `_SonicJS/latviansof/src/site/publish/kv-keys.ts`

## Phase 1: Fix robots.txt

### Task 1.1: Add `/robots.txt` route

File to edit:

- `_SonicJS/latviansof/src/site/index.ts`

Add this route before `siteRouter.get('/:lang', ...)`:

```ts
siteRouter.get('/robots.txt', (c) => {
  const origin = new URL(c.req.url).origin
  const body = [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${origin}/sitemap.xml`,
    '',
  ].join('\n')

  return c.text(body, 200, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'public, max-age=3600',
  })
})
```

Acceptance checks:

```bash
curl -i http://localhost:8787/robots.txt
```

Expected:

- HTTP `200`.
- `Content-Type: text/plain`.
- Body contains `Sitemap: http://localhost:8787/sitemap.xml`.
- No HTML layout.
- No redirect to `/en/robots.txt`.

### Task 1.2: Ensure `robots.txt` bypasses language fallback

File to inspect:

- `_SonicJS/latviansof/src/site/index.ts`

Make sure the `/robots.txt` route appears before these routes:

- `siteRouter.get('/:lang', ...)`
- `siteRouter.get('/:lang/:slug', ...)`

Why:

Hono route order matters. If `/:lang` runs first, `robots.txt` is treated as a fake language and produces an HTML 404.

## Phase 2: Add Basic Dynamic Sitemap From D1

This is the simplest sitemap. It still uses D1, but only for `/sitemap.xml`. Later phases will replace it with KV.

### Task 2.1: Add sitemap URL builder helper

Create file:

- `_SonicJS/latviansof/src/site/sitemap.ts`

Implement small helpers:

```ts
import type { PageData, EventData } from './utils/content'

export function buildPublicPaths(pages: PageData[], events: EventData[]): string[] {
  const paths = new Set<string>()

  paths.add('/en')
  paths.add('/lv')
  paths.add('/en/donate')
  paths.add('/lv/donate')

  for (const page of pages) {
    if (!page.slug) continue
    if (page.slug === 'home') continue
    if (page.slug === 'donate') continue
    if (page.noIndex) continue
    paths.add(`/en/${page.slug}`)
    paths.add(`/lv/${page.slug}`)
  }

  for (const event of events) {
    if (!event.slug) continue
    paths.add(`/en/events/${event.slug}`)
    paths.add(`/lv/events/${event.slug}`)
  }

  return Array.from(paths).sort()
}

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export function buildSitemapXml(origin: string, paths: string[]): string {
  const urls = paths
    .map((path) => `  <url><loc>${xmlEscape(`${origin}${path}`)}</loc></url>`)
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
}
```

Acceptance checks:

- File compiles.
- `buildPublicPaths()` skips `home`.
- `buildPublicPaths()` skips `donate` page document because donate has a custom route.
- `buildPublicPaths()` skips pages with `noIndex`.
- Both `/en/...` and `/lv/...` are present.

### Task 2.2: Add `/sitemap.xml` route using D1 helpers

File to edit:

- `_SonicJS/latviansof/src/site/index.ts`

Imports to add:

```ts
import { buildPublicPaths, buildSitemapXml } from './sitemap'
```

Add this route before `siteRouter.get('/:lang', ...)`:

```ts
siteRouter.get('/sitemap.xml', async (c) => {
  const [pages, events] = await Promise.all([
    getAllPublishedPages(c.env.DB),
    getAllPublishedEvents(c.env.DB),
  ])
  const origin = new URL(c.req.url).origin
  const paths = buildPublicPaths(pages, events)
  const xml = buildSitemapXml(origin, paths)

  return c.text(xml, 200, {
    'Content-Type': 'application/xml; charset=utf-8',
    'Cache-Control': 'public, max-age=3600',
  })
})
```

Acceptance checks:

```bash
curl -i http://localhost:8787/sitemap.xml
```

Expected:

- HTTP `200`.
- `Content-Type: application/xml`.
- Starts with `<?xml version="1.0"`.
- Contains `/en`, `/lv`, `/en/about`, `/lv/about`.
- No HTML layout.

## Phase 3: Define Public Snapshot Data Types

### Task 3.1: Create snapshot type file

Create file:

- `_SonicJS/latviansof/src/site/publish/types.ts`

Define a simple JSON shape:

```ts
import type {
  EventData,
  FooterSections,
  NavigationItem,
  PageData,
  SiteSettingsData,
  TrustedPartner,
} from '../utils/content'

export type PublicPageKind = 'home' | 'donate' | 'page' | 'event'

export interface PublicSharedSnapshot {
  navItems: NavigationItem[]
  footerSections: FooterSections
  settings: SiteSettingsData
  trustedPartners: TrustedPartner[]
}

export interface PublicRouteSnapshot {
  path: string
  lang: 'en' | 'lv'
  kind: PublicPageKind
  slug?: string
  page?: PageData
  event?: EventData
  pages?: PageData[]
  events?: EventData[]
  shared: PublicSharedSnapshot
}

export interface PublicSiteSnapshot {
  generatedAt: string
  paths: string[]
  routes: Record<string, PublicRouteSnapshot>
}
```

Keep this deliberately boring. Do not include functions. It must JSON stringify cleanly.

### Task 3.2: Create snapshot builder

Create file:

- `_SonicJS/latviansof/src/site/publish/build-public-snapshot.ts`

Use existing helpers from:

- `_SonicJS/latviansof/src/site/utils/content.ts`

Import:

- `getAllPublishedPages`
- `getAllPublishedEvents`
- `getAllPublishedTrustedPartners`
- `getFooterSections`
- `getNavigationItems`
- `getSiteSettings`
- `isEventUpcoming`
- `compareEventsByDate`
- `buildPublicPaths`

Implementation outline:

1. Read all public content from D1 once.
2. Build `shared`.
3. Build `paths` with `buildPublicPaths()`.
4. Build `routes[path]` for every path.
5. For `/en` and `/lv`, include kind `home`.
6. For `/en` and `/lv`, also include the homepage render inputs:
   - `page`: the page with slug `home`
   - `pages`: all public content-card pages, matching current homepage behavior
   - `events`: upcoming events first, then past events, matching current homepage behavior
7. For `/en/donate` and `/lv/donate`, include kind `donate`.
8. For normal pages, include kind `page` and matching `page`.
9. For event pages, include kind `event` and matching `event`.

Acceptance checks:

- Snapshot has a route for every path.
- Every route has `shared`.
- Every route has the required fields for its `kind`.
- `JSON.stringify(snapshot)` works.

## Phase 4: Store Snapshot In KV

### Task 4.1: Add KV binding to public site types

File to edit:

- `_SonicJS/latviansof/src/site/index.ts`

Current binding type:

```ts
type Bindings = {
  DB: D1Database
}
```

Change it to include KV:

```ts
type Bindings = {
  DB: D1Database
  CACHE_KV: KVNamespace
}
```

If TypeScript complains about `KVNamespace`, import or rely on Worker global types from `@cloudflare/workers-types`.

### Task 4.2: Add KV key constants

Create file:

- `_SonicJS/latviansof/src/site/publish/kv-keys.ts`

Suggested content:

```ts
export const SITEMAP_JSON_KEY = 'public:site:sitemap'
export const SITEMAP_XML_KEY = 'public:site:sitemap.xml'
export const ROBOTS_TXT_KEY = 'public:site:robots.txt'
export const GENERATED_AT_KEY = 'public:site:generatedAt'

export function pageKey(path: string): string {
  return `public:site:page:${path}`
}
```

### Task 4.3: Add snapshot writer

Create file:

- `_SonicJS/latviansof/src/site/publish/write-public-snapshot.ts`

Function to implement:

```ts
import type { PublicSiteSnapshot } from './types'
import {
  GENERATED_AT_KEY,
  ROBOTS_TXT_KEY,
  SITEMAP_JSON_KEY,
  SITEMAP_XML_KEY,
  pageKey,
} from './kv-keys'
import { buildSitemapXml } from '../sitemap'

export async function writePublicSnapshotToKv(
  kv: KVNamespace,
  origin: string,
  snapshot: PublicSiteSnapshot,
): Promise<void> {
  const robots = ['User-agent: *', 'Allow: /', '', `Sitemap: ${origin}/sitemap.xml`, ''].join('\n')
  const sitemapXml = buildSitemapXml(origin, snapshot.paths)

  await kv.put(GENERATED_AT_KEY, snapshot.generatedAt)
  await kv.put(SITEMAP_JSON_KEY, JSON.stringify(snapshot.paths))
  await kv.put(SITEMAP_XML_KEY, sitemapXml)
  await kv.put(ROBOTS_TXT_KEY, robots)

  for (const [path, route] of Object.entries(snapshot.routes)) {
    await kv.put(pageKey(path), JSON.stringify(route))
  }
}
```

Note:

- This is current-only on purpose.
- If a publish fails halfway, rerun publish.

## Phase 5: Add Admin Publish Endpoint

Keep this endpoint admin-only. Do not expose it to public users.

### Task 5.1: Decide app-level or fork-level implementation

Simplest first version: add app-level route in `_SonicJS/latviansof/src/site/index.ts`.

Better later version: add proper SonicJS admin plugin/route in the fork.

For now, use app-level route only if it can safely require admin auth. If auth is hard to access in `siteRouter`, put it in the SonicJS fork where admin route guards already exist.

Files to inspect:

- `_SonicJS/darwin-sonicjs/packages/core/src/routes/admin-api.ts`
- `_SonicJS/darwin-sonicjs/packages/core/src/middleware/auth.ts`
- `_SonicJS/darwin-sonicjs/packages/core/src/app.ts`

Reminder:

- These files are in our local SonicJS fork, not in an external dependency.
- If the publish endpoint needs proper admin permission checks, prefer adding it in this fork area rather than trying to fake auth in the public app router.

### Task 5.2: Add publish route

Suggested route:

```txt
POST /admin/api/publish-public-site
```

High-level behavior:

1. Require admin/editor permission.
2. Build snapshot from D1.
3. Write snapshot to KV.
4. Return JSON:

```json
{
  "success": true,
  "generatedAt": "...",
  "paths": 42
}
```

Acceptance checks:

- Unauthenticated request returns `401` or redirects to login.
- Admin request returns `200`.
- KV receives `public:site:generatedAt`.
- KV receives page keys.
- KV receives `sitemap.xml`.

## Phase 6: Read Public Pages From KV

### Task 6.1: Add KV reader helper

Create file:

- `_SonicJS/latviansof/src/site/publish/read-public-snapshot.ts`

Implement:

```ts
import { pageKey, ROBOTS_TXT_KEY, SITEMAP_XML_KEY } from './kv-keys'
import type { PublicRouteSnapshot } from './types'

export async function getPublicRouteFromKv(
  kv: KVNamespace,
  path: string,
): Promise<PublicRouteSnapshot | null> {
  const raw = await kv.get(pageKey(path))
  if (!raw) return null

  return JSON.parse(raw) as PublicRouteSnapshot
}

export async function getRobotsFromKv(kv: KVNamespace): Promise<string | null> {
  return kv.get(ROBOTS_TXT_KEY)
}

export async function getSitemapXmlFromKv(kv: KVNamespace): Promise<string | null> {
  return kv.get(SITEMAP_XML_KEY)
}
```

### Task 6.2: Render route snapshot without D1

Create file:

- `_SonicJS/latviansof/src/site/render-route-snapshot.ts`

Move rendering decisions from `_SonicJS/latviansof/src/site/index.ts` into a helper:

```ts
export function renderRouteSnapshot(opts: {
  route: PublicRouteSnapshot
  origin: string
}): string
```

It should call the existing render functions:

- `renderLayout`
- `renderHomePage`
- `renderDonatePage`
- `renderSimplePage`
- `renderContentPage`
- `renderEventDetailPage`

Use the same behavior currently in `_SonicJS/latviansof/src/site/index.ts`.

Acceptance checks:

- Rendering `/en` from snapshot looks the same as current homepage.
- Rendering `/en/about` from snapshot looks the same as current page.
- Rendering `/en/events/:slug` from snapshot looks the same as current event page.

### Task 6.3: Update public routes to try KV first

File to edit:

- `_SonicJS/latviansof/src/site/index.ts`

For each public page route:

- `/:lang`
- `/:lang/donate`
- `/:lang/events/:slug`
- `/:lang/:slug`

First attempt:

```ts
const route = await getPublicRouteFromKv(c.env.CACHE_KV, c.req.path)
if (route) {
  const html = renderRouteSnapshot({ route, origin: new URL(c.req.url).origin })
  c.header('Cache-Control', 'public, max-age=60, s-maxage=600')
  c.header('X-Public-Source', 'kv')
  return c.html(html, 200)
}
```

Then keep current D1 logic as fallback.

Add this header to fallback responses:

```ts
c.header('X-Public-Source', 'd1-fallback')
```

Acceptance checks:

- Before publishing snapshot, public pages still work from D1 fallback.
- After publishing snapshot, public pages return `X-Public-Source: kv`.
- D1 queries should drop sharply for public traffic after snapshot exists.

## Phase 7: Serve robots.txt and sitemap.xml From KV

### Task 7.1: Update `/robots.txt`

File to edit:

- `_SonicJS/latviansof/src/site/index.ts`

Behavior:

1. Try `getRobotsFromKv(c.env.CACHE_KV)`.
2. If present, return it.
3. If missing, return static fallback.

Headers:

```txt
Content-Type: text/plain; charset=utf-8
Cache-Control: public, max-age=3600
X-Public-Source: kv or fallback
```

### Task 7.2: Update `/sitemap.xml`

File to edit:

- `_SonicJS/latviansof/src/site/index.ts`

Behavior:

1. Try `getSitemapXmlFromKv(c.env.CACHE_KV)`.
2. If present, return it.
3. If missing, generate from D1 using the Phase 2 route logic.

## Phase 9: Add Tests

### Task 9.1: Test sitemap helpers

Create test file:

- `_SonicJS/latviansof/src/site/sitemap.test.ts`

Test cases:

- Includes `/en` and `/lv`.
- Includes both language paths for normal pages.
- Excludes `home`.
- Excludes `donate` document path but includes `/en/donate` and `/lv/donate`.
- Excludes pages with `noIndex`.
- Includes event detail paths.
- XML escapes `&`.

Run:

```bash
cd _SonicJS/latviansof
npm test -- sitemap
```

### Task 9.2: Test KV key helper

Create test file:

- `_SonicJS/latviansof/src/site/publish/kv-keys.test.ts`

Test:

- `SITEMAP_XML_KEY` is exact.
- `GENERATED_AT_KEY` is exact.
- `pageKey('/en/about')` matches expected.
- No key contains accidental double spaces.

### Task 9.3: Test snapshot builder

Create test file:

- `_SonicJS/latviansof/src/site/publish/build-public-snapshot.test.ts`

Keep this simple:

- Mock content helper functions if possible.
- Verify all paths get route entries.
- Verify JSON stringify works.

## Operations Notes: Wrangler Token

Wrangler auth for this repository is already set up through a gitignored `.env.local` file.

Read before running deployment, remote D1, or remote KV commands:

- Root README section: `README.md`, heading `Wrangler Access`
- Sonic README section: `_SonicJS/latviansof/README.md`, heading `Deployment Access`
- Project agent notes: `AGENTS.md`, heading `Wrangler Access`

Important facts:

- The real token file is `_Payload/.env.local`.
- `_SonicJS/latviansof/.env.local` is a symlink to `../../_Payload/.env.local`.
- `_FlareCMS/.env.local` is a symlink to `../_Payload/.env.local`.
- Required variables are `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.
- Run Wrangler commands from `_SonicJS/latviansof` so Wrangler can auto-load the local `.env.local` symlink.
- Never print, paste, commit, screenshot, or log the token value.

Verification command:

```bash
cd _SonicJS/latviansof
npx wrangler whoami
```

Expected:

- Wrangler reports the authenticated Cloudflare account.
- No secret values are printed.

Remote KV checks will need the same token:

```bash
cd _SonicJS/latviansof
npx wrangler kv key get public:site:generatedAt --binding CACHE_KV --remote --text -c wrangler.jsonc
```

If Wrangler cannot authenticate:

1. Confirm `_SonicJS/latviansof/.env.local` exists.
2. Confirm it is a symlink to `../../_Payload/.env.local`.
3. Confirm `_Payload/.env.local` contains `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.
4. Do not create a second token file unless the owner asks for that.

## Operations Notes: Surf Live Tests

Use Surf for browser-level live tests after code changes. Surf controls Chrome from the shell.

First refresh Surf command guidance:

```bash
surf --llm-context
```

Current useful Surf commands:

```bash
surf navigate "https://latviansofdarwin.org.au/"
surf wait 2
surf page.read --depth 3 --compact
surf screenshot /tmp/latviansof-home.png
surf js "return document.title"
surf emulate.device "iPhone 14"
surf resize 375 812
surf scroll bottom
surf doctor --browser all
```

Use a named session for this project so tests do not interfere with other browser tasks:

```bash
export SURF_SESSION="latviansof-vivaldi"
surf navigate "https://latviansofdarwin.org.au/"
surf wait 2
surf page.read --depth 4 --compact
```

### Surf Test Checklist: SEO Routes

Run after local deploy or production deploy:

```bash
export SURF_SESSION="latviansof-vivaldi"
surf navigate "https://latviansofdarwin.org.au/robots.txt"
surf wait 1
surf page.read --depth 2 --compact
surf js "return document.body.innerText"
```

Expected:

- Body text contains `User-agent: *`.
- Body text contains `Sitemap: https://latviansofdarwin.org.au/sitemap.xml`.
- Page does not show the public site header/footer.

Then test sitemap:

```bash
export SURF_SESSION="latviansof-vivaldi"
surf navigate "https://latviansofdarwin.org.au/sitemap.xml"
surf wait 1
surf page.read --depth 2 --compact
surf js "return document.body.innerText.slice(0, 500)"
```

Expected:

- XML text contains `<urlset`.
- XML text contains `https://latviansofdarwin.org.au/en`.
- XML text contains Latvian and English URLs.
- Page does not render as a normal public HTML page.

### Surf Test Checklist: Public Pages

Desktop:

```bash
export SURF_SESSION="latviansof-vivaldi"
surf navigate "https://latviansofdarwin.org.au/en"
surf wait 2
surf page.read --depth 4 --compact
surf screenshot /tmp/latviansof-en-desktop.png
surf js "return { title: document.title, h1: document.querySelector('h1')?.innerText, canonical: document.querySelector('link[rel=canonical]')?.href }"
```

Expected:

- Page title is meaningful.
- Main heading is visible.
- Canonical URL is `/en`, not `/en/robots.txt` or another wrong path.
- Header and footer render correctly.

Mobile:

```bash
export SURF_SESSION="latviansof-vivaldi"
surf emulate.device "iPhone 14"
surf navigate "https://latviansofdarwin.org.au/en"
surf wait 2
surf page.read --depth 4 --compact
surf screenshot /tmp/latviansof-en-mobile.png
```

Expected:

- Header is usable.
- No overlapping text.
- Main content is visible without horizontal scrolling.

Latvian page:

```bash
export SURF_SESSION="latviansof-vivaldi"
surf navigate "https://latviansofdarwin.org.au/lv"
surf wait 2
surf page.read --depth 4 --compact
surf js "return { title: document.title, htmlLang: document.documentElement.lang, canonical: document.querySelector('link[rel=canonical]')?.href }"
```

Expected:

- `htmlLang` is `lv`.
- Canonical URL is `/lv`.
- Latvian content is visible.

### Surf Test Checklist: Admin Safety

Do not log in or change content during this checklist unless specifically asked.

Read-only admin route smoke test:

```bash
export SURF_SESSION="latviansof-vivaldi"
surf navigate "https://latviansofdarwin.org.au/admin"
surf wait 2
surf page.read --depth 3 --compact
```

Expected:

- Either login page or authenticated admin dashboard appears.
- Public KV caching must not cache this response.
- Admin pages must not return `X-Public-Source: kv`.

If Surf reports `tab_busy`, `browser_busy`, `tab_gone`, or `session_epoch_stale`, run the exact recovery command printed by Surf.

## Phase 10: Manual Verification

### Task 10.1: Local dev check

Start local Worker:

```bash
cd _SonicJS/latviansof
npm run dev
```

Check:

```bash
curl -i http://localhost:8787/robots.txt
curl -i http://localhost:8787/sitemap.xml
curl -i http://localhost:8787/en
curl -i http://localhost:8787/lv
curl -i http://localhost:8787/en/about
```

Expected:

- `robots.txt` is text, not HTML.
- `sitemap.xml` is XML, not HTML.
- Public pages still render.
- Header shows `X-Public-Source`.

### Task 10.2: Production check after deploy

After deploy:

```bash
curl -i https://latviansofdarwin.org.au/robots.txt
curl -i https://latviansofdarwin.org.au/sitemap.xml
curl -i https://latviansofdarwin.org.au/en
curl -i https://latviansofdarwin.org.au/en/about
```

Expected:

- `robots.txt` returns `200`.
- `sitemap.xml` returns `200`.
- No canonical URL points to `/en/robots.txt`.
- Public pages return `X-Public-Source: kv` after snapshot publish.

## Phase 11: Cloudflare D1 Alert Verification

Before deploy:

- Screenshot D1 operation alerts or metrics.
- Note current date/time.

After deploy and snapshot publish:

- Check D1 reads over the next several hours.
- Public traffic should not produce D1 reads.
- Remaining D1 reads should mostly come from admin, auth, publish, or cold-start bootstrap.

If D1 operations remain high:

1. Confirm public pages return `X-Public-Source: kv`.
2. Check whether bots are hitting `/api/*`, `/admin/*`, `/auth/*`, or random paths.
3. Add route-level bot/crawler protections only after confirming source paths.

## Do Not Do Yet

- Do not remove D1 content helpers.
- Do not remove current public rendering functions.
- Do not rewrite the whole SonicJS fork.
- Do not add R2 for this first implementation.
- Do not pre-render HTML until JSON snapshots are stable.
- Do not cache authenticated/admin routes.
- Do not disable D1 fallback until KV publishing has been stable in production.

## Later Ideas

- Add button in Sonic admin UI: `Publish public site`.
- Automatically publish after content save.
- Add `PUBLIC_D1_FALLBACK=false` after KV publishing is proven stable.
- Store pre-rendered HTML per URL in KV.
- Add sitemap index if URL count grows.
- Add `/__public-cache/status` admin endpoint showing generated time, path count, and source.

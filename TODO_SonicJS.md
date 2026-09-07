# SonicJS implementation plan

## Goal

Create an independently hosted SonicJS copy of the current Payload website for customer evaluation and direct architectural comparison with FlareCMS.

- The public website must reproduce the current production design, routes, bilingual content (EN/LV), events, donation details, and contact behaviour.
- Unlike FlareCMS (which requires building a custom admin from scratch), SonicJS's rich out-of-the-box admin panel (`/admin/content`, `/admin/media`, Better-Auth session management) is retained as-is.
- Content models (Pages, Events, Site Settings, Navigation, Footer) are defined as code-first SonicJS collections in `_SonicJS/latviansof/src/collections/`.
- The public frontend is rendered directly on Cloudflare Workers using Hono (SonicJS's native web engine) and Tailwind CSS, providing edge-rendered HTML with near-zero cold start overhead.
- Payload remains in production until the customer explicitly approves a later cutover.
- This evaluation site is fully isolated in `_SonicJS/latviansof/` and its own Cloudflare D1/R2 resources.

## Fixed technical decisions

### Existing SonicJS core to retain

Keep and leverage the existing SonicJS foundation:

- Built-in admin UI at `/admin/*` (HTMX + Tailwind + Alpine).
- Better-Auth user authentication (`/auth/login`, session cookies, RBAC).
- SonicJS document engine (D1-backed, revisioned document store with fast KV caching).
- SonicJS media asset management with Cloudflare R2 (`MEDIA_BUCKET`).
- Hono web framework running directly on Cloudflare Workers.
- Pinned `better-auth` and `@better-auth/drizzle-adapter` at `1.6.23` (matching the core Drizzle schema).

Do not rebuild the admin panel, replace Better-Auth, introduce Next.js, or add heavy external frameworks.

### Frontend architecture: Edge-rendered Hono JSX

- SonicJS runs as a native Hono app on Cloudflare Workers.
- The public frontend will be implemented as a clean public router mounted alongside `/admin`, using Hono's lightweight JSX / HTML template engine (`hono/html` or `hono/jsx`).
- Styles use the exact production color palette, typography (Inter + Lora), glassmorphism, and responsive grid from `_Payload/src/app/(frontend)/globals.css`.
- Static assets and images are streamed via R2 (`/media/*` or R2 public access).

### Publishing & workflow behaviour

- SonicJS provides built-in draft and published statuses (`status: 'published' | 'draft'`).
- The public frontend queries only `status = 'published'` documents.
- Admin editors can draft, edit, and publish pages and events directly from `/admin/content`.

## Exact public routes

Implement these public routes in `_SonicJS/latviansof/src/site/routes.ts`:

| Route | Behaviour |
|---|---|
| `/` | Redirect permanently (301) or 302 to `/en` |
| `/donate` | Redirect to `/en/donate` |
| `/events/:slug` | Redirect to `/en/events/:slug` |
| `/:lang` | Homepage; accept only `en` and `lv` |
| `/:lang/donate` | Donation page |
| `/:lang/events/:slug` | Event detail |
| `/:lang/:slug` | Standard content or legal page |
| `/auth/login` | SonicJS admin login (retained) |
| `/admin/*` | SonicJS admin panel (retained) |
| `/api/*` | SonicJS REST API (retained) |
| `/media/:id` | R2 media streaming (retained) |

Unknown languages and invalid slugs must render a styled 404 Not Found page matching the site design. Language switching preserves the current page or event slug.

## Exact collections in SonicJS

Define the following code-first collections in `_SonicJS/latviansof/src/collections/`:

### 1. `pages.collection.ts` (Slug: `pages`)

Manages all fixed site pages with bilingual support:

- **Slug**: `home`, `about`, `history`, `community`, `membership`, `culture`, `contact`, `donate`, `privacy`, `terms`, `eula`
- **Template**: `home` | `content` | `simple` | `donate`
- **Fields**:
  - `slug` (string, unique, required)
  - `template` (select: `home`, `content`, `simple`, `donate`)
  - `sortOrder` (number, default 10)
  - `title_en` / `title_lv` (string, required)
  - `excerpt_en` / `excerpt_lv` (textarea)
  - `body_en` / `body_lv` (lexical / markdown)
  - `heroImage` (media relation)
  - `ctaLabel_en` / `ctaLabel_lv` (string)
  - `ctaHref` (string)
  - `metaTitle_en` / `metaTitle_lv` (string)
  - `metaDescription_en` / `metaDescription_lv` (textarea)
  - `noIndex` (boolean, default false)

### 2. `events.collection.ts` (Slug: `events`)

Manages community events:

- **Fields**:
  - `title_en` / `title_lv` (string, required)
  - `slug` (slug, unique, required)
  - `eventDate` (datetime, required)
  - `body_en` / `body_lv` (lexical / markdown)
  - `image` (media relation)
  - `facebookUrl` (string, url)
  - `accentTone` (select: `emerald`, `amber`, `sky`, `rose`, `violet`, `slate`)

### 3. `navigation.collection.ts` (Slug: `navigation`)

Header navigation items:

- **Fields**:
  - `items` (JSON / nested array of `{ label_en, label_lv, href, newTab }`)

### 4. `footer.collection.ts` (Slug: `footer`)

Footer details and links:

- **Fields**:
  - `tagline_en` / `tagline_lv` (string)
  - `address_en` / `address_lv` (string)
  - `rights_en` / `rights_lv` (string)
  - `items` (JSON / nested array of `{ label_en, label_lv, href, newTab }`)

### 5. `site-settings.collection.ts` (Slug: `site-settings`)

Global site configuration:

- **Fields**:
  - `associationName` (string)
  - `contactEmail` (string)
  - `socialLinks` (JSON / nested array of `{ platform, url }`)
  - `bankName`, `bsb`, `accountNumber`, `accountName`, `payId` (donation banking details)

## Exact public frontend implementation

Create the public website components under `_SonicJS/latviansof/src/site/`:

```text
_SonicJS/latviansof/src/site/
├── index.ts                  # Hono public router mounting all public endpoints
├── layout.ts                 # Base HTML wrapper (head, fonts, CSS, scripts, nav, footer)
├── header.ts                 # Bilingual header & mobile hamburger menu
├── footer.ts                 # Bilingual footer with acknowledgment of country
├── language-switcher.ts      # EN <-> LV toggle preserving active URL
├── styles.ts                 # Production Tailwind tokens & custom glassmorphism styles
├── pages/
│   ├── home.ts               # Hero, Events carousel/grid, Page Cards, Support Association
│   ├── content-page.ts       # History, Community, Membership, Culture (with sidebar/image)
│   ├── simple-page.ts        # About, Contact, Privacy, Terms, EULA
│   ├── donate.ts             # Bank transfer details, PayID, donation tier cards
│   ├── event-detail.ts       # Single event page with date badge, Facebook CTA
│   └── not-found.ts          # Styled 404 page
└── utils/
    ├── content.ts            # D1 query helpers for published pages, events, settings
    └── markdown.ts           # Markdown/Lexical-to-HTML parser
```

### Visual and design fidelity

- Reproduce the exact styling from `_Payload/src/app/(frontend)/globals.css`:
  - Background: Cream `#fdfaf6`
  - Text: Ink `#1e1b26`
  - Accents: Latvian Red `#7a2231`, Sunset Orange `#f97316`, Sunset Gold `#fbbf24`, Sunset Peach `#ffedd5`
  - Fonts: `Inter` for UI body, `Lora` for editorial serif headings
  - Glass panels: `.glass-panel`, `.glass-panel-dark`, `.glass-panel-latvian`
- Support full mobile responsive drawer navigation and touch-friendly targets.
- Output semantic HTML tags (`<header>`, `<nav>`, `<main>`, `<article>`, `<footer>`).

## Content migration from Payload

Create `_SonicJS/latviansof/scripts/migrate-from-payload.ts`:

1. Fetch published documents from the production Payload REST API (`https://latviansofdarwin.org.au/api/pages?depth=1&limit=100&draft=false`, `events`, `globals`).
2. Map Payload Pages and SpecialPages into SonicJS `pages` collection.
3. Map Payload Events into SonicJS `events` collection.
4. Map Payload Globals (`site-settings`, `main-menu`, `footer`) into `site-settings`, `navigation`, and `footer`.
5. Upload referenced images into the SonicJS R2 media bucket (`MEDIA_BUCKET`) and register in `media` table.
6. Make the script idempotent with `ON CONFLICT` or check-before-insert so rerunning updates without duplication.
7. Preserve both languages (English and Latvian) with zero content loss.

## Comparison: SonicJS vs FlareCMS

| Criteria | SonicJS | FlareCMS |
|---|---|---|
| **Admin UI** | Built-in out of the box (HTMX, Tailwind, Search, Bulk Actions, Media) | Must be coded and maintained manually (React, Material UI) |
| **Authentication** | Better-Auth with sessions, RBAC, lockout protection | Custom JWT with localStorage tokens |
| **Public Engine** | Native Hono running directly on Cloudflare Workers (SSR HTML) | React SPA + Cloudflare Pages Functions API |
| **Speed & TTFB** | Edge-rendered HTML (~15-50ms TTFB), no client hydration delay | Client-side React bundle download & render |
| **SEO & Social Share** | Full SSR meta tags and Open Graph out of the box | Requires server rendering or pre-rendering |
| **Content Model** | Code-first declarative collections with typed schemas | Custom SQL migrations + Drizzle schema mapping |
| **Maintenance Burden** | Standard CMS with maintained core packages | Fully bespoke custom codebase to maintain |

## Ordered task checklist

### Phase 1 — Collections & content schema

- [ ] Register `pages`, `events`, `navigation`, `footer`, and `site-settings` collections in `_SonicJS/latviansof/src/collections/`.
- [ ] Ensure all collection schemas define both `_en` and `_lv` fields for full bilingual parity.
- [ ] Verify collections appear and render editable form fields in `/admin/content`.
- [ ] Confirm media picker works when attaching images to pages and events.

### Phase 2 — Public Hono frontend

- [ ] Create `_SonicJS/latviansof/src/site/` with Hono router and layout template.
- [ ] Port production CSS styles, fonts, and design tokens into `styles.ts`.
- [ ] Implement `header.ts`, `footer.ts`, and `language-switcher.ts`.
- [ ] Implement `home.ts` (Hero banner, upcoming events, page cards, support banner).
- [ ] Implement `content-page.ts` and `simple-page.ts`.
- [ ] Implement `event-detail.ts` and `donate.ts`.
- [ ] Implement `not-found.ts` with 404 status.
- [ ] Mount the public router in `_SonicJS/latviansof/src/index.ts`.
- [ ] Confirm `/` redirects to `/en` and all bilingual routes resolve properly.

### Phase 3 — Content migration script

- [ ] Write `_SonicJS/latviansof/scripts/migrate-from-payload.ts`.
- [ ] Test migration locally against local D1 database.
- [ ] Validate that all pages, events, menus, and footer content render accurately in both English and Latvian.
- [ ] Ensure image URLs resolve and display properly from R2.

### Phase 4 — Cloudflare evaluation deployment

- [ ] Create evaluation Cloudflare resources (`latviansof-sonicjs` D1, `latviansof-sonicjs-media` R2, `latviansof-sonicjs-kv` KV).
- [ ] Update `wrangler.jsonc` with the evaluation resource IDs.
- [ ] Run remote D1 migrations and execute the content migration to remote D1/R2.
- [ ] Deploy the Worker with `pnpm run deploy:worker` (or `./deploy.sh`).
- [ ] Verify the evaluation site on its `*.workers.dev` or custom staging domain.

## Verification checklist

- [ ] `/` redirects to `/en`.
- [ ] Switching language between EN and LV preserves the current page and event path.
- [ ] Homepage matches production: Hero, Page Cards, Events, Partner logos, Support Association banner.
- [ ] Content pages (History, Community, Membership, Culture) match production layout, typography, and images.
- [ ] Donation page displays bank details, PayID, and donation cards accurately.
- [ ] Event detail page displays event date, description, image, and Facebook link.
- [ ] Admin login at `/auth/login` works with `.dev.vars` credentials.
- [ ] Admin dashboard at `/admin/content` allows editing any page or event and immediately reflects changes on the public site.
- [ ] R2 media uploads in admin are served properly on the frontend.
- [ ] Zero impact on production Payload CMS deployment or production D1/R2.

## Definition of done

- A non-technical editor can log into SonicJS admin, edit content in English or Latvian, upload images, and see the live result on the public site.
- The public website reproduces the production site's exact visual appearance, responsive layout, and bilingual routes.
- The client can compare SonicJS vs FlareCMS side-by-side to evaluate ease of editing, performance, and long-term maintainability before making a CMS decision.

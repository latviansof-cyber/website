# FlareCMS implementation plan

## Goal

Create an independently hosted FlareCMS copy of the current Payload website for customer evaluation.

- The public website must reproduce the current design, routes, bilingual content, events, contact behaviour, and donation behaviour.
- The admin must contain only **Pages** and **Media**, plus **View website** and **Log out** actions.
- Existing FlareCMS authentication, installation, API, D1, R2, migration, and deployment code must be reused.
- Payload remains in production until the customer explicitly approves a later cutover.
- This is a site-specific implementation, not a general-purpose CMS.

## Fixed technical decisions

The developer must follow these decisions rather than design another architecture.

### Existing code to retain

Keep and adapt these existing FlareCMS parts:

- `_FlareCMS/functions/api/auth.ts`
- `_FlareCMS/functions/api/install.ts`
- `_FlareCMS/functions/api/login.ts`
- `_FlareCMS/functions/api/options/index.ts`
- `_FlareCMS/functions/api/posts/index.ts`
- `_FlareCMS/functions/api/posts/[id].ts`
- `_FlareCMS/functions/api/assets/index.ts`
- `_FlareCMS/functions/api/assets/[id].ts`
- `_FlareCMS/src/Login.tsx`
- `_FlareCMS/src/Install.tsx`
- `_FlareCMS/src/admin/Layout.tsx`
- `_FlareCMS/src/admin/Posts.tsx`
- `_FlareCMS/src/admin/Editor.tsx`
- `_FlareCMS/migrations/0001_initial.sql`
- `_FlareCMS/wrangler.jsonc`
- `_FlareCMS/deploy.sh`

Do not replace the JWT login flow, create a new users system, introduce roles, or copy Payload authentication.

### Framework and storage

- Continue using React, React Router, Material UI, Drizzle, Cloudflare Pages Functions, D1, and R2.
- Do not introduce Next.js, Payload, Tailwind, Redux, a form framework, or another CMS.
- Continue using the existing `posts` table for all editable site records.
- Continue using the existing `options` table for installation and authentication values.
- Continue using the existing R2 `BUCKET` binding for files.
- Add one small `media` table for file listing and alt text.

### Publishing behaviour

- The existing `status` field remains, but the admin saves records as `publish` immediately.
- Do not build draft tabs, scheduled publishing, autosave, revisions, preview versions, or approval workflows.
- Do not expose record creation/deletion for fixed site pages.
- Events may be created and deleted from the Pages section because events genuinely change over time.

## Exact public routes

Implement these React Router routes in `_FlareCMS/src/index.tsx`:

| Route | Behaviour |
|---|---|
| `/` | Redirect permanently/client-side replace to `/en` |
| `/donate` | Redirect to `/en/donate` |
| `/events/:slug` | Redirect to `/en/events/:slug` |
| `/:lang` | Homepage; accept only `en` and `lv` |
| `/:lang/donate` | Donation page |
| `/:lang/events/:slug` | Event detail |
| `/:lang/:slug` | Standard or legal/content page |
| `/login` | Existing FlareCMS login |
| `/install` | Existing FlareCMS installation |
| `/admin/pages` | Page list, including an Events subsection |
| `/admin/pages/:id` | Page/event editor |
| `/admin/media` | Media library |

Unknown languages and slugs must render a proper not-found page. Preserve the current URL when switching between English and Latvian.

## Exact editable records

Seed the following fixed records into `posts` with `type = 'page'` and `status = 'publish'`:

| Slug | Template | Admin label |
|---|---|---|
| `home` | `home` | Homepage |
| `about` | `simple` | About |
| `history` | `content` | History |
| `community` | `content` | Community |
| `membership` | `content` | Membership |
| `culture` | `content` | Culture & Traditions |
| `contact` | `simple` | Contact |
| `donate` | `donate` | Donate |
| `privacy` | `simple` | Privacy Policy |
| `terms` | `simple` | Terms & Conditions |
| `eula` | `simple` | EULA |
| `navigation` | `navigation` | Header navigation |
| `footer` | `footer` | Footer |
| `site` | `site` | Site details |

Events use `template = 'event'` and their existing event slug. They appear under an **Events** heading within Pages; do not add a third admin navigation section.

## Exact database change

Create `_FlareCMS/migrations/0002_site_content.sql`. Do not edit `0001_initial.sql`.

Add these columns to `posts`:

```sql
ALTER TABLE posts ADD COLUMN slug TEXT;
ALTER TABLE posts ADD COLUMN template TEXT NOT NULL DEFAULT 'content';
ALTER TABLE posts ADD COLUMN sortOrder INTEGER NOT NULL DEFAULT 10;
ALTER TABLE posts ADD COLUMN contentEn TEXT NOT NULL DEFAULT '{}';
ALTER TABLE posts ADD COLUMN contentLv TEXT NOT NULL DEFAULT '{}';
ALTER TABLE posts ADD COLUMN settings TEXT NOT NULL DEFAULT '{}';

CREATE UNIQUE INDEX IF NOT EXISTS postsSlugIdx ON posts (slug);
CREATE INDEX IF NOT EXISTS postsTemplateOrderIdx ON posts (template, sortOrder);
```

Create the media metadata table in the same migration:

```sql
CREATE TABLE IF NOT EXISTS media (
  id TEXT PRIMARY KEY NOT NULL,
  filename TEXT NOT NULL,
  mimeType TEXT NOT NULL,
  size INTEGER NOT NULL,
  altEn TEXT NOT NULL DEFAULT '',
  altLv TEXT NOT NULL DEFAULT '',
  createdAt INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS mediaCreatedAtIdx ON media (createdAt);
```

Update `_FlareCMS/functions/api/schema.ts` to match these columns exactly. Keep the old `title` and `content` columns because SQLite cannot remove them simply; set them from the English title/body when saving for backward compatibility.

Apply locally with:

```bash
cd _FlareCMS
npx wrangler d1 migrations apply DB --local -c wrangler.jsonc
```

Never apply this migration to the Payload D1 database.

## Exact content shapes

Create `_FlareCMS/src/contentTypes.ts` and define the types below. `contentEn` and `contentLv` each store one JSON object. `settings` stores language-independent JSON.

### `content` template

```ts
type ContentPageLanguage = {
  title: string
  excerpt: string
  body: string
  ctaLabel: string
  metaTitle: string
  metaDescription: string
}

type ContentPageSettings = {
  imageId: string | null
  ctaHref: string
  noIndex: boolean
}
```

Use this for `history`, `community`, `membership`, and `culture`.

### `simple` template

```ts
type SimplePageLanguage = {
  title: string
  body: string
  metaTitle: string
  metaDescription: string
}

type SimplePageSettings = {
  noIndex: boolean
}
```

Use this for `about`, `contact`, `privacy`, `terms`, and `eula`.

### `home` template

```ts
type HomeLanguage = {
  heroEyebrow: string
  heroTitle: string
  heroSubtitle: string
  heroPrimaryLabel: string
  heroSecondaryLabel: string
  eventsTitle: string
  eventsIntro: string
  exploreEyebrow: string
  exploreTitle: string
  exploreIntro: string
}

type HomeSettings = {
  heroImageId: string | null
  heroPrimaryHref: string
  heroSecondaryHref: string
}
```

### `event` template

```ts
type EventLanguage = {
  title: string
  body: string
}

type EventSettings = {
  eventDate: string
  facebookUrl: string
  imageId: string | null
  accentTone: 'emerald' | 'amber' | 'sky' | 'rose' | 'violet' | 'slate'
}
```

Use ISO dates. Determine whether an event is past by comparing `eventDate`; do not store a separate `isPast` field.

### `navigation` template

```ts
type NavigationLanguage = {
  items: Array<{ label: string; href: string; newTab: boolean }>
}
```

The English and Latvian arrays must have the same length and order.

### `footer` template

```ts
type FooterLanguage = {
  tagline: string
  address: string
  rights: string
  items: Array<{ label: string; href: string; newTab: boolean }>
}
```

### `site` template

```ts
type SiteLanguage = {
  associationName: string
  tagline: string
  contactEmail: string
}

type SiteSettings = {
  socialLinks: Array<{ platform: string; url: string }>
}
```

### `donate` template

```ts
type DonateLanguage = {
  title: string
  introduction: string
  bankName: string
  bsb: string
  accountNumber: string
  accountName: string
  payId: string
  instructions: string
  features: string[]
  priorityCards: Array<{ title: string; body: string; url: string; newTab: boolean }>
  donationCards: Array<{ amount: number; body: string; url: string; newTab: boolean }>
}
```

Do not invent donation values. Copy verified values from Payload during migration; use `Not configured` only if the current source has no value.

## Exact API behaviour

### Pages API

Adapt the existing posts endpoints; do not create a second API framework.

- `GET /api/posts?type=page` returns all page records ordered by `sortOrder`.
- `GET /api/posts/:id` returns one record.
- `POST /api/posts` is authenticated and is used only to create events.
- `PATCH /api/posts/:id` is authenticated and updates a fixed page or event.
- `DELETE /api/posts/:id` is authenticated and rejects deletion unless `template === 'event'`.
- Parse `contentEn`, `contentLv`, and `settings` before returning them; the frontend receives objects, not JSON strings.
- Validate the object for the selected template before writing it.
- Return `400` with `{ "error": "plain explanation" }` for invalid content.
- Return `401` for missing/invalid authentication and `404` for missing records.
- Ignore client attempts to change `type` away from `page`.

Place shared validation functions in `_FlareCMS/functions/api/content-validation.ts`. Use straightforward manual TypeScript checks; do not add a validation package.

### Media API

Extend the existing assets endpoints:

- `GET /api/assets` lists `media` rows newest first and remains public so public page data can resolve media.
- `POST /api/assets` requires existing JWT authentication, accepts one file, validates it, uploads it to R2, and inserts its metadata row.
- `GET /api/assets/:id` continues streaming the R2 object.
- `PATCH /api/assets/:id` requires authentication and changes only `altEn` and `altLv`.
- `DELETE /api/assets/:id` requires authentication, removes both the R2 object and media row, and returns `204`.
- Allow JPEG, PNG, WebP, GIF, and SVG images only.
- Reject empty files and files larger than 10 MB.
- Use the existing UUID as both the R2 key and `media.id`.
- Fix the existing response header typo from `catch-control` to `cache-control`.

Do not add folders, tags, transforms, crops, videos, or bulk actions.

## Exact admin implementation

### Navigation

Modify `_FlareCMS/src/admin/Layout.tsx`:

- Remove Posts and Settings links.
- Add Pages → `/admin/pages`.
- Add Media → `/admin/media`.
- Keep View website → `/en`.
- Add Log out, which removes the existing `token` from `localStorage` and navigates to `/login`.
- Keep the existing authentication redirect. Do not redesign login.

### Pages list

Adapt `_FlareCMS/src/admin/Posts.tsx`:

- Fetch `/api/posts?type=page`.
- Show fixed records under **Website pages** in the order listed above.
- Show `navigation`, `footer`, and `site` under **Shared website content**.
- Show event records under **Events**, ordered by `eventDate`.
- Each row has only an Edit button.
- Events additionally have Delete with confirmation.
- Add Event appears only above the Events list and creates a `template = 'event'` record.
- Remove published/draft tabs, labels, publish/unpublish menus, relative timestamps, and floating generic Add button.

### Page editor

Adapt `_FlareCMS/src/admin/Editor.tsx`:

- Fetch the record by ID and choose a fixed form component from `record.template`.
- Create form components in `_FlareCMS/src/admin/forms/`:
  - `ContentPageForm.tsx`
  - `SimplePageForm.tsx`
  - `HomeForm.tsx`
  - `EventForm.tsx`
  - `NavigationForm.tsx`
  - `FooterForm.tsx`
  - `SiteForm.tsx`
  - `DonateForm.tsx`
- Each bilingual form has English and Latvian tabs.
- Keep shared settings below the language tabs.
- Use normal text inputs, multiline inputs, date input, select input, checkbox, and simple repeatable rows.
- Use the current Markdown body editor/preview for `body`; do not add a WYSIWYG package.
- Remove Labels and blog terminology.
- Use one Save button. Send `PATCH` with the existing bearer token.
- Disable Save while saving, show `Saved` after success, and show the API error after failure.
- If the API returns `401`, navigate to `/login`.
- Add View page using the record’s real English public URL.
- Do not add autosave, drafts, version history, field configuration, or drag-and-drop blocks.

### Media screen and picker

Create:

- `_FlareCMS/src/admin/Media.tsx`
- `_FlareCMS/src/admin/MediaPicker.tsx`

`Media.tsx` must provide upload, thumbnail grid, English/Latvian alt text editing, and delete confirmation. `MediaPicker.tsx` must reuse the same list and return the selected media ID to the page form. Use a Material UI dialog; do not add a library.

## Exact public implementation

Create the following structure:

```text
_FlareCMS/src/site/
├── SiteLayout.tsx
├── HomePage.tsx
├── ContentPage.tsx
├── SimplePage.tsx
├── DonatePage.tsx
├── EventPage.tsx
├── NotFoundPage.tsx
├── LanguageSwitcher.tsx
├── api.ts
├── metadata.ts
└── site.css
```

- Use `_Payload/src/app/(frontend)/components/` and `_Payload/src/app/(frontend)/globals.css` as the visual source.
- Reproduce the markup, colours, typography, spacing, responsive layout, and component order in the new files.
- Do not import Payload or Next.js code directly. Convert it to ordinary React and React Router.
- Keep Material UI for admin. The public site should use semantic React markup and `site.css`; do not rebuild the public design as Material UI cards.
- `api.ts` contains the small fetch helpers for pages, events, and media.
- `SiteLayout.tsx` loads `navigation`, `footer`, and `site` records and renders header/footer around child routes.
- `HomePage.tsx` loads `home`, the four content-card pages, and all events.
- `ContentPage.tsx` renders `history`, `community`, `membership`, and `culture`.
- `SimplePage.tsx` renders `about`, `contact`, `privacy`, `terms`, and `eula`.
- `DonatePage.tsx` renders the verified donation content and retains current donation actions.
- `EventPage.tsx` renders one event by slug.
- Sanitize/render Markdown using the already-installed `react-markdown` and `remark-gfm` packages.
- Add `loading`, `empty`, `error`, and not-found states in plain language.
- Use `<img loading="lazy">` except for the visible homepage hero image.
- Set `document.title`, description, canonical URL, Open Graph fields, and robots metadata in `metadata.ts` whenever the route or language changes.

Do not implement static generation, ISR, an offline fallback, a cache service, or a new analytics system.

## Exact content migration

Create `_FlareCMS/scripts/migrate-payload-content.ts`.

The script must:

1. Read published Payload content only from the existing Payload REST API or an explicit JSON export.
2. Map Payload globals to the fixed `home`, `navigation`, `footer`, `site`, and `donate` records.
3. Map Payload Pages and SpecialPages to their matching fixed page slugs.
4. Map Payload Events to `template = 'event'` records.
5. Upload only referenced media to the FlareCMS R2 bucket and store media metadata.
6. Upsert records by `slug` so rerunning the script does not create duplicates.
7. Preserve both languages, ordering, URLs, dates, accent colours, SEO fields, and alt text.
8. Never migrate Payload users, sessions, drafts, versions, internal IDs, migrations, or admin settings.
9. Never invent credentials, bank details, payment destinations, or contact information.
10. Default to the local/evaluation FlareCMS database. Require an explicit `--remote` flag before writing remote evaluation data.

Document the command and required environment variables in `_FlareCMS/README.md`. Do not commit secrets or exported production data.

## Ordered task checklist

### Phase 1 — Preserve and extend FlareCMS

- [ ] Run `npm install` and `npm run build` in `_FlareCMS/`; record any existing failure before changing code.
- [ ] Add migration `0002_site_content.sql` exactly as specified.
- [ ] Update the Drizzle schema exactly as specified.
- [ ] Add content types and server validation.
- [ ] Adapt the existing posts API to the specified page behaviour.
- [ ] Extend the existing assets API and add the media metadata operations.
- [ ] Run the local migration and confirm page/media CRUD using HTTP requests.

### Phase 2 — Minimal admin

- [ ] Simplify admin navigation.
- [ ] Adapt the existing page list.
- [ ] Adapt the existing editor and add the eight fixed form components.
- [ ] Add the Media screen and Media picker.
- [ ] Confirm login, edit, save, reload, upload, select, alt-text edit, delete, logout, and unauthorized behaviour.

### Phase 3 — Public website

- [ ] Add the exact route map.
- [ ] Build `SiteLayout` and the shared public components.
- [ ] Build the homepage.
- [ ] Build content and simple page templates.
- [ ] Build event detail and donation pages.
- [ ] Add route metadata and not-found behaviour.
- [ ] Compare every route in English and Latvian at mobile and desktop sizes.

### Phase 4 — Evaluation data and deployment

- [ ] Build and test the idempotent content migration script locally.
- [ ] Populate the separate FlareCMS evaluation D1/R2 resources.
- [ ] Set the FlareCMS secret with Wrangler; do not commit it.
- [ ] Replace the placeholder D1 ID only in `_FlareCMS/wrangler.jsonc`.
- [ ] Run `npm run deploy` from `_FlareCMS/`.
- [ ] Smoke-test public pages and admin on the evaluation hostname.
- [ ] Give the customer the public and admin evaluation URLs.
- [ ] Keep Payload production unchanged pending explicit customer approval.

## Verification checklist

Run `npm run build` after every implementation group. Before declaring the evaluation complete, verify all of the following manually:

- `/` redirects to `/en`.
- Every English route has a Latvian equivalent and the language switch preserves the page/event.
- Unknown routes show Not Found.
- Homepage, content pages, legal pages, contact, donate, and event pages match production content and layout.
- Header, footer, mobile navigation, internal links, external links, images, forms, and donation actions work.
- Page edits survive save and browser reload.
- Media upload, list, alt-text edit, selection, rendering, and deletion work.
- All modifying API calls return `401` without a valid existing FlareCMS token.
- Public reads work while logged out.
- Admin navigation shows only Pages, Media, View website, and Log out.
- No Payload branding, blog UI, labels, replies, draft tabs, plugin UI, or role management appears.
- Page titles, descriptions, canonical links, social metadata, image alt text, headings, focus states, and keyboard navigation are correct.
- The evaluation uses only `latviansof-flare` resources and has not changed production Payload data or deployment.

## Definition of done

- A non-technical editor can log in, select a page, edit either language, select/upload an image, save, and view the result.
- Events can be added, edited, and removed within Pages without introducing another admin section.
- The public FlareCMS evaluation site reproduces the current production website in both languages.
- Existing FlareCMS authentication and infrastructure remain in use.
- The code contains no general page builder, Payload compatibility layer, draft/version system, role system, plugin system, or unused blog UI.
- The customer can evaluate FlareCMS without any change to the production Payload site.

## Scope rule

If a feature is not required to reproduce the current public website, edit the specified records, manage images, or operate the existing FlareCMS login/deployment, do not build it.

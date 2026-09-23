# Latvians of Darwin — Production Website

Production website for the Latvian Association of Darwin, powered by [SonicJS](https://sonicjs.com) headless CMS on Cloudflare Workers. Deploys independently as the `latviansof-sonicjs` Worker with its own D1 database, R2 media bucket, and KV namespace.

## Admin Panel & Content Management

The public website and SonicJS admin panel are deployed to the same Worker at `https://latviansofdarwin.org.au`. The admin interface (`/admin`) is protected and managed by the SonicJS CMS team.

### Deployment Access

`.env.local` is a symlink to `_Payload/.env.local` (repo root) and holds the Cloudflare API token wrangler uses for deployment and remote database operations — see the "Wrangler Access" section in the repository root `AGENTS.md`.

## Content & Architecture

The Worker serves the bilingual (EN/LV) public site edge-rendered with Hono plus the stock SonicJS admin (`/admin`), media management (`/admin/media`), auth (`/auth/login`) and REST API (`/api/content/*`).

### Content Collections

Code-first collections in `src/collections/`:

- **pages** — fixed + news pages (home, about, history, community, membership, culture, contact, donate, privacy, terms, eula) + current news. Template field selects public rendering.
- **events** — community events
- **navigation, footer, site-settings** — header menu, footer, and global settings (bilingual donation/bank details)

Only documents with `status = 'published'` appear on the public site.

### Seeding from Payload

Sync published content from the deprecated Payload CMS (if needed):

```bash
# Local database (uses wrangler dev state)
npx tsx scripts/migrate-from-payload.ts

# Remote evaluation D1 (requires .env.local token)
npx tsx scripts/migrate-from-payload.ts --remote
```

The script mirrors images to the `latviansof-sonicjs-media` R2 bucket and idempotently upserts content (safe to re-run).

Create/update the admin user:

```bash
npx tsx scripts/seed-admin.ts            # local (uses .dev.vars)
npx tsx scripts/seed-admin.ts --remote   # remote evaluation
```

### Public site cache (KV)

Public visitor traffic reads from a published KV snapshot instead of D1. The
snapshot is built from the same content helpers as the D1 path and rendered by
the same renderer (`src/site/render-route-snapshot.ts`), so KV and D1 responses
are byte-identical.

- Source: `src/site/publish/` (types, builder, writer, reader), keys in `kv-keys.ts`.
- Rebuilt automatically after every content create/update/delete/publish —
  `src/plugins/public-site-cache.ts` subscribes to the core content hooks.
- Manual rebuild: `POST /admin/api/publish-public-site` (admin/editor only).
- Pages answer `X-Public-Source: kv` from the snapshot, and
  `X-Public-Source: d1-fallback` when the snapshot has no entry for that path.
- `robots.txt` and `sitemap.xml` are served from KV, with D1/static fallbacks.
- `PUBLIC_SITE_ORIGIN` (wrangler `vars`) is the canonical origin baked into
  robots and sitemap URLs; publishing fails loudly if neither it nor a request
  origin is available.

Published keys are current-only: each publish overwrites every route key and
deletes route keys that are no longer published, so unpublished content cannot
keep being served from the edge cache.

### Deploy to Cloudflare

```bash
npm run db:migrate        # Apply D1 migrations
npm run deploy:worker     # Deploy the Worker
```

Uses dedicated resources: D1 (`latviansof-sonicjs`), R2 bucket (`latviansof-sonicjs-media`), and KV namespace (`latviansof-sonicjs-kv`). Production Payload data is never modified.

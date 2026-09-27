# Latvians of Darwin — Production Website

Production website for the Latvian Association of Darwin, powered by the
**custom Darwin fork of [SonicJS](https://sonicjs.com)** on Cloudflare Workers.
This application deploys independently as the `latviansof-sonicjs` Worker with
its own D1 database, R2 media bucket, and KV namespace.

> **Production source of truth:** this application and the custom fork at
> `../darwin-sonicjs/` power the live website and `/admin`.

## Admin panel & content management

The public website and SonicJS admin panel are deployed to the same Worker at `https://latviansofdarwin.org.au`. The admin interface (`/admin`) is protected and managed by the SonicJS CMS team.

### Deployment access

`.env.local` lives in this app directory and holds the Cloudflare API token that `wrangler` uses for deployment and remote database operations.

## Content & architecture

The Worker serves the bilingual (EN/LV) public site edge-rendered with Hono plus the stock SonicJS admin (`/admin`), media management (`/admin/media`), auth (`/auth/login`), and REST API (`/api/content/*`).

### Content collections

Code-first collections in `src/collections/`:

- **pages** — fixed + news pages (home, about, history, community, membership, culture, contact, donate, privacy, terms, eula) + current news. Template field selects public rendering.
- **events** — community events
- **navigation, footer, site-settings** — header menu, footer, and global settings (bilingual donation/bank details)

Only documents with `status = 'published'` appear on the public site.

### Public site cache (KV)

Public visitor traffic reads from a published KV snapshot instead of D1. The snapshot is built from the same content helpers as the D1 path and rendered by the same renderer (`src/site/render-route-snapshot.ts`), so KV and D1 responses are byte-identical.

- Source: `src/site/publish/` (types, builder, writer, reader), keys in `kv-keys.ts`
- Rebuilt automatically after content create/update/delete/publish via the core content hooks
- Manual rebuild: `POST /admin/api/publish-public-site` (admin/editor only)
- Pages answer `X-Public-Source: kv` from the snapshot, and `X-Public-Source: d1-fallback` when the snapshot has no entry for that path
- `robots.txt` and `sitemap.xml` are served from KV, with D1/static fallbacks
- `PUBLIC_SITE_ORIGIN` (wrangler `vars`) is the canonical origin baked into robots and sitemap URLs

### Deploy to Cloudflare

```bash
npm run db:migrate        # Apply D1 migrations
npm run deploy:worker     # Deploy the Worker
```

Uses dedicated resources: D1 (`latviansof-sonicjs`), R2 bucket (`latviansof-sonicjs-media`), and KV namespace (`latviansof-sonicjs-kv`).

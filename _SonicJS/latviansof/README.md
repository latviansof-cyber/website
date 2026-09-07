# Latvians of Darwin — SonicJS experiment

A modern headless CMS built with [SonicJS](https://sonicjs.com) on Cloudflare's edge platform. It deploys independently as the `latviansof-sonicjs` Worker.

## Getting Started

### Prerequisites

- Node.js 18 or higher
- A Cloudflare account (free tier works great)
- Wrangler CLI (installed with dependencies)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create your D1 database:**
   ```bash
   npx wrangler d1 create latviansof-sonicjs
   ```

   Copy the `database_id` from the output and replace the D1 placeholder in `wrangler.jsonc`.

3. **Create your R2 bucket:**
   ```bash
   npx wrangler r2 bucket create latviansof-sonicjs-media
   ```

4. **Create your KV namespace:**
   ```bash
   npx wrangler kv namespace create CACHE_KV
   ```

   Copy the `id` from the output into the `CACHE_KV` binding in `wrangler.jsonc`.
   This binding is **required for good TTFB** — without it every cold Worker
   isolate re-runs the full database bootstrap (~10s+ first byte); with it, only
   the first isolate per deploy pays that cost.

5. **Run migrations:**
   ```bash
   npm run db:migrate:local
   ```

6. **Start the development server:**
   ```bash
   npm run dev
   ```

7. **Open your browser:**
   Navigate to `http://localhost:8787/admin` to access the admin interface.

   Use the admin credentials you provided during project setup.

## Project Structure

```
my-sonicjs-app/
├── src/
│   ├── collections/          # Your content type definitions
│   │   └── blog-posts.collection.ts
│   └── index.ts             # Application entry point
├── wrangler.jsonc           # Cloudflare Workers configuration
├── package.json
└── tsconfig.json
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run deploy` - Deploy to Cloudflare
- `npm run db:migrate` - Run migrations on production database
- `npm run db:migrate:local` - Run migrations locally
- `npm run type-check` - Check TypeScript types
- `npm run test` - Run tests

## Creating Collections

Collections define your content types. Create a new file in `src/collections/`:

```typescript
// src/collections/products.collection.ts
import type { CollectionConfig } from '@sonicjs-cms/core'

export default {
  name: 'products',
  label: 'Products',
  fields: {
    name: { type: 'text', required: true },
    price: { type: 'number', required: true },
    description: { type: 'quill' }
  }
} satisfies CollectionConfig
```

## API Access

Your collections are automatically available via REST API:

- `GET /api/content/blog-posts` - List all blog posts
- `GET /api/content/blog-posts/:id` - Get a single post
- `POST /api/content/blog-posts` - Create a post (requires auth)
- `PUT /api/content/blog-posts/:id` - Update a post (requires auth)
- `DELETE /api/content/blog-posts/:id` - Delete a post (requires auth)

## Deployment

1. **Login to Cloudflare:**
   ```bash
   npx wrangler login
   ```

2. **Deploy your application:**
   ```bash
   npm run deploy
   ```

3. **Run migrations on production:**
   ```bash
   npm run db:migrate
   ```

## Documentation

- [SonicJS Documentation](https://sonicjs.com)
- [Collection Configuration](https://sonicjs.com/collections)
- [Plugin Development](https://sonicjs.com/plugins)
- [API Reference](https://sonicjs.com/api)

## Support

- [GitHub Issues](https://github.com/lane711/sonicjs/issues)
- [Discord Community](https://discord.gg/8bMy6bv3sZ)
- [Documentation](https://sonicjs.com)

## License

MIT

## This evaluation project (Latvians of Darwin)

The Worker serves the bilingual (EN/LV) public site edge-rendered with Hono
(`src/site/`) plus the stock SonicJS admin (`/admin`), Media (`/admin/media`),
auth (`/auth/login`) and REST API (`/api/content/*`).

### Content model

Code-first collections in `src/collections/`:

- `pages` — fixed + news pages (`home`, `about`, `history`, `community`,
  `membership`, `culture`, `contact`, `donate`, `privacy`, `terms`, `eula`,
  and current news pages). Template field selects the public rendering.
- `events` — community events.
- `navigation`, `footer`, `site-settings` — header menu, footer and global
  settings (incl. bilingual donation/bank details).

Public templates read only `status = 'published'` documents.

### Seeding content from Payload

Production content is copied with:

```bash
# Local evaluation DB + R2 (wrangler dev state)
npx tsx scripts/migrate-from-payload.ts

# Remote evaluation D1 + R2 (requires Cloudflare auth token in .env.local)
npx tsx scripts/migrate-from-payload.ts --remote
```

The script fetches published pages/events/globals from the Payload REST API,
mirrors referenced and static images into the `latviansof-sonicjs-media` R2
bucket (`uploads/<key>.<ext>`, served at `/files/...`), registers `media_asset`
documents, and upserts content documents idempotently (safe to re-run).

Create or update the admin user with:

```bash
npx tsx scripts/seed-admin.ts            # local (uses .dev.vars admin_email/admin_pass)
npx tsx scripts/seed-admin.ts --remote   # remote evaluation
```

### Deploying the evaluation site

```bash
npm run db:migrate        # remote D1 migrations
npm run deploy:worker     # deploy the Worker
```

The evaluation site is isolated to its own D1 (`latviansof-sonicjs`), R2 bucket
(`latviansof-sonicjs-media`) and KV namespace (`latviansof-sonicjs-kv`).
Production Payload data is never modified.

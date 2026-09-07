# Agents

This project uses the Payload CMS skill at `.agents/skills/payload/`.
Start with `.agents/skills/payload/SKILL.md` for a quick reference, then see `.agents/skills/payload/reference/` for detailed docs.

## Quick Development Tools

### Using Surf for LLM Context
Run `surf --llm-context` to learn how to use the tool for opening and comparing different front-end implementations:
- **Sonic**: SonicJS experiment (deployed to CF)
- **Flare**: FlareCMS implementation (deployed to CF)
- **Production**: https://latviansofdarwin.org.au/ (current live site with deployed versions)

### Wrangler Access
`wrangler` authenticates using the token stored in `.env.local`. Ensure this file is configured before running deployment or remote D1 commands.

## Payload + Cloudflare D1 migration runbook

This project runs Payload 3 on Cloudflare Workers with
`@payloadcms/db-d1-sqlite`. Production data is the remote D1 database bound as
`D1` in `wrangler.jsonc`. Treat schema registration, D1 migrations, Payload
version rows, and the deployed Worker as separate state that must stay aligned.

### Required workflow after a Payload schema change

1. Check `src/payload.config.ts` and ensure every collection/global is
   registered. Never give a global the same slug as a collection; both map to a
   D1 table. For example, a global with slug `pages` conflicts with the `pages`
   collection.
2. Generate a migration:

   ```bash
   pnpm payload migrate:create --name descriptive_name
   ```

3. Review both generated files in `src/migrations/` and confirm the migration
   is registered in `src/migrations/index.ts`. Do not accept an unexpected
   rename from Payload's interactive generator. Stop and fix slug/schema
   collisions first.
4. If required fields are added to a global, insert one valid initial global
   row in the migration. Do not seed invented credentials, bank details,
   payment destinations, or other sensitive values. Use explicit
   `Not configured` placeholders until verified values are supplied.
5. Regenerate types:

   ```bash
   pnpm run generate:types:payload
   ```

6. Deploy the database and then the Worker:

   ```bash
   pnpm run deploy:database
   pnpm run deploy:app
   ```

   Use `pnpm deploy` when both steps should run together. A database-only
   deployment does not update the admin schema/navigation. An app-only
   deployment does not create D1 tables or columns.

### Diagnosing production admin problems

Use read-only remote D1 queries before changing data:

```bash
pnpm exec wrangler d1 execute D1 --remote --json --command \
  "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;"

pnpm exec wrangler d1 execute D1 --remote --json --command \
  "SELECT name, batch, created_at FROM payload_migrations ORDER BY id DESC;"
```

Common signatures:

- Global appears in the sidebar but opens **Not Found** or its API returns 500:
  confirm its D1 table exists and its migration ran. Also confirm the latest
  Worker containing the registered global was deployed.
- Collection table contains rows but admin shows **No Results**: if the
  collection has `versions.drafts`, inspect its version table (for example,
  `_pages_v`, `_events_v`, or `_special_pages_v`). Payload admin draft queries
  require a latest version row.
- A deleted collection document still appears with `id: null`: remove orphaned
  version rows whose `parent_id IS NULL`. D1 uses `ON DELETE SET NULL` for these
  version relationships.
- API and direct SQL disagree: direct SQL reads the base table, while Payload
  draft/admin queries may read latest version state.
- A screenshot taken during deployment may show the old Worker. Verify current
  production using the REST API and use absolute timestamps when explaining
  deployment timing.

### Backfilling versioned collections

When seed/migration SQL inserts directly into a collection with drafts enabled,
also create version data. The backfill must:

- insert one `_collection_v` row per base document only when no
  `latest = true` row exists;
- copy status, timestamps, localized fields, relationships, SEO fields, and
  other document fields;
- set `latest = true` and `autosave = false`;
- copy versioned block rows and nested array rows when the collection has
  blocks/arrays;
- remove orphaned version documents with `parent_id IS NULL` when their base
  documents were intentionally deleted;
- be idempotent with `NOT EXISTS`, so rerunning cannot create duplicate latest
  versions.

Use the existing repair migrations as project examples:

- `src/migrations/20260610_112000_backfill_event_versions.ts`
- `src/migrations/20260611_194132_backfill_special_page_versions.ts`
- `src/migrations/20260611_201944_repair_page_versions.ts`

### Verification after deployment

Verify all three layers:

1. D1 schema/data and `payload_migrations`.
2. Payload REST API, including `draft=true` for versioned collections:

   ```bash
   curl -fsS \
     'https://latviansofdarwin.org.au/api/pages?depth=1&limit=20&draft=true'

   curl -fsS \
     'https://latviansofdarwin.org.au/api/globals/site-settings'
   ```

3. The relevant production admin route after `pnpm run deploy:app`.

Do not declare an admin issue fixed from SQL row counts alone.

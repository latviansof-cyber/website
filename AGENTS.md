# Agents

## Production CMS: read this first

The production website and admin panel use the custom Darwin fork of SonicJS. The live app is in `_SonicJS/latviansofdarwin.com.au/`, and the forked CMS source lives in `_SonicJS/darwin-sonicjs/`.

- Production site: https://latviansofdarwin.org.au/
- Admin: https://latviansofdarwin.org.au/admin
- Application: `_SonicJS/latviansofdarwin.com.au/`
- Custom SonicJS fork: `_SonicJS/darwin-sonicjs/`

## Quick development tools

### Using Surf for LLM context

Run `surf --llm-context` to inspect the deployed app and compare production behavior when needed.

### Wrangler access

`wrangler` authenticates using the token stored in `.env.local` in the app directory. Ensure this file is configured before running deployment or remote D1 commands.

```bash
cd _SonicJS/latviansofdarwin.com.au
npx wrangler whoami
```

If you run `wrangler` from another directory, export the file first:

```bash
set -a; source _SonicJS/latviansofdarwin.com.au/.env.local; set +a
```

Keep the token private and do not print it in logs or issues.

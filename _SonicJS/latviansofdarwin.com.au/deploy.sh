#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

if [[ -f .env.local ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env.local
  set +a
fi

if grep -q 'REPLACE_WITH_' wrangler.jsonc; then
  echo "Cloudflare resource IDs are not configured in wrangler.jsonc." >&2
  echo "Create latviansof-sonicjs (D1), latviansof-sonicjs-media (R2), and a KV namespace, then replace the placeholders." >&2
  exit 1
fi

npx wrangler d1 migrations apply DB --remote -c wrangler.jsonc
npx wrangler deploy --minify -c wrangler.jsonc

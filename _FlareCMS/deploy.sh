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
  echo "Create latviansof-flare (D1) and latviansof-flare-media (R2), then replace the placeholder." >&2
  exit 1
fi

npm run build
npx wrangler@4.128.0 d1 migrations apply DB --remote -c wrangler.jsonc
npx wrangler@4.128.0 pages deploy dist --project-name latviansof-flare --commit-dirty=true

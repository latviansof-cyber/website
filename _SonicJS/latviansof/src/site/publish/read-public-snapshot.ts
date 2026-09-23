/**
 * Read side of the published public site: one KV read per public request.
 */

import type { KVNamespace } from '@cloudflare/workers-types'
import { ROBOTS_TXT_KEY, SITEMAP_XML_KEY, pageKey } from './kv-keys'
import type { PublicRouteSnapshot } from './types'

/**
 * Canonical form of a request path for KV lookups: `/en/` and `/en` are the same
 * route, so a trailing slash must not miss the cache.
 */
export function normalizePublicPath(path: string): string {
  const withoutQuery = path.split('?')[0]
  if (withoutQuery.length > 1 && withoutQuery.endsWith('/')) {
    return withoutQuery.slice(0, -1)
  }
  return withoutQuery
}

export async function getPublicRouteFromKv(
  kv: KVNamespace,
  path: string,
): Promise<PublicRouteSnapshot | null> {
  const raw = await kv.get(pageKey(normalizePublicPath(path)))
  if (!raw) return null

  return JSON.parse(raw) as PublicRouteSnapshot
}

export async function getRobotsFromKv(kv: KVNamespace): Promise<string | null> {
  return kv.get(ROBOTS_TXT_KEY)
}

export async function getSitemapXmlFromKv(kv: KVNamespace): Promise<string | null> {
  return kv.get(SITEMAP_XML_KEY)
}

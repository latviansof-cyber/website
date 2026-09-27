/**
 * Publishes a snapshot to the `CACHE_KV` namespace.
 *
 * Keys are current-only: every publish overwrites the previous value and deletes
 * page keys for routes that no longer exist, so unpublished or deleted content
 * cannot keep being served from the edge cache.
 */

import type { KVNamespace, KVNamespaceListOptions } from '@cloudflare/workers-types'
import { buildRobotsTxt } from '../robots'
import { buildSitemapXml } from '../sitemap'
import { GENERATED_AT_KEY, PAGE_KEY_PREFIX, ROBOTS_TXT_KEY, SITEMAP_JSON_KEY, SITEMAP_XML_KEY, pageKey } from './kv-keys'
import type { PublicSiteSnapshot } from './types'

/**
 * Delete page keys left behind by routes that are no longer published.
 * Idempotent: a key that reappears in the next snapshot is simply rewritten.
 */
async function deleteStalePageKeys(kv: KVNamespace, livePaths: string[]): Promise<number> {
  const live = new Set(livePaths.map((path) => pageKey(path)))
  const stale: string[] = []

  let cursor: string | null = null
  do {
    const options: KVNamespaceListOptions = { prefix: PAGE_KEY_PREFIX }
    if (cursor) options.cursor = cursor

    const listed = await kv.list(options)
    for (const key of listed.keys) {
      if (!live.has(key.name)) stale.push(key.name)
    }
    cursor = listed.list_complete ? null : listed.cursor
  } while (cursor)

  await Promise.all(stale.map((key) => kv.delete(key)))
  return stale.length
}

/**
 * Write the snapshot and its derived SEO artifacts.
 *
 * Ordering matters for readers: route entries land first, stale route keys are
 * removed next, and metadata keys land last. A half-finished publish should not
 * advertise a snapshot while routes that are no longer public remain readable.
 */
export async function writePublicSnapshotToKv(
  kv: KVNamespace,
  origin: string,
  snapshot: PublicSiteSnapshot,
): Promise<{ deletedKeys: number }> {
  await Promise.all(
    Object.entries(snapshot.routes).map(([path, route]) =>
      kv.put(pageKey(path), JSON.stringify(route)),
    ),
  )

  const deletedKeys = await deleteStalePageKeys(kv, Object.keys(snapshot.routes))

  await Promise.all([
    kv.put(ROBOTS_TXT_KEY, buildRobotsTxt(origin)),
    kv.put(SITEMAP_XML_KEY, buildSitemapXml(origin, snapshot.paths)),
    kv.put(SITEMAP_JSON_KEY, JSON.stringify(snapshot.paths)),
    kv.put(GENERATED_AT_KEY, snapshot.generatedAt),
  ])

  return { deletedKeys }
}

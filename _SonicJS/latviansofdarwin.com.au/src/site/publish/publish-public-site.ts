/**
 * Publish entry point used by both the admin endpoint and the content-save
 * rebuild plugin: read D1 once, build the snapshot, write KV.
 */

import type { D1Database, KVNamespace } from '@cloudflare/workers-types'
import { buildPublicSnapshot, loadPublicContent } from './build-public-snapshot'
import { writePublicSnapshotToKv } from './write-public-snapshot'
import type { PublicSiteSnapshot } from './types'

export interface PublicSiteEnv {
  DB: D1Database
  CACHE_KV: KVNamespace
  /** Canonical public origin (e.g. `https://latviansofdarwin.org.au`). */
  PUBLIC_SITE_ORIGIN?: string | undefined
}

/**
 * Rebuild and store the public snapshot.
 *
 * `fallbackOrigin` is the origin of the request that triggered the rebuild; it is
 * only used when `PUBLIC_SITE_ORIGIN` is not configured. Without either, sitemap
 * and robots URLs would be wrong, so publishing fails loudly instead.
 */
export async function publishPublicSite(opts: {
  env: PublicSiteEnv
  fallbackOrigin?: string | undefined
}): Promise<{ snapshot: PublicSiteSnapshot; deletedKeys: number }> {
  const origin = opts.env.PUBLIC_SITE_ORIGIN || opts.fallbackOrigin
  if (!origin) {
    throw new Error('publishPublicSite: set PUBLIC_SITE_ORIGIN on the Worker (or publish over HTTP)')
  }

  const content = await loadPublicContent(opts.env.DB)
  const snapshot = buildPublicSnapshot(content, new Date().toISOString())
  const { deletedKeys } = await writePublicSnapshotToKv(opts.env.CACHE_KV, origin, snapshot)

  return { snapshot, deletedKeys }
}

/**
 * Rebuilds the public KV snapshot whenever content is saved.
 *
 * Subscribes to the core content lifecycle events so a page/event edit in the
 * admin is visible on the public site without anyone pressing a publish button.
 * The manual `/admin/api/publish-public-site` endpoint stays as an escape hatch
 * (and for the first publish, before any content has changed).
 *
 * Dispatch is fire-and-forget (`waitUntil`), so the admin save response is not
 * blocked by the rebuild.
 */

import { definePlugin } from '@sonicjs-cms/core'
import { publishPublicSite } from '../site/publish/publish-public-site'
import type { PublicSiteEnv } from '../site/publish/publish-public-site'

/** Every content mutation that can change the public site. */
const CONTENT_EVENTS = [
  'content:after:create',
  'content:after:update',
  'content:after:delete',
  'content:after:publish',
] as const

export const publicSiteCachePlugin = definePlugin({
  id: 'public-site-cache',
  name: 'Public Site Cache',
  version: '1.0.0',
  description: 'Rebuilds the public KV snapshot after every content save.',
  capabilities: ['hooks.content:subscribe'],
  onBoot(ctx) {
    const env = ctx.env as PublicSiteEnv | undefined
    if (!env?.DB || !env?.CACHE_KV) {
      console.error('[public-site-cache] DB/CACHE_KV bindings missing; snapshot rebuild disabled')
      return
    }

    const rebuild = async () => {
      try {
        const { snapshot, deletedKeys } = await publishPublicSite({ env })
        console.log(
          `[public-site-cache] published ${snapshot.paths.length} paths, removed ${deletedKeys} stale keys`,
        )
      } catch (error) {
        console.error('[public-site-cache] rebuild failed:', error)
      }
    }

    for (const event of CONTENT_EVENTS) ctx.hooks.on(event, rebuild)
  },
})

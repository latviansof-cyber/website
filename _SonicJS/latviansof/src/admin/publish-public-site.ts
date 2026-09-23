/**
 * Admin endpoint that rebuilds the public KV snapshot on demand.
 *
 * Mounted at `/admin/api`, so the fork's `requireAuth` / `requireRole` guards
 * apply: editors and admins may publish, nobody else.
 */

import { Hono } from 'hono'
import type { MiddlewareHandler } from 'hono'
import { requireAuth, requireRole } from '@sonicjs-cms/core'
import type { Variables } from '@sonicjs-cms/core'
import { publishPublicSite } from '../site/publish/publish-public-site'
import type { PublicSiteEnv } from '../site/publish/publish-public-site'

type Env = { Bindings: PublicSiteEnv; Variables: Variables }

export const publishPublicSiteRoutes = new Hono<Env>()

// Guard with the core's own auth/RBAC middleware. It is typed against the core
// package's bundled Hono copy, which is structurally identical to ours but a
// distinct nominal type, so the copy boundary is bridged once, here.
const requireAuthMiddleware = requireAuth() as unknown as MiddlewareHandler
const requireEditorRole = requireRole(['admin', 'editor']) as unknown as MiddlewareHandler

publishPublicSiteRoutes.use('/publish-public-site', requireAuthMiddleware, requireEditorRole)

publishPublicSiteRoutes.post('/publish-public-site', async (c) => {
  try {
    const { snapshot, deletedKeys } = await publishPublicSite({
      env: c.env,
      fallbackOrigin: new URL(c.req.url).origin,
    })

    return c.json({
      success: true,
      generatedAt: snapshot.generatedAt,
      paths: snapshot.paths.length,
      deletedKeys,
    })
  } catch (error) {
    console.error('[public-site-cache] publish failed:', error)
    return c.json(
      { success: false, error: error instanceof Error ? error.message : 'Publish failed' },
      500,
    )
  }
})

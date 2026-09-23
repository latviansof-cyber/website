/**
 * Public Hono Router for SonicJS
 * Serves edge-rendered bilingual HTML pages.
 *
 * Every public page is served from the KV snapshot published by
 * `publishPublicSite`. Until a snapshot exists (or for a path it does not
 * contain) the router falls back to reading D1 directly and marks the response
 * with `X-Public-Source: d1-fallback`.
 */

import { Hono } from 'hono'
import type { Context } from 'hono'
import type { D1Database, KVNamespace } from '@cloudflare/workers-types'
import { renderLayout } from './layout'
import { renderNotFoundPage } from './pages/not-found'
import { renderRouteSnapshot } from './render-route-snapshot'
import { buildRobotsTxt } from './robots'
import { buildPublicPaths, buildSitemapXml } from './sitemap'
import { buildDocumentRoute, buildHomeRoute } from './publish/build-public-snapshot'
import {
  getPublicRouteFromKv,
  getRobotsFromKv,
  getSitemapXmlFromKv,
} from './publish/read-public-snapshot'
import {
  getAllPublishedEvents,
  getAllPublishedPages,
  getAllPublishedTrustedPartners,
  getFooterSections,
  getNavigationItems,
  getPublishedEventBySlug,
  getPublishedPageBySlug,
  getSiteSettings,
} from './utils/content'
import type { PublicSharedSnapshot } from './publish/types'

type Bindings = {
  DB: D1Database
  CACHE_KV: KVNamespace
}

export const siteRouter = new Hono<{ Bindings: Bindings }>()

type SiteContext = Context<{ Bindings: Bindings }>

const HTML_CACHE_CONTROL = 'public, max-age=60, s-maxage=600'
const SEO_CACHE_CONTROL = 'public, max-age=3600'

// Keep one canonical URL per page. Hono's router does not match the routes
// below when a trailing slash is present, so normalize before route dispatch.
siteRouter.use('*', async (c, next) => {
  const url = new URL(c.req.url)
  if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
    url.pathname = url.pathname.replace(/\/+$/, '')
    return c.redirect(`${url.pathname}${url.search}`, 308)
  }
  return next()
})

function parseLang(param: string): 'en' | 'lv' | null {
  if (param === 'en' || param === 'lv') return param
  return null
}

async function loadShared(db: D1Database): Promise<PublicSharedSnapshot> {
  const [navItems, footerSections, settings] = await Promise.all([
    getNavigationItems(db),
    getFooterSections(db),
    getSiteSettings(db),
  ])
  return { navItems, footerSections, settings, trustedPartners: [] }
}

async function render404(
  c: SiteContext,
  lang: 'en' | 'lv',
  shared: PublicSharedSnapshot,
  currentPath: string,
) {
  const layout = renderLayout({
    lang,
    currentPath,
    origin: new URL(c.req.url).origin,
    navItems: shared.navItems,
    footerSections: shared.footerSections,
    settings: shared.settings,
    content: renderNotFoundPage(lang),
  })
  return c.html(layout, 404)
}

/** Serve a public page from the KV snapshot, or null when it is not cached. */
async function respondFromSnapshot(c: SiteContext): Promise<Response | null> {
  const route = await getPublicRouteFromKv(c.env.CACHE_KV, c.req.path)
  if (!route) return null

  const rendered = renderRouteSnapshot({ route, origin: new URL(c.req.url).origin })
  c.header('Cache-Control', HTML_CACHE_CONTROL)
  c.header('X-Public-Source', 'kv')
  return c.html(rendered.html, rendered.status)
}

// SEO routes. Registered before /:lang so `robots.txt` and `sitemap.xml` are not
// mistaken for a language segment.
siteRouter.get('/robots.txt', async (c) => {
  const cached = await getRobotsFromKv(c.env.CACHE_KV)
  c.header('Cache-Control', SEO_CACHE_CONTROL)
  c.header('X-Public-Source', cached ? 'kv' : 'fallback')

  return c.text(cached ?? buildRobotsTxt(new URL(c.req.url).origin), 200, {
    'Content-Type': 'text/plain; charset=utf-8',
  })
})

siteRouter.get('/sitemap.xml', async (c) => {
  const cached = await getSitemapXmlFromKv(c.env.CACHE_KV)

  let xml = cached
  if (!xml) {
    const [pages, events] = await Promise.all([
      getAllPublishedPages(c.env.DB),
      getAllPublishedEvents(c.env.DB),
    ])
    xml = buildSitemapXml(new URL(c.req.url).origin, buildPublicPaths(pages, events))
  }

  c.header('Cache-Control', SEO_CACHE_CONTROL)
  c.header('X-Public-Source', cached ? 'kv' : 'd1-fallback')

  return c.text(xml, 200, { 'Content-Type': 'application/xml; charset=utf-8' })
})

// Global redirects
siteRouter.get('/', (c) => c.redirect('/en', 302))
siteRouter.get('/donate', (c) => c.redirect('/en/donate', 302))
siteRouter.get('/events/:slug', (c) => c.redirect(`/en/events/${c.req.param('slug')}`, 302))

// Homepage: /:lang
siteRouter.get('/:lang', async (c) => {
  const cached = await respondFromSnapshot(c)
  if (cached) return cached
  c.header('X-Public-Source', 'd1-fallback')

  const lang = parseLang(c.req.param('lang'))
  if (!lang) {
    const shared = await loadShared(c.env.DB)
    return render404(c, 'en', shared, c.req.path)
  }

  const [pages, events, trustedPartners, shared] = await Promise.all([
    getAllPublishedPages(c.env.DB),
    getAllPublishedEvents(c.env.DB),
    getAllPublishedTrustedPartners(c.env.DB),
    loadShared(c.env.DB),
  ])

  const route = buildHomeRoute(lang, c.req.path, { ...shared, trustedPartners }, { pages, events })
  const rendered = renderRouteSnapshot({ route, origin: new URL(c.req.url).origin })
  return c.html(rendered.html, rendered.status)
})

// Donate Page: /:lang/donate
siteRouter.get('/:lang/donate', async (c) => {
  const cached = await respondFromSnapshot(c)
  if (cached) return cached
  c.header('X-Public-Source', 'd1-fallback')

  const lang = parseLang(c.req.param('lang'))
  if (!lang) {
    const shared = await loadShared(c.env.DB)
    return render404(c, 'en', shared, c.req.path)
  }

  const [page, shared] = await Promise.all([
    getPublishedPageBySlug(c.env.DB, 'donate'),
    loadShared(c.env.DB),
  ])

  const route = buildDocumentRoute({
    kind: 'donate',
    lang,
    path: c.req.path,
    shared,
    page: page ?? undefined,
  })
  if (!route) return render404(c, lang, shared, c.req.path)

  const rendered = renderRouteSnapshot({ route, origin: new URL(c.req.url).origin })
  return c.html(rendered.html, rendered.status)
})

// Event Detail: /:lang/events/:slug
siteRouter.get('/:lang/events/:slug', async (c) => {
  const cached = await respondFromSnapshot(c)
  if (cached) return cached
  c.header('X-Public-Source', 'd1-fallback')

  const lang = parseLang(c.req.param('lang'))
  if (!lang) {
    const shared = await loadShared(c.env.DB)
    return render404(c, 'en', shared, c.req.path)
  }

  const slug = c.req.param('slug')
  const [event, shared] = await Promise.all([
    getPublishedEventBySlug(c.env.DB, slug),
    loadShared(c.env.DB),
  ])

  const route = buildDocumentRoute({
    kind: 'event',
    lang,
    path: c.req.path,
    shared,
    event: event ?? undefined,
  })
  if (!route) return render404(c, lang, shared, c.req.path)

  const rendered = renderRouteSnapshot({ route, origin: new URL(c.req.url).origin })
  return c.html(rendered.html, rendered.status)
})

// Standard or Simple Page: /:lang/:slug
siteRouter.get('/:lang/:slug', async (c) => {
  const cached = await respondFromSnapshot(c)
  if (cached) return cached
  c.header('X-Public-Source', 'd1-fallback')

  const lang = parseLang(c.req.param('lang'))
  const slug = c.req.param('slug')

  if (!lang) {
    const shared = await loadShared(c.env.DB)
    return render404(c, 'en', shared, c.req.path)
  }

  const [page, shared] = await Promise.all([
    getPublishedPageBySlug(c.env.DB, slug),
    loadShared(c.env.DB),
  ])

  const route = buildDocumentRoute({
    kind: 'page',
    lang,
    path: c.req.path,
    shared,
    page: page ?? undefined,
  })
  if (!route) return render404(c, lang, shared, c.req.path)

  const rendered = renderRouteSnapshot({ route, origin: new URL(c.req.url).origin })
  return c.html(rendered.html, rendered.status)
})

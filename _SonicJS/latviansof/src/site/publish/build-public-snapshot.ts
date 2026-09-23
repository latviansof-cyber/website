/**
 * Builds the public site snapshot that is published to KV.
 *
 * One D1 read pass produces every public route. The public router uses the same
 * route builders as its D1 fallback, so cached and uncached responses always
 * render from identical shapes.
 */

import type { D1Database } from '@cloudflare/workers-types'
import { buildPublicPaths } from '../sitemap'
import {
  compareEventsByDate,
  getAllPublishedEvents,
  getAllPublishedPages,
  getAllPublishedTrustedPartners,
  getFooterSections,
  getNavigationItems,
  getSiteSettings,
  isEventUpcoming,
} from '../utils/content'
import type { EventData, PageData } from '../utils/content'
import type {
  PublicContent,
  PublicPageKind,
  PublicRouteSnapshot,
  PublicSharedSnapshot,
  PublicSiteSnapshot,
} from './types'

/** Read every published document the public site needs, in one parallel pass. */
export async function loadPublicContent(db: D1Database): Promise<PublicContent> {
  const [pages, events, trustedPartners, navItems, footerSections, settings] = await Promise.all([
    getAllPublishedPages(db),
    getAllPublishedEvents(db),
    getAllPublishedTrustedPartners(db),
    getNavigationItems(db),
    getFooterSections(db),
    getSiteSettings(db),
  ])

  return { pages, events, trustedPartners, navItems, footerSections, settings }
}

/**
 * Route for a document-backed page. Returns null when the route needs a
 * document that no longer exists (deleted or unpublished page/event).
 */
export function buildDocumentRoute(opts: {
  kind: Exclude<PublicPageKind, 'home'>
  lang: 'en' | 'lv'
  path: string
  shared: PublicSharedSnapshot
  page?: PageData | undefined
  event?: EventData | undefined
}): PublicRouteSnapshot | null {
  const { kind, lang, path, shared, page, event } = opts

  if (kind === 'page') {
    return page ? { path, lang, kind, slug: page.slug, page, shared } : null
  }
  if (kind === 'event') {
    return event ? { path, lang, kind, slug: event.slug, event, shared } : null
  }
  return { path, lang, kind, page, shared }
}

/** Homepage route inputs: content cards plus upcoming-then-past event ordering. */
export function buildHomeRoute(
  lang: 'en' | 'lv',
  path: string,
  shared: PublicSharedSnapshot,
  content: Pick<PublicContent, 'pages' | 'events'>,
): PublicRouteSnapshot {
  const upcoming = content.events.filter((e) => isEventUpcoming(e)).sort(compareEventsByDate)
  const past = content.events.filter((e) => !isEventUpcoming(e)).sort(compareEventsByDate)

  return {
    path,
    lang,
    kind: 'home',
    page: content.pages.find((p) => p.slug === 'home'),
    // Production homepage cards list every published content page (news + fixed).
    pages: content.pages.filter((p) => p.template === 'content'),
    events: [...upcoming, ...past],
    shared,
  }
}

/**
 * Dispatch a path produced by `buildPublicPaths` to its route builder.
 * Returns null when the path no longer maps to a published document.
 */
function buildRouteForPath(
  path: string,
  content: PublicContent,
  shared: PublicSharedSnapshot,
  pagesBySlug: Map<string, PageData>,
  eventsBySlug: Map<string, EventData>,
): PublicRouteSnapshot | null {
  const segments = path.split('/').filter((segment) => segment.length > 0)
  const lang = segments[0] === 'lv' ? 'lv' : 'en'

  if (segments.length === 1) {
    return buildHomeRoute(lang, path, shared, content)
  }

  if (segments.length === 2) {
    return buildDocumentRoute({
      kind: segments[1] === 'donate' ? 'donate' : 'page',
      lang,
      path,
      shared,
      page: pagesBySlug.get(segments[1]),
    })
  }

  if (segments.length === 3 && segments[1] === 'events') {
    return buildDocumentRoute({
      kind: 'event',
      lang,
      path,
      shared,
      event: eventsBySlug.get(segments[2]),
    })
  }

  return null
}

/** Build the full snapshot: shared content, one route per public path. */
export function buildPublicSnapshot(content: PublicContent, generatedAt: string): PublicSiteSnapshot {
  const { pages, events, trustedPartners, navItems, footerSections, settings } = content
  const shared: PublicSharedSnapshot = { navItems, footerSections, settings, trustedPartners }
  const pagesBySlug = new Map(pages.map((page) => [page.slug, page]))
  const eventsBySlug = new Map(events.map((event) => [event.slug, event]))

  const routes: Record<string, PublicRouteSnapshot> = {}
  for (const path of buildPublicPaths(pages, events)) {
    const route = buildRouteForPath(path, content, shared, pagesBySlug, eventsBySlug)
    if (route) routes[path] = route
  }

  return { generatedAt, paths: Object.keys(routes).sort(), routes }
}

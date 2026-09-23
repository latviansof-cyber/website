/**
 * Renders a published (or freshly read) route snapshot to HTML.
 *
 * This is the only rendering path for public pages: the KV reader and the D1
 * fallback both hand a `PublicRouteSnapshot` to this module, so cached and
 * uncached responses cannot drift apart.
 */

import { renderLayout } from './layout'
import { renderHomePage } from './pages/home'
import { renderContentPage } from './pages/content-page'
import { renderSimplePage } from './pages/simple-page'
import { renderDonatePage } from './pages/donate'
import { renderEventDetailPage } from './pages/event-detail'
import { renderNotFoundPage } from './pages/not-found'
import { resolveMediaUrl } from './utils/content'
import { plainText } from './utils/format'
import type { PublicRouteSnapshot } from './publish/types'

export interface RenderedRoute {
  html: string
  status: 200 | 404
}

/** Plain-text meta description, capped at 160 characters. */
function plainDescription(htmlOrText: string): string {
  const text = plainText(htmlOrText)
  return text.length > 160 ? `${text.slice(0, 157).trimEnd()}...` : text
}

/** Slugs rendered with the simple template regardless of their template field. */
const SIMPLE_TEMPLATE_SLUGS = ['about', 'contact', 'privacy', 'terms', 'eula']

export function renderRouteSnapshot(opts: {
  route: PublicRouteSnapshot
  origin: string
}): RenderedRoute {
  const { route, origin } = opts
  const { lang, path, shared } = route
  const page = route.page

  const notFound = (): RenderedRoute => ({
    html: renderLayout({
      lang,
      currentPath: path,
      origin,
      navItems: shared.navItems,
      footerSections: shared.footerSections,
      settings: shared.settings,
      content: renderNotFoundPage(lang),
    }),
    status: 404,
  })

  switch (route.kind) {
    case 'home': {
      const content = renderHomePage({
        lang,
        pages: route.pages ?? [],
        events: route.events ?? [],
        settings: shared.settings,
        trustedPartners: shared.trustedPartners,
      })

      return {
        html: renderLayout({
          lang,
          currentPath: path,
          origin,
          navItems: shared.navItems,
          footerSections: shared.footerSections,
          settings: shared.settings,
          image: page?.heroImage ? resolveMediaUrl(page.heroImage) : undefined,
          content,
        }),
        status: 200,
      }
    }

    case 'donate': {
      const metaTitle = lang === 'lv' ? page?.metaTitle_lv : page?.metaTitle_en
      const metaDescription = lang === 'lv' ? page?.metaDescription_lv : page?.metaDescription_en

      return {
        html: renderLayout({
          lang,
          currentPath: path,
          origin,
          title: metaTitle || (lang === 'lv' ? 'Ziedot' : 'Donate'),
          description: metaDescription || undefined,
          noIndex: page?.noIndex,
          navItems: shared.navItems,
          footerSections: shared.footerSections,
          settings: shared.settings,
          content: renderDonatePage({ lang, settings: shared.settings }),
        }),
        status: 200,
      }
    }

    case 'event': {
      const event = route.event
      if (!event) return notFound()

      return {
        html: renderLayout({
          lang,
          currentPath: path,
          origin,
          title: (lang === 'lv' ? event.title_lv : event.title_en) || undefined,
          description:
            plainDescription((lang === 'lv' ? event.body_lv : event.body_en) || '') || undefined,
          image: event.image ? resolveMediaUrl(event.image) : undefined,
          navItems: shared.navItems,
          footerSections: shared.footerSections,
          settings: shared.settings,
          content: renderEventDetailPage({ lang, event }),
        }),
        status: 200,
      }
    }

    case 'page': {
      if (!page) return notFound()

      const isSimple = page.template === 'simple' || SIMPLE_TEMPLATE_SLUGS.includes(page.slug)
      const content = isSimple
        ? renderSimplePage({ lang, page })
        : renderContentPage({ lang, page, settings: shared.settings })

      return {
        html: renderLayout({
          lang,
          currentPath: path,
          origin,
          title: lang === 'lv' ? page.metaTitle_lv || page.title_lv : page.metaTitle_en || page.title_en,
          description:
            (lang === 'lv' ? page.metaDescription_lv || page.excerpt_lv : page.metaDescription_en || page.excerpt_en) ||
            undefined,
          image: page.heroImage ? resolveMediaUrl(page.heroImage) : undefined,
          noIndex: page.noIndex,
          navItems: shared.navItems,
          footerSections: shared.footerSections,
          settings: shared.settings,
          content,
        }),
        status: 200,
      }
    }
  }
}

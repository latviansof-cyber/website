/**
 * Public Hono Router for SonicJS
 * Serves edge-rendered bilingual HTML pages.
 */

import { Hono } from 'hono'
import type { Context } from 'hono'
import type { D1Database } from '@cloudflare/workers-types'
import { renderLayout } from './layout'
import { renderHomePage } from './pages/home'
import { renderContentPage } from './pages/content-page'
import { renderSimplePage } from './pages/simple-page'
import { renderDonatePage } from './pages/donate'
import { renderEventDetailPage } from './pages/event-detail'
import { renderNotFoundPage } from './pages/not-found'
import {
  compareEventsByDate,
  getAllPublishedEvents,
  getAllPublishedPages,
  getFooterData,
  getNavigationItems,
  getPublishedEventBySlug,
  getPublishedPageBySlug,
  getSiteSettings,
  isEventUpcoming,
  resolveMediaUrl,
} from './utils/content'
import type { FooterData, NavigationItem, SiteSettingsData } from './utils/content'

type Bindings = {
  DB: D1Database
}

export const siteRouter = new Hono<{ Bindings: Bindings }>()

type Shared = {
  navItems: NavigationItem[]
  footer: FooterData
  settings: SiteSettingsData
}

function parseLang(param: string): 'en' | 'lv' | null {
  if (param === 'en' || param === 'lv') return param
  return null
}

function plainDescription(htmlOrText: string): string {
  const text = (htmlOrText || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return text.length > 160 ? `${text.slice(0, 157).trimEnd()}...` : text
}

async function loadShared(db: D1Database): Promise<Shared> {
  const [navItems, footer, settings] = await Promise.all([
    getNavigationItems(db),
    getFooterData(db),
    getSiteSettings(db),
  ])
  return { navItems, footer, settings }
}

type SiteContext = Context<{ Bindings: Bindings }>

async function render404(c: SiteContext, lang: 'en' | 'lv', shared: Shared, currentPath: string) {
  const layout = renderLayout({
    lang,
    currentPath,
    origin: new URL(c.req.url).origin,
    navItems: shared.navItems,
    footer: shared.footer,
    settings: shared.settings,
    content: renderNotFoundPage(lang),
  })
  return c.html(layout, 404)
}

// Global redirects
siteRouter.get('/', (c) => c.redirect('/en', 302))
siteRouter.get('/donate', (c) => c.redirect('/en/donate', 302))
siteRouter.get('/events/:slug', (c) => c.redirect(`/en/events/${c.req.param('slug')}`, 302))

// Homepage: /:lang
siteRouter.get('/:lang', async (c) => {
  const lang = parseLang(c.req.param('lang'))
  if (!lang) {
    const shared = await loadShared(c.env.DB)
    return render404(c, 'en', shared, c.req.path)
  }

  const [allPages, allEvents, shared] = await Promise.all([
    getAllPublishedPages(c.env.DB),
    getAllPublishedEvents(c.env.DB),
    loadShared(c.env.DB),
  ])

  const homePage = allPages.find((p) => p.slug === 'home')
  // Production homepage cards list every published content page (news + fixed).
  const explorePages = allPages.filter((p) => p.template === 'content')

  // Upcoming events first (date asc), then past events (date asc).
  const upcoming = allEvents.filter((e) => isEventUpcoming(e)).sort(compareEventsByDate)
  const past = allEvents.filter((e) => !isEventUpcoming(e)).sort(compareEventsByDate)
  const events = [...upcoming, ...past]

  const content = renderHomePage({ lang, pages: explorePages, events, settings: shared.settings })

  const layout = renderLayout({
    lang,
    currentPath: c.req.path,
    origin: new URL(c.req.url).origin,
    navItems: shared.navItems,
    footer: shared.footer,
    settings: shared.settings,
    image: homePage?.heroImage ? resolveMediaUrl(homePage.heroImage) : undefined,
    content,
  })

  return c.html(layout)
})

// Donate Page: /:lang/donate
siteRouter.get('/:lang/donate', async (c) => {
  const lang = parseLang(c.req.param('lang'))
  if (!lang) {
    const shared = await loadShared(c.env.DB)
    return render404(c, 'en', shared, c.req.path)
  }

  const [donatePage, shared] = await Promise.all([
    getPublishedPageBySlug(c.env.DB, 'donate'),
    loadShared(c.env.DB),
  ])

  const metaTitle = lang === 'lv' ? donatePage?.metaTitle_lv : donatePage?.metaTitle_en
  const metaDescription =
    lang === 'lv' ? donatePage?.metaDescription_lv : donatePage?.metaDescription_en

  const content = renderDonatePage({ lang, settings: shared.settings })

  const layout = renderLayout({
    lang,
    currentPath: c.req.path,
    origin: new URL(c.req.url).origin,
    title: metaTitle || (lang === 'lv' ? 'Ziedot' : 'Donate'),
    description: metaDescription || undefined,
    noIndex: donatePage?.noIndex,
    navItems: shared.navItems,
    footer: shared.footer,
    settings: shared.settings,
    content,
  })

  return c.html(layout)
})

// Event Detail: /:lang/events/:slug
siteRouter.get('/:lang/events/:slug', async (c) => {
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

  if (!event) {
    return render404(c, lang, shared, c.req.path)
  }

  const title = lang === 'lv' ? event.title_lv : event.title_en
  const description =
    lang === 'lv'
      ? plainDescription(event.body_lv || '')
      : plainDescription(event.body_en || '')
  const image = event.image ? resolveMediaUrl(event.image) : undefined

  const content = renderEventDetailPage({ lang, event })

  const layout = renderLayout({
    lang,
    currentPath: c.req.path,
    origin: new URL(c.req.url).origin,
    title: title || undefined,
    description: description || undefined,
    image,
    navItems: shared.navItems,
    footer: shared.footer,
    settings: shared.settings,
    content,
  })

  return c.html(layout)
})

// Standard or Simple Page: /:lang/:slug
siteRouter.get('/:lang/:slug', async (c) => {
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

  if (!page) {
    return render404(c, lang, shared, c.req.path)
  }

  const template: 'simple' | 'content' =
    page.template === 'simple' ||
    ['about', 'contact', 'privacy', 'terms', 'eula'].includes(slug)
      ? 'simple'
      : 'content'

  const content =
    template === 'simple'
      ? renderSimplePage({ lang, page })
      : renderContentPage({ lang, page })

  const title = lang === 'lv' ? page.metaTitle_lv || page.title_lv : page.metaTitle_en || page.title_en
  const description =
    lang === 'lv' ? page.metaDescription_lv || page.excerpt_lv : page.metaDescription_en || page.excerpt_en
  const image = page.heroImage ? resolveMediaUrl(page.heroImage) : undefined

  const layout = renderLayout({
    lang,
    currentPath: c.req.path,
    origin: new URL(c.req.url).origin,
    title,
    description: description || undefined,
    image,
    noIndex: page.noIndex,
    navItems: shared.navItems,
    footer: shared.footer,
    settings: shared.settings,
    content,
  })

  return c.html(layout)
})

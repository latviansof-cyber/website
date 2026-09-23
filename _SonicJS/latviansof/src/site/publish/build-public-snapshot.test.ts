import { describe, expect, it } from 'vitest'
import { buildDocumentRoute, buildHomeRoute, buildPublicSnapshot } from './build-public-snapshot'
import type { PublicContent, PublicRouteSnapshot, PublicSharedSnapshot } from './types'
import type { EventData, FooterSections, PageData, SiteSettingsData } from '../utils/content'

const FOOTER: FooterSections = {
  identity: { tagline_en: 'Tagline', tagline_lv: 'Devīze', address_en: 'Darwin NT', address_lv: 'Dārvina' },
  quickLinks: [],
  resources: [],
  getInvolved: { blurb_en: 'Blurb', blurb_lv: 'Apraksts', donateLabel_en: 'Donate', donateLabel_lv: 'Ziedot' },
}

const SETTINGS: SiteSettingsData = { associationName_en: 'Latvian Association of Darwin' }

const PAGES: PageData[] = [
  { slug: 'home', template: 'home', title_en: 'Home' },
  { slug: 'donate', template: 'donate', title_en: 'Donate' },
  { slug: 'about', template: 'simple', title_en: 'About' },
  { slug: 'elections-2026', template: 'content', title_en: 'Elections 2026' },
  { slug: 'draft-note', template: 'content', noIndex: true },
]

const EVENTS: EventData[] = [
  { slug: 'jani', title_en: 'Jāņi', eventDate: '2099-06-23T18:00:00.000Z' },
  { slug: 'archive-night', title_en: 'Archive Night', eventDate: '2001-05-04T18:00:00.000Z' },
  { slug: 'undated-gathering', title_en: 'Undated Gathering' },
]

const CONTENT: PublicContent = {
  pages: PAGES,
  events: EVENTS,
  trustedPartners: [{ title: 'NT Government', logo: '/files/nt.webp', url: 'https://nt.gov.au/' }],
  navItems: [{ href: '/about', en: 'About', lv: 'Par mums' }],
  footerSections: FOOTER,
  settings: SETTINGS,
}

const SHARED: PublicSharedSnapshot = {
  trustedPartners: CONTENT.trustedPartners,
  navItems: CONTENT.navItems,
  footerSections: CONTENT.footerSections,
  settings: CONTENT.settings,
}

describe('buildPublicSnapshot', () => {
  const snapshot = buildPublicSnapshot(CONTENT, '2026-09-24T00:00:00.000Z')

  it('has a route for every published path', () => {
    expect(snapshot.paths.length).toBeGreaterThan(0)
    for (const path of snapshot.paths) {
      expect(snapshot.routes[path], `missing route for ${path}`).toBeDefined()
    }
  })

  it('does not advertise paths it could not build a route for', () => {
    expect(Object.keys(snapshot.routes).sort()).toEqual(snapshot.paths)
  })

  it('gives every route the shared chrome and the generated timestamp survives', () => {
    for (const route of Object.values(snapshot.routes)) {
      expect(route.shared.settings).toBe(SETTINGS)
      expect(route.shared.footerSections).toBe(FOOTER)
    }
    expect(snapshot.generatedAt).toBe('2026-09-24T00:00:00.000Z')
  })

  it('builds the homepage route with content cards and upcoming-first events', () => {
    const route = snapshot.routes['/lv']

    expect(route.kind).toBe('home')
    expect(route.lang).toBe('lv')
    expect(route.page?.slug).toBe('home')
    // Every published content page becomes a card, exactly as the D1 homepage does.
    expect(route.pages?.map((page) => page.slug)).toEqual(['elections-2026', 'draft-note'])
    // Dated upcoming events by date, undated last, then past events.
    expect(route.events?.map((event) => event.slug)).toEqual([
      'jani',
      'undated-gathering',
      'archive-night',
    ])
    expect(route.shared.trustedPartners).toHaveLength(1)
  })

  it('builds page, donate, and event routes', () => {
    expect(snapshot.routes['/en/about'].page?.slug).toBe('about')
    expect(snapshot.routes['/en/about'].kind).toBe('page')

    expect(snapshot.routes['/lv/donate'].kind).toBe('donate')
    expect(snapshot.routes['/lv/donate'].page?.slug).toBe('donate')

    expect(snapshot.routes['/en/events/jani'].kind).toBe('event')
    expect(snapshot.routes['/en/events/jani'].event?.slug).toBe('jani')
    expect(snapshot.routes['/en/events/jani'].slug).toBe('jani')
  })

  it('keeps noIndex pages out of the snapshot', () => {
    expect(snapshot.routes['/en/draft-note']).toBeUndefined()
  })

  it('round-trips through JSON without losing routes or content', () => {
    const parsed = JSON.parse(JSON.stringify(snapshot)) as typeof snapshot

    expect(parsed.paths).toEqual(snapshot.paths)
    expect(parsed.routes['/en/about'].page?.title_en).toBe('About')
    expect(parsed.routes['/en'].events?.map((event) => event.slug)).toEqual(
      snapshot.routes['/en'].events?.map((event) => event.slug),
    )
  })
})

describe('route builders used by the D1 fallback', () => {
  it('builds a document route for a page fetched by slug', () => {
    const route = buildDocumentRoute({
      kind: 'page',
      lang: 'en',
      path: '/en/about',
      shared: SHARED,
      page: PAGES[2],
    })

    expect(route?.page?.slug).toBe('about')
  })

  it('returns null when the document is missing so the caller can render 404', () => {
    expect(
      buildDocumentRoute({ kind: 'page', lang: 'en', path: '/en/gone', shared: SHARED }),
    ).toBeNull()
    expect(
      buildDocumentRoute({ kind: 'event', lang: 'en', path: '/en/events/gone', shared: SHARED }),
    ).toBeNull()
  })

  it('still renders the donate route when its document is missing', () => {
    const route = buildDocumentRoute({
      kind: 'donate',
      lang: 'en',
      path: '/en/donate',
      shared: SHARED,
    })

    expect(route?.kind).toBe('donate')
  })

  it('builds a homepage route from just the documents it was given', () => {
    const route: PublicRouteSnapshot = buildHomeRoute(
      'en',
      '/en',
      SHARED,
      { pages: [PAGES[3]], events: EVENTS },
    )

    expect(route.pages?.map((page) => page.slug)).toEqual(['elections-2026'])
    expect(route.events?.[0]?.slug).toBe('jani')
    expect(route.events?.[2]?.slug).toBe('archive-night')
  })
})

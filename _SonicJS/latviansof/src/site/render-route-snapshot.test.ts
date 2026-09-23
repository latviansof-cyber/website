import { describe, expect, it } from 'vitest'
import { renderRouteSnapshot } from './render-route-snapshot'
import type { PublicRouteSnapshot, PublicSharedSnapshot } from './publish/types'
import type { EventData, PageData } from './utils/content'

const ORIGIN = 'https://latviansofdarwin.org.au'

/** The exact stored body of the elections-2026 news post (escaped YouTube iframe). */
const STORED_BODY =
  '<p>Vēlētāji, kuri vēlēšanu laikā uzturas ārvalstīs, 15. Saeimas vēlēšanās var balsot pa pastu.</p><p>&lt;iframe width="560" height="315" src="https://www.youtube.com/embed/IGufUlcM6BU?si=haF6YwtIR5Byr8SB" title="YouTube video player" frameborder="0" allowfullscreen&gt;&lt;/iframe&gt;</p>'

const HERO_IMAGE = '/files/uploads/87a286d39839779b38c5d.webp'

const page: PageData = {
  slug: 'elections-2026',
  template: 'content',
  title_en: 'Elections 2026',
  excerpt_en: 'How postal voting works',
  body_en: STORED_BODY,
  heroImage: HERO_IMAGE,
}

const event: EventData = {
  slug: 'jani',
  title_en: 'Jāņi',
  eventDate: '2099-06-23T18:00:00.000Z',
  body_en: STORED_BODY,
  image: HERO_IMAGE,
}

const shared: PublicSharedSnapshot = {
  navItems: [{ href: '/about', en: 'About', lv: 'Par mums' }],
  footerSections: {
    identity: { tagline_en: 'Tagline', tagline_lv: 'Devīze', address_en: 'Darwin', address_lv: 'Dārvina' },
    quickLinks: [],
    resources: [],
    getInvolved: {
      blurb_en: 'Blurb',
      blurb_lv: 'Apraksts',
      donateLabel_en: 'Donate',
      donateLabel_lv: 'Ziedot',
    },
  },
  settings: { associationName_en: 'Latvian Association of Darwin' },
  trustedPartners: [],
}

const pageRoute: PublicRouteSnapshot = {
  path: '/en/elections-2026',
  lang: 'en',
  kind: 'page',
  slug: 'elections-2026',
  page,
  shared,
}

const eventRoute: PublicRouteSnapshot = {
  path: '/lv/events/jani',
  lang: 'lv',
  kind: 'event',
  slug: 'jani',
  event,
  shared,
}

const homeRoute: PublicRouteSnapshot = {
  path: '/en',
  lang: 'en',
  kind: 'home',
  page,
  pages: [page],
  events: [event],
  shared,
}

/** Exactly what the KV reader hands back: the JSON stringify/parse round trip. */
function viaKv(route: PublicRouteSnapshot): PublicRouteSnapshot {
  return JSON.parse(JSON.stringify(route)) as PublicRouteSnapshot
}

describe('rendering a route from KV matches rendering it from D1', () => {
  it.each([
    ['page', pageRoute],
    ['event', eventRoute],
    ['home', homeRoute],
  ])('produces identical HTML for a %s route', (_kind, route) => {
    expect(renderRouteSnapshot({ route: viaKv(route), origin: ORIGIN })).toEqual(
      renderRouteSnapshot({ route, origin: ORIGIN }),
    )
  })

  it('keeps the hero image URL intact through the KV round trip', () => {
    const rendered = renderRouteSnapshot({ route: viaKv(pageRoute), origin: ORIGIN })

    expect(rendered.html).toContain(`src="${HERO_IMAGE}"`)
    expect(rendered.html).toContain(`content="${ORIGIN}${HERO_IMAGE}"`)
  })

  it('keeps the event image URL intact through the KV round trip', () => {
    const rendered = renderRouteSnapshot({ route: viaKv(eventRoute), origin: ORIGIN })

    expect(rendered.html).toContain(`src="${HERO_IMAGE}"`)
  })

  it('keeps YouTube embeds working from a KV payload', () => {
    const rendered = renderRouteSnapshot({ route: viaKv(pageRoute), origin: ORIGIN })

    expect(rendered.html).toContain('<iframe class="ql-video"')
    expect(rendered.html).toContain('src="https://www.youtube-nocookie.com/embed/IGufUlcM6BU"')
    expect(rendered.html).not.toContain('&lt;iframe')
  })

  it('reports 404 for a route whose document is missing', () => {
    const rendered = renderRouteSnapshot({
      route: { ...pageRoute, page: undefined },
      origin: ORIGIN,
    })

    expect(rendered.status).toBe(404)
  })
})

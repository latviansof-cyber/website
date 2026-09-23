/**
 * Public sitemap helpers.
 *
 * `buildPublicPaths` is the single source of truth for the public URLs the site
 * advertises. `/sitemap.xml` and the KV snapshot builder both consume it, so the
 * sitemap and the published route set can never drift apart.
 */

import type { EventData, PageData } from './utils/content'

/** Bilingual entry points that exist independently of any page document. */
const STATIC_PATHS = ['/en', '/lv', '/en/donate', '/lv/donate']

/** Page slugs excluded from the sitemap because they are served by custom routes. */
const RESERVED_SLUGS: Record<string, true> = { home: true, donate: true }

export function buildPublicPaths(pages: PageData[], events: EventData[]): string[] {
  const paths = new Set<string>(STATIC_PATHS)

  for (const page of pages) {
    if (!page.slug) continue
    if (RESERVED_SLUGS[page.slug]) continue
    if (page.noIndex) continue
    paths.add(`/en/${page.slug}`)
    paths.add(`/lv/${page.slug}`)
  }

  for (const event of events) {
    if (!event.slug) continue
    paths.add(`/en/events/${event.slug}`)
    paths.add(`/lv/events/${event.slug}`)
  }

  return Array.from(paths).sort()
}

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export function buildSitemapXml(origin: string, paths: string[]): string {
  const urls = paths
    .map((path) => `  <url><loc>${xmlEscape(`${origin}${path}`)}</loc></url>`)
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
}

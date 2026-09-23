import { describe, expect, it } from 'vitest'
import { buildPublicPaths, buildSitemapXml } from './sitemap'
import type { EventData, PageData } from './utils/content'

const pages: PageData[] = [
  { slug: 'home', template: 'home' },
  { slug: 'donate', template: 'donate' },
  { slug: 'about', template: 'simple' },
  { slug: 'elections-2026', template: 'content' },
  { slug: 'internal-note', template: 'content', noIndex: true },
]

const events: EventData[] = [{ slug: 'jani', title_en: 'Jāņi' }]

describe('buildPublicPaths', () => {
  it('includes both language entry points and the donate routes', () => {
    const paths = buildPublicPaths([], [])

    expect(paths).toEqual(['/en', '/en/donate', '/lv', '/lv/donate'])
  })

  it('lists every published page in both languages', () => {
    const paths = buildPublicPaths(pages, [])

    expect(paths).toContain('/en/about')
    expect(paths).toContain('/lv/about')
    expect(paths).toContain('/en/elections-2026')
    expect(paths).toContain('/lv/elections-2026')
  })

  it('omits the home and donate documents, which have their own routes', () => {
    const paths = buildPublicPaths(pages, [])

    expect(paths).not.toContain('/en/home')
    expect(paths).not.toContain('/lv/home')
    expect(paths).not.toContain('/en/donate/donate')
    expect(paths.filter((path) => path.endsWith('/donate'))).toEqual(['/en/donate', '/lv/donate'])
  })

  it('omits noIndex pages', () => {
    const paths = buildPublicPaths(pages, [])

    expect(paths).not.toContain('/en/internal-note')
    expect(paths).not.toContain('/lv/internal-note')
  })

  it('includes event detail paths in both languages', () => {
    const paths = buildPublicPaths([], events)

    expect(paths).toContain('/en/events/jani')
    expect(paths).toContain('/lv/events/jani')
  })

  it('ignores documents without a slug', () => {
    const paths = buildPublicPaths([{ slug: '', template: 'content' }], [{ slug: '' }])

    expect(paths).toEqual(['/en', '/en/donate', '/lv', '/lv/donate'])
  })
})

describe('buildSitemapXml', () => {
  it('emits one url entry per path under the sitemap namespace', () => {
    const xml = buildSitemapXml('https://example.test', ['/en', '/lv/about'])

    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true)
    expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
    expect(xml).toContain('<loc>https://example.test/en</loc>')
    expect(xml).toContain('<loc>https://example.test/lv/about</loc>')
  })

  it('escapes XML special characters in URLs', () => {
    const xml = buildSitemapXml('https://example.test', ['/en/a&b<c>"d\''])

    expect(xml).toContain('<loc>https://example.test/en/a&amp;b&lt;c&gt;&quot;d&apos;</loc>')
  })
})

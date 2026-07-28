import { isLang, localeAlternates, localizeHref } from '@/lib/i18nRouting'

describe('i18n URL routing', () => {
  it('recognizes only supported language segments', () => {
    expect(isLang('en')).toBe(true)
    expect(isLang('lv')).toBe(true)
    expect(isLang('fr')).toBe(false)
  })

  it('prefixes internal links and preserves anchors', () => {
    expect(localizeHref('/', 'lv')).toBe('/lv')
    expect(localizeHref('/donate', 'lv')).toBe('/lv/donate')
    expect(localizeHref('/#events', 'en')).toBe('/en/#events')
  })

  it('switches an existing language prefix', () => {
    expect(localizeHref('/en/events/jani', 'lv')).toBe('/lv/events/jani')
  })

  it('does not rewrite external, email, phone, or same-page links', () => {
    expect(localizeHref('https://example.com', 'lv')).toBe('https://example.com')
    expect(localizeHref('mailto:hello@example.com', 'lv')).toBe('mailto:hello@example.com')
    expect(localizeHref('tel:+61123456789', 'lv')).toBe('tel:+61123456789')
    expect(localizeHref('#main', 'lv')).toBe('#main')
  })

  it('builds canonical and hreflang entries', () => {
    expect(localeAlternates('/donate', 'lv')).toEqual({
      canonical: '/lv/donate',
      languages: {
        'en-AU': '/en/donate',
        'lv-LV': '/lv/donate',
        'x-default': '/en/donate',
      },
    })
  })
})

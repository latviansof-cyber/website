import type { Metadata } from 'next'

export const languages = ['en', 'lv'] as const
export type Lang = (typeof languages)[number]

export function isLang(value: string): value is Lang {
  return languages.includes(value as Lang)
}

export function localizeHref(href: string, lang: Lang): string {
  if (
    !href ||
    href.startsWith('#') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:') ||
    href.startsWith('//') ||
    /^[a-z][a-z\d+.-]*:/i.test(href)
  ) {
    return href
  }

  const normalized = href.startsWith('/') ? href : `/${href}`
  const segments = normalized.split('/')
  if (isLang(segments[1] ?? '')) {
    segments[1] = lang
    return segments.join('/')
  }
  return `/${lang}${normalized === '/' ? '' : normalized}`
}

export function localeAlternates(path: string, canonicalLang: Lang): Metadata['alternates'] {
  const normalized = path === '/' ? '' : path.startsWith('/') ? path : `/${path}`
  return {
    canonical: `/${canonicalLang}${normalized}`,
    languages: {
      'en-AU': `/en${normalized}`,
      'lv-LV': `/lv${normalized}`,
      'x-default': `/en${normalized}`,
    },
  }
}

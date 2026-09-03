import type { MetadataRoute } from 'next'
import { getWebsitePages } from '@/lib/pages'
import { getWebsiteEvents } from '@/lib/events'
import { fallbackSpecialPages } from '@/lib/specialPages'
import { SITE_URL } from '@/lib/site'
import { languages } from '@/lib/i18nRouting'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pages, events] = await Promise.all([getWebsitePages(), getWebsiteEvents()])
  const specialSlugs = fallbackSpecialPages.map((p) => `/${p.slug}`)
  const paths = [
    '/',
    '/donate',
    ...pages.map((page) => `/${page.slug}`),
    ...specialSlugs,
    ...events.map((event) => `/events/${event.slug}`),
  ]

  return paths.flatMap((path) =>
    languages.map((lang) => {
      const localizedPath = `/${lang}${path === '/' ? '' : path}`
      return {
        url: new URL(localizedPath, SITE_URL).toString(),
        changeFrequency: path === '/' ? ('weekly' as const) : ('monthly' as const),
        priority: path === '/' ? 1 : 0.8,
        alternates: {
          languages: {
            'en-AU': new URL(`/en${path === '/' ? '' : path}`, SITE_URL).toString(),
            'lv-LV': new URL(`/lv${path === '/' ? '' : path}`, SITE_URL).toString(),
          },
        },
      }
    }),
  )
}

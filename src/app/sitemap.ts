import type { MetadataRoute } from 'next'
import { getWebsitePages } from '@/lib/pages'
import { fallbackSpecialPages } from '@/lib/specialPages'
import { SITE_URL } from '@/lib/site'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = await getWebsitePages()
  const specialSlugs = fallbackSpecialPages.map((p) => `/${p.slug}`)
  const paths = ['/', '/donate', ...pages.map((page) => `/${page.slug}`), ...specialSlugs]

  return paths.map((path) => ({
    url: new URL(path, SITE_URL).toString(),
    changeFrequency: path === '/' ? 'weekly' : 'monthly',
    priority: path === '/' ? 1 : 0.8,
  }))
}

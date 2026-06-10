import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ContentPage } from '../components/ContentPage'
import { JsonLd } from '../components/JsonLd'
import { LanguageProvider } from '../i18n/LanguageProvider'
import { SiteFooter } from '../components/SiteFooter'
import { SiteHeader } from '../components/SiteHeader'
import { fallbackPages, getWebsitePage } from '@/lib/pages'
import { getMainMenu } from '@/lib/navigation'
import { SITE_NAME, SITE_URL, absoluteURL } from '@/lib/site'
import { getOgImageUrlByPath } from '@/lib/ogImage'

export const dynamic = 'force-dynamic'

export function generateStaticParams() {
  return fallbackPages.map((page) => ({ slug: page.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const page = await getWebsitePage(slug)
  if (!page) return {}

  const title = page.meta.title || page.en.title
  const description = page.meta.description || page.en.excerpt
  const ogImage = getOgImageUrlByPath(`/${page.slug}`)

  return {
    title,
    description,
    alternates: {
      canonical: `/${page.slug}`,
    },
    robots: {
      index: !page.meta.noIndex,
      follow: !page.meta.noIndex,
    },
    openGraph: {
      type: 'website',
      locale: 'en_AU',
      alternateLocale: 'lv_LV',
      url: `/${page.slug}`,
      siteName: SITE_NAME,
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: page.en.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

export default async function WebsiteContentPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [page, mainMenu] = await Promise.all([getWebsitePage(slug), getMainMenu()])
  if (!page) notFound()

  return (
    <LanguageProvider>
      <SiteHeader navItems={mainMenu} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          '@id': `${SITE_URL}${page.slug}#webpage`,
          url: `${SITE_URL}${page.slug}`,
          name: page.meta.title || page.en.title,
          description: page.meta.description || page.en.excerpt,
          primaryImageOfPage: {
            '@type': 'ImageObject',
            url: absoluteURL(page.meta.image),
          },
          isPartOf: {
            '@type': 'WebSite',
            '@id': `${SITE_URL}#website`,
            name: SITE_NAME,
            url: SITE_URL.toString(),
          },
          about: {
            '@id': `${SITE_URL}#organization`,
          },
          inLanguage: ['en-AU', 'lv-LV'],
        }}
      />
      <ContentPage page={page} />
      <SiteFooter />
    </LanguageProvider>
  )
}

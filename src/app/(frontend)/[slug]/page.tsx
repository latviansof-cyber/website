import { notFound, redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { ContentPage } from '../components/ContentPage'
import { SpecialPageLayout } from '../components/SpecialPageLayout'
import { JsonLd } from '../components/JsonLd'
import { LanguageProvider } from '../i18n/LanguageProvider'
import { SiteFooter } from '../components/SiteFooter'
import { SiteHeader } from '../components/SiteHeader'
import { fallbackPages, getWebsitePage } from '@/lib/pages'
import { fallbackSpecialPages, getSpecialPage } from '@/lib/specialPages'
import { getWebsiteEvent } from '@/lib/events'
import { getMainMenu } from '@/lib/navigation'
import { getFooter } from '@/lib/footer'
import { getSiteSettings } from '@/lib/siteSettings'
import { SITE_NAME, SITE_URL, absoluteURL } from '@/lib/site'
import { getOgImageUrlByPath } from '@/lib/ogImage'

export const dynamic = 'force-dynamic'

export function generateStaticParams() {
  const pageSlugs = fallbackPages.map((page) => ({ slug: page.slug }))
  const specialSlugs = fallbackSpecialPages.map((page) => ({ slug: page.slug }))
  return [...pageSlugs, ...specialSlugs]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const [page, specialPage, event] = await Promise.all([
    getWebsitePage(slug),
    getSpecialPage(slug),
    getWebsiteEvent(slug),
  ])
  
  if (event && !page && !specialPage) {
    return {
      title: `${event.en.title} | ${SITE_NAME}`,
      description: event.en.body.slice(0, 160),
    }
  }

  if (!page && !specialPage) return {}

  const title = page ? (page.meta.title || page.en.title) : (specialPage!.meta?.en?.title || specialPage!.en.title)
  const description = page ? (page.meta.description || page.en.excerpt) : (specialPage!.meta?.en?.description || specialPage!.en.title)
  const ogImage = getOgImageUrlByPath(`/${slug}`)

  return {
    title,
    description,
    alternates: {
      canonical: `/${slug}`,
    },
    robots: {
      index: page ? !page.meta.noIndex : true,
      follow: page ? !page.meta.noIndex : true,
    },
    openGraph: {
      type: 'website',
      locale: 'en_AU',
      alternateLocale: 'lv_LV',
      url: `/${slug}`,
      siteName: SITE_NAME,
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: page ? page.en.title : specialPage!.en.title,
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
  const [page, specialPage, event, mainMenu, footer, siteSettings] = await Promise.all([
    getWebsitePage(slug),
    getSpecialPage(slug),
    getWebsiteEvent(slug),
    getMainMenu(),
    getFooter(),
    getSiteSettings(),
  ])
  
  if (!page && !specialPage) {
    if (event) {
      redirect(`/events/${slug}`)
    }
    notFound()
  }

  return (
    <LanguageProvider>
      <SiteHeader navItems={mainMenu} siteSettings={siteSettings} />
      {page ? (
        <>
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
        </>
      ) : (
        <SpecialPageLayout page={specialPage} />
      )}
      <SiteFooter footer={footer} siteSettings={siteSettings} />
    </LanguageProvider>
  )
}

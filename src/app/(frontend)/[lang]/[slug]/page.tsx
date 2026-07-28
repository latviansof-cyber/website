import { notFound, redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { ContentPage } from '../../components/ContentPage'
import { SpecialPageLayout } from '../../components/SpecialPageLayout'
import { JsonLd } from '../../components/JsonLd'
import { SiteFooter } from '../../components/SiteFooter'
import { SiteHeader } from '../../components/SiteHeader'
import { fallbackPages, getWebsitePage } from '@/lib/pages'
import { fallbackSpecialPages, getSpecialPage } from '@/lib/specialPages'
import { getWebsiteEvent } from '@/lib/events'
import { getMainMenu } from '@/lib/navigation'
import { getFooter } from '@/lib/footer'
import { getSiteSettings } from '@/lib/siteSettings'
import { SITE_NAME, SITE_URL, absoluteURL } from '@/lib/site'
import { getOgImageUrlByPath } from '@/lib/ogImage'
import { isLang, localeAlternates } from '@/lib/i18nRouting'

export const dynamic = 'force-dynamic'

export function generateStaticParams() {
  const pageSlugs = fallbackPages.map((page) => ({ slug: page.slug }))
  const specialSlugs = fallbackSpecialPages.map((page) => ({ slug: page.slug }))
  return [...pageSlugs, ...specialSlugs]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}): Promise<Metadata> {
  const { lang, slug } = await params
  if (!isLang(lang)) return {}
  const [page, specialPage, event] = await Promise.all([
    getWebsitePage(slug),
    getSpecialPage(slug),
    getWebsiteEvent(slug),
  ])

  if (event && !page && !specialPage) {
    const content = event[lang]
    return {
      title: `${content.title} | ${SITE_NAME}`,
      description: content.body.slice(0, 160),
    }
  }

  if (!page && !specialPage) return {}

  const pageContent = page?.[lang]
  const specialContent = specialPage?.[lang]
  const specialMeta = specialPage?.meta?.[lang]
  const title = page
    ? (lang === 'en' ? page.meta.title : undefined) || pageContent!.title
    : specialMeta?.title || specialContent!.title
  const description = page
    ? (lang === 'en' ? page.meta.description : undefined) || pageContent!.excerpt
    : specialMeta?.description || specialContent!.title
  const ogImage = getOgImageUrlByPath(`/${slug}`)

  return {
    title,
    description,
    alternates: localeAlternates(`/${slug}`, lang),
    robots: {
      index: page ? !page.meta.noIndex : true,
      follow: page ? !page.meta.noIndex : true,
    },
    openGraph: {
      type: 'website',
      locale: lang === 'lv' ? 'lv_LV' : 'en_AU',
      alternateLocale: lang === 'lv' ? 'en_AU' : 'lv_LV',
      url: `/${lang}/${slug}`,
      siteName: SITE_NAME,
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: page ? pageContent!.title : specialContent!.title,
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
  params: Promise<{ lang: string; slug: string }>
}) {
  const { lang, slug } = await params
  if (!isLang(lang)) notFound()
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
      redirect(`/${lang}/events/${slug}`)
    }
    notFound()
  }

  return (
    <>
      <SiteHeader navItems={mainMenu} siteSettings={siteSettings} />
      {page ? (
        <>
          <JsonLd
            data={{
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              '@id': `${SITE_URL}${lang}/${page.slug}#webpage`,
              url: `${SITE_URL}${lang}/${page.slug}`,
              name: (lang === 'en' ? page.meta.title : undefined) || page[lang].title,
              description:
                (lang === 'en' ? page.meta.description : undefined) || page[lang].excerpt,
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
              inLanguage: lang === 'lv' ? 'lv-LV' : 'en-AU',
            }}
          />
          <ContentPage page={page} />
        </>
      ) : (
        <SpecialPageLayout page={specialPage} />
      )}
      <SiteFooter footer={footer} siteSettings={siteSettings} />
    </>
  )
}

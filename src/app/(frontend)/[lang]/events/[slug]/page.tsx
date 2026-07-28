import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { EventDetailPage } from '../../../components/EventDetailPage'
import { JsonLd } from '../../../components/JsonLd'
import { SiteFooter } from '../../../components/SiteFooter'
import { SiteHeader } from '../../../components/SiteHeader'
import { fallbackEvents, getWebsiteEvent, getWebsiteEvents } from '@/lib/events'
import { getMainMenu } from '@/lib/navigation'
import { getFooter } from '@/lib/footer'
import { getSiteSettings } from '@/lib/siteSettings'
import { SITE_NAME, SITE_URL, absoluteURL } from '@/lib/site'
import { getOgImageUrlByPath } from '@/lib/ogImage'
import { isLang, localeAlternates } from '@/lib/i18nRouting'

export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
  const events = await getWebsiteEvents()
  const slugs = events.length ? events : fallbackEvents
  return slugs.map((event) => ({ slug: event.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}): Promise<Metadata> {
  const { lang, slug } = await params
  if (!isLang(lang)) return {}
  const event = await getWebsiteEvent(slug)
  if (!event) return {}

  const content = event[lang]
  const title = `${content.title} | ${SITE_NAME}`
  const description = content.body.slice(0, 160)
  const ogImage = event.image ? absoluteURL(event.image) : getOgImageUrlByPath(`/events/${slug}`)

  return {
    title,
    description,
    alternates: localeAlternates(`/events/${slug}`, lang),
    openGraph: {
      type: 'article',
      locale: lang === 'lv' ? 'lv_LV' : 'en_AU',
      alternateLocale: lang === 'lv' ? 'en_AU' : 'lv_LV',
      url: `/${lang}/events/${slug}`,
      siteName: SITE_NAME,
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: content.title,
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

export default async function EventPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { lang, slug } = await params
  if (!isLang(lang)) notFound()
  const [event, mainMenu, footer, siteSettings] = await Promise.all([
    getWebsiteEvent(slug),
    getMainMenu(),
    getFooter(),
    getSiteSettings(),
  ])

  if (!event) notFound()

  const content = event[lang]
  return (
    <>
      <SiteHeader navItems={mainMenu} siteSettings={siteSettings} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Event',
          '@id': `${SITE_URL}${lang}/events/${event.slug}#event`,
          url: `${SITE_URL}${lang}/events/${event.slug}`,
          name: content.title,
          description: content.body,
          image: event.image ? absoluteURL(event.image) : undefined,
          organizer: {
            '@type': 'Organization',
            name: SITE_NAME,
            url: SITE_URL.toString(),
          },
          inLanguage: lang === 'lv' ? 'lv-LV' : 'en-AU',
        }}
      />
      <EventDetailPage event={event} />
      <SiteFooter footer={footer} siteSettings={siteSettings} />
    </>
  )
}

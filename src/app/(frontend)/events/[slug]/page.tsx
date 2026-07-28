import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { EventDetailPage } from '../../components/EventDetailPage'
import { JsonLd } from '../../components/JsonLd'
import { LanguageProvider } from '../../i18n/LanguageProvider'
import { SiteFooter } from '../../components/SiteFooter'
import { SiteHeader } from '../../components/SiteHeader'
import { fallbackEvents, getWebsiteEvent, getWebsiteEvents } from '@/lib/events'
import { getMainMenu } from '@/lib/navigation'
import { getFooter } from '@/lib/footer'
import { getSiteSettings } from '@/lib/siteSettings'
import { SITE_NAME, SITE_URL, absoluteURL } from '@/lib/site'
import { getOgImageUrlByPath } from '@/lib/ogImage'

export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
  const events = await getWebsiteEvents()
  const slugs = events.length ? events : fallbackEvents
  return slugs.map((event) => ({ slug: event.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const event = await getWebsiteEvent(slug)
  if (!event) return {}

  const title = `${event.en.title} | ${SITE_NAME}`
  const description = event.en.body.slice(0, 160)
  const ogImage = event.image ? absoluteURL(event.image) : getOgImageUrlByPath(`/events/${slug}`)

  return {
    title,
    description,
    alternates: {
      canonical: `/events/${slug}`,
    },
    openGraph: {
      type: 'article',
      locale: 'en_AU',
      alternateLocale: 'lv_LV',
      url: `/events/${slug}`,
      siteName: SITE_NAME,
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: event.en.title,
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
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [event, mainMenu, footer, siteSettings] = await Promise.all([
    getWebsiteEvent(slug),
    getMainMenu(),
    getFooter(),
    getSiteSettings(),
  ])

  if (!event) notFound()

  return (
    <LanguageProvider>
      <SiteHeader navItems={mainMenu} siteSettings={siteSettings} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Event',
          '@id': `${SITE_URL}events/${event.slug}#event`,
          url: `${SITE_URL}events/${event.slug}`,
          name: event.en.title,
          description: event.en.body,
          image: event.image ? absoluteURL(event.image) : undefined,
          organizer: {
            '@type': 'Organization',
            name: SITE_NAME,
            url: SITE_URL.toString(),
          },
          inLanguage: ['en-AU', 'lv-LV'],
        }}
      />
      <EventDetailPage event={event} />
      <SiteFooter footer={footer} siteSettings={siteSettings} />
    </LanguageProvider>
  )
}

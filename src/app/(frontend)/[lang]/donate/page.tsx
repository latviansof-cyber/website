import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SiteHeader } from '../../components/SiteHeader'
import { SiteFooter } from '../../components/SiteFooter'
import { DonationWidget } from '../../donate/DonationWidget'
import { ErrorBoundary } from '../../components/ui/ErrorBoundary'
import { getOgImageUrlByPath } from '@/lib/ogImage'
import { getMainMenu } from '@/lib/navigation'
import { getFooter } from '@/lib/footer'
import { getSiteSettings } from '@/lib/siteSettings'
import { getDonationSettings } from '@/lib/donationSettings'
import { isLang, localeAlternates } from '@/lib/i18nRouting'

const ogImage = getOgImageUrlByPath('/donate')

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  if (!isLang(lang)) return {}
  const isLatvian = lang === 'lv'
  const title = isLatvian ? 'Ziedot' : 'Donate'
  const description = isLatvian
    ? 'Atbalstiet Dārvinas Latviešu Apvienību, tās kultūras pasākumus, valodas programmas un kopienu.'
    : 'Support the Latvian Association of Darwin with a one-time or monthly donation. Your gift funds cultural events, language programs, and community gatherings across the Northern Territory.'

  return {
    title,
    description,
    alternates: localeAlternates('/donate', lang),
    openGraph: {
      title: isLatvian
        ? 'Ziedot Dārvinas Latviešu Apvienībai'
        : 'Donate to the Latvian Association of Darwin',
      description,
      locale: isLatvian ? 'lv_LV' : 'en_AU',
      alternateLocale: isLatvian ? 'en_AU' : 'lv_LV',
      url: `/${lang}/donate`,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: 'summary_large_image', description, images: [ogImage] },
  }
}

export default async function DonatePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!isLang(lang)) notFound()
  const [mainMenu, footer, siteSettings, donationSettings] = await Promise.all([
    getMainMenu(),
    getFooter(),
    getSiteSettings(),
    getDonationSettings(),
  ])

  return (
    <>
      <SiteHeader navItems={mainMenu} siteSettings={siteSettings} />
      <main id="main" className="bg-cream text-ink">
        <ErrorBoundary>
          <DonationWidget donationSettings={donationSettings} />
        </ErrorBoundary>
      </main>
      <SiteFooter footer={footer} siteSettings={siteSettings} />
    </>
  )
}

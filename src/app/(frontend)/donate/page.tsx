import type { Metadata } from 'next'
import { LanguageProvider } from '../i18n/LanguageProvider'
import { SiteHeader } from '../components/SiteHeader'
import { SiteFooter } from '../components/SiteFooter'
import { DonationWidget } from './DonationWidget'
import { getOgImageUrlByPath } from '@/lib/ogImage'

const ogImage = getOgImageUrlByPath('/donate')

export const metadata: Metadata = {
  title: 'Donate',
  description:
    'Support the Latvian Association of Darwin with a one-time or monthly donation. Your gift funds cultural events, language programs, and community gatherings across the Northern Territory.',
  alternates: {
    canonical: '/donate',
  },
  openGraph: {
    title: 'Donate to the Latvian Association of Darwin',
    description:
      'Support cultural events, language programs, and Latvian community gatherings in the Northern Territory.',
    url: '/donate',
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: 'Donate to the Latvian Association of Darwin',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [ogImage],
  },
}

export default function DonatePage() {
  return (
    <LanguageProvider>
      <SiteHeader />
      <main id="main" className="bg-cream text-ink">
        <DonationWidget />
      </main>
      <SiteFooter />
    </LanguageProvider>
  )
}

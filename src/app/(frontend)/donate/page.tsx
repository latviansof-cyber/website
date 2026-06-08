import type { Metadata } from 'next'
import { LanguageProvider } from '../i18n/LanguageProvider'
import { SiteHeader } from '../components/SiteHeader'
import { SiteFooter } from '../components/SiteFooter'
import { DonationWidget } from './DonationWidget'

export const metadata: Metadata = {
  title: 'Donate — Latvian Association of Darwin',
  description:
    'Support the Latvian Association of Darwin with a one-time or monthly donation. Your gift funds cultural events, language programs, and community gatherings across the Northern Territory.',
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
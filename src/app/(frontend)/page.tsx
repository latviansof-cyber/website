import { LanguageProvider } from './i18n/LanguageProvider'
import type { Metadata } from 'next'
import { SiteHeader } from './components/SiteHeader'
import { Hero } from './components/Hero'
import { PageCards } from './components/PageCards'
import { Events } from './components/Events'
import { SiteFooter } from './components/SiteFooter'
import { getWebsitePages } from '@/lib/pages'
import { getWebsiteEvents } from '@/lib/events'
import { getHomepage } from '@/lib/homepage'
import { getMainMenu } from '@/lib/navigation'
import { getFooter } from '@/lib/footer'
import { getSiteSettings } from '@/lib/siteSettings'
import { SITE_DESCRIPTION, SITE_NAME, SITE_NAME_LV } from '@/lib/site'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: {
    absolute: `${SITE_NAME} — ${SITE_NAME_LV}`,
  },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: '/',
  },
}

export default async function HomePage() {

  const [pages, events, homepage, mainMenu, footer, siteSettings] = await Promise.all([
    getWebsitePages(),
    getWebsiteEvents(),
    getHomepage(),
    getMainMenu(),
    getFooter(),
    getSiteSettings(),
  ])

  return (
    <LanguageProvider>
      <SiteHeader navItems={mainMenu} siteSettings={siteSettings} />
      <main id="main" className="bg-cream text-ink">
        <Hero homepage={homepage} />
        <PageCards pages={pages} homepage={homepage} />
        <Events events={events} homepage={homepage} />
      </main>
      <SiteFooter footer={footer} siteSettings={siteSettings} />
    </LanguageProvider>
  )
}

// TODO: when locale routing lands, add locale-specific canonicals and hreflang.

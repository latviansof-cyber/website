import { LanguageProvider } from './i18n/LanguageProvider'
import type { Metadata } from 'next'
import { SiteHeader } from './components/SiteHeader'
import { Hero } from './components/Hero'
import { PageCards } from './components/PageCards'
import { Events } from './components/Events'
import { SiteFooter } from './components/SiteFooter'
import { getWebsitePages } from '@/lib/pages'
import { getWebsiteEvents } from '@/lib/events'
import { getMainMenu } from '@/lib/navigation'
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
  const [pages, events, mainMenu] = await Promise.all([
    getWebsitePages(),
    getWebsiteEvents(),
    getMainMenu(),
  ])

  return (
    <LanguageProvider>
      <SiteHeader navItems={mainMenu} />
      <main id="main" className="bg-cream text-ink">
        <Hero />
        <PageCards pages={pages} />
        <Events events={events} />
      </main>
      <SiteFooter />
    </LanguageProvider>
  )
}

// TODO(DLA-302): when locale routing lands, add locale-specific canonicals and hreflang.

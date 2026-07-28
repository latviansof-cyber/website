import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SiteHeader } from '../components/SiteHeader'
import { Hero } from '../components/Hero'
import { PageCards } from '../components/PageCards'
import { Events } from '../components/Events'
import { SiteFooter } from '../components/SiteFooter'
import { getWebsitePages } from '@/lib/pages'
import { getWebsiteEvents } from '@/lib/events'
import { getHomepage } from '@/lib/homepage'
import { getMainMenu } from '@/lib/navigation'
import { getFooter } from '@/lib/footer'
import { getSiteSettings } from '@/lib/siteSettings'
import { SITE_DESCRIPTION, SITE_NAME, SITE_NAME_LV } from '@/lib/site'
import { isLang, localeAlternates } from '@/lib/i18nRouting'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  if (!isLang(lang)) return {}

  return {
    title: {
      absolute: `${SITE_NAME} — ${SITE_NAME_LV}`,
    },
    description: SITE_DESCRIPTION,
    alternates: localeAlternates('/', lang),
  }
}

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!isLang(lang)) notFound()
  const [pages, events, homepage, mainMenu, footer, siteSettings] = await Promise.all([
    getWebsitePages(),
    getWebsiteEvents(),
    getHomepage(),
    getMainMenu(),
    getFooter(),
    getSiteSettings(),
  ])

  return (
    <>
      <SiteHeader navItems={mainMenu} siteSettings={siteSettings} />
      <main id="main" className="bg-cream text-ink">
        <Hero homepage={homepage} />
        <PageCards pages={pages} homepage={homepage} />
        <Events events={events} homepage={homepage} />
      </main>
      <SiteFooter footer={footer} siteSettings={siteSettings} />
    </>
  )
}

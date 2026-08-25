import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Hero } from '../components/Hero'
import { PageCards } from '../components/PageCards'
import { Events } from '../components/Events'
import { getWebsitePages } from '@/lib/pages'
import { getWebsiteEvents } from '@/lib/events'
import { getHomepage } from '@/lib/homepage'
import { SITE_DESCRIPTION, SITE_NAME, SITE_NAME_LV } from '@/lib/site'
import { isLang, languages, localeAlternates } from '@/lib/i18nRouting'

export const revalidate = 3600 // ISR: revalidate once per hour

export function generateStaticParams() {
  return languages.map((lang) => ({ lang }))
}

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
  const [pages, events, homepage] = await Promise.all([
    getWebsitePages(),
    getWebsiteEvents(),
    getHomepage(),
  ])

  return (
    <main id="main" className="bg-cream text-ink">
      <Hero homepage={homepage} />
      <PageCards pages={pages} homepage={homepage} />
      <Events events={events} homepage={homepage} />
    </main>
  )
}

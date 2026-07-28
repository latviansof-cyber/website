import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { LanguageProvider } from '../i18n/LanguageProvider'
import { isLang, languages } from '@/lib/i18nRouting'
import { SITE_NAME } from '@/lib/site'

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
    openGraph: {
      locale: lang === 'lv' ? 'lv_LV' : 'en_AU',
      alternateLocale: lang === 'lv' ? 'en_AU' : 'lv_LV',
      url: `/${lang}`,
      siteName: SITE_NAME,
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!isLang(lang)) notFound()

  return <LanguageProvider initialLang={lang}>{children}</LanguageProvider>
}

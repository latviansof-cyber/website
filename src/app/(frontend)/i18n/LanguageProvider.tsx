'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, type ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { contentByLang, type SiteContent } from './content'
import { localizeHref, type Lang } from '@/lib/i18nRouting'

interface LanguageContextValue {
  lang: Lang
  setLang: (lang: Lang) => void
  toggleLang: () => void
  t: SiteContent
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({
  children,
  initialLang,
}: {
  children: ReactNode
  initialLang: Lang
}) {
  const router = useRouter()
  const pathname = usePathname()
  const lang = initialLang

  const setLang = useCallback(
    (next: Lang) => {
      const query = typeof window !== 'undefined' ? window.location.search : ''
      router.push(`${localizeHref(pathname, next)}${query}`)
    },
    [pathname, router],
  )

  const toggleLang = useCallback(() => {
    setLang(lang === 'en' ? 'lv' : 'en')
  }, [lang, setLang])

  useEffect(() => {
    document.documentElement.lang = lang === 'lv' ? 'lv' : 'en-AU'
  }, [lang])

  const value = useMemo<LanguageContextValue>(
    () => ({ lang, setLang, toggleLang, t: contentByLang[lang] }),
    [lang, setLang, toggleLang],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error('useLanguage must be used inside <LanguageProvider>')
  }
  return ctx
}

'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { contentByLang, type Lang, type SiteContent } from './content'

interface LanguageContextValue {
  lang: Lang
  setLang: (lang: Lang) => void
  toggleLang: () => void
  t: SiteContent
}

const STORAGE_KEY = 'dla.lang'

const LanguageContext = createContext<LanguageContextValue | null>(null)

function detectInitialLang(): Lang {
  if (typeof window === 'undefined') return 'en'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === 'en' || stored === 'lv') return stored
  const navLang = window.navigator.language?.toLowerCase() ?? ''
  if (navLang.startsWith('lv')) return 'lv'
  return 'en'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Start with 'en' on the server so HTML is deterministic; sync from storage on mount.
  const [lang, setLangState] = useState<Lang>('en')

  useEffect(() => {
    setLangState(detectInitialLang())
  }, [])

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, next)
      document.documentElement.lang = next
    }
  }, [])

  const toggleLang = useCallback(() => {
    setLang(lang === 'en' ? 'lv' : 'en')
  }, [lang, setLang])

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

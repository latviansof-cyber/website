'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { contentByLang, type Lang, type SiteContent } from './content'
import { LangSchema } from '@/lib/validation'

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
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    const parsed = LangSchema.safeParse(stored)
    if (parsed.success) return parsed.data
  } catch (error) {
    // Storage may be unavailable (private mode, Safari ITP, etc.)
    // eslint-disable-next-line no-console
    console.warn('[i18n] localStorage unavailable, falling back to navigator', error)
  }
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
    const parsed = LangSchema.safeParse(next)
    if (!parsed.success) {
      // eslint-disable-next-line no-console
      console.warn('[i18n] setLang received invalid value, ignoring', next)
      return
    }
    setLangState(parsed.data)
    try {
      window.localStorage.setItem(STORAGE_KEY, parsed.data)
      document.documentElement.lang = parsed.data
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('[i18n] failed to persist language preference', error)
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

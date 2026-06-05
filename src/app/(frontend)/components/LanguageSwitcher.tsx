'use client'

import { useLanguage } from '../i18n/LanguageProvider'
import type { Lang } from '../i18n/content'

const options: { value: Lang; label: string }[] = [
  { value: 'en', label: 'EN' },
  { value: 'lv', label: 'LV' },
]

export function LanguageSwitcher() {
  const { lang, setLang, t } = useLanguage()
  return (
    <div
      role="group"
      aria-label={t.footer.languageLabel}
      className="inline-flex items-center rounded-full border border-white/20 bg-white/5 p-1 text-xs font-semibold tracking-wide"
    >
      {options.map((opt) => {
        const active = opt.value === lang
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => setLang(opt.value)}
            aria-pressed={active}
            aria-label={`${t.footer.languageLabel}: ${opt.label}`}
            lang={opt.value}
            className={
              'rounded-full px-3 py-1 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300 ' +
              (active ? 'bg-amber-300 text-ink shadow-sm' : 'text-white/80 hover:text-white')
            }
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

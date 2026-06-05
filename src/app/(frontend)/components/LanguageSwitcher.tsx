'use client'

import { useLanguage } from '../i18n/LanguageProvider'
import type { Lang } from '../i18n/content'

export function LanguageSwitcher() {
  const { lang, setLang, t } = useLanguage()
  const options: { value: Lang; label: string }[] = [
    { value: 'en', label: 'EN' },
    { value: 'lv', label: 'LV' },
  ]
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
            lang={opt.value}
            className={
              'rounded-full px-3 py-1 transition-colors ' +
              (active
                ? 'bg-amber-300 text-slate-900 shadow-sm'
                : 'text-white/80 hover:text-white')
            }
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

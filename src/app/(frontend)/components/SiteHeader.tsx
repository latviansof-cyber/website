'use client'

import { useLanguage } from '../i18n/LanguageProvider'
import { LanguageSwitcher } from './LanguageSwitcher'

export function SiteHeader() {
  const { t } = useLanguage()
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-900/85 backdrop-blur supports-[backdrop-filter]:bg-slate-900/70">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-40 focus:rounded focus:bg-amber-300 focus:px-3 focus:py-1.5 focus:text-slate-900"
      >
        {t.nav.skipToContent}
      </a>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <a href="#top" className="group flex items-center gap-3">
          <span
            aria-hidden="true"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-300 text-slate-900 shadow-sm transition-transform group-hover:scale-105"
          >
            <span className="font-serif text-lg font-bold">DLA</span>
          </span>
          <span className="hidden flex-col leading-tight text-white sm:flex">
            <span className="text-sm font-semibold">Latvian Association of Darwin</span>
            <span className="text-xs text-white/70">Dārvinas Latviešu Apvienība</span>
          </span>
        </a>
        <nav aria-label="Primary" className="flex items-center gap-1 sm:gap-2">
          <ul className="hidden items-center gap-1 text-sm font-medium text-white/85 sm:flex">
            <li>
              <a
                href="#about"
                className="rounded-full px-3 py-2 transition-colors hover:bg-white/10 hover:text-white"
              >
                {t.nav.about}
              </a>
            </li>
            <li>
              <a
                href="#history"
                className="rounded-full px-3 py-2 transition-colors hover:bg-white/10 hover:text-white"
              >
                {t.nav.history}
              </a>
            </li>
            <li>
              <a
                href="#events"
                className="rounded-full px-3 py-2 transition-colors hover:bg-white/10 hover:text-white"
              >
                {t.nav.events}
              </a>
            </li>
          </ul>
          <LanguageSwitcher />
        </nav>
      </div>
      <nav aria-label="Primary mobile" className="border-t border-white/10 sm:hidden">
        <ul className="mx-auto flex max-w-6xl items-center justify-center gap-1 px-4 py-2 text-sm font-medium text-white/85">
          <li>
            <a href="#about" className="rounded-full px-3 py-1.5 hover:bg-white/10 hover:text-white">
              {t.nav.about}
            </a>
          </li>
          <li>
            <a href="#history" className="rounded-full px-3 py-1.5 hover:bg-white/10 hover:text-white">
              {t.nav.history}
            </a>
          </li>
          <li>
            <a href="#events" className="rounded-full px-3 py-1.5 hover:bg-white/10 hover:text-white">
              {t.nav.events}
            </a>
          </li>
        </ul>
      </nav>
    </header>
  )
}

'use client'

import { useLanguage } from '../i18n/LanguageProvider'
import { Container } from './ui/Container'
import { LanguageSwitcher } from './LanguageSwitcher'

const navItems = [
  { href: '#about', key: 'about' as const },
  { href: '#history', key: 'history' as const },
  { href: '#events', key: 'events' as const },
]

export function SiteHeader() {
  const { t } = useLanguage()
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/70 backdrop-blur-md supports-[backdrop-filter]:bg-ink/60">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:rounded-full focus:bg-amber-300 focus:px-3 focus:py-1.5 focus:text-sm focus:font-semibold focus:text-ink"
      >
        {t.nav.skipToContent}
      </a>
      <Container className="flex items-center justify-between gap-4 py-3 sm:py-4">
        <a href="#top" className="group flex items-center gap-3">
          <span
            aria-hidden="true"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-300 text-ink shadow-md transition-transform group-hover:scale-105"
          >
            <span className="font-serif text-lg font-bold">DLA</span>
          </span>
          <span className="hidden flex-col leading-tight text-white sm:flex">
            <span className="text-sm font-semibold tracking-wide">Latvian Association of Darwin</span>
            <span className="text-xs text-white/70">Dārvinas Latviešu Apvienība</span>
          </span>
        </a>

        <nav aria-label="Primary" className="flex items-center gap-1 sm:gap-3">
          <ul className="hidden items-center gap-1 text-sm font-medium text-white/85 sm:flex">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="rounded-full px-3 py-2 transition-colors hover:bg-white/10 hover:text-white"
                >
                  {t.nav[item.key]}
                </a>
              </li>
            ))}
          </ul>
          <LanguageSwitcher />
        </nav>
      </Container>

      <nav aria-label="Primary mobile" className="border-t border-white/10 sm:hidden">
        <ul className="mx-auto flex max-w-6xl items-center justify-center gap-1 px-4 py-2 text-sm font-medium text-white/85">
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="rounded-full px-3 py-1.5 transition-colors hover:bg-white/10 hover:text-white"
              >
                {t.nav[item.key]}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

'use client'

import Link from 'next/link'
import { useLanguage } from '../i18n/LanguageProvider'
import { Container } from './ui/Container'
import { LanguageSwitcher } from './LanguageSwitcher'

const navItems = [
  { href: '/#about', key: 'about' as const },
  { href: '/#history', key: 'history' as const },
  { href: '/#events', key: 'events' as const },
]
const donateCta = { href: '/donate', labelKey: 'donate' as const }

export function SiteHeader() {
  const { t } = useLanguage()
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 glass-panel-dark text-white shadow-lg transition-all duration-300">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:rounded-full focus:bg-sunset-gold focus:px-3 focus:py-1.5 focus:text-sm focus:font-semibold focus:text-ink"
      >
        {t.nav.skipToContent}
      </a>
      <Container className="flex items-center justify-between gap-4 py-3 sm:py-4">
        <a href="#top" className="group flex items-center gap-4">
          <img 
            src="/images/logo.png" 
            alt="DLA Logo" 
            className="h-14 w-auto drop-shadow-md transition-transform duration-300 group-hover:scale-105"
          />
          <span className="hidden flex-col leading-tight sm:flex">
            <span className="text-sm font-bold tracking-wide text-white drop-shadow-sm transition-colors group-hover:text-sunset-peach">
              Latvian Association of Darwin
            </span>
            <span className="text-xs text-white/80 font-medium tracking-wide">
              Dārvinas Latviešu Apvienība
            </span>
          </span>
        </a>

        <nav aria-label="Primary" className="flex items-center gap-2 sm:gap-4">
          <ul className="hidden items-center gap-2 text-sm font-semibold text-white/90 sm:flex">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="rounded-full px-4 py-2 transition-all duration-200 hover:bg-white/20 hover:text-white hover:shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                >
                  {t.nav[item.key]}
                </a>
              </li>
            ))}
          </ul>
          <Link
            href={donateCta.href}
            aria-label={t.nav[donateCta.labelKey]}
            data-testid="nav-donate"
            className="group inline-flex items-center gap-1.5 rounded-full bg-sunset-orange px-4 py-2 text-sm font-bold text-ink shadow-sm transition-all duration-200 hover:bg-sunset-gold hover:shadow-[0_0_18px_rgba(249,115,22,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.2}
              className="h-4 w-4 transition-transform group-hover:scale-110"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
              />
            </svg>
            <span className="hidden sm:inline">{t.nav[donateCta.labelKey]}</span>
            <span className="sr-only sm:hidden">{t.nav[donateCta.labelKey]}</span>
          </Link>
          <div className="pl-2 sm:border-l sm:border-white/20">
            <LanguageSwitcher />
          </div>
        </nav>
      </Container>

      <nav aria-label="Primary mobile" className="border-t border-white/10 sm:hidden bg-ink/50 backdrop-blur-md">
        <ul className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white/90">
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="rounded-full px-4 py-2 transition-colors hover:bg-white/20 hover:text-white"
              >
                {t.nav[item.key]}
              </a>
            </li>
          ))}
          <li>
            <Link
              href={donateCta.href}
              aria-label={t.nav[donateCta.labelKey]}
              data-testid="nav-donate-mobile"
              className="inline-flex items-center gap-1.5 rounded-full bg-sunset-orange px-4 py-2 font-bold text-ink shadow-sm transition-colors hover:bg-sunset-gold"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.2}
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                />
              </svg>
              {t.nav[donateCta.labelKey]}
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}

// TODO(DLA-203): the brand mark ("DLA"), association name and tagline are hard-coded here.
//   Once the `SiteSettings` global exists in Payload (DLA-203), these should be fetched
//   from there so non-developers can update them via the admin panel.

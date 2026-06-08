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
        </ul>
      </nav>
    </header>
  )
}

// TODO(DLA-203): the brand mark ("DLA"), association name and tagline are hard-coded here.
//   Once the `SiteSettings` global exists in Payload (DLA-203), these should be fetched
//   from there so non-developers can update them via the admin panel.

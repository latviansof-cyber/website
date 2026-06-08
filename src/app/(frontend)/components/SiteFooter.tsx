'use client'

import { useLanguage } from '../i18n/LanguageProvider'
import { Container } from './ui/Container'

export function SiteFooter() {
  const { t } = useLanguage()
  const year = new Date().getFullYear()
  return (
    <footer className="bg-ink text-white">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {/* Column 1: Brand */}
        <div>
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-300 font-serif text-lg font-bold text-ink"
            >
              DLA
            </span>
            <p className="font-serif text-base font-semibold leading-snug">{t.footer.tagline}</p>
          </div>
          <p className="mt-4 text-sm text-white/70">{t.footer.address}</p>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
            {t.footer.quickLinks}
          </h2>
          <ul role="list" className="mt-3 space-y-2 text-sm text-white/80">
            <li>
              <a href="/#about" className="hover:text-amber-200">
                {t.nav.about}
              </a>
            </li>
            <li>
              <a href="/#history" className="hover:text-amber-200">
                {t.nav.history}
              </a>
            </li>
            <li>
              <a href="/#events" className="hover:text-amber-200">
                {t.nav.events}
              </a>
            </li>
            <li>
              <a href="/donate" className="hover:text-amber-200">
                {t.nav.donate}
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3: Events */}
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
            {t.nav.events}
          </h2>
          <ul role="list" className="mt-3 space-y-2 text-sm text-white/80">
            {t.events.items.slice(0, 3).map((event) => (
              <li key={event.id}>
                <a href="/#events" className="hover:text-amber-200">
                  {event.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Contact */}
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
            {t.footer.contactTitle}
          </h2>
          <ul role="list" className="mt-3 space-y-2 text-sm text-white/80">
            <li>
              <a href="mailto:hello@darwinlatvians.org" className="hover:text-amber-200">
                hello@darwinlatvians.org
              </a>
            </li>
          </ul>
        </div>
      </Container>
      <div className="border-t border-white/10">
        <Container className="flex flex-col items-start justify-between gap-2 py-4 text-xs text-white/60 sm:flex-row sm:items-center">
          <p>© {year} Latvian Association of Darwin. {t.footer.rights}</p>
          <p>Built with Next.js + Tailwind CSS</p>
        </Container>
      </div>
    </footer>
  )
}
'use client'

import { useLanguage } from '../i18n/LanguageProvider'

export function SiteFooter() {
  const { t } = useLanguage()
  const year = new Date().getFullYear()
  return (
    <footer className="bg-slate-900 text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 sm:grid-cols-2 lg:grid-cols-3 lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-300 font-serif text-lg font-bold text-slate-900"
            >
              DLA
            </span>
            <p className="font-serif text-base font-semibold leading-snug">
              {t.footer.tagline}
            </p>
          </div>
          <p className="mt-4 text-sm text-white/70">{t.footer.address}</p>
        </div>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
            {t.nav.events}
          </h2>
          <ul role="list" className="mt-3 space-y-2 text-sm text-white/80">
            {t.events.items.slice(0, 3).map((event) => (
              <li key={event.id}>
                <a
                  href="#events"
                  className="hover:text-amber-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
                >
                  {event.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
            {t.footer.contact}
          </h2>
          <ul role="list" className="mt-3 space-y-2 text-sm text-white/80">
            <li>
              <a
                href="mailto:hello@darwinlatvians.org"
                className="hover:text-amber-200"
              >
                hello@darwinlatvians.org
              </a>
            </li>
            <li>
              <a href="#about" className="hover:text-amber-200">
                {t.nav.about}
              </a>
            </li>
            <li>
              <a href="#history" className="hover:text-amber-200">
                {t.nav.history}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-2 px-4 py-4 text-xs text-white/60 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <p>
            © {year} Latvian Association of Darwin. {t.footer.rights}
          </p>
          <p>Built with Next.js + Tailwind CSS</p>
        </div>
      </div>
    </footer>
  )
}

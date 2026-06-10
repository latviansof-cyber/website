'use client'

import Link from 'next/link'
import { useLanguage } from '../i18n/LanguageProvider'
import { Container } from './ui/Container'
import type { FooterContent } from '@/lib/footer'

export function SiteFooter({ footer }: { footer: FooterContent }) {
  const { lang, t } = useLanguage()
  const year = new Date().getFullYear()
  const content = footer[lang]
  const items = footer.items

  return (
    <footer className="bg-ink text-white" itemScope itemType="https://schema.org/Organization">
      <meta itemProp="name" content="Latvian Association of Darwin" />
      <meta itemProp="alternateName" content="Dārvinas Latviešu Apvienība" />
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-3">
        {/* Column 1: Brand */}
        <div>
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-300 font-serif text-lg font-bold text-ink"
            >
              DLA
            </span>
            <p className="font-serif text-base font-semibold leading-snug">{content.tagline}</p>
          </div>
          <p className="mt-4 text-sm text-white/70" itemProp="address">
            {content.address}
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
            {t.footer.quickLinks}
          </h2>
          <ul role="list" className="mt-3 space-y-2 text-sm text-white/80">
            {items.map((item, idx) => (
              <li key={idx}>
                <Link
                  href={item.href}
                  target={item.newTab ? '_blank' : undefined}
                  rel={item.newTab ? 'noopener noreferrer' : undefined}
                  className="hover:text-amber-200"
                >
                  {item[lang]}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Contact */}
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
            {t.footer.contactTitle}
          </h2>
          <ul role="list" className="mt-3 space-y-2 text-sm text-white/80">
            <li>
              <a
                href="mailto:hello@darwinlatvians.org"
                className="hover:text-amber-200"
                itemProp="email"
              >
                hello@darwinlatvians.org
              </a>
            </li>
          </ul>
        </div>
      </Container>
      <div className="border-t border-white/10">
        <Container className="flex flex-col items-start justify-between gap-2 py-4 text-xs text-white/60 sm:flex-row sm:items-center">
          <p>
            © {year} Latvian Association of Darwin. {content.rights}
          </p>
          <p>
            Found a bag?{' '}
            <a href="https://vasilkoff.com/contact-us#report" rel="noreferrer" target="_blank">
              Report here
            </a>
          </p>
        </Container>
      </div>
    </footer>
  )
}

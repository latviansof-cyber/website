'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useLanguage } from '../i18n/LanguageProvider'
import { Container } from './ui/Container'
import { IconHeart } from './ui/IconHeart'
import type { SiteSettingsContent } from '@/lib/siteSettings'
import type { FooterContent } from '@/lib/footer'
import { localizeHref } from '@/lib/i18nRouting'

export function SiteFooter({
  footer,
  siteSettings,
}: {
  footer: FooterContent
  siteSettings?: SiteSettingsContent
}) {
  const { lang, t } = useLanguage()
  const year = new Date().getFullYear()
  const content = footer[lang]
  const items = footer.items || []

  const contactEmail = siteSettings?.en.contactEmail ?? 'hello@latviansofdarwin.org.au'

  // Divide menu items between Quick Links and Resources
  const quickLinks = items.length > 0 ? items.slice(0, 4) : [
    { href: '/about', en: t.nav.about, lv: t.nav.about },
    { href: '/history', en: t.nav.history, lv: t.nav.history },
    { href: '/#events', en: t.nav.events, lv: t.nav.events },
    { href: '/donate', en: t.nav.donate, lv: t.nav.donate },
  ]

  const resourceLinks = items.length > 4 ? items.slice(4) : [
    { href: '/donate', en: t.nav.donate, lv: t.nav.donate },
    { href: '/privacy', en: 'Privacy Policy', lv: 'Privātuma politika' },
    { href: '/terms', en: 'Terms & Conditions', lv: 'Lietošanas noteikumi' },
    { href: '/eula', en: 'EULA', lv: 'EULA' },
  ]

  const socialLinks = siteSettings?.socialLinks?.length ? siteSettings.socialLinks : [
    { platform: 'Facebook', url: 'https://facebook.com' },
    { platform: 'Instagram', url: 'https://instagram.com' },
  ]

  return (
    <footer className="bg-ink text-white" itemScope itemType="https://schema.org/Organization">
      <meta
        itemProp="name"
        content={siteSettings?.en.associationName ?? 'Latvian Association of Darwin'}
      />
      <meta
        itemProp="alternateName"
        content={siteSettings?.lv.associationName ?? 'Dārvinas Latviešu Apvienība'}
      />
      
      {/* Top dual-accent bar (Latvian carmine red & NT sunset gold) */}
      <div className="h-1.5 w-full bg-gradient-to-r from-latvian-red via-sunset-gold to-latvian-red" />

      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {/* Column 1: Brand */}
        <div className="space-y-4">
          <Link href={localizeHref('/', lang)} className="inline-flex items-center gap-3 group">
            <span className="flex size-14 items-center justify-center rounded-full border border-white/30 bg-white/10 p-1 shadow-[0_8px_24px_rgba(122,34,49,0.35)] backdrop-blur-sm transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/images/logo.png"
                alt="Latvian Association of Darwin logo"
                width={44}
                height={44}
                className="h-full w-full rounded-full object-cover ring-1 ring-white/60"
              />
            </span>
            <span>
              <span className="block font-serif text-lg font-bold text-white tracking-tight leading-tight">DLA</span>
              <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">
                Darwin · NT
              </span>
            </span>
          </Link>
          <p className="text-sm leading-relaxed text-white/80" itemProp="description">
            {content.tagline}
          </p>
          <p className="text-xs text-white/60" itemProp="address">
            {content.address}
          </p>
          
          {/* Social Links Buttons */}
          <div className="pt-1 flex items-center gap-2.5">
            {socialLinks.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.platform}
                className="flex size-9 items-center justify-center rounded-full bg-white/10 text-white/80 ring-1 ring-white/20 transition-all duration-200 hover:bg-sunset-gold hover:text-ink hover:scale-110 hover:ring-sunset-gold"
              >
                {link.platform.toLowerCase().includes('facebook') ? (
                  <svg className="size-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                ) : link.platform.toLowerCase().includes('instagram') ? (
                  <svg className="size-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="size-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                  </svg>
                )}
              </a>
            ))}
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-sunset-gold">
            {t.footer.quickLinks}
          </h2>
          <ul role="list" className="space-y-2.5 text-sm">
            {quickLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={localizeHref(item.href, lang)}
                  target={item.newTab ? '_blank' : undefined}
                  rel={item.newTab ? 'noopener noreferrer' : undefined}
                  className="text-white/80 transition-colors duration-150 hover:text-sunset-gold"
                >
                  {item[lang]}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Resources */}
        <div>
          <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-sunset-gold">
            {t.footer.resources || (lang === 'lv' ? 'Resursi' : 'Resources')}
          </h2>
          <ul role="list" className="space-y-2.5 text-sm">
            {resourceLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={localizeHref(item.href, lang)}
                  target={item.newTab ? '_blank' : undefined}
                  rel={item.newTab ? 'noopener noreferrer' : undefined}
                  className="text-white/80 transition-colors duration-150 hover:text-sunset-gold"
                >
                  {item[lang]}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Get Involved & Contact */}
        <div>
          <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-sunset-gold">
            {t.footer.getInvolved || t.footer.contactTitle}
          </h2>
          <p className="mb-4 text-sm leading-relaxed text-white/80">
            {t.footer.getInvolvedText || (lang === 'lv'
              ? 'Neatkarīgi no tā, vai jums ir latviešu izcelsme, vai vēlaties pievienoties mūsu kopienai, jūs vienmēr esat laipni gaidīti.'
              : 'Whether you have Latvian heritage or want to connect with a vibrant community, there is always a place for you.')}
          </p>
          <div className="mb-5 space-y-2">
            <a
              href={`mailto:${contactEmail}`}
              className="flex items-center gap-2 text-sm text-white/90 transition-colors duration-150 hover:text-sunset-gold"
              itemProp="email"
            >
              <svg className="size-4 shrink-0 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5A2.25 2.25 0 012.25 17.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5H4.5a2.25 2.25 0 00-2.25 2.25m19.5 0-9.75 6.75L2.25 6.75" />
              </svg>
              <span>{contactEmail}</span>
            </a>
          </div>
          <Link
            href={localizeHref('/donate', lang)}
            className="group inline-flex items-center gap-1.5 rounded-full bg-sunset-gold px-5 py-2 text-sm font-bold text-ink shadow-sm transition-all duration-200 hover:bg-amber-300 hover:shadow-md hover:scale-105 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
          >
            <IconHeart className="h-4 w-4 transition-transform group-hover:scale-110" />
            <span>{t.nav.donate}</span>
          </Link>
        </div>
      </Container>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-3 py-6 text-xs text-white/70 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <p>
              © 2023–{year} {siteSettings?.en.associationName ?? 'Latvian Association of Darwin'}. {content.rights}
            </p>
            <p className="text-white/50">
              {t.footer.incorporatedSince || (lang === 'lv'
                ? 'Reģistrēta asociācija no 2023. gada 22. oktobra'
                : 'Incorporated Entity from 22 October 2023')}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-white/70">
            <Link href={localizeHref('/privacy', lang)} className="transition hover:text-sunset-gold">
              {lang === 'lv' ? 'Privātuma politika' : 'Privacy Policy'}
            </Link>
            <Link href={localizeHref('/terms', lang)} className="transition hover:text-sunset-gold">
              {lang === 'lv' ? 'Lietošanas noteikumi' : 'Terms & Conditions'}
            </Link>
            <Link href={localizeHref('/eula', lang)} className="transition hover:text-sunset-gold">
              EULA
            </Link>
            <a
              href="https://abr.business.gov.au/ABN/View?abn=25545712911"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-sunset-gold"
            >
              ABN 25 545 712 911
            </a>
            <span>·</span>
            <a
              href="https://vasilkoff.com/contact-us#report"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 transition hover:text-sunset-gold"
            >
              {lang === 'lv' ? 'Ziņot par kļūdu' : 'Report a bug'}
            </a>
          </div>
        </Container>
      </div>
    </footer>
  )
}


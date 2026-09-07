/**
 * Bilingual Site Footer Component
 *
 * Structure mirrors the production SiteFooter: brand column, footer.items
 * split between Quick Links (first 4) and Resources (rest), Get Involved
 * column with contact email + donate CTA, and the bottom legal bar.
 */

import { html, raw } from 'hono/html'
import type { FooterData, FooterItem, SiteSettingsData } from './utils/content'

const FB_ICON =
  '<path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd" />'
const IG_ICON =
  '<path fill-rule="evenodd" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" clip-rule="evenodd" />'
const HEART_ICON =
  '<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>'

export function renderFooter(lang: 'en' | 'lv', footer: FooterData, settings: SiteSettingsData) {
  const year = new Date().getFullYear()
  const isLv = lang === 'lv'
  const assocNameEn = settings.associationName_en || 'Latvian Association of Darwin'
  const assocNameLv = settings.associationName_lv || 'Dārvinas Latviešu Apvienība'
  const tagline = (isLv ? footer.tagline_lv : footer.tagline_en) || ''
  const address = (isLv ? footer.address_lv : footer.address_en) || ''
  const rights = (isLv ? footer.rights_lv : footer.rights_en) || 'All rights reserved.'
  const contactEmail = settings.contactEmail || 'hello@latviansofdarwin.org.au'

  const headings = {
    quickLinks: isLv ? 'Ātrās saites' : 'Quick Links',
    resources: isLv ? 'Resursi' : 'Resources',
    getInvolved: isLv ? 'Iesaisties' : 'Get Involved',
  }
  const getInvolvedText = isLv
    ? 'Neatkarīgi no tā, vai jums ir latviešu izcelsme, vai vēlaties pievienoties mūsu kopienai, jūs vienmēr esat laipni gaidīti mūsu apvienībā.'
    : 'Whether you have Latvian heritage or want to connect with a vibrant community, there is always a place for you in our association.'
  const incorporatedSince = isLv
    ? 'Reģistrēta asociācija no 2023. gada 22. oktobra'
    : 'Incorporated Entity from 22 October 2023'
  const reportBug = isLv ? 'Ziņot par kļūdu' : 'Report a bug'
  const donateLabel = isLv ? 'Ziedot' : 'Donate'

  const items = footer.items || []
  const defaultQuick = [
    { href: '/about', en: 'About', lv: 'Par mums', newTab: false },
    { href: '/history', en: 'History', lv: 'Vēsture', newTab: false },
    { href: '/#events', en: 'Events', lv: 'Pasākumi', newTab: false },
    { href: '/donate', en: 'Donate', lv: 'Ziedot', newTab: false },
  ]
  const defaultResources = [
    { href: '/privacy', en: 'Privacy Policy', lv: 'Privātuma politika', newTab: false },
    { href: '/terms', en: 'Terms & Conditions', lv: 'Lietošanas noteikumi', newTab: false },
    { href: '/eula', en: 'EULA', lv: 'EULA', newTab: false },
  ]
  const quickLinks = items.length > 0 ? items.slice(0, 4) : defaultQuick
  const resourceLinks = items.length > 0 ? items.slice(4) : defaultResources

  function localize(href: string): string {
    if (href.startsWith('http') || href.startsWith('mailto:')) return href
    if (href.startsWith('/#')) return `/${lang}${href.substring(1)}`
    const clean = href.replace(/^\/(?:en|lv)\/?/, '').replace(/^\//, '')
    return clean ? `/${lang}/${clean}` : `/${lang}`
  }

  function renderLink(item: FooterItem) {
    const label = (isLv ? item.lv : item.en) || item.href
    return html`
      <li>
        <a
          href="${localize(item.href)}"
          ${item.newTab ? 'target="_blank" rel="noopener noreferrer"' : ''}
          class="text-white/80 transition-colors duration-150 hover:text-sunset-gold"
        >
          ${label}
        </a>
      </li>
    `
  }

  const socialLinks =
    settings.socialLinks && settings.socialLinks.length > 0
      ? settings.socialLinks
      : [
          { platform: 'Facebook', url: 'https://facebook.com' },
          { platform: 'Instagram', url: 'https://instagram.com' },
        ]

  const logoUrl = '/files/uploads/e9cd9febfcf6d193954bc.png' // mirrored /images/logo.png

  return html`
    <footer class="bg-ink text-white" itemscope itemtype="https://schema.org/Organization">
      <meta itemprop="name" content="${assocNameEn}" />
      <meta itemprop="alternateName" content="${assocNameLv}" />

      <!-- Top dual-accent bar -->
      <div class="h-1.5 w-full bg-gradient-to-r from-latvian-red via-sunset-gold to-latvian-red"></div>

      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <!-- Column 1: Brand -->
        <div class="space-y-4">
          <a href="/${lang}#top" class="inline-flex items-center gap-3 group">
            <span class="flex size-14 items-center justify-center rounded-full border border-white/30 bg-white/10 p-1 shadow-[0_8px_24px_rgba(122,34,49,0.35)] backdrop-blur-sm transition-transform duration-300 group-hover:scale-105">
              <img
                src="${logoUrl}"
                alt="Latvian Association of Darwin logo"
                width="44"
                height="44"
                class="h-full w-full rounded-full object-cover ring-1 ring-white/60"
              />
            </span>
            <span>
              <span class="block font-serif text-lg font-bold text-white tracking-tight leading-tight">DLA</span>
              <span class="block text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">
                Darwin · NT
              </span>
            </span>
          </a>
          ${tagline
            ? html`<p class="text-sm leading-relaxed text-white/80" itemprop="description">${tagline}</p>`
            : ''}
          ${address
            ? html`<p class="text-xs text-white/60" itemprop="address">${address}</p>`
            : ''}

          <!-- Social Links -->
          <div class="pt-1 flex items-center gap-2.5">
            ${socialLinks.map((link) => {
              const isFacebook = link.platform.toLowerCase().includes('facebook')
              return html`
                <a
                  href="${link.url}"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="${link.platform}"
                  class="flex size-9 items-center justify-center rounded-full bg-white/10 text-white/80 ring-1 ring-white/20 transition-all duration-200 hover:bg-sunset-gold hover:text-ink hover:scale-110 hover:ring-sunset-gold"
                >
                  <svg class="size-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    ${isFacebook ? html`${raw(FB_ICON)}` : html`${raw(IG_ICON)}`}
                  </svg>
                </a>
              `
            })}
          </div>
        </div>

        <!-- Column 2: Quick Links -->
        <div>
          <h2 class="mb-4 text-xs font-bold uppercase tracking-widest text-sunset-gold">${headings.quickLinks}</h2>
          <ul role="list" class="space-y-2.5 text-sm">
            ${quickLinks.map(renderLink)}
          </ul>
        </div>

        <!-- Column 3: Resources -->
        <div>
          <h2 class="mb-4 text-xs font-bold uppercase tracking-widest text-sunset-gold">${headings.resources}</h2>
          <ul role="list" class="space-y-2.5 text-sm">
            ${resourceLinks.map(renderLink)}
          </ul>
        </div>

        <!-- Column 4: Get Involved & Contact -->
        <div>
          <h2 class="mb-4 text-xs font-bold uppercase tracking-widest text-sunset-gold">${headings.getInvolved}</h2>
          <p class="mb-4 text-sm leading-relaxed text-white/80">
            ${getInvolvedText}
          </p>
          <div class="mb-5 space-y-2">
            <a
              href="mailto:${contactEmail}"
              class="flex items-center gap-2 text-sm text-white/90 transition-colors duration-150 hover:text-sunset-gold"
              itemprop="email"
            >
              <svg class="size-4 shrink-0 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5A2.25 2.25 0 012.25 17.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5H4.5a2.25 2.25 0 00-2.25 2.25m19.5 0-9.75 6.75L2.25 6.75" />
              </svg>
              <span>${contactEmail}</span>
            </a>
          </div>
          <a
            href="/${lang}/donate"
            class="group inline-flex items-center gap-1.5 rounded-full bg-sunset-gold px-5 py-2 text-sm font-bold text-ink shadow-sm transition-all duration-200 hover:bg-amber-300 hover:shadow-md hover:scale-105 active:scale-95"
          >
            <svg class="h-4 w-4 transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">${raw(HEART_ICON)}</svg>
            <span>${donateLabel}</span>
          </a>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="border-t border-white/10">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-3 py-6 text-xs text-white/70 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex flex-col gap-1">
            <p>© 2023–${year} ${assocNameEn}. ${rights}</p>
            <p class="text-white/50">${incorporatedSince}</p>
          </div>
          <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-white/70">
            <a href="/${lang}/privacy" class="transition hover:text-sunset-gold">
              ${isLv ? 'Privātuma politika' : 'Privacy Policy'}
            </a>
            <a href="/${lang}/terms" class="transition hover:text-sunset-gold">
              ${isLv ? 'Lietošanas noteikumi' : 'Terms & Conditions'}
            </a>
            <a href="/${lang}/eula" class="transition hover:text-sunset-gold">EULA</a>
            <a href="https://abr.business.gov.au/ABN/View?abn=25545712911" target="_blank" rel="noopener noreferrer" class="transition hover:text-sunset-gold">
              ABN 25 545 712 911
            </a>
            <span>·</span>
            <a href="https://vasilkoff.com/contact-us#report" target="_blank" rel="noreferrer" class="transition hover:text-sunset-gold">
              ${reportBug}
            </a>
          </div>
        </div>
      </div>
    </footer>
  `
}

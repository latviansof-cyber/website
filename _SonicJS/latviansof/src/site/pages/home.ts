/**
 * Homepage Template for SonicJS
 *
 * Production-equivalent sections in order: Hero, Page Cards (Explore),
 * Events (Community Calendar), Support Association, Trusted Partners.
 * Copy mirrors the live Payload frontend; content (events, pages, settings)
 * is data-driven from the migrated documents.
 */

import { html } from 'hono/html'
import { resolveMediaUrl } from '../utils/content'
import { plainText } from '../utils/format'
import type { EventData, PageData, SiteSettingsData } from '../utils/content'

export interface HomeProps {
  lang: 'en' | 'lv'
  pages: PageData[]
  events: EventData[]
  settings: SiteSettingsData
}

// Mirrored production images (deterministic R2 keys from the migration script).
const IMG_HERO = '/files/uploads/87a286d39839779b38c5d.webp' // /images/img1.webp
const IMG_BY_SLUG: Record<string, string> = {
  history: '/files/uploads/9cb8354371d97d91120d1.jpg', // gathering2.jpg
  community: '/files/uploads/87a286d39839779b38c5d.webp', // img1.webp
  membership: '/files/uploads/3b09fa70a9e1a257df835.webp', // membership-welcome.webp
  culture: '/files/uploads/58a0b3d51187c368496cf.png', // culture.png
}

const SUPPORTERS: Array<{ url: string; alt: string; link: string }> = [
  { url: '/files/uploads/46760b71e54516e7ac3de.webp', alt: 'Australian Government', link: 'https://my.gov.au/' },
  { url: '/files/uploads/a94688d8024e0702cde65.webp', alt: 'NT Government', link: 'https://nt.gov.au/' },
  { url: '/files/uploads/ec2b805a29776b6a28b14.webp', alt: 'Australian Red Cross', link: 'https://www.redcross.org.au/places/offices/darwin/' },
  { url: '/files/uploads/00c83279589382d6763d8.webp', alt: 'Melaleuca Australia', link: 'https://melaleuca.org.au/' },
  { url: '/files/uploads/1534469e01ce9dccd6dc1.svg', alt: 'UAANT (Ukrainian Association of NT)', link: 'https://uaant.org.au/' },
]

const TONE_CHIP: Record<string, string> = {
  emerald: 'bg-emerald-100 text-emerald-800',
  amber: 'bg-amber-100 text-amber-800',
  sky: 'bg-sky-100 text-sky-800',
  rose: 'bg-rose-100 text-rose-800',
  violet: 'bg-violet-100 text-violet-800',
  slate: 'bg-slate-200 text-slate-700',
}

export function renderHomePage({ lang, pages, events, settings }: HomeProps) {
  const isLv = lang === 'lv'

  const copy = {
    heroEyebrow: isLv ? 'Dārvinas Latviešu Apvienība' : 'Latvian Association of Darwin Inc',
    heroTitle: isLv ? 'Dārvinas Latviešu Apvienība' : 'Latvian Association of Darwin Inc',
    heroSubtitle: isLv
      ? 'Apvienojot latviešus, latviešu pēcnācējus un Latvijas draugus Ziemeļu Teritorijā.'
      : 'Bringing together Latvians, Latvian descendants, and friends of Latvia in the Northern Territory.',
    heroPrimaryLabel: isLv ? 'Skatīt pasākumus' : 'See events',
    heroSecondaryLabel: isLv ? 'Par mums' : 'About us',
    joinLabel: isLv ? 'Pievienoties' : 'Join',
    eventsEyebrow: isLv ? 'Pasākumi' : 'Events',
    eventsTitle: isLv ? 'Tuvākie pasākumi' : 'Upcoming events',
    eventsIntro: isLv
      ? 'Uzziniet par mūsu kopienas norisēm. Pievienojieties kultūras sarīkojumos, saviesīgos pasākumos un citās tikšanās reizēs.'
      : "Find out what's happening in our community. Join us for cultural celebrations, social gatherings, and more.",
    exploreEyebrow: isLv ? 'Iepazīstiet mūs' : 'Explore',
    exploreTitle: isLv ? 'Apvienība un kopiena' : 'Association and community',
    exploreIntro: isLv
      ? 'Īss ievads svarīgākajās tēmās. Atveriet pilno lapu, lai uzzinātu vairāk.'
      : 'The Latvian Association of Darwin Inc was formally incorporated in 2023, but has been celebrating Latvian traditions and events well before then',
    seeFullInfo: isLv ? 'Skatīt pilnu informāciju' : 'See full info',
    upcoming: isLv ? 'Nākamais' : 'Upcoming',
    pastEvent: isLv ? 'Aizvadīts' : 'Past event',
    noEvents: isLv ? 'Pašlaik nav pieejamu pasākumu.' : 'No events currently available.',
    supportEyebrow: isLv ? 'Atbalstīt DLA' : 'Support DLA',
    supportTitle: isLv ? 'Palīdziet mūsu misijai plaukt' : 'Help Our Mission Thrive',
    supportBody: isLv
      ? 'Ikkatrs ziedojums — neatkarīgi no apjoma — palīdz mums atbalstīt ģimenes, saglabāt latviešu kultūras mantojumu un uzturēt kopienas tradīcijas dzīvas Ziemeļu Teritorijā.'
      : 'Every contribution — no matter the size — helps us welcome newcomers, support families, preserve Latvian heritage, and keep our community traditions alive in the Northern Territory.',
    zeroFees: isLv ? 'Bez komisijas caur PayID' : 'Zero fees via PayID',
    receipt: isLv ? 'Kvīts pēc pieprasījuma' : 'Tax receipt available',
    directToCommunity: isLv ? 'Tieši kopienas vajadzībām' : 'Direct to community',
    quickDonateAria: isLv ? 'Švidkais ziedojuma apjoma vyrob' : 'Quick donation amounts',
    payIdIntro: isLv ? 'Tiešais pārskaitījums caur PayID:' : 'Direct bank transfer via PayID:',
    zeroFeesShort: isLv ? 'bez komisijas maksas' : 'zero fees',
    allOptions: isLv ? 'Visas ziedošanas iespējas →' : 'All donation options →',
    partnersEyebrow: isLv ? 'Sadarbība & Kopiena' : 'Collaboration & Community',
    partnersTitle: isLv ? 'Uzticamie partneri' : 'Trusted Partners',
    partnersIntro: isLv
      ? 'Mēs sadarbojamies ar vietējām un nacionālajām organizācijām, lai sniegtu praktisku atbalstu mūsu kopienai.'
      : 'We collaborate with local and national organizations to deliver practical support for our community.',
  }

  const payIdEmail = settings.contactEmail || 'hello@latviansofdarwin.org.au'
  const quickAmounts = [25, 50, 100]
  const donationLink = `/${lang}/donate`

  return html`
    <!-- Hero Section -->
    <section id="top" aria-labelledby="hero-title" class="relative isolate overflow-hidden bg-ink text-white">
      <div class="absolute inset-0 -z-20">
        <img
          src="${IMG_HERO}"
          alt="Latvian Association of Darwin Community"
          class="h-full w-full object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-r from-ink/95 via-ink/80 to-ink/50"></div>
      </div>
      <div
        aria-hidden="true"
        class="absolute inset-0 -z-10 opacity-40 bg-[radial-gradient(circle_at_20%_40%,rgba(249,115,22,0.35),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(251,191,36,0.25),transparent_50%)]"
      ></div>

      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex min-h-[75vh] w-full items-center py-20">
        <div class="max-w-2xl text-white space-y-6">
          <p class="inline-flex rounded-full border border-white/35 bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-md shadow-sm">
            ${copy.heroEyebrow}
          </p>
          <h1 id="hero-title" class="font-serif text-4xl font-black leading-tight sm:text-5xl lg:text-6xl text-white text-balance drop-shadow-lg">
            ${copy.heroTitle}
          </h1>
          <p class="text-sm font-semibold uppercase tracking-[0.14em] text-sunset-gold sm:text-base">
            ${copy.heroSubtitle}
          </p>

          <div class="flex flex-wrap gap-3.5 pt-2">
            <a
              href="/${lang}#events"
              class="group inline-flex items-center rounded-full bg-sunset-gold hover:bg-amber-300 text-ink font-bold px-6 py-3 shadow-[0_0_20px_rgba(251,191,36,0.4)] transition-all duration-300 active:scale-95"
            >
              ${copy.heroPrimaryLabel}
              <span aria-hidden="true" class="ml-2 group-hover:translate-x-1 transition-transform inline-block">→</span>
            </a>
            <a
              href="/${lang}/about"
              class="inline-flex items-center rounded-full border border-white/70 text-white hover:bg-white/15 backdrop-blur-sm px-6 py-3 font-semibold transition-all duration-300"
            >
              ${copy.heroSecondaryLabel}
            </a>
            <a
              href="/${lang}/membership"
              class="group inline-flex items-center gap-2 rounded-full bg-sunset-gold text-ink font-bold px-6 py-3 shadow-md transition-all duration-300 hover:bg-amber-300 hover:scale-105 active:scale-95"
            >
              <svg class="h-4 w-4 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              ${copy.joinLabel}
            </a>
          </div>

          <div class="grid gap-3 pt-4 text-xs sm:text-sm font-medium text-white/90 sm:grid-cols-3">
            <div class="glass-panel-dark flex items-center justify-center gap-2 px-4 py-3 text-center rounded-xl border border-white/20 backdrop-blur-md hover:border-sunset-gold transition-colors shadow-md">
              <svg class="size-5 shrink-0 text-sunset-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM2.75 19a5.25 5.25 0 0 1 10.5 0M13 14.2A5.25 5.25 0 0 1 21.25 19" />
              </svg>
              <span>${isLv ? 'Visiem atvērta kopiena' : 'Open & Welcoming to All'}</span>
            </div>
            <div class="glass-panel-dark flex items-center justify-center gap-2 px-4 py-3 text-center rounded-xl border border-white/20 backdrop-blur-md hover:border-sunset-gold transition-colors shadow-md">
              <svg class="size-5 shrink-0 text-sunset-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 21V10m0 4c-4.25 0-7-2.75-7-7 4.25 0 7 2.75 7 7Zm0-4c0-4.25 2.75-7 7-7 0 4.25-2.75 7-7 7Z" />
              </svg>
              <span>${isLv ? 'Brīvprātīgo vadīta' : 'Volunteer Driven'}</span>
            </div>
            <div class="glass-panel-dark flex items-center justify-center gap-2 px-4 py-3 text-center rounded-xl border border-white/20 backdrop-blur-md hover:border-sunset-gold transition-colors shadow-md">
              <svg class="size-5 shrink-0 text-sunset-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 3.75v16.5M5 5h13l-2.3 3.5L18 12H5" />
              </svg>
              <span>${isLv ? 'Kultūras mantojums' : 'Preserving Latvian Heritage'}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Page Cards (Explore) -->
    <section id="about" aria-label="${copy.exploreTitle}" class="relative overflow-hidden py-24 sm:py-32 bg-slate-50/50">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        <div class="max-w-3xl flex flex-col items-start">
          <p class="text-sunset-red tracking-widest font-bold uppercase text-xs mb-4">${copy.exploreEyebrow}</p>
          <h2 class="font-serif text-4xl font-bold tracking-tight text-ink sm:text-5xl lg:text-6xl">${copy.exploreTitle}</h2>
          <div class="w-16 h-1 bg-gradient-to-r from-sunset-red to-sunset-gold mt-6 rounded-full"></div>
          <p class="mt-8 text-lg leading-relaxed text-ink-light sm:text-xl max-w-2xl font-medium">${copy.exploreIntro}</p>
        </div>

        <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          ${pages.map((page) => {
            const title = isLv ? page.title_lv : page.title_en
            const excerpt = isLv ? page.excerpt_lv : page.excerpt_en
            const isLogo = page.slug === 'history'
            const imgSrc = page.heroImage
              ? resolveMediaUrl(page.heroImage)
              : IMG_BY_SLUG[page.slug] || IMG_HERO
            return html`
              <article class="group flex h-full flex-col rounded-3xl border border-slate-100 bg-white/80 backdrop-blur-sm shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:bg-white overflow-hidden">
                <a href="/${lang}/${page.slug}" class="relative block h-48 sm:h-56 w-full overflow-hidden cursor-pointer bg-white" aria-label="${title || ''}">
                  <img
                    src="${imgSrc}"
                    alt="${title || ''}"
                    class="h-full w-full ${isLogo ? 'object-contain p-6 sm:p-8 transition-transform duration-700 group-hover:scale-105' : 'object-cover transition-transform duration-700 group-hover:scale-110'}"
                    loading="lazy"
                  />
                </a>
                <div class="p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 class="font-serif text-2xl font-bold leading-tight text-ink group-hover:text-sunset-red transition-colors duration-300">
                      <a href="/${lang}/${page.slug}">${title || ''}</a>
                    </h3>
                    <div class="mt-4 w-10 h-0.5 bg-slate-200 group-hover:bg-sunset-gold transition-colors duration-300"></div>
                    <p class="mt-4 line-clamp-3 text-base leading-relaxed text-ink-light font-medium">${excerpt || ''}</p>
                  </div>
                  <div class="pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 mt-6">
                    <a href="/${lang}/${page.slug}" class="inline-flex items-center gap-1 font-bold text-sunset-red hover:text-latvian-red transition-colors text-sm" aria-label="${copy.seeFullInfo}: ${title || ''}">
                      ${copy.seeFullInfo} →
                    </a>
                  </div>
                </div>
              </article>
            `
          })}
        </div>
      </div>
    </section>

    <!-- Events -->
    <section id="events" aria-label="${copy.eventsTitle}" class="py-24 sm:py-32 relative overflow-hidden bg-white">
      <div class="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-sunset-peach/50 to-white rounded-full blur-3xl opacity-60"></div>
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        <div class="max-w-3xl flex flex-col items-start">
          <p class="text-sunset-red tracking-widest font-bold uppercase text-xs mb-4">${copy.eventsEyebrow}</p>
          <h2 class="font-serif text-4xl font-bold tracking-tight text-ink sm:text-5xl lg:text-6xl">${copy.eventsTitle}</h2>
          <div class="w-16 h-1 bg-gradient-to-r from-sunset-red to-sunset-gold mt-6 rounded-full"></div>
          <p class="mt-8 text-lg leading-relaxed text-ink-light sm:text-xl max-w-2xl font-medium">${copy.eventsIntro}</p>
        </div>

        ${events.length === 0
          ? html`
              <div class="p-10 text-center rounded-3xl border border-slate-200 bg-slate-50/60">
                <p class="text-lg font-medium text-ink-light">${copy.noEvents}</p>
              </div>
            `
          : html`
              <ul role="list" class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                ${events.slice(0, 6).map((event) => {
                  const title = isLv ? event.title_lv : event.title_en
                  const body = isLv ? event.body_lv : event.body_en
                  const imgSrc = event.image ? resolveMediaUrl(event.image) : IMG_HERO
                  const dateObj = event.eventDate ? new Date(event.eventDate) : null
                  const hasDate = dateObj !== null && !Number.isNaN(dateObj.getTime())
                  const month = hasDate
                    ? dateObj!.toLocaleDateString(isLv ? 'lv-LV' : 'en-US', { month: 'short' }).toUpperCase()
                    : null
                  const day = hasDate ? dateObj!.getDate() : null
                  const year = hasDate ? dateObj!.getFullYear() : null
                  const isPast = hasDate ? dateObj!.getTime() < Date.now() : false
                  const tone = event.accentTone || 'rose'
                  const slugLabel = (event.slug || '').replace(/-/g, ' ')
                  const excerpt = plainText(body || '')
                  return html`
                    <li class="group flex h-full flex-col rounded-3xl border border-slate-100 bg-white/80 backdrop-blur-sm shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:bg-white overflow-hidden">
                      <a href="/${lang}/events/${event.slug}" class="relative block h-48 sm:h-56 w-full overflow-hidden cursor-pointer" aria-label="${title || ''}">
                        <img src="${imgSrc}" alt="${title || ''}" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                        <div class="absolute top-4 left-4 flex flex-wrap items-center gap-2 z-10">
                          <span class="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ${isPast ? 'bg-slate-200 text-slate-700' : 'bg-emerald-100 text-emerald-800'} shadow-md">
                            ${isPast ? copy.pastEvent : copy.upcoming}
                          </span>
                          ${slugLabel
                            ? html`
                                <span class="rounded-full px-3 py-1 font-bold tracking-wide shadow-md backdrop-blur-md bg-white/90 text-xs uppercase ${TONE_CHIP[tone]}">${slugLabel}</span>
                              `
                            : ''}
                        </div>
                        ${hasDate
                          ? html`
                              <div class="absolute top-4 right-4 flex flex-col items-center justify-center rounded-2xl bg-white/95 px-3 py-1.5 shadow-lg backdrop-blur-md border border-white/80 min-w-[54px]">
                                <span class="text-[10px] font-black uppercase tracking-wider text-sunset-red leading-none">${month}</span>
                                <span class="text-xl font-black text-ink leading-none mt-1">${day}</span>
                                <span class="text-[9px] font-bold text-slate-400 leading-none mt-0.5">${year}</span>
                              </div>
                            `
                          : ''}
                      </a>
                      <div class="p-8 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 class="font-serif text-2xl font-bold leading-tight text-ink group-hover:text-sunset-red transition-colors duration-300">
                            <a href="/${lang}/events/${event.slug}">${title || ''}</a>
                          </h3>
                          <div class="mt-4 w-10 h-0.5 bg-slate-200 group-hover:bg-sunset-gold transition-colors duration-300"></div>
                          ${excerpt
                            ? html`<p class="mt-4 line-clamp-3 text-base leading-relaxed text-ink-light font-medium">${excerpt}</p>`
                            : ''}
                        </div>
                        <div class="pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 mt-6">
                          <a href="/${lang}/events/${event.slug}" class="inline-flex items-center gap-1 font-bold text-sunset-red hover:text-latvian-red transition-colors text-sm" aria-label="${copy.seeFullInfo}: ${title || ''}">
                            ${copy.seeFullInfo} →
                          </a>
                          ${event.facebookUrl
                            ? html`
                                <a href="${event.facebookUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 rounded-full bg-[#1877F2]/10 px-3 py-1 text-xs font-bold text-[#1877F2] border border-[#1877F2]/20 hover:bg-[#1877F2] hover:text-white transition-colors">
                                  <svg class="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                  </svg>
                                  <span>Facebook</span>
                                </a>
                              `
                            : ''}
                        </div>
                      </div>
                    </li>
                  `
                })}
              </ul>
            `}
      </div>
    </section>

    <!-- Support Association -->
    <section class="py-12 bg-cream border-t border-ink/10" id="donate-mission">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="group relative overflow-hidden rounded-3xl border border-ink/10 bg-white p-8 sm:p-12 text-center shadow-xl transition-all duration-300 hover:shadow-2xl">
          <div class="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-latvian-red via-sunset-gold to-latvian-red"></div>
          <div class="mx-auto max-w-3xl">
            <span class="inline-block mb-3 text-xs font-bold uppercase tracking-[0.2em] text-sunset-orange">${copy.supportEyebrow}</span>
            <h2 class="font-serif text-3xl font-bold sm:text-4xl text-ink tracking-tight">${copy.supportTitle}</h2>
            <p class="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-ink/75">${copy.supportBody}</p>
          </div>

          <div class="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-semibold text-ink/70">
            <span class="flex items-center gap-1"><span class="text-emerald-600 font-bold">✓</span> ${copy.zeroFees}</span>
            <span class="flex items-center gap-1"><span class="text-emerald-600 font-bold">✓</span> ${copy.receipt}</span>
            <span class="flex items-center gap-1"><span class="text-emerald-600 font-bold">✓</span> ${copy.directToCommunity}</span>
          </div>

          <ul class="mt-6 flex flex-wrap justify-center gap-3" aria-label="${copy.quickDonateAria}">
            ${quickAmounts.map((amount) => html`
              <li>
                <a href="${donationLink}" aria-label="${isLv ? `Ziedot AU$${amount}` : `Donate AU$${amount}`}" class="inline-flex items-center justify-center rounded-full border border-ink/20 bg-cream px-5 py-2.5 text-sm font-bold text-ink shadow-sm transition-all duration-200 hover:border-sunset-gold hover:bg-sunset-gold hover:text-ink hover:scale-105 active:scale-95">
                  AU$${amount}
                </a>
              </li>
            `)}
            <li>
              <a href="${donationLink}" aria-label="${isLv ? 'Ziedot AU$500 vai vairāk' : 'Donate AU$500 or more'}" class="inline-flex items-center justify-center rounded-full bg-sunset-gold px-5 py-2.5 text-sm font-bold text-ink shadow-md transition-all duration-200 hover:bg-amber-300 hover:scale-105 active:scale-95">
                AU$500+
              </a>
            </li>
          </ul>

          <p class="mt-6 text-sm text-ink/70">
            ${copy.payIdIntro} <strong class="font-semibold text-sunset-orange">${payIdEmail}</strong> · ${copy.zeroFeesShort}
          </p>

          <div class="mt-6">
            <a href="${donationLink}" class="inline-flex items-center gap-2 rounded-full border border-ink/20 bg-white px-6 py-2.5 text-sm font-bold text-ink shadow-sm transition-all duration-200 hover:border-sunset-gold hover:bg-sunset-gold/10">
              ${copy.allOptions}
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Trusted Partners -->
    <section id="trusted-partners" class="py-16 bg-cream border-t border-ink/10">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span class="text-xs font-bold uppercase tracking-widest text-sunset-orange">${copy.partnersEyebrow}</span>
            <h2 class="font-serif text-3xl font-bold sm:text-4xl text-ink mt-1">${copy.partnersTitle}</h2>
          </div>
          <p class="max-w-md text-sm text-ink/70 leading-relaxed">${copy.partnersIntro}</p>
        </div>

        <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 md:gap-6">
          ${SUPPORTERS.map((supporter) => html`
            <a href="${supporter.link}" target="_blank" rel="noopener noreferrer" class="group flex aspect-[16/10] w-full items-center justify-center rounded-2xl border border-ink/10 bg-white p-3.5 sm:p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-sunset-gold hover:shadow-lg" title="${supporter.alt}">
              <img src="${supporter.url}" alt="${supporter.alt} logo" class="h-full max-h-24 sm:max-h-28 w-auto max-w-full object-contain transition-all duration-300 group-hover:scale-105" loading="lazy" />
            </a>
          `)}
        </div>
      </div>
    </section>
  `
}

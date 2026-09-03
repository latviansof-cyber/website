'use client'

import Image from 'next/image'
import { useLanguage } from '../i18n/LanguageProvider'
import { Container } from './ui/Container'
import { LinkButton } from './ui/Button'
import { IconHeart } from './ui/IconHeart'
import type { HomepageContent } from '@/lib/homepage'
import { localizeHref } from '@/lib/i18nRouting'

function HeroFeatureIcon({ type }: { type: 'community' | 'heritage' | 'volunteer' }) {
  if (type === 'community') {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM2.75 19a5.25 5.25 0 0 1 10.5 0M13 14.2A5.25 5.25 0 0 1 21.25 19"
        />
      </svg>
    )
  }

  if (type === 'volunteer') {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 21V10m0 4c-4.25 0-7-2.75-7-7 4.25 0 7 2.75 7 7Zm0-4c0-4.25 2.75-7 7-7 0 4.25-2.75 7-7 7Z"
        />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3.75v16.5M5 5h13l-2.3 3.5L18 12H5" />
    </svg>
  )
}

export function Hero({ homepage }: { homepage: HomepageContent }) {
  const { lang, t } = useLanguage()
  const content = homepage[lang]
  const heroImageSrc = homepage.heroImage || '/images/img1.webp'

  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden bg-ink text-white"
    >
      {/* Background Image */}
      <div className="absolute inset-0 -z-20">
        <Image
          src={heroImageSrc}
          alt="Latvian Association of Darwin Community"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Gradient Overlay mirroring uaant-website hero */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink/95 via-ink/80 to-ink/50" />
      </div>

      {/* Radial glow accents for NT warmth */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-40 bg-[radial-gradient(circle_at_20%_40%,rgba(249,115,22,0.35),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(251,191,36,0.25),transparent_50%)]"
      />

      <Container className="flex min-h-[75vh] w-full max-w-7xl items-center py-20">
        {/* Content Column */}
        <div className="max-w-2xl text-white space-y-6">
          {/* Eyebrow Badge */}
          <p className="inline-flex rounded-full border border-white/35 bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-md shadow-sm">
            {content.heroEyebrow}
          </p>

          {/* Main Title */}
          <h1
            id="hero-title"
            className="font-serif text-4xl font-black leading-tight sm:text-5xl lg:text-6xl text-white text-balance drop-shadow-lg"
          >
            {content.heroTitle}
          </h1>

          {/* Subtitle Accent */}
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-sunset-gold sm:text-base">
            {content.heroSubtitle}
          </p>

          {/* Action Buttons Group */}
          <div className="flex flex-wrap gap-3.5 pt-2">
            <LinkButton
              href={localizeHref(homepage.heroPrimaryHref, lang)}
              variant="primary"
              className="bg-sunset-gold hover:bg-amber-300 text-ink font-bold border-none shadow-[0_0_20px_rgba(251,191,36,0.4)] transition-all duration-300 active:scale-95"
            >
              {content.heroPrimaryLabel}
              <span
                aria-hidden="true"
                className="ml-2 group-hover:translate-x-1 transition-transform inline-block"
              >
                →
              </span>
            </LinkButton>

            <LinkButton
              href={localizeHref(homepage.heroSecondaryHref, lang)}
              variant="ghost"
              className="border border-white/70 text-white hover:bg-white/15 backdrop-blur-sm transition-all duration-300"
            >
              {content.heroSecondaryLabel}
            </LinkButton>

            <LinkButton
              href={localizeHref('/membership', lang)}
              variant="primary"
              className="bg-sunset-gold text-ink font-bold border-none shadow-md transition-all duration-300 hover:bg-amber-300 hover:scale-105 active:scale-95"
            >
              <svg className="h-4 w-4 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {lang === 'lv' ? 'Pievienoties' : 'Join'}
            </LinkButton>
          </div>

          {/* Glass Feature Chips Grid */}
          <div className="grid gap-3 pt-4 text-xs sm:text-sm font-medium text-white/90 sm:grid-cols-3">
            <div className="glass-panel-dark flex items-center justify-center gap-2 px-4 py-3 text-center rounded-xl border border-white/20 backdrop-blur-md hover:border-sunset-gold transition-colors shadow-md">
              <span className="size-5 shrink-0 text-sunset-gold">
                <HeroFeatureIcon type="community" />
              </span>
              <span>{lang === 'lv' ? 'Visiem atvērta kopiena' : 'Open & Welcoming to All'}</span>
            </div>
            <div className="glass-panel-dark flex items-center justify-center gap-2 px-4 py-3 text-center rounded-xl border border-white/20 backdrop-blur-md hover:border-sunset-gold transition-colors shadow-md">
              <span className="size-5 shrink-0 text-sunset-gold">
                <HeroFeatureIcon type="volunteer" />
              </span>
              <span>{lang === 'lv' ? 'Brīvprātīgo vadīta' : 'Volunteer Driven'}</span>
            </div>
            <div className="glass-panel-dark flex items-center justify-center gap-2 px-4 py-3 text-center rounded-xl border border-white/20 backdrop-blur-md hover:border-sunset-gold transition-colors shadow-md">
              <span className="size-5 shrink-0 text-sunset-gold">
                <HeroFeatureIcon type="heritage" />
              </span>
              <span>{lang === 'lv' ? 'Kultūras mantojums' : 'Preserving Latvian Heritage'}</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

'use client'

import { useLanguage } from '../i18n/LanguageProvider'
import { Container } from './ui/Container'
import { Eyebrow } from './ui/Eyebrow'
import { LinkButton } from './ui/Button'
import type { HomepageContent } from '@/lib/homepage'
import { localizeHref } from '@/lib/i18nRouting'

export function Hero({ homepage }: { homepage: HomepageContent }) {
  const { lang } = useLanguage()
  const content = homepage[lang]

  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden bg-ink text-white min-h-[90vh] flex flex-col justify-center"
    >
      {/* Decorative gradient + glow blobs to simulate a sunset */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-gradient-to-br from-ink via-sunset-red/90 to-sunset-orange/80"
      />
      {homepage.heroImage ? (
        <img
          src={homepage.heroImage}
          alt=""
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
      ) : null}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-70 bg-[radial-gradient(circle_at_50%_100%,rgba(251,191,36,0.6),transparent_60%),radial-gradient(circle_at_20%_80%,rgba(249,115,22,0.5),transparent_50%)]"
      />
      {/* Dark overlay at bottom for smooth transition */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-b from-transparent to-cream"
      />

      <Container className="relative flex flex-col items-center text-center gap-7 py-24 sm:py-32 lg:py-40 z-10">
        <div className="glass-panel-dark p-8 sm:p-12 rounded-3xl flex flex-col items-center gap-6 max-w-5xl mx-auto shadow-2xl border-white/20 transform transition-transform hover:scale-[1.01] duration-500">
          <Eyebrow className="text-sunset-gold tracking-widest uppercase font-semibold">
            {content.heroEyebrow}
          </Eyebrow>
          <h1
            id="hero-title"
            className="max-w-4xl text-balance font-serif text-5xl font-bold leading-[1.1] sm:text-7xl lg:text-8xl text-glow-orange"
          >
            {content.heroTitle}
          </h1>
          <p className="max-w-2xl text-pretty text-lg leading-relaxed text-white/90 sm:text-xl font-medium drop-shadow-md">
            {content.heroSubtitle}
          </p>
          <div className="flex flex-col gap-4 sm:flex-row mt-4">
            <LinkButton
              href={localizeHref(homepage.heroPrimaryHref, lang)}
              variant="primary"
              className="bg-sunset-orange hover:bg-sunset-gold text-ink font-bold border-none shadow-[0_0_15px_rgba(249,115,22,0.5)] hover:shadow-[0_0_25px_rgba(251,191,36,0.7)] transition-all duration-300"
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
              className="ring-white/40 text-white hover:bg-white/20 backdrop-blur-sm transition-all duration-300"
            >
              {content.heroSecondaryLabel}
            </LinkButton>
          </div>
        </div>
      </Container>
    </section>
  )
}

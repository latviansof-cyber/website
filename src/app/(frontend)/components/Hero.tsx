'use client'

import { useLanguage } from '../i18n/LanguageProvider'
import { Container } from './ui/Container'
import { Eyebrow } from './ui/Eyebrow'
import { LinkButton } from './ui/Button'

export function Hero() {
  const { t } = useLanguage()
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden bg-ink text-white"
    >
      {/* Decorative gradient + glow blobs */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-br from-ink via-slate-900 to-emerald-950"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-60"
        style={{
          backgroundImage:
            'radial-gradient(circle at 15% 20%, rgba(252,211,77,0.30), transparent 45%), radial-gradient(circle at 85% 35%, rgba(16,185,129,0.30), transparent 50%)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-b from-transparent to-ink"
      />

      <Container className="relative flex flex-col items-start gap-7 py-24 sm:py-32 lg:py-40">
        <Eyebrow tone="amber">{t.hero.eyebrow}</Eyebrow>
        <h1
          id="hero-title"
          className="max-w-4xl text-balance font-serif text-4xl font-bold leading-[1.05] sm:text-6xl lg:text-7xl"
        >
          {t.hero.title}
        </h1>
        <p className="max-w-2xl text-pretty text-base leading-relaxed text-white/80 sm:text-lg">
          {t.hero.subtitle}
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <LinkButton href="#events" variant="primary">
            {t.hero.cta}
            <span aria-hidden="true">→</span>
          </LinkButton>
          <LinkButton href="#about" variant="ghost" className="ring-white/30 text-white hover:bg-white/10">
            {t.nav.about}
          </LinkButton>
        </div>
      </Container>
    </section>
  )
}

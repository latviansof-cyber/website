'use client'

import { useLanguage } from '../i18n/LanguageProvider'

export function Hero() {
  const { t } = useLanguage()
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden bg-slate-900 text-white"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(252,211,77,0.25), transparent 45%), radial-gradient(circle at 80% 30%, rgba(16,185,129,0.25), transparent 50%)',
        }}
      />
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
        <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-amber-300" />
          {t.hero.eyebrow}
        </p>
        <h1
          id="hero-title"
          className="max-w-3xl text-balance font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl"
        >
          {t.hero.title}
        </h1>
        <p className="max-w-2xl text-pretty text-base leading-relaxed text-white/80 sm:text-lg">
          {t.hero.subtitle}
        </p>
        <a
          href="#events"
          className="inline-flex items-center gap-2 rounded-full bg-amber-300 px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-amber-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
        >
          {t.hero.cta}
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  )
}

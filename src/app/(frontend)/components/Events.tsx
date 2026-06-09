'use client'

import { useLanguage } from '../i18n/LanguageProvider'
import { Container } from './ui/Container'
import { Section } from './ui/Section'
import { Eyebrow } from './ui/Eyebrow'
import { Chip } from './ui/Chip'
import type { WebsiteEvent } from '@/lib/events'

export function Events({ events }: { events: WebsiteEvent[] }) {
  const { lang, t } = useLanguage()
  return (
    <Section
      id="events"
      ariaLabel={t.events.title}
      tone="plain"
      className="py-24 sm:py-32 relative overflow-hidden bg-white"
    >
      {/* Decorative background element */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-sunset-peach/50 to-white rounded-full blur-3xl opacity-60" />

      <Container className="relative z-10">
        <div className="max-w-3xl flex flex-col items-start">
          <Eyebrow className="text-sunset-orange tracking-widest font-bold uppercase mb-4">
            03 — {t.events.title}
          </Eyebrow>
          <h2
            id="events-title"
            className="font-serif text-4xl font-bold tracking-tight text-ink sm:text-5xl lg:text-6xl"
          >
            {t.events.title}
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-sunset-red to-sunset-gold mt-6 rounded-full" />
          <p className="mt-8 text-pretty text-lg leading-relaxed text-ink-light sm:text-xl max-w-2xl font-medium">
            {t.events.intro}
          </p>
        </div>
        <ul role="list" className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event, i) => {
            const content = event[lang]
            const imgSrc = event.image ?? '/images/img1.webp'
            return (
              <li
                key={event.slug}
                className="group flex h-full flex-col rounded-3xl border border-slate-100 bg-white/80 backdrop-blur-sm shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:bg-white overflow-hidden"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="relative h-48 sm:h-56 w-full overflow-hidden">
                  <img
                    src={imgSrc}
                    alt={content.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <Chip
                      tone={event.accentTone}
                      className="px-3 py-1 font-bold tracking-wide shadow-md backdrop-blur-md bg-white/90"
                    >
                      {event.slug.replaceAll('-', ' ')}
                    </Chip>
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="font-serif text-2xl font-bold leading-tight text-ink group-hover:text-sunset-red transition-colors duration-300">
                    {content.title}
                  </h3>
                  <div className="mt-4 w-10 h-0.5 bg-slate-200 group-hover:bg-sunset-gold transition-colors duration-300" />
                  <details className="group/details mt-6">
                    <summary className="cursor-pointer list-none">
                      <span className="line-clamp-3 text-base leading-relaxed text-ink-light font-medium group-open/details:hidden">
                        {content.body}
                      </span>
                      <span className="mt-5 inline-block font-bold text-sunset-red hover:text-sunset-orange group-open/details:hidden">
                        {t.nav.about === 'About' ? 'Read more' : 'Lasīt vairāk'}
                      </span>
                      <span className="hidden font-bold text-sunset-red hover:text-sunset-orange group-open/details:inline">
                        {t.nav.about === 'About' ? 'Show less' : 'Rādīt mazāk'}
                      </span>
                    </summary>
                    <p className="mt-4 text-base leading-relaxed text-ink-light">{content.body}</p>
                  </details>
                </div>
              </li>
            )
          })}
        </ul>
      </Container>
    </Section>
  )
}

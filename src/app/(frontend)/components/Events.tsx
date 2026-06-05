'use client'

import { useLanguage } from '../i18n/LanguageProvider'
import { Container } from './ui/Container'
import { Section } from './ui/Section'
import { Eyebrow } from './ui/Eyebrow'
import { Chip } from './ui/Chip'

const accentByEvent: Record<string, keyof typeof accentForChip> = {
  lieldienas: 'emerald',
  jani: 'amber',
  may4: 'sky',
  'baltijas-cels': 'rose',
  nov18: 'violet',
}
const accentForChip = {
  emerald: 'emerald',
  amber: 'amber',
  sky: 'sky',
  rose: 'rose',
  violet: 'violet',
} as const

export function Events() {
  const { t } = useLanguage()
  return (
    <Section id="events" ariaLabel={t.events.title} tone="plain">
      <Container>
        <div className="max-w-3xl">
          <Eyebrow>03 — {t.events.title}</Eyebrow>
          <h2
            id="events-title"
            className="font-serif text-3xl font-bold tracking-tight text-ink sm:text-4xl"
          >
            {t.events.title}
          </h2>
          <p className="mt-4 text-pretty text-base leading-relaxed text-slate-700 sm:text-lg">
            {t.events.intro}
          </p>
        </div>
        <ul
          role="list"
          className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {t.events.items.map((event) => {
            const accent = accentByEvent[event.id] ?? 'slate'
            return (
              <li
                key={event.id}
                className="group flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <Chip tone={accent}>{event.id.replace('-', ' ')}</Chip>
                <h3 className="mt-4 font-serif text-lg font-semibold leading-snug text-ink">
                  {event.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-700">
                  {event.body}
                </p>
              </li>
            )
          })}
        </ul>
      </Container>
    </Section>
  )
}

// TODO(DLA-202): once the Payload `Events` collection ships, replace the hard-coded
//   `accentByEvent` map with a server component that fetches via `payload.find()` and
//   pre-classifies accents by an `accentTone` enum field on each event.

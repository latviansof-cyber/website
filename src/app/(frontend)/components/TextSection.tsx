'use client'

import { useLanguage } from '../i18n/LanguageProvider'
import { Container } from './ui/Container'
import { Section } from './ui/Section'
import { Eyebrow } from './ui/Eyebrow'

type SectionId = 'about' | 'history'
type Tone = 'plain' | 'muted'

export function TextSection({ id, tone = 'plain' }: { id: SectionId; tone?: Tone }) {
  const { t } = useLanguage()
  const data = id === 'about' ? t.about : t.history
  const label = id === 'about' ? '01 — ' + t.nav.about : '02 — ' + t.nav.history
  return (
    <Section id={id} ariaLabel={data.title} tone={tone}>
      <Container className="max-w-3xl">
        <Eyebrow>{label}</Eyebrow>
        <h2
          id={`${id}-title`}
          className="font-serif text-3xl font-bold tracking-tight text-ink sm:text-4xl"
        >
          {data.title}
        </h2>
        <div className="mt-6 space-y-5 text-pretty text-base leading-relaxed text-slate-700 sm:text-lg sm:leading-relaxed">
          {data.body.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>
      </Container>
    </Section>
  )
}

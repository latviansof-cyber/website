'use client'

import Image from 'next/image'
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

  // Select an image based on the section id
  const imageSrc = id === 'about' ? '/images/gathering1.jpg' : '/images/gathering2.jpg'

  return (
    <Section
      id={id}
      ariaLabel={data.title}
      tone={tone}
      className="py-24 sm:py-32 relative overflow-hidden"
    >
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-sunset-orange/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-sunset-gold/5 rounded-full blur-3xl" />

      <Container className="max-w-6xl relative z-10">
        <div className="flex flex-col items-center text-center mb-16 sm:mb-20">
          <Eyebrow className="text-sunset-orange tracking-widest font-bold uppercase mb-4">
            {label}
          </Eyebrow>
          <h2
            id={`${id}-title`}
            className="font-serif text-4xl font-bold tracking-tight text-ink sm:text-5xl lg:text-6xl"
          >
            {data.title}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-sunset-red to-sunset-gold mt-8 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div
            className={`space-y-6 text-pretty text-lg leading-relaxed text-ink-light sm:text-xl sm:leading-[1.8] font-medium drop-shadow-sm bg-white/50 backdrop-blur-sm p-8 sm:p-10 rounded-3xl border border-white/60 shadow-lg ${id === 'about' ? '' : 'lg:order-last'}`}
          >
            {data.body.map((paragraph, idx) => (
              <p
                key={`p-${idx}`}
                className="first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:text-sunset-red first-letter:mr-2 first-letter:float-left first-letter:mt-1"
              >
                {paragraph}
              </p>
            ))}
          </div>
          <div className="relative h-80 sm:h-[500px] w-full rounded-3xl overflow-hidden shadow-2xl group">
            <Image
              src={imageSrc}
              alt={data.title}
              fill
              unoptimized
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transform transition-transform duration-700 group-hover:scale-110"
              loading={id === 'about' ? 'eager' : 'lazy'}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        </div>
      </Container>
    </Section>
  )
}

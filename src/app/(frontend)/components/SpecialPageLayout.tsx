'use client'

import { useLanguage } from '../i18n/LanguageProvider'
import { Container } from './ui/Container'
import { Section } from './ui/Section'
import type { SpecialPageContent } from '@/lib/specialPages'

export function SpecialPageLayout({ page }: { page: SpecialPageContent }) {
  const { lang } = useLanguage()
  const content = page[lang]
  const paragraphs = content.content.split(/\n\s*\n/).filter(Boolean)

  return (
    <main id="main" className="bg-cream text-ink">
      <Section id="special-page" tone="plain" className="py-20 sm:py-28 bg-white relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-sunset-orange/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-sunset-gold/5 rounded-full blur-3xl" />

        <Container className="max-w-3xl relative z-10">
          <h1 className="font-serif text-4xl font-bold tracking-tight text-ink sm:text-5xl lg:text-6xl mb-8">
            {content.title}
          </h1>
          <div className="w-16 h-1 bg-gradient-to-r from-sunset-red to-sunset-gold mb-12 rounded-full" />
          <div className="space-y-6 text-lg leading-8 text-ink-light sm:text-xl sm:leading-9 font-medium">
            {paragraphs.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
        </Container>
      </Section>
    </main>
  )
}

'use client'

import Link from 'next/link'
import { useLanguage } from '../i18n/LanguageProvider'
import { Container } from './ui/Container'
import { Eyebrow } from './ui/Eyebrow'
import { Chip } from './ui/Chip'
import type { WebsiteEvent } from '@/lib/events'

export function EventDetailPage({ event }: { event: WebsiteEvent }) {
  const { lang } = useLanguage()
  const content = event[lang]
  const imgSrc = event.image ?? '/images/img1.webp'
  const paragraphs = content.body.split(/\n\s*\n/).filter(Boolean)

  const isPast = event.isPast || (event.eventDate && new Date(event.eventDate) < new Date())

  return (
    <main id="main" className="min-h-screen bg-cream text-ink py-12 sm:py-20">
      <Container className="max-w-4xl">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-sm font-medium text-ink-light">
          <Link href="/" className="hover:text-sunset-red transition-colors">
            {lang === 'lv' ? 'Sākums' : 'Home'}
          </Link>
          <span>/</span>
          <Link href="/#events" className="hover:text-sunset-red transition-colors">
            {lang === 'lv' ? 'Pasākumi' : 'Events'}
          </Link>
          <span>/</span>
          <span className="text-ink truncate font-semibold">{content.title}</span>
        </nav>

        {/* Header Content */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Chip tone={event.accentTone} className="px-3 py-1 font-bold uppercase tracking-wider text-xs shadow-sm">
            {event.slug.replaceAll('-', ' ')}
          </Chip>
          {isPast ? (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-700">
              {lang === 'lv' ? 'Aizvadīts pasākums' : 'Past Event'}
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              {lang === 'lv' ? 'Nākamais pasākums' : 'Upcoming Event'}
            </span>
          )}
          {content.dateText || event.eventDate ? (
            <span className="text-sm font-medium text-ink-light">
              {content.dateText ?? event.eventDate}
            </span>
          ) : null}
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-ink leading-tight mb-6">
          {content.title}
        </h1>

        <div className="w-20 h-1.5 bg-gradient-to-r from-sunset-red to-sunset-gold mb-10 rounded-full" />

        {/* Hero Image */}
        <div className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl mb-12 border border-slate-200">
          <img
            src={imgSrc}
            alt={content.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Body Text */}
        <article className="prose prose-lg max-w-none text-ink-light space-y-6 text-lg sm:text-xl leading-relaxed">
          {paragraphs.map((paragraph, idx) => (
            <p key={`p-${idx}`}>{paragraph}</p>
          ))}
        </article>

        {/* Footer Actions */}
        <div className="mt-16 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6">
          <Link
            href="/#events"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-slate-300 font-bold text-ink hover:bg-slate-100 transition-all"
          >
            ← {lang === 'lv' ? 'Atpakaļ uz pasākumiem' : 'Back to events'}
          </Link>

          <Link
            href="/donate"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-sunset-orange text-ink font-bold hover:bg-sunset-gold transition-all shadow-md"
          >
            {lang === 'lv' ? 'Ziedot kopienai' : 'Support our community'} →
          </Link>
        </div>
      </Container>
    </main>
  )
}

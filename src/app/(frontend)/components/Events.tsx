'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '../i18n/LanguageProvider'
import { localizeHref } from '@/lib/i18nRouting'
import { Container } from './ui/Container'
import { Section } from './ui/Section'
import { Eyebrow } from './ui/Eyebrow'
import { Chip } from './ui/Chip'
import type { WebsiteEvent } from '@/lib/events'
import type { HomepageContent } from '@/lib/homepage'

const ITEMS_PER_PAGE = 6

export function Events({
  events,
  homepage,
}: {
  events: WebsiteEvent[]
  homepage: HomepageContent
}) {
  const { lang, t } = useLanguage()
  const content = homepage[lang]
  const isLatvian = lang === 'lv'

  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming')
  const [currentPage, setCurrentPage] = useState(1)

  const upcomingEvents = events.filter((e) => !e.isPast)
  const pastEvents = events.filter((e) => Boolean(e.isPast))

  const activeEvents = activeTab === 'upcoming' ? upcomingEvents : pastEvents
  const totalPages = Math.ceil(activeEvents.length / ITEMS_PER_PAGE) || 1

  const displayedEvents = activeEvents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  )

  const handleTabChange = (tab: 'upcoming' | 'past') => {
    setActiveTab(tab)
    setCurrentPage(1)
  }

  return (
    <Section
      id="events"
      ariaLabel={content.eventsTitle}
      tone="plain"
      className="py-24 sm:py-32 relative overflow-hidden bg-white"
    >
      {/* Decorative background element */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-sunset-peach/50 to-white rounded-full blur-3xl opacity-60" />

      <Container className="relative z-10">
        <div className="max-w-3xl flex flex-col items-start">
          <Eyebrow className="text-sunset-orange tracking-widest font-bold uppercase mb-4">
            03 — {content.eventsTitle}
          </Eyebrow>
          <h2
            id="events-title"
            className="font-serif text-4xl font-bold tracking-tight text-ink sm:text-5xl lg:text-6xl"
          >
            {content.eventsTitle}
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-sunset-red to-sunset-gold mt-6 rounded-full" />
          <p className="mt-8 text-pretty text-lg leading-relaxed text-ink-light sm:text-xl max-w-2xl font-medium">
            {content.eventsIntro}
          </p>
        </div>

        {/* Subsections: Upcoming vs Past events tabs */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="flex gap-2 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/60">
            <button
              onClick={() => handleTabChange('upcoming')}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                activeTab === 'upcoming'
                  ? 'bg-white text-ink shadow-md border border-slate-200/80'
                  : 'text-ink-light hover:text-ink'
              }`}
            >
              {isLatvian ? 'Nākamie pasākumi' : 'Upcoming Events'} ({upcomingEvents.length})
            </button>
            <button
              onClick={() => handleTabChange('past')}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                activeTab === 'past'
                  ? 'bg-white text-ink shadow-md border border-slate-200/80'
                  : 'text-ink-light hover:text-ink'
              }`}
            >
              {isLatvian ? 'Aizvadītie pasākumi' : 'Past Events'} ({pastEvents.length})
            </button>
          </div>

          {activeEvents.length > 0 && (
            <span className="text-sm font-semibold text-ink-light">
              {isLatvian
                ? `Rāda ${(currentPage - 1) * ITEMS_PER_PAGE + 1}–${Math.min(
                    currentPage * ITEMS_PER_PAGE,
                    activeEvents.length,
                  )} no ${activeEvents.length}`
                : `Showing ${(currentPage - 1) * ITEMS_PER_PAGE + 1}–${Math.min(
                    currentPage * ITEMS_PER_PAGE,
                    activeEvents.length,
                  )} of ${activeEvents.length}`}
            </span>
          )}
        </div>

        {/* Cards Grid */}
        {displayedEvents.length === 0 ? (
          <div className="mt-12 p-12 text-center rounded-3xl border border-slate-200 bg-white/60">
            <p className="text-lg font-medium text-ink-light">
              {isLatvian
                ? 'Pašlaik šajā sadaļā nav pasākumu.'
                : 'No events currently listed in this section.'}
            </p>
          </div>
        ) : (
          <ul role="list" className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {displayedEvents.map((event, i) => {
              const eventContent = event[lang]
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
                      alt={eventContent.title}
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
                      {eventContent.title}
                    </h3>
                    <div className="mt-4 w-10 h-0.5 bg-slate-200 group-hover:bg-sunset-gold transition-colors duration-300" />

                    <details className="group/details mt-6">
                      <summary className="cursor-pointer list-none focus:outline-none">
                        <p className="line-clamp-3 text-base leading-relaxed text-ink-light font-medium group-open/details:hidden">
                          {eventContent.body}
                        </p>
                        <span className="mt-4 inline-block font-bold text-sunset-red hover:text-sunset-orange group-open/details:hidden">
                          {isLatvian ? 'Lasīt vairāk' : 'Read more'}
                        </span>
                      </summary>

                      <div className="mt-4 space-y-4">
                        <p className="line-clamp-12 text-base leading-relaxed text-ink-light">
                          {eventContent.body}
                        </p>

                        <div className="pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
                          <Link
                            href={localizeHref(`/events/${event.slug}`, lang)}
                            className="inline-flex items-center gap-1 font-bold text-sunset-orange hover:text-sunset-red transition-colors text-sm"
                          >
                            {isLatvian ? 'Skatīt pilnu informāciju' : 'See full info'} →
                          </Link>

                          <summary className="cursor-pointer list-none font-bold text-slate-400 hover:text-slate-600 text-sm">
                            {isLatvian ? 'Rādīt mazāk' : 'Show less'}
                          </summary>
                        </div>
                      </div>
                    </details>
                  </div>
                </li>
              )
            })}
          </ul>
        )}

        {/* Pagination controls (6 tiles per page) */}
        {totalPages > 1 && (
          <nav
            aria-label="Events pagination"
            className="mt-14 flex items-center justify-center gap-3"
          >
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2.5 rounded-xl font-bold text-sm border border-slate-200 bg-white text-ink disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-all shadow-sm"
            >
              ← {isLatvian ? 'Iepriekšējā' : 'Previous'}
            </button>

            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                    currentPage === pageNum
                      ? 'bg-sunset-red text-white shadow-md'
                      : 'bg-white text-ink border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2.5 rounded-xl font-bold text-sm border border-slate-200 bg-white text-ink disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-all shadow-sm"
            >
              {isLatvian ? 'Nākamā' : 'Next'} →
            </button>
          </nav>
        )}
      </Container>
    </Section>
  )
}

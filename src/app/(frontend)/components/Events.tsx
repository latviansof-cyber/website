'use client'

import Image from 'next/image'
import { useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '../i18n/LanguageProvider'
import { localizeHref } from '@/lib/i18nRouting'
import { Container } from './ui/Container'
import { Section } from './ui/Section'
import { Eyebrow } from './ui/Eyebrow'
import { Chip } from './ui/Chip'
import { ErrorBoundary } from './ui/ErrorBoundary'
import { FormattedText } from './ui/FormattedText'
import { isEventPast, type WebsiteEvent } from '@/lib/eventUtils'
import type { HomepageContent } from '@/lib/homepage'

const ITEMS_PER_PAGE = 6

function EventCard({
  event,
  lang,
  isLatvian,
  index,
}: {
  event: WebsiteEvent
  lang: 'en' | 'lv'
  isLatvian: boolean
  index: number
}) {
  const eventContent = event[lang]
  const imgSrc = event.image ?? '/images/img1.webp'
  const eventDateObj = event.eventDate ? new Date(event.eventDate) : null
  const hasValidDate = eventDateObj && !isNaN(eventDateObj.getTime())
  const monthName = hasValidDate
    ? eventDateObj.toLocaleDateString(lang === 'lv' ? 'lv-LV' : 'en-US', { month: 'short' }).toUpperCase()
    : null
  const dayNum = hasValidDate ? eventDateObj.getDate() : null
  const yearNum = hasValidDate ? eventDateObj.getFullYear() : null

  return (
    <li
      key={event.slug}
      className="group flex h-full flex-col rounded-3xl border border-slate-100 bg-white/80 backdrop-blur-sm shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:bg-white overflow-hidden"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <Link
        href={localizeHref(`/events/${event.slug}`, lang)}
        className="relative block h-48 sm:h-56 w-full overflow-hidden cursor-pointer"
        aria-label={eventContent.title}
      >
        <Image
          src={imgSrc}
          alt={eventContent.title}
          fill
          unoptimized
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute top-4 left-4">
          <Chip
            tone={event.accentTone}
            className="px-3 py-1 font-bold tracking-wide shadow-md backdrop-blur-md bg-white/90"
          >
            {event.slug.replaceAll('-', ' ')}
          </Chip>
        </div>

        {/* Prominent Date Badge */}
        {hasValidDate ? (
          <div className="absolute top-4 right-4 flex flex-col items-center justify-center rounded-2xl bg-white/95 px-3 py-1.5 shadow-lg backdrop-blur-md border border-white/80 min-w-[54px]">
            <span className="text-[10px] font-black uppercase tracking-wider text-sunset-red leading-none">
              {monthName}
            </span>
            <span className="text-xl font-black text-ink leading-none mt-1">
              {dayNum}
            </span>
            <span className="text-[9px] font-bold text-slate-400 leading-none mt-0.5">
              {yearNum}
            </span>
          </div>
        ) : eventContent.dateText ? (
          <div className="absolute top-4 right-4 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-ink shadow-md backdrop-blur-md border border-white/80">
            {eventContent.dateText}
          </div>
        ) : null}
      </Link>
      <div className="p-8 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-serif text-2xl font-bold leading-tight text-ink group-hover:text-sunset-red transition-colors duration-300">
            <Link href={localizeHref(`/events/${event.slug}`, lang)}>
              {eventContent.title}
            </Link>
          </h3>
          <div className="mt-4 w-10 h-0.5 bg-slate-200 group-hover:bg-sunset-gold transition-colors duration-300" />

          <details className="group/details mt-6">
            <summary className="cursor-pointer list-none focus:outline-none">
              <FormattedText text={eventContent.body} className="line-clamp-3 text-base leading-relaxed text-ink-light font-medium group-open/details:hidden" />
              <span className="mt-4 inline-block font-bold text-sunset-red hover:text-sunset-orange group-open/details:hidden">
                {isLatvian ? 'Lasīt vairāk' : 'Read more'}
              </span>
            </summary>

            <div className="mt-4 space-y-4">
              <FormattedText text={eventContent.body} className="line-clamp-12 text-base leading-relaxed text-ink-light" />

              <div className="pt-2">
                <summary className="cursor-pointer list-none font-bold text-slate-400 hover:text-slate-600 text-sm">
                  {isLatvian ? 'Rādīt mazāk' : 'Show less'}
                </summary>
              </div>
            </div>
          </details>
        </div>

        <div className="pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 mt-6">
          <Link
            href={localizeHref(`/events/${event.slug}`, lang)}
            className="inline-flex items-center gap-1 font-bold text-sunset-orange hover:text-sunset-red transition-colors text-sm"
          >
            {isLatvian ? 'Skatīt pilnu informāciju' : 'See full info'} →
          </Link>

          {Boolean(event.facebookUrl && event.facebookUrl.trim()) && (
            <a
              href={event.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#1877F2]/10 px-3 py-1 text-xs font-bold text-[#1877F2] border border-[#1877F2]/20 hover:bg-[#1877F2] hover:text-white transition-colors"
            >
              <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span>Facebook</span>
            </a>
          )}
        </div>
      </div>
    </li>
  )
}

export function Events({
  events,
  homepage,
}: {
  events: WebsiteEvent[]
  homepage: HomepageContent
}) {
  const { lang } = useLanguage()
  const content = homepage[lang]
  const isLatvian = lang === 'lv'

  const [pastPage, setPastPage] = useState(1)

  const getEventTime = (e: WebsiteEvent) => {
    if (!e.eventDate) return Number.MAX_SAFE_INTEGER
    const t = new Date(e.eventDate).getTime()
    return isNaN(t) ? Number.MAX_SAFE_INTEGER : t
  }

  const upcomingEvents = events
    .filter((e) => !isEventPast(e))
    .sort((a, b) => getEventTime(a) - getEventTime(b))

  const pastEvents = events
    .filter((e) => isEventPast(e))
    .sort((a, b) => getEventTime(b) - getEventTime(a))

  const totalPastPages = Math.ceil(pastEvents.length / ITEMS_PER_PAGE) || 1
  const displayedPastEvents = pastEvents.slice(
    (pastPage - 1) * ITEMS_PER_PAGE,
    pastPage * ITEMS_PER_PAGE,
  )

  return (
    <ErrorBoundary>
      <Section
        id="events"
        ariaLabel={content.eventsTitle}
        tone="plain"
        className="py-24 sm:py-32 relative overflow-hidden bg-white"
      >
        {/* Background glow */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-sunset-peach/50 to-white rounded-full blur-3xl opacity-60" />

        <Container className="relative z-10 space-y-16">
          {/* Header */}
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

          {/* Section 1: UPCOMING EVENTS */}
          <section aria-labelledby="upcoming-events-heading">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-8">
              <div className="flex items-center gap-3">
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 id="upcoming-events-heading" className="font-serif text-2xl sm:text-3xl font-bold text-ink">
                  {isLatvian ? 'Nākamie pasākumi' : 'Upcoming Events'}
                </h3>
                <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-extrabold text-emerald-800">
                  {upcomingEvents.length}
                </span>
              </div>
            </div>

            {upcomingEvents.length === 0 ? (
              <div className="p-10 text-center rounded-3xl border border-slate-200 bg-slate-50/60">
                <p className="text-lg font-medium text-ink-light">
                  {isLatvian
                    ? 'Pašlaik nav ieplānotu nākamo pasākumu. Sekojiet līdzi jaunumiem!'
                    : 'No upcoming events currently scheduled. Stay tuned for updates!'}
                </p>
              </div>
            ) : (
              <ul role="list" className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {upcomingEvents.map((event, i) => (
                  <EventCard key={event.slug} event={event} lang={lang} isLatvian={isLatvian} index={i} />
                ))}
              </ul>
            )}
          </section>

          {/* Section 2: PAST EVENTS */}
          {pastEvents.length > 0 && (
            <section aria-labelledby="past-events-heading" className="pt-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-8">
                <div className="flex items-center gap-3">
                  <h3 id="past-events-heading" className="font-serif text-2xl sm:text-3xl font-bold text-ink">
                    {isLatvian ? 'Aizvadītie pasākumi' : 'Past Events'}
                  </h3>
                  <span className="rounded-full bg-slate-100 px-3 py-0.5 text-xs font-extrabold text-slate-600">
                    {pastEvents.length}
                  </span>
                </div>

                {displayedPastEvents.length > 0 && (
                  <span className="text-sm font-semibold text-ink-light hidden sm:inline">
                    {isLatvian
                      ? `Rāda ${(pastPage - 1) * ITEMS_PER_PAGE + 1}–${Math.min(
                          pastPage * ITEMS_PER_PAGE,
                          pastEvents.length,
                        )} no ${pastEvents.length}`
                      : `Showing ${(pastPage - 1) * ITEMS_PER_PAGE + 1}–${Math.min(
                          pastPage * ITEMS_PER_PAGE,
                          pastEvents.length,
                        )} of ${pastEvents.length}`}
                  </span>
                )}
              </div>

              <ul role="list" className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {displayedPastEvents.map((event, i) => (
                  <EventCard key={event.slug} event={event} lang={lang} isLatvian={isLatvian} index={i} />
                ))}
              </ul>

              {/* Pagination for past events if > 6 */}
              {totalPastPages > 1 && (
                <nav
                  aria-label="Past events pagination"
                  className="mt-14 flex items-center justify-center gap-3"
                >
                  <button
                    onClick={() => setPastPage((p) => Math.max(1, p - 1))}
                    disabled={pastPage === 1}
                    className="px-4 py-2.5 rounded-xl font-bold text-sm border border-slate-200 bg-white text-ink disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-all shadow-sm"
                  >
                    ← {isLatvian ? 'Iepriekšējā' : 'Previous'}
                  </button>

                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: totalPastPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => setPastPage(pageNum)}
                        className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                          pastPage === pageNum
                            ? 'bg-sunset-red text-white shadow-md'
                            : 'bg-white text-ink border border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setPastPage((p) => Math.min(totalPastPages, p + 1))}
                    disabled={pastPage === totalPastPages}
                    className="px-4 py-2.5 rounded-xl font-bold text-sm border border-slate-200 bg-white text-ink disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-all shadow-sm"
                  >
                    {isLatvian ? 'Nākamā' : 'Next'} →
                  </button>
                </nav>
              )}
            </section>
          )}
        </Container>
      </Section>
    </ErrorBoundary>
  )
}

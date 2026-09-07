/**
 * Event Detail Page Template for SonicJS
 */

import { html, raw } from 'hono/html'
import { bodyToHtml } from '../utils/format'
import { resolveMediaUrl } from '../utils/content'
import type { EventData } from '../utils/content'

export interface EventDetailProps {
  lang: 'en' | 'lv'
  event: EventData
}

const TONE_CLASSES: Record<string, string> = {
  emerald: 'bg-emerald-100 text-emerald-800',
  amber: 'bg-amber-100 text-amber-800',
  sky: 'bg-sky-100 text-sky-800',
  rose: 'bg-rose-100 text-rose-800',
  violet: 'bg-violet-100 text-violet-800',
  slate: 'bg-slate-200 text-slate-700',
}

export function renderEventDetailPage({ lang, event }: EventDetailProps) {
  const isLv = lang === 'lv'
  const title = isLv ? event.title_lv : event.title_en
  const body = isLv ? event.body_lv : event.body_en
  const formattedBody = bodyToHtml(body)

  const dateObj = event.eventDate ? new Date(event.eventDate) : null
  const hasDate = dateObj !== null && !Number.isNaN(dateObj.getTime())
  const isPast = hasDate ? dateObj!.getTime() < Date.now() : false

  const tone = event.accentTone || 'rose'
  const imgSrc = event.image ? resolveMediaUrl(event.image) : ''
  const slugLabel = (event.slug || '').replace(/-/g, ' ')

  return html`
    <section class="min-h-screen bg-cream text-ink py-12 sm:py-20">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto">
          <!-- Breadcrumbs -->
          <nav aria-label="Breadcrumb" class="mb-8 flex items-center gap-2 text-sm font-medium text-slate-500">
            <a href="/${lang}" class="hover:text-latvian-red transition-colors">
              ${isLv ? 'Sākums' : 'Home'}
            </a>
            <span>/</span>
            <a href="/${lang}#events" class="hover:text-latvian-red transition-colors">
              ${isLv ? 'Pasākumi' : 'Events'}
            </a>
            <span>/</span>
            <span class="text-ink truncate font-semibold">${title || ''}</span>
          </nav>

          <!-- Meta Pills -->
          <div class="flex flex-wrap items-center gap-3 mb-6">
            ${slugLabel
              ? html`
                  <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-latvian-red/10 text-latvian-red border border-latvian-red/20">
                    ${slugLabel}
                  </span>
                `
              : ''}
            ${hasDate
              ? html`
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${isPast ? 'bg-slate-200 text-slate-700' : TONE_CLASSES[tone]}">
                    ${isPast ? (isLv ? 'Aizvadīts pasākums' : 'Past Event') : (isLv ? 'Nākamais pasākums' : 'Upcoming Event')}
                  </span>
                  <span class="text-sm font-semibold text-slate-600">🗓️ ${event.eventDate}</span>
                `
              : ''}
            ${event.facebookUrl
              ? html`
                  <a
                    href="${event.facebookUrl}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-1.5 rounded-full bg-[#1877F2]/10 px-3.5 py-1 text-xs font-bold text-[#1877F2] border border-[#1877F2]/20 hover:bg-[#1877F2] hover:text-white transition"
                  >
                    <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span>Facebook Event</span>
                  </a>
                `
              : ''}
          </div>

          <!-- Heading -->
          <h1 class="font-serif text-3xl font-bold tracking-tight text-ink sm:text-5xl lg:text-6xl mb-8 leading-tight">
            ${title || ''}
          </h1>

          <!-- Featured Image -->
          ${imgSrc
            ? html`
                <div class="relative w-full aspect-[16/9] overflow-hidden rounded-3xl mb-10 shadow-xl border border-slate-200/60 bg-white">
                  <img
                    src="${imgSrc}"
                    alt="${title || ''}"
                    class="h-full w-full object-cover"
                  />
                </div>
              `
            : ''}

          <!-- Content Body -->
          <article class="prose-custom max-w-none">
            ${raw(formattedBody)}
          </article>

          <!-- Bottom Navigation -->
          <div class="mt-14 pt-8 border-t border-slate-200 flex items-center justify-between gap-4 flex-wrap">
            <a
              href="/${lang}#events"
              class="inline-flex items-center gap-2 text-sm font-bold text-latvian-red hover:text-sunset-red transition"
            >
              ← ${isLv ? 'Atpakaļ uz pasākumiem' : 'Back to all events'}
            </a>
            <a
              href="/${lang}/donate"
              class="inline-flex items-center gap-1.5 rounded-full bg-sunset-gold px-5 py-2 text-sm font-bold text-ink shadow-sm transition hover:bg-amber-300"
            >
              ${isLv ? 'Ziedot kopienai' : 'Support our community'}
            </a>
          </div>
        </div>
      </div>
    </section>
  `
}

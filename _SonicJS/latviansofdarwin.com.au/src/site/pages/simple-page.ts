/**
 * Simple Page Template for SonicJS
 * Used for About, Contact, Privacy, Terms, EULA.
 */

import { html, raw } from 'hono/html'
import { bodyToHtml } from '../utils/format'
import type { PageData } from '../utils/content'

export interface SimplePageProps {
  lang: 'en' | 'lv'
  page: PageData
}

export function renderSimplePage({ lang, page }: SimplePageProps) {
  const isLv = lang === 'lv'
  const title = isLv ? page.title_lv : page.title_en
  const body = isLv ? page.body_lv : page.body_en
  const formattedBody = bodyToHtml(body)

  return html`
    <section class="py-20 sm:py-28 bg-white relative overflow-hidden">
      <!-- Subtle NT background glow -->
      <div class="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-sunset-orange/5 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-sunset-gold/5 rounded-full blur-3xl pointer-events-none"></div>

      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <h1 class="font-serif text-4xl font-bold tracking-tight text-ink sm:text-5xl lg:text-6xl mb-6">
          ${title || ''}
        </h1>
        <div class="w-16 h-1 bg-gradient-to-r from-sunset-red to-sunset-gold mb-10 rounded-full"></div>

        <article class="prose-custom max-w-none">
          ${raw(formattedBody)}
        </article>
      </div>
    </section>
  `
}

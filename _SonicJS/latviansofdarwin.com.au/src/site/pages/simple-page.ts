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
  const heroImage = page.heroImage ? page.heroImage : ''
  const resolvedHeroImage = heroImage ? heroImage : ''

  return html`
    <section class="relative overflow-hidden bg-white py-20 sm:py-28">
      <!-- Subtle NT background glow -->
      <div class="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-sunset-orange/5 blur-3xl"></div>
      <div class="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-sunset-gold/5 blur-3xl"></div>

      <div class="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        ${resolvedHeroImage
          ? html`
              <div class="mx-auto mb-10 flex max-w-5xl justify-center overflow-hidden bg-slate-50">
                <img
                  src="${resolvedHeroImage}"
                  alt="${title || ''}"
                  class="h-[240px] w-auto max-w-full object-contain object-center sm:h-[300px] lg:h-[360px]"
                />
              </div>
            `
          : ''}

        <div class="mx-auto max-w-4xl">
          <h1 class="mb-6 font-serif text-4xl font-bold tracking-tight text-ink sm:text-5xl lg:text-6xl">
            ${title || ''}
          </h1>
          <div class="mb-10 h-1 w-16 rounded-full bg-gradient-to-r from-sunset-red to-sunset-gold"></div>

          <article class="prose-custom max-w-none">
            ${raw(formattedBody)}
          </article>
        </div>
      </div>
    </section>
  `
}

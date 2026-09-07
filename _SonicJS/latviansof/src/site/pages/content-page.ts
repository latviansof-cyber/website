/**
 * Content Page Template for SonicJS
 * Used for History, Community, Membership, Culture.
 */

import { html, raw } from 'hono/html'
import { bodyToHtml } from '../utils/format'
import { resolveMediaUrl } from '../utils/content'
import type { PageData } from '../utils/content'

export interface ContentPageProps {
  lang: 'en' | 'lv'
  page: PageData
}

export function renderContentPage({ lang, page }: ContentPageProps) {
  const isLv = lang === 'lv'
  const title = isLv ? page.title_lv : page.title_en
  const excerpt = isLv ? page.excerpt_lv : page.excerpt_en
  const body = isLv ? page.body_lv : page.body_en
  const ctaLabel = isLv ? page.ctaLabel_lv : page.ctaLabel_en
  const ctaHref = page.ctaHref || `/${lang}/membership`
  const eyebrow = isLv ? 'Dārvinas Latviešu Apvienība' : 'Latvian Association of Darwin'
  const imgSrc = page.heroImage ? resolveMediaUrl(page.heroImage) : ''

  const formattedBody = bodyToHtml(body)
  const isLogo = page.slug === 'history'

  return html`
    <!-- Hero Banner -->
    <section class="relative isolate overflow-hidden bg-ink py-20 text-white sm:py-28">
      <div class="absolute inset-0 -z-10 bg-gradient-to-br from-ink/95 via-sunset-red/80 to-sunset-orange/70"></div>
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p class="inline-flex rounded-full border border-white/35 bg-white/15 px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] text-sunset-gold backdrop-blur-md mb-4">
          ${eyebrow}
        </p>
        <h1 class="font-serif text-4xl font-bold leading-tight sm:text-6xl text-white max-w-4xl">
          ${title}
        </h1>
        ${excerpt ? html`<p class="mt-6 max-w-2xl text-xl leading-relaxed text-white/90">${excerpt}</p>` : ''}
      </div>
    </section>

    <!-- Main Content Section -->
    <section class="py-16 lg:py-24 bg-cream">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <!-- Article Body -->
        <article class="prose-custom max-w-none">
          ${raw(formattedBody)}
        </article>

        <!-- Sidebar / Media Card -->
        <aside class="space-y-6 lg:sticky lg:top-28">
          <div class="overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-lg">
            <div class="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-50 flex items-center justify-center">
              ${imgSrc
                ? html`
                    <img
                      src="${imgSrc}"
                      alt="${title || ''}"
                      class="h-full w-full ${isLogo ? 'object-contain p-6' : 'object-cover'}"
                    />
                  `
                : html`
                    <span class="text-5xl" aria-hidden="true">🇱🇻</span>
                  `}
            </div>
            <div class="mt-6 space-y-3">
              <h3 class="font-serif text-lg font-bold text-ink">
                ${isLv ? 'Par šo tēmu' : 'About this section'}
              </h3>
              <p class="text-sm text-ink/75 leading-relaxed">
                ${isLv
                  ? 'Uzziniet vairāk par mūsu pasākumiem, aktivitātēm un iespējām pievienoties Dārvinas Latviešu Apvienībai.'
                  : 'Learn more about our events, activities, and ways to connect with the Latvian Association of Darwin.'}
              </p>
              <div class="pt-2">
                <a
                  href="${ctaHref}"
                  ${ctaHref.startsWith('http') || ctaHref.startsWith('mailto:') ? 'target="_blank" rel="noopener noreferrer"' : ''}
                  class="inline-flex w-full items-center justify-center rounded-full bg-sunset-gold px-5 py-2.5 text-sm font-bold text-ink shadow-sm transition hover:bg-amber-300"
                >
                  ${ctaLabel || (isLv ? 'Iesaistieties' : 'Get involved')} →
                </a>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  `
}

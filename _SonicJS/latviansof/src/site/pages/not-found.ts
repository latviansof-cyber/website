/**
 * Not Found (404) Page Template for SonicJS
 */

import { html } from 'hono/html'

export function renderNotFoundPage(lang: 'en' | 'lv' = 'en') {
  const isLv = lang === 'lv'
  return html`
    <section class="min-h-[60vh] flex items-center justify-center bg-cream px-4 py-20 text-center">
      <div class="max-w-md space-y-6">
        <p class="text-6xl font-serif font-black text-latvian-red">404</p>
        <h1 class="font-serif text-3xl font-bold text-ink sm:text-4xl">
          ${isLv ? 'Lapa nav atrasta' : 'Page Not Found'}
        </h1>
        <p class="text-base text-ink/75 leading-relaxed">
          ${isLv
            ? 'Atvainojiet, meklētā lapa neeksistē vai ir pārvietota.'
            : 'Sorry, the page you are looking for does not exist or has been moved.'}
        </p>
        <div class="pt-2">
          <a
            href="/${lang}"
            class="inline-flex items-center rounded-full bg-sunset-gold px-6 py-2.5 text-sm font-bold text-ink shadow-sm transition hover:bg-amber-300"
          >
            ← ${isLv ? 'Atgriezties uz sākumlapu' : 'Return to Home'}
          </a>
        </div>
      </div>
    </section>
  `
}

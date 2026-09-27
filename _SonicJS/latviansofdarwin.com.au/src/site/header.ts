/**
 * Bilingual Site Header Component
 */

import { html } from 'hono/html'
import { renderLanguageSwitcher } from './language-switcher'
import type { NavigationItem, SiteSettingsData } from './utils/content'

export function renderHeader(
  lang: 'en' | 'lv',
  currentPath: string,
  navItems: NavigationItem[],
  settings: SiteSettingsData
) {
  const primaryName = lang === 'en' ? settings.associationName_en : settings.associationName_lv
  const secondaryName = lang === 'en' ? settings.associationName_lv : settings.associationName_en
  const donateLabel = lang === 'en' ? 'Donate' : 'Ziedot'
  const skipLabel = lang === 'en' ? 'Skip to content' : 'Pāriet uz saturu'

  function localize(href: string) {
    if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:')) {
      return href
    }
    if (href.startsWith('/#')) {
      return `/${lang}${href.substring(1)}`
    }
    if (href.startsWith('#')) {
      return href
    }
    const clean = href.replace(/^\/(?:en|lv)\/?/, '/').replace(/^\//, '')
    return `/${lang}/${clean}`
  }

  return html`
    <header class="sticky top-0 z-40 border-b border-white/10 glass-panel-latvian text-white shadow-lg transition-all duration-300">
      <a
        href="#main"
        class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:rounded-full focus:bg-sunset-gold focus:px-3 focus:py-1.5 focus:text-sm focus:font-semibold focus:text-ink"
      >
        ${skipLabel}
      </a>
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 py-3 sm:py-4">
        <a href="/${lang}#top" class="group flex items-center gap-4">
          <img
            src="/files/uploads/e9cd9febfcf6d193954bc.png"
            alt="${primaryName || 'Latvian Association of Darwin'}"
            width="80"
            height="80"
            class="h-14 w-14 sm:h-16 sm:w-16 object-contain rounded-2xl bg-white p-1.5 drop-shadow-lg transition-transform duration-300 group-hover:scale-105"
          />
          <span class="hidden flex-col leading-tight sm:flex">
            <span class="text-sm font-bold tracking-wide text-white drop-shadow-sm transition-colors group-hover:text-sunset-peach">
              ${primaryName}
            </span>
            <span class="text-xs text-white/80 font-medium tracking-wide">
              ${secondaryName}
            </span>
          </span>
        </a>

        <nav aria-label="Primary" class="flex items-center gap-2 sm:gap-4">
          <ul class="hidden items-center gap-2 text-sm font-semibold text-white/90 sm:flex">
            ${navItems.map(
              (item) => html`
                <li>
                  <a
                    href="${localize(item.href)}"
                    ${item.newTab ? 'target="_blank" rel="noreferrer"' : ''}
                    class="rounded-full px-4 py-2 transition-all duration-200 hover:bg-white/20 hover:text-white hover:shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                  >
                    ${lang === 'en' ? item.en : item.lv}
                  </a>
                </li>
              `
            )}
          </ul>
          <a
            href="/${lang}/donate"
            aria-label="${donateLabel}"
            data-testid="nav-donate"
            class="group inline-flex items-center gap-1.5 rounded-full bg-sunset-gold px-5 py-2 text-sm font-bold text-ink shadow-sm transition-all duration-200 hover:bg-amber-300 hover:shadow-md hover:scale-105 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
          >
            <svg class="h-4 w-4 transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <span class="hidden sm:inline">${donateLabel}</span>
            <span class="sr-only sm:hidden">${donateLabel}</span>
          </a>
          <div class="pl-2 sm:border-l sm:border-white/20">
            ${renderLanguageSwitcher(lang, currentPath)}
          </div>
        </nav>
      </div>

      <!-- Mobile navigation bar -->
      <nav
        aria-label="Primary mobile"
        class="overflow-x-auto border-t border-white/10 bg-latvian-red/80 backdrop-blur-md sm:hidden"
      >
        <ul class="mx-auto flex w-max min-w-full items-center justify-start gap-1 px-3 py-2.5 text-sm font-semibold text-white/90">
          ${navItems.map(
            (item) => html`
              <li>
                <a
                  href="${localize(item.href)}"
                  ${item.newTab ? 'target="_blank" rel="noreferrer"' : ''}
                  class="block whitespace-nowrap rounded-full px-3 py-1.5 transition-colors hover:bg-white/20 hover:text-white"
                >
                  ${lang === 'en' ? item.en : item.lv}
                </a>
              </li>
            `
          )}
        </ul>
      </nav>
    </header>
  `
}

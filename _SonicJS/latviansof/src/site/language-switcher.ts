/**
 * Language Switcher Component
 *
 * Renders EN / LV buttons and computes target URL preserving path and hash.
 */

import { html } from 'hono/html'

export function renderLanguageSwitcher(currentLang: 'en' | 'lv', currentPath: string) {
  // Replace current language prefix in currentPath
  // currentPath is e.g. /en/history or /en or /lv/events/lieldienas
  const enPath = currentPath.replace(/^\/(?:en|lv)(?:\/|$)/, '/en/').replace(/\/$/, '') || '/en'
  const lvPath = currentPath.replace(/^\/(?:en|lv)(?:\/|$)/, '/lv/').replace(/\/$/, '') || '/lv'

  return html`
    <div class="inline-flex items-center rounded-full p-1 bg-white/60 backdrop-blur border border-slate-200/80 shadow-sm text-xs font-semibold" role="group" aria-label="Language selection">
      <a
        href="${enPath}"
        class="px-2.5 py-1 rounded-full transition-colors duration-150 ${currentLang === 'en' ? 'bg-latvian-red text-white shadow-sm' : 'text-slate-600 hover:text-ink'}"
        aria-current="${currentLang === 'en' ? 'page' : 'false'}"
      >
        EN
      </a>
      <a
        href="${lvPath}"
        class="px-2.5 py-1 rounded-full transition-colors duration-150 ${currentLang === 'lv' ? 'bg-latvian-red text-white shadow-sm' : 'text-slate-600 hover:text-ink'}"
        aria-current="${currentLang === 'lv' ? 'page' : 'false'}"
      >
        LV
      </a>
    </div>
  `
}

/**
 * Master HTML Layout for SonicJS Public Pages
 *
 * Renders the full document with SEO/social metadata: canonical URL, hreflang
 * alternates, Open Graph, Twitter card, robots and JSON-LD organization data.
 */

import { html, raw } from 'hono/html'
import { renderHeader } from './header'
import { renderFooter } from './footer'
import { siteStyles, tailwindConfigScript } from './styles'
import type { FooterData, NavigationItem, SiteSettingsData } from './utils/content'

export interface LayoutOptions {
  lang: 'en' | 'lv'
  currentPath: string
  /** Site origin (scheme + host) used to build absolute URLs, e.g. https://host */
  origin: string
  title?: string | undefined
  description?: string | undefined
  image?: string | undefined
  noIndex?: boolean | undefined
  navItems: NavigationItem[]
  footer: FooterData
  settings: SiteSettingsData
  content: unknown
}

function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** Alternative-language path for the current path. */
function langPath(currentPath: string, target: 'en' | 'lv'): string {
  if (/^\/(?:en|lv)(?=\/|$)/.test(currentPath)) {
    return currentPath.replace(/^\/(?:en|lv)(?=\/|$)/, `/${target}`)
  }
  if (currentPath === '/') return `/${target}`
  return `/${target}${currentPath}`
}

export function renderLayout(opts: LayoutOptions): string {
  const { lang, currentPath, origin, navItems, footer, settings, content } = opts
  const associationName =
    (lang === 'en' ? settings.associationName_en : settings.associationName_lv) ||
    settings.associationName_en ||
    'Latvian Association of Darwin'
  const defaultTitle =
    lang === 'en'
      ? 'Latvian Association of Darwin | Top End Community'
      : 'Dārvinas Latviešu Apvienība | Ziemeļu Teritorijas latvieši'
  const defaultDesc =
    lang === 'en'
      ? 'Bringing together Latvians, descendants, and friends across Darwin and the Northern Territory.'
      : 'Apvienojot latviešus, latviešu pēcnācējus un Latvijas draugus Dārvinā un Ziemeļu Teritorijā.'

  const pageTitle = opts.title ? `${opts.title} | ${associationName}` : defaultTitle
  const pageDesc = opts.description || defaultDesc
  const canonicalUrl = `${origin}${langPath(currentPath, lang)}`
  const enUrl = `${origin}${langPath(currentPath, 'en')}`
  const lvUrl = `${origin}${langPath(currentPath, 'lv')}`
  const ogImage = opts.image
    ? opts.image.startsWith('http')
      ? opts.image
      : `${origin}${opts.image}`
    : `${origin}/files/uploads/e9cd9febfcf6d193954bc.png`
  const ogLocale = lang === 'lv' ? 'lv_LV' : 'en_AU'
  const alternateLocale = lang === 'lv' ? 'en_AU' : 'lv_LV'
  const robotsContent = opts.noIndex ? 'noindex, nofollow' : 'index, follow'

  const socialLinks = (settings.socialLinks || [])
    .map((link) => ({ ...link, url: escapeHtml(link.url) }))
    .filter((link) => link.url.length > 0)

  const head = `
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(pageTitle)}</title>
  <meta name="description" content="${escapeHtml(pageDesc)}" />
  <link rel="canonical" href="${escapeHtml(canonicalUrl)}" />
  <link rel="alternate" hreflang="en" href="${escapeHtml(enUrl)}" />
  <link rel="alternate" hreflang="lv" href="${escapeHtml(lvUrl)}" />
  <link rel="alternate" hreflang="x-default" href="${escapeHtml(enUrl)}" />
  <meta name="robots" content="${robotsContent}" />
  <link rel="icon" href="/files/uploads/40c99b4d978d3e3c1f4c8.ico" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="${escapeHtml(associationName)}" />
  <meta property="og:locale" content="${ogLocale}" />
  <meta property="og:locale:alternate" content="${alternateLocale}" />
  <meta property="og:url" content="${escapeHtml(canonicalUrl)}" />
  <meta property="og:title" content="${escapeHtml(pageTitle)}" />
  <meta property="og:description" content="${escapeHtml(pageDesc)}" />
  <meta property="og:image" content="${escapeHtml(ogImage)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(pageTitle)}" />
  <meta name="twitter:description" content="${escapeHtml(pageDesc)}" />
  <meta name="twitter:image" content="${escapeHtml(ogImage)}" />
  <script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: settings.associationName_en || associationName,
    url: `${origin}/en`,
    email: settings.contactEmail || undefined,
    sameAs: socialLinks.map((link) => link.url),
  })}</script>
`

  const renderedContent = typeof content === 'string' ? raw(content) : content

  const doc = html`<!DOCTYPE html>
<html lang="${lang}">
<head>
  ${raw(head)}
  <!-- Fonts: Inter and Lora -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet" />
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>${raw(tailwindConfigScript)}</script>
  <!-- Injected Custom Styles -->
  <style>${raw(siteStyles)}</style>
</head>
<body class="min-h-screen flex flex-col bg-cream text-ink antialiased">
  <div id="top"></div>
  ${renderHeader(lang, currentPath, navItems, settings)}
  <main id="main" class="flex-grow">
    ${renderedContent}
  </main>
  ${renderFooter(lang, footer, settings)}
  <script>
    function copyToClipboard(text, btn) {
      if (!navigator.clipboard) return;
      navigator.clipboard.writeText(text).then(() => {
        const original = btn.innerHTML;
        btn.innerHTML = '✓ Copied!';
        btn.classList.add('bg-emerald-600', 'text-white');
        setTimeout(() => {
          btn.innerHTML = original;
          btn.classList.remove('bg-emerald-600', 'text-white');
        }, 2000);
      });
    }
  </script>
</body>
</html>`

  return doc.toString()
}

/**
 * YouTube Embed Utilities for SonicJS
 *
 * Safely extracts YouTube video IDs and converts explicit iframe snippets
 * (both raw HTML and HTML-escaped variants from rich text editors) into
 * responsive privacy-enhanced (youtube-nocookie.com) embeds.
 */

const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/

function decodeHtmlAttributes(value: string): string {
  return value
    .replaceAll('&quot;', '"')
    .replaceAll('&#34;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
}

export function youtubeVideoId(input: string): string | null {
  const decoded = decodeHtmlAttributes(input.trim())
  const srcMatch = decoded.match(/\bsrc\s*=\s*(["'])(.*?)\1/i)
  const candidate = srcMatch?.[2] ?? decoded

  try {
    const url = new URL(candidate)
    const hostname = url.hostname.toLowerCase().replace(/^www\./, '')
    let id: string | null = null

    if (hostname === 'youtu.be') {
      id = url.pathname.split('/').filter(Boolean)[0] ?? null
    } else if (
      hostname === 'youtube.com' ||
      hostname === 'm.youtube.com' ||
      hostname === 'youtube-nocookie.com'
    ) {
      const pathParts = url.pathname.split('/').filter(Boolean)
      if (pathParts[0] === 'embed' || pathParts[0] === 'shorts' || pathParts[0] === 'live') {
        id = pathParts[1] ?? null
      } else if (url.pathname === '/watch') {
        id = url.searchParams.get('v')
      }
    }

    return id && YOUTUBE_ID.test(id) ? id : null
  } catch {
    return YOUTUBE_ID.test(candidate) ? candidate : null
  }
}

export function youtubeEmbedUrl(input: string): string | null {
  const id = youtubeVideoId(input)
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : null
}

function safeIframe(input: string): string {
  const src = youtubeEmbedUrl(input)
  if (!src) return ''

  return `<iframe class="ql-video" src="${src}" title="YouTube video player" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`
}

/**
 * Converts only explicit YouTube iframe snippets. Bare YouTube links remain links.
 * Raw iframes from any other source are removed before the HTML reaches the page.
 */
export function normalizeYouTubeEmbeds(html: string): string {
  return html
    .replace(/<iframe\b[\s\S]*?(?:<\/iframe\s*>|\/>)/gi, (iframe) => safeIframe(iframe))
    .replace(/&lt;iframe\b[\s\S]*?(?:&lt;\/iframe\s*&gt;|\/&gt;)/gi, (iframe) => safeIframe(iframe))
}

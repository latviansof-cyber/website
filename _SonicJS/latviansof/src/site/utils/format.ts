/**
 * Rich-text body formatting for the public site.
 *
 * Mirrors the production Payload renderer (FormattedText): stored HTML is
 * passed through untouched; plain text is split into paragraphs and gets a
 * light markdown pass (**bold**, [label](url) and bare links open in a new
 * tab). Output is always a safe HTML fragment for use with `raw()`.
 */

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

const LINK_RE = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s]+)/g
const BOLD_RE = /\*\*([^*]+)\*\*/g

function renderParagraph(paragraph: string): string {
  const parts: string[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  LINK_RE.lastIndex = 0
  while ((match = LINK_RE.exec(paragraph)) !== null) {
    if (match.index > lastIndex) {
      parts.push(renderBold(escapeHtml(paragraph.substring(lastIndex, match.index))))
    }
    const label = match[1] ? escapeHtml(match[1]) : escapeHtml(match[3])
    const url = escapeHtml(match[2] || match[3])
    parts.push(
      `<a href="${url}" target="_blank" rel="noopener noreferrer">${label} ↗</a>`
    )
    lastIndex = LINK_RE.lastIndex
  }

  if (lastIndex < paragraph.length) {
    parts.push(renderBold(escapeHtml(paragraph.substring(lastIndex))))
  }

  return `<p>${parts.join('')}</p>`
}

function renderBold(escapedText: string): string {
  // Input is already HTML-escaped; only apply the bold marker on plain text.
  const parts: string[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  BOLD_RE.lastIndex = 0
  const raw = escapedText.replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  const restored = raw.replace(/&amp;/g, '&')
  while ((match = BOLD_RE.exec(restored)) !== null) {
    if (match.index > lastIndex) {
      parts.push(escapeHtml(restored.substring(lastIndex, match.index)))
    }
    parts.push(`<strong>${escapeHtml(match[1])}</strong>`)
    lastIndex = BOLD_RE.lastIndex
  }
  if (lastIndex < restored.length) {
    parts.push(escapeHtml(restored.substring(lastIndex)))
  }
  return parts.join('')
}

/** Convert stored body content into safe HTML for `raw()`. */
export function bodyToHtml(text: string | undefined | null): string {
  if (!text) return ''
  // Already HTML (rich-text) — pass through (server-generated content).
  if (/<[a-z][\s\S]*>/i.test(text) || /&lt;iframe\b/i.test(text)) {
    return text
  }
  return text
    .split(/\n\s*\n/)
    .filter(Boolean)
    .map(renderParagraph)
    .join('')
}

/** Strip HTML/markdown for plain-text excerpts (descriptions, card copy). */
export function plainText(htmlOrText: string | undefined | null): string {
  if (!htmlOrText) return ''
  return htmlOrText
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
}

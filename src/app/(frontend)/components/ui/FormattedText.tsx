import React from 'react'
import { normalizeYouTubeEmbeds } from '@/lib/youtubeEmbed'

export function FormattedText({ text, className }: { text: string; className?: string }) {
  if (!text) return null

  const isHtml = /<[a-z][\s\S]*>/i.test(text) || /&lt;iframe\b/i.test(text)
  if (isHtml) {
    const html = normalizeYouTubeEmbeds(text)
    return (
      <div
        className={`formatted-text prose prose-slate max-w-none text-ink-light ${className ?? ''}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    )
  }

  const paragraphs = text.split(/\n\s*\n/).filter(Boolean)

  return (
    <div className={className}>
      {paragraphs.map((paragraph, pIdx) => {
        const parts = parseMarkdownAndLinks(paragraph)

        return (
          <p key={`p-${pIdx}`} className="mb-4 last:mb-0">
            {parts.map((part, idx) => {
              if (part.type === 'link') {
                return (
                  <a
                    key={`l-${idx}`}
                    href={part.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sunset-red hover:text-sunset-orange font-semibold underline decoration-sunset-red/30 underline-offset-2 break-all transition-colors"
                  >
                    {part.label} ↗
                  </a>
                )
              }
              if (part.type === 'bold') {
                return (
                  <strong key={`b-${idx}`} className="font-bold text-ink">
                    {part.text}
                  </strong>
                )
              }
              return <React.Fragment key={`t-${idx}`}>{part.text}</React.Fragment>
            })}
          </p>
        )
      })}
    </div>
  )
}

function parseMarkdownAndLinks(str: string) {
  const regex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s]+)/g
  const result: Array<
    | { type: 'text'; text: string }
    | { type: 'link'; label: string; url: string }
    | { type: 'bold'; text: string }
  > = []

  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(str)) !== null) {
    if (match.index > lastIndex) {
      const textBefore = str.substring(lastIndex, match.index)
      parseBold(textBefore, result)
    }

    if (match[1] && match[2]) {
      result.push({ type: 'link', label: match[1], url: match[2] })
    } else if (match[3]) {
      const cleanUrl = match[3].replace(/[.,;!?]$/, '')
      result.push({ type: 'link', label: cleanUrl, url: cleanUrl })
    }

    lastIndex = regex.lastIndex
  }

  if (lastIndex < str.length) {
    parseBold(str.substring(lastIndex), result)
  }

  return result
}

function parseBold(text: string, result: any[]) {
  const boldRegex = /\*\*([^*]+)\*\*/g
  let lastIdx = 0
  let bMatch: RegExpExecArray | null

  while ((bMatch = boldRegex.exec(text)) !== null) {
    if (bMatch.index > lastIdx) {
      result.push({ type: 'text', text: text.substring(lastIdx, bMatch.index) })
    }
    result.push({ type: 'bold', text: bMatch[1] })
    lastIdx = boldRegex.lastIndex
  }

  if (lastIdx < text.length) {
    result.push({ type: 'text', text: text.substring(lastIdx) })
  }
}

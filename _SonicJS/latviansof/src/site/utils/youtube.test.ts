import { describe, expect, it } from 'vitest'
import { normalizeYouTubeEmbeds, youtubeEmbedUrl, youtubeVideoId } from './youtube'

describe('YouTube embeds in SonicJS', () => {
  it.each([
    ['https://www.youtube.com/watch?v=IGufUlcM6BU', 'IGufUlcM6BU'],
    ['https://youtu.be/IGufUlcM6BU?t=12', 'IGufUlcM6BU'],
    ['https://www.youtube.com/shorts/IGufUlcM6BU', 'IGufUlcM6BU'],
    [
      '<iframe src="https://www.youtube.com/embed/IGufUlcM6BU?si=tracking"></iframe>',
      'IGufUlcM6BU',
    ],
  ])('extracts the video ID from %s', (input, expected) => {
    expect(youtubeVideoId(input)).toBe(expected)
  })

  it('uses the privacy-enhanced embed host and drops supplied query parameters', () => {
    expect(youtubeEmbedUrl('https://youtube.com/watch?v=IGufUlcM6BU&list=abc')).toBe(
      'https://www.youtube-nocookie.com/embed/IGufUlcM6BU',
    )
  })

  it('converts an HTML-escaped iframe copied from YouTube', () => {
    const html =
      '<p>&lt;iframe width=&quot;560&quot; src=&quot;https://www.youtube.com/embed/IGufUlcM6BU?si=test&quot;&gt;&lt;/iframe&gt;</p>'
    const result = normalizeYouTubeEmbeds(html)

    expect(result).toContain('https://www.youtube-nocookie.com/embed/IGufUlcM6BU')
    expect(result).toContain('loading="lazy"')
    expect(result).not.toContain('&lt;iframe')
  })

  it('converts the exact elections-2026 snippet stored in DB', () => {
    const html =
      '<p>&lt;iframe width="560" height="315" src="https://www.youtube.com/embed/IGufUlcM6BU?si=haF6YwtIR5Byr8SB" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen&gt;&lt;/iframe&gt;</p>'
    const result = normalizeYouTubeEmbeds(html)

    expect(result).toContain('src="https://www.youtube-nocookie.com/embed/IGufUlcM6BU"')
    expect(result).toContain('class="ql-video"')
    expect(result).not.toContain('&lt;iframe')
  })

  it('auto-embeds a bare YouTube link in a paragraph', () => {
    const html = '<p>https://www.youtube.com/watch?v=IGufUlcM6BU</p>'
    const result = normalizeYouTubeEmbeds(html)
    expect(result).toContain('<iframe class="ql-video"')
    expect(result).toContain('https://www.youtube-nocookie.com/embed/IGufUlcM6BU')
  })

  it('removes raw iframes from unsupported hosts', () => {
    expect(
      normalizeYouTubeEmbeds(
        '<p>Before</p><iframe src="https://example.com"></iframe><p>After</p>',
      ),
    ).toBe('<p>Before</p><p>After</p>')
  })

  it('formats body with bodyToHtml for elections-2026 content correctly', async () => {
    const { bodyToHtml, plainText } = await import('./format')
    const rawBody =
      '<p>Vēlētāji, kuri vēlēšanu laikā uzturas ārvalstīs, 15. Saeimas vēlēšanās var balsot pa pastu. Ārpus Latvijas nodotās balsis pieskaita Rīgas vēlēšanu apgabalam.</p><p><br></p><p>&lt;iframe width="560" height="315" src="https://www.youtube.com/embed/IGufUlcM6BU?si=haF6YwtIR5Byr8SB" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen&gt;&lt;/iframe&gt;</p>'

    const htmlOutput = bodyToHtml(rawBody)
    expect(htmlOutput).toContain('<iframe class="ql-video"')
    expect(htmlOutput).toContain('src="https://www.youtube-nocookie.com/embed/IGufUlcM6BU"')
    expect(htmlOutput).not.toContain('&lt;iframe')

    const excerpt = plainText(rawBody)
    expect(excerpt).not.toContain('iframe')
    expect(excerpt).toContain('Vēlētāji, kuri vēlēšanu laikā uzturas ārvalstīs')
  })
})


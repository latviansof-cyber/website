import { normalizeYouTubeEmbeds, youtubeEmbedUrl, youtubeVideoId } from '@/lib/youtubeEmbed'

describe('YouTube embeds', () => {
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

  it('does not auto-embed a bare YouTube link', () => {
    const html = '<p>https://www.youtube.com/watch?v=IGufUlcM6BU</p>'
    expect(normalizeYouTubeEmbeds(html)).toBe(html)
  })

  it('removes raw iframes from unsupported hosts', () => {
    expect(
      normalizeYouTubeEmbeds(
        '<p>Before</p><iframe src="https://example.com"></iframe><p>After</p>',
      ),
    ).toBe('<p>Before</p><p>After</p>')
  })
})

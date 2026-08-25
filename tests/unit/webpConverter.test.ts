import { convertToWebP } from '../../src/lib/webpConverter'

describe('convertToWebP', () => {
  it('returns original file if already image/webp', async () => {
    const file = new File(['fake-image-content'], 'test.webp', { type: 'image/webp' })
    const result = await convertToWebP(file)
    expect(result).toBe(file)
    expect(result.name).toBe('test.webp')
  })

  it('returns original file if non-image type', async () => {
    const file = new File(['text-content'], 'document.pdf', { type: 'application/pdf' })
    const result = await convertToWebP(file)
    expect(result).toBe(file)
    expect(result.name).toBe('document.pdf')
  })
})

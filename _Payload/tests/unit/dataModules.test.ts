/**
 * @jest-environment jsdom
 */
jest.mock('@/lib/payload', () => ({
  getPayloadClient: jest.fn(),
}))

import { getPayloadClient } from '@/lib/payload'
import { getWebsiteEvents } from '@/lib/events'
import { getWebsitePages, getWebsitePage } from '@/lib/pages'
import { getDonationSettings } from '@/lib/donationSettings'
import { getSpecialPage } from '@/lib/specialPages'
import type { Mock } from 'jest'

const mockFind = jest.fn()
const mockFindGlobal = jest.fn()
const mockCreate = jest.fn()

beforeEach(() => {
  jest.clearAllMocks()
  ;(getPayloadClient as Mock).mockResolvedValue({
    find: mockFind,
    findGlobal: mockFindGlobal,
    create: mockCreate,
  })
})

describe('getWebsitePages()', () => {
  it('returns pages from Payload on success', async () => {
    mockFind.mockResolvedValue({
      docs: [
        {
          id: '1',
          slug: 'history',
          order: 10,
          en: { title: 'History', excerpt: 'desc' },
          lv: { title: 'Vēsture', excerpt: 'desc' },
          layout: [],
          meta: { title: null, description: null, image: null, noIndex: null },
          _status: 'published',
        },
      ],
    })

    const pages = await getWebsitePages()
    expect(pages).toHaveLength(1)
    expect(pages[0].slug).toBe('history')
    expect(mockFind).toHaveBeenCalledWith(
      expect.objectContaining({ collection: 'pages' }),
    )
  })

  it('returns fallback pages when Payload throws', async () => {
    mockFind.mockRejectedValue(new Error('DB unavailable'))

    const pages = await getWebsitePages()
    expect(pages.length).toBeGreaterThan(0)
    expect(pages[0].slug).toBeDefined()
  })

  it('returns fallback pages when Payload returns empty', async () => {
    mockFind.mockResolvedValue({ docs: [] })

    const pages = await getWebsitePages()
    expect(pages.length).toBeGreaterThan(0)
  })
})

describe('getWebsitePage(slug)', () => {
  it('fetches a single page by slug with targeted query', async () => {
    mockFind.mockResolvedValue({
      docs: [
        {
          id: '1',
          slug: 'history',
          order: 10,
          en: { title: 'History', excerpt: 'desc' },
          lv: { title: 'Vēsture', excerpt: 'desc' },
          layout: [],
          meta: { title: null, description: null, image: null, noIndex: null },
          _status: 'published',
        },
      ],
    })

    const page = await getWebsitePage('history')
    expect(page?.slug).toBe('history')
    expect(mockFind).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'pages',
        where: expect.objectContaining({
          slug: { equals: 'history' },
        }),
        limit: 1,
      }),
    )
  })

  it('returns fallback page when not found in Payload', async () => {
    mockFind.mockResolvedValue({ docs: [] })

    const page = await getWebsitePage('history')
    expect(page?.slug).toBe('history')
  })

  it('returns undefined for unknown slug with no fallback', async () => {
    mockFind.mockResolvedValue({ docs: [] })

    const page = await getWebsitePage('nonexistent-slug')
    expect(page).toBeUndefined()
  })

  it('returns fallback when Payload throws', async () => {
    mockFind.mockRejectedValue(new Error('DB unavailable'))

    const page = await getWebsitePage('history')
    expect(page?.slug).toBe('history')
  })
})

describe('getWebsiteEvents()', () => {
  it('returns events from Payload on success', async () => {
    mockFind.mockResolvedValue({
      docs: [
        {
          id: '1',
          slug: 'test-event',
          order: 1,
          accentTone: 'emerald',
          image: null,
          eventDate: null,
          isPast: false,
          en: { title: 'Test', body: 'Body' },
          lv: { title: 'Tests', body: 'Teksts' },
          _status: 'published',
        },
      ],
    })

    const events = await getWebsiteEvents()
    expect(events).toHaveLength(1)
    expect(events[0].slug).toBe('test-event')
  })

  it('returns fallback events when Payload throws', async () => {
    mockFind.mockRejectedValue(new Error('DB unavailable'))

    const events = await getWebsiteEvents()
    expect(events.length).toBeGreaterThan(0)
  })

  it('returns fallback events when empty', async () => {
    mockFind.mockResolvedValue({ docs: [] })

    const events = await getWebsiteEvents()
    expect(events.length).toBeGreaterThan(0)
  })
})

describe('getDonationSettings()', () => {
  it('returns settings from Payload on success', async () => {
    const mockData = {
      en: {
        bankName: 'Test Bank',
        bsb: '123-456',
        accountNumber: '789012',
        accountName: 'Test',
        payId: null,
        instructions: null,
      },
      lv: {
        bankName: 'Test Banka',
        bsb: '123-456',
        accountNumber: '789012',
        accountName: 'Test',
        payId: null,
        instructions: null,
      },
      donationOptions: [],
      priorityLinks: [],
      features: [],
    }
    mockFindGlobal.mockResolvedValue(mockData)

    const settings = await getDonationSettings()
    expect(settings.en.bankName).toBe('Test Bank')
    expect(settings.lv.bankName).toBe('Test Banka')
    expect(mockFindGlobal).toHaveBeenCalledWith(
      expect.objectContaining({ slug: 'donation-settings' }),
    )
  })

  it('returns fallback settings when Payload throws', async () => {
    mockFindGlobal.mockRejectedValue(new Error('DB unavailable'))

    const settings = await getDonationSettings()
    expect(settings.en).toBeDefined()
    expect(settings.lv).toBeDefined()
  })
})

describe('getSpecialPage()', () => {
  it('returns fallback for known slug when Payload has no draft nor published doc', async () => {
    // First call finds no published doc
    mockFind.mockResolvedValueOnce({ docs: [] })
    // Second call finds no draft doc → will create new doc from fallback
    mockFind.mockResolvedValueOnce({ docs: [] })

    mockCreate.mockResolvedValue({})

    const page = await getSpecialPage('about')
    expect(page?.slug).toBe('about')
    // Should have created the page from fallback
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'special-pages',
        data: expect.objectContaining({ slug: 'about' }),
      }),
    )
  })

  it('returns undefined for unknown slug', async () => {
    mockFind.mockResolvedValue({ docs: [] })
    const page = await getSpecialPage('nonexistent')
    expect(page).toBeUndefined()
  })

  it('returns fallback when Payload throws', async () => {
    mockFind.mockRejectedValue(new Error('DB unavailable'))

    const page = await getSpecialPage('about')
    expect(page?.slug).toBe('about')
  })
})

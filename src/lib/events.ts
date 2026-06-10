import type { Event as PayloadEvent } from '@/payload-types'
import { contentByLang } from '@/app/(frontend)/i18n/content'
import { getPayloadClient } from './payload'

export type EventAccent = 'emerald' | 'amber' | 'sky' | 'rose' | 'violet' | 'slate'

export type WebsiteEvent = {
  slug: string
  order: number
  accentTone: EventAccent
  image?: string
  en: {
    title: string
    body: string
  }
  lv: {
    title: string
    body: string
  }
}

const fallbackImageBySlug: Record<string, string> = {
  lieldienas: '/images/img2.webp',
  may4: '/images/may4.png',
  jani: '/images/img3.webp',
  'baltijas-cels': '/images/img4.webp',
  nov18: '/images/nov18.png',
}

const fallbackAccentBySlug: Record<string, EventAccent> = {
  lieldienas: 'emerald',
  may4: 'sky',
  jani: 'amber',
  'baltijas-cels': 'rose',
  nov18: 'violet',
}

export const fallbackEvents: WebsiteEvent[] = contentByLang.en.events.items.map((event, index) => {
  const latvian = contentByLang.lv.events.items.find((item) => item.id === event.id)

  return {
    slug: event.id,
    order: (index + 1) * 10,
    accentTone: fallbackAccentBySlug[event.id] ?? 'slate',
    image: fallbackImageBySlug[event.id],
    en: {
      title: event.title,
      body: event.body,
    },
    lv: {
      title: latvian?.title ?? event.title,
      body: latvian?.body ?? event.body,
    },
  }
})

function mediaURL(value: PayloadEvent['image']): string | undefined {
  if (value && typeof value === 'object' && 'url' in value && typeof value.url === 'string') {
    return value.url
  }
}

export async function getWebsiteEvents(): Promise<WebsiteEvent[]> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'events',
      depth: 1,
      limit: 100,
      pagination: false,
      sort: 'order',
      where: {
        _status: {
          equals: 'published',
        },
      },
    })

    return result.docs.map((event) => ({
      slug: event.slug,
      order: event.order,
      accentTone: event.accentTone,
      image: mediaURL(event.image) ?? fallbackImageBySlug[event.slug],
      en: event.en,
      lv: event.lv,
    }))
  } catch (error) {
    console.warn('[events] Payload events unavailable.', error)
    return []
  }
}

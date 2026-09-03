import { cache } from 'react'
import type { Event as PayloadEvent } from '@/payload-types'
import { mediaURL } from '@/lib/media'
import { contentByLang } from '@/app/(frontend)/i18n/content'
import { getPayloadClient } from './payload'

import { isEventPast, type WebsiteEvent, type EventAccent } from './eventUtils'

export { isEventPast, type WebsiteEvent, type EventAccent }

const fallbackImageBySlug: Record<string, string> = {
  lieldienas: '/images/img2.webp',
  may4: '/images/may4.png',
  jani: '/images/img3.webp',
  'baltijas-cels': '/images/img4.webp',
  nov18: '/images/nov18.png',
  'past-lieldienas-2025': '/images/img2.webp',
  'past-jani-2025': '/images/img3.webp',
  'past-nov18-2025': '/images/nov18.png',
}

const fallbackAccentBySlug: Record<string, EventAccent> = {
  lieldienas: 'emerald',
  may4: 'sky',
  jani: 'amber',
  'baltijas-cels': 'rose',
  nov18: 'violet',
  'past-lieldienas-2025': 'emerald',
  'past-jani-2025': 'amber',
  'past-nov18-2025': 'violet',
}

const fallbackDateBySlug: Record<string, string> = {
  lieldienas: '2026-04-05',
  may4: '2026-05-04',
  jani: '2026-06-23',
  'baltijas-cels': '2026-08-23',
  nov18: '2026-11-18',
}

const fallbackDateTextEnBySlug: Record<string, string> = {
  lieldienas: 'April 5, 2026',
  may4: 'May 4, 2026',
  jani: 'June 23, 2026',
  'baltijas-cels': 'August 23, 2026',
  nov18: 'November 18, 2026',
}

const fallbackDateTextLvBySlug: Record<string, string> = {
  lieldienas: '2026. gada 5. aprīlis',
  may4: '2026. gada 4. maijs',
  jani: '2026. gada 23. jūnijs',
  'baltijas-cels': '2026. gada 23. augusts',
  nov18: '2026. gada 18. novembris',
}

const baseFallbackEvents: WebsiteEvent[] = contentByLang.en.events.items.map((event, index) => {
  const latvian = contentByLang.lv.events.items.find((item) => item.id === event.id)

  return {
    slug: event.id,
    order: (index + 1) * 10,
    accentTone: fallbackAccentBySlug[event.id] ?? 'slate',
    image: fallbackImageBySlug[event.id],
    eventDate: fallbackDateBySlug[event.id],
    isPast: false,
    en: {
      title: event.title,
      body: event.body,
      dateText: fallbackDateTextEnBySlug[event.id],
    },
    lv: {
      title: latvian?.title ?? event.title,
      body: latvian?.body ?? event.body,
      dateText: fallbackDateTextLvBySlug[event.id],
    },
  }
})

const pastFallbackEvents: WebsiteEvent[] = [
  {
    slug: 'past-lieldienas-2025',
    order: 100,
    accentTone: 'emerald',
    image: '/images/img2.webp',
    isPast: true,
    eventDate: '2025-04-20',
    en: {
      title: 'Lieldienas 2025 – Easter Celebration in Darwin',
      body: 'Our 2025 Lieldienas gathering brought together dozens of families for traditional egg rolling, natural botanical dyeing workshops, and festive community meals in the heart of Darwin.',
      dateText: 'April 20, 2025',
    },
    lv: {
      title: 'Lieldienas 2025 – Lieldienu svinības Dārvinā',
      body: 'Mūsu 2025. gada Lieldienu pasākums pulcēja desmitiem ģimeņu uz tradicionālo olu ripināšanu, dabīgo augu krāsošanas darbnīcām un svētku maltīti Dārvinā.',
      dateText: '2025. gada 20. aprīlis',
    },
  },
  {
    slug: 'past-jani-2025',
    order: 110,
    accentTone: 'amber',
    image: '/images/img3.webp',
    isPast: true,
    eventDate: '2025-06-23',
    en: {
      title: 'Jāņi 2025 – Midsummer Celebration',
      body: 'A memorable evening under the Top End stars with Līgo songs, flower wreath weaving, traditional caraway cheese, and a magnificent bonfire.',
      dateText: 'June 23, 2025',
    },
    lv: {
      title: 'Jāņi 2025 – Vasaras saulgriežu svinības',
      body: 'Neaizmirstams vakars zem Top End zvaigznēm ar Līgo dziesmām, ziedu vainagu pīšanu, ķimeņu sieru un krāšņu ugunskuru.',
      dateText: '2025. gada 23. jūnijs',
    },
  },
  {
    slug: 'past-nov18-2025',
    order: 120,
    accentTone: 'violet',
    image: '/images/nov18.png',
    isPast: true,
    eventDate: '2025-11-18',
    en: {
      title: '18. novembris 2025 – Proclamation Day Celebration',
      body: 'The Darwin diaspora gathered for formal speeches, musical performances, and shared national pride to celebrate the 107th anniversary of Latvia’s independence proclamation.',
      dateText: 'November 18, 2025',
    },
    lv: {
      title: '18. novembris 2025 – Latvijas Republikas proklamēšanas diena',
      body: 'Dārvinas diaspora pulcējās uz svinīgām uzrunām, muzikāliem priekšnesumiem un kopīgu valsts lepnumu, atzīmējot Latvijas Republikas proklamēšanas 107. gadadienu.',
      dateText: '2025. gada 18. novembris',
    },
  },
]

export const fallbackEvents: WebsiteEvent[] = [...baseFallbackEvents, ...pastFallbackEvents]

export const getWebsiteEvents = cache(async (): Promise<WebsiteEvent[]> => {
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

    if (!result.docs.length) {
      return fallbackEvents
    }

    return result.docs.map((event) => ({
      slug: event.slug,
      order: event.order,
      accentTone: event.accentTone,
      image: mediaURL(event.image) ?? fallbackImageBySlug[event.slug],
      eventDate: event.eventDate ?? fallbackDateBySlug[event.slug],
      facebookUrl: (event as any).facebookUrl?.trim() || undefined,
      isPast: Boolean(event.isPast),
      en: event.en,
      lv: event.lv,
    }))
  } catch (error) {
    console.warn('[events] Payload events unavailable; using fallback events.', error)
    return fallbackEvents
  }
})

export const getWebsiteEvent = cache(async (slug: string): Promise<WebsiteEvent | null> => {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'events',
      depth: 1,
      limit: 1,
      pagination: false,
      where: {
        _status: { equals: 'published' },
        slug: { equals: slug },
      },
    })

    if (result.docs.length > 0) {
      const event = result.docs[0]
      return {
        slug: event.slug,
        order: event.order,
        accentTone: event.accentTone,
        image: mediaURL(event.image) ?? fallbackImageBySlug[event.slug],
        eventDate: event.eventDate ?? fallbackDateBySlug[event.slug],
        facebookUrl: (event as any).facebookUrl?.trim() || undefined,
        isPast: Boolean(event.isPast),
        en: event.en,
        lv: event.lv,
      }
    }
  } catch (error) {
    console.warn('[events] Payload event "' + slug + '" unavailable; checking fallbacks.', error)
  }

  return fallbackEvents.find((e) => e.slug === slug) ?? null
})

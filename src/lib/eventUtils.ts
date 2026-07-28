export type EventAccent = 'emerald' | 'amber' | 'sky' | 'rose' | 'violet' | 'slate'

export type WebsiteEvent = {
  slug: string
  order: number
  accentTone: EventAccent
  image?: string
  eventDate?: string
  facebookUrl?: string
  isPast?: boolean
  en: {
    title: string
    body: string
    dateText?: string
  }
  lv: {
    title: string
    body: string
    dateText?: string
  }
}

export function isEventPast(event: WebsiteEvent): boolean {
  if (event.isPast) return true
  if (event.eventDate) {
    const d = new Date(event.eventDate)
    if (!isNaN(d.getTime())) {
      d.setHours(23, 59, 59, 999)
      return d.getTime() < Date.now()
    }
  }
  return false
}

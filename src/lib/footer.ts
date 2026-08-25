import { cache } from 'react'
import type { Footer as PayloadFooter } from '@/payload-types'
import { contentByLang } from '@/app/(frontend)/i18n/content'
import { getPayloadClient } from './payload'

export type FooterItem = {
  href: string
  en: string
  lv: string
  newTab?: boolean | null
}

export type FooterContent = {
  en: {
    tagline: string
    address: string
    rights: string
  }
  lv: {
    tagline: string
    address: string
    rights: string
  }
  items: FooterItem[]
}

export const fallbackFooter: FooterContent = {
  en: {
    tagline: contentByLang.en.footer.tagline,
    address: contentByLang.en.footer.address,
    rights: contentByLang.en.footer.rights,
  },
  lv: {
    tagline: contentByLang.lv.footer.tagline,
    address: contentByLang.lv.footer.address,
    rights: contentByLang.lv.footer.rights,
  },
  items: [
    { href: '/about', en: contentByLang.en.nav.about, lv: contentByLang.lv.nav.about },
    { href: '/history', en: contentByLang.en.nav.history, lv: contentByLang.lv.nav.history },
    { href: '/community', en: 'Community', lv: 'Kopiena' },
    { href: '/membership', en: 'Join the Association', lv: 'Pievienoties apvienībai' },
    { href: '/#events', en: contentByLang.en.nav.events, lv: contentByLang.lv.nav.events },
    { href: '/donate', en: contentByLang.en.nav.donate, lv: contentByLang.lv.nav.donate },
  ]
}

export const getFooter = cache(async (): Promise<FooterContent> => {
  try {
    const payload = await getPayloadClient()
    const footer = await payload.findGlobal({
      slug: 'footer',
      depth: 1,
    })

    return {
      en: footer.en,
      lv: footer.lv,
      items: footer.items || [],
    }
  } catch (error) {
    console.warn('[footer] Payload footer unavailable; using fallback content.', error)
    return fallbackFooter
  }
})

import { cache } from 'react'
import { getPayloadClient } from './payload'

export type MainMenuItem = {
  href: string
  en: string
  lv: string
  newTab?: boolean | null
}

export const fallbackMainMenu: MainMenuItem[] = [
  { href: '/about', en: 'About', lv: 'Par mums' },
  { href: '/history', en: 'History', lv: 'Vēsture' },
  { href: '/community', en: 'Community', lv: 'Kopiena' },
  { href: '/membership', en: 'Join', lv: 'Pievienoties' },
  { href: '/culture', en: 'Culture', lv: 'Kultūra' },
  { href: '/contact', en: 'Contact', lv: 'Kontakti' },
  { href: '/#events', en: 'Events', lv: 'Pasākumi' },
]

export const getMainMenu = cache(async (): Promise<MainMenuItem[]> => {
  try {
    const payload = await getPayloadClient()
    const menu = await payload.findGlobal({
      slug: 'main-menu',
    })

    return menu.items?.length ? menu.items : fallbackMainMenu
  } catch (error) {
    console.warn('[navigation] Payload main menu unavailable; using fallback menu.', error)
    return fallbackMainMenu
  }
})

import type { SiteSetting as PayloadSiteSettings } from '@/payload-types'
import { getPayloadClient } from './payload'

export type SiteSettingsContent = {
  en: {
    associationName: string
    tagline?: string | null
    contactEmail?: string | null
  }
  lv: {
    associationName: string
    tagline?: string | null
    contactEmail?: string | null
  }
  socialLinks?: {
    platform: string
    url: string
  }[]
}

export const fallbackSiteSettings: SiteSettingsContent = {
  en: {
    associationName: 'Latvian Association of Darwin',
    tagline: 'Dārvinas Latviešu Apvienība',
    contactEmail: 'hello@darwinlatvians.org',
  },
  lv: {
    associationName: 'Dārvinas Latviešu Apvienība',
    tagline: 'Latvian Association of Darwin',
    contactEmail: 'hello@darwinlatvians.org',
  },
  socialLinks: [],
}

export async function getSiteSettings(): Promise<SiteSettingsContent> {
  try {
    const payload = await getPayloadClient()
    const data = await payload.findGlobal({
      slug: 'site-settings',
      depth: 0,
    })

    return {
      en: data.en,
      lv: data.lv,
      socialLinks: data.socialLinks ?? [],
    }
  } catch (error) {
    console.warn('[siteSettings] Payload site settings unavailable; using fallback content.', error)
    return fallbackSiteSettings
  }
}

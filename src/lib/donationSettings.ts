import type { DonationSetting as PayloadDonationSettings } from '@/payload-types'
import { getPayloadClient } from './payload'

export type DonationSettingsContent = {
  localized?: Record<
    'en' | 'lv',
    {
      priorityLinks?: Array<{
        title: string
        body: string
        url?: string | null
        newTab?: boolean | null
      }>
      features?: string[]
      donationOptions?: Array<{
        amount: number
        body: string
        url?: string | null
        newTab?: boolean | null
      }>
    }
  >
  en: {
    bankName: string
    bsb: string
    accountNumber: string
    accountName: string
    payId?: string | null
    instructions?: string | null
  }
  lv: {
    bankName: string
    bsb: string
    accountNumber: string
    accountName: string
    payId?: string | null
    instructions?: string | null
  }
}

export const fallbackDonationSettings: DonationSettingsContent = {
  en: {
    bankName: 'Not configured',
    bsb: 'Not configured',
    accountNumber: 'Not configured',
    accountName: 'Latvian Association of Darwin',
    payId: 'Not configured',
    instructions: 'Enter verified donation details in Payload admin.',
  },
  lv: {
    bankName: 'Nav konfigurēts',
    bsb: 'Nav konfigurēts',
    accountNumber: 'Nav konfigurēts',
    accountName: 'Dārvinas Latviešu Apvienība',
    payId: 'Nav konfigurēts',
    instructions: 'Ievadiet pārbaudītu ziedojumu informāciju Payload administrācijā.',
  },
}

export async function getDonationSettings(): Promise<DonationSettingsContent> {
  try {
    const payload = await getPayloadClient()
    const data = await payload.findGlobal({
      slug: 'donation-settings',
      depth: 0,
    })

    const language = (value: 'en' | 'lv') => ({
      priorityLinks: data.priorityLinks?.map((item) => ({
        title: value === 'lv' ? item.lvTitle : item.enTitle,
        body: value === 'lv' ? item.lvBody : item.enBody,
        url: item.url,
        newTab: item.newTab,
      })),
      features: data.features?.map((item) => (value === 'lv' ? item.lvLabel : item.enLabel)),
      donationOptions: data.donationOptions?.map((item) => ({
        amount: item.amount,
        body: value === 'lv' ? item.lvBody : item.enBody,
        url: item.url,
        newTab: item.newTab,
      })),
    })

    return {
      en: data.en,
      lv: data.lv,
      localized: {
        en: language('en'),
        lv: language('lv'),
      },
    }
  } catch (error) {
    console.warn(
      '[donationSettings] Payload donation settings unavailable; using fallback content.',
      error,
    )
    return fallbackDonationSettings
  }
}

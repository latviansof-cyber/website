import type { DonationSetting as PayloadDonationSettings } from '@/payload-types'
import { getPayloadClient } from './payload'

export type DonationSettingsContent = {
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
    bankName: 'Bank',
    bsb: '000-000',
    accountNumber: '00-000-0000',
    accountName: 'Latvian Association of Darwin',
    payId: 'donate@latviansofdarwin.org.au',
    instructions: 'Use your bank app or PayID to send your donation.',
  },
  lv: {
    bankName: 'Banka',
    bsb: '000-000',
    accountNumber: '00-000-0000',
    accountName: 'Dārvinas Latviešu Apvienība',
    payId: 'donate@latviansofdarwin.org.au',
    instructions: 'Izmantojiet savu bankas lietotni vai PayID, lai nosūtītu ziedojumu.',
  },
}

export async function getDonationSettings(): Promise<DonationSettingsContent> {
  try {
    const payload = await getPayloadClient()
    const data = await payload.findGlobal({
      slug: 'donation-settings',
      depth: 0,
    })

    return {
      en: data.en,
      lv: data.lv,
    }
  } catch (error) {
    console.warn('[donationSettings] Payload donation settings unavailable; using fallback content.', error)
    return fallbackDonationSettings
  }
}

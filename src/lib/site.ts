export const SITE_NAME = 'Latvian Association of Darwin'
export const SITE_NAME_LV = 'Dārvinas Latviešu Apvienība'
export const SITE_DESCRIPTION =
  'A welcoming community for Latvians, Latvian descendants, and friends of Latvia in Darwin and across the Northern Territory.'
export const SITE_URL = new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://latviansofdarwin.org.au')
export const CONTACT_EMAIL = 'support@latviansofdarwin.org.au'

export function absoluteURL(path: string): string {
  try {
    return new URL(path, SITE_URL).toString()
  } catch {
    return SITE_URL.toString()
  }
}

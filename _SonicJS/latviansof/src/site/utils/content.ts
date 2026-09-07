/**
 * D1 Content Access Utilities for SonicJS
 *
 * Reads published records from the unified `documents` table and coerces each
 * row's JSON `data` blob into the typed shapes consumed by the site templates.
 * All external input (stored JSON) is treated as `unknown` and narrowed here.
 */

import type { D1Database } from '@cloudflare/workers-types'

export interface PageData {
  slug: string
  template: 'home' | 'content' | 'simple' | 'donate'
  sortOrder?: number | undefined
  title_en?: string | undefined
  title_lv?: string | undefined
  excerpt_en?: string | undefined
  excerpt_lv?: string | undefined
  body_en?: string | undefined
  body_lv?: string | undefined
  heroImage?: string | null | undefined
  ctaLabel_en?: string | undefined
  ctaLabel_lv?: string | undefined
  ctaHref?: string | undefined
  metaTitle_en?: string | undefined
  metaTitle_lv?: string | undefined
  metaDescription_en?: string | undefined
  metaDescription_lv?: string | undefined
  noIndex?: boolean | undefined
}

export interface EventData {
  slug: string
  title_en?: string | undefined
  title_lv?: string | undefined
  eventDate?: string | null | undefined
  body_en?: string | undefined
  body_lv?: string | undefined
  image?: string | null | undefined
  facebookUrl?: string | undefined
  accentTone?: 'emerald' | 'amber' | 'sky' | 'rose' | 'violet' | 'slate' | undefined
  sortOrder?: number | undefined
}

export interface NavItemData {
  href: string
  en: string
  lv: string
  newTab?: boolean | undefined
}

export type NavigationItem = NavItemData

export interface FooterItem {
  href: string
  en: string
  lv: string
  newTab?: boolean | undefined
}

export interface FooterData {
  tagline_en?: string | undefined
  tagline_lv?: string | undefined
  address_en?: string | undefined
  address_lv?: string | undefined
  rights_en?: string | undefined
  rights_lv?: string | undefined
  items?: FooterItem[] | undefined
}

export interface SocialLink {
  platform: string
  url: string
}

export interface PriorityLink {
  id?: string | undefined
  enTitle?: string | undefined
  enBody?: string | undefined
  lvTitle?: string | undefined
  lvBody?: string | undefined
  url?: string | null | undefined
  newTab?: boolean | undefined
}

export interface DonationOption {
  id?: string | undefined
  amount?: number | undefined
  enBody?: string | undefined
  lvBody?: string | undefined
  url?: string | null | undefined
  newTab?: boolean | undefined
}

export interface FeatureBadge {
  id?: string | undefined
  enLabel?: string | undefined
  lvLabel?: string | undefined
}

export interface SiteSettingsData {
  key?: string | undefined
  associationName_en?: string | undefined
  associationName_lv?: string | undefined
  tagline_en?: string | undefined
  tagline_lv?: string | undefined
  contactEmail?: string | undefined
  socialLinks?: SocialLink[] | undefined
  bankName_en?: string | undefined
  bankName_lv?: string | undefined
  bsb?: string | undefined
  accountNumber?: string | undefined
  accountName_en?: string | undefined
  accountName_lv?: string | undefined
  payId_en?: string | undefined
  payId_lv?: string | undefined
  instructions_en?: string | undefined
  instructions_lv?: string | undefined
  priorityLinks?: PriorityLink[] | undefined
  donationOptions?: DonationOption[] | undefined
  features?: FeatureBadge[] | undefined
}

// ---------------------------------------------------------------------------
// Unknown → typed narrowing helpers
// ---------------------------------------------------------------------------

function asRecord(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : []
}

function str(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined
}

function strOrNull(value: unknown): string | null {
  return typeof value === 'string' && value.length > 0 ? value : null
}

function num(value: unknown): number | undefined {
  return typeof value === 'number' ? value : undefined
}

function bool(value: unknown): boolean {
  return value === true
}

// ---------------------------------------------------------------------------
// Public coercion surface
// ---------------------------------------------------------------------------

/**
 * Normalize any persisted image reference into a URL usable in this site:
 *  - `/files/<key>` / absolute URLs / site-relative paths pass through;
 *  - legacy `{ url }` payload-media objects are unwrapped;
 *  - legacy Payload `/api/media/file/...` paths map to the production origin
 *    (hotlink) so no stored image ever renders broken during evaluation.
 */
export function resolveMediaUrl(value: unknown): string {
  if (typeof value === 'string' && value.length > 0) {
    if (value.startsWith('/api/')) return `https://latviansofdarwin.org.au${value}`
    return value
  }
  const rec = asRecord(value)
  const raw = str(rec.url) ?? str(rec.filename)
  if (!raw) return ''
  if (raw.startsWith('/api/')) return `https://latviansofdarwin.org.au${raw}`
  return raw
}

function coercePage(data: unknown): PageData {
  const rec = asRecord(data)
  const template = str(rec.template)
  const knownTemplate: PageData['template'] =
    template === 'home' || template === 'content' || template === 'simple' || template === 'donate'
      ? template
      : 'content'
  return {
    slug: str(rec.slug) ?? '',
    template: knownTemplate,
    sortOrder: num(rec.sortOrder),
    title_en: str(rec.title_en),
    title_lv: str(rec.title_lv),
    excerpt_en: str(rec.excerpt_en),
    excerpt_lv: str(rec.excerpt_lv),
    body_en: str(rec.body_en),
    body_lv: str(rec.body_lv),
    heroImage: strOrNull(rec.heroImage),
    ctaLabel_en: str(rec.ctaLabel_en),
    ctaLabel_lv: str(rec.ctaLabel_lv),
    ctaHref: str(rec.ctaHref),
    metaTitle_en: str(rec.metaTitle_en),
    metaTitle_lv: str(rec.metaTitle_lv),
    metaDescription_en: str(rec.metaDescription_en),
    metaDescription_lv: str(rec.metaDescription_lv),
    noIndex: bool(rec.noIndex),
  }
}

function coerceEvent(data: unknown): EventData {
  const rec = asRecord(data)
  const tone = str(rec.accentTone)
  const knownTone: EventData['accentTone'] =
    tone === 'emerald' || tone === 'amber' || tone === 'sky' || tone === 'rose' || tone === 'violet' || tone === 'slate'
      ? tone
      : undefined
  return {
    slug: str(rec.slug) ?? '',
    title_en: str(rec.title_en),
    title_lv: str(rec.title_lv),
    eventDate: strOrNull(rec.eventDate),
    body_en: str(rec.body_en),
    body_lv: str(rec.body_lv),
    image: strOrNull(rec.image),
    facebookUrl: str(rec.facebookUrl),
    accentTone: knownTone,
    sortOrder: num(rec.sortOrder),
  }
}

function coerceNavItems(data: unknown): NavigationItem[] {
  const items = asArray(asRecord(data).items)
  return items
    .map((item): NavigationItem | null => {
      const rec = asRecord(item)
      const href = str(rec.href)
      if (!href) return null
      return {
        href,
        en: str(rec.en) ?? href,
        lv: str(rec.lv) ?? href,
        newTab: bool(rec.newTab),
      }
    })
    .filter((item): item is NavigationItem => item !== null)
}

function coerceFooter(data: unknown): FooterData {
  const rec = asRecord(data)
  const items = asArray(rec.items)
    .map((item): FooterItem | null => {
      const r = asRecord(item)
      const href = str(r.href)
      if (!href) return null
      return { href, en: str(r.en) ?? href, lv: str(r.lv) ?? href, newTab: bool(r.newTab) }
    })
    .filter((item): item is FooterItem => item !== null)
  return {
    tagline_en: str(rec.tagline_en),
    tagline_lv: str(rec.tagline_lv),
    address_en: str(rec.address_en),
    address_lv: str(rec.address_lv),
    rights_en: str(rec.rights_en),
    rights_lv: str(rec.rights_lv),
    items: items.length > 0 ? items : undefined,
  }
}

function coerceSocialLinks(value: unknown): SocialLink[] {
  return asArray(value)
    .map((item): SocialLink | null => {
      const rec = asRecord(item)
      const url = str(rec.url)
      if (!url) return null
      return { platform: str(rec.platform) ?? url, url }
    })
    .filter((item): item is SocialLink => item !== null)
}

function coercePriorityLinks(value: unknown): PriorityLink[] {
  return asArray(value)
    .map((item): PriorityLink => {
      const rec = asRecord(item)
      return {
        id: str(rec.id),
        enTitle: str(rec.enTitle),
        enBody: str(rec.enBody),
        lvTitle: str(rec.lvTitle),
        lvBody: str(rec.lvBody),
        url: strOrNull(rec.url),
        newTab: bool(rec.newTab),
      }
    })
    .filter((p) => (p.enTitle || p.lvTitle) !== undefined)
}

function coerceDonationOptions(value: unknown): DonationOption[] {
  return asArray(value)
    .map((item): DonationOption => {
      const rec = asRecord(item)
      return {
        id: str(rec.id),
        amount: num(rec.amount),
        enBody: str(rec.enBody),
        lvBody: str(rec.lvBody),
        url: strOrNull(rec.url),
        newTab: bool(rec.newTab),
      }
    })
    .filter((d) => d.amount !== undefined)
}

function coerceFeatures(value: unknown): FeatureBadge[] {
  return asArray(value)
    .map((item): FeatureBadge => {
      const rec = asRecord(item)
      return {
        id: str(rec.id),
        enLabel: str(rec.enLabel),
        lvLabel: str(rec.lvLabel),
      }
    })
    .filter((f) => f.enLabel !== undefined || f.lvLabel !== undefined)
}

function coerceSiteSettings(data: unknown): SiteSettingsData {
  const rec = asRecord(data)
  return {
    key: str(rec.key),
    associationName_en: str(rec.associationName_en),
    associationName_lv: str(rec.associationName_lv),
    tagline_en: str(rec.tagline_en),
    tagline_lv: str(rec.tagline_lv),
    contactEmail: str(rec.contactEmail),
    socialLinks: coerceSocialLinks(rec.socialLinks),
    bankName_en: str(rec.bankName_en),
    bankName_lv: str(rec.bankName_lv),
    bsb: str(rec.bsb),
    accountNumber: str(rec.accountNumber),
    accountName_en: str(rec.accountName_en),
    accountName_lv: str(rec.accountName_lv),
    payId_en: str(rec.payId_en),
    payId_lv: str(rec.payId_lv),
    instructions_en: str(rec.instructions_en),
    instructions_lv: str(rec.instructions_lv),
    priorityLinks: coercePriorityLinks(rec.priorityLinks),
    donationOptions: coerceDonationOptions(rec.donationOptions),
    features: coerceFeatures(rec.features),
  }
}

// ---------------------------------------------------------------------------
// Query helpers
// ---------------------------------------------------------------------------

async function fetchRows(db: D1Database, typeId: string, slug?: string) {
  if (slug !== undefined) {
    const row = await db
      .prepare(
        `SELECT id, root_id, type_id, slug, title, sort_order, data, published_at
         FROM documents
         WHERE type_id = ? AND slug = ? AND is_published = 1 AND deleted_at IS NULL
         LIMIT 1`
      )
      .bind(typeId, slug)
      .first()
    return row ? [row] : []
  }
  const { results } = await db
    .prepare(
      `SELECT id, root_id, type_id, slug, title, sort_order, data, published_at
       FROM documents
       WHERE type_id = ? AND is_published = 1 AND deleted_at IS NULL
       ORDER BY sort_order ASC, created_at DESC`
    )
    .bind(typeId)
    .all()
  return results || []
}

function docData(row: unknown): Record<string, unknown> {
  if (row === null || typeof row !== 'object') return {}
  const rec = row as Record<string, unknown>
  const raw = rec.data
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw) as unknown
      return asRecord(parsed)
    } catch {
      return {}
    }
  }
  return asRecord(raw)
}

export async function getPublishedPageBySlug(db: D1Database, slug: string): Promise<PageData | null> {
  const rows = await fetchRows(db, 'pages', slug)
  return rows.length > 0 ? coercePage(docData(rows[0])) : null
}

export async function getAllPublishedPages(db: D1Database): Promise<PageData[]> {
  const rows = await fetchRows(db, 'pages')
  return rows.map((row) => coercePage(docData(row)))
}

export async function getPublishedEventBySlug(db: D1Database, slug: string): Promise<EventData | null> {
  const rows = await fetchRows(db, 'events', slug)
  return rows.length > 0 ? coerceEvent(docData(rows[0])) : null
}

export async function getAllPublishedEvents(db: D1Database): Promise<EventData[]> {
  const rows = await fetchRows(db, 'events')
  return rows.map((row) => coerceEvent(docData(row)))
}

/** Chronological comparator: dated events by ISO date asc, undated events last. */
export function compareEventsByDate(a: EventData, b: EventData): number {
  const ta = a.eventDate ? Date.parse(a.eventDate) : NaN
  const tb = b.eventDate ? Date.parse(b.eventDate) : NaN
  if (Number.isNaN(ta) && Number.isNaN(tb)) return (a.sortOrder ?? 10) - (b.sortOrder ?? 10)
  if (Number.isNaN(ta)) return 1
  if (Number.isNaN(tb)) return -1
  return ta - tb
}

/** True when the event has a date in the future (or no date at all). */
export function isEventUpcoming(event: EventData, now: number = Date.now()): boolean {
  if (!event.eventDate) return true
  const t = Date.parse(event.eventDate)
  return Number.isNaN(t) || t >= now
}

export async function getNavigationItems(db: D1Database): Promise<NavigationItem[]> {
  const rows = await fetchRows(db, 'navigation', 'main-menu')
  if (rows.length === 0) return []
  const items = coerceNavItems(docData(rows[0]))
  if (items.length > 0) return items
  return [
    { href: '/history', en: 'History', lv: 'Vēsture' },
    { href: '/membership', en: 'Join', lv: 'Pievienoties' },
    { href: '/#events', en: 'Events', lv: 'Pasākumi' },
    { href: '/donate', en: 'Donate', lv: 'Ziedot' },
  ]
}

export async function getFooterData(db: D1Database): Promise<FooterData> {
  const rows = await fetchRows(db, 'footer', 'default-footer')
  if (rows.length === 0) return {}
  const footer = coerceFooter(docData(rows[0]))
  return {
    ...footer,
    tagline_en: footer.tagline_en ?? 'Connecting Latvians in the Top End.',
    tagline_lv: footer.tagline_lv ?? 'Vienojot latviešus Ziemeļu Teritorijā.',
    address_en: footer.address_en ?? 'Darwin, Northern Territory, Australia',
    address_lv: footer.address_lv ?? 'Dārvina, Ziemeļu Teritorija, Austrālija',
    rights_en: footer.rights_en ?? 'All rights reserved.',
    rights_lv: footer.rights_lv ?? 'Visas tiesības aizsargātas.',
    items: footer.items ?? [
      { href: '/about', en: 'About', lv: 'Par mums' },
      { href: '/contact', en: 'Contacts', lv: 'Kontakti' },
      { href: '/privacy', en: 'Privacy Policy', lv: 'Privātuma politika' },
      { href: '/terms', en: 'Terms & Conditions', lv: 'Lietošanas noteikumi' },
      { href: '/eula', en: 'EULA', lv: 'EULA' },
    ],
  }
}

export async function getSiteSettings(db: D1Database): Promise<SiteSettingsData> {
  const rows = await fetchRows(db, 'site_settings', 'default-settings')
  const stored = rows.length > 0 ? coerceSiteSettings(docData(rows[0])) : {}

  const fallback: SiteSettingsData = {
    associationName_en: 'Latvian Association of Darwin',
    associationName_lv: 'Dārvinas Latviešu Apvienība',
    contactEmail: 'support@latviansofdarwin.org.au',
    socialLinks: [{ platform: 'Facebook', url: 'https://www.facebook.com/darwinlatvians' }],
    bankName_en: 'Bendigo Bank',
    bankName_lv: 'Bendigo Bank',
    bsb: '633-000',
    accountNumber: '210814547',
    accountName_en: 'Latvian Association of Darwin',
    accountName_lv: 'Latvian Association of Darwin Inc',
    payId_en: 'Not configured',
    payId_lv: 'Nav konfigurēts',
    instructions_en: 'Enter the verified association bank account and PayID details before accepting donations.',
    instructions_lv: 'Pirms ziedojumu pieņemšanas ievadiet pārbaudītu apvienības bankas kontu un PayID informāciju.',
  }

  return {
    ...fallback,
    ...stored,
    socialLinks: stored.socialLinks && stored.socialLinks.length > 0 ? stored.socialLinks : fallback.socialLinks,
  }
}

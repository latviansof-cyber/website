/**
 * Snapshot shapes for the KV-published public site.
 *
 * These are plain JSON structures — no functions, no class instances — so a
 * snapshot round-trips through `JSON.stringify` / `JSON.parse` unchanged.
 */

import type {
  EventData,
  FooterSections,
  NavigationItem,
  PageData,
  SiteSettingsData,
  TrustedPartner,
} from '../utils/content'

/** Which template renders a public route. */
export type PublicPageKind = 'home' | 'donate' | 'page' | 'event'

/** Content every public page needs regardless of kind. */
export interface PublicSharedSnapshot {
  navItems: NavigationItem[]
  footerSections: FooterSections
  settings: SiteSettingsData
  trustedPartners: TrustedPartner[]
}

/** Everything needed to render one public URL without touching D1. */
export interface PublicRouteSnapshot {
  path: string
  lang: 'en' | 'lv'
  kind: PublicPageKind
  slug?: string | undefined
  /** The page document for `kind: 'page'`, `'donate'`, and the home document for `kind: 'home'`. */
  page?: PageData | undefined
  /** The event document for `kind: 'event'`. */
  event?: EventData | undefined
  /** Homepage content cards (`kind: 'home'` only). */
  pages?: PageData[] | undefined
  /** Homepage events, upcoming first then past (`kind: 'home'` only). */
  events?: EventData[] | undefined
  shared: PublicSharedSnapshot
}

/** Full public site content, as read from D1 in one pass. */
export interface PublicContent extends PublicSharedSnapshot {
  pages: PageData[]
  events: EventData[]
}

/** The complete published snapshot stored in KV. */
export interface PublicSiteSnapshot {
  generatedAt: string
  paths: string[]
  routes: Record<string, PublicRouteSnapshot>
}

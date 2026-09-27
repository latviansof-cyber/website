/**
 * KV key layout for the published public site snapshot.
 *
 * Keys are current-only on purpose: each publish overwrites the previous value,
 * so KV never accumulates historical versions. Keep every key in this module so
 * writers and readers cannot drift apart.
 */

export const SITEMAP_JSON_KEY = 'public:site:sitemap'
export const SITEMAP_XML_KEY = 'public:site:sitemap.xml'
export const ROBOTS_TXT_KEY = 'public:site:robots.txt'
export const GENERATED_AT_KEY = 'public:site:generatedAt'

/** Prefix shared by every per-route page key. */
export const PAGE_KEY_PREFIX = 'public:site:page:'

/** KV page key for an already-normalized public path, e.g. `/en/about`. */
export function pageKey(path: string): string {
  return `${PAGE_KEY_PREFIX}${path}`
}

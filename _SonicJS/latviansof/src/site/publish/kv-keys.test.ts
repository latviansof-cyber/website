import { describe, expect, it } from 'vitest'
import {
  GENERATED_AT_KEY,
  PAGE_KEY_PREFIX,
  ROBOTS_TXT_KEY,
  SITEMAP_JSON_KEY,
  SITEMAP_XML_KEY,
  pageKey,
} from './kv-keys'

describe('public site KV keys', () => {
  it('uses the published metadata key names', () => {
    expect(SITEMAP_JSON_KEY).toBe('public:site:sitemap')
    expect(SITEMAP_XML_KEY).toBe('public:site:sitemap.xml')
    expect(ROBOTS_TXT_KEY).toBe('public:site:robots.txt')
    expect(GENERATED_AT_KEY).toBe('public:site:generatedAt')
  })

  it('namespaces page keys under a single prefix', () => {
    expect(pageKey('/en/about')).toBe('public:site:page:/en/about')
    expect(pageKey('/lv/events/jani')).toBe('public:site:page:/lv/events/jani')
    expect(pageKey('/en')).toBe(`${PAGE_KEY_PREFIX}/en`)
  })

  it('never produces whitespace in a key', () => {
    const keys = [SITEMAP_JSON_KEY, SITEMAP_XML_KEY, ROBOTS_TXT_KEY, GENERATED_AT_KEY, pageKey('/en')]

    for (const key of keys) expect(key).not.toMatch(/\s/)
  })

  it('keeps metadata keys out of the page-key prefix so cleanup cannot touch them', () => {
    const metadata = [SITEMAP_JSON_KEY, SITEMAP_XML_KEY, ROBOTS_TXT_KEY, GENERATED_AT_KEY]

    for (const key of metadata) expect(key.startsWith(PAGE_KEY_PREFIX)).toBe(false)
  })
})

import { describe, expect, it } from 'vitest'
import type { KVNamespace } from '@cloudflare/workers-types'
import { GENERATED_AT_KEY, pageKey } from './kv-keys'
import { writePublicSnapshotToKv } from './write-public-snapshot'
import type { PublicSiteSnapshot } from './types'

type StoredKey = { name: string }

function createKv(initial: Record<string, string> = {}) {
  const store = new Map(Object.entries(initial))
  const writes: string[] = []

  const kv = {
    async get(key: string) {
      return store.get(key) ?? null
    },
    async put(key: string, value: string) {
      writes.push(key)
      store.set(key, value)
    },
    async delete(key: string) {
      store.delete(key)
    },
    async list(options?: { prefix?: string; cursor?: string }) {
      const keys: StoredKey[] = []
      for (const name of store.keys()) {
        if (!options?.prefix || name.startsWith(options.prefix)) keys.push({ name })
      }
      return { keys, list_complete: true }
    },
  } as unknown as KVNamespace

  return { kv, store, writes }
}

const minimalSnapshot: PublicSiteSnapshot = {
  generatedAt: '2026-09-24T01:45:00.000Z',
  paths: ['/en'],
  routes: {
    '/en': {
      path: '/en',
      lang: 'en',
      kind: 'home',
      pages: [],
      events: [],
      shared: {
        navItems: [],
        footerSections: {
          identity: {
            tagline_en: '',
            tagline_lv: '',
            address_en: '',
            address_lv: '',
          },
          quickLinks: [],
          resources: [],
          getInvolved: {
            blurb_en: '',
            blurb_lv: '',
            donateLabel_en: '',
            donateLabel_lv: '',
          },
        },
        trustedPartners: [],
        settings: {},
      },
    },
  },
}

describe('writePublicSnapshotToKv', () => {
  it('removes stale page keys before writing the publish marker', async () => {
    const { kv, store, writes } = createKv({
      [pageKey('/en/old-page')]: JSON.stringify({ stale: true }),
    })

    const result = await writePublicSnapshotToKv(
      kv,
      'https://latviansofdarwin.org.au',
      minimalSnapshot,
    )

    expect(result.deletedKeys).toBe(1)
    expect(store.has(pageKey('/en/old-page'))).toBe(false)
    expect(store.has(pageKey('/en'))).toBe(true)
    expect(writes.indexOf(GENERATED_AT_KEY)).toBeGreaterThan(writes.indexOf(pageKey('/en')))
  })
})

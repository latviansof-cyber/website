import { describe, it, expect } from 'vitest'
import { migrations } from '@/migrations'

describe('Payload migrations', () => {
  it('registers migrations in the index', () => {
    expect(migrations.length).toBeGreaterThan(0)
  })

  it('has unique migration names', () => {
    const names = migrations.map((m) => m.name)
    const uniqueNames = new Set(names)
    expect(uniqueNames.size).toBe(names.length)
  })

  it('all migration names are non-empty strings', () => {
    for (const m of migrations) {
      expect(typeof m.name).toBe('string')
      expect(m.name.length).toBeGreaterThan(0)
    }
  })

  it('every migration exports up and down functions', () => {
    for (const m of migrations) {
      expect(typeof m.up).toBe('function')
      expect(typeof m.down).toBe('function')
    }
  })

  it('migrations are ordered chronologically', () => {
    for (let i = 1; i < migrations.length; i++) {
      // Names are timestamp-prefixed — lexicographic sort equals chronological
      expect(migrations[i].name.localeCompare(migrations[i - 1].name)).toBeGreaterThanOrEqual(0)
    }
  })
})

import * as migration_20250929_111647 from './20250929_111647'
import * as migration_20260609_053333_block_pages from './20260609_053333_block_pages'

export const migrations = [
  {
    up: migration_20250929_111647.up,
    down: migration_20250929_111647.down,
    name: '20250929_111647',
  },
  {
    up: migration_20260609_053333_block_pages.up,
    down: migration_20260609_053333_block_pages.down,
    name: '20260609_053333_block_pages',
  },
]

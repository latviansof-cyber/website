import * as migration_20250929_111647 from './20250929_111647';
import * as migration_20260609_053333_block_pages from './20260609_053333_block_pages';
import * as migration_20260609_122916 from './20260609_122916';
import * as migration_20260609_123744 from './20260609_123744';

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
  {
    up: migration_20260609_122916.up,
    down: migration_20260609_122916.down,
    name: '20260609_122916',
  },
  {
    up: migration_20260609_123744.up,
    down: migration_20260609_123744.down,
    name: '20260609_123744'
  },
];

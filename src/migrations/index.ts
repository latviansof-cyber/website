import * as migration_20250929_111647 from './20250929_111647';
import * as migration_20260609_053333_block_pages from './20260609_053333_block_pages';
import * as migration_20260609_122916 from './20260609_122916';
import * as migration_20260609_123744 from './20260609_123744';
import * as migration_20260609_152706_add_culture_contact_pages from './20260609_152706_add_culture_contact_pages';
import * as migration_20260609_153453_add_events_collection from './20260609_153453_add_events_collection';
import * as migration_20260610_073953 from './20260610_073953';
import * as migration_20260610_074744 from './20260610_074744';
import * as migration_20260610_103232_add_footer_and_special_pages from './20260610_103232_add_footer_and_special_pages';
import * as migration_20260610_105121_move_about_to_special_pages from './20260610_105121_move_about_to_special_pages';
import * as migration_20260610_112000_backfill_event_versions from './20260610_112000_backfill_event_versions';
import * as migration_20260610_113750_move_contact_to_special_pages from './20260610_113750_move_contact_to_special_pages';
import * as migration_20260611_105341 from './20260611_105341';
import * as migration_20260611_194132_backfill_special_page_versions from './20260611_194132_backfill_special_page_versions';
import * as migration_20260611_201944_repair_page_versions from './20260611_201944_repair_page_versions';
import * as migration_20260728_041536 from './20260728_041536';
import * as migration_20260728_042055 from './20260728_042055';
import * as migration_20260728_074335 from './20260728_074335';

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
    name: '20260609_123744',
  },
  {
    up: migration_20260609_152706_add_culture_contact_pages.up,
    down: migration_20260609_152706_add_culture_contact_pages.down,
    name: '20260609_152706_add_culture_contact_pages',
  },
  {
    up: migration_20260609_153453_add_events_collection.up,
    down: migration_20260609_153453_add_events_collection.down,
    name: '20260609_153453_add_events_collection',
  },
  {
    up: migration_20260610_073953.up,
    down: migration_20260610_073953.down,
    name: '20260610_073953',
  },
  {
    up: migration_20260610_074744.up,
    down: migration_20260610_074744.down,
    name: '20260610_074744',
  },
  {
    up: migration_20260610_103232_add_footer_and_special_pages.up,
    down: migration_20260610_103232_add_footer_and_special_pages.down,
    name: '20260610_103232_add_footer_and_special_pages',
  },
  {
    up: migration_20260610_105121_move_about_to_special_pages.up,
    down: migration_20260610_105121_move_about_to_special_pages.down,
    name: '20260610_105121_move_about_to_special_pages',
  },
  {
    up: migration_20260610_112000_backfill_event_versions.up,
    down: migration_20260610_112000_backfill_event_versions.down,
    name: '20260610_112000_backfill_event_versions',
  },
  {
    up: migration_20260610_113750_move_contact_to_special_pages.up,
    down: migration_20260610_113750_move_contact_to_special_pages.down,
    name: '20260610_113750_move_contact_to_special_pages',
  },
  {
    up: migration_20260611_105341.up,
    down: migration_20260611_105341.down,
    name: '20260611_105341',
  },
  {
    up: migration_20260611_194132_backfill_special_page_versions.up,
    down: migration_20260611_194132_backfill_special_page_versions.down,
    name: '20260611_194132_backfill_special_page_versions',
  },
  {
    up: migration_20260611_201944_repair_page_versions.up,
    down: migration_20260611_201944_repair_page_versions.down,
    name: '20260611_201944_repair_page_versions',
  },
  {
    up: migration_20260728_041536.up,
    down: migration_20260728_041536.down,
    name: '20260728_041536',
  },
  {
    up: migration_20260728_042055.up,
    down: migration_20260728_042055.down,
    name: '20260728_042055',
  },
  {
    up: migration_20260728_074335.up,
    down: migration_20260728_074335.down,
    name: '20260728_074335'
  },
];

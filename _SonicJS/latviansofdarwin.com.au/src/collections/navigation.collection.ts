/**
 * Navigation Collection for SonicJS
 *
 * Manages header menu items with bilingual labels and links.
 */

import type { CollectionConfig } from '@sonicjs-cms/core'

export default {
  name: 'navigation',
  displayName: 'Navigation',
  slug: 'navigation',
  description: 'Header navigation items',
  icon: '🧭',

  schema: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        title: 'Menu Identifier',
        required: true,
        default: 'main-menu',
      },
      items: {
        type: 'json',
        title: 'Menu Items',
        description: 'Array of { href, en, lv, newTab }',
        default: [],
      },
    },
    required: ['name'],
  },

  listFields: ['name', 'updatedAt'],
  managed: true,
  isActive: true,

  access: {
    public: ['read'],
  },

  cache: {
    enabled: true,
    ttl: 120,
  },
} satisfies CollectionConfig

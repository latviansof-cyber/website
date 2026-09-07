/**
 * Footer Collection for SonicJS
 *
 * Manages bilingual footer details, addresses, rights, and links.
 */

import type { CollectionConfig } from '@sonicjs-cms/core'

export default {
  name: 'footer',
  displayName: 'Footer',
  slug: 'footer',
  description: 'Footer details and links',
  icon: '🦶',

  schema: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        title: 'Footer Identifier',
        required: true,
        default: 'default-footer',
      },
      tagline_en: {
        type: 'string',
        title: 'Tagline (English)',
      },
      tagline_lv: {
        type: 'string',
        title: 'Tagline (Latvian)',
      },
      address_en: {
        type: 'string',
        title: 'Address (English)',
      },
      address_lv: {
        type: 'string',
        title: 'Address (Latvian)',
      },
      rights_en: {
        type: 'string',
        title: 'Copyright Text (English)',
      },
      rights_lv: {
        type: 'string',
        title: 'Copyright Text (Latvian)',
      },
      items: {
        type: 'json',
        title: 'Footer Links',
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

/**
 * Footer Collection for SonicJS
 *
 * Holds four separately editable documents, each mapping to one footer column:
 *   footer-identity     — tagline + address (brand column)
 *   footer-quick-links  — quick links array
 *   footer-resources    — resources links array
 *   footer-get-involved — blurb text + donate button label
 */

import type { CollectionConfig } from '@sonicjs-cms/core'

export default {
  name: 'footer',
  displayName: 'Footer',
  slug: 'footer',
  description: 'Footer sections — edit each column separately (Identity, Quick Links, Resources, Get Involved)',
  icon: '🦶',

  schema: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        title: 'Section Identifier',
        required: true,
        default: 'footer-identity',
      },
      // ── Identity column ────────────────────────────────────────────────────
      tagline_en: {
        type: 'string',
        title: 'Tagline (English)',
        description: 'e.g. "Connecting Latvians in the Top End."',
      },
      tagline_lv: {
        type: 'string',
        title: 'Tagline (Latvian)',
      },
      address_en: {
        type: 'string',
        title: 'Address (English)',
        description: 'e.g. "Darwin, Northern Territory, Australia"',
      },
      address_lv: {
        type: 'string',
        title: 'Address (Latvian)',
      },
      // ── Quick Links / Resources columns ───────────────────────────────────
      items: {
        type: 'json',
        title: 'Links',
        description: 'Array of { href, en, lv, newTab } — used for Quick Links or Resources columns.',
        default: [],
      },
      // ── Get Involved column ───────────────────────────────────────────────
      blurb_en: {
        type: 'string',
        title: 'Blurb (English)',
        description: 'Short paragraph shown in the "Get Involved" column.',
      },
      blurb_lv: {
        type: 'string',
        title: 'Blurb (Latvian)',
      },
      donateLabel_en: {
        type: 'string',
        title: 'Donate Button Label (English)',
        description: 'e.g. "Donate"',
      },
      donateLabel_lv: {
        type: 'string',
        title: 'Donate Button Label (Latvian)',
        description: 'e.g. "Ziedot"',
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

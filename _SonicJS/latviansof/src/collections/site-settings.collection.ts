/**
 * Site Settings Collection for SonicJS
 *
 * Manages global association metadata, donation bank details, PayID,
 * priority links, and donation tier options.
 */

import type { CollectionConfig } from '@sonicjs-cms/core'

export default {
  name: 'site_settings',
  displayName: 'Site Settings',
  slug: 'site-settings',
  description: 'Global site configuration and donation settings',
  icon: '⚙️',

  schema: {
    type: 'object',
    properties: {
      key: {
        type: 'string',
        title: 'Settings Key',
        required: true,
        default: 'default-settings',
      },
      associationName_en: {
        type: 'string',
        title: 'Association Name (English)',
        default: 'Latvian Association of Darwin',
      },
      associationName_lv: {
        type: 'string',
        title: 'Association Name (Latvian)',
        default: 'Dārvinas Latviešu Apvienība',
      },
      contactEmail: {
        type: 'email',
        title: 'Contact Email',
        default: 'support@latviansofdarwin.org.au',
      },
      socialLinks: {
        type: 'json',
        title: 'Social Links',
        description: 'Array of { platform, url }',
        default: [],
      },
      tagline_en: {
        type: 'string',
        title: 'Tagline (English)',
        default: 'Latvian Association of Darwin',
      },
      tagline_lv: {
        type: 'string',
        title: 'Tagline (Latvian)',
        default: 'Dārvinas Latviešu Apvienība',
      },
      bankName_en: {
        type: 'string',
        title: 'Bank Name (English)',
        default: 'Bendigo Bank',
      },
      bankName_lv: {
        type: 'string',
        title: 'Bank Name (Latvian)',
        default: 'Bendigo Bank',
      },
      bsb: {
        type: 'string',
        title: 'BSB',
        default: '633-000',
      },
      accountNumber: {
        type: 'string',
        title: 'Account Number',
        default: '210814547',
      },
      accountName_en: {
        type: 'string',
        title: 'Account Name (English)',
        default: 'Latvian Association of Darwin',
      },
      accountName_lv: {
        type: 'string',
        title: 'Account Name (Latvian)',
        default: 'Latvian Association of Darwin Inc',
      },
      payId_en: {
        type: 'string',
        title: 'PayID (English)',
        default: 'Not configured',
      },
      payId_lv: {
        type: 'string',
        title: 'PayID (Latvian)',
        default: 'Nav konfigurēts',
      },
      instructions_en: {
        type: 'textarea',
        title: 'Donation Instructions (English)',
        default: '',
      },
      instructions_lv: {
        type: 'textarea',
        title: 'Donation Instructions (Latvian)',
        default: '',
      },
      priorityLinks: {
        type: 'json',
        title: 'Priority Need Areas',
        description: 'Array of { id, enTitle, enBody, lvTitle, lvBody }',
        default: [],
      },
      donationOptions: {
        type: 'json',
        title: 'Donation Preset Tiers',
        description: 'Array of { id, amount, enBody, lvBody, url, newTab }',
        default: [],
      },
      features: {
        type: 'json',
        title: 'Donation Badge Features',
        description: 'Array of { id, enLabel, lvLabel }',
        default: [],
      },
    },
    required: ['key'],
  },

  listFields: ['key', 'associationName_en', 'contactEmail', 'updatedAt'],
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

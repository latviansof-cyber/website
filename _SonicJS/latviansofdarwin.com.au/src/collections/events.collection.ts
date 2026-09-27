/**
 * Events Collection for SonicJS
 *
 * Manages community events with bilingual title, description,
 * event date, accent tone, and optional Facebook link.
 */

import type { CollectionConfig } from '@sonicjs-cms/core'

export default {
  name: 'events',
  displayName: 'Events',
  slug: 'events',
  description: 'Manage community events',
  icon: '📅',

  schema: {
    type: 'object',
    properties: {
      title_en: {
        type: 'string',
        title: 'Title (English)',
        required: true,
        maxLength: 250,
      },
      title_lv: {
        type: 'string',
        title: 'Title (Latvian)',
        required: true,
        maxLength: 250,
      },
      slug: {
        type: 'slug',
        title: 'URL Slug',
        required: true,
        maxLength: 100,
      },
      eventDate: {
        type: 'datetime',
        title: 'Event Date & Time',
      },
      body_en: {
        type: 'quill',
        title: 'Description (English)',
        required: true,
      },
      body_lv: {
        type: 'quill',
        title: 'Description (Latvian)',
        required: true,
      },
      image: {
        type: 'media',
        title: 'Event Image',
      },
      facebookUrl: {
        type: 'url',
        title: 'Facebook Event URL',
      },
      accentTone: {
        type: 'select',
        title: 'Accent Tone',
        enum: ['emerald', 'amber', 'sky', 'rose', 'violet', 'slate'],
        enumLabels: ['Emerald', 'Amber', 'Sky Blue', 'Rose Red', 'Violet', 'Slate'],
        default: 'rose',
        required: true,
      },
      sortOrder: {
        type: 'number',
        title: 'Sort Order',
        default: 10,
      },
    },
    required: ['title_en', 'title_lv', 'slug', 'body_en', 'body_lv', 'accentTone'],
  },

  listFields: ['title_en', 'slug', 'accentTone', 'eventDate', 'sortOrder', 'status'],
  searchFields: ['title_en', 'title_lv', 'slug', 'body_en', 'body_lv'],
  defaultSort: 'sortOrder',
  defaultSortOrder: 'asc',

  managed: true,
  isActive: true,

  access: {
    public: ['read'],
  },

  cache: {
    enabled: true,
    ttl: 60,
  },
} satisfies CollectionConfig

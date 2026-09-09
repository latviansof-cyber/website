/**
 * Pages Collection for SonicJS
 *
 * Manages all fixed site pages with bilingual support (EN/LV):
 * home, about, history, community, membership, culture, contact, donate, privacy, terms, eula
 */

import type { CollectionConfig } from '@sonicjs-cms/core'

export default {
  name: 'pages',
  displayName: 'Pages',
  slug: 'pages',
  description: 'Manage bilingual website pages',
  icon: '📄',

  schema: {
    type: 'object',
    properties: {
      slug: {
        type: 'slug',
        title: 'URL Slug',
        required: true,
        maxLength: 100,
      },
      template: {
        type: 'select',
        title: 'Page Template',
        enum: ['home', 'content', 'simple', 'donate'],
        enumLabels: ['Homepage', 'Content with Sidebar', 'Simple Article', 'Donation Page'],
        default: 'content',
        required: true,
      },
      sortOrder: {
        type: 'number',
        title: 'Sort Order',
        default: 10,
      },
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
      excerpt_en: {
        type: 'textarea',
        title: 'Excerpt (English)',
      },
      excerpt_lv: {
        type: 'textarea',
        title: 'Excerpt (Latvian)',
      },
      body_en: {
        type: 'quill',
        title: 'Body Content (English)',
      },
      body_lv: {
        type: 'quill',
        title: 'Body Content (Latvian)',
      },
      heroImage: {
        type: 'media',
        title: 'Hero / Feature Image',
      },
      ctaLabel_en: {
        type: 'string',
        title: 'CTA Button Label (English)',
      },
      ctaLabel_lv: {
        type: 'string',
        title: 'CTA Button Label (Latvian)',
      },
      ctaHref: {
        type: 'string',
        title: 'CTA Button Link',
      },
      metaTitle_en: {
        type: 'string',
        title: 'Meta Title (English)',
      },
      metaTitle_lv: {
        type: 'string',
        title: 'Meta Title (Latvian)',
      },
      metaDescription_en: {
        type: 'textarea',
        title: 'Meta Description (English)',
      },
      metaDescription_lv: {
        type: 'textarea',
        title: 'Meta Description (Latvian)',
      },
      noIndex: {
        type: 'boolean',
        title: 'Hide from search engines (noIndex)',
        default: false,
      },
    },
    required: ['slug', 'template', 'title_en', 'title_lv'],
  },

  listFields: ['title_en', 'slug', 'template', 'sortOrder', 'status'],
  searchFields: ['title_en', 'title_lv', 'slug', 'excerpt_en', 'excerpt_lv'],
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

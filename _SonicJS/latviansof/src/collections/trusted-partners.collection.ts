/** Editable homepage trusted partner entries. */
import type { CollectionConfig } from '@sonicjs-cms/core'

export default {
  name: 'trusted_partners',
  displayName: 'Trusted Partners',
  slug: 'trusted-partners',
  description: 'Manage the partner logos shown on the homepage',
  icon: '🤝',
  schema: {
    type: 'object',
    properties: {
      title: { type: 'string', title: 'Title', required: true, maxLength: 250 },
      description: { type: 'textarea', title: 'Description' },
      logo: { type: 'media', title: 'Logo' },
      url: { type: 'string', title: 'URL', required: true },
      sortOrder: { type: 'number', title: 'Sort Order', default: 10 },
    },
    required: ['title', 'url'],
  },
  listFields: ['title', 'url', 'sortOrder', 'status'],
  searchFields: ['title', 'description', 'url'],
  defaultSort: 'sortOrder',
  defaultSortOrder: 'asc',
  managed: true,
  isActive: true,
  access: { public: ['read'] },
  cache: { enabled: true, ttl: 60 },
} satisfies CollectionConfig

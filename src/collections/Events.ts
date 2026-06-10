import type { CollectionConfig } from 'payload'

const eventContentFields = (language: string) => [
  {
    name: 'title',
    type: 'text' as const,
    label: `${language} title`,
    required: true,
  },
  {
    name: 'body',
    type: 'textarea' as const,
    label: `${language} description`,
    required: true,
    admin: {
      rows: 8,
    },
  },
]

export const Events: CollectionConfig = {
  slug: 'events',
  labels: {
    singular: 'Event',
    plural: 'Events',
  },
  access: {
    create: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
    read: ({ req }) =>
      req.user
        ? true
        : {
            _status: {
              equals: 'published',
            },
          },
    update: ({ req }) => Boolean(req.user),
  },
  admin: {
    useAsTitle: 'adminTitle',
    defaultColumns: ['adminTitle', 'slug', 'order', 'accentTone', '_status', 'updatedAt'],
    group: 'Content',
  },
  defaultSort: 'order',
  fields: [
    {
      name: 'adminTitle',
      type: 'text',
      label: 'Internal title',
      required: true,
      admin: {
        description: 'Used only in the Payload admin.',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      validate: (value: unknown) => {
        if (typeof value !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
          return 'Use lowercase letters, numbers, and hyphens only.'
        }
        return true
      },
    },
    {
      name: 'order',
      type: 'number',
      required: true,
      defaultValue: 10,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'accentTone',
      type: 'select',
      required: true,
      defaultValue: 'rose',
      options: [
        { label: 'Emerald', value: 'emerald' },
        { label: 'Amber', value: 'amber' },
        { label: 'Sky', value: 'sky' },
        { label: 'Rose', value: 'rose' },
        { label: 'Violet', value: 'violet' },
        { label: 'Slate', value: 'slate' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Recommended: landscape image at least 1200 × 800 pixels.',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'English',
          fields: [
            {
              name: 'en',
              type: 'group',
              fields: eventContentFields('English'),
            },
          ],
        },
        {
          label: 'Latviski',
          fields: [
            {
              name: 'lv',
              type: 'group',
              fields: eventContentFields('Latvian'),
            },
          ],
        },
      ],
    },
  ],
  versions: {
    drafts: {
      autosave: true,
    },
  },
}

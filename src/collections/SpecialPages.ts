import type { CollectionConfig } from 'payload'

const specialPageFields = (language: string) => [
  {
    name: 'title',
    type: 'text' as const,
    label: `${language} title`,
    required: true,
  },
  {
    name: 'content',
    type: 'textarea' as const,
    label: `${language} content`,
    required: true,
    admin: {
      description: 'Separate paragraphs with a blank line.',
      rows: 15,
    },
  },
]

export const SpecialPages: CollectionConfig = {
  slug: 'special-pages',
  labels: {
    singular: 'Special Page',
    plural: 'Special Pages',
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
    defaultColumns: ['adminTitle', 'slug', '_status', 'updatedAt'],
    group: 'Content',
  },
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
      type: 'tabs',
      tabs: [
        {
          label: 'English',
          fields: [
            {
              name: 'en',
              type: 'group',
              fields: specialPageFields('English'),
            },
          ],
        },
        {
          label: 'Latviski',
          fields: [
            {
              name: 'lv',
              type: 'group',
              fields: specialPageFields('Latvian'),
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

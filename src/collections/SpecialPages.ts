import type { CollectionConfig } from 'payload'
import { slugValidator } from '@/lib/validation'

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
      validate: slugValidator,
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
    {
      name: 'meta',
      type: 'group',
      label: 'SEO and social sharing',
      fields: [
        {
          type: 'tabs',
          tabs: [
            {
              label: 'English',
              fields: [
                {
                  name: 'en',
                  type: 'group',
                  fields: [
                    {
                      name: 'title',
                      type: 'text',
                      label: 'English meta title',
                      maxLength: 60,
                      admin: {
                        description: 'Optional search title. Max 60 characters.',
                      },
                    },
                    {
                      name: 'description',
                      type: 'textarea',
                      label: 'English meta description',
                      maxLength: 160,
                      admin: {
                        description: 'Optional search description. Max 160 characters.',
                        rows: 3,
                      },
                    },
                  ],
                },
              ],
            },
            {
              label: 'Latviski',
              fields: [
                {
                  name: 'lv',
                  type: 'group',
                  fields: [
                    {
                      name: 'title',
                      type: 'text',
                      label: 'Latvian meta title',
                      maxLength: 60,
                      admin: {
                        description: 'Optional search title. Max 60 characters.',
                      },
                    },
                    {
                      name: 'description',
                      type: 'textarea',
                      label: 'Latvian meta description',
                      maxLength: 160,
                      admin: {
                        description: 'Optional search description. Max 160 characters.',
                        rows: 3,
                      },
                    },
                  ],
                },
              ],
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

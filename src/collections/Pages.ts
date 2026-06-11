import type { CollectionConfig } from 'payload'
import { slugValidator } from '@/lib/validation'
import { CallToAction } from '../blocks/CallToAction'
import { ContentBlock } from '../blocks/Content'
import { HeroBlock } from '../blocks/Hero'

const languageFields = (label: string) => [
  {
    name: 'title',
    type: 'text' as const,
    label: `${label} title`,
    required: true,
  },
  {
    name: 'excerpt',
    type: 'textarea' as const,
    label: `${label} excerpt`,
    required: true,
    admin: {
      description: 'A short summary used on cards and listing pages.',
      rows: 3,
    },
  },
]

export const Pages: CollectionConfig = {
  slug: 'pages',
  access: {
    read: ({ req }) =>
      req.user
        ? true
        : {
            _status: {
              equals: 'published',
            },
          },
  },
  admin: {
    useAsTitle: 'adminTitle',
    defaultColumns: ['adminTitle', 'slug', 'order', '_status', 'updatedAt'],
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
      validate: slugValidator,
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
      type: 'tabs',
      tabs: [
        {
          label: 'English',
          fields: [
            {
              name: 'en',
              type: 'group',
              fields: languageFields('English'),
            },
          ],
        },
        {
          label: 'Latviski',
          fields: [
            {
              name: 'lv',
              type: 'group',
              fields: languageFields('Latvian'),
            },
          ],
        },
      ],
    },
    {
      name: 'layout',
      type: 'blocks',
      required: true,
      minRows: 1,
      blocks: [HeroBlock, ContentBlock, CallToAction],
      admin: {
        initCollapsed: true,
      },
    },
    {
      name: 'meta',
      type: 'group',
      label: 'SEO and social sharing',
      fields: [
        {
          name: 'title',
          type: 'text',
          admin: {
            description: 'Optional search/social title. Defaults to the English page title.',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            description: 'Optional search/social description. Defaults to the English excerpt.',
            rows: 3,
          },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Recommended size: 1200 × 630 pixels.',
          },
        },
        {
          name: 'noIndex',
          type: 'checkbox',
          defaultValue: false,
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

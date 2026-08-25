import type { CollectionConfig } from 'payload'
import { formatMetaDescription, formatMetaTitle, formatSlug, slugValidator } from '@/lib/validation'
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
    name: 'body',
    type: 'textarea' as const,
    label: `${label} page content / body`,
    required: false,
    admin: {
      description: 'Main page content with formatted text, headings, lists, and links.',
      rows: 10,
      components: {
        Field: '@/components/QuillEditorField#QuillEditorField',
      },
    },
  },
  {
    name: 'excerpt',
    type: 'textarea' as const,
    label: `${label} short summary (Excerpt)`,
    required: false,
    admin: {
      description: 'Optional 1-2 sentence summary for cards. If left blank, auto-generates from page content.',
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
      hooks: {
        beforeValidate: [formatSlug('adminTitle')],
      },
      admin: {
        description: 'Auto-generated from title if left blank. Automatically converted to lowercase kebab-case.',
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
      required: false,
      blocks: [HeroBlock, ContentBlock, CallToAction],
      admin: {
        description: 'Advanced layout builder (Hero, Content sections, Call to Action buttons).',
        initCollapsed: true,
      },
    },
    {
      name: 'meta',
      type: 'group',
      label: 'Google Search & Link Previews (WhatsApp, Facebook, Search)',
      fields: [
        {
          name: 'title',
          type: 'text',
          hooks: {
            beforeValidate: [formatMetaTitle],
          },
          admin: {
            description: 'Title shown on Google search and when sharing links in messages or social media. Auto-prefilled from Page Title if left blank.',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          hooks: {
            beforeValidate: [formatMetaDescription],
          },
          admin: {
            description: 'Summary shown on Google search and when sharing links in messages or social media. Auto-prefilled from Page Content if left blank.',
            rows: 3,
          },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Thumbnail image shown when sharing this link on Facebook, WhatsApp, LinkedIn, or Twitter. Recommended size: 1200 × 630 pixels.',
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
      autosave: false,
    },
  },
}

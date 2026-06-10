import type { GlobalConfig } from 'payload'

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Footer',
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  admin: {
    group: 'Settings',
  },
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
                  name: 'tagline',
                  type: 'text',
                  label: 'Tagline',
                  required: true,
                },
                {
                  name: 'address',
                  type: 'text',
                  label: 'Address',
                  required: true,
                },
                {
                  name: 'rights',
                  type: 'text',
                  label: 'Rights text (copyright notice)',
                  required: true,
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
                  name: 'tagline',
                  type: 'text',
                  label: 'Tagline',
                  required: true,
                },
                {
                  name: 'address',
                  type: 'text',
                  label: 'Address',
                  required: true,
                },
                {
                  name: 'rights',
                  type: 'text',
                  label: 'Rights text (copyright notice)',
                  required: true,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'items',
      type: 'array',
      label: 'Footer menu items',
      required: true,
      minRows: 1,
      maxRows: 10,
      admin: {
        description: 'Drag items to change their order in the website footer.',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'href',
          type: 'text',
          label: 'URL',
          required: true,
          admin: {
            description: 'Use a path such as /privacy, /terms, or a full external URL.',
          },
        },
        {
          name: 'en',
          type: 'text',
          label: 'English label',
          required: true,
        },
        {
          name: 'lv',
          type: 'text',
          label: 'Latvian label',
          required: true,
        },
        {
          name: 'newTab',
          type: 'checkbox',
          label: 'Open in a new tab',
          defaultValue: false,
        },
      ],
    },
  ],
}

import type { Field, GlobalConfig } from 'payload'

const languageFields = (language: string): Field[] => [
  {
    name: 'associationName',
    type: 'text',
    label: `${language} association name`,
    required: true,
  },
  {
    name: 'tagline',
    type: 'text',
    label: `${language} tagline`,
    required: false,
  },
  {
    name: 'contactEmail',
    type: 'text',
    label: `${language} contact email`,
    required: false,
  },
]

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
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
      name: 'socialLinks',
      type: 'array',
      label: 'Social media links',
      required: false,
      admin: {
        description: 'Links to Facebook, Instagram, etc.',
      },
      fields: [
        {
          name: 'platform',
          type: 'text',
          label: 'Platform name (e.g. Facebook, Instagram)',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          label: 'Full URL',
          required: true,
        },
      ],
    },
  ],
}

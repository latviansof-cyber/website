import type { Field, GlobalConfig } from 'payload'

const languageFields = (language: string): Field[] => [
  {
    name: 'about',
    type: 'richText',
    label: `${language} about us`,
    required: true,
  },
  {
    name: 'history',
    type: 'richText',
    label: `${language} history`,
    required: true,
  },
]

export const Pages: GlobalConfig = {
  slug: 'pages',
  label: 'About & History',
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  admin: {
    group: 'Content',
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
  ],
}

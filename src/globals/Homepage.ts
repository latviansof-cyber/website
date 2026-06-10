import type { Field, GlobalConfig } from 'payload'

const languageFields = (language: string): Field[] => [
  {
    name: 'heroEyebrow',
    type: 'text',
    label: `${language} hero eyebrow`,
    required: true,
  },
  {
    name: 'heroTitle',
    type: 'text',
    label: `${language} hero title`,
    required: true,
  },
  {
    name: 'heroSubtitle',
    type: 'textarea',
    label: `${language} hero subtitle`,
    required: true,
    admin: {
      rows: 4,
    },
  },
  {
    name: 'heroPrimaryLabel',
    type: 'text',
    label: `${language} primary button label`,
    required: true,
  },
  {
    name: 'heroSecondaryLabel',
    type: 'text',
    label: `${language} secondary button label`,
    required: true,
  },
  {
    name: 'eventsTitle',
    type: 'text',
    label: `${language} events heading`,
    required: true,
  },
  {
    name: 'eventsIntro',
    type: 'textarea',
    label: `${language} events introduction`,
    required: true,
    admin: {
      rows: 4,
    },
  },
]

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  label: 'Homepage',
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
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Optional homepage hero background image.',
      },
    },
    {
      name: 'heroPrimaryHref',
      type: 'text',
      label: 'Primary button URL',
      required: true,
      defaultValue: '#events',
    },
    {
      name: 'heroSecondaryHref',
      type: 'text',
      label: 'Secondary button URL',
      required: true,
      defaultValue: '/about',
    },
  ],
}

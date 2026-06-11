import type { Field, GlobalConfig } from 'payload'

const languageFields = (language: string): Field[] => [
  {
    name: 'bankName',
    type: 'text',
    label: `${language} bank name`,
    required: true,
  },
  {
    name: 'bsb',
    type: 'text',
    label: `${language} BSB`,
    required: true,
  },
  {
    name: 'accountNumber',
    type: 'text',
    label: `${language} account number`,
    required: true,
  },
  {
    name: 'accountName',
    type: 'text',
    label: `${language} account name`,
    required: true,
  },
  {
    name: 'payId',
    type: 'text',
    label: `${language} PayID email`,
    required: false,
  },
  {
    name: 'instructions',
    type: 'textarea',
    label: `${language} instructions`,
    required: false,
  },
]

export const DonationSettings: GlobalConfig = {
  slug: 'donation-settings',
  label: 'Donation Settings',
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
  ],
}

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
  label: 'Donate page',
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  admin: {
    group: 'Donation management',
    description: 'Manage the donation options, card links, and payment details shown on /donate.',
  },
  fields: [
    {
      name: 'priorityLinks',
      type: 'array',
      label: 'Priority cards',
      maxRows: 6,
      admin: {
        description:
          'The square cards near the top of the Donate page. Add a URL to make a card a link.',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'enTitle',
          type: 'text',
          label: 'English title',
          required: true,
        },
        {
          name: 'enBody',
          type: 'textarea',
          label: 'English description',
          required: true,
        },
        {
          name: 'lvTitle',
          type: 'text',
          label: 'Latvian title',
          required: true,
        },
        {
          name: 'lvBody',
          type: 'textarea',
          label: 'Latvian description',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          label: 'Link URL',
          admin: {
            description: 'Optional. Use a site path or a full external URL.',
          },
        },
        {
          name: 'newTab',
          type: 'checkbox',
          label: 'Open link in a new tab',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'features',
      type: 'array',
      label: 'Benefits list',
      maxRows: 8,
      admin: {
        description: 'The short ticked options displayed above the donation cards.',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'enLabel',
          type: 'text',
          label: 'English label',
          required: true,
        },
        {
          name: 'lvLabel',
          type: 'text',
          label: 'Latvian label',
          required: true,
        },
      ],
    },
    {
      name: 'donationOptions',
      type: 'array',
      label: 'Donation option cards',
      minRows: 1,
      maxRows: 12,
      admin: {
        description:
          'The square amount cards. If a URL is supplied, the card links directly to it; otherwise it fills the custom amount form.',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'amount',
          type: 'number',
          label: 'Amount (AUD)',
          required: true,
          min: 1,
        },
        {
          name: 'enBody',
          type: 'textarea',
          label: 'English description',
          required: true,
        },
        {
          name: 'lvBody',
          type: 'textarea',
          label: 'Latvian description',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          label: 'Donation link',
          admin: {
            description: 'Optional full payment URL or site path.',
          },
        },
        {
          name: 'newTab',
          type: 'checkbox',
          label: 'Open link in a new tab',
          defaultValue: true,
        },
      ],
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
  ],
}

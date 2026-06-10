import type { GlobalConfig } from 'payload'

export const MainMenu: GlobalConfig = {
  slug: 'main-menu',
  label: 'Main Menu',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Settings',
  },
  fields: [
    {
      name: 'items',
      type: 'array',
      label: 'Menu items',
      required: true,
      minRows: 1,
      maxRows: 12,
      admin: {
        description: 'Drag items to change their order in the website header.',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'href',
          type: 'text',
          label: 'URL',
          required: true,
          admin: {
            description: 'Use a site path such as /about or /#events, or a full external URL.',
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

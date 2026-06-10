import type { Block, Field } from 'payload'
import { bilingualGroup } from './fields'

const contentFields = (): Field[] => [
  {
    name: 'heading',
    type: 'text',
  },
  {
    name: 'body',
    type: 'textarea',
    required: true,
    admin: {
      description: 'Separate paragraphs with a blank line.',
      rows: 12,
    },
  },
]

export const ContentBlock: Block = {
  slug: 'content',
  interfaceName: 'ContentLayoutBlock',
  labels: {
    singular: 'Content',
    plural: 'Content sections',
  },
  fields: [
    ...bilingualGroup(contentFields),
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'imagePosition',
      type: 'select',
      defaultValue: 'right',
      options: [
        { label: 'Right', value: 'right' },
        { label: 'Left', value: 'left' },
        { label: 'No image', value: 'none' },
      ],
    },
    {
      name: 'tone',
      type: 'select',
      defaultValue: 'plain',
      options: [
        { label: 'Plain', value: 'plain' },
        { label: 'Muted', value: 'muted' },
      ],
    },
  ],
}

import type { Block, Field } from 'payload'
import { bilingualGroup } from './fields'

const heroFields = (): Field[] => [
  {
    name: 'eyebrow',
    type: 'text',
  },
  {
    name: 'heading',
    type: 'text',
    required: true,
  },
  {
    name: 'text',
    type: 'textarea',
    required: true,
    admin: {
      rows: 4,
    },
  },
]

export const HeroBlock: Block = {
  slug: 'hero',
  interfaceName: 'HeroLayoutBlock',
  labels: {
    singular: 'Hero',
    plural: 'Heroes',
  },
  fields: [
    ...bilingualGroup(heroFields),
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'alignment',
      type: 'select',
      defaultValue: 'left',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Centred', value: 'center' },
      ],
    },
  ],
}

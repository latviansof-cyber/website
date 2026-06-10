import type { Block, Field } from 'payload'
import { bilingualGroup } from './fields'

const buttonFields = (): Field[] => [
  {
    name: 'label',
    type: 'text',
    required: true,
  },
  {
    name: 'link',
    type: 'text',
    required: true,
  },
  {
    name: 'variant',
    type: 'select',
    defaultValue: 'primary',
    options: [
      { label: 'Primary (Solid)', value: 'primary' },
      { label: 'Secondary (Outline)', value: 'secondary' },
    ],
  },
]

const ctaFields = (): Field[] => [
  {
    name: 'heading',
    type: 'text',
    required: true,
  },
  {
    name: 'text',
    type: 'textarea',
    admin: {
      rows: 4,
    },
  },
  {
    name: 'buttons',
    type: 'array',
    maxRows: 2,
    fields: buttonFields(),
  },
]

export const CallToAction: Block = {
  slug: 'cta',
  interfaceName: 'CallToActionLayoutBlock',
  labels: {
    singular: 'Call to action',
    plural: 'Calls to action',
  },
  fields: bilingualGroup(ctaFields),
}

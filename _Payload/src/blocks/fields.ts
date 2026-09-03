import type { Field } from 'payload'

export const bilingualGroup = (fields: () => Field[]): Field[] => [
  {
    name: 'en',
    type: 'group',
    label: 'English',
    fields: fields(),
  },
  {
    name: 'lv',
    type: 'group',
    label: 'Latviski',
    fields: fields(),
  },
]

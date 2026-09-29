import type { CollectionConfig } from 'payload'

import { anyone, loggedIn } from '../access'
import { orderField } from '../fields/slug'

export const Faqs: CollectionConfig = {
  slug: 'faqs',
  labels: { singular: '常見問題', plural: '常見問題' },
  access: { read: anyone, create: loggedIn, update: loggedIn, delete: loggedIn },
  admin: { useAsTitle: 'question', group: '內容', defaultColumns: ['question', 'order'] },
  defaultSort: 'order',
  fields: [
    { name: 'question', label: '問題', type: 'text', required: true },
    { name: 'answer', label: '答案', type: 'textarea', required: true },
    orderField,
  ],
}

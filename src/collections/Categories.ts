import type { CollectionConfig } from 'payload'

import { anyone, isAdmin } from '../access'
import { orderField, slugField } from '../fields/slug'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: '案例分類', plural: '案例分類' },
  access: { read: anyone, create: isAdmin, update: isAdmin, delete: isAdmin },
  admin: { useAsTitle: 'title', group: '內容', defaultColumns: ['title', 'slug', 'order'] },
  defaultSort: 'order',
  fields: [
    { name: 'title', label: '分類名稱', type: 'text', required: true },
    slugField('例如 brand-website'),
    orderField,
  ],
}

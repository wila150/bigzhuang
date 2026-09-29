import type { CollectionConfig } from 'payload'

import { isAdmin, publishedOrAdmin } from '../access'
import { orderField, publishedField, slugField } from '../fields/slug'

const titleDesc = [
  { name: 'title', label: '標題', type: 'text', required: true },
  { name: 'description', label: '說明', type: 'textarea' },
] as const

export const Services: CollectionConfig = {
  slug: 'services',
  labels: { singular: '服務項目', plural: '服務項目' },
  access: { read: publishedOrAdmin, create: isAdmin, update: isAdmin, delete: isAdmin },
  admin: { useAsTitle: 'title', group: '內容', defaultColumns: ['title', 'order', 'published'] },
  defaultSort: 'order',
  fields: [
    { name: 'title', label: '服務名稱', type: 'text', required: true },
    { name: 'summary', label: '一句話說明', type: 'textarea', required: true, admin: { description: '首頁服務卡片與列表頁使用' } },
    { name: 'cover', label: '封面圖', type: 'upload', relationTo: 'media' },
    {
      name: 'includes',
      label: '包含項目',
      type: 'array',
      fields: [{ name: 'item', label: '項目', type: 'text', required: true }],
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: '服務內頁',
          fields: [
            { name: 'tagline', label: '主標語', type: 'text' },
            { name: 'problem', label: '客戶現在的困擾', type: 'textarea' },
            { name: 'solution', label: '一句解法', type: 'textarea' },
            {
              name: 'features',
              label: '網站特色（4 項）',
              type: 'array',
              maxRows: 4,
              fields: [...titleDesc],
            },
            {
              name: 'points',
              label: '三大重點',
              type: 'array',
              maxRows: 3,
              fields: [
                ...titleDesc,
                {
                  name: 'tags',
                  label: '功能標籤',
                  type: 'array',
                  fields: [{ name: 'tag', label: '標籤', type: 'text', required: true }],
                },
              ],
            },
            {
              name: 'addons',
              label: '你可能還需要',
              type: 'array',
              maxRows: 3,
              fields: [...titleDesc],
            },
            {
              name: 'relatedCategories',
              label: '相關案例分類',
              type: 'relationship',
              relationTo: 'categories',
              hasMany: true,
              admin: { description: '服務頁會自動列出這些分類底下的作品' },
            },
          ],
        },
      ],
    },
    slugField(),
    orderField,
    publishedField,
  ],
}

import type { CollectionConfig } from 'payload'

import { anyone, isAdmin } from '../access'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: '圖片', plural: '媒體庫' },
  access: { read: anyone, create: isAdmin, update: isAdmin, delete: isAdmin },
  admin: { group: '內容' },
  fields: [
    {
      name: 'alt',
      label: '替代文字',
      type: 'text',
      required: true,
      admin: { description: '描述圖片內容，給螢幕閱讀器與 Google 看' },
    },
  ],
  upload: {
    mimeTypes: ['image/*'],
    imageSizes: [
      { name: 'thumb', width: 480 },
      { name: 'card', width: 960 },
      { name: 'large', width: 1600 },
    ],
  },
}

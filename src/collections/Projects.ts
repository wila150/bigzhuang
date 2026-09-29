import type { CollectionConfig } from 'payload'

import { loggedIn, publishedOrLoggedIn } from '../access'
import { orderField, publishedField, slugField } from '../fields/slug'

export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: { singular: '作品案例', plural: '作品案例' },
  access: { read: publishedOrLoggedIn, create: loggedIn, update: loggedIn, delete: loggedIn },
  admin: {
    useAsTitle: 'title',
    group: '內容',
    defaultColumns: ['title', 'category', 'year', 'order', 'published'],
  },
  defaultSort: 'order',
  fields: [
    { name: 'title', label: '案例名稱', type: 'text', required: true },
    { name: 'category', label: '分類', type: 'relationship', relationTo: 'categories', required: true },
    {
      type: 'row',
      fields: [
        { name: 'siteType', label: '網站類型', type: 'text', admin: { width: '50%' } },
        { name: 'industry', label: '產業', type: 'text', admin: { width: '50%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'url', label: '網址', type: 'text', admin: { width: '50%' } },
        { name: 'year', label: '建置年份', type: 'number', admin: { width: '50%' } },
      ],
    },
    { name: 'summary', label: '簡介', type: 'textarea' },
    {
      name: 'tech',
      label: '使用技術',
      type: 'array',
      fields: [{ name: 'name', label: '技術', type: 'text', required: true }],
    },
    {
      name: 'features',
      label: '功能標籤',
      type: 'array',
      fields: [{ name: 'name', label: '功能', type: 'text', required: true }],
    },
    {
      name: 'cover',
      label: '首頁截圖（1440 × 900）',
      type: 'upload',
      relationTo: 'media',
      admin: { description: '跑馬燈大方塊與案例封面，從頁面最上方截' },
    },
    {
      name: 'gallery',
      label: '內頁截圖（1440 × 900，2～4 張）',
      type: 'array',
      maxRows: 6,
      fields: [{ name: 'image', label: '圖片', type: 'upload', relationTo: 'media', required: true }],
    },
    {
      name: 'mobileShot',
      label: '手機版截圖（390 × 844）',
      type: 'upload',
      relationTo: 'media',
    },
    slugField(),
    orderField,
    publishedField,
  ],
}

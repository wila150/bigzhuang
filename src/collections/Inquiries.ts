import type { CollectionConfig } from 'payload'

import { loggedIn } from '../access'

export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  labels: { singular: '詢問單', plural: '詢問單' },
  // Created only through the contact form's server action (which uses overrideAccess).
  access: { read: loggedIn, create: loggedIn, update: loggedIn, delete: loggedIn },
  admin: {
    useAsTitle: 'name',
    group: '營運',
    defaultColumns: ['name', 'service', 'status', 'createdAt'],
  },
  defaultSort: '-createdAt',
  fields: [
    { name: 'name', label: '姓名', type: 'text', required: true },
    {
      type: 'row',
      fields: [
        { name: 'email', label: 'Email', type: 'email', admin: { width: '50%' } },
        { name: 'phone', label: '電話', type: 'text', admin: { width: '50%' } },
      ],
    },
    { name: 'lineId', label: 'LINE ID', type: 'text' },
    { name: 'service', label: '想做的服務', type: 'text' },
    { name: 'budget', label: '預算', type: 'text' },
    { name: 'message', label: '需求說明', type: 'textarea', required: true },
    {
      name: 'status',
      label: '處理狀態',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: '新詢問', value: 'new' },
        { label: '已聯絡', value: 'contacted' },
        { label: '已報價', value: 'quoted' },
        { label: '成交', value: 'won' },
        { label: '未成交', value: 'lost' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'note', label: '內部備註', type: 'textarea', admin: { position: 'sidebar' } },
  ],
}

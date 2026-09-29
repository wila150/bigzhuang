import type { CollectionConfig } from 'payload'

import { isAdmin } from '../access'
import { notifyAdmin } from '../line/notify'

export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  labels: { singular: '詢問單', plural: '詢問單' },
  // Created only through the contact form's server action (which uses overrideAccess).
  access: { read: isAdmin, create: isAdmin, update: isAdmin, delete: isAdmin },
  admin: {
    useAsTitle: 'name',
    group: '營運',
    defaultColumns: ['name', 'service', 'status', 'createdAt'],
  },
  defaultSort: '-createdAt',
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation !== 'create') return
        const lines = [
          doc.source === 'line' ? '新的 LINE 線上詢價（到 LINE 聊天室回覆）' : '新的網站詢問',
          `姓名：${doc.name}`,
          doc.service && `服務：${doc.service}`,
          doc.budget && `預算：${doc.budget}`,
          doc.lineId && `LINE：${doc.lineId}`,
          doc.phone && `電話：${doc.phone}`,
          doc.email && `Email：${doc.email}`,
          '',
          doc.message,
        ].filter((l) => l !== undefined && l !== null && l !== false)
        await notifyAdmin(req.payload, 'inquiry', lines.join('\n'))
      },
    ],
  },
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
    {
      type: 'row',
      fields: [
        {
          name: 'source',
          label: '來源',
          type: 'select',
          defaultValue: 'web',
          options: [
            { label: '網站表單', value: 'web' },
            { label: 'LINE 線上詢價', value: 'line' },
          ],
          admin: { width: '50%' },
        },
        { name: 'lineUserId', label: 'LINE User ID', type: 'text', admin: { width: '50%', readOnly: true } },
      ],
    },
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

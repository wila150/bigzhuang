import type { CollectionConfig } from 'payload'

import { isAdmin } from '../access'
import { orderField } from '../fields/slug'

export const LineReplies: CollectionConfig = {
  slug: 'line-replies',
  labels: { singular: 'LINE 自動回覆', plural: 'LINE 自動回覆' },
  access: { read: isAdmin, create: isAdmin, update: isAdmin, delete: isAdmin },
  admin: {
    useAsTitle: 'title',
    group: 'LINE',
    defaultColumns: ['title', 'keywords', 'enabled', 'order'],
    description: '客人傳來的訊息包含任一關鍵字時自動回覆；沒對到的訊息不回，留給你手動聊天。',
  },
  defaultSort: 'order',
  fields: [
    { name: 'title', label: '名稱', type: 'text', required: true, admin: { description: '只給你自己看，例如「報價」' } },
    {
      name: 'keywords',
      label: '關鍵字',
      type: 'text',
      required: true,
      admin: { description: '用逗號分隔，例如：報價,價格,多少錢' },
    },
    { name: 'reply', label: '回覆內容', type: 'textarea', required: true },
    {
      type: 'row',
      fields: [
        { name: 'buttonLabel', label: '按鈕文字（選填）', type: 'text', maxLength: 20, admin: { width: '40%' } },
        { name: 'buttonUrl', label: '按鈕連結', type: 'text', admin: { width: '60%', description: '可填網站路徑，例如 /contact' } },
      ],
    },
    { name: 'enabled', label: '啟用', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
    orderField,
  ],
}

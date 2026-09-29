import type { GlobalConfig } from 'payload'

import { anyone, isAdmin } from '../access'
import { draftsWithAutosave } from '../fields/drafts'

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: '首頁文字',
  access: { read: anyone, update: isAdmin },
  versions: draftsWithAutosave,
  admin: { group: '頁面文字' },
  fields: [
    { name: 'heroTitle', label: '主標語', type: 'text', required: true },
    { name: 'heroText', label: '主標語下方說明', type: 'textarea' },
    { name: 'heroImage', label: '主視覺圖片', type: 'upload', relationTo: 'media' },
    {
      name: 'sellingPoints',
      label: '賣點條',
      type: 'array',
      maxRows: 4,
      fields: [
        { name: 'title', label: '賣點', type: 'text', required: true },
        { name: 'description', label: '一句說明', type: 'text' },
      ],
    },
    { name: 'ctaTitle', label: '聯絡橫幅標題', type: 'text' },
    { name: 'ctaText', label: '聯絡橫幅說明', type: 'text' },
  ],
}

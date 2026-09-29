import type { GlobalConfig } from 'payload'

import { anyone, isAdmin } from '../access'
import { draftsWithAutosave } from '../fields/drafts'

export const AboutPage: GlobalConfig = {
  slug: 'about-page',
  label: '關於大壯',
  access: { read: anyone, update: isAdmin },
  versions: draftsWithAutosave,
  admin: { group: '頁面文字' },
  fields: [
    { name: 'photo', label: '照片或頭像', type: 'upload', relationTo: 'media' },
    { name: 'intro', localized: true, label: '自我介紹', type: 'textarea' },
    { name: 'why', localized: true, label: '為什麼做網站', type: 'textarea' },
    {
      name: 'skills',
      label: '會的技術',
      type: 'array',
      fields: [{ name: 'name', label: '技術', type: 'text', required: true }],
    },
    { name: 'story', localized: true, label: '品牌故事', type: 'textarea' },
  ],
}

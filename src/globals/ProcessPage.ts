import type { GlobalConfig } from 'payload'

import { anyone, isAdmin } from '../access'
import { draftsWithAutosave } from '../fields/drafts'

export const ProcessPage: GlobalConfig = {
  slug: 'process-page',
  label: '合作流程',
  access: { read: anyone, update: isAdmin },
  versions: draftsWithAutosave,
  admin: { group: '頁面文字' },
  fields: [
    { name: 'intro', label: '頁面說明', type: 'textarea' },
    {
      name: 'steps',
      label: '步驟',
      type: 'array',
      fields: [
        { name: 'title', label: '步驟名稱', type: 'text', required: true },
        { name: 'description', label: '說明', type: 'textarea' },
        { name: 'duration', label: '大約時間', type: 'text' },
      ],
    },
  ],
}

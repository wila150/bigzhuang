import type { GlobalConfig } from 'payload'

import { anyone, loggedIn } from '../access'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: '網站設定',
  access: { read: anyone, update: loggedIn },
  admin: { group: '設定' },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: '聯絡帳號',
          fields: [
            { name: 'lineId', label: 'LINE ID', type: 'text' },
            { name: 'lineUrl', label: 'LINE 加好友連結', type: 'text', admin: { description: '例如 https://line.me/ti/p/~yourid' } },
            { name: 'email', label: 'Email', type: 'email' },
            { name: 'instagram', label: 'IG 帳號', type: 'text', admin: { description: '不含 @' } },
            { name: 'serviceArea', label: '服務區域', type: 'text', defaultValue: '全台線上服務' },
          ],
        },
        {
          label: '頁尾',
          fields: [
            { name: 'footerBlurb', label: '品牌一句說明', type: 'textarea' },
            {
              name: 'footerKeywords',
              label: '熱門關鍵字',
              type: 'array',
              fields: [
                { name: 'label', label: '關鍵字', type: 'text', required: true },
                { name: 'href', label: '連結', type: 'text', required: true },
              ],
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            { name: 'seoTitle', label: '網站標題', type: 'text' },
            { name: 'seoDescription', label: '網站描述', type: 'textarea' },
          ],
        },
      ],
    },
  ],
}

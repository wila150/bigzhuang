import type { GlobalConfig } from 'payload'

import { adminOrClientField, anyone, isAdmin } from '../access'

const paymentRead = { read: adminOrClientField }

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: '網站設定',
  access: { read: anyone, update: isAdmin },
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
          label: '付款資訊',
          description: '顯示在客戶專區，給選擇匯款的客戶參考',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'bankName', access: paymentRead, label: '銀行名稱', type: 'text', admin: { width: '50%', placeholder: '例如 國泰世華' } },
                { name: 'bankCode', access: paymentRead, label: '銀行代碼', type: 'text', admin: { width: '50%', placeholder: '例如 013' } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'bankAccount', access: paymentRead, label: '帳號', type: 'text', admin: { width: '50%' } },
                { name: 'bankAccountName', access: paymentRead, label: '戶名', type: 'text', admin: { width: '50%' } },
              ],
            },
            { name: 'paymentNote', access: paymentRead, label: '付款說明', type: 'textarea', admin: { placeholder: '例如：匯款後請用 LINE 告知帳號末五碼' } },
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

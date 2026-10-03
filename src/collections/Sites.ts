import type { CollectionConfig } from 'payload'

import { isAdmin } from '../access'
import { checkAllSites } from '../monitor/check'

export const Sites: CollectionConfig = {
  slug: 'sites',
  labels: { singular: '監控網站', plural: '監控網站' },
  access: { read: isAdmin, create: isAdmin, update: isAdmin, delete: isAdmin },
  admin: {
    useAsTitle: 'name',
    group: '網站管理',
    defaultColumns: ['name', 'url', 'status', 'responseMs', 'lastCheckedAt', 'enabled'],
    description: '每 10 分鐘自動連線一次（順便把 Render 免費方案的休眠站叫醒）。連續 2 次失敗就判定斷線並推 LINE 通知，恢復時也會通知。',
  },
  hooks: {
    beforeChange: [
      // Pointing a site somewhere new makes its old status meaningless.
      ({ data, originalDoc, operation, context }) => {
        if (context.monitorCheck || operation !== 'update' || !originalDoc) return data
        if (data.url !== originalDoc.url || data.healthPath !== originalDoc.healthPath) {
          return { ...data, status: 'unknown', failCount: 0, lastError: null, statusSince: null }
        }
        return data
      },
    ],
  },
  endpoints: [
    {
      // POST /api/sites/check-now — the 「立即檢查」 button on the dashboard.
      path: '/check-now',
      method: 'post',
      handler: async (req) => {
        if (req.user?.collection !== 'users') return Response.json({ error: 'Forbidden' }, { status: 403 })
        const count = await checkAllSites(req.payload)
        return Response.json({ checked: count })
      },
    },
  ],
  fields: [
    { name: 'name', label: '網站名稱', type: 'text', required: true },
    {
      type: 'row',
      fields: [
        {
          name: 'url',
          label: '網址',
          type: 'text',
          required: true,
          admin: { width: '60%', placeholder: 'https://example.onrender.com' },
          validate: (value: string | null | undefined) => {
            try {
              const u = new URL(value || '')
              return u.protocol === 'https:' || u.protocol === 'http:' ? true : '網址要以 https:// 開頭'
            } catch {
              return '請輸入完整網址，例如 https://example.onrender.com'
            }
          },
        },
        {
          name: 'healthPath',
          label: '檢查路徑',
          type: 'text',
          defaultValue: '/',
          admin: { width: '40%', description: '分站有做 /maintenance/health 就填它，沒有就用首頁 /' },
        },
      ],
    },
    { name: 'enabled', label: '啟用監控', type: 'checkbox', defaultValue: true },
    { name: 'notes', label: '備註', type: 'textarea', admin: { description: '例如：Render 免費方案、客戶名稱、主機帳號在哪' } },
    {
      name: 'status',
      label: '狀態',
      type: 'select',
      defaultValue: 'unknown',
      options: [
        { label: '🟢 正常', value: 'up' },
        { label: '🔴 斷線', value: 'down' },
        { label: '⚪ 尚未檢查', value: 'unknown' },
      ],
      admin: { position: 'sidebar', readOnly: true },
    },
    { name: 'statusSince', label: '狀態開始時間', type: 'date', admin: { position: 'sidebar', readOnly: true, date: { pickerAppearance: 'dayAndTime' } } },
    { name: 'lastCheckedAt', label: '上次檢查', type: 'date', admin: { position: 'sidebar', readOnly: true, date: { pickerAppearance: 'dayAndTime' } } },
    { name: 'responseMs', label: '回應時間（ms）', type: 'number', admin: { position: 'sidebar', readOnly: true } },
    { name: 'lastError', label: '最近錯誤', type: 'text', admin: { position: 'sidebar', readOnly: true } },
    { name: 'failCount', label: '連續失敗次數', type: 'number', defaultValue: 0, admin: { position: 'sidebar', readOnly: true } },
  ],
}

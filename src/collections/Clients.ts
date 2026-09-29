import type { Access, CollectionConfig } from 'payload'

import { isAdmin, isAdminField } from '../access'

// Admins see every client; a logged-in client sees only their own record.
const adminOrSelf: Access = ({ req }) => {
  if (req.user?.collection === 'users') return true
  if (req.user?.collection === 'clients') return { id: { equals: req.user.id } }
  return false
}

export const Clients: CollectionConfig = {
  slug: 'clients',
  labels: { singular: '客戶', plural: '客戶與月費' },
  // Clients sign in with Google only (see src/auth/google.ts); no passwords.
  auth: { disableLocalStrategy: true, tokenExpiration: 60 * 60 * 24 * 7 },
  access: { read: adminOrSelf, create: isAdmin, update: isAdmin, delete: isAdmin, admin: () => false },
  admin: {
    useAsTitle: 'name',
    group: '營運',
    defaultColumns: ['name', 'email', 'site', 'monthlyFee', 'billingDay'],
  },
  fields: [
    { name: 'name', label: '客戶名稱', type: 'text', required: true },
    {
      name: 'email',
      label: '登入 Email',
      type: 'email',
      required: true,
      unique: true,
      index: true,
      admin: { description: '客戶用這個 Google 帳號登入「客戶專區」查看與支付帳單' },
    },
    { name: 'contact', label: '聯絡人與方式', type: 'text', access: { read: isAdminField } },
    { name: 'site', label: '網站', type: 'text' },
    {
      type: 'row',
      fields: [
        { name: 'monthlyFee', label: '月費（新台幣）', type: 'number', min: 0, admin: { width: '50%' } },
        { name: 'billingDay', label: '每月扣款日', type: 'number', min: 1, max: 31, admin: { width: '50%' } },
      ],
    },
    {
      name: 'bills',
      label: '每月帳單',
      type: 'array',
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'month', label: '月份', type: 'text', required: true, admin: { width: '25%', placeholder: '2026-10' } },
            { name: 'amount', label: '金額', type: 'number', min: 1, required: true, admin: { width: '25%' } },
            { name: 'dueDate', label: '繳費期限', type: 'date', admin: { width: '25%', date: { pickerAppearance: 'dayOnly' } } },
            {
              name: 'status',
              label: '繳費狀態',
              type: 'select',
              defaultValue: 'unpaid',
              options: [
                { label: '未繳', value: 'unpaid' },
                { label: '已繳', value: 'paid' },
                { label: '逾期', value: 'overdue' },
              ],
              admin: { width: '25%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'paymentMethod',
              label: '付款方式',
              type: 'select',
              options: [
                { label: '信用卡', value: 'card' },
                { label: '匯款', value: 'transfer' },
                { label: '其他', value: 'other' },
              ],
              admin: { width: '33%' },
            },
            { name: 'paidAt', label: '付款時間', type: 'date', admin: { width: '33%', date: { pickerAppearance: 'dayAndTime' } } },
            {
              name: 'tradeNo',
              label: '金流交易編號',
              type: 'text',
              index: true,
              admin: { width: '33%', readOnly: true, description: '刷卡時自動產生' },
            },
          ],
        },
      ],
    },
    { name: 'note', label: '內部備註', type: 'textarea', access: { read: isAdminField } },
  ],
}

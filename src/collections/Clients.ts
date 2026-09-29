import type { CollectionConfig } from 'payload'

import { loggedIn } from '../access'

export const Clients: CollectionConfig = {
  slug: 'clients',
  labels: { singular: '客戶', plural: '客戶與月費' },
  access: { read: loggedIn, create: loggedIn, update: loggedIn, delete: loggedIn },
  admin: {
    useAsTitle: 'name',
    group: '營運',
    defaultColumns: ['name', 'site', 'monthlyFee', 'billingDay'],
  },
  fields: [
    { name: 'name', label: '客戶名稱', type: 'text', required: true },
    { name: 'contact', label: '聯絡人與方式', type: 'text' },
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
            { name: 'month', label: '月份', type: 'text', required: true, admin: { width: '33%', placeholder: '2026-10' } },
            { name: 'amount', label: '金額', type: 'number', min: 0, admin: { width: '33%' } },
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
              admin: { width: '33%' },
            },
          ],
        },
      ],
    },
    { name: 'note', label: '備註', type: 'textarea' },
  ],
}

import type { GlobalConfig } from 'payload'

import { anyone, isAdmin } from '../access'
import { draftsWithAutosave } from '../fields/drafts'

export const ContactPage: GlobalConfig = {
  slug: 'contact-page',
  label: '聯絡我們',
  access: { read: anyone, update: isAdmin },
  versions: draftsWithAutosave,
  admin: { group: '頁面文字' },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: '頁面文字',
          fields: [
            { name: 'heroTitle', localized: true, label: '頁面標題', type: 'text' },
            { name: 'heroLead', localized: true, label: '標題下方說明', type: 'textarea' },
            { name: 'channelsTitle', localized: true, label: '「聯絡管道」小標題', type: 'text' },
            {
              type: 'row',
              fields: [
                { name: 'lineNote', localized: true, label: 'LINE 下方小字', type: 'text', admin: { width: '33%' } },
                { name: 'emailNote', localized: true, label: 'Email 下方小字', type: 'text', admin: { width: '33%' } },
                { name: 'instagramNote', localized: true, label: 'IG 下方小字', type: 'text', admin: { width: '33%' } },
              ],
            },
            {
              type: 'ui',
              name: 'channelsHelp',
              admin: { components: { Field: '@/components/admin/HelpText#ChannelsHelp' } },
            },
          ],
        },
        {
          label: '表單欄位',
          fields: [
            { name: 'formTitle', localized: true, label: '「線上詢問」小標題', type: 'text' },
            {
              name: 'fields',
              label: '欄位',
              labels: { singular: '欄位', plural: '欄位' },
              type: 'array',
              admin: {
                description: '可以新增、刪除、拖曳排序。留空會使用預設的 7 個欄位。',
                initCollapsed: true,
                components: { RowLabel: '@/components/admin/HelpText#FieldRowLabel' },
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'label', localized: true, label: '欄位標題', type: 'text', required: true, admin: { width: '50%' } },
                    {
                      name: 'type',
                      label: '類型',
                      type: 'select',
                      required: true,
                      defaultValue: 'text',
                      options: [
                        { label: '單行文字', value: 'text' },
                        { label: 'Email', value: 'email' },
                        { label: '電話', value: 'tel' },
                        { label: '多行文字', value: 'textarea' },
                        { label: '下拉選單', value: 'select' },
                      ],
                      admin: { width: '25%' },
                    },
                    {
                      name: 'width',
                      label: '寬度',
                      type: 'select',
                      defaultValue: 'full',
                      options: [
                        { label: '整行', value: 'full' },
                        { label: '半行', value: 'half' },
                      ],
                      admin: { width: '25%', description: '兩個相鄰的半行欄位會並排' },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'required', label: '必填', type: 'checkbox', admin: { width: '20%' } },
                    {
                      name: 'role',
                      label: '存到詢問單的',
                      type: 'select',
                      defaultValue: 'other',
                      options: [
                        { label: '其他（另外列出）', value: 'other' },
                        { label: '姓名', value: 'name' },
                        { label: 'Email', value: 'email' },
                        { label: '電話', value: 'phone' },
                        { label: 'LINE ID', value: 'lineId' },
                        { label: '想做的服務', value: 'service' },
                        { label: '預算', value: 'budget' },
                        { label: '需求說明', value: 'message' },
                      ],
                      admin: { width: '40%', description: '同一種最多用一次' },
                    },
                    { name: 'placeholder', localized: true, label: '輸入框內的提示', type: 'text', admin: { width: '40%' } },
                  ],
                },
                { name: 'hint', localized: true, label: '欄位下方說明（選填）', type: 'text' },
                {
                  name: 'useServices',
                  label: '選項自動使用「服務項目」的名稱',
                  type: 'checkbox',
                  admin: { condition: (_, row) => row?.type === 'select' },
                },
                {
                  name: 'options', localized: true,
                  label: '選項',
                  type: 'textarea',
                  admin: {
                    condition: (_, row) => row?.type === 'select' && !row?.useServices,
                    description: '一行一個選項',
                    rows: 5,
                  },
                },
                {
                  name: 'emptyOption', localized: true,
                  label: '未選擇時顯示',
                  type: 'text',
                  admin: { condition: (_, row) => row?.type === 'select', description: '例如：還不確定' },
                },
              ],
            },
          ],
        },
        {
          label: '規則與訊息',
          fields: [
            { name: 'requireContact', label: '要求至少留一種聯絡方式（Email、電話、LINE ID 其一）', type: 'checkbox', defaultValue: true },
            { name: 'contactHint', localized: true, label: '聯絡方式提示（顯示在 LINE ID 欄位下方）', type: 'text' },
            { name: 'requireContactMessage', localized: true, label: '沒留聯絡方式時的錯誤訊息', type: 'text' },
            { name: 'submitLabel', localized: true, label: '送出按鈕文字', type: 'text' },
            { name: 'successTitle', localized: true, label: '送出成功：標題', type: 'text' },
            { name: 'successText', localized: true, label: '送出成功：說明', type: 'textarea' },
            { name: 'errorText', localized: true, label: '送出失敗訊息', type: 'textarea' },
          ],
        },
      ],
    },
  ],
}

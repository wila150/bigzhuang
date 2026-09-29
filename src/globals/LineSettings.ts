import type { GlobalConfig } from 'payload'

import { isAdmin } from '../access'
import { lineBindCode } from '../line/bind-code'

export const LineSettings: GlobalConfig = {
  slug: 'line-settings',
  label: 'LINE 設定',
  access: { read: isAdmin, update: isAdmin },
  admin: { group: 'LINE' },
  fields: [
    {
      name: 'welcomeMessage',
      label: '加好友歡迎訊息',
      type: 'textarea',
      admin: { description: '留空就不送' },
    },
    {
      name: 'adminUserId',
      label: '你的 LINE User ID（接收通知）',
      type: 'text',
      admin: { description: '用你自己的 LINE 傳下方的綁定指令給官方帳號，會自動填入' },
    },
    {
      name: 'bindCommand',
      label: '綁定指令',
      type: 'text',
      virtual: true,
      admin: { readOnly: true, description: '用你的 LINE 把這整句傳給官方帳號' },
      hooks: { afterRead: [() => `綁定通知 ${lineBindCode()}`] },
    },
    {
      name: 'inquirySteps',
      label: '線上詢價：引導問題',
      type: 'array',
      admin: {
        description: '客人按圖文選單「線上詢價」或傳「詢價」後，依序一題一題問。問完會自動建立一張詢問單並通知你。',
        initCollapsed: true,
      },
      fields: [
        { name: 'question', label: '問題', type: 'textarea', required: true },
        {
          name: 'options',
          label: '快速選項（選填）',
          type: 'text',
          admin: { description: '用逗號分隔，會變成可以直接點的按鈕，例如：形象網站,購物網站,還不確定' },
        },
        {
          name: 'saveTo',
          label: '答案存到詢問單的',
          type: 'select',
          defaultValue: 'message',
          options: [
            { label: '需求說明', value: 'message' },
            { label: '想做的服務', value: 'service' },
            { label: '預算', value: 'budget' },
          ],
        },
      ],
    },
    { name: 'inquiryIntro', label: '線上詢價：開場白', type: 'textarea' },
    { name: 'inquiryDone', label: '線上詢價：完成訊息', type: 'textarea' },
    {
      type: 'row',
      fields: [
        { name: 'notifyInquiry', label: '有新詢問單時通知我', type: 'checkbox', defaultValue: true, admin: { width: '50%' } },
        { name: 'notifyPayment', label: '客戶刷卡付款時通知我', type: 'checkbox', defaultValue: true, admin: { width: '50%' } },
      ],
    },
  ],
}

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
      type: 'row',
      fields: [
        { name: 'notifyInquiry', label: '有新詢問單時通知我', type: 'checkbox', defaultValue: true, admin: { width: '50%' } },
        { name: 'notifyPayment', label: '客戶刷卡付款時通知我', type: 'checkbox', defaultValue: true, admin: { width: '50%' } },
      ],
    },
  ],
}

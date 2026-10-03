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
      name: 'repairSteps',
      label: '網站報修：引導問題',
      type: 'array',
      admin: {
        description:
          '客人傳「報修」，或訊息裡有「網站壞了」「打不開」「進不去」等字時，依序一題一題問。留空就用內建的 5 題。第 1 題的回答要有網址：如果是監控中的網站，會自動附上目前狀態。客人傳的截圖不算回答，會留在聊天室給你看。',
        initCollapsed: true,
      },
      fields: [
        { name: 'question', label: '問題', type: 'textarea', required: true },
        { name: 'options', label: '快速選項（選填）', type: 'text', admin: { description: '用逗號分隔，例如：沒有動過,不確定' } },
      ],
    },
    { name: 'repairIntro', label: '網站報修：開場白', type: 'textarea', admin: { description: '留空就用內建的' } },
    { name: 'repairDone', label: '網站報修：完成訊息', type: 'textarea', admin: { description: '留空就用內建的' } },
    {
      type: 'row',
      fields: [
        { name: 'notifyInquiry', label: '有新詢問單時通知我', type: 'checkbox', defaultValue: true, admin: { width: '50%' } },
        { name: 'notifyPayment', label: '客戶刷卡付款時通知我', type: 'checkbox', defaultValue: true, admin: { width: '50%' } },
      ],
    },
    {
      name: 'notifyMonitor',
      label: '監控的網站斷線或恢復時通知我',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}

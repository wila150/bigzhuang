import type { ContactPage } from '@/payload-types'

/** What the contact page and form look like out of the box (also the fallback when the admin leaves the form empty). */
export type FormField = NonNullable<ContactPage['fields']>[number]

export const defaultFields: Omit<FormField, 'id'>[] = [
  { label: '姓名或稱呼', type: 'text', role: 'name', required: true, width: 'full' },
  { label: 'Email', type: 'email', role: 'email', width: 'half' },
  { label: '電話', type: 'tel', role: 'phone', width: 'half' },
  { label: 'LINE ID', type: 'text', role: 'lineId', width: 'full' },
  { label: '想做的服務', type: 'select', role: 'service', width: 'half', useServices: true, emptyOption: '還不確定' },
  { label: '預算範圍', type: 'select', role: 'budget', width: 'half', options: '3 萬以下\n3～6 萬\n6～10 萬\n10 萬以上', emptyOption: '還不確定' },
  {
    label: '需求說明',
    type: 'textarea',
    role: 'message',
    required: true,
    width: 'full',
    placeholder: '例如：想做一個工作室形象網站，需要作品集和線上預約，希望 11 月上線。',
  },
]

export const contactDefaults = {
  heroTitle: '聯絡我們',
  heroLead: '告訴我你想做的網站，先聊聊不收費，一個工作天內回覆。',
  channelsTitle: '聯絡管道',
  lineNote: '最快，通常當天回覆',
  emailNote: '適合附上參考資料',
  instagramNote: '看看最近在做什麼',
  formTitle: '線上詢問',
  requireContact: true,
  requireContactMessage: '請至少留一種聯絡方式',
  contactHint: 'Email、電話、LINE 至少留一種',
  submitLabel: '送出詢問',
  successTitle: '已收到你的詢問',
  successText: '謝謝你！我會在一個工作天內用你留下的方式回覆。',
  errorText: '送出失敗，請稍後再試，或直接用 LINE／Email 聯絡我。',
}

export const ctaDefaults = {
  ctaTitle: '有想做的網站了嗎？',
  ctaText: '告訴我你的想法，一個工作天內回覆，先聊聊不收費。',
  ctaButton: '聯絡我們',
}

/** The form fields to render: the admin's list, or the defaults when it is empty. Every field gets a stable id for form names. */
export function resolveFields(fields: ContactPage['fields']): (FormField & { id: string })[] {
  if (fields?.length) return fields.map((f, i) => ({ ...f, id: f.id || `field-${i}` }))
  return defaultFields.map((f, i) => ({ ...f, id: `default-${i}` }))
}

export const CONTACT_ROLES = ['email', 'phone', 'lineId'] as const

/** One option per line. A single line falls back to ASCII commas; full-width ，is kept as part of the text. */
export function splitOptions(raw?: string | null) {
  const text = (raw || '').trim()
  const parts = text.includes('\n') ? text.split(/\r?\n/) : text.split(',')
  return parts.map((o) => o.trim()).filter(Boolean)
}

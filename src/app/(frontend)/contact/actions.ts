'use server'

import { getPayloadClient } from '@/lib/data'

type Values = Record<'name' | 'email' | 'phone' | 'lineId' | 'service' | 'budget' | 'message', string>

export type InquiryState =
  | { status: 'idle'; values?: Partial<Values> }
  | { status: 'success'; values?: Partial<Values> }
  | { status: 'error'; message?: string; fieldErrors?: Partial<Record<keyof Values | 'contact', string>>; values?: Partial<Values> }

const limits: Record<keyof Values, number> = { name: 80, email: 120, phone: 40, lineId: 60, service: 80, budget: 40, message: 3000 }

export async function submitInquiry(_prev: InquiryState, formData: FormData): Promise<InquiryState> {
  const get = (k: keyof Values) => String(formData.get(k) ?? '').trim().slice(0, limits[k])
  const values: Values = {
    name: get('name'),
    email: get('email'),
    phone: get('phone'),
    lineId: get('lineId'),
    service: get('service'),
    budget: get('budget'),
    message: get('message'),
  }

  // Bots fill the hidden field; pretend success so they move on.
  if (String(formData.get('website') ?? '')) return { status: 'success' }

  const fieldErrors: NonNullable<Extract<InquiryState, { status: 'error' }>['fieldErrors']> = {}
  if (!values.name) fieldErrors.name = '請填寫姓名或稱呼'
  if (!values.message) fieldErrors.message = '請簡單說明你的需求'
  if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) fieldErrors.email = 'Email 格式不正確'
  if (!values.email && !values.phone && !values.lineId) fieldErrors.contact = '請至少留一種聯絡方式'

  if (Object.keys(fieldErrors).length) return { status: 'error', fieldErrors, values }

  try {
    const payload = await getPayloadClient()
    await payload.create({
      collection: 'inquiries',
      overrideAccess: true,
      data: { ...values, email: values.email || undefined, status: 'new' },
    })
    return { status: 'success' }
  } catch (e) {
    console.error('submitInquiry failed', e)
    return { status: 'error', message: '送出失敗，請稍後再試，或直接用 LINE／Email 聯絡我。', values }
  }
}

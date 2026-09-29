'use server'

import { contactDefaults, CONTACT_ROLES, resolveFields } from '@/lib/contact-defaults'
import { getContactPage, getPayloadClient } from '@/lib/data'

export type InquiryState =
  | { status: 'idle'; values?: Record<string, string> }
  | { status: 'success'; values?: Record<string, string> }
  | { status: 'error'; message?: string; fieldErrors?: Record<string, string>; values?: Record<string, string> }

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Validates and stores a contact-form submission using the form as configured in 後台 → 聯絡我們.
export async function submitInquiry(_prev: InquiryState, formData: FormData): Promise<InquiryState> {
  // Bots fill the hidden field; pretend success so they move on.
  if (String(formData.get('website') ?? '')) return { status: 'success' }

  const page = await getContactPage()
  const fields = resolveFields(page.fields)

  const values: Record<string, string> = {}
  const fieldErrors: Record<string, string> = {}
  for (const f of fields) {
    const max = f.type === 'textarea' ? 3000 : 200
    const v = String(formData.get(`f_${f.id}`) ?? '').trim().slice(0, max)
    values[f.id] = v
    if (f.required && !v) fieldErrors[f.id] = `請填寫${f.label}`
    else if (v && f.type === 'email' && !EMAIL.test(v)) fieldErrors[f.id] = 'Email 格式不正確'
  }

  const requireContact = page.requireContact ?? contactDefaults.requireContact
  const contactFields = fields.filter((f) => (CONTACT_ROLES as readonly string[]).includes(f.role ?? ''))
  if (requireContact && contactFields.length && contactFields.every((f) => !values[f.id])) {
    fieldErrors.contact = page.requireContactMessage || contactDefaults.requireContactMessage
  }

  if (Object.keys(fieldErrors).length) return { status: 'error', fieldErrors, values }

  // Known roles go to their own inquiry columns; everything else is listed under 其他欄位.
  const byRole = (role: string) => {
    const f = fields.find((x) => x.role === role)
    return f ? values[f.id] || undefined : undefined
  }
  const extras = fields
    .filter((f) => !f.role || f.role === 'other')
    .filter((f) => values[f.id])
    .map((f) => ({ label: f.label, value: values[f.id] }))

  try {
    const payload = await getPayloadClient()
    await payload.create({
      collection: 'inquiries',
      overrideAccess: true,
      data: {
        name: byRole('name') || '（未填）',
        email: byRole('email'),
        phone: byRole('phone'),
        lineId: byRole('lineId'),
        service: byRole('service'),
        budget: byRole('budget'),
        message: byRole('message') || extras.map((x) => `${x.label}：${x.value}`).join('\n') || '（未填）',
        extras,
        source: 'web',
        status: 'new',
      },
    })
    return { status: 'success' }
  } catch (e) {
    console.error('submitInquiry failed', e)
    return { status: 'error', message: page.errorText || contactDefaults.errorText, values }
  }
}

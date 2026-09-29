'use client'

import { useActionState } from 'react'

import { submitInquiry, type InquiryState } from '@/app/(frontend)/[lang]/contact/actions'
import { splitOptions, type FormField } from '@/lib/contact-defaults'

const initial: InquiryState = { status: 'idle' }

type Field = FormField & { id: string }

type Props = {
  fields: Field[]
  services: string[]
  texts: { contactHint: string; submitLabel: string; successTitle: string; successText: string; sending: string; selectPlaceholder: string }
  lang: string
  contactHintFieldId?: string
}

const autoComplete: Record<string, string> = { name: 'name', email: 'email', phone: 'tel' }

export function ContactForm({ fields, services, texts, contactHintFieldId, lang }: Props) {
  const [state, action, pending] = useActionState(submitInquiry, initial)

  if (state.status === 'success') {
    return (
      <div className="form-success" role="status">
        <h3>{texts.successTitle}</h3>
        <p className="pre">{texts.successText}</p>
      </div>
    )
  }

  const errors = state.status === 'error' ? (state.fieldErrors ?? {}) : {}
  const values = state.values ?? {}

  return (
    <form action={action} className="contact-form" noValidate>
      {state.status === 'error' && state.message ? (
        <p className="form-error field-full" role="alert">
          {state.message}
        </p>
      ) : null}

      {fields.map((f) => {
        const id = `f_${f.id}`
        const err = errors[f.id]
        const showContact = f.id === contactHintFieldId
        const common = {
          'aria-invalid': Boolean(err) || undefined,
          defaultValue: values[f.id],
          id,
          name: id,
          placeholder: f.placeholder || undefined,
          required: Boolean(f.required),
        }
        const options =
          f.type === 'select'
            ? f.useServices
              ? services
              : splitOptions(f.options)
            : []
        return (
          <div className={`field${f.width === 'half' ? '' : ' field-full'}`} key={f.id}>
            <label htmlFor={id}>
              {f.label} {f.required ? <span className="req">*</span> : null}
            </label>
            {f.type === 'textarea' ? (
              <textarea {...common} rows={6} />
            ) : f.type === 'select' ? (
              <select {...common} defaultValue={values[f.id] ?? ''}>
                <option value="">{f.emptyOption || texts.selectPlaceholder}</option>
                {options.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            ) : (
              <input {...common} autoComplete={autoComplete[f.role ?? ''] ?? undefined} type={f.type ?? 'text'} />
            )}
            {err ? <p className="field-error">{err}</p> : null}
            {showContact && errors.contact ? <p className="field-error">{errors.contact}</p> : null}
            {!err && !(showContact && errors.contact) && (f.hint || (showContact && texts.contactHint)) ? (
              <p className="field-hint">{f.hint || texts.contactHint}</p>
            ) : null}
          </div>
        )
      })}

      <input name="lang" type="hidden" value={lang} />
      {/* Honeypot: real visitors never see or fill this. */}
      <div aria-hidden className="hp">
        <label htmlFor="website">Website</label>
        <input autoComplete="off" id="website" name="website" tabIndex={-1} />
      </div>

      <button className="btn btn-accent btn-block field-full" disabled={pending} type="submit">
        {pending ? texts.sending : texts.submitLabel}
      </button>
    </form>
  )
}

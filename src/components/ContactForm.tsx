'use client'

import { useActionState } from 'react'

import { submitInquiry, type InquiryState } from '@/app/(frontend)/contact/actions'

const initial: InquiryState = { status: 'idle' }

export function ContactForm({ services }: { services: string[] }) {
  const [state, action, pending] = useActionState(submitInquiry, initial)

  if (state.status === 'success') {
    return (
      <div className="form-success" role="status">
        <h3>已收到你的詢問</h3>
        <p>謝謝你！我會在一個工作天內用你留下的方式回覆。</p>
      </div>
    )
  }

  const err = state.status === 'error' ? state.fieldErrors ?? {} : {}

  return (
    <form action={action} className="contact-form" noValidate>
      {state.status === 'error' && state.message ? (
        <p className="form-error" role="alert">
          {state.message}
        </p>
      ) : null}

      <div className="field">
        <label htmlFor="name">
          姓名或稱呼 <span className="req">*</span>
        </label>
        <input aria-invalid={!!err.name} autoComplete="name" defaultValue={state.values?.name} id="name" name="name" required />
        {err.name ? <p className="field-error">{err.name}</p> : null}
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="email">Email</label>
          <input aria-invalid={!!err.email} autoComplete="email" defaultValue={state.values?.email} id="email" name="email" type="email" />
          {err.email ? <p className="field-error">{err.email}</p> : null}
        </div>
        <div className="field">
          <label htmlFor="phone">電話</label>
          <input autoComplete="tel" defaultValue={state.values?.phone} id="phone" name="phone" type="tel" />
        </div>
      </div>

      <div className="field">
        <label htmlFor="lineId">LINE ID</label>
        <input defaultValue={state.values?.lineId} id="lineId" name="lineId" />
        {err.contact ? <p className="field-error">{err.contact}</p> : <p className="field-hint">Email、電話、LINE 至少留一種</p>}
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="service">想做的服務</label>
          <select defaultValue={state.values?.service ?? ''} id="service" name="service">
            <option value="">還不確定</option>
            {services.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="budget">預算範圍</label>
          <select defaultValue={state.values?.budget ?? ''} id="budget" name="budget">
            <option value="">還不確定</option>
            <option>3 萬以下</option>
            <option>3～6 萬</option>
            <option>6～10 萬</option>
            <option>10 萬以上</option>
          </select>
        </div>
      </div>

      <div className="field">
        <label htmlFor="message">
          需求說明 <span className="req">*</span>
        </label>
        <textarea
          aria-invalid={!!err.message}
          defaultValue={state.values?.message}
          id="message"
          name="message"
          placeholder="例如：想做一個工作室形象網站，需要作品集和線上預約，希望 11 月上線。"
          required
          rows={6}
        />
        {err.message ? <p className="field-error">{err.message}</p> : null}
      </div>

      {/* Honeypot: real visitors never see or fill this. */}
      <div aria-hidden className="hp">
        <label htmlFor="website">Website</label>
        <input autoComplete="off" id="website" name="website" tabIndex={-1} />
      </div>

      <button className="btn btn-accent btn-block" disabled={pending} type="submit">
        {pending ? '送出中…' : '送出詢問'}
      </button>
    </form>
  )
}

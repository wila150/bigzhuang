'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function CheckNowButton() {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function run() {
    setBusy(true)
    setError('')
    try {
      const res = await fetch('/api/sites/check-now', { method: 'POST', credentials: 'include' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      router.refresh()
    } catch (e) {
      setError(`檢查失敗：${e instanceof Error ? e.message : e}`)
    } finally {
      setBusy(false)
    }
  }

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      {error && <span style={{ color: '#e5484d', fontSize: 13 }}>{error}</span>}
      <button type="button" onClick={run} disabled={busy} className="btn btn--style-primary btn--size-small" style={{ margin: 0 }}>
        {busy ? '檢查中…（休眠的站最久約 1 分鐘）' : '立即檢查'}
      </button>
    </span>
  )
}

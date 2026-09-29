'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function LogoutButton() {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  return (
    <button
      className="btn btn-ghost btn-sm"
      disabled={busy}
      onClick={async () => {
        setBusy(true)
        await fetch('/api/clients/logout', { method: 'POST', credentials: 'include' }).catch(() => {})
        router.refresh()
      }}
      type="button"
    >
      登出
    </button>
  )
}

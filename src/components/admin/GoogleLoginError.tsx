'use client'

import { useSearchParams } from 'next/navigation'

export function GoogleLoginError() {
  const params = useSearchParams()
  if (params.get('google') !== 'failed') return null
  return (
    <p role="alert" style={{ margin: 0, color: 'var(--theme-error-500)' }}>
      Google 登入失敗。只有已加入「管理員」名單的 Email 才能用 Google 登入；請先用密碼登入，把你的 Gmail 加進「管理員」。
    </p>
  )
}

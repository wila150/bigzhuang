'use client'

import { useSearchParams } from 'next/navigation'

export function GoogleLoginError() {
  const params = useSearchParams()
  if (params.get('google') !== 'failed') return null
  return (
    <p role="alert" style={{ margin: 0, color: 'var(--theme-error-500)' }}>
      Google 登入失敗：這個 Google 帳號沒有後台權限。
    </p>
  )
}

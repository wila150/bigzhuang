import { googleLoginEnabled } from '@/auth/google'

import { GoogleLoginError } from './GoogleLoginError'

// Rendered under the admin login form (admin.components.afterLogin).
export default function GoogleLoginButton() {
  if (!googleLoginEnabled) return null
  return (
    <div style={{ marginTop: 24, display: 'grid', gap: 12 }}>
      <GoogleLoginError />
      {/* Plain <a>: the endpoint redirects to Google, so it must be a full navigation. */}
      <a
        href="/api/users/oauth/google"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          padding: '10px 16px',
          border: '1px solid var(--theme-elevation-150)',
          borderRadius: 4,
          background: 'var(--theme-elevation-0)',
          color: 'var(--theme-text)',
          textDecoration: 'none',
          fontWeight: 500,
        }}
      >
        <svg aria-hidden="true" height="18" viewBox="0 0 48 48" width="18">
          <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
          <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
          <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
          <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
        </svg>
        使用 Google 帳號登入
      </a>
    </div>
  )
}

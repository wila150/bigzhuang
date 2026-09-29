import { OAuth2Plugin } from 'payload-oauth2'

import { isAdminEmail } from './admins'

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

export const googleLoginEnabled = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)

/**
 * "Sign in with Google" for the admin.
 * Only accounts that already exist under 管理員 can sign in (onUserNotFoundBehavior: 'error'),
 * matched by email, so a stranger with a Google account gets nowhere. Password login keeps working.
 * The plugin stays registered even without credentials so the users table schema never changes.
 */
export const googleOAuth = OAuth2Plugin({
  enabled: true,
  strategyName: 'google',
  useEmailAsIdentity: true,
  onUserNotFoundBehavior: 'error',
  serverURL,
  authCollection: 'users',
  clientId: process.env.GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  authorizePath: '/oauth/google',
  callbackPath: '/oauth/google/callback',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  providerAuthorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
  scopes: ['openid', 'https://www.googleapis.com/auth/userinfo.email'],
  prompt: 'select_account',
  pkceEnabled: true,
  getUserInfo: async (accessToken) => {
    const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (!res.ok) throw new Error(`Google userinfo failed: ${res.status}`)
    const info = (await res.json()) as { sub?: string; email?: string; email_verified?: boolean }
    if (!info.email || !info.email_verified) throw new Error('Google account email is not verified')
    if (!isAdminEmail(info.email)) throw new Error(`Google account ${info.email} is not an admin`)
    // Only these two fields are written back to the matched user.
    return { email: info.email.toLowerCase(), sub: info.sub }
  },
  successRedirect: () => '/admin',
  failureRedirect: (_req, error) => {
    console.warn('Google login failed:', error instanceof Error ? error.message : error)
    return '/admin/login?google=failed'
  },
})

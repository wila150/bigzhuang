import { OAuth2Plugin } from 'payload-oauth2'

import { isAdminEmail } from './admins'

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

export const googleLoginEnabled = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)

type GoogleProfile = { sub?: string; email?: string; email_verified?: boolean }

async function fetchGoogleProfile(accessToken: string) {
  const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!res.ok) throw new Error(`Google userinfo failed: ${res.status}`)
  const info = (await res.json()) as GoogleProfile
  if (!info.email || !info.email_verified) throw new Error('Google account email is not verified')
  return { email: info.email.toLowerCase(), sub: info.sub }
}

/**
 * Google sign-in for one auth collection. Accounts must already exist (matched by verified email);
 * nobody gets created by signing in. Plugins stay registered without credentials so the schema is stable.
 */
function googleFor(opts: {
  collection: 'users' | 'clients'
  strategyName: string
  allow?: (email: string) => boolean
  successPath: string
  failurePath: string
}) {
  return OAuth2Plugin({
    enabled: true,
    strategyName: opts.strategyName,
    useEmailAsIdentity: true,
    onUserNotFoundBehavior: 'error',
    serverURL,
    authCollection: opts.collection,
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
      const profile = await fetchGoogleProfile(accessToken)
      if (opts.allow && !opts.allow(profile.email)) throw new Error(`${profile.email} is not allowed`)
      // Only these two fields are written back to the matched account.
      return profile
    },
    successRedirect: () => opts.successPath,
    failureRedirect: (_req, error) => {
      console.warn(`Google login (${opts.collection}) failed:`, error instanceof Error ? error.message : error)
      return opts.failurePath
    },
  })
}

// Admin: /api/users/oauth/google — only allowlisted emails (src/auth/admins.ts).
export const googleOAuthAdmin = googleFor({
  collection: 'users',
  strategyName: 'google',
  allow: isAdminEmail,
  successPath: '/admin',
  failurePath: '/admin/login?google=failed',
})

// Customer portal: /api/clients/oauth/google — only emails set on a client record in 客戶與月費.
export const googleOAuthClients = googleFor({
  collection: 'clients',
  strategyName: 'google-client',
  successPath: '/account',
  failurePath: '/account?login=failed',
})

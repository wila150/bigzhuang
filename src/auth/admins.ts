// The only people allowed into the admin. Override with ADMIN_EMAILS (comma-separated) if that ever changes.
export const adminEmails = (process.env.ADMIN_EMAILS || 'xiechengfang1@gmail.com')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean)

export const isAdminEmail = (email: unknown): boolean =>
  typeof email === 'string' && adminEmails.includes(email.trim().toLowerCase())

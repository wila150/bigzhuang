// Site owners: always allowed into the admin and their accounts can't be deleted. Other admins are added
// in 系統 → 管理員 by a signed-in admin. Override with OWNER_EMAILS (or the older ADMIN_EMAILS), comma-separated.
export const ownerEmails = (process.env.OWNER_EMAILS || process.env.ADMIN_EMAILS || 'xiechengfang1@gmail.com')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean)

export const isOwnerEmail = (email: unknown): boolean =>
  typeof email === 'string' && ownerEmails.includes(email.trim().toLowerCase())

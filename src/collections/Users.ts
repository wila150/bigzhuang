import type { CollectionConfig } from 'payload'
import { APIError } from 'payload'

import { isAdminEmail } from '../auth/admins'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: '管理員', plural: '管理員' },
  admin: { useAsTitle: 'email', group: '系統' },
  auth: true,
  access: {
    // Even a stray account in the database can't open the admin unless its email is allowlisted.
    admin: ({ req }) => isAdminEmail(req.user?.email),
  },
  hooks: {
    // Blocks every other email on create and on email change — including the public
    // "create first user" screen on a fresh database.
    beforeValidate: [
      ({ data, originalDoc }) => {
        const email = data?.email ?? originalDoc?.email
        if (!isAdminEmail(email)) throw new APIError('此 Email 不在管理員名單中，無法建立或使用這個帳號。', 403)
        return data
      },
    ],
  },
  fields: [],
}

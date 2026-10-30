import type { CollectionConfig } from 'payload'
import { APIError } from 'payload'

import { isAdmin } from '../access'
import { isOwnerEmail } from '../auth/admins'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: '管理員', plural: '管理員' },
  admin: {
    useAsTitle: 'email',
    group: '系統',
    description:
      '新增的人可以用同一個 Gmail 按「使用 Google 帳號登入」進後台（密碼隨便設，用 Google 登入時用不到）。要取消權限就刪掉帳號。網站擁有者的帳號不能刪除。',
  },
  auth: true,
  access: {
    read: isAdmin,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
    admin: ({ req }) => req.user?.collection === 'users',
  },
  hooks: {
    // A signed-in admin may add anyone. Without one — the public "create first user" screen on a fresh
    // database — only an owner email can be created, so a stranger can't claim the admin first.
    beforeValidate: [
      ({ data, originalDoc, req }) => {
        const email = (data?.email ?? originalDoc?.email ?? '').toLowerCase()
        const emailChanged = !originalDoc || email !== String(originalDoc.email).toLowerCase()
        if (!emailChanged || req.user?.collection === 'users' || isOwnerEmail(email)) return data
        throw new APIError('只有已登入的管理員可以新增其他管理員。', 403)
      },
    ],
    beforeDelete: [
      async ({ id, req }) => {
        if (req.user?.collection === 'users' && String(req.user.id) === String(id)) {
          throw new APIError('不能刪除自己的帳號。', 403)
        }
        const doc = await req.payload.findByID({ collection: 'users', id, depth: 0, overrideAccess: true, req })
        if (isOwnerEmail(doc.email)) throw new APIError('網站擁有者的帳號不能刪除。', 403)
      },
    ],
  },
  fields: [],
}

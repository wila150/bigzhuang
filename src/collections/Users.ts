import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: '管理員', plural: '管理員' },
  admin: { useAsTitle: 'email', group: '系統' },
  auth: true,
  fields: [],
}

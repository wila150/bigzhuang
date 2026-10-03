import type { CollectionConfig } from 'payload'

import { isAdmin } from '../access'

// Where each chat user is in the guided inquiry or repair report (one row per user, removed when done or cancelled).
export const LineSessions: CollectionConfig = {
  slug: 'line-sessions',
  labels: { singular: 'LINE 對話狀態', plural: 'LINE 對話狀態' },
  access: { read: isAdmin, create: isAdmin, update: isAdmin, delete: isAdmin },
  admin: { hidden: true },
  fields: [
    { name: 'userId', type: 'text', required: true, unique: true, index: true },
    { name: 'displayName', type: 'text' },
    { name: 'flow', type: 'select', defaultValue: 'inquiry', options: ['inquiry', 'repair'] },
    { name: 'step', type: 'number', required: true, defaultValue: 0 },
    { name: 'answers', type: 'json' },
    // Screenshots received during a repair report (only the first one gets a reply).
    { name: 'images', type: 'number', defaultValue: 0 },
  ],
}

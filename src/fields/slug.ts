import type { Field } from 'payload'

export const slugField = (description = '網址用的英文代稱，例如 brand-website'): Field => ({
  name: 'slug',
  label: '網址代稱',
  type: 'text',
  required: true,
  unique: true,
  index: true,
  admin: { position: 'sidebar', description },
  validate: (value: unknown) =>
    typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
      ? true
      : '只能用小寫英文、數字與連字號',
})

export const orderField: Field = {
  name: 'order',
  label: '排序',
  type: 'number',
  defaultValue: 0,
  admin: { position: 'sidebar', description: '數字小的排前面' },
}

export const publishedField: Field = {
  name: 'published',
  label: '上架',
  type: 'checkbox',
  defaultValue: true,
  admin: { position: 'sidebar' },
}

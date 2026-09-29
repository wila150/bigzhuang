import type { Access, FieldAccess } from 'payload'

export const anyone: Access = () => true

// Clients can log in too (customer portal), so "logged in" is not enough — only the users collection is staff.
export const isAdmin: Access = ({ req }) => req.user?.collection === 'users'
export const isAdminField: FieldAccess = ({ req }) => req.user?.collection === 'users'

// Public visitors only see published docs; admins see everything.
export const publishedOrAdmin: Access = ({ req }) =>
  req.user?.collection === 'users' ? true : { published: { equals: true } }

// Staff or a signed-in client (customer portal) — used for payment details.
export const adminOrClientField: FieldAccess = ({ req }) =>
  req.user?.collection === 'users' || req.user?.collection === 'clients'

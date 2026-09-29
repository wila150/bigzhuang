import type { Access } from 'payload'

export const anyone: Access = () => true
export const loggedIn: Access = ({ req }) => Boolean(req.user)

// Public visitors only see published docs; logged-in editors see everything.
export const publishedOrLoggedIn: Access = ({ req }) =>
  req.user ? true : { published: { equals: true } }

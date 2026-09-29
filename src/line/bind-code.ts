import crypto from 'crypto'

// Six-character code derived from PAYLOAD_SECRET: stable, shown only in the admin, unguessable from outside.
export const lineBindCode = () =>
  crypto.createHmac('sha256', process.env.PAYLOAD_SECRET || '').update('line-bind').digest('hex').slice(0, 6).toUpperCase()

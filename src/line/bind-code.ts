import crypto from 'crypto'

// Six-character code derived from PAYLOAD_SECRET: stable, shown only in the admin, unguessable from outside.
export const lineBindCode = () =>
  crypto.createHmac('sha256', process.env.PAYLOAD_SECRET || '').update('line-bind').digest('hex').slice(0, 6).toUpperCase()

// Per-client code for linking a client's LINE to bill reminders (「綁定帳單 XXXXXX」), same idea as the admin code.
export const clientBindCode = (clientId: number | string) =>
  crypto.createHmac('sha256', process.env.PAYLOAD_SECRET || '').update(`client-bind:${clientId}`).digest('hex').slice(0, 6).toUpperCase()

export const clientBindCommand = (clientId: number | string) => `綁定帳單 ${clientBindCode(clientId)}`

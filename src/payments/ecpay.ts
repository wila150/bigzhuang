import crypto from 'crypto'

/**
 * ECPay (綠界) all-in-one credit card checkout.
 * Turned on only when ECPAY_MERCHANT_ID / ECPAY_HASH_KEY / ECPAY_HASH_IV are set.
 * ECPAY_ENV=stage uses the sandbox; anything else is live.
 * Sandbox test merchant (public): MerchantID 3002607, HashKey pwFHCqoQZGmho4w6, HashIV EkRm7iFT261dpevs.
 */
const merchantId = process.env.ECPAY_MERCHANT_ID || ''
const hashKey = process.env.ECPAY_HASH_KEY || ''
const hashIV = process.env.ECPAY_HASH_IV || ''
export const ecpayIsStage = process.env.ECPAY_ENV === 'stage'

export const ecpayEnabled = Boolean(merchantId && hashKey && hashIV)

const checkoutUrl = ecpayIsStage
  ? 'https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5'
  : 'https://payment.ecpay.com.tw/Cashier/AioCheckOut/V5'

// ECPay's CheckMacValue: .NET-style URL encoding, lowercased, SHA256, uppercased.
function dotNetUrlEncode(value: string) {
  return encodeURIComponent(value)
    .replace(/%20/g, '+')
    .replace(/%2d/gi, '-')
    .replace(/%5f/gi, '_')
    .replace(/%2e/gi, '.')
    .replace(/%21/g, '!')
    .replace(/%2a/gi, '*')
    .replace(/%28/g, '(')
    .replace(/%29/g, ')')
    .replace(/'/g, '%27')
}

export function checkMacValue(params: Record<string, string>) {
  const query = Object.keys(params)
    .filter((k) => k !== 'CheckMacValue')
    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
    .map((k) => `${k}=${params[k]}`)
    .join('&')
  const raw = `HashKey=${hashKey}&${query}&HashIV=${hashIV}`
  return crypto.createHash('sha256').update(dotNetUrlEncode(raw).toLowerCase()).digest('hex').toUpperCase()
}

export function verifyCheckMacValue(params: Record<string, string>) {
  const given = params.CheckMacValue || ''
  const expected = checkMacValue(params)
  return given.length === expected.length && crypto.timingSafeEqual(Buffer.from(given), Buffer.from(expected))
}

/** Up to 20 alphanumeric chars, unique per attempt. */
export function newTradeNo() {
  return `BZ${Date.now().toString(36).toUpperCase()}${crypto.randomBytes(3).toString('hex').toUpperCase()}`.slice(0, 20)
}

function taipeiTimestamp(date = new Date()) {
  const t = new Date(date.getTime() + 8 * 60 * 60 * 1000)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${t.getUTCFullYear()}/${p(t.getUTCMonth() + 1)}/${p(t.getUTCDate())} ${p(t.getUTCHours())}:${p(t.getUTCMinutes())}:${p(t.getUTCSeconds())}`
}

export function buildCheckout(opts: {
  tradeNo: string
  amount: number
  itemName: string
  serverURL: string
  customField?: string
}) {
  const params: Record<string, string> = {
    MerchantID: merchantId,
    MerchantTradeNo: opts.tradeNo,
    MerchantTradeDate: taipeiTimestamp(),
    PaymentType: 'aio',
    TotalAmount: String(Math.round(opts.amount)),
    TradeDesc: 'BigZhaung monthly fee',
    ItemName: opts.itemName.replace(/[#&]/g, ' ').slice(0, 200),
    ReturnURL: `${opts.serverURL}/payments/ecpay/notify`,
    ClientBackURL: `${opts.serverURL}/account`,
    OrderResultURL: `${opts.serverURL}/payments/ecpay/result`,
    ChoosePayment: 'Credit',
    EncryptType: '1',
    ...(opts.customField ? { CustomField1: opts.customField } : {}),
  }
  params.CheckMacValue = checkMacValue(params)
  return { action: checkoutUrl, params }
}

export async function readForm(req: Request) {
  const form = await req.formData()
  const out: Record<string, string> = {}
  form.forEach((v, k) => {
    out[k] = String(v)
  })
  return out
}

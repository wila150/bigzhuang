import { readForm, verifyCheckMacValue } from '@/payments/ecpay'

// Where ECPay sends the customer's browser after paying (OrderResultURL).
// Only used for the on-screen message; the bill itself is marked paid by /payments/ecpay/notify.
export async function POST(req: Request) {
  const data = await readForm(req)
  const ok = verifyCheckMacValue(data) && data.RtnCode === '1'
  return Response.redirect(new URL(`/account?paid=${ok ? 1 : 0}`, req.url), 303)
}

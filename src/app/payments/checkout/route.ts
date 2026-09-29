import { getPayloadClient } from '@/lib/data'
import { getCurrentClient } from '@/lib/client-session'
import { buildCheckout, ecpayEnabled, newTradeNo } from '@/payments/ecpay'

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

const escape = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`)

// Starts a card payment for one of the signed-in client's own unpaid bills.
export async function POST(req: Request) {
  if (!ecpayEnabled) return new Response('Card payment is not enabled', { status: 404 })

  const client = await getCurrentClient()
  if (!client) return Response.redirect(new URL('/account', req.url), 303)

  const billId = String((await req.formData()).get('bill') ?? '')
  const bill = client.bills?.find((b) => b.id === billId)
  if (!bill || bill.status === 'paid' || !bill.amount) return Response.redirect(new URL('/account?paid=0', req.url), 303)

  // Record the trade number first so the payment notification can find this bill.
  const tradeNo = newTradeNo()
  const payload = await getPayloadClient()
  await payload.update({
    collection: 'clients',
    id: client.id,
    overrideAccess: true,
    data: { bills: client.bills!.map((b) => (b.id === billId ? { ...b, tradeNo } : b)) },
  })

  const { action, params } = buildCheckout({
    tradeNo,
    amount: bill.amount,
    itemName: `BigZhaung 月費 ${bill.month}`,
    serverURL,
    customField: `${client.id}:${billId}`,
  })

  const inputs = Object.entries(params)
    .map(([k, v]) => `<input type="hidden" name="${escape(k)}" value="${escape(v)}">`)
    .join('')
  const html = `<!doctype html><html lang="zh-Hant-TW"><meta charset="utf-8"><title>前往付款…</title>
<body style="font-family:sans-serif;text-align:center;padding:4rem">
<p>正在前往綠界付款頁面…</p>
<form id="f" method="post" action="${escape(action)}">${inputs}<noscript><button>前往付款</button></noscript></form>
<script>document.getElementById('f').submit()</script></body></html>`
  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } })
}

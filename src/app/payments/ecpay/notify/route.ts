import { getPayloadClient } from '@/lib/data'
import { ecpayEnabled, ecpayIsStage, readForm, verifyCheckMacValue } from '@/payments/ecpay'

const reply = (body: string, status = 200) => new Response(body, { status, headers: { 'Content-Type': 'text/plain' } })

// ECPay's server-to-server payment result (ReturnURL). Must answer "1|OK" or ECPay retries.
export async function POST(req: Request) {
  if (!ecpayEnabled) return reply('0|disabled', 404)

  const data = await readForm(req)
  if (!verifyCheckMacValue(data)) return reply('0|CheckMacValue error', 400)

  // Simulated payments from the ECPay merchant console only count in the sandbox.
  if (data.SimulatePaid === '1' && !ecpayIsStage) return reply('1|OK')
  if (data.RtnCode !== '1') return reply('1|OK')

  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'clients',
    where: { 'bills.tradeNo': { equals: data.MerchantTradeNo } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  const client = docs[0]
  const bill = client?.bills?.find((b) => b.tradeNo === data.MerchantTradeNo)
  if (!client || !bill) return reply('0|order not found', 404)
  if (bill.status === 'paid') return reply('1|OK')
  if (Number(data.TradeAmt) !== Math.round(bill.amount)) return reply('0|amount mismatch', 400)

  await payload.update({
    collection: 'clients',
    id: client.id,
    overrideAccess: true,
    data: {
      bills: client.bills!.map((b) =>
        b.id === bill.id ? { ...b, status: 'paid', paymentMethod: 'card', paidAt: new Date().toISOString() } : b,
      ),
    },
  })
  payload.logger.info(`ECPay: ${client.name} paid ${bill.month} (${data.MerchantTradeNo})`)
  return reply('1|OK')
}

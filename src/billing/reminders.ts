import type { Payload } from 'payload'

import { notifyAdmin } from '../line/notify'
import { lineEnabled, push } from '../line/client'
import type { Client } from '../payload-types'

// Remind clients by LINE once a bill is due within this many days.
export const REMIND_DAYS = 7

const DAY = 86_400_000
// Calendar date (YYYY-MM-DD) in Taiwan, so "due in 7 days" doesn't shift with the server's UTC clock.
const taipeiDate = (d: Date) => d.toLocaleDateString('sv-SE', { timeZone: 'Asia/Taipei' })
const daysUntil = (dueIso: string, now: Date) => Math.round((Date.parse(taipeiDate(new Date(dueIso))) - Date.parse(taipeiDate(now))) / DAY)
const md = (iso: string) => taipeiDate(new Date(iso)).slice(5).replace('-', '/')
const twd = (n: number) => `NT$ ${n.toLocaleString('zh-TW')}`

type Bill = NonNullable<Client['bills']>[number]

/**
 * Daily: LINE the client once when an unpaid bill is due within REMIND_DAYS days,
 * and once a bill is past due mark it 逾期 and tell the admin. Each bill is handled only once (remindedAt / overdueNotifiedAt).
 */
export async function runBillReminders(payload: Payload, now = new Date()) {
  const accountUrl = `${process.env.NEXT_PUBLIC_SERVER_URL || ''}/account`
  const { docs: clients } = await payload.find({ collection: 'clients', limit: 500, depth: 0, overrideAccess: true, pagination: false })
  const overdue: string[] = []
  const unbound: string[] = []
  let reminded = 0

  for (const client of clients) {
    let changed = false
    const bills: Bill[] = (client.bills ?? []).map((b) => ({ ...b }))
    for (const bill of bills) {
      if (bill.status === 'paid' || !bill.dueDate) continue
      const left = daysUntil(bill.dueDate, now)

      if (left < 0) {
        if (bill.status !== 'overdue') ((bill.status = 'overdue'), (changed = true))
        if (!bill.overdueNotifiedAt) {
          bill.overdueNotifiedAt = now.toISOString()
          changed = true
          overdue.push(`・${client.name} ${bill.month} ${twd(bill.amount)}（${md(bill.dueDate)} 到期，逾期 ${-left} 天）`)
        }
        continue
      }

      if (left <= REMIND_DAYS && !bill.remindedAt) {
        if (!client.lineUserId || !lineEnabled) {
          // Can't reach them by LINE: tell the admin instead (once per bill).
          unbound.push(`・${client.name} ${bill.month} ${twd(bill.amount)}（${md(bill.dueDate)} 到期）`)
          bill.remindedAt = now.toISOString()
          changed = true
          continue
        }
        try {
          const when = left === 0 ? '今天' : `${md(bill.dueDate)}（還有 ${left} 天）`
          await push(client.lineUserId, [
            {
              type: 'text',
              text: `${client.name} 您好，提醒您 ${bill.month} 的網站月費 ${twd(bill.amount)} 繳費期限是 ${when}。\n\n可以在客戶專區刷卡或查看匯款資訊：\n${accountUrl}\n\n已經付款的話請忽略，謝謝！`,
            },
          ])
          bill.remindedAt = now.toISOString()
          changed = true
          reminded++
        } catch (e) {
          // Leave remindedAt empty so tomorrow's run tries again.
          payload.logger.warn(`Bill reminder to ${client.name} failed: ${e instanceof Error ? e.message : e}`)
        }
      }
    }
    if (changed) await payload.update({ collection: 'clients', id: client.id, data: { bills }, overrideAccess: true })
  }

  if (overdue.length) await notifyAdmin(payload, 'payment', `⚠️ 有帳單逾期了：\n${overdue.join('\n')}\n\n已改成「逾期」，可以到後台「客戶與月費」查看。`)
  if (unbound.length)
    await notifyAdmin(payload, 'payment', `📮 這些帳單 ${REMIND_DAYS} 天內到期，但客戶還沒綁 LINE，請手動提醒：\n${unbound.join('\n')}\n\n（客戶在客戶專區可以看到綁定指令）`)
  return { reminded, overdue: overdue.length, unbound: unbound.length }
}

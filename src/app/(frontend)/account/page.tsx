import type { Metadata } from 'next'

import { PageHero } from '@/components/Breadcrumbs'
import { LogoutButton } from '@/components/LogoutButton'
import { getCurrentClient } from '@/lib/client-session'
import { getPayloadClient } from '@/lib/data'
import { googleLoginEnabled } from '@/auth/google'
import { ecpayEnabled, ecpayIsStage } from '@/payments/ecpay'

export const metadata: Metadata = { title: '客戶專區', robots: { index: false } }

type Props = { searchParams: Promise<Record<string, string | undefined>> }

const statusLabel = { unpaid: '未繳', paid: '已繳', overdue: '逾期' } as const
const methodLabel = { card: '信用卡', transfer: '匯款', other: '其他' } as const
const twd = (n?: number | null) => (n == null ? '—' : `NT$ ${n.toLocaleString('zh-TW')}`)
const day = (iso?: string | null) => (iso ? new Date(iso).toLocaleDateString('zh-TW', { timeZone: 'Asia/Taipei' }) : '—')

export default async function AccountPage({ searchParams }: Props) {
  const params = await searchParams
  const client = await getCurrentClient()

  if (!client) {
    return (
      <>
        <PageHero crumbs={[{ label: '客戶專區' }]} lead="合作中的客戶可以在這裡查看每月帳單與付款。" title="客戶專區" />
        <section className="section">
          <div className="container account-login">
            {params.login === 'failed' ? (
              <p className="form-error" role="alert">
                登入失敗：這個 Google 帳號尚未開通客戶專區。請確認用的是提供給大壯的 Email，或直接聯絡我。
              </p>
            ) : null}
            {googleLoginEnabled ? (
              // Plain <a>: the endpoint redirects to Google, so it must be a full page navigation.
              <a className="btn btn-primary btn-google" href="/api/clients/oauth/google">
                使用 Google 帳號登入
              </a>
            ) : (
              <p className="empty-note">客戶登入尚未開放。</p>
            )}
          </div>
        </section>
      </>
    )
  }

  const payload = await getPayloadClient()
  const settings = await payload.findGlobal({ slug: 'site-settings', overrideAccess: true })
  const bills = [...(client.bills ?? [])].sort((a, b) => b.month.localeCompare(a.month))
  const hasBank = settings.bankAccount && settings.bankName
  const due = bills.filter((b) => b.status !== 'paid')

  return (
    <>
      <PageHero crumbs={[{ label: '客戶專區' }]} title={`${client.name}，你好`} />
      <section className="section account">
        <div className="container">
          {params.paid === '1' ? (
            <p className="form-success-inline" role="status">
              付款完成，謝謝！帳單狀態會在幾分鐘內更新。
            </p>
          ) : null}
          {params.paid === '0' ? (
            <p className="form-error" role="alert">
              付款沒有完成，帳單未扣款。可以再試一次，或改用匯款。
            </p>
          ) : null}
          {ecpayIsStage && ecpayEnabled ? <p className="form-error">目前是金流測試模式，不會真的扣款。</p> : null}

          <div className="account-summary">
            <div>
              <span>網站</span>
              <strong>{client.site || '—'}</strong>
            </div>
            <div>
              <span>月費</span>
              <strong>{twd(client.monthlyFee)}</strong>
            </div>
            <div>
              <span>每月扣款日</span>
              <strong>{client.billingDay ? `${client.billingDay} 日` : '—'}</strong>
            </div>
            <div>
              <span>待繳</span>
              <strong className={due.length ? 'is-due' : undefined}>{due.length ? `${due.length} 筆` : '無'}</strong>
            </div>
          </div>

          <h2>帳單</h2>
          {bills.length ? (
            <div className="table-wrap">
              <table className="bill-table">
                <thead>
                  <tr>
                    <th scope="col">月份</th>
                    <th scope="col">金額</th>
                    <th scope="col">繳費期限</th>
                    <th scope="col">狀態</th>
                    <th scope="col">付款</th>
                  </tr>
                </thead>
                <tbody>
                  {bills.map((b) => (
                    <tr key={b.id}>
                      <td>{b.month}</td>
                      <td>{twd(b.amount)}</td>
                      <td>{day(b.dueDate)}</td>
                      <td>
                        <span className={`bill-status is-${b.status ?? 'unpaid'}`}>{statusLabel[b.status ?? 'unpaid']}</span>
                      </td>
                      <td>
                        {b.status === 'paid' ? (
                          <span className="bill-paid">
                            {b.paymentMethod ? methodLabel[b.paymentMethod] : ''} {day(b.paidAt)}
                          </span>
                        ) : ecpayEnabled ? (
                          <form action="/account/pay" method="post">
                            <input name="bill" type="hidden" value={b.id ?? ''} />
                            <button className="btn btn-accent btn-sm" type="submit">
                              刷卡付款
                            </button>
                          </form>
                        ) : (
                          <span className="bill-paid">請匯款</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="empty-note">目前沒有帳單。</p>
          )}

          {hasBank ? (
            <div className="bank-box">
              <h2>匯款資訊</h2>
              <dl>
                <div>
                  <dt>銀行</dt>
                  <dd>
                    {settings.bankName}
                    {settings.bankCode ? `（${settings.bankCode}）` : ''}
                  </dd>
                </div>
                <div>
                  <dt>帳號</dt>
                  <dd className="mono">{settings.bankAccount}</dd>
                </div>
                {settings.bankAccountName ? (
                  <div>
                    <dt>戶名</dt>
                    <dd>{settings.bankAccountName}</dd>
                  </div>
                ) : null}
              </dl>
              {settings.paymentNote ? <p className="pre">{settings.paymentNote}</p> : null}
            </div>
          ) : null}

          <div className="account-footer">
            <span>登入帳號：{client.email}</span>
            <LogoutButton />
          </div>
        </div>
      </section>
    </>
  )
}

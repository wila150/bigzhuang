import type { Metadata } from 'next'

import { PageHero } from '@/components/Breadcrumbs'
import { LogoutButton } from '@/components/LogoutButton'
import { getCurrentClient } from '@/lib/client-session'
import { getPayloadClient } from '@/lib/data'
import { googleLoginEnabled } from '@/auth/google'
import { getDictionary } from '@/i18n/dictionaries'
import { pageLang, type LangParams } from '@/i18n/page'
import { ecpayEnabled, ecpayIsStage } from '@/payments/ecpay'

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  return { title: getDictionary(await pageLang(params)).account.title, robots: { index: false } }
}

type Props = LangParams & { searchParams: Promise<Record<string, string | undefined>> }

const twd = (n?: number | null) => (n == null ? '—' : `NT$ ${n.toLocaleString('zh-TW')}`)

export default async function AccountPage({ params: routeParams, searchParams }: Props) {
  const lang = await pageLang(routeParams)
  const t = getDictionary(lang).account
  const day = (iso?: string | null) =>
    iso ? new Date(iso).toLocaleDateString(lang === 'en' ? 'en-GB' : 'zh-TW', { timeZone: 'Asia/Taipei' }) : '—'
  const params = await searchParams
  const client = await getCurrentClient()

  if (!client) {
    return (
      <>
        <PageHero crumbs={[{ label: t.title }]} lang={lang} lead={t.lead} title={t.title} />
        <section className="section">
          <div className="container account-login">
            {params.login === 'failed' ? (
              <p className="form-error" role="alert">
                {t.loginFailed}
              </p>
            ) : null}
            {googleLoginEnabled ? (
              // Plain <a>: the endpoint redirects to Google, so it must be a full page navigation.
              <a className="btn btn-primary btn-google" href="/api/clients/oauth/google">
                {t.loginGoogle}
              </a>
            ) : (
              <p className="empty-note">{t.loginClosed}</p>
            )}
          </div>
        </section>
      </>
    )
  }

  const payload = await getPayloadClient()
  const settings = await payload.findGlobal({ slug: 'site-settings', overrideAccess: true, locale: lang })
  const bills = [...(client.bills ?? [])].sort((a, b) => b.month.localeCompare(a.month))
  const hasBank = settings.bankAccount && settings.bankName
  const due = bills.filter((b) => b.status !== 'paid')

  return (
    <>
      <PageHero crumbs={[{ label: t.title }]} lang={lang} title={t.hello(client.name)} />
      <section className="section account">
        <div className="container">
          {params.paid === '1' ? (
            <p className="form-success-inline" role="status">
              {t.paidOk}
            </p>
          ) : null}
          {params.paid === '0' ? (
            <p className="form-error" role="alert">
              {t.paidFail}
            </p>
          ) : null}
          {ecpayIsStage && ecpayEnabled ? <p className="form-error">{t.stage}</p> : null}

          <div className="account-summary">
            <div>
              <span>{t.site}</span>
              <strong>{client.site || '—'}</strong>
            </div>
            <div>
              <span>{t.fee}</span>
              <strong>{twd(client.monthlyFee)}</strong>
            </div>
            <div>
              <span>{t.billingDay}</span>
              <strong>{client.billingDay ? t.day(client.billingDay) : '—'}</strong>
            </div>
            <div>
              <span>{t.due}</span>
              <strong className={due.length ? 'is-due' : undefined}>{due.length ? t.dueCount(due.length) : t.none}</strong>
            </div>
          </div>

          <h2>{t.bills}</h2>
          {bills.length ? (
            <div className="table-wrap">
              <table className="bill-table">
                <thead>
                  <tr>
                    <th scope="col">{t.month}</th>
                    <th scope="col">{t.amount}</th>
                    <th scope="col">{t.dueDate}</th>
                    <th scope="col">{t.status}</th>
                    <th scope="col">{t.pay}</th>
                  </tr>
                </thead>
                <tbody>
                  {bills.map((b) => (
                    <tr key={b.id}>
                      <td>{b.month}</td>
                      <td>{twd(b.amount)}</td>
                      <td>{day(b.dueDate)}</td>
                      <td>
                        <span className={`bill-status is-${b.status ?? 'unpaid'}`}>{t.statusLabel[b.status ?? 'unpaid']}</span>
                      </td>
                      <td>
                        {b.status === 'paid' ? (
                          <span className="bill-paid">
                            {b.paymentMethod ? t.methodLabel[b.paymentMethod] : ''} {day(b.paidAt)}
                          </span>
                        ) : ecpayEnabled ? (
                          <form action="/payments/checkout" method="post">
                            <input name="bill" type="hidden" value={b.id ?? ''} />
                            <button className="btn btn-accent btn-sm" type="submit">
                              {t.payCard}
                            </button>
                          </form>
                        ) : (
                          <span className="bill-paid">{t.payTransfer}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="empty-note">{t.noBills}</p>
          )}

          {hasBank ? (
            <div className="bank-box">
              <h2>{t.bank}</h2>
              <dl>
                <div>
                  <dt>{t.bankName}</dt>
                  <dd>
                    {settings.bankName}
                    {settings.bankCode ? `（${settings.bankCode}）` : ''}
                  </dd>
                </div>
                <div>
                  <dt>{t.bankAccount}</dt>
                  <dd className="mono">{settings.bankAccount}</dd>
                </div>
                {settings.bankAccountName ? (
                  <div>
                    <dt>{t.bankHolder}</dt>
                    <dd>{settings.bankAccountName}</dd>
                  </div>
                ) : null}
              </dl>
              {settings.paymentNote ? <p className="pre">{settings.paymentNote}</p> : null}
            </div>
          ) : null}

          <div className="account-footer">
            <span>{t.loggedInAs}{client.email}</span>
            <LogoutButton label={t.logout} />
          </div>
        </div>
      </section>
    </>
  )
}

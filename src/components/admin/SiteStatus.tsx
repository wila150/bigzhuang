import type { Payload, TypedUser } from 'payload'

import { siteHealthUrl } from '@/monitor/check'

import { CheckNowButton } from './CheckNowButton'

const dot: Record<string, { color: string; label: string }> = {
  up: { color: '#22a06b', label: '正常' },
  down: { color: '#e5484d', label: '斷線' },
  unknown: { color: '#9ca3af', label: '尚未檢查' },
}

const timeFmt = new Intl.DateTimeFormat('zh-TW', {
  timeZone: 'Asia/Taipei',
  month: 'numeric',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

const cell = { padding: '10px 12px', borderBottom: '1px solid var(--theme-elevation-100)', textAlign: 'left' as const }

// Rendered above the admin dashboard (admin.components.beforeDashboard).
export default async function SiteStatus({ payload, user }: { payload: Payload; user?: TypedUser | null }) {
  if (user?.collection !== 'users') return null
  const { docs: sites } = await payload.find({ collection: 'sites', limit: 100, depth: 0, sort: 'name', overrideAccess: true })
  const watched = sites.filter((s) => s.enabled)
  const down = watched.filter((s) => s.status === 'down').length

  return (
    <section style={{ marginBottom: 40 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 12 }}>
        <div>
          <h2 style={{ margin: 0 }}>網站監控</h2>
          <p style={{ margin: '4px 0 0', color: 'var(--theme-elevation-500)' }}>
            {watched.length === 0
              ? '還沒有監控中的網站'
              : down > 0
                ? `${down} 個網站斷線，共監控 ${watched.length} 個`
                : `${watched.length} 個網站全部正常`}
            ・每 10 分鐘自動檢查
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <a href="/admin/collections/sites/create" className="btn btn--style-secondary btn--size-small" style={{ margin: 0 }}>
            新增網站
          </a>
          {watched.length > 0 && <CheckNowButton />}
        </div>
      </div>

      {sites.length > 0 && (
        <div style={{ overflowX: 'auto', border: '1px solid var(--theme-elevation-100)', borderRadius: 4 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ color: 'var(--theme-elevation-500)' }}>
                <th style={cell}>網站</th>
                <th style={cell}>狀態</th>
                <th style={cell}>回應時間</th>
                <th style={cell}>上次檢查</th>
                <th style={cell}>最近錯誤</th>
              </tr>
            </thead>
            <tbody>
              {sites.map((s) => {
                const d = s.enabled ? dot[s.status ?? 'unknown'] : { color: '#d1d5db', label: '已暫停' }
                return (
                  <tr key={s.id}>
                    <td style={cell}>
                      <a href={`/admin/collections/sites/${s.id}`} style={{ fontWeight: 600 }}>
                        {s.name}
                      </a>
                      <div style={{ color: 'var(--theme-elevation-500)', fontSize: 12, wordBreak: 'break-all' }}>{siteHealthUrl(s)}</div>
                    </td>
                    <td style={{ ...cell, whiteSpace: 'nowrap' }}>
                      <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: d.color, marginRight: 6 }} />
                      {d.label}
                    </td>
                    <td style={{ ...cell, whiteSpace: 'nowrap' }}>{s.responseMs != null ? `${s.responseMs} ms` : '—'}</td>
                    <td style={{ ...cell, whiteSpace: 'nowrap' }}>{s.lastCheckedAt ? timeFmt.format(new Date(s.lastCheckedAt)) : '—'}</td>
                    <td style={{ ...cell, color: '#e5484d' }}>{s.status === 'up' ? '' : s.lastError || ''}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

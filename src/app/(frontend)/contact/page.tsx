import type { Metadata } from 'next'

import { PageHero } from '@/components/Breadcrumbs'
import { ContactForm } from '@/components/ContactForm'
import { Icon, LineIcon } from '@/components/Icon'
import { getServices, getSettings } from '@/lib/data'

export const metadata: Metadata = { title: '聯絡我們', description: '用 LINE、Email、IG 或表單聯絡 BigZhaung，一個工作天內回覆。' }

export default async function ContactPage() {
  const [settings, services] = await Promise.all([getSettings(), getServices()])

  const channels = [
    settings.lineId && {
      icon: <LineIcon size={26} />,
      label: 'LINE',
      value: settings.lineId,
      href: settings.lineUrl,
      note: '最快，通常當天回覆',
    },
    settings.email && {
      icon: <Icon name="mail" size={26} />,
      label: 'Email',
      value: settings.email,
      href: `mailto:${settings.email}`,
      note: '適合附上參考資料',
    },
    settings.instagram && {
      icon: <Icon name="instagram" size={26} />,
      label: 'Instagram',
      value: `@${settings.instagram}`,
      href: `https://www.instagram.com/${settings.instagram}/`,
      note: '看看最近在做什麼',
    },
  ].filter(Boolean) as { icon: React.ReactNode; label: string; value: string; href?: string | null; note: string }[]

  return (
    <>
      <PageHero crumbs={[{ label: '聯絡我們' }]} lead="告訴我你想做的網站，先聊聊不收費，一個工作天內回覆。" title="聯絡我們" />
      <section className="section">
        <div className="container contact-grid">
          <div className="contact-channels">
            <h2>聯絡管道</h2>
            {channels.length ? (
              <ul>
                {channels.map((c) => (
                  <li key={c.label}>
                    <span className="channel-icon">{c.icon}</span>
                    <div>
                      <span className="channel-label">{c.label}</span>
                      {c.href ? (
                        <a href={c.href} rel="noopener noreferrer" target={c.href.startsWith('mailto') ? undefined : '_blank'}>
                          {c.value}
                        </a>
                      ) : (
                        <span>{c.value}</span>
                      )}
                      <span className="channel-note">{c.note}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty-note">聯絡帳號設定中，請先使用右側表單。</p>
            )}
            {settings.serviceArea ? (
              <p className="contact-area">
                <Icon name="pin" size={18} /> {settings.serviceArea}
              </p>
            ) : null}
          </div>
          <div className="contact-form-wrap">
            <h2>線上詢問</h2>
            <ContactForm services={services.map((s) => s.title)} />
          </div>
        </div>
      </section>
    </>
  )
}

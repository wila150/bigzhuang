import Image from 'next/image'
import Link from 'next/link'

import type { SiteSetting } from '@/payload-types'

import { Icon, LineIcon } from './Icon'

const quickLinks = [
  { href: '/about', label: '關於大壯' },
  { href: '/services', label: '服務項目' },
  { href: '/works', label: '作品案例' },
  { href: '/process', label: '合作流程' },
  { href: '/faq', label: '常見問題' },
  { href: '/contact', label: '聯絡我們' },
]

export function Footer({ settings }: { settings: SiteSetting }) {
  const year = new Date().getFullYear()
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-col footer-brand">
          <Link aria-label="BigZhaung 回首頁" href="/">
            <Image alt="BigZhaung" height={885} src="/logo-navigation.png" width={2247} />
          </Link>
          <p className="footer-name">BigZhaung 大壯做網站</p>
          {settings.footerBlurb ? <p>{settings.footerBlurb}</p> : null}
        </div>

        <div className="footer-col">
          <h2 className="footer-title">快速連結</h2>
          <ul className="footer-links">
            {quickLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-col">
          <h2 className="footer-title">聯絡資訊</h2>
          <ul className="footer-contact">
            {settings.lineId ? (
              <li>
                <LineIcon size={18} />
                {settings.lineUrl ? (
                  <a href={settings.lineUrl} rel="noopener noreferrer" target="_blank">
                    LINE：{settings.lineId}
                  </a>
                ) : (
                  <span>LINE：{settings.lineId}</span>
                )}
              </li>
            ) : null}
            {settings.email ? (
              <li>
                <Icon name="mail" size={18} />
                <a href={`mailto:${settings.email}`}>{settings.email}</a>
              </li>
            ) : null}
            {settings.instagram ? (
              <li>
                <Icon name="instagram" size={18} />
                <a
                  href={`https://www.instagram.com/${settings.instagram}/`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  @{settings.instagram}
                </a>
              </li>
            ) : null}
            {settings.serviceArea ? (
              <li>
                <Icon name="pin" size={18} />
                <span>{settings.serviceArea}</span>
              </li>
            ) : null}
          </ul>
        </div>

        {settings.footerKeywords?.length ? (
          <div className="footer-col">
            <h2 className="footer-title">熱門關鍵字</h2>
            <ul className="tag-cloud">
              {settings.footerKeywords.map((k) => (
                <li key={k.id ?? k.label}>
                  <Link href={k.href}>{k.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <span>© {year} BigZhaung 大壯做網站. All rights reserved.</span>
          <Link href="/privacy">隱私權政策</Link>
        </div>
      </div>
    </footer>
  )
}

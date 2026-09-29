import Image from 'next/image'
import Link from 'next/link'

import { localePath, type Lang } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionaries'
import type { SiteSetting } from '@/payload-types'

import { Icon, LineIcon } from './Icon'

export function Footer({ settings, lang, t }: { settings: SiteSetting; lang: Lang; t: Dictionary }) {
  const year = new Date().getFullYear()
  const p = (path: string) => localePath(lang, path)
  const quickLinks = [
    { href: '/about', label: t.nav.about },
    { href: '/services', label: t.nav.services },
    { href: '/works', label: t.nav.works },
    { href: '/process', label: t.nav.process },
    { href: '/faq', label: t.nav.faq },
    { href: '/contact', label: t.nav.contact },
  ]
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-col footer-brand">
          <Link aria-label={t.nav.backHome} href={p('/')}>
            <Image alt="BigZhaung" height={885} src="/logo-navigation.png" width={2247} />
          </Link>
          <p className="footer-name">{t.brand}</p>
          {settings.footerBlurb ? <p>{settings.footerBlurb}</p> : null}
        </div>

        <div className="footer-col">
          <h2 className="footer-title">{t.footer.quickLinks}</h2>
          <ul className="footer-links">
            {quickLinks.map((l) => (
              <li key={l.href}>
                <Link href={p(l.href)}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-col">
          <h2 className="footer-title">{t.footer.contact}</h2>
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
                <a href={`https://www.instagram.com/${settings.instagram}/`} rel="noopener noreferrer" target="_blank">
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
            <h2 className="footer-title">{t.footer.keywords}</h2>
            <ul className="tag-cloud">
              {settings.footerKeywords.map((k) => (
                <li key={k.id ?? k.label}>
                  <Link href={p(k.href)}>{k.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <span>
            © {year} {t.brand}. {t.footer.rights}
          </span>
          <span className="footer-bottom-links">
            <Link href={p('/account')}>{t.footer.portal}</Link>
            <Link href={p('/privacy')}>{t.footer.privacy}</Link>
          </span>
        </div>
      </div>
    </footer>
  )
}

'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { localePath, stripLocale, type Lang } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionaries'

import { Icon } from './Icon'

type NavLink = { href: string; label: string }
type NavItem = NavLink & { children?: NavLink[] }

export function Header({ items, lang, t }: { items: NavItem[]; lang: Lang; t: Dictionary['nav'] }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  // Same page in the other language.
  const basePath = stripLocale(pathname)
  const current = localePath(lang, basePath)
  const isActive = (href: string) => current === href || current.startsWith(`${href}/`)

  const switcher = (
    <div aria-label={t.language} className="lang-switch" role="group">
      <Link aria-current={lang === 'zh' ? 'true' : undefined} href={localePath('zh', basePath)} hrefLang="zh-Hant-TW" lang="zh-Hant-TW">
        中文
      </Link>
      <span aria-hidden="true">｜</span>
      <Link aria-current={lang === 'en' ? 'true' : undefined} href={localePath('en', basePath)} hrefLang="en" lang="en">
        EN
      </Link>
    </div>
  )

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
      <div className="container header-inner">
        <Link aria-label={t.backHome} className="brand" href={localePath(lang, '/')}>
          <Image alt="BigZhaung" className="brand-full" height={885} priority src="/logo-navigation.png" width={2247} />
          <Image alt="" aria-hidden className="brand-mark" height={1278} src="/logo-mark.png" width={1287} />
        </Link>

        <nav aria-label={t.mainMenu} className={`nav${open ? ' is-open' : ''}`} id="site-nav">
          <ul className="nav-list">
            {items.map((item) => (
              <li className={item.children?.length ? 'has-sub' : undefined} key={item.href}>
                <Link aria-current={isActive(item.href) ? 'page' : undefined} className="nav-link" href={item.href}>
                  {item.label}
                  {item.children?.length ? <Icon className="nav-caret" name="chevron" size={14} /> : null}
                </Link>
                {item.children?.length ? (
                  <ul className="nav-sub">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link aria-current={current === child.href ? 'page' : undefined} href={child.href}>
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
          {switcher}
          <Link className="btn btn-accent nav-cta" href={localePath(lang, '/contact')}>
            {t.contact}
          </Link>
        </nav>

        <button
          aria-controls="site-nav"
          aria-expanded={open}
          aria-label={open ? t.menuClose : t.menuOpen}
          className="menu-toggle"
          onClick={() => setOpen((v) => !v)}
          type="button"
        >
          <Icon name={open ? 'close' : 'menu'} size={26} />
        </button>
      </div>
    </header>
  )
}

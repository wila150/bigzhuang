'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Icon } from './Icon'

type NavLink = { href: string; label: string }
type NavItem = NavLink & { children?: NavLink[] }

export function Header({ items }: { items: NavItem[] }) {
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

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
      <div className="container header-inner">
        <Link aria-label="BigZhaung 回首頁" className="brand" href="/">
          <Image
            alt="BigZhaung"
            className="brand-full"
            height={885}
            priority
            src="/logo-navigation.png"
            width={2247}
          />
          <Image alt="" aria-hidden className="brand-mark" height={1278} src="/logo-mark.png" width={1287} />
        </Link>

        <nav aria-label="主選單" className={`nav${open ? ' is-open' : ''}`} id="site-nav">
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
                        <Link aria-current={pathname === child.href ? 'page' : undefined} href={child.href}>
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
          <Link className="btn btn-accent nav-cta" href="/contact">
            聯絡我們
          </Link>
        </nav>

        <button
          aria-controls="site-nav"
          aria-expanded={open}
          aria-label={open ? '關閉選單' : '開啟選單'}
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

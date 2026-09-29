import { NextResponse, type NextRequest } from 'next/server'

// Chinese pages live at the root URLs and English under /en, but both are served by app/(frontend)/[lang].
// Unprefixed paths are rewritten to /zh internally; /zh/... is redirected so each page has one public URL.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === '/zh' || pathname.startsWith('/zh/')) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.slice(3) || '/'
    return NextResponse.redirect(url, 308)
  }
  // x-lang lets pages without route params (the 404 page) know the language.
  const headers = new Headers(request.headers)
  if (pathname === '/en' || pathname.startsWith('/en/')) {
    headers.set('x-lang', 'en')
    return NextResponse.next({ request: { headers } })
  }

  headers.set('x-lang', 'zh')
  const url = request.nextUrl.clone()
  url.pathname = `/zh${pathname === '/' ? '' : pathname}`
  return NextResponse.rewrite(url, { request: { headers } })
}

export const config = {
  // Everything except the admin, APIs, webhooks, preview/payment endpoints, Next internals and files with an extension.
  matcher: ['/((?!admin|api|_next|payments|line/webhook|preview|.*\\..*).*)'],
}

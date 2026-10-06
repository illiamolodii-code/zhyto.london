import { NextRequest, NextResponse } from 'next/server'

const LOCALE_RE = /^\/(uk|pl)(\/|$)/

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const match = pathname.match(LOCALE_RE)
  const locale = match ? match[1] : 'en'

  const res = NextResponse.next()
  res.headers.set('x-locale', locale)
  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/|images/|apple-icon|icon|sitemap.xml|robots.txt).*)'],
}
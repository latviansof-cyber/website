import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers)
  const lang = request.nextUrl.pathname.split('/')[1]
  if (lang !== 'en' && lang !== 'lv') {
    const redirectURL = request.nextUrl.clone()
    redirectURL.pathname = `/en${request.nextUrl.pathname === '/' ? '' : request.nextUrl.pathname}`
    return NextResponse.redirect(redirectURL, 308)
  }

  requestHeaders.set('x-site-lang', lang === 'lv' ? 'lv' : 'en')

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: [
    '/((?!api|admin|my-route|_next|images|favicon.ico|favicon.svg|favicon-96x96.png|apple-touch-icon.png|site.webmanifest|sitemap.xml|robots.txt).*)',
  ],
}

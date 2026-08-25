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

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  // Set Cache-Control headers for CDN & browser caching
  // max-age: browser cache (1 hour)
  // s-maxage: edge cache like Cloudflare (24 hours)
  // stale-while-revalidate: serve stale for 7 days while revalidating
  response.headers.set(
    'Cache-Control',
    'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800'
  )

  return response
}

export const config = {
  matcher: [
    '/((?!api|admin|my-route|_next|images|favicon.ico|favicon.svg|favicon-96x96.png|apple-touch-icon.png|site.webmanifest|sitemap.xml|robots.txt).*)',
  ],
}

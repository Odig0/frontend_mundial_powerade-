import { NextRequest, NextResponse } from 'next/server'

const AUTH_COOKIE_NAME = 'auth_token'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Protect /dashboard routes
  if (pathname.startsWith('/dashboard')) {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value

    if (!token) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}

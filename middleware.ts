import { NextRequest, NextResponse } from 'next/server'

const SESSION_COOKIE_NAME = 'powerade_session'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Protect /dashboard routes
  if (pathname.startsWith('/dashboard')) {
    const session = request.cookies.get(SESSION_COOKIE_NAME)?.value

    // Simple format check (HMAC verification happens in Node.js layer)
    if (!session || !isValidFormat(session)) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

function isValidFormat(token: string): boolean {
  const parts = token.split(':')
  return parts.length === 3 && parts[0] === 'powerade'
}

export const config = {
  matcher: ['/dashboard/:path*'],
}

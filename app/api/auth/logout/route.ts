import { NextRequest, NextResponse } from 'next/server'

const AUTH_COOKIE_NAME = 'auth_token'

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ ok: true })
  response.cookies.delete(AUTH_COOKIE_NAME)
  return response
}

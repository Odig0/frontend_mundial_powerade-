import { NextRequest, NextResponse } from 'next/server'

const SESSION_COOKIE_NAME = 'auth_token'
const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Usuario y contraseña requeridos' },
        { status: 400 }
      )
    }

    const backendUrl = process.env.NEXT_PUBLIC_API_URL
    if (!backendUrl) {
      return NextResponse.json(
        { error: 'Configuración del servidor incompleta' },
        { status: 500 }
      )
    }

    const backendResponse = await fetch(`${backendUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({ error: 'Error en la autenticación' }))
      return NextResponse.json(
        { error: errorData.error || 'Credenciales inválidas' },
        { status: backendResponse.status }
      )
    }

    const data = await backendResponse.json()

    const response = NextResponse.json({
      access_token: data.access_token,
      user: data.user,
    })

    // Save token in httpOnly cookie for middleware validation
    response.cookies.set(SESSION_COOKIE_NAME, data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_MAX_AGE,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Error de conexión con el servidor' },
      { status: 500 }
    )
  }
}

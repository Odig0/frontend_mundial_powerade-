import { NextResponse } from 'next/server'

const DEFAULT_API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/v1'

export async function GET(req: Request) {
  const base = DEFAULT_API.replace(/\/$/, '')
  const target = `${base}/api/standings`

  try {
    const res = await fetch(target, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    })

    const body = await res.text()

    return new NextResponse(body, {
      status: res.status,
      headers: {
        'Content-Type': res.headers.get('content-type') || 'application/json',
      },
    })
  } catch (error) {
    return NextResponse.json({ message: 'Proxy request failed', error: String(error) }, { status: 502 })
  }
}

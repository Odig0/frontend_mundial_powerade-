import { NextResponse } from 'next/server'

const DEFAULT_API_URL = 'https://dev.eldeber.bo/v1'
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_URL

export async function GET() {
  const baseUrl = API_URL.replace(/\/$/, '')
  const url = `${baseUrl}/news/latest/top10`

  try {
    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `Upstream error: ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('[API /news/latest/top10] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch latest news' },
      { status: 500 }
    )
  }
}

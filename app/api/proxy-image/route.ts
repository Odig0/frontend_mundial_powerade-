import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'Missing url param' }, { status: 400 })
  }

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'image/webp,image/jpeg,image/*,*/*',
        'Referer': 'https://manager.diez.bo/',
      },
      redirect: 'follow',
      cache: 'no-store',
    })


    if (!res.ok) {
      return NextResponse.json({ error: `Upstream ${res.status}: ${res.statusText}` }, { status: res.status })
    }

    const contentType = res.headers.get('content-type') ?? 'image/jpeg'

    if (!contentType.startsWith('image/')) {
      const text = await res.text()
      return NextResponse.json({ error: `Expected image, got ${contentType}` }, { status: 502 })
    }

    const buffer = await res.arrayBuffer()

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

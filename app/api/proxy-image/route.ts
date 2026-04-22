import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'Missing url param' }, { status: 400 })
  }

  try {
    console.log('[proxy-image] fetching:', url)

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'image/webp,image/jpeg,image/*,*/*',
        'Referer': 'https://manager.diez.bo/',
      },
      redirect: 'follow',
      cache: 'no-store',
    })

    console.log('[proxy-image] status:', res.status, 'content-type:', res.headers.get('content-type'), 'url:', res.url)

    if (!res.ok) {
      console.error('[proxy-image] upstream error:', res.status, res.statusText)
      return NextResponse.json({ error: `Upstream ${res.status}: ${res.statusText}` }, { status: res.status })
    }

    const contentType = res.headers.get('content-type') ?? 'image/jpeg'

    if (!contentType.startsWith('image/')) {
      const text = await res.text()
      console.error('[proxy-image] no es imagen, content-type:', contentType, 'body:', text.slice(0, 200))
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
    console.error('[proxy-image] fetch error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

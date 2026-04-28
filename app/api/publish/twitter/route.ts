import { NextRequest, NextResponse } from 'next/server'

const METRICOOL_API_KEY = process.env.NEXT_PUBLIC_METRICOOL
const METRICOOL_USER_ID = process.env.METRICOOL_USER_ID
const METRICOOL_BLOG_ID = process.env.METRICOOL_BLOG_ID
const METRICOOL_BASE = 'https://app.metricool.com/api'

export async function POST(request: NextRequest) {
  // Verify authentication
  const token = request.cookies.get('auth_token')?.value
  if (!token) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  if (!METRICOOL_API_KEY || !METRICOOL_USER_ID || !METRICOOL_BLOG_ID) {
    return NextResponse.json(
      { error: 'Configuración de Metricool incompleta' },
      { status: 500 }
    )
  }

  const body = await request.json()
  const { title, imageUrl, link } = body

  if (!title) {
    return NextResponse.json({ error: 'Título requerido' }, { status: 400 })
  }

  try {
    // Schedule the post (publish ASAP = 1 minute from now)
    const publishDate = new Date(Date.now() + 60_000) // 1 minute from now
    const dateTime = publishDate.toISOString().slice(0, 19) // "2026-04-27T14:00:00"

    const postBody: Record<string, unknown> = {
      text: `${title}${link ? `\n\n${link}` : ''}`,
      providers: [{ network: 'twitter' }],
      publicationDate: {
        dateTime,
        timezone: 'America/La_Paz',
      },
      twitterData: {
        type: 'post',
      },
    }

    if (imageUrl) {
      postBody.media = [imageUrl]
    }

    const publishRes = await fetch(
      `${METRICOOL_BASE}/v2/scheduler/posts?userId=${METRICOOL_USER_ID}&blogId=${METRICOOL_BLOG_ID}`,
      {
        method: 'POST',
        headers: {
          'X-Mc-Auth': METRICOOL_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postBody),
      }
    )

    const publishText = await publishRes.text()
    console.log('[Metricool Twitter] Publish response:', publishRes.status, publishText.slice(0, 300))
    let publishData: Record<string, unknown> = {}
    try {
      publishData = publishText ? JSON.parse(publishText) : {}
    } catch {
      publishData = { message: publishText }
    }

    if (!publishRes.ok) {
      console.error('[Metricool Twitter] Publish error:', publishData)
      return NextResponse.json(
        { error: publishData?.message || `Error Metricool: ${publishRes.status}` },
        { status: publishRes.status }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Publicado en Metricool para Twitter',
      postId: publishData.id,
    })
  } catch (error) {
    console.error('[Metricool Twitter] Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error interno' },
      { status: 500 }
    )
  }
}

const BASE_URL = (process.env.NEXT_PUBLIC_NEWS_BASE_URL || 'https://dev.eldeber.bo').replace(/\/$/, '')

export async function GET() {
  const body = `User-agent: *\nAllow: /\nSitemap: ${BASE_URL}/sitemap.xml\n`

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600',
    },
  })
}

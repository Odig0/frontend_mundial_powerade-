import { getNews, getAvailableSections } from '@/lib/api'

const BASE_URL = (process.env.NEXT_PUBLIC_NEWS_BASE_URL || 'https://dev.eldeber.bo').replace(/\/$/, '')

function toIsoDate(timestamp?: number) {
  if (!timestamp) return undefined
  const normalized = timestamp > 1_000_000_000_000 ? timestamp : timestamp * 1000
  return new Date(normalized).toISOString()
}

export async function GET() {
  try {
    const [news, sections] = await Promise.all([getNews(), getAvailableSections()])

    const urls: string[] = []

    // Static pages
    urls.push(`${BASE_URL}/`)
    urls.push(`${BASE_URL}/videos`)
    urls.push(`${BASE_URL}/selecciones`)

    // Section pages
    for (const s of sections) {
      urls.push(`${BASE_URL}/${encodeURIComponent(s)}`)
    }

    // News articles
    for (const item of news) {
      const section = item.secciones?.[0] ?? 'general'
      if (!item.link) continue
      const url = `${BASE_URL}/${encodeURIComponent(section)}/${encodeURIComponent(item.link)}`
      urls.push(url)
    }

    // Deduplicate
    const unique = Array.from(new Set(urls))

    const urlEntries = unique.map((u) => {
      // try to find lastmod from news
      const matched = news.find(n => u.endsWith(encodeURIComponent(n.link || '')))
      const lastmod = matched ? toIsoDate(matched.fecha_c || matched.fecha_a) : undefined
      return `  <url>\n    <loc>${u}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}\n  </url>`
    }).join('\n')

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>`

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=0, s-maxage=3600',
      },
    })
  } catch (error) {
    console.error('Failed to generate sitemap', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}

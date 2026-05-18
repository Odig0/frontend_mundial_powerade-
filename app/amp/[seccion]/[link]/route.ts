import { NextRequest } from 'next/server'
import { getNewsByLink } from '@/lib/api'

const BASE_URL = (process.env.NEXT_PUBLIC_NEWS_BASE_URL || 'https://dev.eldeber.bo').replace(/\/$/, '')

function toAbsoluteUrl(path: string) {
  if (!path) return path
  if (/^https?:\/\//i.test(path)) return path
  return `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

function toIsoDate(timestamp?: number) {
  if (!timestamp) return undefined
  const normalized = timestamp > 1_000_000_000_000 ? timestamp : timestamp * 1000
  return new Date(normalized).toISOString()
}

function escapeHtml(str?: string) {
  if (!str) return ''
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export async function GET(_req: NextRequest, { params }: { params: { seccion: string; link: string } | Promise<{ seccion: string; link: string }> }) {
  const { seccion, link } = await params
  const news = await getNewsByLink(seccion, link)

  if (!news) {
    return new Response('Not found', { status: 404 })
  }

  const canonical = `${BASE_URL}/${seccion}/${link}`
  const ampUrl = `${BASE_URL}/amp/${seccion}/${link}`
  const image = news.imagen_interior ? toAbsoluteUrl(news.imagen_interior) : `${BASE_URL}/logo_powerade.png`
  const published = toIsoDate(news.fecha_a || news.fecha_c)
  const modified = toIsoDate(news.fecha_c || news.fecha_a)

  const html = `<!doctype html>
<html amp lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
  <link rel="canonical" href="${canonical}">
  <meta name="referrer" content="origin">
  <title>${escapeHtml(news.titulo)}</title>
  <script async src="https://cdn.ampproject.org/v0.js"></script>
  <style amp-boilerplate>body{visibility:hidden}</style>
  <noscript><style amp-boilerplate>body{visibility:visible}</style></noscript>
  <style amp-custom>html,body{font-family:Inter,system-ui,Segoe UI,Roboto,Arial,sans-serif;color:#111;background:#000} .container{max-width:900px;margin:0 auto;padding:16px} h1{color:#fff;font-size:28px} .meta{color:#9aa3ad;font-size:14px;margin-bottom:8px} .intro{color:#ddd;font-weight:600;margin:16px 0} .content{color:#e6e6e6;line-height:1.6}</style>
  <script type="application/ld+json">${JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: news.titulo,
      description: news.introHTML ? news.introHTML.replace(/<[^>]*>/g, '').slice(0, 220) : news.titulo,
      image: image,
      datePublished: published,
      dateModified: modified,
      author: { '@type': 'Person', name: news.opinologo?.firma || 'Redacción' },
      publisher: { '@type': 'Organization', name: 'El Deber Deportes', logo: { '@type': 'ImageObject', url: `${BASE_URL}/logo_deber.jpg` } },
      mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
      url: canonical,
    })}</script>
</head>
<body>
  <main class="container">
    <h1>${escapeHtml(news.titulo)}</h1>
    <div class="meta">${news.opinologo?.firma || 'Redacción'} — ${escapeHtml(new Date(news.fecha_c || news.fecha_a || Date.now()).toLocaleString('es-ES'))}</div>
    <amp-img src="${image}" width="1200" height="630" layout="responsive" alt="${escapeHtml(news.titulo)}"></amp-img>
    ${news.introHTML ? `<div class="intro">${news.introHTML}</div>` : ''}
    <article class="content">${news.textoHTML || ''}</article>
    <p style="color:#6b7280;font-size:13px;margin-top:24px">Versión AMP — <a href="${canonical}">Ir al artículo</a></p>
  </main>
</body>
</html>`

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  })
}

import { cache } from 'react'

export interface Opinologo {
  _id: string
  firma: string
  foto?: string
}

export interface NewsItem {
  _id: string
  fecha_a: number
  fecha_c: number
  imagen_home: string
  imagen_interior: string
  introHTML: string
  opinologo: Opinologo
  prevId: string
  secciones: string[]
  textoHTML: string
  titulo: string
  link: string
}

export interface SyncResponse {
  fetched: number
  filteredFootball: number
  inserted: number
}

const DEFAULT_API_URL = 'https://dev.eldeber.bo/v1'
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_URL
const IMAGE_BASE_URL = 'https://cdn.diez.bo/diez/'

function getApiUrl() {
  if (!API_URL) {
    throw new Error('Missing NEXT_PUBLIC_API_URL. Set it to your backend base URL, for example http://localhost:3000/v1')
  }

  return API_URL.replace(/\/$/, '')
}

function buildUrl(path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${getApiUrl()}${normalizedPath}`
}

function buildImageUrl(path: string) {
  if (!path) {
    return path
  }

  if (/^https?:\/\//i.test(path)) {
    return path
  }

  return `${IMAGE_BASE_URL}${path.replace(/^\/+/, '')}`
}

function normalizeNewsItem(item: NewsItem): NewsItem {
  return {
    ...item,
    imagen_home: buildImageUrl(item.imagen_home),
    imagen_interior: buildImageUrl(item.imagen_interior),
    opinologo: item.opinologo
      ? {
        ...item.opinologo,
        foto: item.opinologo.foto
          ? `${IMAGE_BASE_URL}${item.opinologo._id}/${item.opinologo.foto}`
          : item.opinologo.foto,
      }
      : item.opinologo,
  }
}

async function requestJson<T>(path: string, init: RequestInit = {}): Promise<T> {
  const url = buildUrl(path)

  try {
    const response = await fetch(url, {
      ...init,
      headers: {
        Accept: 'application/json',
        ...(init.body ? { 'Content-Type': 'application/json' } : {}),
        ...(init.headers ?? {}),
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      if (response.status !== 404) {
        console.error(`[API] Request failed:`, { status: response.status, path })
      }
      throw new Error(`Request to ${path} failed with status ${response.status}`)
    }

    return response.json() as Promise<T>
  } catch (error) {
    if (error instanceof Error && error.message.includes('status 404')) {
      // 404 is expected in some lookups (we handle it upstream); avoid noisy logging
      throw error
    }

    console.error(`[API] Error fetching ${url}:`, error)
    throw error
  }
}

function uniqueSections(items: NewsItem[]) {
  return Array.from(new Set(items.flatMap((item) => item.secciones ?? []))).filter(Boolean)
}

function normalizeSectionValue(section: unknown): string | null {
  if (typeof section === 'string') {
    const trimmed = section.trim()
    return trimmed || null
  }

  if (typeof section === 'number' || typeof section === 'boolean') {
    return String(section)
  }

  if (!section || typeof section !== 'object') {
    return null
  }

  const candidate = section as Record<string, unknown>
  const rawValue =
    candidate.slug ??
    candidate.value ??
    candidate.section ??
    candidate.name ??
    candidate.label ??
    candidate.nombre ??
    candidate.titulo ??
    candidate.id ??
    candidate._id

  if (typeof rawValue === 'string') {
    const trimmed = rawValue.trim()
    return trimmed || null
  }

  if (typeof rawValue === 'number' || typeof rawValue === 'boolean') {
    return String(rawValue)
  }

  return null
}

function sortNewsByRecency(items: NewsItem[]) {
  return [...items].sort((left, right) => {
    if (right.fecha_c !== left.fecha_c) {
      return right.fecha_c - left.fecha_c
    }

    return (right.fecha_a ?? right.fecha_c) - (left.fecha_a ?? left.fecha_c)
  })
}

export const getNews = cache(async (): Promise<NewsItem[]> => {
  const CACHE_KEY = 'news_cache'
  const CACHE_DURATION = 1000 * 60 * 5 // 5 minutes

  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(CACHE_KEY)
    if (cached) {
      try {
        const { data, timestamp } = JSON.parse(cached)
        if (Date.now() - timestamp < CACHE_DURATION) {
          return data.map(normalizeNewsItem)
        }
      } catch {
        // Invalid cache, continue with fetch
      }
    }
  }

  try {
    const news = await requestJson<NewsItem[]>('/news/latest')
    const normalized = news.map(normalizeNewsItem)

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          data: news,
          timestamp: Date.now(),
        }))
      } catch {
        // localStorage error, continue without caching
      }
    }

    if (typeof window === 'undefined') {
      try {
        const { writeNewsCache } = await import('./cache')
        await writeNewsCache(news)
      } catch (error) {
        console.warn('[API] Unable to persist news cache to disk:', error)
      }
    }

    return normalized
  } catch (error) {
    console.warn('[API] Backend news fetch failed, trying local cache fallback:', error)

    if (typeof window === 'undefined') {
      try {
        const { readNewsCache } = await import('./cache')
        const cached = await readNewsCache()

        if (cached?.news?.length) {
          return cached.news.map(normalizeNewsItem)
        }
      } catch (cacheError) {
        console.warn('[API] Local cache fallback failed:', cacheError)
      }
    }

    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem(CACHE_KEY)
      if (cached) {
        try {
          const { data, timestamp } = JSON.parse(cached)
          if (Date.now() - timestamp < CACHE_DURATION) {
            return data.map(normalizeNewsItem)
          }
        } catch {
          // Invalid cache, continue to empty state
        }
      }
    }

    return []
  }
})

export async function getNewsById(id: string): Promise<NewsItem | undefined> {
  try {
    return normalizeNewsItem(await requestJson<NewsItem>(`/news/${encodeURIComponent(id)}`))
  } catch (error) {
    if (error instanceof Error && error.message.includes('status 404')) {
      return undefined
    }

    throw error
  }
}

/**
 * Busca una noticia directamente por su campo "link" (slug).
 * Requiere endpoint en el backend: GET /news/by-link/:link
 */
export async function getNewsByLinkSlug(link: string): Promise<NewsItem | undefined> {
  try {
    return normalizeNewsItem(
      await requestJson<NewsItem>(`/news/by-link/${encodeURIComponent(link)}`)
    )
  } catch (error) {
    if (error instanceof Error && error.message.includes('status 404')) {
      return undefined
    }
    // Si el endpoint no existe aún (404/500), retornar undefined silenciosamente
    return undefined
  }
}

export async function getMundialNews(): Promise<NewsItem[]> {
  const news = await requestJson<NewsItem[]>('/news/filter/mundial')
  return sortNewsByRecency(news.map(normalizeNewsItem))
}

export async function getNewsBySection(seccion: string): Promise<NewsItem[]> {
  if (seccion.toLowerCase() === 'mundial') {
    return getMundialNews()
  }

  const news = await getNews()
  return sortNewsByRecency(news.filter((item) => item.secciones?.includes(seccion)))
}

export async function getNewsByLink(seccion: string, link: string): Promise<NewsItem | undefined> {
  // 1. Endpoint directo por link (más rápido - ya implementado en el backend)
  const direct = await getNewsByLinkSlug(link)
  if (direct) {
    return direct
  }

  // 2. Fallbacks por si el endpoint directo falla o tiene delay
  if (seccion.toLowerCase() === 'mundial') {
    const mundialNews = await getMundialNews()
    const match = mundialNews.find((item) => item.link === link)
    if (!match) {
      return undefined
    }
    return (await getNewsById(match._id)) ?? match
  }

  // 3. Buscar en noticias recientes cacheadas
  const latestNews = await getNews()
  const matchInLatest = latestNews.find(
    (item) => item.secciones?.includes(seccion) && item.link === link
  )
  if (matchInLatest) {
    return (await getNewsById(matchInLatest._id)) ?? matchInLatest
  }

  // 3. Fallback: endpoint completo de la sección (artículos más antiguos)
  try {
    const sectionNews = await getNewsBySectionSlug(seccion)
    const match = sectionNews.find((item) => item.link === link)
    if (match) {
      return (await getNewsById(match._id)) ?? match
    }
  } catch {
    // Endpoint de sección no disponible
  }

  return undefined
}

export async function getAvailableSections(): Promise<string[]> {
  const news = await getNews()
  return uniqueSections(news).concat('mundial').filter((section, index, list) => list.indexOf(section) === index)
}

export async function syncNews(): Promise<SyncResponse> {
  return requestJson<SyncResponse>('/news/sync', {
    method: 'POST',
  })
}

export async function syncMundialNews(): Promise<SyncResponse> {
  return requestJson<SyncResponse>('/news/sync/mundial', {
    method: 'POST',
  })
}

export async function getAvailableSectionsAll(): Promise<string[]> {
  const sections = await requestJson<unknown[]>('/news/sections/all')
  return sections.map(normalizeSectionValue).filter((section): section is string => Boolean(section))
}

export function formatSectionLabel(section: string) {
  if (!section) {
    return ''
  }

  return section.charAt(0).toUpperCase() + section.slice(1)
}

export async function getNewsBySectionSlug(slug: string): Promise<NewsItem[]> {
  const news = await requestJson<NewsItem[]>(`/news/section/${encodeURIComponent(slug)}`)
  return sortNewsByRecency(news.map(normalizeNewsItem))
}

export async function updateNewsSections(id: string, sections: string[]): Promise<void> {
  await requestJson(`/news/${encodeURIComponent(id)}/sections`, {
    method: 'PUT',
    body: JSON.stringify({
      secciones: sections,
    }),
  })
}


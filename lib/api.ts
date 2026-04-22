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
          foto: item.opinologo.foto ? buildImageUrl(item.opinologo.foto) : item.opinologo.foto,
        }
      : item.opinologo,
  }
}

async function requestJson<T>(path: string, init: RequestInit = {}): Promise<T> {
  const url = buildUrl(path)
  console.log(`[API] Fetching: ${url}`)

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
      console.error(`[API] Request failed:`, { status: response.status, path })
      throw new Error(`Request to ${path} failed with status ${response.status}`)
    }

    return response.json() as Promise<T>
  } catch (error) {
    console.error(`[API] Error fetching ${url}:`, error)
    throw error
  }
}

function uniqueSections(items: NewsItem[]) {
  return Array.from(new Set(items.flatMap((item) => item.secciones ?? []))).filter(Boolean)
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
  const news = await requestJson<NewsItem[]>('/news')
  return sortNewsByRecency(news.map(normalizeNewsItem))
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
  if (seccion.toLowerCase() === 'mundial') {
    const mundialNews = await getMundialNews()
    const match = mundialNews.find((item) => item.link === link)
    if (!match) {
      return undefined
    }

    return (await getNewsById(match._id)) ?? match
  }

  const news = await getNews()
  const match = news.find((item) => item.secciones?.includes(seccion) && item.link === link)

  if (!match) {
    return undefined
  }

  return (await getNewsById(match._id)) ?? match
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

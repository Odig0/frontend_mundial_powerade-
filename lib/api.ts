import { NewsItem, mockNews, getFeaturedNews as mockFeatured, getTrendingNews as mockTrending, getNewsBySection as mockBySection, getNewsByLink as mockByLink } from './mockData'

const API_URL = process.env.NEXT_PUBLIC_API_URL || ''
const TOKEN = process.env.API_BEARER_TOKEN || ''

function mapImages(item: NewsItem): NewsItem {
  const randomSeed = item._id ? item._id.slice(-4) : 'rand'
  const fallbackImage = `https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=450&fit=crop&q=80&sig=${randomSeed}`

  // Si la imagen ya es de unsplash, la mantenemos, si no, usamos el fallback
  const isUnsplash = item.imagen_home?.includes('unsplash.com')

  return {
    ...item,
    imagen_home: isUnsplash ? item.imagen_home : fallbackImage,
    imagen_interior: isUnsplash ? item.imagen_interior : fallbackImage
  }
}

const getHeaders = () => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  }
  if (TOKEN) {
    headers['Authorization'] = `Bearer ${TOKEN}`
  }
  return headers
}

export async function getNewsBySection(seccion: string): Promise<NewsItem[]> {
  if (!API_URL) return mockBySection(seccion)

  try {
    const res = await fetch(`${API_URL}/news?seccion=${seccion}`, {
      headers: getHeaders(),
      next: { revalidate: 60 }
    })

    if (!res.ok) throw new Error('Error fetching section news')

    const data: NewsItem[] = await res.json()
    return data.map(mapImages)
  } catch (error) {
    console.error(error)
    return mockBySection(seccion)
  }
}

export async function getNewsByLink(seccion: string, link: string): Promise<NewsItem | undefined> {
  if (!API_URL) return mockByLink(seccion, link)

  try {
    const res = await fetch(`${API_URL}/news/${link}`, {
      headers: getHeaders(),
      next: { revalidate: 60 }
    })

    if (!res.ok) {
      if (res.status === 404) return undefined
      throw new Error('Error fetching news by link')
    }

    const data: NewsItem = await res.json()
    return mapImages(data)
  } catch (error) {
    console.error(error)
    return mockByLink(seccion, link)
  }
}

export async function getFeaturedNews(): Promise<NewsItem[]> {
  if (!API_URL) return mockFeatured()

  try {
    const res = await fetch(`${API_URL}/news/featured`, {
      headers: getHeaders(),
      next: { revalidate: 60 }
    })

    if (!res.ok) throw new Error('Error fetching featured news')

    const data: NewsItem[] = await res.json()
    return data.map(mapImages)
  } catch (error) {
    console.error(error)
    return mockFeatured()
  }
}

export async function getTrendingNews(): Promise<NewsItem[]> {
  if (!API_URL) return mockTrending()

  try {
    const res = await fetch(`${API_URL}/news/trending`, {
      headers: getHeaders(),
      next: { revalidate: 60 }
    })

    if (!res.ok) throw new Error('Error fetching trending news')

    const data: NewsItem[] = await res.json()
    return data.map(mapImages)
  } catch (error) {
    console.error(error)
    return mockTrending()
  }
}

export async function getAvailableSections(): Promise<string[]> {
  if (!API_URL) {
    const allSections = mockNews.flatMap(item => item.secciones || [])
    return Array.from(new Set(allSections)).filter(Boolean)
  }

  try {
    const [featured, trending] = await Promise.all([
      getFeaturedNews(),
      getTrendingNews()
    ])
    const items = [...featured, ...trending]
    const sections = items.flatMap(item => item.secciones || [])
    return Array.from(new Set(sections)).filter(Boolean)
  } catch (error) {
    console.error('Error fetching available sections:', error)
    const allSections = mockNews.flatMap(item => item.secciones || [])
    return Array.from(new Set(allSections)).filter(Boolean)
  }
}

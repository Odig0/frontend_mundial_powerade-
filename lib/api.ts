import { NewsItem, mockNews, getFeaturedNews as mockFeatured, getTrendingNews as mockTrending, getNewsBySection as mockBySection, getNewsByLink as mockByLink } from './mockData'

const API_URL = process.env.NEXT_PUBLIC_API_URL || ''
const TOKEN = process.env.API_BEARER_TOKEN || ''

export interface ApiNewsItem {
  _id: string
  fecha_a: number
  fecha_c: number
  imagen_home: string
  imagen_interior: string
  introHTML: string
  prevId: string
  secciones: string[]
  textoHTML: string
  titulo: string
  link: string
}

function mapApiToNewsItem(apiItem: ApiNewsItem): NewsItem {
  // Utilizamos una semilla basda en el ID para que Unsplash regrese una imagen levemente distinta,
  // manteniendo la imagen fija como se acordó por ahora.
  const randomSeed = apiItem._id ? apiItem._id.slice(-4) : 'rand'
  const fallbackImage = `https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=450&fit=crop&q=80&sig=${randomSeed}`

  return {
    title: apiItem.titulo || '',
    image: fallbackImage,
    category: apiItem.secciones?.[0] ? apiItem.secciones[0] : 'general',
    description: apiItem.introHTML || '',
    content: apiItem.textoHTML || '',
    link: apiItem.link || '',
    seccion: apiItem.secciones?.[0] ? apiItem.secciones[0] : 'general',
    date: apiItem.fecha_a ? new Date(apiItem.fecha_a).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }) : '',
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
  if (!API_URL) return mockBySection(seccion) // Fallback a mock data

  try {
    const res = await fetch(`${API_URL}/news?seccion=${seccion}`, {
      headers: getHeaders(),
      next: { revalidate: 60 }
    })
    
    if (!res.ok) throw new Error('Error fetching section news')
    
    const data: ApiNewsItem[] = await res.json()
    return data.map(mapApiToNewsItem)
  } catch (error) {
    console.error(error)
    return mockBySection(seccion) // Fallback en caso de error
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
    
    const data: ApiNewsItem = await res.json()
    return mapApiToNewsItem(data)
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
    
    const data: ApiNewsItem[] = await res.json()
    return data.map(mapApiToNewsItem)
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
    
    const data: ApiNewsItem[] = await res.json()
    return data.map(mapApiToNewsItem)
  } catch (error) {
    console.error(error)
    return mockTrending()
  }
}

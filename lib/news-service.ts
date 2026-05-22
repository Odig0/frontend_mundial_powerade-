/**
 * News service with automatic fallback to local cache
 * Implements resilient news fetching for server-side rendering
 */

import { NewsItem } from './api'
import { readNewsCache, writeNewsCache, isCacheFresh } from './cache'

const DEFAULT_API_URL = 'https://dev.eldeber.bo/v1'
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_URL
const IMAGE_BASE_URL = 'https://cdn.diez.bo/diez/'

/**
 * Build the API URL safely
 */
function getApiUrl(): string {
  if (!API_URL) {
    throw new Error('Missing NEXT_PUBLIC_API_URL')
  }
  return API_URL.replace(/\/$/, '')
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

/**
 * Fetch news from the backend API
 * Throws an error if the request fails
 */
async function fetchNewsFromBackend(): Promise<NewsItem[]> {
  const url = `${getApiUrl()}/news/latest`
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(
        `Backend returned ${response.status}: ${response.statusText}`
      )
    }

    const data = await response.json()
    
    if (!Array.isArray(data)) {
      throw new Error('Backend returned non-array data')
    }

    return data.map(normalizeNewsItem)
  } catch (error) {
    clearTimeout(timeoutId)
    if (error instanceof Error) {
      throw new Error(`Failed to fetch from backend: ${error.message}`)
    }
    throw error
  }
}

/**
 * Main service function: Get news with fallback to local cache
 * 
 * Strategy:
 * 1. Try to fetch from backend
 * 2. If backend succeeds, update the local cache for future fallback
 * 3. If backend fails, use the cached version
 * 4. If both fail, return empty array
 * 
 * @returns Array of news items (could be from backend or cache)
 */
export async function getNewsWithFallback(): Promise<NewsItem[]> {
  try {
    // Try to fetch from backend
    console.log('[News Service] Fetching from backend...')
    const backendNews = await fetchNewsFromBackend()
    
    // Successfully fetched, save to cache for fallback
    try {
      await writeNewsCache(backendNews)
      console.log('[News Service] Backend fetch successful, cache updated')
    } catch (cacheError) {
      // Cache write failed, but we still have the data - don't throw
      console.warn('[News Service] Cache update failed, continuing with backend data:', cacheError)
    }

    return backendNews
  } catch (backendError) {
    // Backend failed, try to use cached version
    console.warn('[News Service] Backend fetch failed, attempting cache fallback:', backendError)

    try {
      const cache = await readNewsCache()
      
      if (cache && cache.news.length > 0) {
        const cacheAge = Date.now() - cache.metadata.timestamp
        const cacheAgeHours = (cacheAge / 1000 / 60 / 60).toFixed(1)
        console.log(
          `[News Service] Using cached news (${cache.news.length} items, age: ${cacheAgeHours}h)`
        )
        return cache.news
      } else {
        console.warn('[News Service] No valid cache available')
      }
    } catch (cacheError) {
      console.error('[News Service] Error reading cache:', cacheError)
    }

    // Both backend and cache failed
    console.error('[News Service] All strategies exhausted, returning empty array')
    return []
  }
}

/**
 * Force a cache update from the backend
 * Useful for manual sync or scheduled tasks
 * 
 * This will be called by a cron job at 1 AM daily (to be implemented)
 */
export async function syncNewsToCache(): Promise<{ success: boolean; count: number; error?: string }> {
  try {
    console.log('[News Service] Starting manual sync...')
    const news = await fetchNewsFromBackend()
    await writeNewsCache(news)
    console.log(`[News Service] Manual sync complete: ${news.length} items`)
    return { success: true, count: news.length }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('[News Service] Manual sync failed:', errorMessage)
    return { success: false, count: 0, error: errorMessage }
  }
}

/**
 * Get cache status and age
 * Useful for monitoring and debugging
 */
export async function getCacheStatus(): Promise<{
  exists: boolean
  itemCount: number
  ageHours: number
  ageFormatted: string
  isFresh: boolean
}> {
  const cache = await readNewsCache()
  
  if (!cache) {
    return {
      exists: false,
      itemCount: 0,
      ageHours: 0,
      ageFormatted: 'N/A',
      isFresh: false,
    }
  }

  const ageMs = Date.now() - cache.metadata.timestamp
  const ageHours = ageMs / 1000 / 60 / 60
  
  return {
    exists: true,
    itemCount: cache.news.length,
    ageHours: Number(ageHours.toFixed(2)),
    ageFormatted: formatAge(ageMs),
    isFresh: isCacheFresh(cache),
  }
}

/**
 * Format cache age as human-readable string
 */
function formatAge(ageMs: number): string {
  const seconds = Math.floor(ageMs / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (minutes > 0) return `${minutes}m ago`
  return `${seconds}s ago`
}

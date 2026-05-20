/**
 * Server Actions for News
 * Use these in your client components to fetch data from the server
 * 
 * Example usage in a client component:
 * 
 * 'use client'
 * import { loadNewsWithFallback, loadCacheStatus } from '@/lib/actions'
 * 
 * export function MyNewsWidget() {
 *   const [news, setNews] = useState([])
 * 
 *   useEffect(() => {
 *     loadNewsWithFallback().then(setNews)
 *   }, [])
 * 
 *   return <div>{news.map(...)}</div>
 * }
 */

'use server'

import { getNewsWithFallback, getCacheStatus, syncNewsToCache } from './news-service'
import { NewsItem } from './api'

/**
 * Load news with automatic fallback to cache
 * Safe to call from client components via 'use server'
 */
export async function loadNewsWithFallback(): Promise<NewsItem[]> {
  try {
    return await getNewsWithFallback()
  } catch (error) {
    console.error('[Server Action] loadNewsWithFallback failed:', error)
    return []
  }
}

/**
 * Get the current cache status
 * Useful for showing cache age and status in the UI
 */
export async function getNewsStatus() {
  try {
    return await getCacheStatus()
  } catch (error) {
    console.error('[Server Action] getNewsStatus failed:', error)
    return {
      exists: false,
      itemCount: 0,
      ageHours: 0,
      ageFormatted: 'Unknown',
      isFresh: false,
    }
  }
}

/**
 * Trigger manual news sync from UI
 * Useful for admin panels or manual refresh buttons
 * 
 * Requires authentication in production!
 */
export async function triggerManualSync() {
  try {
    // TODO: Add authentication check here
    // if (!isAdmin) {
    //   throw new Error('Unauthorized')
    // }

    const result = await syncNewsToCache()
    return result
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return {
      success: false,
      count: 0,
      error: message,
    }
  }
}

/**
 * Get news filtered by section
 * Combination of fallback system + filtering
 */
export async function loadNewsBySection(sectionSlug: string): Promise<NewsItem[]> {
  try {
    const allNews = await getNewsWithFallback()
    
    return allNews.filter((item) =>
      item.secciones?.includes(sectionSlug) || 
      item.secciones?.some(s => s.toLowerCase() === sectionSlug.toLowerCase())
    )
  } catch (error) {
    console.error('[Server Action] loadNewsBySection failed:', error)
    return []
  }
}

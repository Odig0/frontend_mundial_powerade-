/**
 * Example usage of the news service with fallback
 * This component demonstrates how to use getNewsWithFallback()
 */

import { getNewsWithFallback, getCacheStatus } from '@/lib/news-service'
import { NewsItem } from '@/lib/api'

/**
 * Server Component Example
 * 
 * Usage in app/page.tsx or any server component:
 */
export async function NewsListWithFallback() {
  // Fetch news with automatic fallback to cache
  const news: NewsItem[] = await getNewsWithFallback()

  if (news.length === 0) {
    return (
      <div className="p-4 bg-yellow-100 border border-yellow-400 rounded">
        <p className="text-yellow-800">
          No news available. The backend might be down and no cache exists yet.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-500">
        Found {news.length} news items
      </div>
      {news.map((item) => (
        <article key={item._id} className="p-4 border rounded">
          <h3 className="font-bold text-lg">{item.titulo}</h3>
          <p className="text-sm text-gray-600 mt-2">
            {item.opinologo?.firma || 'Redacción'} • {new Date(item.fecha_a ?? item.fecha_c).toLocaleDateString()}
          </p>
          {item.introHTML && (
            <div
              className="mt-2 text-sm"
              dangerouslySetInnerHTML={{
                __html: item.introHTML.substring(0, 200) + '...',
              }}
            />
          )}
        </article>
      ))}
    </div>
  )
}

/**
 * Cache Status Component
 * 
 * Shows the current cache status and age
 */
export async function CacheStatusBadge() {
  const status = await getCacheStatus()

  if (!status.exists) {
    return (
      <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded">
        No cache
      </span>
    )
  }

  const bgColor = status.isFresh ? 'bg-green-100' : 'bg-orange-100'
  const textColor = status.isFresh ? 'text-green-800' : 'text-orange-800'

  return (
    <span className={`text-xs px-2 py-1 ${bgColor} ${textColor} rounded`}>
      {status.itemCount} items • {status.ageFormatted}
    </span>
  )
}

/**
 * Usage instructions for client components
 * 
 * If you need to fetch news in a client component, you have two options:
 * 
 * 1. Create a server action (recommended):
 * 
 *    // lib/actions.ts
 *    'use server'
 *    import { getNewsWithFallback } from '@/lib/news-service'
 *    
 *    export async function loadNews() {
 *      return await getNewsWithFallback()
 *    }
 * 
 * 2. Create an API route:
 * 
 *    // app/api/news/latest-with-fallback/route.ts
 *    import { getNewsWithFallback } from '@/lib/news-service'
 *    
 *    export async function GET() {
 *      const news = await getNewsWithFallback()
 *      return Response.json(news)
 *    }
 * 
 * Then call it from client component:
 *    const news = await loadNews()  // server action
 *    const news = await fetch('/api/news/latest-with-fallback').then(r => r.json())  // API
 */

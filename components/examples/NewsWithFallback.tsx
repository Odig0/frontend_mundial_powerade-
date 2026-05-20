/**
 * Complete example component using the news fallback system
 * Shows both server and client component patterns
 */

'use client'

import { useEffect, useState } from 'react'
import { loadNewsWithFallback, getNewsStatus, triggerManualSync } from '@/lib/actions'
import { NewsItem } from '@/lib/api'

/**
 * Server Component Version (Recommended for initial load)
 * 
 * Usage:
 * export async function HomePage() {
 *   return <NewsListServer />
 * }
 */
export async function NewsListServer() {
  const { getNewsWithFallback } = await import('@/lib/news-service')
  const news = await getNewsWithFallback()

  if (news.length === 0) {
    return (
      <div className="p-4 bg-yellow-100 border border-yellow-300 rounded">
        <p className="text-yellow-900">
          ⚠️ No news available. Backend may be down and no cache exists.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600 mb-4">
        📰 Loaded {news.length} news items
      </div>
      {news.map((item) => (
        <NewsItemCard key={item._id} item={item} />
      ))}
    </div>
  )
}

/**
 * Client Component Version
 * 
 * Usage:
 * 'use client'
 * export function NewsListClient() {
 *   return <NewsListClientComponent />
 * }
 */
export function NewsListClientComponent() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadNewsWithFallback()
      .then(setNews)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="p-4">Loading news...</div>
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-300 rounded">
        <p className="text-red-900">Error: {error}</p>
      </div>
    )
  }

  if (news.length === 0) {
    return (
      <div className="p-4 bg-yellow-100 border border-yellow-300 rounded">
        <p className="text-yellow-900">No news available</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600">
        📰 Loaded {news.length} news items
      </div>
      {news.map((item) => (
        <NewsItemCard key={item._id} item={item} />
      ))}
    </div>
  )
}

/**
 * Single News Item Card
 */
function NewsItemCard({ item }: { item: NewsItem }) {
  return (
    <article className="p-4 border rounded-lg hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        {/* Image */}
        {item.imagen_home && (
          <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded">
            <img
              src={item.imagen_home}
              alt={item.titulo}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.jpg'
              }}
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h3 className="font-bold text-lg text-gray-900 line-clamp-2">
                {item.titulo}
              </h3>

              {/* Section badge */}
              {item.secciones?.[0] && (
                <span className="inline-block mt-2 px-2 py-1 bg-blue-500 text-white text-xs font-semibold rounded">
                  {item.secciones[0]}
                </span>
              )}
            </div>
          </div>

          {/* Intro text */}
          {item.introHTML && (
            <div className="mt-2 text-sm text-gray-700 line-clamp-2">
              <div
                dangerouslySetInnerHTML={{
                  __html: item.introHTML,
                }}
              />
            </div>
          )}

          {/* Meta */}
          <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
            <div>
              By <span className="font-semibold">{item.opinologo?.firma || 'Redacción'}</span>
            </div>
            <time dateTime={new Date(item.fecha_a ?? item.fecha_c).toISOString()}>
              {new Date(item.fecha_a ?? item.fecha_c).toLocaleDateString('es-BO', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </time>
          </div>
        </div>
      </div>
    </article>
  )
}

/**
 * Cache Status Widget
 * Shows cache age and freshness
 */
export function CacheStatusWidget() {
  const [status, setStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getNewsStatus()
      .then(setStatus)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return null

  if (!status?.exists) {
    return (
      <div className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded">
        ❌ No cache
      </div>
    )
  }

  const isFresh = status.isFresh
  const bgColor = isFresh ? 'bg-green-100' : 'bg-orange-100'
  const textColor = isFresh ? 'text-green-800' : 'text-orange-800'

  return (
    <div className={`text-xs px-2 py-1 ${bgColor} ${textColor} rounded`}>
      💾 {status.itemCount} items • {status.ageFormatted}
    </div>
  )
}

/**
 * Manual Sync Button
 * Trigger cache update from UI
 */
export function ManualSyncButton() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleSync = async () => {
    setLoading(true)
    try {
      const result = await triggerManualSync()
      if (result.success) {
        setMessage(`✓ Synced ${result.count} news items`)
      } else {
        setMessage(`✗ Sync failed: ${result.error}`)
      }
      setTimeout(() => setMessage(null), 3000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleSync}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 transition"
      >
        {loading ? 'Syncing...' : 'Sync Now'}
      </button>
      {message && (
        <p className="text-sm text-gray-700">{message}</p>
      )}
    </div>
  )
}

/**
 * Dashboard Component
 * Complete example combining everything
 */
export function NewsDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">News Dashboard</h1>
        <CacheStatusWidget />
      </div>

      {/* Admin section */}
      <div className="p-4 bg-gray-100 rounded">
        <h2 className="font-semibold mb-3">Admin</h2>
        <ManualSyncButton />
      </div>

      {/* News list */}
      <div>
        <h2 className="font-semibold mb-4">Latest News</h2>
        <NewsListClientComponent />
      </div>
    </div>
  )
}

/**
 * Usage in pages:
 * 
 * pages/news.tsx (Server Component):
 * export default function NewsPage() {
 *   return <NewsListServer />
 * }
 * 
 * pages/dashboard.tsx (Client Component):
 * 'use client'
 * export default function DashboardPage() {
 *   return <NewsDashboard />
 * }
 */

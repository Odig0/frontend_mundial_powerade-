'use client'

import { useMemo } from 'react'
import type { NewsItem } from '@/lib/news-types'
import { usePublishedPosts } from '@/hooks/use-published-posts'
import { Empty } from '@/components/ui/empty'
import PublicadaCard from './PublicadaCard'

interface PublicacionesGridProps {
  news: NewsItem[]
}

export default function PublicacionesGrid({ news }: PublicacionesGridProps) {
  const { publishedIds, isLoaded } = usePublishedPosts()

  const publishedNews = useMemo(() => {
    if (!publishedIds) return []
    return news.filter((item) => publishedIds.has(item._id))
  }, [news, publishedIds])

  if (!isLoaded) {
    return (
      <div className="p-6">
        <div className="text-center text-muted-foreground">Cargando...</div>
      </div>
    )
  }

  if (publishedNews.length === 0) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[50vh]">
        <Empty
          title="Sin publicaciones"
          description="Aún no has marcado ninguna noticia como publicada. Ve a la sección de Noticias para empezar."
        />
      </div>
    )
  }

  return (
    <div className="db-pub-wrapper">
      <p className="db-results-count">
        {publishedNews.length} noticia{publishedNews.length !== 1 ? 's' : ''} publicada
        {publishedNews.length !== 1 ? 's' : ''}
      </p>

      <div className="db-pub-grid">
        {publishedNews.map((item) => (
          <PublicadaCard key={item._id} news={item} />
        ))}
      </div>
    </div>
  )
}

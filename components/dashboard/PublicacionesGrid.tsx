'use client'

import { useMemo } from 'react'
import { NewsItem } from '@/lib/api'
import { usePublishedPosts } from '@/hooks/use-published-posts'
import { Empty } from '@/components/ui/empty'
import NoticiaCard from './NoticiaCard'

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
    <div className="space-y-6 p-6">
      <div className="text-sm text-muted-foreground">
        {publishedNews.length} noticia{publishedNews.length !== 1 ? 's' : ''} publicada
        {publishedNews.length !== 1 ? 's' : ''}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {publishedNews.map((item) => (
          <NoticiaCard key={item._id} news={item} />
        ))}
      </div>
    </div>
  )
}

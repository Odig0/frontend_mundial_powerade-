'use client'

import { NewsItem } from '@/lib/api'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { usePublishedPosts } from '@/hooks/use-published-posts'
import SocialPostButton from '@/components/news/SocialPostButton'
import PublishToggle from './PublishToggle'
import Image from 'next/image'

interface NoticiaCardProps {
  news: NewsItem
}

export default function NoticiaCard({ news }: NoticiaCardProps) {
  const { isPublished, togglePublished, isLoaded } = usePublishedPosts()
  const publicada = isPublished(news._id)
  const seccion = news.secciones?.[0] ?? 'general'

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all hover:border-accent hover:shadow-lg">
      {/* Image Container */}
      <div className="relative w-full overflow-hidden bg-muted aspect-video">
        <Image
          src={news.imagen_home}
          alt={news.titulo}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Badge - Published */}
        {publicada && (
          <Badge className="absolute top-2 right-2 bg-green-500/90 text-white">
            Publicada
          </Badge>
        )}

        {/* Badge - Section */}
        <Badge variant="secondary" className="absolute top-2 left-2 capitalize">
          {seccion}
        </Badge>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-3 gap-3">
        {/* Title */}
        <div className="min-h-[2.5rem]">
          <h3 className="font-semibold text-sm leading-snug text-foreground line-clamp-2 group-hover:text-accent transition-colors">
            {news.titulo}
          </h3>
        </div>

        {/* Date */}
        {news.fecha_a && (
          <p className="text-xs text-muted-foreground">
            {new Date(news.fecha_a).toLocaleDateString('es-BO', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </p>
        )}

        {/* Actions */}
        <div className="mt-auto space-y-2 pt-2 border-t border-border/50">
          {/* Generate Image Button */}
          <SocialPostButton id={news._id} titulo={news.titulo} inline />

          {/* Publish Toggle */}
          {isLoaded ? (
            <PublishToggle
              isPublished={publicada}
              onToggle={() => togglePublished(news._id)}
            />
          ) : (
            <Skeleton className="h-9 w-full rounded-md" />
          )}
        </div>
      </div>
    </div>
  )
}

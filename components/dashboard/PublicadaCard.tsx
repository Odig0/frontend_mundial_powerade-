'use client'

import Image from 'next/image'
import type { NewsItem } from '@/lib/news-types'

interface PublicadaCardProps {
  news: NewsItem
}

export default function PublicadaCard({ news }: PublicadaCardProps) {
  const seccion = news.secciones?.[0] ?? 'general'

  return (
    <div className="db-pub-card">
      {/* Image */}
      <div className="db-pub-img-wrap">
        <Image
          src={news.imagen_home}
          alt={news.titulo}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 300px"
        />
        {/* Section badge */}
        <span className="db-badge-section capitalize">{seccion}</span>
        {/* Published badge */}
        <span className="db-badge-published">Publicada</span>
      </div>

      {/* Body */}
      <div className="db-pub-body">
        {news.fecha_a && (
          <p className="db-pub-date">
            {new Date(news.fecha_a).toLocaleDateString('es-BO', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </p>
        )}
        <h3 className="db-pub-title">{news.titulo}</h3>
      </div>
    </div>
  )
}

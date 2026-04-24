'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { NewsItem } from '@/lib/api'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import SocialPostButton from '@/components/news/SocialPostButton'
import Image from 'next/image'

interface GeneradorPanelProps {
  news: NewsItem[]
}

export default function GeneradorPanel({ news }: GeneradorPanelProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)

  const filtered = news.filter((item) =>
    item.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Search */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">Generador de Imágenes</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Busca la noticia que deseas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Selected News Preview */}
        {selectedNews && (
          <Card className="border-accent/50 bg-card/50 p-4 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <Badge className="mb-2">{selectedNews.secciones?.[0] ?? 'general'}</Badge>
                <h3 className="text-lg font-semibold text-foreground line-clamp-3">
                  {selectedNews.titulo}
                </h3>
                {selectedNews.fecha_a && (
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(selectedNews.fecha_a).toLocaleDateString('es-BO', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                )}
              </div>

              <div className="relative w-32 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                <Image
                  src={selectedNews.imagen_home}
                  alt={selectedNews.titulo}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Generate Button */}
            <div className="border-t border-border/50 pt-4">
              <p className="text-sm text-muted-foreground mb-3">
                Haz clic para abrir el generador de imágenes para redes sociales
              </p>
              <SocialPostButton id={selectedNews._id} titulo={selectedNews.titulo} inline />
            </div>
          </Card>
        )}

        {/* Search Results */}
        <div>
          <p className="text-sm text-muted-foreground mb-4">
            {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
          </p>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No se encontraron noticias
              </div>
            ) : (
              filtered.map((item) => (
                <button
                  key={item._id}
                  onClick={() => setSelectedNews(item)}
                  className={`w-full flex items-start gap-3 p-3 rounded-lg border transition-all text-left group ${
                    selectedNews?._id === item._id
                      ? 'border-accent bg-accent/10'
                      : 'border-border hover:border-accent/50 bg-card'
                  }`}
                >
                  <div className="relative w-16 h-12 flex-shrink-0 rounded overflow-hidden bg-muted">
                    <Image
                      src={item.imagen_home}
                      alt={item.titulo}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-accent">
                      {item.titulo}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.secciones?.[0] ?? 'general'}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

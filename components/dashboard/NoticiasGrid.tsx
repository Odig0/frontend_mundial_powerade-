'use client'

import { useState, useMemo, useEffect } from 'react'
import { Search } from 'lucide-react'
import type { NewsItem } from '@/lib/news-types'
import { getAvailableSectionsAll } from '@/lib/news-client'
import NoticiaCard from './NoticiaCard'

interface NoticiasGridProps {
  news: NewsItem[]
}

export default function NoticiasGrid({ news }: NoticiasGridProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sections, setSections] = useState<string[]>([])

  useEffect(() => {
    async function loadSections() {
      try {
        const availableSections = await getAvailableSectionsAll()
        setSections(availableSections)
      } catch (error) {
      }
    }
    loadSections()
  }, [])

  // Filter news
  const filteredNews = useMemo(() => {
    return news.filter((item) =>
      item.titulo.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [news, searchTerm])

  return (
    <div className="db-grid-wrapper">
      {/* Controls */}
      {/* Search Bar */}
      <div className="db-search-wrap">
        <Search className="db-search-icon" />
        <input
          placeholder="Buscar noticias..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="db-search-input"
        />
      </div>

      {/* Results Count */}
      <p className="db-results-count">
        {filteredNews.length} noticia{filteredNews.length !== 1 ? 's' : ''} encontrada
        {filteredNews.length !== 1 ? 's' : ''}
      </p>

      {/* List View */}
      {filteredNews.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          {filteredNews.map((item) => (
            <NoticiaCard key={item._id} news={item} availableSections={sections} />
          ))}
        </div>
      ) : (
        <div className="db-empty">
          <div className="db-empty-text">
            <p>No se encontraron noticias</p>
            <p className="db-empty-sub">Intenta con otros términos de búsqueda o cambia la sección</p>
          </div>
        </div>
      )}
    </div>
  )
}

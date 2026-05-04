'use client'

import { useState, useMemo, useEffect } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { NewsItem, formatSectionLabel, getAvailableSectionsAll } from '@/lib/api'
import NoticiaCard from './NoticiaCard'

interface NoticiasGridProps {
  news: NewsItem[]
}

export default function NoticiasGrid({ news }: NoticiasGridProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [sections, setSections] = useState<string[]>([])
  const [loadingSections, setLoadingSections] = useState(true)

  useEffect(() => {
    async function loadSections() {
      try {
        const availableSections = await getAvailableSectionsAll()
        setSections(availableSections)
      } catch (error) {
        console.error('Error loading sections:', error)
      } finally {
        setLoadingSections(false)
      }
    }
    loadSections()
  }, [])

  // Filter news
  const filteredNews = useMemo(() => {
    return news.filter((item) => {
      const matchesSearch = item.titulo.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesSection = !selectedSection || item.secciones?.includes(selectedSection)
      return matchesSearch && matchesSection
    })
  }, [news, searchTerm, selectedSection])

  return (
    <div className="space-y-6 p-6">
      {/* Controls */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar noticias..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Section Filter */}
        <div className="flex gap-3 items-center flex-wrap">
          <label className="text-sm text-muted-foreground font-semibold">Sección:</label>
          <select
            value={selectedSection || ''}
            onChange={(e) => setSelectedSection(e.target.value || null)}
            disabled={loadingSections}
            className="bg-[#162032] border border-[#1e3048] text-white text-sm px-3 py-2 rounded outline-none focus:border-accent transition-colors disabled:opacity-50 cursor-pointer"
          >
            <option value="">Todas las secciones</option>
            {sections.map((section) => (
              <option key={section} value={section}>
                {formatSectionLabel(section)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        {filteredNews.length} noticia{filteredNews.length !== 1 ? 's' : ''} encontrada
        {filteredNews.length !== 1 ? 's' : ''}
      </div>

      {/* List View */}
      {filteredNews.length > 0 ? (
        <div className="flex flex-col gap-4 w-full max-w-5xl mx-auto">
          {filteredNews.map((item) => (
            <NoticiaCard key={item._id} news={item} availableSections={sections} />
          ))}
        </div>
      ) : (
        <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border bg-card/50">
          <div className="text-center">
            <p className="text-muted-foreground">No se encontraron noticias</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Intenta con otros términos de búsqueda o cambia la sección</p>
          </div>
        </div>
      )}
    </div>
  )
}

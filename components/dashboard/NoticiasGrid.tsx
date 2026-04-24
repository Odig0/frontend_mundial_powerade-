'use client'

import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { NewsItem } from '@/lib/api'
import NoticiaCard from './NoticiaCard'

interface NoticiasGridProps {
  news: NewsItem[]
}

export default function NoticiasGrid({ news }: NoticiasGridProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSection, setSelectedSection] = useState<string>('all')

  // Get unique sections
  const sections = useMemo(() => {
    const sectionSet = new Set<string>()
    news.forEach((item) => {
      item.secciones?.forEach((s) => sectionSet.add(s))
    })
    return Array.from(sectionSet).sort()
  }, [news])

  // Filter news
  const filteredNews = useMemo(() => {
    return news.filter((item) => {
      const matchesSearch = item.titulo.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesSection =
        selectedSection === 'all' || item.secciones?.includes(selectedSection)
      return matchesSearch && matchesSection
    })
  }, [news, searchTerm, selectedSection])

  return (
    <div className="space-y-6 p-6">
      {/* Search and Filter Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar noticias..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={selectedSection} onValueChange={setSelectedSection}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Todas las secciones" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las secciones</SelectItem>
            {sections.map((section) => (
              <SelectItem key={section} value={section}>
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        {filteredNews.length} noticia{filteredNews.length !== 1 ? 's' : ''} encontrada
        {filteredNews.length !== 1 ? 's' : ''}
      </div>

      {/* Grid */}
      {filteredNews.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredNews.map((item) => (
            <NoticiaCard key={item._id} news={item} />
          ))}
        </div>
      ) : (
        <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border bg-card/50">
          <div className="text-center">
            <p className="text-muted-foreground">No se encontraron noticias</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Intenta con otros términos de búsqueda</p>
          </div>
        </div>
      )}
    </div>
  )
}

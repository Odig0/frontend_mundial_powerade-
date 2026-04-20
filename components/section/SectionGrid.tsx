'use client'

import { useState } from 'react'
import NewsCard from '@/components/news/NewsCard'
import { NewsItem } from '@/lib/mockData'

interface SectionGridProps {
  news: NewsItem[]
  itemsPerPage?: number
}

export default function SectionGrid({ news, itemsPerPage = 12 }: SectionGridProps) {
  const [displayed, setDisplayed] = useState(itemsPerPage)

  const handleLoadMore = () => {
    setDisplayed((prev) => prev + itemsPerPage)
  }

  const visibleNews = news.slice(0, displayed)
  const hasMore = displayed < news.length

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {visibleNews.map((item, idx) => (
          <NewsCard
            key={idx}
            titulo={item.titulo}
            imagen_home={item.imagen_home}
            secciones={item.secciones}
            introHTML={item.introHTML}
            link={item.link}
          />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center">
          <button
            onClick={handleLoadMore}
            className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded hover:bg-accent transition-colors"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  )
}

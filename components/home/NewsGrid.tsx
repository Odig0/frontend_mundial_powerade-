'use client'

import NewsCard from '@/components/news/NewsCard'
import { NewsItem } from '@/lib/mockData'

interface NewsGridProps {
  news: NewsItem[]
  title?: string
}

export default function NewsGrid({ news, title }: NewsGridProps) {
  return (
    <section className="mb-12 max-w-6xl mx-auto">
      {title && (
        <h2 className="text-2xl md:text-3xl font-black text-foreground mb-6">{title}</h2>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {news.map((item, idx) => (
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
    </section>
  )
}

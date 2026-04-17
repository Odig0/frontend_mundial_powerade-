'use client'

import NewsCard from '@/components/news/NewsCard'

interface NewsItem {
  title: string
  image: string
  category: string
  description?: string
  link: string
  seccion: string
}

interface NewsGridProps {
  news: NewsItem[]
  title?: string
}

export default function NewsGrid({ news, title }: NewsGridProps) {
  return (
    <section className="mb-12">
      {title && (
        <h2 className="text-2xl md:text-3xl font-black text-foreground mb-6">{title}</h2>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {news.map((item, idx) => (
          <NewsCard
            key={idx}
            title={item.title}
            image={item.image}
            category={item.category}
            description={item.description}
            link={item.link}
            seccion={item.seccion}
          />
        ))}
      </div>
    </section>
  )
}

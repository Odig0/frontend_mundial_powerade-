'use client'

import Link from 'next/link'
import Image from 'next/image'
import { NewsItem } from '@/lib/api'

interface HeroBlockProps {
  featured: NewsItem
  side: NewsItem[]
}

export default function HeroBlock({ featured, side }: HeroBlockProps) {
  const featuredSeccion = featured.secciones && featured.secciones.length > 0 ? featured.secciones[0] : 'general'
  const featuredHref = featuredSeccion && featured.link ? `/${featuredSeccion}/${featured.link}` : null
  const featuredImage = featured.imagen_home && featured.imagen_home.trim()
  const sideWithImages = side.filter((news) => news.imagen_home && news.imagen_home.trim())

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      {/* Featured news - left */}
      {featuredHref ? (
        <Link href={featuredHref} className="md:col-span-2">
          <div className="group cursor-pointer h-full flex flex-col">
            <div className="relative w-full aspect-video md:aspect-video overflow-hidden rounded-lg mb-4 bg-muted">
              {featuredImage ? (
                <Image
                  src={featured.imagen_home}
                  alt={featured.titulo}
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : null}
            </div>
            <div className="flex-1">
              <div className="inline-block px-3 py-1.5 bg-accent text-accent-foreground text-xs font-bold rounded mb-3 capitalize">
                {featuredSeccion}
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-foreground group-hover:text-accent transition-colors line-clamp-3 leading-tight">
                {featured.titulo}
              </h2>
              {featured.introHTML && (
                <div
                  className="text-muted-foreground mt-2 line-clamp-2 text-sm md:text-base [&>p]:inline"
                  dangerouslySetInnerHTML={{ __html: featured.introHTML }}
                />
              )}
            </div>
          </div>
        </Link>
      ) : (
        <div className="md:col-span-2">
          <div className="group cursor-pointer h-full flex flex-col">
            <div className="relative w-full aspect-video md:aspect-video overflow-hidden rounded-lg mb-4 bg-muted">
              {featuredImage ? (
                <Image
                  src={featured.imagen_home}
                  alt={featured.titulo}
                  fill
                  priority
                  className="object-cover"
                />
              ) : null}
            </div>
            <div className="flex-1">
              <div className="inline-block px-3 py-1.5 bg-accent text-accent-foreground text-xs font-bold rounded mb-3 capitalize">
                {featuredSeccion}
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-foreground line-clamp-3 leading-tight">
                {featured.titulo}
              </h2>
              {featured.introHTML && (
                <div
                  className="text-muted-foreground mt-2 line-clamp-2 text-sm md:text-base [&>p]:inline"
                  dangerouslySetInnerHTML={{ __html: featured.introHTML }}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Side news - right */}
      <div className="flex flex-col gap-6">
          {sideWithImages.map((news) => {
          const sideSeccion = news.secciones && news.secciones.length > 0 ? news.secciones[0] : 'general'
          const href = sideSeccion && news.link ? `/${sideSeccion}/${news.link}` : null
          return (
            href ? (
              <Link key={news._id} href={href}>
                <div className="group cursor-pointer h-full">
                  <div className="relative w-full aspect-video md:aspect-[16/10] overflow-hidden rounded-lg mb-3 bg-muted">
                      <Image
                        src={news.imagen_home}
                        alt={news.titulo}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                  </div>
                  <h3 className="font-bold text-foreground group-hover:text-accent transition-colors line-clamp-2 text-sm md:text-base">
                    {news.titulo}
                  </h3>
                  {news.introHTML && (
                    <div
                      className="text-muted-foreground mt-2 line-clamp-2 text-xs [&>p]:inline"
                      dangerouslySetInnerHTML={{ __html: news.introHTML }}
                    />
                  )}
                </div>
              </Link>
            ) : (
              <div key={news._id} className="group cursor-not-allowed h-full opacity-90">
                <div className="relative w-full aspect-video md:aspect-[16/10] overflow-hidden rounded-lg mb-3 bg-muted">
                  <Image
                    src={news.imagen_home}
                    alt={news.titulo}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="font-bold text-foreground line-clamp-2 text-sm md:text-base">
                  {news.titulo}
                </h3>
              </div>
            )
          )
        })}
      </div>
    </div>
  )
}

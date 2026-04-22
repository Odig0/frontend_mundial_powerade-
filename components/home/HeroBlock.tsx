'use client'

import Link from 'next/link'
import Image from 'next/image'
import { NewsItem } from '@/lib/api'
import SocialPostButton from '@/components/news/SocialPostButton'

interface HeroBlockProps {
  featured: NewsItem
  side: NewsItem[]
}

export default function HeroBlock({ featured, side }: HeroBlockProps) {
  const featuredSeccion = featured.secciones?.[0] ?? 'general'
  const featuredHref = featuredSeccion && featured.link ? `/${featuredSeccion}/${featured.link}` : null
  const sideWithImages = side.filter((n) => n.imagen_home?.trim())

  const FeaturedContent = (
    <div className="group h-full flex flex-col cursor-pointer">
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-muted">
        {featured.imagen_home?.trim() && (
          <Image
            src={featured.imagen_home}
            alt={featured.titulo}
            fill
            priority
            loading="eager"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}
        <SocialPostButton id={featured._id} titulo={featured.titulo} />
      </div>
      <div className="pt-4 pb-2 flex-1">
        <div className="inline-block px-2 py-0.5 bg-accent text-accent-foreground text-[11px] font-bold rounded mb-2 capitalize">
          {featuredSeccion}
        </div>
        <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-white group-hover:text-accent transition-colors line-clamp-3 leading-tight">
          {featured.titulo}
        </h2>
        {featured.introHTML && (
          <div
            className="text-muted-foreground mt-2 line-clamp-2 text-sm [&>p]:inline"
            dangerouslySetInnerHTML={{ __html: featured.introHTML }}
          />
        )}
      </div>
    </div>
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border mb-px">
      {/* Featured - left 2/3 */}
      <div className="md:col-span-2 bg-background p-0">
        {featuredHref ? (
          <Link href={featuredHref} className="block p-4 h-full">{FeaturedContent}</Link>
        ) : (
          <div className="p-4 h-full">{FeaturedContent}</div>
        )}
      </div>

      {/* Side news - right 1/3 */}
      <div className="flex flex-col gap-px bg-border">
        {sideWithImages.slice(0, 2).map((news) => {
          const seccion = news.secciones?.[0] ?? 'general'
          const href = seccion && news.link ? `/${seccion}/${news.link}` : null
          const CardContent = (
            <div className="group cursor-pointer h-full flex flex-col bg-background p-3">
              <div className="relative w-full aspect-video overflow-hidden bg-muted mb-3">
                <Image
                  src={news.imagen_home}
                  alt={news.titulo}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <SocialPostButton id={news._id} titulo={news.titulo} />
              </div>
              <h3 className="font-bold text-white group-hover:text-accent transition-colors line-clamp-3 text-sm md:text-base leading-snug">
                {news.titulo}
              </h3>
            </div>
          )
          return href ? (
            <Link key={news._id} href={href} className="flex-1 block">{CardContent}</Link>
          ) : (
            <div key={news._id} className="flex-1">{CardContent}</div>
          )
        })}
      </div>
    </div>
  )
}

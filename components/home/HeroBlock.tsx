'use client'

import Link from 'next/link'
import Image from 'next/image'

interface HeroNews {
  title: string
  image: string
  category: string
  description: string
  link: string
  seccion: string
}

interface HeroBlockProps {
  featured: HeroNews
  side: HeroNews[]
}

export default function HeroBlock({ featured, side }: HeroBlockProps) {
  const featuredHref = `/${featured.seccion}/${featured.link}`

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      {/* Featured news - left */}
      <Link href={featuredHref} className="md:col-span-2">
        <div className="group cursor-pointer h-full flex flex-col">
          <div className="relative w-full aspect-video md:aspect-video overflow-hidden rounded-lg mb-4 bg-muted">
            <Image
              src={featured.image}
              alt={featured.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="flex-1">
            <div className="inline-block px-3 py-1.5 bg-accent text-accent-foreground text-xs font-bold rounded mb-3">
              {featured.category}
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-foreground group-hover:text-accent transition-colors line-clamp-3 leading-tight">
              {featured.title}
            </h2>
            <p className="text-muted-foreground mt-2 line-clamp-2 text-sm md:text-base">
              {featured.description}
            </p>
          </div>
        </div>
      </Link>

      {/* Side news - right */}
      <div className="flex flex-col gap-6">
        {side.map((news, idx) => {
          const href = `/${news.seccion}/${news.link}`
          return (
            <Link key={idx} href={href}>
              <div className="group cursor-pointer h-full">
                <div className="relative w-full aspect-video md:aspect-[16/10] overflow-hidden rounded-lg mb-3 bg-muted">
                  <Image
                    src={news.image}
                    alt={news.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-bold text-foreground group-hover:text-accent transition-colors line-clamp-2 text-sm md:text-base">
                  {news.title}
                </h3>
                {news.description && (
                  <p className="text-muted-foreground mt-2 line-clamp-2 text-xs">
                    {news.description}
                  </p>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

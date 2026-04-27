'use client'

import Link from 'next/link'
import Image from 'next/image'
import { NewsItem } from '@/lib/api'
import SocialPostButton from '@/components/news/SocialPostButton'
import { cn } from '@/lib/utils'

interface HeroBlockProps {
  featured: NewsItem
  side: NewsItem[]
}

export default function HeroBlock({ featured, side }: HeroBlockProps) {
  const featuredSeccion = featured.secciones?.[0] ?? 'general'
  const featuredHref = featuredSeccion && featured.link ? `/${featuredSeccion}/${featured.link}` : null
  const sideWithImages = side.filter((n) => n.imagen_home?.trim())

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden">
      
      {/* NOTICIA PRINCIPAL - ESTILO PORTADA */}
      <div className="md:col-span-2 relative group overflow-hidden bg-black aspect-[4/3] md:aspect-auto md:min-h-[550px]">
        {featuredHref && (
          <Link href={featuredHref} className="absolute inset-0 z-20" aria-label={featured.titulo} />
        )}
        
        {featured.imagen_home?.trim() && (
          <Image
            src={featured.imagen_home}
            alt={featured.titulo}
            fill
            priority
            loading="eager"
            className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
          />
        )}

        {/* Overlay Gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10 opacity-90 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Contenido (Abajo a la Izquierda) */}
        <div className="absolute bottom-0 left-0 w-full p-4 sm:p-6 md:p-10 z-30 pointer-events-none">
          <div className="flex flex-col items-start max-w-2xl">
            <span className="bg-[#3CB7FF] text-white text-[10px] md:text-xs font-black uppercase tracking-widest px-2 py-1 mb-2 md:mb-3 rounded-sm shadow-xl">
              {featuredSeccion}
            </span>
            
            <h2 className="text-xl sm:text-2xl md:text-4xl font-black text-white leading-[1.1] mb-2 md:mb-4 group-hover:text-[#3CB7FF] transition-colors line-clamp-3 md:line-clamp-none">
              {featured.titulo}
            </h2>

            {featured.introHTML && (
              <div
                className="text-white/80 mb-4 md:mb-6 text-xs sm:text-sm md:text-base max-w-2xl leading-snug md:leading-normal line-clamp-4 md:line-clamp-none"
                dangerouslySetInnerHTML={{ __html: featured.introHTML }}
              />
            )}

            {featured.opinologo && (
              <div className="flex items-center gap-3">
                <span
                  className="w-9 h-9 rounded-full bg-[#3CB7FF] text-white text-xs font-bold flex items-center justify-center border-2 border-white/30 shadow-lg"
                  style={{ display: featured.opinologo.foto ? 'none' : 'flex' }}
                >
                  {featured.opinologo.firma.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()}
                </span>
                <span className="text-white/90 text-base">
                  <span className="font-normal tracking-wide mr-1">Por</span>
                  <span className="font-bold">{featured.opinologo.firma}</span>
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="absolute top-4 right-4 z-40">
          <SocialPostButton id={featured._id} titulo={featured.titulo} />
        </div>
      </div>

      {/* NOTICIAS LATERALES - ESTILO VERTICAL CLÁSICO */}
      <div className="flex flex-col gap-6">
        {sideWithImages.slice(0, 2).map((news) => {
          const seccion = news.secciones?.[0] ?? 'general'
          const href = seccion && news.link ? `/${seccion}/${news.link}` : null
          
          return (
            <div key={news._id} className="group relative flex-1 bg-background overflow-hidden flex flex-col border-b border-border/10 last:border-0 pb-6">
              {href && (
                <Link href={href} className="absolute inset-0 z-20" aria-label={news.titulo} />
              )}
              
              <div className="relative w-full aspect-video overflow-hidden bg-muted mb-4">
                <Image
                  src={news.imagen_home}
                  alt={news.titulo}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 right-2 z-30">
                  <SocialPostButton id={news._id} titulo={news.titulo} />
                </div>
              </div>
              
              <div className="flex-1 flex flex-col px-0">
                <span className="bg-[#3CB7FF] text-white text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 mb-2 rounded-sm self-start">
                  {seccion}
                </span>
                
                <h3 className="font-bold text-white group-hover:text-[#3CB7FF] transition-colors text-base md:text-xl leading-tight">
                  {news.titulo}
                </h3>

                <div className="mt-3">
                  <span className="text-[#3CB7FF] text-sm tracking-wide truncate block">
                    <span className="font-normal">Por</span> <span className="font-bold">{news.opinologo?.firma || 'Redacción'}</span>
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

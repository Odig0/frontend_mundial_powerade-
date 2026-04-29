'use client'

import Image from 'next/image'
import SocialPostButton from '@/components/news/SocialPostButton'

interface NewsDetailProps {
  id: string
  titulo: string
  fecha: string
  imagen_interior: string
  secciones: string[]
  introHTML: string
  textoHTML: string
  opinologo_firma?: string
}

export default function NewsDetail({
  id,
  titulo,
  fecha,
  imagen_interior,
  secciones,
  introHTML,
  textoHTML,
  opinologo_firma,
}: NewsDetailProps) {
  const seccion = secciones?.[0] ?? 'general'
  const hasImage = Boolean(imagen_interior?.trim())

  return (
    <article className="max-w-3xl mx-auto">
      <div className="mb-6">
        <div className="inline-block px-3 py-1.5 bg-accent text-accent-foreground text-xs font-bold rounded mb-4 uppercase tracking-wider">
          {seccion}
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-foreground mb-4">{titulo}</h1>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {fecha && <p className="text-muted-foreground text-sm">{fecha}</p>}
          <SocialPostButton id={id} titulo={titulo} inline />
        </div>

        <div className="mt-4 py-1">
          <span className="text-[#3CB7FF] text-xs tracking-wide">
            <span className="font-normal">Por</span> <span className="font-bold">{opinologo_firma || 'Redacción'}</span>
          </span>
        </div>
      </div>

      {hasImage && (
        <div className="relative w-full aspect-video md:aspect-[16/9] overflow-hidden rounded-lg mb-8 bg-muted">
          <Image
            src={imagen_interior}
            alt={titulo}
            fill
            priority
            className="object-cover"
          />
        </div>
      )}

      {introHTML && (
        <div
          className="text-lg md:text-xl text-foreground mb-6 leading-relaxed font-semibold [&>p]:mb-0"
          dangerouslySetInnerHTML={{ __html: introHTML }}
        />
      )}

      <div className="prose prose-invert max-w-none">
        <div
          className="text-foreground leading-relaxed space-y-4"
          dangerouslySetInnerHTML={{ __html: textoHTML }}
        />
      </div>
    </article>
  )
}


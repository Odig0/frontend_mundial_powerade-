'use client'

import Link from 'next/link'
import Image from 'next/image'
import SocialPostButton from './SocialPostButton'

interface NewsCardProps {
  id: string
  titulo: string
  imagen_home: string
  secciones: string[]
  introHTML?: string
  link: string
  variant?: 'default' | 'small'
  opinologo_firma?: string
}

export default function NewsCard({
  id,
  titulo,
  imagen_home,
  secciones,
  introHTML,
  link,
  variant = 'default',
  opinologo_firma,
}: NewsCardProps) {
  const seccion = secciones?.[0] ?? 'general'
  const href = seccion && link ? `/${seccion}/${link}` : null
  const hasImage = Boolean(imagen_home?.trim())

  if (!hasImage || !href) return null

  if (variant === 'small') {
    return (
      <Link href={href}>
        <div className="group cursor-pointer h-full">
          <div className="relative w-full aspect-video overflow-hidden bg-muted mb-3">
            <Image
              src={imagen_home}
              alt={titulo}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <SocialPostButton id={id} titulo={titulo} />
          </div>
          <h3 className="font-bold text-white group-hover:text-accent transition-colors line-clamp-2 text-sm">
            {titulo}
          </h3>
        </div>
      </Link>
    )
  }

  return (
    <Link
      href={href}
      className="group block transition-all duration-300"
    >
      <div className="flex flex-col h-full">
        <div className="relative aspect-video overflow-hidden bg-muted mb-4">
          <Image
            src={imagen_home}
            alt={titulo}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <SocialPostButton id={id} titulo={titulo} />
        </div>
        <div className="flex flex-col">
          <div className="inline-block px-2 py-0.5 bg-accent text-accent-foreground text-[10px] font-bold rounded mb-3 uppercase tracking-widest self-start">
            {seccion}
          </div>
          <h3 className="font-bold text-white group-hover:text-accent transition-colors text-lg md:text-xl leading-snug">
            {titulo}
          </h3>
          {introHTML && (
            <div
              className="text-white/60 mt-3 line-clamp-4 text-sm leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: (() => {
                  const plainText = introHTML.replace(/<[^>]*>?/gm, '');
                  const words = plainText.split(/\s+/).filter(Boolean);
                  if (words.length <= 20) return plainText;
                  return words.slice(0, 20).join(' ') + '...';
                })()
              }}
            />
          )}
          <div className="mt-5">
            <span className="text-[#3CB7FF] text-sm tracking-wide truncate block">
              <span className="font-normal">Por</span> <span className="font-bold">{opinologo_firma || 'Redacción'}</span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

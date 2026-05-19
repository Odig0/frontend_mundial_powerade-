'use client'

import Link from 'next/link'
import Image from 'next/image'

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
          </div>
          <h3
            className="font-bold group-hover:opacity-100 transition-colors line-clamp-2 text-sm"
            style={{ color: 'var(--news-text-color)' }}
          >
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
        </div>
        <div className="flex flex-col">
          <div className="inline-block px-2 py-0.5 bg-white text-black text-[10px] font-bold rounded mb-3 uppercase tracking-widest self-start">
            {seccion}
          </div>
          <h3
            className="font-bold group-hover:opacity-100 transition-colors text-lg md:text-xl leading-snug"
            style={{ color: 'var(--news-text-color)' }}
          >
            {titulo}
          </h3>
          {introHTML && (
            <div
              className="mt-3 line-clamp-4 text-sm leading-relaxed"
              style={{ color: 'var(--news-text-color)' }}
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
            <span className="text-sm tracking-wide truncate block" style={{ color: 'var(--news-author-color)' }}>
              <span className="font-normal">Por</span> <span className="font-bold">{opinologo_firma || 'Redacción'}</span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

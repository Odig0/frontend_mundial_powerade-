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
}

export default function NewsCard({
  id,
  titulo,
  imagen_home,
  secciones,
  introHTML,
  link,
  variant = 'default',
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
    <Link href={href}>
      <div className="group cursor-pointer h-full flex flex-col">
        <div className="relative w-full aspect-video overflow-hidden bg-muted mb-3">
          <Image
            src={imagen_home}
            alt={titulo}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <SocialPostButton id={id} titulo={titulo} />
        </div>
        <div className="flex-1">
          <div className="inline-block px-2 py-0.5 bg-accent text-accent-foreground text-[11px] font-bold rounded mb-2 capitalize">
            {seccion}
          </div>
          <h3 className="font-bold text-white group-hover:text-accent transition-colors line-clamp-2 text-sm md:text-base leading-snug">
            {titulo}
          </h3>
          {introHTML && (
            <div
              className="text-muted-foreground mt-1.5 line-clamp-2 text-xs [&>p]:inline"
              dangerouslySetInnerHTML={{ __html: introHTML }}
            />
          )}
        </div>
      </div>
    </Link>
  )
}

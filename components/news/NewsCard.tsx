'use client'

import Link from 'next/link'
import Image from 'next/image'

interface NewsCardProps {
  titulo: string
  imagen_home: string
  secciones: string[]
  introHTML?: string
  link: string
  variant?: 'default' | 'small'
}

export default function NewsCard({
  titulo,
  imagen_home,
  secciones,
  introHTML,
  link,
  variant = 'default',
}: NewsCardProps) {
  const seccion = secciones && secciones.length > 0 ? secciones[0] : 'general'
  const href = seccion && link ? `/${seccion}/${link}` : null
  const hasImage = Boolean(imagen_home && imagen_home.trim())

  if (!hasImage || !href) {
    return null
  }

  const content = variant === 'small' ? (
    <div className="group cursor-pointer h-full">
      <div className="relative w-full aspect-video overflow-hidden rounded-lg mb-3 bg-muted">
        <Image
          src={imagen_home}
          alt={titulo}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <h3 className="font-bold text-foreground group-hover:text-accent transition-colors line-clamp-2 text-sm">
        {titulo}
      </h3>
      {introHTML && (
        <div
          className="text-muted-foreground mt-2 line-clamp-2 text-xs [&>p]:inline"
          dangerouslySetInnerHTML={{ __html: introHTML }}
        />
      )}
    </div>
  ) : (
    <div className="group cursor-pointer h-full flex flex-col">
      <div className="relative w-full aspect-video overflow-hidden rounded-lg mb-4 bg-muted">
        <Image
          src={imagen_home}
          alt={titulo}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="flex-1">
        <div className="inline-block px-2 py-1 bg-accent text-accent-foreground text-xs font-bold rounded mb-2 capitalize">
          {seccion}
        </div>
        <h3 className="font-bold text-lg text-foreground group-hover:text-accent transition-colors line-clamp-2">
          {titulo}
        </h3>
        {introHTML && (
          <div
            className="text-muted-foreground mt-2 line-clamp-3 text-sm [&>p]:inline"
            dangerouslySetInnerHTML={{ __html: introHTML }}
          />
        )}
      </div>
    </div>
  )

  return <Link href={href}>{content}</Link>
}

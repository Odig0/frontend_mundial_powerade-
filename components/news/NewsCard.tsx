'use client'

import Link from 'next/link'
import Image from 'next/image'

interface NewsCardProps {
  title: string
  image: string
  category: string
  description?: string
  link: string
  seccion: string
  variant?: 'default' | 'small'
}

export default function NewsCard({
  title,
  image,
  category,
  description,
  link,
  seccion,
  variant = 'default',
}: NewsCardProps) {
  const href = `/${seccion}/${link}`

  if (variant === 'small') {
    return (
      <Link href={href}>
        <div className="group cursor-pointer h-full">
          <div className="relative w-full aspect-video overflow-hidden rounded-lg mb-3 bg-muted">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <h3 className="font-bold text-foreground group-hover:text-accent transition-colors line-clamp-2 text-sm">
            {title}
          </h3>
          {description && (
            <p className="text-muted-foreground mt-2 line-clamp-2 text-xs">
              {description}
            </p>
          )}
        </div>
      </Link>
    )
  }

  return (
    <Link href={href}>
      <div className="group cursor-pointer h-full flex flex-col">
        <div className="relative w-full aspect-video overflow-hidden rounded-lg mb-4 bg-muted">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="flex-1">
          <div className="inline-block px-2 py-1 bg-accent text-accent-foreground text-xs font-bold rounded mb-2">
            {category}
          </div>
          <h3 className="font-bold text-lg text-foreground group-hover:text-accent transition-colors line-clamp-2">
            {title}
          </h3>
          {description && (
            <p className="text-muted-foreground mt-2 line-clamp-3 text-sm">
              {description}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}

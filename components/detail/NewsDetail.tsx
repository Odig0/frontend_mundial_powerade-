'use client'

import Image from 'next/image'

interface NewsDetailProps {
  id: string
  titulo: string
  fecha: string
  publishedAt?: string
  modifiedAt?: string
  canonicalUrl?: string
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
  publishedAt,
  modifiedAt,
  canonicalUrl,
  imagen_interior,
  secciones,
  introHTML,
  textoHTML,
  opinologo_firma,
}: NewsDetailProps) {
  const seccion = secciones?.[0] ?? 'general'
  const hasImage = Boolean(imagen_interior?.trim())

  return (
    <article
      className="max-w-3xl mx-auto"
      itemScope
      itemType="https://schema.org/NewsArticle"
      itemID={canonicalUrl || undefined}
    >
      <div className="mb-6">
        <meta itemProp="mainEntityOfPage" content={canonicalUrl || ''} />
        <meta itemProp="headline" content={titulo} />
        <meta itemProp="description" content={introHTML ? introHTML.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() : titulo} />
        <meta itemProp="articleSection" content={seccion} />
        {publishedAt && <meta itemProp="datePublished" content={publishedAt} />}
        {modifiedAt && <meta itemProp="dateModified" content={modifiedAt} />}
        <div className="inline-block px-3 py-1.5 bg-accent text-accent-foreground text-xs font-bold rounded mb-4 uppercase tracking-wider" itemProp="articleSection">
          {seccion}
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-foreground mb-4" itemProp="headline">{titulo}</h1>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {fecha && (
            <p className="text-muted-foreground text-sm">
              <time itemProp="datePublished" dateTime={publishedAt || undefined}>{fecha}</time>
              {modifiedAt && modifiedAt !== publishedAt && (
                <meta itemProp="dateModified" content={modifiedAt} />
              )}
            </p>
          )}
        </div>

        <div className="mt-4 py-1">
          <span className="text-[#3CB7FF] text-xs tracking-wide" itemProp="author" itemScope itemType="https://schema.org/Person">
            <span className="font-normal">Por</span> <span className="font-bold">{opinologo_firma || 'Redacción'}</span>
            <meta itemProp="name" content={opinologo_firma || 'Redacción'} />
          </span>
        </div>
      </div>

      {hasImage && (
        <div className="relative w-full aspect-video md:aspect-[16/9] overflow-hidden rounded-lg mb-8 bg-muted" itemProp="image" itemScope itemType="https://schema.org/ImageObject">
          <meta itemProp="url" content={imagen_interior} />
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
          itemProp="description"
          dangerouslySetInnerHTML={{ __html: introHTML }}
        />
      )}

      <div className="prose prose-invert max-w-none">
        <div
          className="text-foreground leading-relaxed space-y-4"
          itemProp="articleBody"
          dangerouslySetInnerHTML={{ __html: textoHTML }}
        />
      </div>
    </article>
  )
}


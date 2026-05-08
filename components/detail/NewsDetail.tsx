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

// Ícono universal de compartir
const ShareIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
  </svg>
)

function ShareButtons({ url, title, compact = false }: { url?: string; title: string; compact?: boolean }) {
  const encodedUrl = encodeURIComponent(url || '')
  const encodedTitle = encodeURIComponent(title)

  const networks = [
    {
      name: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      label: 'Facebook',
      bg: 'linear-gradient(135deg, #1877F2, #0d5fd8)',
      shadow: 'rgba(24,119,242,0.45)',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
          <path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 4.991 3.657 9.128 8.438 9.877v-6.987H7.898v-2.89h2.54V9.798c0-2.508 1.493-3.891 3.776-3.891 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.772-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.987C18.343 21.128 22 16.991 22 12z"/>
        </svg>
      ),
    },
    {
      name: 'X',
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      label: 'X (Twitter)',
      bg: 'linear-gradient(135deg, #1a1a1a, #000000)',
      shadow: 'rgba(0,0,0,0.5)',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
    },
    {
      name: 'WhatsApp',
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      label: 'WhatsApp',
      bg: 'linear-gradient(135deg, #25D366, #128c47)',
      shadow: 'rgba(37,211,102,0.4)',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      ),
    },
  ]

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Ícono + etiqueta compartir */}
      <span className="inline-flex items-center gap-1.5 text-muted-foreground text-xs font-semibold uppercase tracking-widest mr-1">
        <ShareIcon />
        {!compact && <span>Compartir</span>}
      </span>
      {networks.map((net) => (
        <a
          key={net.name}
          href={net.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Compartir en ${net.name}`}
          style={{
            background: net.bg,
            boxShadow: `0 4px 14px ${net.shadow}`,
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-white text-xs font-bold transition-all duration-200 hover:opacity-90 hover:scale-105 hover:-translate-y-0.5 active:scale-95"
        >
          {net.icon}
          <span>{net.label}</span>
        </a>
      ))}
    </div>
  )
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
        <meta itemProp="author" content={opinologo_firma || 'Redacción'} />
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
        {/* author will be shown under the image for layout purposes */}
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

      {/* Author + share buttons top */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="text-xs text-muted-foreground">Por</div>
          <div className="font-bold text-foreground text-base">{opinologo_firma || 'Redacción'}</div>
        </div>
        <ShareButtons url={canonicalUrl} title={titulo} />
      </div>

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

      {/* Share buttons bottom */}
      <div className="mt-10 pt-6 border-t border-white/10">
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-4">Compartir nota</p>
        <ShareButtons url={canonicalUrl} title={titulo} />
      </div>
    </article>
  )
}

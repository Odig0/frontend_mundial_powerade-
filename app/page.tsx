import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/layout/Header'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroBlock from '@/components/home/HeroBlock'
import NewsGrid from '@/components/home/NewsGrid'
import VideoBlock from '@/components/home/VideoBlock'
import HydrationBanner from '@/components/home/HydrationBanner'
import FixtureBlock from '@/components/home/FixtureBlock'
import SocialPostButton from '@/components/news/SocialPostButton'
import HomeLeftAd from '@/components/publicidad/HomeLeftAd'
import HomeRightAd from '@/components/publicidad/HomeRightAd'
import TopBannerAd from '@/components/publicidad/TopBannerAd'
import BottomBannerAd from '@/components/publicidad/BottomBannerAd'
import { getNewsWithFallback } from '@/lib/news-service'
import { getDailymotionVideos } from '@/services/dailymotionService'

const BASE_URL = (process.env.NEXT_PUBLIC_NEWS_BASE_URL || 'https://dev.eldeber.bo').replace(/\/$/, '')
const SITE_NAME = 'El Deber Deportes'

function toAbsoluteUrl(path: string) {
  if (!path) {
    return path
  }

  if (/^https?:\/\//i.test(path)) {
    return path
  }

  return `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

function toIsoDate(timestamp: number) {
  const normalizedTimestamp = timestamp > 1_000_000_000_000 ? timestamp : timestamp * 1000
  return new Date(normalizedTimestamp).toISOString()
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim()
}

function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

export const metadata: Metadata = {
  title: 'Powerade - El Deber Deportes',
  description: 'Cobertura completa del Mundial 2026: partidos, selecciones, noticias, videos y análisis deportivos en vivo.',
  keywords: ['mundial 2026', 'fútbol', 'deportes', 'noticias'],
  openGraph: {
    title: 'Powerade - El Deber Deportes',
    description: 'Cobertura completa del Mundial 2026: partidos, selecciones, noticias, videos y análisis deportivos.',
    type: 'website',
    locale: 'es_ES',
    url: BASE_URL,
    siteName: 'El Deber Deportes',
    images: [
      {
        url: '/logo_powerade.png',
        width: 1200,
        height: 630,
        alt: 'El Deber Deportes - Powerade',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Powerade - El Deber Deportes',
    description: 'Cobertura del Mundial 2026',
    images: ['/logo_powerade.png'],
  },
}

export default async function Home() {
  const [rawNews, videos] = await Promise.all([
    getNewsWithFallback(),
    getDailymotionVideos(),
  ])

  const news = rawNews.filter((item) => item.imagen_home && item.imagen_home.trim())
  const featured = news.slice(0, 3)
  const secondary = news.slice(3, 6)
  const latest = news.slice(6, 14)
  const featuredArticle = featured[0]
  const featuredArticleHref = featuredArticle
    ? (() => {
      const seccion = featuredArticle.secciones?.[0] ?? 'general'
      return seccion && featuredArticle.link ? `/${seccion}/${featuredArticle.link}` : null
    })()
    : null

  const newsArticleSchema = featuredArticle
    ? {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: featuredArticle.titulo,
      description: featuredArticle.introHTML ? stripHtml(featuredArticle.introHTML).slice(0, 220) : undefined,
      image: featuredArticle.imagen_home ? [toAbsoluteUrl(featuredArticle.imagen_home)] : undefined,
      datePublished: toIsoDate(featuredArticle.fecha_a || featuredArticle.fecha_c),
      dateModified: toIsoDate(featuredArticle.fecha_c || featuredArticle.fecha_a),
      author: {
        '@type': 'Person',
        name: featuredArticle.opinologo?.firma || 'Redacción',
      },
      publisher: {
        '@type': 'Organization',
        name: SITE_NAME,
        logo: {
          '@type': 'ImageObject',
          url: `${BASE_URL}/logo_powerade.png`,
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': featuredArticleHref ? toAbsoluteUrl(featuredArticleHref) : `${BASE_URL}/`,
      },
      url: featuredArticleHref ? toAbsoluteUrl(featuredArticleHref) : `${BASE_URL}/`,
    }
    : null

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#000000' }}>
      <Header />
      <Navbar />

      {/* Top Banner Ad 970x90 */}
      <TopBannerAd targeting={{ portal: 'tribuna' }} />

      {/* Contenedor con laterales publicitarios */}
      <div className="flex justify-center w-full max-w-[1900px] mx-auto gap-4 px-4">
        
        {/* Lateral Izquierdo */}
        <HomeLeftAd targeting={{ portal: 'tribuna' }} />

        {/* Contenido Central */}
        <main className="flex-1 max-w-[1200px] min-w-0 flex flex-col">
          
          {/* Hero + Fixture arriba */}
          <div className="w-full pt-4">
            {featured.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Noticia destacada a la izquierda (2 columnas) */}
                <div className="lg:col-span-2">
                  <Link href={featuredArticleHref || '#'} className="group block transition-all duration-300">
                    <div className="flex flex-col h-full">
                      <div className="relative aspect-video overflow-hidden bg-muted mb-4">
                        <Image
                          src={featuredArticle?.imagen_home || ''}
                          alt={featuredArticle?.titulo || ''}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-2 right-2">
                          <SocialPostButton id={featuredArticle?._id || ''} titulo={featuredArticle?.titulo || ''} />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <div className="inline-block px-2 py-0.5 bg-accent text-accent-foreground text-[10px] font-bold rounded mb-3 uppercase tracking-widest self-start">
                          {featuredArticle?.secciones?.[0] ?? 'general'}
                        </div>
                        <h2 className="typography-featured-hero-title group-hover:opacity-100 transition-colors">
                          {featuredArticle?.titulo}
                        </h2>
                        {featuredArticle?.introHTML && (
                          <div
                            className="typography-news-intro mt-3 line-clamp-4"
                            dangerouslySetInnerHTML={{
                              __html: (() => {
                                const plainText = featuredArticle.introHTML.replace(/<[^>]*>?/gm, '');
                                const words = plainText.split(/\s+/).filter(Boolean);
                                if (words.length <= 20) return plainText;
                                return words.slice(0, 20).join(' ') + '...';
                              })()
                            }}
                          />
                        )}
                        <div className="mt-5">
                          <span className="typography-news-author truncate block">
                            <span className="font-normal">Por</span> <span className="font-bold">{featuredArticle?.opinologo?.firma || 'Redacción'}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
                
                {/* Fixture a la derecha (1 columna) */}
                <div className="lg:col-span-1">
                  <FixtureBlock />
                </div>
              </div>
            ) : (
              <div className="rounded border border-dashed border-border bg-card px-6 py-12 text-center mb-4">
                <p className="text-lg font-semibold text-white">No hay noticias disponibles</p>
                <p className="mt-2 text-sm text-muted-foreground">Sincroniza el backend para cargar contenido real.</p>
              </div>
            )}
          </div>

          {/* Grid de 2 noticias secundarias */}
          {secondary.length > 0 && (
            <div className="w-full mt-8 mb-16">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Primeras 2 noticias */}
                {secondary.slice(0, 2).map((item) => {
                  const seccion = item.secciones?.[0] ?? 'general'
                  const href = seccion && item.link ? `/${seccion}/${item.link}` : null
                  if (!href) return null
                  return (
                    <Link
                      key={item._id}
                      href={href}
                      className="group block transition-all duration-300"
                    >
                      <div className="flex flex-col h-full">
                        <div className="relative aspect-video overflow-hidden bg-muted mb-4">
                          <Image
                            src={item.imagen_home}
                            alt={item.titulo}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-2 right-2">
                            <SocialPostButton id={item._id} titulo={item.titulo} />
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <div className="inline-block px-2 py-0.5 bg-accent text-accent-foreground text-[10px] font-bold rounded mb-3 uppercase tracking-widest self-start">
                            {seccion}
                          </div>
                          <h3 className="typography-card-title group-hover:opacity-100 transition-colors">
                            {item.titulo}
                          </h3>
                          {item.introHTML && (
                            <div
                              className="typography-news-intro mt-3 line-clamp-4"
                              dangerouslySetInnerHTML={{
                                __html: (() => {
                                  const plainText = item.introHTML.replace(/<[^>]*>?/gm, '');
                                  const words = plainText.split(/\s+/).filter(Boolean);
                                  if (words.length <= 20) return plainText;
                                  return words.slice(0, 20).join(' ') + '...';
                                })()
                              }}
                            />
                          )}
                          <div className="mt-5">
                            <span className="typography-news-author truncate block">
                              <span className="font-normal">Por</span> <span className="font-bold">{item.opinologo?.firma || 'Redacción'}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          {/* Banner pausa de hidratación
          <div className="w-full mt-4">
            <HydrationBanner />
          </div> */}

          {/* Videos */}
          <div className="w-full mt-6">
            <VideoBlock videos={videos} />
          </div>

          {/* Últimas noticias */}
          {latest.length > 0 && (
            <div className="w-full mt-0 mb-8">
              <NewsGrid news={latest} title="Últimas noticias" />
            </div>
          )}

          {/* Bloque final de publicidad */}
          <BottomBannerAd targeting={{ portal: 'tribuna' }} />
        </main>

        {/* Lateral Derecho */}
        <HomeRightAd targeting={{ portal: 'tribuna' }} />
      </div>

      <Footer />
    </div>
  )
}

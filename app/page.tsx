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
import { getNews } from '@/lib/api'
import { getDailymotionVideos } from '@/services/dailymotionService'

export default async function Home() {
  const [rawNews, videos] = await Promise.all([
    getNews(),
    getDailymotionVideos(),
  ])

  const news = rawNews.filter((item) => item.imagen_home && item.imagen_home.trim())
  const featured = news.slice(0, 3)
  const secondary = news.slice(3, 6)
  const latest = news.slice(6, 14)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <Navbar />

      <main className="flex-1 flex flex-col">

        {/* Hero + noticias secundarias */}
        <div className="container max-w-[1200px] mx-auto px-4 pt-4">
          {featured.length > 0 ? (
            <HeroBlock featured={featured[0]} side={featured.slice(1, 3)} />
          ) : (
            <div className="rounded border border-dashed border-border bg-card px-6 py-12 text-center mb-4">
              <p className="text-lg font-semibold text-white">No hay noticias disponibles</p>
              <p className="mt-2 text-sm text-muted-foreground">Sincroniza el backend para cargar contenido real.</p>
            </div>
          )}
        </div>

        {/* Grid de 3 noticias secundarias */}
        {secondary.length > 0 && (
          <div className="container max-w-[1200px] mx-auto px-4 mt-8 mb-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {secondary.map((item) => {
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
                        <h3 className="font-bold text-white group-hover:text-accent transition-colors text-lg md:text-xl leading-snug">
                          {item.titulo}
                        </h3>
                        {item.introHTML && (
                          <div
                            className="text-white/60 mt-3 line-clamp-4 text-sm leading-relaxed"
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
                          <span className="text-[#3CB7FF] text-sm tracking-wide truncate block">
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

        {/* Banner pausa de hidratación + Fixture */}
        <div className="container max-w-[1200px] mx-auto px-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
            <HydrationBanner />
            <FixtureBlock />
          </div>
        </div>

        {/* Videos */}
        <div className="container max-w-[1200px] mx-auto px-4 mt-6">
          <VideoBlock videos={videos} />
        </div>

        {/* Últimas noticias */}
        {latest.length > 0 && (
          <div className="container max-w-[1200px] mx-auto px-4 mt-0 mb-8">
            <NewsGrid news={latest} title="Últimas noticias" />
          </div>
        )}

      </main>

      <Footer />
    </div>
  )
}

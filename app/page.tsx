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
  const [news, videos] = await Promise.all([
    getNews(),
    getDailymotionVideos()
  ])
  
  const filteredNews = news.filter((item) => item.imagen_home?.trim())
  const featured = filteredNews.slice(0, 3)
  const secondary = filteredNews.slice(3, 6)
  const latest = filteredNews.slice(6)

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
          <div className="container max-w-[1200px] mx-auto px-4 mt-px">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
              {secondary.map((item) => {
                const seccion = item.secciones?.[0] ?? 'general'
                const href = seccion && item.link ? `/${seccion}/${item.link}` : null
                if (!href) return null
                return (
                  <a key={item._id} href={href} className="group block bg-background p-4">
                    <div className="relative w-full aspect-video overflow-hidden bg-muted mb-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.imagen_home}
                        alt={item.titulo}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <SocialPostButton id={item._id} titulo={item.titulo} />
                    </div>
                    <h3 className="font-bold text-white group-hover:text-accent transition-colors line-clamp-2 text-sm leading-snug">
                      {item.titulo}
                    </h3>
                  </a>
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
          <div className="container max-w-[1200px] mx-auto px-4 mt-6 mb-8">
            <NewsGrid news={latest} title="Últimas noticias" />
          </div>
        )}

      </main>

      <Footer />
    </div>
  )
}

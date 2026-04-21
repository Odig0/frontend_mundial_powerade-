import Header from '@/components/layout/Header'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroBlock from '@/components/home/HeroBlock'
import NewsGrid from '@/components/home/NewsGrid'
import NewsActions from '@/components/home/NewsActions'
import VideoBlock from '@/components/home/VideoBlock'
import { getNews } from '@/lib/api'

export default async function Home() {
  const news = (await getNews()).filter((item) => item.imagen_home && item.imagen_home.trim())
  const featured = news.slice(0, 3)
  const latest = news.slice(3)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <Navbar />

      <main className="flex-1 flex flex-col gap-12 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Noticias reales</p>
              <h1 className="text-3xl md:text-5xl font-black text-foreground">Portada Powerade</h1>
            </div>
            <NewsActions primaryHref="/mundial" primaryLabel="Mundial" />
          </div>

          {featured.length > 0 ? (
            <HeroBlock
              featured={featured[0]}
              side={featured.slice(1, 3)}
            />
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-card px-6 py-12 text-center">
              <p className="text-lg font-semibold text-foreground">No hay noticias disponibles</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Sincroniza el backend para cargar contenido real.
              </p>
            </div>
          )}
        </div>

        <div className="container mx-auto px-4">
          {latest.length > 0 ? (
            <NewsGrid news={latest} title="Últimas noticias" />
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-card px-6 py-12 text-center">
              <p className="text-lg font-semibold text-foreground">No hay más noticias para mostrar</p>
              <p className="mt-2 text-sm text-muted-foreground">
                El feed principal se actualizará cuando llegue nuevo contenido.
              </p>
            </div>
          )}
        </div>

        {/* Videos Section (Full Bleed) */}
        <VideoBlock />
      </main>

      <Footer />
    </div>
  )
}

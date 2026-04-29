import Header from '@/components/layout/Header'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import SectionGrid from '@/components/section/SectionGrid'
import { getNewsBySectionSlug } from '@/lib/api'

export const metadata = {
  title: 'Fuera de juego - El Deber Deportes',
  description: 'Últimas noticias de la sección Fuera de juego',
}

export default async function FueraDeJuegoPage() {
  const news = (await getNewsBySectionSlug('fuera de juego')).filter(
    (item) => item.imagen_home && item.imagen_home.trim()
  )

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-black text-foreground mb-2">
            Fuera de juego
          </h1>
          <p className="text-muted-foreground">Últimas actualizaciones y noticias</p>
        </div>

        {news.length > 0 ? (
          <SectionGrid news={news} itemsPerPage={12} />
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-card px-6 py-12 text-center">
            <p className="text-lg font-semibold text-foreground">
              No hay noticias en esta sección
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Prueba sincronizar el backend o vuelve más tarde.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

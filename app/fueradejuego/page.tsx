import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import SectionGrid from '@/components/section/SectionGrid'
import { getFueraDeJuegoNews } from '@/lib/api'
import PageWrapper from '@/components/layout/PageWrapper'
import { buildSectionTargeting } from '@/lib/adTargeting'

const BASE_URL = process.env.NEXT_PUBLIC_NEWS_BASE_URL || 'https://dev.eldeber.bo'

export const metadata: Metadata = {
  title: 'Fuera de Juego - El Deber Deportes',
  description:
    'Últimas noticias de Fuera de Juego. Análisis, curiosidades y temas destacados del fútbol y el deporte.',
  keywords: ['fuera de juego', 'noticias', 'deportes', 'análisis'],
  openGraph: {
    title: 'Fuera de Juego - El Deber Deportes',
    description:
      'Últimas noticias de Fuera de Juego. Análisis, curiosidades y temas destacados del fútbol.',
    type: 'website',
    locale: 'es_ES',
    url: `${BASE_URL}/fueradejuego`,
    siteName: 'El Deber Deportes',
    images: [
      {
        url: '/logo_powerade.png',
        width: 1200,
        height: 630,
        alt: 'Fuera de Juego - El Deber Deportes',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fuera de Juego - El Deber Deportes',
    description: 'Últimas noticias y análisis',
    images: ['/logo_powerade.png'],
  },
}

export default async function FueraDeJuegoPage() {
  // Usa el endpoint dedicado: GET /v1/news/filter/fuera-de-juego
  const news = (await getFueraDeJuegoNews()).filter(
    (item) => item.imagen_home && item.imagen_home.trim()
  )

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#000000' }}>
      <Header />
      <Navbar />

      <PageWrapper targeting={buildSectionTargeting('fueradejuego')}>
        <main className="flex-1 py-8 md:py-12">
          <div className="mb-12">
            <h1 className="text-3xl md:text-4xl font-black text-foreground mb-2">
              Fuera de Juego
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
      </PageWrapper>

      <Footer />
    </div>
  )
}

import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import SectionGrid from '@/components/section/SectionGrid'
import { getNewsBySectionSlug } from '@/lib/api'

const BASE_URL = process.env.NEXT_PUBLIC_NEWS_BASE_URL || 'https://dev.eldeber.bo'

export const metadata: Metadata = {
  title: 'Fuera de juego - El Deber Deportes',
  description: 'Últimas noticias de la sección Fuera de juego. Análisis, curiosidades y temas relacionados al fútbol y el deporte.',
  keywords: ['fuera de juego', 'noticias', 'deportes', 'análisis'],
  openGraph: {
    title: 'Fuera de juego - El Deber Deportes',
    description: 'Últimas noticias de la sección Fuera de juego. Análisis, curiosidades y temas relacionados al fútbol.',
    type: 'website',
    locale: 'es_ES',
    url: `${BASE_URL}/fueradejuego`,
    siteName: 'El Deber Deportes',
    images: [
      {
        url: 'https://mediakit.eldeber.com.bo/images/eldeber_logo_white.png',
        width: 1200,
        height: 630,
        alt: 'Fuera de juego - El Deber Deportes',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fuera de juego - El Deber Deportes',
    description: 'Últimas noticias y análisis',
    images: ['https://mediakit.eldeber.com.bo/images/eldeber_logo_white.png'],
  },
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

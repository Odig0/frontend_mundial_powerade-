import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import SectionGrid from '@/components/section/SectionGrid'
import { getNewsBySectionSlug } from '@/lib/api'

const BASE_URL = process.env.NEXT_PUBLIC_NEWS_BASE_URL || 'https://dev.eldeber.bo'

export const metadata: Metadata = {
  title: 'Mundial - El Deber Deportes',
  description: 'Últimas noticias del Mundial 2026. Cobertura completa de todos los partidos, selecciones y análisis del campeonato mundial.',
  keywords: ['mundial 2026', 'mundial', 'noticias', 'fútbol', 'deportes'],
  openGraph: {
    title: 'Mundial - El Deber Deportes',
    description: 'Últimas noticias del Mundial 2026. Cobertura completa de todos los partidos.',
    type: 'website',
    locale: 'es_ES',
    url: `${BASE_URL}/mundial`,
    siteName: 'El Deber Deportes',
    images: [
      {
        url: '/tribuna_powerade.png',
        width: 1200,
        height: 630,
        alt: 'Mundial - El Deber Deportes',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mundial - El Deber Deportes',
    description: 'Cobertura del Mundial 2026',
    images: ['/tribuna_powerade.png'],
  },
}

export default async function MundialPage() {
  const news = (await getNewsBySectionSlug('mundial')).filter(
    (item) => item.imagen_home && item.imagen_home.trim()
  )

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-black text-foreground mb-2">Mundial</h1>
          <p className="text-muted-foreground">Cobertura completa del Mundial 2026</p>
        </div>

        {news.length > 0 ? (
          <SectionGrid news={news} />
        ) : (
          <div className="rounded border border-dashed border-border bg-card px-6 py-12 text-center">
            <p className="text-lg font-semibold text-foreground">No hay noticias disponibles</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Sincroniza el backend para cargar contenido.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

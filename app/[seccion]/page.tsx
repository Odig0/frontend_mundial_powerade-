import { notFound } from 'next/navigation'
import Header from '@/components/layout/Header'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import SectionGrid from '@/components/section/SectionGrid'
import NewsActions from '@/components/home/NewsActions'
import { getNewsBySection, getAvailableSections } from '@/lib/api'

interface Params {
  seccion: string
}

export async function generateMetadata({ params }: { params: Promise<Params> | Params }) {
  const resolvedParams = await params
  const { seccion } = resolvedParams

  const formattedSection = seccion.toLowerCase() === 'mundial'
    ? 'Mundial'
    : seccion.charAt(0).toUpperCase() + seccion.slice(1)

  return {
    title: `${formattedSection} - Sports News Daily`,
    description: `Latest ${formattedSection.toLowerCase()} news and updates`,
  }
}

export default async function SectionPage({ params }: { params: Promise<Params> | Params }) {
  const { seccion } = await params

  const availableSections = await getAvailableSections()
  if (!availableSections.includes(seccion)) {
    notFound()
  }

  const news = (await getNewsBySection(seccion)).filter((item) => item.imagen_home && item.imagen_home.trim())

  const formattedSection = seccion.toLowerCase() === 'mundial'
    ? 'Mundial'
    : seccion.charAt(0).toUpperCase() + seccion.slice(1)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-foreground mb-2">{formattedSection}</h1>
            <p className="text-muted-foreground">Últimas actualizaciones y noticias</p>
          </div>
          <NewsActions primaryHref="/" primaryLabel="Portada" />
        </div>

        {news.length > 0 ? (
          <SectionGrid news={news} itemsPerPage={12} />
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-card px-6 py-12 text-center">
            <p className="text-lg font-semibold text-foreground">No hay noticias en esta sección</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Prueba sincronizar el backend o cambiar de sección.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

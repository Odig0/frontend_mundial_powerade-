import { notFound } from 'next/navigation'
import Header from '@/components/layout/Header'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import NewsDetail from '@/components/detail/NewsDetail'
import { getNewsByLink } from '@/lib/api'

interface Params {
  seccion: string
  link: string
}

export async function generateMetadata({ params }: { params: Promise<Params> | Params }) {
  const resolvedParams = await params
  const { seccion, link } = resolvedParams
  const news = await getNewsByLink(seccion, link)

  if (!news) {
    return {
      title: 'Not Found',
    }
  }

  // extract text from HTML for description metadata if needed, but for simplicity, we can just omit it or use title
  return {
    title: `${news.titulo} - Sports News Daily`,
  }
}

export default async function DetailPage({ params }: { params: Promise<Params> | Params }) {
  const resolvedParams = await params
  const { seccion, link } = resolvedParams

  const news = await getNewsByLink(seccion, link)

  if (!news) {
    notFound()
  }

  const dateString = news.fecha_c ? new Date(news.fecha_c).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) : ''

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <NewsDetail
          titulo={news.titulo}
          fecha={dateString}
          imagen_interior={news.imagen_interior}
          secciones={news.secciones}
          introHTML={news.introHTML}
          textoHTML={news.textoHTML}
        />
      </main>

      <Footer />
    </div>
  )
}

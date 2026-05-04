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

const BASE_URL = process.env.NEXT_PUBLIC_NEWS_BASE_URL || 'https://dev.eldeber.bo'

function extractTextFromHtml(html?: string): string {
  if (!html) return ''
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .substring(0, 160)
    .trim()
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

  const title = `${news.titulo} - El Deber Deportes`
  const description = news.introHTML ? extractTextFromHtml(news.introHTML) : news.titulo
  const image = news.imagen_interior || '/tribuna_powerade.png'
  const canonicalUrl = `${BASE_URL}/${seccion}/${link}`

  return {
    title,
    description,
    keywords: [...(news.secciones || []), 'noticias', 'deportes'],
    openGraph: {
      title,
      description,
      type: 'article',
      locale: 'es_ES',
      url: canonicalUrl,
      siteName: 'El Deber Deportes',
      publishedTime: news.fecha_c ? new Date(news.fecha_c).toISOString() : undefined,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: news.titulo,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    alternates: {
      canonical: canonicalUrl,
    },
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
          id={news._id}
          titulo={news.titulo}
          fecha={dateString}
          imagen_interior={news.imagen_interior}
          secciones={news.secciones}
          introHTML={news.introHTML}
          textoHTML={news.textoHTML}
          opinologo_firma={news.opinologo?.firma}
        />
      </main>

      <Footer />
    </div>
  )
}

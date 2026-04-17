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

  return {
    title: `${news.title} - Sports News Daily`,
    description: news.description,
  }
}

export default async function DetailPage({ params }: { params: Promise<Params> | Params }) {
  const resolvedParams = await params
  const { seccion, link } = resolvedParams

  const news = await getNewsByLink(seccion, link)

  if (!news) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <NewsDetail
          title={news.title}
          date={news.date}
          image={news.image}
          category={news.category}
          intro={news.description}
          content={news.content}
        />
      </main>

      <Footer />
    </div>
  )
}

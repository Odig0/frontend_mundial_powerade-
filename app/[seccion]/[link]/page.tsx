import Header from '@/components/layout/Header'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import NewsDetail from '@/components/detail/NewsDetail'
import NewsDetailPending from '@/components/detail/NewsDetailPending'
import PageWrapper from '@/components/layout/PageWrapper'
import { buildArticleTargeting } from '@/lib/adTargeting'
import { getNewsByLink } from '@/lib/api'

interface Params {
  seccion: string
  link: string
}

const BASE_URL = (process.env.NEXT_PUBLIC_NEWS_BASE_URL || 'https://dev.eldeber.bo').replace(/\/$/, '')
const SHARE_BASE_URL = 'https://tribuna.diez.bo'
const SITE_NAME = ''

function toAbsoluteUrl(path: string) {
  if (!path) {
    return path
  }

  if (/^https?:\/\//i.test(path)) {
    return path
  }

  return `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

function toIsoDate(timestamp?: number) {
  if (!timestamp) {
    return undefined
  }

  const normalizedTimestamp = timestamp > 1_000_000_000_000 ? timestamp : timestamp * 1000
  return new Date(normalizedTimestamp).toISOString()
}

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

function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, '\\u003c')
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

  const title = `${news.titulo} `
  const description = news.introHTML ? extractTextFromHtml(news.introHTML) : news.titulo
  const image = news.imagen_interior || '/logo_powerade.png'
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
      siteName: '',
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
    return <NewsDetailPending seccion={seccion} link={link} />
  }

  const canonicalUrl = `${BASE_URL}/${seccion}/${link}`
  const shareUrl = `${SHARE_BASE_URL}/${seccion}/${link}`
  const primarySection = news.secciones?.[0] ?? seccion
  const publishedAt = toIsoDate(news.fecha_a || news.fecha_c)
  const modifiedAt = toIsoDate(news.fecha_c || news.fecha_a)
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: news.titulo,
    description: news.introHTML ? extractTextFromHtml(news.introHTML) : news.titulo,
    image: news.imagen_interior ? [toAbsoluteUrl(news.imagen_interior)] : undefined,
    datePublished: publishedAt,
    dateModified: modifiedAt,
    author: {
      '@type': 'Person',
      name: news.opinologo?.firma || 'Redacción',
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/logo_powerade.png`,
      },
    },
    articleSection: primarySection,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    url: canonicalUrl,
    inLanguage: 'es-ES',
  }

  const dateString = news.fecha_c ? new Date(news.fecha_c).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) : ''

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#000000' }}>
      <Header />
      <Navbar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleSchema) }}
      />

      <PageWrapper targeting={buildArticleTargeting(seccion)}>
        <main className="flex-1 max-w-[1200px] min-w-0 py-8 md:py-12">
          <NewsDetail
            id={news._id}
            titulo={news.titulo}
            fecha={dateString}
            publishedAt={publishedAt}
            modifiedAt={modifiedAt}
            shareUrl={shareUrl}
            canonicalUrl={canonicalUrl}
            imagen_interior={news.imagen_interior}
            secciones={news.secciones}
            introHTML={news.introHTML}
            textoHTML={news.textoHTML}
            opinologo_firma={news.opinologo?.firma}
          />
        </main>
      </PageWrapper>

      <Footer />
    </div>
  )
}

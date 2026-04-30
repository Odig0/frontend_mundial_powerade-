import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import VideoPlayer from '@/components/videos/VideoPlayer'
import { getDailymotionVideos } from '@/services/dailymotionService'

const RAW_BASE_URL = process.env.NEXT_PUBLIC_NEWS_BASE_URL || 'https://dev.eldeber.bo'
const BASE_URL = RAW_BASE_URL.replace(/\/$/, '')

function normalizeVideoParam(videoParam?: string) {
  if (!videoParam) return ''
  if (videoParam.startsWith('player.html?')) {
    const nested = videoParam.split('?')[1]
    return new URLSearchParams(nested).get('video') || videoParam
  }
  return videoParam
}

function getVideoIdFromEmbed(embedUrl?: string) {
  if (!embedUrl) return ''
  return embedUrl.split('/').pop()?.split('?')[0] || ''
}

type SearchParams = Record<string, string | string[] | undefined>

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}): Promise<Metadata> {
  const resolved = await searchParams
  const rawVideo = Array.isArray(resolved.video) ? resolved.video[0] : resolved.video
  const selectedVideoId = normalizeVideoParam(rawVideo)

  const videos = await getDailymotionVideos()
  const selectedVideo = videos.find((video) => {
    const idFromEmbed = getVideoIdFromEmbed(video.embedUrl)
    return video.id === selectedVideoId || idFromEmbed === selectedVideoId
  })

  if (selectedVideo) {
    const title = `${selectedVideo.titulo} - Videos | El Deber Deportes`
    const description = `Mira este video en El Deber Deportes: ${selectedVideo.titulo}`
    const canonicalUrl = `${BASE_URL}/videos?video=${selectedVideoId}`

    return {
      title,
      description,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        siteName: 'El Deber Deportes',
        type: 'video.other',
        images: [
          {
            url: selectedVideo.thumb,
            alt: selectedVideo.titulo,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [selectedVideo.thumb],
      },
    }
  }

  const defaultTitle = 'Videos - El Deber Deportes'
  const defaultDescription = 'Todos los videos disponibles desde Dailymotion'

  return {
    title: defaultTitle,
    description: defaultDescription,
    alternates: {
      canonical: `${BASE_URL}/videos`,
    },
    openGraph: {
      title: defaultTitle,
      description: defaultDescription,
      url: `${BASE_URL}/videos`,
      siteName: 'El Deber Deportes',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: defaultTitle,
      description: defaultDescription,
    },
  }
}

export default async function VideosPage() {
  const videos = await getDailymotionVideos()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="mb-6">
          <p className="text-[#3CB7FF] font-semibold uppercase tracking-[0.35em] text-xs mb-3">Videos</p>
          <h1 className="text-3xl md:text-4xl font-black text-foreground">Cobertura multimedia</h1>
        </div>

        <div className="mt-6">
          {/* Client component handles player and playlist */}
          <VideoPlayer videos={videos} />
        </div>
      </main>

      <Footer />
    </div>
  )
}

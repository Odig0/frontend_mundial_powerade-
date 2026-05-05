"use client"

import { useRouter } from 'next/navigation'
import type { VideoItem } from '@/services/dailymotionService'
import VideoCarousel from './VideoCarousel'

interface VideoBlockProps {
  videos: VideoItem[]
}

/**
 * Bloque de Videos Premium Restaurado.
 * Orquestador de la experiencia visual con enfoque estético.
 */
export default function VideoBlock({ videos }: VideoBlockProps) {
  const router = useRouter()

  if (!videos || videos.length === 0) return null

  const extractVideoId = (video: Pick<VideoItem, 'id' | 'embedUrl' | 'shareUrl'>): string => {
    const fromQuery = (value?: string | null) => {
      if (!value) return ''
      try {
        const parsed = new URL(value)
        return parsed.searchParams.get('video') || ''
      } catch {
        const query = value.split('?')[1]
        if (!query) return ''
        return new URLSearchParams(query).get('video') || ''
      }
    }

    const fromLastPath = (value?: string | null) => {
      if (!value) return ''
      const path = value.split('#')[0].split('?')[0]
      const parts = path.split('/').filter(Boolean)
      const last = parts[parts.length - 1] || ''
      return last === 'player.html' ? '' : last
    }

    return (
      fromQuery(video.shareUrl) ||
      fromLastPath(video.shareUrl) ||
      fromQuery(video.embedUrl) ||
      fromLastPath(video.embedUrl) ||
      video.id
    )
  }

  const handleVideoClick = (video: VideoItem) => {
    const videoId = extractVideoId(video)
    const nextUrl = `/videos?video=${encodeURIComponent(videoId)}`
    try {
      // If we're already on the /videos page, do a client navigation so the
      // VideoPlayer can pick up the query param and switch video without a full reload.
      if (typeof window !== 'undefined' && window.location.pathname === '/videos') {
        router.push(nextUrl)
        if (window.history) window.history.pushState({}, '', nextUrl)
      } else {
        // From other pages (home), force a full navigation so the app loads
        // the `/videos` route with the selected `video` query param.
        // router.push can be flaky in some dev/HMR cases, so use location.href.
        if (typeof window !== 'undefined') {
          window.location.href = nextUrl
        } else {
          router.push(nextUrl)
        }
      }
    } catch (e) {
      if (typeof window !== 'undefined') {
        window.location.href = nextUrl
      }
    }
  }

  return (
    <section
      id="videos"
      className="bg-background pb-4 pt-8 relative overflow-hidden"
      style={{ scrollMarginTop: '88px' }}
    >
      <div className="absolute top-0 left-1/3 w-[300px] h-[300px] bg-[#3CB7FF]/5 blur-[80px] rounded-full -z-10" />
      <div className="absolute bottom-0 right-1/3 w-[250px] h-[250px] bg-[#3CB7FF]/5 blur-[60px] rounded-full -z-10" />

      <div className="w-full">
        <div className="flex flex-col items-start text-left mb-8">
          <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-2">
            <span className="w-2 h-8 bg-[#3CB7FF] rounded-full inline-block" />
            Videos
          </h2>
        </div>

        <VideoCarousel
          videos={videos}
          onVideoClick={handleVideoClick}
        />
      </div>
    </section>
  )
}

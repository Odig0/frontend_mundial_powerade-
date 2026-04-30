"use client"

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import type { VideoItem } from '@/services/dailymotionService'
import ShareVideoButton from './ShareVideoButton'

interface VideoPlayerProps {
  videos?: VideoItem[]
  startIndex?: number
}

function extractVideoId(video: Pick<VideoItem, 'id' | 'embedUrl' | 'shareUrl'>): string {
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

function normalizeVideoParam(param: string | null): string {
  if (!param) return ''
  if (param.startsWith('player.html?')) {
    const nested = param.split('?')[1]
    return new URLSearchParams(nested).get('video') || param
  }
  return param
}

function buildEmbedSrc(embedUrl: string) {
  const hasQuery = embedUrl.includes('?')
  const separator = hasQuery ? '&' : '?'
  return `${embedUrl}${separator}autoplay=1&queue-autoplay-next=1&ui-logo=0&ui-startscreen-info=0`
}

export default function VideoPlayer({ videos: initialVideos, startIndex = 0 }: VideoPlayerProps) {
  const searchParams = useSearchParams()
  const videoParam = normalizeVideoParam(searchParams.get('video'))
  
  const [selectedIndex, setSelectedIndex] = useState(startIndex)
  const [videos, setVideos] = useState<VideoItem[]>(initialVideos || [])
  const [loading, setLoading] = useState(!initialVideos || initialVideos.length === 0)

  // Actualiza el estado cuando cambien los videos iniciales
  useEffect(() => {
    if (initialVideos && initialVideos.length > 0) {
      setVideos(initialVideos)
      setLoading(false)
    }
  }, [initialVideos])

  // Si no vinieron videos del servidor, los obtenemos en cliente (fallback)
  useEffect(() => {
    if (!videos || videos.length === 0) {
      const fetchVideos = async () => {
        try {
          setLoading(true)
          const response = await fetch('/api/videos')
          if (!response.ok) throw new Error('Failed to fetch videos')
          const data = await response.json()
          setVideos(data.videos || [])
        } catch (error) {
          console.error('[VideoPlayer] Error fetching videos:', error)
          setVideos([])
        } finally {
          setLoading(false)
        }
      }
      fetchVideos()
    }
  }, [])

  // Detecta si hay un parámetro de video en la URL y selecciona ese video
  useEffect(() => {
    if (videoParam && videos && videos.length > 0) {
      const index = videos.findIndex(v => {
        const dailyId = extractVideoId(v)
        return dailyId === videoParam
      })
      if (index >= 0) {
        setSelectedIndex(index)
      }
    }
  }, [videoParam, videos])

  const handleSelectVideo = (video: VideoItem, index: number) => {
    setSelectedIndex(index)
    const selectedId = extractVideoId(video)
    const nextUrl = `/videos?video=${encodeURIComponent(selectedId)}`
    window.location.href = nextUrl
  }

  const currentVideo = videos?.[selectedIndex]

  const playerSrc = useMemo(() => {
    if (!currentVideo) return ''
    return buildEmbedSrc(currentVideo.embedUrl)
  }, [currentVideo])

  if (loading) {
    return (
      <div className="w-full bg-blue-900/20 border border-blue-500 rounded-lg p-8 text-center">
        <p className="text-white">Cargando videos...</p>
      </div>
    )
  }

  if (!videos || videos.length === 0) {
    return (
      <div className="w-full bg-blue-900/20 border border-blue-500 rounded-lg p-8 text-center">
        <p className="text-white mb-2">⚠️ No hay videos disponibles</p>
        <p className="text-xs text-blue-300">
          Videos recibidos: {videos?.length ?? 0}
        </p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_420px] gap-6 xl:gap-8">
        <section className="min-w-0">
          <div className="overflow-hidden rounded-[28px] border border-white/10 bg-black shadow-[0_0_60px_rgba(60,183,255,0.08)]">
            <div className="relative aspect-video w-full bg-black">
              {currentVideo && (
                <iframe
                  key={currentVideo.id}
                  src={playerSrc}
                  className="absolute inset-0 h-full w-full border-0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  title={currentVideo.titulo}
                />
              )}
            </div>

            <div className="border-t border-white/8 bg-black/40 px-4 py-4 md:px-6">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#3CB7FF]">
                Reproduciendo ahora
              </p>
              <div className="mt-2 flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h2 className="text-lg md:text-xl font-black leading-tight text-white">
                    {currentVideo?.titulo}
                  </h2>
                </div>
                {currentVideo && (
                  <ShareVideoButton videoId={currentVideo.id} videoTitle={currentVideo.titulo} embedUrl={currentVideo.embedUrl} shareUrl={currentVideo.shareUrl} />
                )}
              </div>
            </div>
          </div>
        </section>

        <aside className="min-w-0">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-3 md:p-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#3CB7FF]">
                  Lista
                </p>
                <h3 className="mt-1 text-lg font-black text-white">
                  Todos los videos
                </h3>
              </div>
              <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs font-semibold text-white/70">
                {videos.length}
              </span>
            </div>

            <div className="space-y-2 max-h-[calc(100vh-260px)] overflow-y-auto pr-1">
              {videos.map((video, index) => {
                const active = index === selectedIndex
                return (
                  <button
                    key={video.id}
                    type="button"
                    onClick={() => handleSelectVideo(video, index)}
                    className={`flex w-full items-center gap-3 rounded-2xl border p-2 text-left transition-all duration-300 ${
                      active
                        ? 'border-[#3CB7FF]/60 bg-[#3CB7FF]/10 shadow-[0_0_20px_rgba(60,183,255,0.08)]'
                        : 'border-white/8 bg-black/20 hover:border-white/15 hover:bg-white/5'
                    }`}
                  >
                    <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-xl bg-zinc-900">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={video.thumb}
                        alt={video.titulo}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
                      {active && (
                        <span className="absolute left-2 top-2 rounded-full bg-[#3CB7FF] px-2 py-0.5 text-[10px] font-black uppercase text-white">
                          Play
                        </span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-bold leading-snug text-white">
                        {video.titulo}
                      </p>
                      <p className="mt-1 text-xs text-white/60">
                        Dailymotion
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

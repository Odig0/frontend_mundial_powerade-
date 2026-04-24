"use client"

import { useState } from 'react'
import type { VideoItem } from '@/services/dailymotionService'
import VideoCarousel from './VideoCarousel'
import VideoModal from './VideoModal'

interface VideoBlockProps {
  videos: VideoItem[]
}

/**
 * Bloque de Videos Premium Restaurado.
 * Orquestador de la experiencia visual con enfoque estético.
 */
export default function VideoBlock({ videos }: VideoBlockProps) {
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  if (!videos || videos.length === 0) return null

  const handleVideoClick = (id: string) => {
    setSelectedVideoId(id)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    // Sincronización con la animación de salida
    setTimeout(() => {
      setSelectedVideoId(null)
    }, 450)
  }

  return (
    <section className="py-16 bg-zinc-950 text-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900 via-zinc-950 to-blue-950 p-8 md:p-12 shadow-2xl shadow-blue-950/20">
          <div className="max-w-2xl space-y-5">
            <p className="text-sm uppercase tracking-[0.3em] text-blue-300/80">Video</p>
            <h2 className="text-3xl md:text-4xl font-black text-white">Cobertura multimedia en preparación</h2>
            <p className="text-zinc-300 leading-relaxed">
              La portada ya consume noticias reales desde el backend. El bloque de video se mantiene como una
              sección editorial sin contenido simulado hasta que exista un origen real para la playlist.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/"
                className="rounded-full bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-400"
              >
                Volver a portada
              </Link>
              <Link
                href="/mundial"
                className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Ver mundial
              </Link>
            </div>
          </div>
        </div>

        <VideoCarousel 
          videos={videos} 
          onVideoClick={handleVideoClick} 
        />
      </div>

      <VideoModal 
        videoId={selectedVideoId}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </section>
  )
}

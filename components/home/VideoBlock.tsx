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
    <section className="bg-background pb-16 pt-8 relative overflow-hidden">
      {/* Luces de fondo decorativas para estética premium */}
      <div className="absolute top-0 left-1/3 w-[300px] h-[300px] bg-[#3CB7FF]/5 blur-[80px] rounded-full -z-10" />
      <div className="absolute bottom-0 right-1/3 w-[250px] h-[250px] bg-[#3CB7FF]/5 blur-[60px] rounded-full -z-10" />

      <div className="container mx-auto px-4">
        <div className="flex flex-col items-start text-left mb-8">
          <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter">
            Videos
          </h2>
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

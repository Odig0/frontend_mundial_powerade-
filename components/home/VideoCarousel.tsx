"use client"

import React, { useCallback, useEffect, useState, useMemo } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight, Play } from 'lucide-react'
import type { VideoItem } from '@/services/dailymotionService'
import { cn } from '@/lib/utils'

interface VideoCarouselProps {
  videos: VideoItem[]
  onVideoClick: (id: string) => void
}

export default function VideoCarousel({ videos, onVideoClick }: VideoCarouselProps) {
  const options = useMemo(() => ({
    loop: true,
    align: 'start' as const,
    skipSnaps: false,
  }), [])

  const [emblaRef, emblaApi] = useEmblaCarousel(options)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)

    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onSelect)
    }
  }, [emblaApi, onSelect])

  const scrollPrev = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  return (
    <div className="relative w-full pb-0 pt-0">
      <div className="overflow-hidden py-6" ref={emblaRef}>
        <div className="flex -ml-4">
          {videos.map((video, index) => (
            <div
              key={`${video.id}-${index}`}
              className="flex-[0_0_45%] sm:flex-[0_0_40%] md:flex-[0_0_33.33%] lg:flex-[0_0_25%] pl-4"
            >
              <button
                type="button"
                onClick={() => onVideoClick(video.id)}
                className="group relative block w-full aspect-[9/16] rounded-3xl overflow-hidden bg-zinc-900 transition-all duration-500 ring-1 ring-white/10 hover:ring-[#3CB7FF]/50 hover:shadow-[0_0_30px_rgba(60,183,255,0.15)]"
              >
                <img
                  src={video.thumb}
                  alt={video.titulo}
                  className="w-full h-full object-cover object-center grayscale-[0.2] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

                <div className="absolute inset-0 flex items-center justify-center transition-all duration-500">
                  <div className="w-16 h-16 rounded-full bg-[#3CB7FF]/90 backdrop-blur-sm flex items-center justify-center shadow-2xl transform scale-90 group-hover:scale-110 transition-transform duration-500">
                    <Play className="w-7 h-7 text-white fill-current ml-1" />
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-white font-bold text-[11px] md:text-xs lg:text-sm line-clamp-3 leading-tight drop-shadow-md">
                    {video.titulo}
                  </p>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-8 px-1">
        <button
          onClick={scrollPrev}
          className="w-11 h-11 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-white/40 hover:text-[#3CB7FF] hover:border-[#3CB7FF] hover:bg-[#3CB7FF]/5 transition-all duration-300 active:scale-90 shadow-lg"
          aria-label="Anterior"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={scrollNext}
          className="w-11 h-11 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-white/40 hover:text-[#3CB7FF] hover:border-[#3CB7FF] hover:bg-[#3CB7FF]/5 transition-all duration-300 active:scale-90 shadow-lg"
          aria-label="Siguiente"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
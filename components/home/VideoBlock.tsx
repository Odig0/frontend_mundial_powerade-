'use client'

import React, { useState } from 'react'
import { Play } from 'lucide-react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from '@/components/ui/dialog'

// MOCK DE VIDEOS
// Para usar la playlist real (PLJAKG8_ySbFAkKoB0JbTDM8uwkikHwLU4), 
// necesitarás consultar la API de YouTube Data v3 y reemplazar estos datos.
const MOCK_VIDEOS = [
  { id: '1', ytId: 'jNQXAC9IVRw', title: 'Me at the zoo' },
  { id: '2', ytId: 'dQw4w9WgXcQ', title: 'Never Gonna Give You Up' },
  { id: '3', ytId: 'tpeZaZMtIvM', title: 'Blur - Song 2' },
  { id: '4', ytId: '3JZ_D3ELwOQ', title: 'Linkin Park - Numb' },
  { id: '5', ytId: 'L_jWHffIx5E', title: 'Smash Mouth - All Star' },
  { id: '6', ytId: 'fJ9rUzIMcZQ', title: 'Queen - Bohemian Rhapsody' },
]

export default function VideoBlock() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null)

  return (
    <section className="py-16 bg-zinc-950 text-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-black uppercase tracking-widest text-white border-l-4 border-blue-600 pl-4">
            Videos
          </h2>
        </div>

        <Carousel
          opts={{
            align: 'start',
            loop: false,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {MOCK_VIDEOS.map((video) => (
              <CarouselItem key={video.id} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <Dialog onOpenChange={(open) => !open && setActiveVideo(null)}>
                  <DialogTrigger asChild>
                    <div 
                      className="group relative cursor-pointer overflow-hidden rounded-xl aspect-video bg-zinc-900 border border-zinc-800 transition-all hover:border-blue-600 hover:shadow-lg hover:shadow-blue-600/20"
                      onClick={() => setActiveVideo(video.ytId)}
                    >
                      <img
                        src={`https://img.youtube.com/vi/${video.ytId}/maxresdefault.jpg`}
                        alt={video.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                        onError={(e) => {
                          // Fallback si maxresdefault no está disponible
                          (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${video.ytId}/hqdefault.jpg`
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/10 transition-colors duration-500">
                        <div className="w-16 h-16 rounded-full bg-blue-600/90 flex items-center justify-center backdrop-blur-sm scale-90 group-hover:scale-110 transition-transform duration-500 shadow-2xl">
                          <Play className="w-8 h-8 text-white fill-white ml-1" />
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                        <h3 className="text-white font-semibold line-clamp-2 text-sm md:text-base group-hover:text-blue-400 transition-colors">
                          {video.title}
                        </h3>
                      </div>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-4xl w-[95vw] p-0 bg-black border-zinc-800 overflow-hidden rounded-xl">
                    <DialogTitle className="sr-only">Reproductor de Video: {video.title}</DialogTitle>
                    <div className="aspect-video w-full bg-black relative">
                      {activeVideo === video.ytId ? (
                        <iframe
                          width="100%"
                          height="100%"
                          src={`https://www.youtube.com/embed/${video.ytId}?autoplay=1&rel=0`}
                          title="YouTube video player"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          className="w-full h-full absolute top-0 left-0"
                        ></iframe>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-zinc-500">Cargando reproductor...</span>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          <div className="flex justify-end gap-2 mt-6">
            <CarouselPrevious className="static translate-x-0 translate-y-0 bg-zinc-900 border-zinc-800 text-white hover:bg-blue-600 hover:text-white hover:border-blue-600 size-10" />
            <CarouselNext className="static translate-x-0 translate-y-0 bg-zinc-900 border-zinc-800 text-white hover:bg-blue-600 hover:text-white hover:border-blue-600 size-10" />
          </div>
        </Carousel>
      </div>
    </section>
  )
}

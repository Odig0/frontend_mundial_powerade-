'use client'

import { useState } from 'react'
import { Share2, X, Facebook, Twitter, MessageCircle } from 'lucide-react'
import { toast } from 'sonner'

interface ShareVideoButtonProps {
  videoId: string
  videoTitle: string
  embedUrl?: string
  shareUrl?: string
}

const BASE_URL = process.env.NEXT_PUBLIC_NEWS_BASE_URL || 'https://dev.eldeber.bo/'
const VIDEOS_PAGE_URL = `${BASE_URL}/videos`

export default function ShareVideoButton({ videoId, videoTitle, embedUrl, shareUrl }: ShareVideoButtonProps) {
  const [open, setOpen] = useState(false)

  // Extrae el ID dinámicamente del shareUrl de Dailymotion
  // shareUrl típicamente es: https://dai.ly/x91agqs
  // embedUrl típicamente es: https://www.dailymotion.com/embed/video/x91agqs
  const extractVideoId = (url?: string): string => {
    if (!url) return videoId
    try {
      const parsed = new URL(url)
      const queryVideoId = parsed.searchParams.get('video')
      if (queryVideoId) return queryVideoId

      const cleanPath = parsed.pathname.split('/').filter(Boolean)
      const lastSegment = cleanPath[cleanPath.length - 1]
      if (lastSegment && lastSegment !== 'player.html') return lastSegment
    } catch {
      // Fallback para urls no absolutas o formatos inesperados
      const raw = url.split('#')[0]
      const query = raw.split('?')[1]
      if (query) {
        const params = new URLSearchParams(query)
        const queryVideoId = params.get('video')
        if (queryVideoId) return queryVideoId
      }

      const pathPart = raw.split('?')[0]
      const parts = pathPart.split('/').filter(Boolean)
      const lastSegment = parts[parts.length - 1]
      if (lastSegment && lastSegment !== 'player.html') return lastSegment
    }

    return videoId
  }

  const dynamicVideoId = extractVideoId(shareUrl) || extractVideoId(embedUrl) || videoId

  const shareData = {
    title: videoTitle,
    text: `Mira este video: ${videoTitle}`,
    url: `${VIDEOS_PAGE_URL}?video=${dynamicVideoId}`,
  }

  const handleShareFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`
    window.open(url, '_blank', 'width=600,height=400')
  }

  const handleShareTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareData.url)}`
    window.open(url, '_blank', 'width=600,height=400')
  }

  const handleShareWhatsApp = () => {
    const message = `${shareData.text}\n${shareData.url}`
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  const handleShareLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(shareData.url).then(() => {
        toast.success('Enlace copiado al portapapeles', {
          duration: 3000,
        })
        setOpen(false)
      }).catch(() => {
        toast.error('Error al copiar el enlace')
      })
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-1.5 bg-[#3CB7FF]/10 hover:bg-[#3CB7FF] text-[#3CB7FF] hover:text-white rounded-full transition-all border border-[#3CB7FF]/30 hover:border-[#3CB7FF] shrink-0"
        title="Compartir video"
      >
        <Share2 className="w-5 h-5" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-[#0d1f3c] border border-[#1a2f4d] rounded-xl w-full max-w-sm p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-white text-lg">Compartir video</h3>
              <button
                onClick={() => setOpen(false)}
                className="text-muted-foreground hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-muted-foreground mb-6">{videoTitle}</p>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleShareFacebook}
                className="flex items-center justify-center gap-2 bg-[#1877f2] hover:bg-[#165fd2] text-white font-bold py-3 rounded-lg transition-colors"
              >
                <Facebook className="w-5 h-5" />
                Compartir en Facebook
              </button>

              <button
                onClick={handleShareTwitter}
                className="flex items-center justify-center gap-2 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white font-bold py-3 rounded-lg transition-colors"
              >
                <Twitter className="w-5 h-5" />
                Compartir en Twitter/X
              </button>

              <button
                onClick={handleShareWhatsApp}
                className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba58] text-white font-bold py-3 rounded-lg transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                Compartir en WhatsApp
              </button>

              <button
                onClick={handleShareLink}
                className="flex items-center justify-center gap-2 bg-[#3CB7FF] hover:bg-[#2fa1e0] text-white font-bold py-3 rounded-lg transition-colors"
              >
                <Share2 className="w-5 h-5" />
                Copiar enlace
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

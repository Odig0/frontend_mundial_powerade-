"use client"

import { XIcon } from "lucide-react"
import * as DialogPrimitive from "@radix-ui/react-dialog"

interface VideoModalProps {
  videoId: string | null
  isOpen: boolean
  onClose: () => void
}

/**
 * Modal Cinemático Restaurado.
 * Enfocado en la inmersión visual y estética premium.
 */
export default function VideoModal({ videoId, isOpen, onClose }: VideoModalProps) {
  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        <DialogPrimitive.Content
          className="fixed left-1/2 top-1/2 z-[101] w-full max-w-md
                     -translate-x-1/2 -translate-y-1/2 px-4
                     data-[state=open]:animate-in data-[state=closed]:animate-out
                     data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
                     data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95
                     duration-400 ease-out focus:outline-none"
        >
          <DialogPrimitive.Title className="sr-only">
            Reproductor de Video Short
          </DialogPrimitive.Title>

          <div className="relative">
            <div className="relative aspect-[9/16] bg-black rounded-3xl overflow-hidden ring-1 ring-white/10 shadow-[0_0_60px_rgba(60,183,255,0.15)]">
              {videoId && (
                <iframe
                  key={videoId}
                  src={`https://www.dailymotion.com/embed/video/${videoId}?autoplay=1&queue-autoplay-next=0&ui-logo=0&ui-startscreen-info=0`}
                  className="absolute inset-0 w-full h-full border-0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  title="Reproductor Short Premium"
                />
              )}
            </div>

            <DialogPrimitive.Close
              aria-label="Cerrar video"
              onClick={onClose}
              className="absolute -top-4 -right-2 sm:-right-4 z-10
                         w-10 h-10 rounded-full
                         bg-[#3CB7FF] text-white
                         flex items-center justify-center
                         shadow-lg hover:scale-110 active:scale-95
                         transition-all duration-300"
            >
              <XIcon className="w-5 h-5" strokeWidth={3} />
            </DialogPrimitive.Close>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

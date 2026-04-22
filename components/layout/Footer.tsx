'use client'

import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-[#060e1c] border-t border-border py-6 mt-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-8 md:gap-16 mb-4">
          <div className="relative h-8 w-24">
            <Image src="/eldeber.png" alt="El Deber" fill className="object-contain" />
          </div>
          <div className="relative h-8 w-28">
            <Image src="/tribuna_powerade.png" alt="Powerade" fill className="object-contain" />
          </div>
          <div className="relative h-8 w-20">
            <Image src="/diez.png" alt="Diez" fill className="object-contain" />
          </div>
        </div>
        <div className="border-t border-border pt-4 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} El Deber. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}

'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-4 py-4 md:gap-8">

          {/* Logo a la izquierda */}
          <div className="relative h-16 w-48">
            <Image
              src="/eldeber.png"
              alt="Logo secundario"
              fill
              className="object-contain"
            />
          </div>

          {/* Logo al centro (si tu logo central también es imagen) */}
          <Link href="/" className="relative h-16 w-48 flex-1 flex justify-center">
            <Image
              src="/tribuna_powerade.png"
              alt="Powerade Principal"
              fill
              className="object-contain"
            />
          </Link>

          {/* Logo a la derecha (si lo hubiere) */}
          <div className="relative h-16 w-48">
            <Image
              src="/diez.png"
              alt="Logo secundario"
              fill
              className="object-contain"
            />
          </div>

        </div>
      </div>
    </header>
  )
}

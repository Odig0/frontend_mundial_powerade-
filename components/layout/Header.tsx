'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  return (
    <header className="bg-[#060e1c] border-b-2 border-accent">
      <div className="container max-w-[1200px] mx-auto px-4">
        <div className="flex items-center justify-between gap-4 py-3 md:gap-8">

          <div className="relative h-10 w-32 md:h-12 md:w-40">
            <Image
              src="/eldeber.png"
              alt="El Deber"
              fill
              className="object-contain object-left"
            />
          </div>

          <Link href="/" className="relative h-12 w-56 md:h-16 md:w-72 flex-1 flex justify-center">
            <Image
              src="/tribuna_powerade.png"
              alt="Tribuna Powerade"
              fill
              className="object-contain"
            />
          </Link>

          <div className="relative h-10 w-24 md:h-12 md:w-32">
            <Image
              src="/diez.png"
              alt="Diez"
              fill
              className="object-contain object-right"
            />
          </div>

        </div>
      </div>
    </header>
  )
}

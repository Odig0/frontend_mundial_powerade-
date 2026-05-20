'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  return (
    <header className="border-b-2 border-white/30 bg-black">
      <div className="container max-w-[1200px] mx-auto bg-black px-4">
        <div className="flex items-center justify-between gap-4 bg-black py-3 md:gap-8">

          <div className="relative h-10 w-32 bg-black md:h-12 md:w-40">
            <Image
              src="/eldeber.png"
              alt="El Deber"
              fill
              className="object-contain object-left"
            />
          </div>

          <Link href="/" className="relative flex h-12 w-56 flex-1 justify-center bg-black md:h-16 md:w-72">
            <Image
              src="/logo_powerade.png"
              alt="Powerade"
              fill
              className="object-contain"
            />
          </Link>

          <div className="relative h-10 w-24 bg-black md:h-12 md:w-32">
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

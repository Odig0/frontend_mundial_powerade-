"use client"

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import type { MouseEvent } from 'react'

const links = [
  { label: 'Últimas', href: '/' },
  { label: 'Partidos', href: '/#partidos' },
  { label: 'Fuera de juego', href: '/fueradejuego' },
  { label: 'Opinión', href: '/opinion' },
  { label: 'Videos', href: '/#videos' },
]

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()

  function handleUltimasClick(e: MouseEvent<HTMLAnchorElement>) {
    // If we're already on home, just scroll to top smoothly.
    if (pathname === '/') {
      e.preventDefault()
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
      return
    }

    // If on other page, navigate to home.
    e.preventDefault()
    router.push('/')
  }

  return (
    <nav className="bg-[#0a1525] border-b border-border sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center overflow-x-auto">
          {links.map((link, i) => (
            <div key={link.href} className="flex items-center">
              {i > 0 && <span className="text-white/30 text-sm select-none px-1">|</span>}
              <Link
                href={link.href}
                onClick={link.href === '/' ? handleUltimasClick : undefined}
                className="py-3 px-3 text-sm font-semibold text-white hover:text-accent transition-colors whitespace-nowrap"
              >
                {link.label}
              </Link>
            </div>
          ))}
          <span className="text-white/30 text-sm select-none px-1">|</span>
          <Link
            href="/mundial"
            className="my-2 ml-2 px-4 py-1.5 bg-accent text-accent-foreground text-sm font-bold rounded whitespace-nowrap hover:opacity-90 transition-opacity"
          >
            Seguí el mundial
          </Link>
        </div>
      </div>
    </nav>
  )
}

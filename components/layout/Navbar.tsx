<<<<<<< HEAD
"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

=======
import Link from 'next/link'

>>>>>>> 5598182e2d3f2b96aa7fcc21171c1bd70465f5a9
const links = [
  { label: 'Últimas', href: '/' },
  { label: 'Partidos', href: '/partidos' },
  { label: 'Selecciones', href: '/selecciones' },
<<<<<<< HEAD
  { label: 'Videos', href: '/videos' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  // Evitar scroll del body cuando el menú está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])
=======
  { label: 'Opinión', href: '/opinion' },
  { label: 'Videos', href: '/videos' },
]
>>>>>>> 5598182e2d3f2b96aa7fcc21171c1bd70465f5a9

export default function Navbar() {
  return (
<<<<<<< HEAD
    <nav className="bg-[#0a1525] border-b border-white/5 sticky top-0 z-50 h-14">
      <div className="container mx-auto h-full px-4">
        <div className="flex items-center justify-between md:justify-center h-full">
          
          {/* --- DESKTOP VIEW --- */}
          <div className="hidden md:flex items-center">
            {links.map((link, i) => (
              <div key={link.href} className="flex items-center">
                {i > 0 && <span className="text-white/20 text-xs select-none px-1">|</span>}
                <Link
                  href={link.href}
                  className="py-3 px-4 text-sm font-semibold text-white/80 hover:text-[#3CB7FF] transition-colors whitespace-nowrap"
                >
                  {link.label}
                </Link>
              </div>
            ))}
            <span className="text-white/20 text-xs select-none px-1">|</span>
            <Link
              href="/mundial"
              className="ml-4 px-5 py-1.5 bg-[#3CB7FF] text-white text-xs font-bold rounded-full whitespace-nowrap hover:bg-[#3CB7FF]/90 transition-all shadow-lg shadow-[#3CB7FF]/20"
            >
              Seguí el mundial
            </Link>
          </div>

          {/* --- MOBILE VIEW (Hamburguesa con mejora de UX) --- */}
          <div className="flex md:hidden w-full justify-end items-center h-full">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="relative z-[60] p-2 text-white/80 hover:text-white transition-all duration-300 transform active:scale-90"
              aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
            >
              <div className="relative w-7 h-7">
                <X className={cn(
                  "absolute inset-0 transition-all duration-300 transform",
                  isOpen ? "rotate-0 opacity-100 scale-100" : "rotate-90 opacity-0 scale-50"
                )} size={28} />
                <Menu className={cn(
                  "absolute inset-0 transition-all duration-300 transform",
                  isOpen ? "-rotate-90 opacity-0 scale-50" : "rotate-0 opacity-100 scale-100"
                )} size={28} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* --- MOBILE DROPDOWN MENU (Mejorado) --- */}
      <div
        className={cn(
          "fixed inset-0 bg-[#0a1525] z-50 transition-all duration-500 md:hidden",
          isOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"
        )}
      >
        <div className="flex flex-col h-full pt-20 px-8 gap-1">
          {links.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "py-4 text-xl font-bold text-white border-b border-white/5 hover:text-[#3CB7FF] transition-all duration-300",
                isOpen ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"
              )}
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              {link.label}
            </Link>
          ))}
          
          <div className={cn(
            "mt-8 transition-all duration-500",
            isOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          )} style={{ transitionDelay: '300ms' }}>
            <Link
              href="/mundial"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center py-4 bg-[#3CB7FF] text-white text-lg font-bold rounded-xl shadow-xl shadow-[#3CB7FF]/20"
            >
              Seguí el mundial
            </Link>
          </div>
=======
    <nav className="bg-[#0a1525] border-b border-border sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center overflow-x-auto">
          {links.map((link, i) => (
            <div key={link.href} className="flex items-center">
              {i > 0 && <span className="text-white/30 text-sm select-none px-1">|</span>}
              <Link
                href={link.href}
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
>>>>>>> 5598182e2d3f2b96aa7fcc21171c1bd70465f5a9
        </div>
      </div>
    </nav>
  )
}



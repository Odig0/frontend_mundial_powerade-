"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const links = [
  { label: 'Últimas', href: '/' },
  { label: 'Partidos', href: '/partidos' },
  { label: 'Selecciones', href: '/selecciones' },
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

  return (
    <nav className="bg-[#0a1525] border-b border-white/5 sticky top-0 z-50 h-14">
      <div className="container max-w-[1200px] mx-auto h-full px-4">
        <div className="flex items-center justify-between md:justify-center h-full">

          {/* DESKTOP */}
          <div className="hidden md:flex items-center">
            {links.map((link, i) => (
              <div key={link.href} className="flex items-center">
                {i > 0 && <span className="text-white/20 text-xs px-1">|</span>}
                <Link
                  href={link.href}
                  className="py-3 px-4 text-sm font-semibold text-white/80 hover:text-[#3CB7FF] transition-colors"
                >
                  {link.label}
                </Link>
              </div>
            ))}

            <span className="text-white/20 text-xs px-1">|</span>

            <Link
              href="/mundial"
              className="ml-4 px-5 py-1.5 bg-[#3CB7FF] text-white text-xs font-bold rounded-full hover:bg-[#3CB7FF]/90 transition-all shadow-lg shadow-[#3CB7FF]/20"
            >
              Seguí el mundial
            </Link>
          </div>

          {/* MOBILE BUTTON (Prioridad Z-Index para visibilidad de X) */}
          <div className="flex md:hidden w-full justify-end items-center h-full">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="relative z-[70] p-2 text-white/80 hover:text-white transition-all active:scale-90"
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

      {/* MOBILE MENU (Capa inferior al botón) */}
      <div className={cn(
        "fixed inset-0 bg-[#0a1525] z-[60] transition-all duration-500 md:hidden",
        isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      )}>
        <div className="flex flex-col h-full pt-24 px-8 gap-2">
          {links.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "py-4 text-2xl font-bold text-white border-b border-white/5 hover:text-[#3CB7FF] transition-all duration-300",
                isOpen ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"
              )}
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/mundial"
            onClick={() => setIsOpen(false)}
            className={cn(
              "mt-10 text-center py-5 bg-[#3CB7FF] rounded-2xl text-white text-xl font-bold shadow-xl shadow-[#3CB7FF]/20 transition-all duration-500",
              isOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            )}
            style={{ transitionDelay: '250ms' }}
          >
            Seguí el mundial
          </Link>
        </div>
      </div>
    </nav>
  )
}
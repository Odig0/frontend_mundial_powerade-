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
      <div className="container mx-auto h-full px-4">
        <div className="flex items-center justify-between md:justify-center h-full">

          {/* DESKTOP */}
          <div className="hidden md:flex items-center">
            {links.map((link, i) => (
              <div key={link.href} className="flex items-center">
                {i > 0 && <span className="text-white/20 text-xs px-1">|</span>}
                <Link
                  href={link.href}
                  className="py-3 px-4 text-sm font-semibold text-white/80 hover:text-[#3CB7FF]"
                >
                  {link.label}
                </Link>
              </div>
            ))}

            <span className="text-white/20 text-xs px-1">|</span>

            <Link
              href="/mundial"
              className="ml-4 px-5 py-1.5 bg-[#3CB7FF] text-white text-xs font-bold rounded-full hover:bg-[#3CB7FF]/90"
            >
              Seguí el mundial
            </Link>
          </div>

          {/* MOBILE BUTTON */}
          <div className="flex md:hidden w-full justify-end">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div className={cn(
        "fixed inset-0 bg-[#0a1525] z-50 transition-all md:hidden",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex flex-col pt-20 px-8 gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-xl font-bold text-white"
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/mundial"
            onClick={() => setIsOpen(false)}
            className="mt-6 text-center py-3 bg-[#3CB7FF] rounded-xl text-white font-bold"
          >
            Seguí el mundial
          </Link>
        </div>
      </div>
    </nav>
  )
}
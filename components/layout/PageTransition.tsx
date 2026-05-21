'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Forzar opacity 0 y animar a 1
    el.style.opacity = '0'
    el.style.transform = 'translateY(6px)'

    const raf = requestAnimationFrame(() => {
      el.style.transition = 'opacity 280ms ease, transform 280ms ease'
      el.style.opacity = '1'
      el.style.transform = 'translateY(0)'
    })

    return () => cancelAnimationFrame(raf)
  }, [pathname])

  return (
    <div ref={ref} style={{ opacity: 0 }}>
      {children}
    </div>
  )
}

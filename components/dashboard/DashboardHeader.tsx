'use client'

import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'

export default function DashboardHeader() {
  const pathname = usePathname()

  const getTitle = () => {
    if (pathname.includes('/noticias')) return 'Dashboard de Noticias'
    if (pathname.includes('/generador')) return 'Generador'
    if (pathname.includes('/publicaciones')) return 'Publicadas'
    return 'Dashboard'
  }

  return (
    <header className="db-header" style={{ position: 'sticky', top: 0, zIndex: 10 }}>
      {/* Left: trigger + title */}
      <div className="db-header-left">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-6 opacity-20" />
        <h1 className="db-header-title">{getTitle()}</h1>
      </div>

      {/* Center: logo */}
      <div className="db-header-logo-center">
        <div style={{ position: 'relative', width: 160, height: 44 }}>
          <Image
            src="/logo_powerade.png"
            alt="Powerade"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Right: spacer to balance left */}
      <div className="db-header-right" />
    </header>
  )
}

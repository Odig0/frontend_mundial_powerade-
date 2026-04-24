'use client'

import { usePathname } from 'next/navigation'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'

export default function DashboardHeader() {
  const pathname = usePathname()

  const getTitle = () => {
    if (pathname.includes('/noticias')) return 'Noticias'
    if (pathname.includes('/generador')) return 'Generador'
    if (pathname.includes('/publicaciones')) return 'Publicadas'
    return 'Dashboard'
  }

  return (
    <header className="sticky top-0 z-10 flex items-center gap-4 border-b border-border bg-card px-6 py-3">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-6" />
      <h1 className="text-lg font-semibold text-foreground">{getTitle()}</h1>
    </header>
  )
}

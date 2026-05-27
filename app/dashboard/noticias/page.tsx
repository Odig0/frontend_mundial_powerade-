import { Suspense } from 'react'
import { getNewsWithFallback } from '@/lib/news-service'
import NoticiasGrid from '@/components/dashboard/NoticiasGrid'
import { Skeleton } from '@/components/ui/skeleton'

const DASHBOARD_SECTIONS = new Set(['mundial-2026', 'fuera-de-juego'])

function belongsToDashboardSection(sections: string[] | undefined) {
  return (sections ?? []).some((section) => DASHBOARD_SECTIONS.has(section.trim().toLowerCase()))
}

async function NoticiasContent() {
  const news = await getNewsWithFallback()
  const filteredNews = news.filter(
    (item) => item.imagen_home?.trim() && belongsToDashboardSection(item.secciones)
  )
  // Put portada positions 1..5 first (ordered), then the rest
  const positioned = filteredNews
    .filter((n) => typeof (n as any).posicion_portada === 'number' && Number.isFinite((n as any).posicion_portada) && (n as any).posicion_portada >= 1 && (n as any).posicion_portada <= 5)
    .slice()
    .sort((a, b) => ((a as any).posicion_portada || 0) - ((b as any).posicion_portada || 0))

  const rest = filteredNews.filter((n) => !positioned.find((p) => p._id === n._id))

  const ordered = [...positioned, ...rest]

  return <NoticiasGrid news={ordered} />
}

function NoticiasLoading() {
  return (
    <div className="space-y-4 p-6">
      <div className="flex gap-4 flex-wrap">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-40" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function NoticiasPage() {
  return (
    <Suspense fallback={<NoticiasLoading />}>
      <NoticiasContent />
    </Suspense>
  )
}

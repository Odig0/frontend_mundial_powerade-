import { Suspense } from 'react'
import { getNews } from '@/lib/api'
import NoticiasGrid from '@/components/dashboard/NoticiasGrid'
import { Skeleton } from '@/components/ui/skeleton'

async function NoticiasContent() {
  const news = await getNews()
  const filteredNews = news.filter((item) => item.imagen_home?.trim())
  return <NoticiasGrid news={filteredNews} />
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

import { Suspense } from 'react'
import { getNews } from '@/lib/api'
import GeneradorPanel from '@/components/dashboard/GeneradorPanel'
import { Skeleton } from '@/components/ui/skeleton'

async function GeneradorContent() {
  const news = await getNews()
  const filteredNews = news.filter((item) => item.imagen_home?.trim())
  return <GeneradorPanel news={filteredNews} />
}

function GeneradorLoading() {
  return (
    <div className="space-y-6 p-6">
      <div className="max-w-2xl space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-full" />
      </div>
      <Skeleton className="h-96 w-full rounded-lg" />
    </div>
  )
}

export default function GeneradorPage() {
  return (
    <Suspense fallback={<GeneradorLoading />}>
      <GeneradorContent />
    </Suspense>
  )
}

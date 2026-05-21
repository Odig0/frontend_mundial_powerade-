import Header from '@/components/layout/Header'
import Navbar from '@/components/layout/Navbar'

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--brand-color)' }}>
      {/* Header real — se ve inmediatamente */}
      <Header />

      {/* Navbar real — sticky y visible de inmediato */}
      <Navbar />

      {/* Skeleton del contenido */}
      <main className="flex-1 w-full max-w-[1900px] mx-auto">
        {/* Top banner skeleton */}
        <div className="w-full flex justify-center py-2 px-4">
          <div className="h-[90px] w-full max-w-[970px] rounded-lg bg-white/5 animate-pulse" />
        </div>

        <div className="flex justify-center w-full gap-4 px-4">
          {/* Ad izquierdo skeleton */}
          <div className="hidden xl:block w-[160px] shrink-0">
            <div className="h-[600px] w-[160px] rounded-lg bg-white/5 animate-pulse" />
          </div>

          {/* Contenido principal skeleton */}
          <div className="flex-1 max-w-[1200px] min-w-0 py-8 space-y-8">
            {/* Encabezado de sección */}
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div className="space-y-3">
                <div className="h-3 w-28 rounded-full bg-white/10 animate-pulse" />
                <div className="h-10 w-80 max-w-full rounded-xl bg-white/10 animate-pulse" />
              </div>
              <div className="h-9 w-44 rounded-full bg-white/10 animate-pulse" />
            </div>

            {/* Hero grid skeleton */}
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="lg:col-span-2 h-[22rem] rounded-2xl bg-white/5 animate-pulse" />
              <div className="grid gap-4">
                <div className="h-[10.5rem] rounded-2xl bg-white/5 animate-pulse" />
                <div className="h-[10.5rem] rounded-2xl bg-white/5 animate-pulse" />
              </div>
            </div>

            {/* Cards grid skeleton */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <div
                    className="aspect-video rounded-xl bg-white/5 animate-pulse"
                    style={{ animationDelay: `${i * 60}ms` }}
                  />
                  <div
                    className="h-4 w-5/6 rounded-full bg-white/5 animate-pulse"
                    style={{ animationDelay: `${i * 60 + 30}ms` }}
                  />
                  <div
                    className="h-3 w-2/3 rounded-full bg-white/5 animate-pulse"
                    style={{ animationDelay: `${i * 60 + 60}ms` }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Ad derecho skeleton */}
          <div className="hidden xl:block w-[160px] shrink-0">
            <div className="h-[600px] w-[160px] rounded-lg bg-white/5 animate-pulse" />
          </div>
        </div>
      </main>
    </div>
  )
}
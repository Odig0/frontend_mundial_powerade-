export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="h-24 border-b border-border bg-card/80" />
      <div className="h-14 border-b border-border bg-secondary/80" />

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12 space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <div className="h-4 w-40 rounded-full bg-muted animate-pulse" />
            <div className="h-12 w-96 max-w-full rounded-2xl bg-muted animate-pulse" />
          </div>
          <div className="h-10 w-48 rounded-full bg-muted animate-pulse" />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 h-[22rem] rounded-2xl bg-muted animate-pulse" />
          <div className="grid gap-4">
            <div className="h-40 rounded-2xl bg-muted animate-pulse" />
            <div className="h-40 rounded-2xl bg-muted animate-pulse" />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="space-y-3">
              <div className="aspect-video rounded-2xl bg-muted animate-pulse" />
              <div className="h-5 w-5/6 rounded-full bg-muted animate-pulse" />
              <div className="h-4 w-2/3 rounded-full bg-muted animate-pulse" />
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
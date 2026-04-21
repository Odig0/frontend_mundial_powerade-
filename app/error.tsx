'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <div className="max-w-lg rounded-2xl border border-border bg-card p-8 text-center shadow-xl">
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Error</p>
        <h1 className="mt-3 text-3xl font-black">No se pudo cargar la noticia</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {error.message || 'Intenta de nuevo en unos segundos.'}
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Reintentar
        </button>
      </div>
    </div>
  )
}
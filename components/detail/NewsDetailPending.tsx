'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/layout/Header'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

interface NewsDetailPendingProps {
  seccion: string
  link: string
}

export default function NewsDetailPending({ seccion, link }: NewsDetailPendingProps) {
  const router = useRouter()

  useEffect(() => {
    const timer = window.setInterval(() => {
      router.refresh()
    }, 3000)

    return () => window.clearInterval(timer)
  }, [router])

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#000000' }}>
      <Header />
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-white/5 px-6 py-10 text-center shadow-2xl shadow-black/30 backdrop-blur-sm md:px-10">
          <p className="text-xs uppercase tracking-[0.35em] text-white/50">Actualizando noticia</p>
          <h1 className="mt-4 text-3xl font-black text-white md:text-4xl">
            Esta nota todavía se está sincronizando.
          </h1>
          <p className="mt-4 text-sm leading-6 text-white/70 md:text-base">
            Estamos esperando a que la noticia esté disponible para abrirla sin mostrar un 404.
            La página se reintentará sola en unos segundos.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => router.refresh()}
              className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-bold text-black transition hover:bg-white/90"
            >
              Reintentar ahora
            </button>
            <div className="text-xs text-white/45">
              Ruta: /{seccion}/{link}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
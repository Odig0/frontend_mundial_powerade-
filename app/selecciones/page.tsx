import Header from '@/components/layout/Header'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Image from 'next/image'

export const metadata = {
  title: 'Selecciones - El Deber Deportes',
  description: 'Galería de selecciones con imágenes destacadas',
}

const selecciones = [
  { id: 1, src: '/selecciones/1.webp', alt: 'Selección 1' },
  { id: 2, src: '/selecciones/2.webp', alt: 'Selección 2' },
  { id: 3, src: '/selecciones/3.webp', alt: 'Selección 3' },
  { id: 4, src: '/selecciones/4.jpg', alt: 'Selección 4' },
]

export default function SeleccionesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="mb-8 md:mb-10">
          <p className="text-[#3CB7FF] font-semibold uppercase tracking-[0.35em] text-xs mb-3">
            Secciones
          </p>
          <h1 className="text-3xl md:text-5xl font-black text-foreground leading-tight">
            Selecciones
          </h1>
          <p className="mt-3 max-w-2xl text-sm md:text-base text-muted-foreground">
            Una galería con las imágenes disponibles en la carpeta pública para destacar a las selecciones.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {selecciones.map((seleccion) => (
            <article
              key={seleccion.id}
              className="group overflow-hidden rounded-3xl border border-white/8 bg-card shadow-lg shadow-black/20 transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <Image
                  src={seleccion.src}
                  alt={seleccion.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  priority={seleccion.id === 1}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
                <div className="absolute left-4 top-4 rounded-full bg-[#3CB7FF] px-3 py-1 text-xs font-black uppercase text-white shadow-lg shadow-[#3CB7FF]/30">
                  {seleccion.id}
                </div>
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <h2 className="text-xl font-black uppercase tracking-tight text-white">
                    Selección {seleccion.id}
                  </h2>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}

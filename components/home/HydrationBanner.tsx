import Link from 'next/link'

export default function HydrationBanner() {
  return (
    <div className="relative overflow-hidden bg-card h-full flex flex-col justify-center min-h-[200px]">
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-10" />
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: "url('https://cdn.diez.bo/diez/images/2025/04/15/robson-matheus.jpg')" }}
      />
      <div className="relative z-20 px-8 py-10">
        <p className="text-xs text-accent font-bold uppercase tracking-widest mb-2">Patrocinado</p>
        <h2 className="text-2xl md:text-3xl font-black text-white uppercase leading-tight mb-4">
          Pausa de<br />Hidratación
        </h2>
        <Link
          href="#"
          className="inline-block bg-accent text-accent-foreground px-5 py-2 text-sm font-bold rounded hover:opacity-90 transition-opacity"
        >
          Descubrí más
        </Link>
      </div>
    </div>
  )
}

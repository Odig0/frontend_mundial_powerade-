'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/layout/Header'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Image from 'next/image'
import { countries, countriesByGroup } from '@/data/fixtures'

export default function SeleccionesPage() {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<'all' | 'groups'>('all')

  const handleCountryClick = (countryName: string) => {
    if (countryName === 'Argentina') {
      router.push('/selecciones/jugadores')
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="mb-8 md:mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-[#3CB7FF] font-semibold uppercase tracking-[0.35em] text-xs mb-3">
              Secciones
            </p>
            <h1 className="text-3xl md:text-5xl font-black text-foreground leading-tight">
              Selecciones
            </h1>
            <p className="mt-3 max-w-2xl text-sm md:text-base text-muted-foreground">
              {viewMode === 'all' 
                ? `Las ${countries.length} selecciones participantes en el Mundial 2026.`
                : 'Los 12 grupos del Mundial 2026.'}
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => setViewMode('all')}
              className={`px-4 py-2 rounded-lg font-bold uppercase text-sm transition-all duration-300 ${
                viewMode === 'all'
                  ? 'bg-[#3CB7FF] text-white shadow-lg shadow-[#3CB7FF]/50'
                  : 'bg-white/10 text-foreground hover:bg-white/20'
              }`}
            >
              Vista General
            </button>
            <button
              onClick={() => setViewMode('groups')}
              className={`px-4 py-2 rounded-lg font-bold uppercase text-sm transition-all duration-300 ${
                viewMode === 'groups'
                  ? 'bg-[#3CB7FF] text-white shadow-lg shadow-[#3CB7FF]/50'
                  : 'bg-white/10 text-foreground hover:bg-white/20'
              }`}
            >
              Vista por Grupo
            </button>
          </div>
        </div>

        {/* Vista General */}
        {viewMode === 'all' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {countries.map((country, index) => (
              <article
                key={index}
                onClick={() => handleCountryClick(country.name)}
                className={`group overflow-hidden rounded-lg border border-white/8 bg-card shadow-lg shadow-black/20 transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#3CB7FF]/30 ${
                  country.name === 'Argentina' ? 'cursor-pointer' : ''
                }`}
              >
                <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-white/5 to-white/0 flex items-center justify-center p-4">
                  <Image
                    src={country.flag}
                    alt={country.name}
                    width={100}
                    height={100}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                </div>
                <div className="p-3">
                  <h2 className="text-sm font-bold uppercase tracking-tight text-foreground text-center truncate group-hover:text-[#3CB7FF] transition-colors">
                    {country.name}
                  </h2>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Vista por Grupo */}
        {viewMode === 'groups' && (
          <div className="space-y-12">
            {Object.entries(countriesByGroup).map(([group, groupCountries]) => (
              <div key={group}>
                <div className="mb-6 pb-4 border-b border-white/10">
                  <h2 className="text-2xl md:text-3xl font-black text-[#3CB7FF] uppercase tracking-wide">
                    Grupo {group}
                  </h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
                  {groupCountries.map((country, index) => (
                    <article
                      key={index}
                      onClick={() => handleCountryClick(country.name)}
                      className={`group overflow-hidden rounded-lg border border-white/8 bg-card shadow-lg shadow-black/20 transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#3CB7FF]/30 ${
                        country.name === 'Argentina' ? 'cursor-pointer' : ''
                      }`}
                    >
                      <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-white/5 to-white/0 flex items-center justify-center p-4">
                        <Image
                          src={country.flag}
                          alt={country.name}
                          width={100}
                          height={100}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      </div>
                      <div className="p-3">
                        <h3 className="text-sm font-bold uppercase tracking-tight text-foreground text-center truncate group-hover:text-[#3CB7FF] transition-colors">
                          {country.name}
                        </h3>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

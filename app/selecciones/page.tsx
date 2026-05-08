'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/layout/Header'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PageWrapper from '@/components/layout/PageWrapper'
import Image from 'next/image'
import { countries, countriesByGroup, getCountryGroupFixtures } from '@/data/fixtures'

export default function SeleccionesPage() {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<'all' | 'groups'>('all')

  const formatMatchDate = (date: string) => {
    const [year, month, day] = date.split('-')
    if (!year || !month || !day) {
      return date
    }

    return `${day}/${month}`
  }

  const handleCountryClick = (countryName: string) => {
    // if (countryName === 'Argentina') {
    //   router.push('/selecciones/jugadores')
    // }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Navbar />

      <PageWrapper>
        <main className="flex-1 py-8 md:py-12">
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
                className={`px-4 py-2 rounded-lg font-bold uppercase text-sm transition-all duration-300 ${viewMode === 'all'
                    ? 'bg-[#3CB7FF] text-white shadow-lg shadow-[#3CB7FF]/50'
                    : 'bg-white/10 text-foreground hover:bg-white/20'
                  }`}
              >
                Vista General
              </button>
              <button
                onClick={() => setViewMode('groups')}
                className={`px-4 py-2 rounded-lg font-bold uppercase text-sm transition-all duration-300 ${viewMode === 'groups'
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
              {countries.map((country, index) => {
                const countryFixtures = getCountryGroupFixtures(country.name)

                return (
                  <article
                    key={index}
                    onClick={() => handleCountryClick(country.name)}
                    className={`group overflow-hidden rounded-lg border border-white/8 bg-card shadow-lg shadow-black/20 transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#3CB7FF]/30`}
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

                      {countryFixtures && (
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-3.5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 bg-gradient-to-t from-black/95 via-black/88 to-transparent">
                          <p className="inline-flex items-center rounded-md border border-[#3CB7FF]/70 bg-black/80 px-2 py-1 text-sm font-bold uppercase tracking-wider text-white mb-2.5 shadow-[0_2px_10px_rgba(0,0,0,0.45)]">
                            Grupo {countryFixtures.group}
                          </p>
                          <div className="space-y-2">
                            {countryFixtures.matches.slice(0, 3).map((match, idx) => {
                              const isHome = match.homeTeam.name === country.name
                              const rivalTeam = isHome ? match.awayTeam : match.homeTeam
                              return (
                                <div key={`${match.date}-${match.time}-${idx}`} className="flex items-center gap-1 rounded-md bg-black/65 px-1.5 py-1 text-[12px] leading-tight text-white shadow-sm shadow-black/30 backdrop-blur-[2px]">
                                  <span className="shrink-0 w-[44px] text-[#EAF7FF] font-semibold tabular-nums">
                                    {formatMatchDate(match.date)}
                                  </span>
                                  <span className="shrink-0 font-bold text-[#3CB7FF]">vs</span>
                                  <Image
                                    src={rivalTeam.flag}
                                    alt={rivalTeam.name}
                                    width={16}
                                    height={16}
                                    className="shrink-0 w-4 h-4 rounded-[2px] object-cover"
                                  />
                                  <span className="min-w-0 flex-1 truncate font-semibold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                                    {rivalTeam.name}
                                  </span>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-3 pl-2.5">
                      <h2 className="text-sm font-bold uppercase tracking-tight text-foreground text-left truncate group-hover:text-[#3CB7FF] transition-colors">
                        {country.name}
                      </h2>
                    </div>
                  </article>
                )
              })}
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
                    {groupCountries.map((country, index) => {
                      const countryFixtures = getCountryGroupFixtures(country.name)

                      return (
                        <article
                          key={index}
                          onClick={() => handleCountryClick(country.name)}
                          className={`group overflow-hidden rounded-lg border border-white/8 bg-card shadow-lg shadow-black/20 transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#3CB7FF]/30`}
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

                            {countryFixtures && (
                              <div className="pointer-events-none absolute inset-x-0 bottom-0 p-3.5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 bg-gradient-to-t from-black/95 via-black/88 to-transparent">
                                <p className="inline-flex items-center rounded-md border border-[#3CB7FF]/70 bg-black/80 px-2 py-1 text-sm font-bold uppercase tracking-wider text-white mb-2.5 shadow-[0_2px_10px_rgba(0,0,0,0.45)]">
                                  Grupo {countryFixtures.group}
                                </p>
                                <div className="space-y-2">
                                  {countryFixtures.matches.slice(0, 3).map((match, idx) => {
                                    const isHome = match.homeTeam.name === country.name
                                    const rivalTeam = isHome ? match.awayTeam : match.homeTeam
                                    return (
                                      <div key={`${match.date}-${match.time}-${idx}`} className="flex items-center gap-1 rounded-md bg-black/65 px-1.5 py-1 text-[12px] leading-tight text-white shadow-sm shadow-black/30 backdrop-blur-[2px]">
                                        <span className="shrink-0 w-[44px] text-[#EAF7FF] font-semibold tabular-nums">
                                          {formatMatchDate(match.date)}
                                        </span>
                                        <span className="shrink-0 font-bold text-[#3CB7FF]">vs</span>
                                        <Image
                                          src={rivalTeam.flag}
                                          alt={rivalTeam.name}
                                          width={16}
                                          height={16}
                                          className="shrink-0 w-4 h-4 rounded-[2px] object-cover"
                                        />
                                        <span className="min-w-0 flex-1 truncate font-semibold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                                          {rivalTeam.name}
                                        </span>
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="p-3 pl-2.5">
                            <h3 className="text-sm font-bold uppercase tracking-tight text-foreground text-left truncate group-hover:text-[#3CB7FF] transition-colors">
                              {country.name}
                            </h3>
                          </div>
                        </article>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </PageWrapper>

      <Footer />
    </div>
  )
}

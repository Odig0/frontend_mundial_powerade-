'use client'

import { useEffect, useMemo, useState } from 'react'
import Header from '@/components/layout/Header'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PageWrapper from '@/components/layout/PageWrapper'
import { buildSectionTargeting } from '@/lib/adTargeting'
import Image from 'next/image'
import { countries, countriesByGroup, getCountryGroupFixtures } from '@/data/fixtures'
import PlayerCard from '@/components/selecciones/PlayerCard'
import { getCountryCode, type SeleccionPlayersResponse } from '@/lib/selecciones'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://dev.eldeber.bo/v1'

export default function SeleccionesPage() {
  const [viewMode, setViewMode] = useState<'all' | 'groups'>('all')
  const [selectedCountryName, setSelectedCountryName] = useState('Argentina')
  const [playersResponse, setPlayersResponse] = useState<SeleccionPlayersResponse | null>(null)
  const [playersLoading, setPlayersLoading] = useState(false)
  const [playersError, setPlayersError] = useState<string | null>(null)

  const getPositionOrder = (player: SeleccionPlayersResponse['jugadores'][number]) => {
    const positionCode = player.posicion?.codigo?.toLowerCase() ?? ''
    const positionName = player.posicion?.nombre?.toLowerCase() ?? ''

    if (positionCode.includes('forward') || positionCode.includes('attacker') || positionName.includes('delanter')) {
      return 0
    }

    if (positionCode.includes('midfielder') || positionName.includes('mediocamp')) {
      return 1
    }

    if (positionCode.includes('defender') || positionName.includes('defens')) {
      return 2
    }

    if (positionCode.includes('goalkeeper') || positionName.includes('porter')) {
      return 3
    }

    return 4
  }

  const selectedCountry = useMemo(
    () => countries.find((country) => country.name === selectedCountryName) ?? countries[0],
    [selectedCountryName]
  )
  const selectedCountryCode = getCountryCode(selectedCountry?.name ?? '')

  const orderedPlayers = useMemo(() => {
    if (!playersResponse?.jugadores) {
      return []
    }

    return [...playersResponse.jugadores].sort((left, right) => {
      const leftOrder = getPositionOrder(left)
      const rightOrder = getPositionOrder(right)

      if (leftOrder !== rightOrder) {
        return leftOrder - rightOrder
      }

      const leftJersey = left.numero_playera ?? Number.POSITIVE_INFINITY
      const rightJersey = right.numero_playera ?? Number.POSITIVE_INFINITY

      if (leftJersey !== rightJersey) {
        return leftJersey - rightJersey
      }

      return (left.nombre_display || left.nombre || '').localeCompare(right.nombre_display || right.nombre || '', 'es')
    })
  }, [playersResponse])

  const formatMatchDate = (date: string) => {
    const [year, month, day] = date.split('-')
    if (!year || !month || !day) {
      return date
    }

    return `${day}/${month}`
  }

  useEffect(() => {
    if (!selectedCountryCode) {
      setPlayersResponse(null)
      setPlayersError('No encontramos el código de esta selección.')
      return
    }

    const abortController = new AbortController()

    async function loadPlayers() {
      try {
        setPlayersLoading(true)
        setPlayersError(null)

        const response = await fetch(`${API_BASE_URL}/mundial-2026/players/equipo/${selectedCountryCode}`, {
          signal: abortController.signal,
          cache: 'no-store',
        })

        if (!response.ok) {
          throw new Error(`No se pudieron cargar los jugadores de ${selectedCountryName}`)
        }

        const data = (await response.json()) as SeleccionPlayersResponse
        setPlayersResponse(data)
      } catch (error) {
        if ((error as Error).name === 'AbortError') {
          return
        }

        setPlayersResponse(null)
        setPlayersError('No se pudieron cargar los jugadores en este momento.')
      } finally {
        setPlayersLoading(false)
      }
    }

    loadPlayers()

    return () => {
      abortController.abort()
    }
  }, [selectedCountryCode, selectedCountryName])

  const handleCountryClick = (countryName: string) => {
    setSelectedCountryName(countryName)

    window.requestAnimationFrame(() => {
      const playersSection = document.getElementById('jugadores')
      if (playersSection) {
        playersSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    })
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#000000' }}>
      <Header />
      <Navbar />

      <PageWrapper targeting={buildSectionTargeting('selecciones')}>
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

          <section id="jugadores" className="mt-14 scroll-mt-24">
            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[#3CB7FF] font-semibold uppercase tracking-[0.35em] text-xs mb-3">
                  Plantilla
                </p>
                <h2 className="text-2xl md:text-3xl font-black text-foreground leading-tight">
                  {selectedCountry?.name}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {selectedCountryCode ? `Código: ${selectedCountryCode}` : 'Selecciona un país para ver sus jugadores.'}
                </p>
              </div>

              {playersResponse && (
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground">
                  <span className="font-bold text-[#3CB7FF]">{playersResponse.total_jugadores}</span> jugadores cargados
                </div>
              )}
            </div>

            {playersLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="h-[390px] animate-pulse rounded-2xl border border-white/10 bg-white/5" />
                ))}
              </div>
            ) : playersError ? (
              <div className="rounded-2xl border border-dashed border-white/10 bg-card px-6 py-10 text-center">
                <p className="text-lg font-semibold text-foreground">No pudimos cargar los jugadores</p>
                <p className="mt-2 text-sm text-muted-foreground">{playersError}</p>
              </div>
            ) : playersResponse?.jugadores?.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {orderedPlayers.map((player) => (
                  <PlayerCard key={player._id} player={player} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-white/10 bg-card px-6 py-10 text-center">
                <p className="text-lg font-semibold text-foreground">Selecciona una selección</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Aquí aparecerán las tarjetas de jugadores con foto, edad, altura, peso y posición.
                </p>
              </div>
            )}
          </section>
        </main>
      </PageWrapper>

      <Footer />
    </div>
  )
}

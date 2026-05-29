'use client'

import { useState } from 'react'
import type { SeleccionJugador } from '@/lib/selecciones'

function toAge(dateOfBirth?: string | null) {
  if (!dateOfBirth) {
    return null
  }

  const birthDate = new Date(dateOfBirth)
  if (Number.isNaN(birthDate.getTime())) {
    return null
  }

  const today = new Date()
  let years = today.getFullYear() - birthDate.getFullYear()
  const monthDifference = today.getMonth() - birthDate.getMonth()

  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    years -= 1
  }

  return years
}

function formatCentimeters(height?: number | null) {
  if (!height) {
    return 'Sin dato'
  }

  return `${height} cm`
}

function formatKilograms(weight?: number | null) {
  if (!weight) {
    return 'Sin dato'
  }

  return `${weight} kg`
}

export default function PlayerCard({ player }: { player: SeleccionJugador }) {
  const [hasImageError, setHasImageError] = useState(false)
  const age = toAge(player.fecha_nacimiento)
  const displayName = player.nombre_display || player.nombre_comun || player.nombre || player.apellido || 'Jugador'
  const fullName = player.nombre || displayName
  const playerPosition = player.posicion?.nombre || 'Sin posición'

  return (
    <article className="overflow-hidden rounded-2xl border border-white/10 bg-card shadow-lg shadow-black/20 transition-transform duration-300 hover:-translate-y-1 hover:border-[#3CB7FF]/60 hover:shadow-[#3CB7FF]/20">
      <div className="relative h-40 overflow-hidden bg-gradient-to-br from-white/10 via-black/20 to-black">
        <div className="absolute left-3 top-3 z-10 rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-white/90">
          #{player.numero_playera ?? '--'}
        </div>

        {player.foto && !hasImageError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={player.foto}
            alt={fullName}
            className="h-full w-full object-contain object-top p-2"
            onError={() => setHasImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs font-semibold uppercase tracking-[0.3em] text-white/30">
            Sin foto
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/90 to-transparent" />
      </div>

      <div className="space-y-4 p-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#3CB7FF]">
            {player.equipo_nombre}
          </p>
          <h3 className="mt-1 line-clamp-2 text-lg font-black leading-tight text-foreground">
            {displayName}
          </h3>
          {fullName !== displayName && (
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
              {fullName}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="rounded-xl border border-white/8 bg-black/20 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">Edad</p>
            <p className="mt-1 font-bold text-foreground">{age != null ? `${age} años` : 'Sin dato'}</p>
          </div>
          <div className="rounded-xl border border-white/8 bg-black/20 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">Posición</p>
            <p className="mt-1 font-bold text-foreground">{playerPosition}</p>
          </div>
          <div className="rounded-xl border border-white/8 bg-black/20 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">Altura</p>
            <p className="mt-1 font-bold text-foreground">{formatCentimeters(player.altura)}</p>
          </div>
          <div className="rounded-xl border border-white/8 bg-black/20 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">Peso</p>
            <p className="mt-1 font-bold text-foreground">{formatKilograms(player.peso)}</p>
          </div>
        </div>
      </div>
    </article>
  )
}
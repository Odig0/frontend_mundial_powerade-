'use client'

import { useState } from 'react'

interface Player {
  id: number
  name: string
  position: string
  team: string
  image: string
}

interface PlayerCardProps {
  player: Player
}

export default function PlayerCard({ player }: PlayerCardProps) {
  const [imageError, setImageError] = useState(false)

  const placeholderSvg = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Crect fill="%23222" width="400" height="400"/%3E%3Ccircle cx="200" cy="120" r="80" fill="%23666"/%3E%3Cellipse cx="200" cy="280" rx="120" ry="100" fill="%23666"/%3E%3C/svg%3E'

  return (
    <article className="group overflow-hidden rounded-xl border border-white/10 bg-card shadow-lg shadow-black/20 transition-all duration-300 hover:border-[#3CB7FF]/50 hover:shadow-lg hover:shadow-[#3CB7FF]/20">
      <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-white/10 to-white/0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageError ? placeholderSvg : player.image}
          alt={player.name}
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
          onError={() => setImageError(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      </div>

      <div className="p-4">
        <div className="mb-2">
          <h3 className="text-sm font-black uppercase tracking-tight text-foreground group-hover:text-[#3CB7FF] transition-colors line-clamp-2">
            {player.name}
          </h3>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Posición
            </span>
            <span className="inline-block px-2 py-1 bg-[#3CB7FF]/20 text-[#3CB7FF] text-xs font-bold rounded">
              {player.position}
            </span>
          </div>

          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Club
            </span>
            <span className="text-xs font-semibold text-foreground text-right line-clamp-2">
              {player.team}
            </span>
          </div>
        </div>
      </div>
    </article>
  )
}

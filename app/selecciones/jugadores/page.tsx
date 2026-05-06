import Header from '@/components/layout/Header'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PlayerCard from '@/components/players/PlayerCard'
import { argentinianPlayerMock } from '@/data/player_mock'

export default function PlayersPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="mb-8 md:mb-10">
          <p className="text-[#3CB7FF] font-semibold uppercase tracking-[0.35em] text-xs mb-3">
            Secciones
          </p>
          <h1 className="text-3xl md:text-5xl font-black text-foreground leading-tight mb-2">
            Squad Argentina
          </h1>
          <p className="max-w-2xl text-sm md:text-base text-muted-foreground">
            Los jugadores de la Selección Argentina para el Mundial 2026.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {argentinianPlayerMock.map((player) => (
            <PlayerCard key={player.id} player={player} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}

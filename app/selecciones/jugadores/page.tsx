import Header from '@/components/layout/Header'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PlayerCard from '@/components/players/PlayerCard'
import { argentinianPlayerMock } from '@/data/player_mock'
import HomeLeftAd from '@/components/publicidad/HomeLeftAd'
import HomeRightAd from '@/components/publicidad/HomeRightAd'

export default function PlayersPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#000000' }}>
      <Header />
      <Navbar />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 md:py-12">
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

          <div className="lg:grid lg:grid-cols-12 lg:gap-6">
            <aside className="hidden lg:block lg:col-span-2">
              <div className="w-[120px] mx-auto">
                <HomeLeftAd />
              </div>
            </aside>

            <section className="col-span-12 lg:col-span-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {argentinianPlayerMock.map((player) => (
                  <PlayerCard key={player.id} player={player} />
                ))}
              </div>
            </section>

            <aside className="hidden lg:block lg:col-span-2">
              <div className="w-[120px] mx-auto">
                <HomeRightAd />
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

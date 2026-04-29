import Header from '@/components/layout/Header'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import VideoPlayer from '@/components/videos/VideoPlayer'
import VideoDebug from '@/components/videos/VideoDebug'
import { getDailymotionVideos } from '@/services/dailymotionService'

export const metadata = {
  title: 'Videos - El Deber Deportes',
  description: 'Todos los videos disponibles desde Dailymotion',
}

export default async function VideosPage() {
  const videos = await getDailymotionVideos()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="mb-6">
          <p className="text-[#3CB7FF] font-semibold uppercase tracking-[0.35em] text-xs mb-3">Videos</p>
          <h1 className="text-3xl md:text-4xl font-black text-foreground">Cobertura multimedia</h1>
        </div>

        <div className="mt-6">
          {/* Client component handles player and playlist */}
          {/* @ts-expect-error Server -> Client component */}
          <VideoPlayer videos={videos} />
          {/* @ts-expect-error Server -> Client component */}
          <VideoDebug videos={videos} />
        </div>
      </main>

      <Footer />
    </div>
  )
}

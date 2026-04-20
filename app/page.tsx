import Header from '@/components/layout/Header'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroBlock from '@/components/home/HeroBlock'
import NewsGrid from '@/components/home/NewsGrid'
import VideoBlock from '@/components/home/VideoBlock'
import { getFeaturedNews, getTrendingNews } from '@/lib/api'

export default async function Home() {
  const featured = await getFeaturedNews()
  const trending = await getTrendingNews()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <Navbar />

      <main className="flex-1 flex flex-col gap-12 py-8 md:py-12">
        <div className="container mx-auto px-4">
          {/* Hero Block Section */}
          {featured.length > 0 && (
            <HeroBlock
              featured={featured[0]}
              side={[featured[1], featured[2]].filter(Boolean)}
            />
          )}
        </div>

        <div className="container mx-auto px-4">
          {/* News Grid Section */}
          {trending.length > 0 && (
            <NewsGrid news={trending} title="Latest News" />
          )}
        </div>

        {/* Videos Section (Full Bleed) */}
        <VideoBlock />
      </main>

      <Footer />
    </div>
  )
}

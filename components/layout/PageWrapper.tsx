import HomeLeftAd from '@/components/publicidad/HomeLeftAd'
import HomeRightAd from '@/components/publicidad/HomeRightAd'
import TopBannerAd from '@/components/publicidad/TopBannerAd'
import BottomBannerAd from '@/components/publicidad/BottomBannerAd'

interface PageWrapperProps {
  children: React.ReactNode
  showTopBanner?: boolean
  showBottomBanner?: boolean
  targeting?: Record<string, string>
}

/**
 * Layout de 3 columnas + banners GPT:
 * [Top] → [Ad Izq | Contenido (+ Bottom opcional) | Ad Der]
 */
export default function PageWrapper({
  children,
  showTopBanner = true,
  showBottomBanner = false,
  targeting,
}: PageWrapperProps) {
  return (
    <>
      {showTopBanner && <TopBannerAd targeting={targeting} />}
      <div className="flex justify-center w-full max-w-[1900px] mx-auto gap-4 px-4">
        <HomeLeftAd targeting={targeting} />

        <div className="flex-1 max-w-[1200px] min-w-0 flex flex-col">
          {children}
          {showBottomBanner && <BottomBannerAd targeting={targeting} />}
        </div>

        <HomeRightAd targeting={targeting} />
      </div>
    </>
  )
}

import HomeLeftAd from '@/components/publicidad/HomeLeftAd'
import HomeRightAd from '@/components/publicidad/HomeRightAd'
import TopBannerAd from '@/components/publicidad/TopBannerAd'

interface PageWrapperProps {
  children: React.ReactNode
  showTopBanner?: boolean
}

/**
 * Estandariza el layout de 3 columnas en todas las páginas:
 * [Banner Top] → [Ad Izq | Contenido | Ad Der]
 * Idéntico al layout del home page.
 */
export default function PageWrapper({ children, showTopBanner = true }: PageWrapperProps) {
  return (
    <>
      {showTopBanner && <TopBannerAd />}
      <div className="flex justify-center w-full max-w-[1900px] mx-auto gap-4 px-4">
        {/* Lateral Izquierdo 120x600 */}
        <HomeLeftAd />

        {/* Contenido Central */}
        <div className="flex-1 max-w-[1200px] min-w-0 flex flex-col">
          {children}
        </div>

        {/* Lateral Derecho 120x600 */}
        <HomeRightAd />
      </div>
    </>
  )
}

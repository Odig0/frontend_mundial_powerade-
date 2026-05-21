import { AD_UNITS } from '@/lib/ads'
import AdSlot from './AdSlot'

export default function BottomBannerAd({ targeting }: { targeting?: Record<string, string> }) {
  return (
    <div className="w-full py-8 bg-background border-t border-border/10 mt-8">
      <div className="flex md:hidden w-full justify-center">
        <div className="w-full max-w-[300px] px-4">
          <AdSlot
            config={AD_UNITS.BANNER_CUADRADO}
            className="w-full"
            minHeight="250px"
            targeting={targeting}
          />
        </div>
      </div>

      <div className="hidden md:flex w-full justify-center">
        <div className="hidden md:block w-full max-w-[1110px]">
          <AdSlot
            config={AD_UNITS.HOME_BOTTOM}
            className="w-full"
            minHeight="100px"
            targeting={targeting}
          />
        </div>
      </div>
    </div>
  )
}

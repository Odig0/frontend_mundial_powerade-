import { AD_UNITS } from '@/lib/ads'
import AdSlot from './AdSlot'

export default function MobileTopBannerAd({ targeting }: { targeting?: Record<string, string> }) {
  return (
    <div className="flex md:hidden w-full justify-center py-4 bg-background">
      <div className="w-full max-w-[320px] px-4">
        <AdSlot
          config={AD_UNITS.BANNER_TOP_MV}
          className="w-full"
          minHeight="100px"
          targeting={targeting}
        />
      </div>
    </div>
  )
}

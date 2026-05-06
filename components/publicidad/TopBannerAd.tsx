import { AD_UNITS } from '@/lib/ads'
import AdSlot from './AdSlot'

export default function TopBannerAd() {
  return (
    <div className="hidden md:flex w-full justify-center py-4 bg-background">
      <div className="hidden md:block w-[970px]">
        <AdSlot 
          config={AD_UNITS.HOME_TOP} 
          className="w-full"
          minHeight="90px"
        />
      </div>
    </div>
  )
}

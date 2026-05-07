import { AD_UNITS } from '@/lib/ads'
import AdSlot from './AdSlot'

export default function BottomBannerAd({ targeting }: { targeting?: Record<string, string> }) {
  return (
    <div className="hidden md:flex w-full justify-center py-8 bg-background border-t border-border/10 mt-8">
      <div className="hidden md:block w-full max-w-[1110px]">
        <AdSlot 
          config={AD_UNITS.HOME_BOTTOM} 
          className="w-full"
          minHeight="100px"
          targeting={targeting}
        />
      </div>
    </div>
  )
}

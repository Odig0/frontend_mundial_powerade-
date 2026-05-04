"use client";

import AdSlot from "./AdSlot";
import { AD_UNITS } from "@/lib/ads";

export default function HomeRightAd() {
  return (
    <aside className="hidden xl:block sticky top-24 w-[300px] flex-shrink-0 h-fit">
      <div className="text-[10px] text-muted-foreground uppercase tracking-widest text-center mb-2">
        Publicidad
      </div>
      <AdSlot 
        config={AD_UNITS.HOME_RIGHT} 
        className="flex justify-center bg-muted/5 rounded-lg overflow-hidden"
      />
    </aside>
  );
}

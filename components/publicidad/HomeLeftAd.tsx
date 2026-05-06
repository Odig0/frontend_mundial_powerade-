"use client";

import AdSlot from "./AdSlot";
import { AD_UNITS } from "@/lib/ads";

export default function HomeLeftAd() {
  return (
    <aside className="hidden xl:block sticky top-24 w-[120px] flex-shrink-0 h-fit">
      <div className="text-[10px] text-muted-foreground uppercase tracking-widest text-center mb-2">
        Publicidad
      </div>
      <AdSlot
        config={AD_UNITS.HOME_LEFT}
        className="flex justify-center rounded-lg overflow-hidden"
      />
    </aside>
  );
}

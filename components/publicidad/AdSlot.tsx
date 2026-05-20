"use client";

import { useEffect } from "react";
import { AdSlotConfig } from "@/lib/ads";

interface AdSlotProps {
  config: AdSlotConfig;
  className?: string;
  minHeight?: string;
  targeting?: Record<string, string>;
}

declare global {
  interface Window {
    googletag: any;
  }
}

export default function AdSlot({ config, className, minHeight = "600px", targeting }: AdSlotProps) {
  const targetingKey = targeting ? JSON.stringify(targeting) : "";

  useEffect(() => {
    if (typeof window === "undefined") return;

    const { adUnit, divId, sizes } = config;

    window.googletag = window.googletag || { cmd: [] };

    window.googletag.cmd.push(() => {
      const existingSlots = window.googletag.pubads().getSlots();
      const duplicate = existingSlots.find((s: any) => s.getSlotElementId() === divId);
      if (duplicate) {
        window.googletag.destroySlots([duplicate]);
      }

      const slot = window.googletag.defineSlot(adUnit, sizes, divId);

      if (slot) {
        if (targeting && Object.keys(targeting).length > 0) {
          slot.setConfig({ targeting });
        }

        slot.addService(window.googletag.pubads());
        window.googletag.display(divId);
      }
    });

    return () => {
      if (typeof window !== "undefined" && window.googletag) {
        window.googletag.cmd.push(() => {
          const slots = window.googletag.pubads().getSlots();
          const currentSlot = slots.find((s: any) => s.getSlotElementId() === divId);
          if (currentSlot) {
            window.googletag.destroySlots([currentSlot]);
          }
        });
      }
    };
  }, [config.adUnit, config.divId, config.sizes, targetingKey]);

  return (
    <div
      className={`relative flex flex-col items-center justify-center overflow-hidden transition-all ${className}`}
      style={{ minHeight, width: "100%" }}
    >
      <div
        id={config.divId}
        className="relative z-10 w-full flex justify-center"
      />
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { AdSlotConfig } from "@/lib/ads";

interface AdSlotProps {
  config: AdSlotConfig;
  className?: string;
  minHeight?: string;
}

declare global {
  interface Window {
    googletag: any;
  }
}

export default function AdSlot({ config, className, minHeight = "600px" }: AdSlotProps) {
  const isInitialized = useRef(false);

  useEffect(() => {
    // Evitar ejecución en el servidor o si ya se inicializó
    if (typeof window === "undefined" || isInitialized.current) return;

    const { adUnit, divId, sizes } = config;

    // Inicialización segura del objeto global
    window.googletag = window.googletag || { cmd: [] };

    window.googletag.cmd.push(() => {
      // Limpiar slot previo con el mismo ID para evitar errores en navegación Next.js
      const existingSlots = window.googletag.pubads().getSlots();
      const duplicate = existingSlots.find((s: any) => s.getSlotElementId() === divId);
      if (duplicate) {
        window.googletag.destroySlots([duplicate]);
      }

      // Definir y mostrar el anuncio
      const slot = window.googletag.defineSlot(adUnit, sizes as googletag.GeneralSize, divId);
      if (slot) {
        slot.addService(window.googletag.pubads());
        window.googletag.display(divId);
        isInitialized.current = true;
      }
    });

    return () => {
      // Cleanup: Destruir el slot al desmontar el componente
      if (typeof window !== "undefined" && window.googletag) {
        window.googletag.cmd.push(() => {
          const slots = window.googletag.pubads().getSlots();
          const currentSlot = slots.find((s: any) => s.getSlotElementId() === divId);
          if (currentSlot) {
            window.googletag.destroySlots([currentSlot]);
          }
          isInitialized.current = false;
        });
      }
    };
  }, [config]);

  return (
    <div 
      className={`relative flex flex-col items-center justify-center overflow-hidden transition-all ${className}`}
      style={{ minHeight, width: '100%' }}
    >
      {/* El slot de anuncio se inyecta aquí */}

      {/* Contenedor Real de GPT: Aquí se inyecta el iframe de Google */}
      <div 
        id={config.divId} 
        className="relative z-10 w-full flex justify-center"
      />
    </div>
  );
}

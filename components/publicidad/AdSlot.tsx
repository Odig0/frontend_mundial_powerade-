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
      className={`relative flex flex-col items-center justify-center border-2 border-dashed border-gray-400 bg-gray-200 rounded-lg overflow-hidden transition-all ${className}`}
      style={{ minHeight, width: '100%' }}
    >
      {/* Visual Placeholder: Solo se ve si el anuncio está vacío o mientras carga */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 pointer-events-none z-0 p-4 text-center">
        <span className="text-xs font-bold uppercase tracking-widest opacity-40 mb-1">Espacio de Publicidad</span>
        <span className="text-[10px] opacity-30 font-mono break-all">{config.adUnit}</span>
        <span className="text-[9px] opacity-20 mt-2 italic">ID: {config.divId}</span>
      </div>

      {/* Contenedor Real de GPT: Aquí se inyecta el iframe de Google */}
      <div 
        id={config.divId} 
        className="relative z-10 w-full flex justify-center"
      />
    </div>
  );
}

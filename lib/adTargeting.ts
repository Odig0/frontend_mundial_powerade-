export type SectionCategoria = 'videos' | 'mundial' | 'selecciones' | 'fueradejuego'

export type AdTargeting = Record<string, string>

const AD_PORTAL = 'tribuna'

/** Páginas internas con sección fija (videos, mundial, …). */
export function buildSectionTargeting(categoria: SectionCategoria): AdTargeting {
  return {
    portal: AD_PORTAL,
    categoria,
  }
}

/** Noticias dinámicas /[seccion]/[link] (ej. categoria: futbol). */
export function buildArticleTargeting(categoria: string): AdTargeting {
  return {
    portal: AD_PORTAL,
    categoria: categoria.trim().toLowerCase(),
  }
}

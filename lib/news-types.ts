export interface Opinologo {
  _id: string
  firma: string
  foto?: string
}

export interface NewsItem {
  _id: string
  fecha_a: number
  fecha_c: number
  imagen_home: string
  imagen_interior: string
  introHTML: string
  opinologo: Opinologo
  prevId: string
  posicion_portada?: number
  secciones: string[]
  textoHTML: string
  titulo: string
  link: string
}

export interface SyncResponse {
  fetched: number
  filteredFootball: number
  inserted: number
}
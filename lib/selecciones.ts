export interface PlayerPosition {
  id: number
  nombre: string
  codigo: string
}

export interface SeleccionJugador {
  _id: string
  player_id: number
  altura?: number | null
  apellido?: string | null
  equipo_codigo: string
  equipo_nombre: string
  equipo_pais: string
  fecha_nacimiento?: string | null
  foto?: string | null
  nacionalidad_id?: number | null
  nombre: string
  nombre_comun?: string | null
  nombre_display?: string | null
  numero_playera?: number | null
  peso?: number | null
  posicion?: PlayerPosition | null
}

export interface SeleccionEquipo {
  _id: string
  team_id: number
  codigo: string
  logo?: string | null
  nombre: string
  nombre_corto: string
  pais: string
  pais_id?: number | null
}

export interface SeleccionPlayersResponse {
  equipo: SeleccionEquipo
  total_jugadores: number
  jugadores: SeleccionJugador[]
}

export const COUNTRY_CODES: Record<string, string> = {
  'Alemania': 'GER',
  'Arabia Saudí': 'SAU',
  'Argelia': 'ALG',
  'Argentina': 'ARG',
  'Australia': 'AUS',
  'Austria': 'AUT',
  'Bélgica': 'BEL',
  'Bosnia y Herzegovina': 'BIH',
  'Brasil': 'BRA',
  'Cabo Verde': 'CPV',
  'Canadá': 'CAN',
  'Catar': 'QAT',
  'Colombia': 'COL',
  'Costa de Marfil': 'CIV',
  'Croacia': 'CRO',
  'Curazao': 'CUW',
  'Ecuador': 'ECU',
  'Egipto': 'EGY',
  'Escocia': 'SCO',
  'España': 'ESP',
  'Estados Unidos': 'USA',
  'Francia': 'FRA',
  'Ghana': 'GHA',
  'Haití': 'HTI',
  'Inglaterra': 'ENG',
  'Irak': 'IRQ',
  'Irán': 'IRN',
  'Japón': 'JPN',
  'Jordania': 'JOR',
  'Marruecos': 'MAR',
  'México': 'MEX',
  'Noruega': 'NOR',
  'Nueva Zelanda': 'NZL',
  'Países Bajos': 'NED',
  'Panamá': 'PAN',
  'Paraguay': 'PAR',
  'Portugal': 'POR',
  'RD Congo': 'COD',
  'República Checa': 'CZE',
  'República de Corea': 'KOR',
  'Senegal': 'SEN',
  'Sudáfrica': 'RSA',
  'Suecia': 'SWE',
  'Suiza': 'SUI',
  'Túnez': 'TUN',
  'Turquía': 'TUR',
  'Uruguay': 'URU',
  'Uzbekistán': 'UZB',
}

export function getCountryCode(countryName: string) {
  return COUNTRY_CODES[countryName] || ''
}
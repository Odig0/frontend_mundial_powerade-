export interface Equipo {
  nombre: string
  bandera: string
}

export interface Partido {
  id: string
  fecha: string
  hora: string
  canal: string
  local: Equipo
  visitante: Equipo
  grupo?: string
}

export const partidos: Partido[] = [
  {
    id: '1',
    fecha: '11 JUNIO 2026',
    hora: '09:00',
    canal: 'EL DEBER',
    grupo: 'Grupo A',
    local: { nombre: 'RUSIA', bandera: '🇷🇺' },
    visitante: { nombre: 'ARABIA', bandera: '🇸🇦' },
  },
  {
    id: '2',
    fecha: '11 JUNIO 2026',
    hora: '11:00',
    canal: 'EL DEBER',
    grupo: 'Grupo B',
    local: { nombre: 'EGIPTO', bandera: '🇪🇬' },
    visitante: { nombre: 'URUGUAY', bandera: '🇺🇾' },
  },
  {
    id: '3',
    fecha: '11 JUNIO 2026',
    hora: '13:00',
    canal: 'EL DEBER',
    grupo: 'Grupo C',
    local: { nombre: 'PORTUGAL', bandera: '🇵🇹' },
    visitante: { nombre: 'ESPAÑA', bandera: '🇪🇸' },
  },
  {
    id: '4',
    fecha: '12 JUNIO 2026',
    hora: '09:00',
    canal: 'EL DEBER',
    grupo: 'Grupo D',
    local: { nombre: 'MARRUECOS', bandera: '🇲🇦' },
    visitante: { nombre: 'IRAN', bandera: '🇮🇷' },
  },
  {
    id: '5',
    fecha: '12 JUNIO 2026',
    hora: '11:00',
    canal: 'EL DEBER',
    grupo: 'Grupo E',
    local: { nombre: 'URUGUAY', bandera: '🇺🇾' },
    visitante: { nombre: 'RUSIA', bandera: '🇷🇺' },
  },
  {
    id: '6',
    fecha: '12 JUNIO 2026',
    hora: '13:00',
    canal: 'EL DEBER',
    grupo: 'Grupo F',
    local: { nombre: 'BRASIL', bandera: '🇧🇷' },
    visitante: { nombre: 'ARGENTINA', bandera: '🇦🇷' },
  },
  {
    id: '7',
    fecha: '13 JUNIO 2026',
    hora: '10:00',
    canal: 'EL DEBER',
    grupo: 'Grupo G',
    local: { nombre: 'BOLIVIA', bandera: '🇧🇴' },
    visitante: { nombre: 'CANADA', bandera: '🇨🇦' },
  },
]

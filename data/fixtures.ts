export interface Team {
  name: string
  flag: string
}

export interface FixtureMatch {
  date: string
  time: string
  homeTeam: Team
  awayTeam: Team
  group: string
  stadium: string
  city: string
}

export const partidos: FixtureMatch[] = [
  {"date":"2026-06-11","time":"15:00","homeTeam":{"name":"México","flag":"https://flagcdn.com/w40/mx.png"},"awayTeam":{"name":"Sudáfrica","flag":"https://flagcdn.com/w40/za.png"},"group":"A","stadium":"Estadio Ciudad de México","city":"Ciudad de México"},
  {"date":"2026-06-11","time":"22:00","homeTeam":{"name":"República de Corea","flag":"https://flagcdn.com/w40/kr.png"},"awayTeam":{"name":"República Checa","flag":"https://flagcdn.com/w40/cz.png"},"group":"A","stadium":"Estadio Guadalajara","city":"Guadalajara"},

  {"date":"2026-06-12","time":"15:00","homeTeam":{"name":"Canadá","flag":"https://flagcdn.com/w40/ca.png"},"awayTeam":{"name":"Bosnia y Herzegovina","flag":"https://flagcdn.com/w40/ba.png"},"group":"B","stadium":"Estadio Toronto","city":"Toronto"},
  {"date":"2026-06-12","time":"21:00","homeTeam":{"name":"Estados Unidos","flag":"https://flagcdn.com/w40/us.png"},"awayTeam":{"name":"Paraguay","flag":"https://flagcdn.com/w40/py.png"},"group":"D","stadium":"Estadio Los Ángeles","city":"Los Ángeles"},

  {"date":"2026-06-13","time":"15:00","homeTeam":{"name":"Catar","flag":"https://flagcdn.com/w40/qa.png"},"awayTeam":{"name":"Suiza","flag":"https://flagcdn.com/w40/ch.png"},"group":"B","stadium":"Estadio Bahía de San Francisco","city":"San Francisco"},
  {"date":"2026-06-13","time":"18:00","homeTeam":{"name":"Brasil","flag":"https://flagcdn.com/w40/br.png"},"awayTeam":{"name":"Marruecos","flag":"https://flagcdn.com/w40/ma.png"},"group":"C","stadium":"Estadio Nueva York Nueva Jersey","city":"Nueva York"},
  {"date":"2026-06-13","time":"21:00","homeTeam":{"name":"Haití","flag":"https://flagcdn.com/w40/ht.png"},"awayTeam":{"name":"Escocia","flag":"https://flagcdn.com/w40/gb-sct.png"},"group":"C","stadium":"Estadio Boston","city":"Boston"},
  {"date":"2026-06-13","time":"00:00","homeTeam":{"name":"Australia","flag":"https://flagcdn.com/w40/au.png"},"awayTeam":{"name":"Turquía","flag":"https://flagcdn.com/w40/tr.png"},"group":"D","stadium":"Estadio BC Place Vancouver","city":"Vancouver"},

  {"date":"2026-06-14","time":"13:00","homeTeam":{"name":"Alemania","flag":"https://flagcdn.com/w40/de.png"},"awayTeam":{"name":"Curazao","flag":"https://flagcdn.com/w40/cw.png"},"group":"E","stadium":"Estadio Houston","city":"Houston"},
  {"date":"2026-06-14","time":"16:00","homeTeam":{"name":"Países Bajos","flag":"https://flagcdn.com/w40/nl.png"},"awayTeam":{"name":"Japón","flag":"https://flagcdn.com/w40/jp.png"},"group":"F","stadium":"Estadio Dallas","city":"Dallas"},
  {"date":"2026-06-14","time":"19:00","homeTeam":{"name":"Costa de Marfil","flag":"https://flagcdn.com/w40/ci.png"},"awayTeam":{"name":"Ecuador","flag":"https://flagcdn.com/w40/ec.png"},"group":"E","stadium":"Estadio Filadelfia","city":"Filadelfia"},
  {"date":"2026-06-14","time":"22:00","homeTeam":{"name":"Suecia","flag":"https://flagcdn.com/w40/se.png"},"awayTeam":{"name":"Túnez","flag":"https://flagcdn.com/w40/tn.png"},"group":"F","stadium":"Estadio Monterrey","city":"Monterrey"},

  {"date":"2026-06-15","time":"12:00","homeTeam":{"name":"España","flag":"https://flagcdn.com/w40/es.png"},"awayTeam":{"name":"Cabo Verde","flag":"https://flagcdn.com/w40/cv.png"},"group":"H","stadium":"Estadio Atlanta","city":"Atlanta"},
  {"date":"2026-06-15","time":"15:00","homeTeam":{"name":"Bélgica","flag":"https://flagcdn.com/w40/be.png"},"awayTeam":{"name":"Egipto","flag":"https://flagcdn.com/w40/eg.png"},"group":"G","stadium":"Estadio Seattle","city":"Seattle"},
  {"date":"2026-06-15","time":"18:00","homeTeam":{"name":"Arabia Saudí","flag":"https://flagcdn.com/w40/sa.png"},"awayTeam":{"name":"Uruguay","flag":"https://flagcdn.com/w40/uy.png"},"group":"H","stadium":"Estadio Miami","city":"Miami"},
  {"date":"2026-06-15","time":"21:00","homeTeam":{"name":"Irán","flag":"https://flagcdn.com/w40/ir.png"},"awayTeam":{"name":"Nueva Zelanda","flag":"https://flagcdn.com/w40/nz.png"},"group":"G","stadium":"Estadio Los Ángeles","city":"Los Ángeles"},

  {"date":"2026-06-16","time":"15:00","homeTeam":{"name":"Francia","flag":"https://flagcdn.com/w40/fr.png"},"awayTeam":{"name":"Senegal","flag":"https://flagcdn.com/w40/sn.png"},"group":"I","stadium":"Estadio Nueva York Nueva Jersey","city":"Nueva York"},
  {"date":"2026-06-16","time":"18:00","homeTeam":{"name":"Irak","flag":"https://flagcdn.com/w40/iq.png"},"awayTeam":{"name":"Noruega","flag":"https://flagcdn.com/w40/no.png"},"group":"I","stadium":"Estadio Boston","city":"Boston"},
  {"date":"2026-06-16","time":"21:00","homeTeam":{"name":"Argentina","flag":"https://flagcdn.com/w40/ar.png"},"awayTeam":{"name":"Argelia","flag":"https://flagcdn.com/w40/dz.png"},"group":"J","stadium":"Estadio Kansas City","city":"Kansas City"},
  {"date":"2026-06-16","time":"00:00","homeTeam":{"name":"Austria","flag":"https://flagcdn.com/w40/at.png"},"awayTeam":{"name":"Jordania","flag":"https://flagcdn.com/w40/jo.png"},"group":"J","stadium":"Estadio Bahía de San Francisco","city":"San Francisco"},

  {"date":"2026-06-17","time":"13:00","homeTeam":{"name":"Portugal","flag":"https://flagcdn.com/w40/pt.png"},"awayTeam":{"name":"RD Congo","flag":"https://flagcdn.com/w40/cd.png"},"group":"K","stadium":"Estadio Houston","city":"Houston"},
  {"date":"2026-06-17","time":"16:00","homeTeam":{"name":"Inglaterra","flag":"https://flagcdn.com/w40/gb-eng.png"},"awayTeam":{"name":"Croacia","flag":"https://flagcdn.com/w40/hr.png"},"group":"L","stadium":"Estadio Dallas","city":"Dallas"},
  {"date":"2026-06-17","time":"19:00","homeTeam":{"name":"Ghana","flag":"https://flagcdn.com/w40/gh.png"},"awayTeam":{"name":"Panamá","flag":"https://flagcdn.com/w40/pa.png"},"group":"L","stadium":"Estadio Toronto","city":"Toronto"},
  {"date":"2026-06-17","time":"22:00","homeTeam":{"name":"Uzbekistán","flag":"https://flagcdn.com/w40/uz.png"},"awayTeam":{"name":"Colombia","flag":"https://flagcdn.com/w40/co.png"},"group":"K","stadium":"Estadio Ciudad de México","city":"Ciudad de México"},

  {"date":"2026-06-18","time":"12:00","homeTeam":{"name":"República Checa","flag":"https://flagcdn.com/w40/cz.png"},"awayTeam":{"name":"Sudáfrica","flag":"https://flagcdn.com/w40/za.png"},"group":"A","stadium":"Estadio Atlanta","city":"Atlanta"},
  {"date":"2026-06-18","time":"15:00","homeTeam":{"name":"Suiza","flag":"https://flagcdn.com/w40/ch.png"},"awayTeam":{"name":"Bosnia y Herzegovina","flag":"https://flagcdn.com/w40/ba.png"},"group":"B","stadium":"Estadio Los Ángeles","city":"Los Ángeles"},
  {"date":"2026-06-18","time":"18:00","homeTeam":{"name":"Canadá","flag":"https://flagcdn.com/w40/ca.png"},"awayTeam":{"name":"Catar","flag":"https://flagcdn.com/w40/qa.png"},"group":"B","stadium":"Estadio BC Place Vancouver","city":"Vancouver"},
  {"date":"2026-06-18","time":"21:00","homeTeam":{"name":"México","flag":"https://flagcdn.com/w40/mx.png"},"awayTeam":{"name":"República de Corea","flag":"https://flagcdn.com/w40/kr.png"},"group":"A","stadium":"Estadio Guadalajara","city":"Guadalajara"},

  {"date":"2026-06-19","time":"15:00","homeTeam":{"name":"Estados Unidos","flag":"https://flagcdn.com/w40/us.png"},"awayTeam":{"name":"Australia","flag":"https://flagcdn.com/w40/au.png"},"group":"D","stadium":"Estadio Seattle","city":"Seattle"},
  {"date":"2026-06-19","time":"18:00","homeTeam":{"name":"Escocia","flag":"https://flagcdn.com/w40/gb-sct.png"},"awayTeam":{"name":"Marruecos","flag":"https://flagcdn.com/w40/ma.png"},"group":"C","stadium":"Estadio Boston","city":"Boston"},
  {"date":"2026-06-19","time":"21:00","homeTeam":{"name":"Brasil","flag":"https://flagcdn.com/w40/br.png"},"awayTeam":{"name":"Haití","flag":"https://flagcdn.com/w40/ht.png"},"group":"C","stadium":"Estadio Filadelfia","city":"Filadelfia"},
  {"date":"2026-06-19","time":"00:00","homeTeam":{"name":"Turquía","flag":"https://flagcdn.com/w40/tr.png"},"awayTeam":{"name":"Paraguay","flag":"https://flagcdn.com/w40/py.png"},"group":"D","stadium":"Estadio Bahía de San Francisco","city":"San Francisco"},

  {"date":"2026-06-20","time":"13:00","homeTeam":{"name":"Países Bajos","flag":"https://flagcdn.com/w40/nl.png"},"awayTeam":{"name":"Suecia","flag":"https://flagcdn.com/w40/se.png"},"group":"F","stadium":"Estadio Houston","city":"Houston"},
  {"date":"2026-06-20","time":"16:00","homeTeam":{"name":"Alemania","flag":"https://flagcdn.com/w40/de.png"},"awayTeam":{"name":"Costa de Marfil","flag":"https://flagcdn.com/w40/ci.png"},"group":"E","stadium":"Estadio Toronto","city":"Toronto"},
  {"date":"2026-06-20","time":"22:00","homeTeam":{"name":"Ecuador","flag":"https://flagcdn.com/w40/ec.png"},"awayTeam":{"name":"Curazao","flag":"https://flagcdn.com/w40/cw.png"},"group":"E","stadium":"Estadio Kansas City","city":"Kansas City"},
  {"date":"2026-06-20","time":"00:00","homeTeam":{"name":"Túnez","flag":"https://flagcdn.com/w40/tn.png"},"awayTeam":{"name":"Japón","flag":"https://flagcdn.com/w40/jp.png"},"group":"F","stadium":"Estadio Monterrey","city":"Monterrey"},

  {"date":"2026-06-21","time":"12:00","homeTeam":{"name":"España","flag":"https://flagcdn.com/w40/es.png"},"awayTeam":{"name":"Arabia Saudí","flag":"https://flagcdn.com/w40/sa.png"},"group":"H","stadium":"Estadio Atlanta","city":"Atlanta"},
  {"date":"2026-06-21","time":"15:00","homeTeam":{"name":"Bélgica","flag":"https://flagcdn.com/w40/be.png"},"awayTeam":{"name":"Irán","flag":"https://flagcdn.com/w40/ir.png"},"group":"G","stadium":"Estadio Los Ángeles","city":"Los Ángeles"},
  {"date":"2026-06-21","time":"18:00","homeTeam":{"name":"Uruguay","flag":"https://flagcdn.com/w40/uy.png"},"awayTeam":{"name":"Cabo Verde","flag":"https://flagcdn.com/w40/cv.png"},"group":"H","stadium":"Estadio Miami","city":"Miami"},
  {"date":"2026-06-21","time":"21:00","homeTeam":{"name":"Nueva Zelanda","flag":"https://flagcdn.com/w40/nz.png"},"awayTeam":{"name":"Egipto","flag":"https://flagcdn.com/w40/eg.png"},"group":"G","stadium":"Estadio BC Place Vancouver","city":"Vancouver"},

  {"date":"2026-06-22","time":"13:00","homeTeam":{"name":"Argentina","flag":"https://flagcdn.com/w40/ar.png"},"awayTeam":{"name":"Austria","flag":"https://flagcdn.com/w40/at.png"},"group":"J","stadium":"Estadio Dallas","city":"Dallas"},
  {"date":"2026-06-22","time":"17:00","homeTeam":{"name":"Francia","flag":"https://flagcdn.com/w40/fr.png"},"awayTeam":{"name":"Irak","flag":"https://flagcdn.com/w40/iq.png"},"group":"I","stadium":"Estadio Filadelfia","city":"Filadelfia"},
  {"date":"2026-06-22","time":"20:00","homeTeam":{"name":"Noruega","flag":"https://flagcdn.com/w40/no.png"},"awayTeam":{"name":"Senegal","flag":"https://flagcdn.com/w40/sn.png"},"group":"I","stadium":"Estadio Nueva York Nueva Jersey","city":"Nueva York"},
  {"date":"2026-06-22","time":"23:00","homeTeam":{"name":"Jordania","flag":"https://flagcdn.com/w40/jo.png"},"awayTeam":{"name":"Argelia","flag":"https://flagcdn.com/w40/dz.png"},"group":"J","stadium":"Estadio Bahía de San Francisco","city":"San Francisco"},

  {"date":"2026-06-23","time":"13:00","homeTeam":{"name":"Portugal","flag":"https://flagcdn.com/w40/pt.png"},"awayTeam":{"name":"Uzbekistán","flag":"https://flagcdn.com/w40/uz.png"},"group":"K","stadium":"Estadio Houston","city":"Houston"},
  {"date":"2026-06-23","time":"16:00","homeTeam":{"name":"Inglaterra","flag":"https://flagcdn.com/w40/gb-eng.png"},"awayTeam":{"name":"Ghana","flag":"https://flagcdn.com/w40/gh.png"},"group":"L","stadium":"Estadio Boston","city":"Boston"},
  {"date":"2026-06-23","time":"19:00","homeTeam":{"name":"Panamá","flag":"https://flagcdn.com/w40/pa.png"},"awayTeam":{"name":"Croacia","flag":"https://flagcdn.com/w40/hr.png"},"group":"L","stadium":"Estadio Toronto","city":"Toronto"},
  {"date":"2026-06-23","time":"22:00","homeTeam":{"name":"Colombia","flag":"https://flagcdn.com/w40/co.png"},"awayTeam":{"name":"RD Congo","flag":"https://flagcdn.com/w40/cd.png"},"group":"K","stadium":"Estadio Guadalajara","city":"Guadalajara"},

  {"date":"2026-06-24","time":"15:00","homeTeam":{"name":"Suiza","flag":"https://flagcdn.com/w40/ch.png"},"awayTeam":{"name":"Canadá","flag":"https://flagcdn.com/w40/ca.png"},"group":"B","stadium":"Estadio BC Place Vancouver","city":"Vancouver"},
  {"date":"2026-06-24","time":"15:00","homeTeam":{"name":"Bosnia y Herzegovina","flag":"https://flagcdn.com/w40/ba.png"},"awayTeam":{"name":"Catar","flag":"https://flagcdn.com/w40/qa.png"},"group":"B","stadium":"Estadio Seattle","city":"Seattle"},
  {"date":"2026-06-24","time":"18:00","homeTeam":{"name":"Escocia","flag":"https://flagcdn.com/w40/gb-sct.png"},"awayTeam":{"name":"Brasil","flag":"https://flagcdn.com/w40/br.png"},"group":"C","stadium":"Estadio Miami","city":"Miami"},
  {"date":"2026-06-24","time":"18:00","homeTeam":{"name":"Marruecos","flag":"https://flagcdn.com/w40/ma.png"},"awayTeam":{"name":"Haití","flag":"https://flagcdn.com/w40/ht.png"},"group":"C","stadium":"Estadio Atlanta","city":"Atlanta"},
  {"date":"2026-06-24","time":"21:00","homeTeam":{"name":"República Checa","flag":"https://flagcdn.com/w40/cz.png"},"awayTeam":{"name":"México","flag":"https://flagcdn.com/w40/mx.png"},"group":"A","stadium":"Estadio Ciudad de México","city":"Ciudad de México"},
  {"date":"2026-06-24","time":"21:00","homeTeam":{"name":"Sudáfrica","flag":"https://flagcdn.com/w40/za.png"},"awayTeam":{"name":"República de Corea","flag":"https://flagcdn.com/w40/kr.png"},"group":"A","stadium":"Estadio Monterrey","city":"Monterrey"},

  {"date":"2026-06-25","time":"16:00","homeTeam":{"name":"Curazao","flag":"https://flagcdn.com/w40/cw.png"},"awayTeam":{"name":"Costa de Marfil","flag":"https://flagcdn.com/w40/ci.png"},"group":"E","stadium":"Estadio Filadelfia","city":"Filadelfia"},
  {"date":"2026-06-25","time":"16:00","homeTeam":{"name":"Ecuador","flag":"https://flagcdn.com/w40/ec.png"},"awayTeam":{"name":"Alemania","flag":"https://flagcdn.com/w40/de.png"},"group":"E","stadium":"Estadio Nueva York Nueva Jersey","city":"Nueva York"},
  {"date":"2026-06-25","time":"19:00","homeTeam":{"name":"Japón","flag":"https://flagcdn.com/w40/jp.png"},"awayTeam":{"name":"Suecia","flag":"https://flagcdn.com/w40/se.png"},"group":"F","stadium":"Estadio Dallas","city":"Dallas"},
  {"date":"2026-06-25","time":"19:00","homeTeam":{"name":"Túnez","flag":"https://flagcdn.com/w40/tn.png"},"awayTeam":{"name":"Países Bajos","flag":"https://flagcdn.com/w40/nl.png"},"group":"F","stadium":"Estadio Kansas City","city":"Kansas City"},
  {"date":"2026-06-25","time":"22:00","homeTeam":{"name":"Turquía","flag":"https://flagcdn.com/w40/tr.png"},"awayTeam":{"name":"Estados Unidos","flag":"https://flagcdn.com/w40/us.png"},"group":"D","stadium":"Estadio Los Ángeles","city":"Los Ángeles"},
  {"date":"2026-06-25","time":"22:00","homeTeam":{"name":"Paraguay","flag":"https://flagcdn.com/w40/py.png"},"awayTeam":{"name":"Australia","flag":"https://flagcdn.com/w40/au.png"},"group":"D","stadium":"Estadio Bahía de San Francisco","city":"San Francisco"},

  {"date":"2026-06-26","time":"15:00","homeTeam":{"name":"Noruega","flag":"https://flagcdn.com/w40/no.png"},"awayTeam":{"name":"Francia","flag":"https://flagcdn.com/w40/fr.png"},"group":"I","stadium":"Estadio Boston","city":"Boston"},
  {"date":"2026-06-26","time":"15:00","homeTeam":{"name":"Senegal","flag":"https://flagcdn.com/w40/sn.png"},"awayTeam":{"name":"Irak","flag":"https://flagcdn.com/w40/iq.png"},"group":"I","stadium":"Estadio Toronto","city":"Toronto"},
  {"date":"2026-06-26","time":"20:00","homeTeam":{"name":"Cabo Verde","flag":"https://flagcdn.com/w40/cv.png"},"awayTeam":{"name":"Arabia Saudí","flag":"https://flagcdn.com/w40/sa.png"},"group":"H","stadium":"Estadio Houston","city":"Houston"},
  {"date":"2026-06-26","time":"20:00","homeTeam":{"name":"Uruguay","flag":"https://flagcdn.com/w40/uy.png"},"awayTeam":{"name":"España","flag":"https://flagcdn.com/w40/es.png"},"group":"H","stadium":"Estadio Guadalajara","city":"Guadalajara"},
  {"date":"2026-06-26","time":"23:00","homeTeam":{"name":"Egipto","flag":"https://flagcdn.com/w40/eg.png"},"awayTeam":{"name":"Irán","flag":"https://flagcdn.com/w40/ir.png"},"group":"G","stadium":"Estadio Seattle","city":"Seattle"},
  {"date":"2026-06-26","time":"23:00","homeTeam":{"name":"Nueva Zelanda","flag":"https://flagcdn.com/w40/nz.png"},"awayTeam":{"name":"Bélgica","flag":"https://flagcdn.com/w40/be.png"},"group":"G","stadium":"Estadio BC Place Vancouver","city":"Vancouver"},

  {"date":"2026-06-27","time":"17:00","homeTeam":{"name":"Panamá","flag":"https://flagcdn.com/w40/pa.png"},"awayTeam":{"name":"Inglaterra","flag":"https://flagcdn.com/w40/gb-eng.png"},"group":"L","stadium":"Estadio Nueva York Nueva Jersey","city":"Nueva York"},
  {"date":"2026-06-27","time":"17:00","homeTeam":{"name":"Croacia","flag":"https://flagcdn.com/w40/hr.png"},"awayTeam":{"name":"Ghana","flag":"https://flagcdn.com/w40/gh.png"},"group":"L","stadium":"Estadio Filadelfia","city":"Filadelfia"},
  {"date":"2026-06-27","time":"19:30","homeTeam":{"name":"Colombia","flag":"https://flagcdn.com/w40/co.png"},"awayTeam":{"name":"Portugal","flag":"https://flagcdn.com/w40/pt.png"},"group":"K","stadium":"Estadio Miami","city":"Miami"},
  {"date":"2026-06-27","time":"19:30","homeTeam":{"name":"RD Congo","flag":"https://flagcdn.com/w40/cd.png"},"awayTeam":{"name":"Uzbekistán","flag":"https://flagcdn.com/w40/uz.png"},"group":"K","stadium":"Estadio Atlanta","city":"Atlanta"},
  {"date":"2026-06-27","time":"22:00","homeTeam":{"name":"Argelia","flag":"https://flagcdn.com/w40/dz.png"},"awayTeam":{"name":"Austria","flag":"https://flagcdn.com/w40/at.png"},"group":"J","stadium":"Estadio Kansas City","city":"Kansas City"},
  {"date":"2026-06-27","time":"22:00","homeTeam":{"name":"Jordania","flag":"https://flagcdn.com/w40/jo.png"},"awayTeam":{"name":"Argentina","flag":"https://flagcdn.com/w40/ar.png"},"group":"J","stadium":"Estadio Dallas","city":"Dallas"}
]
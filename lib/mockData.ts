export interface Opinologo {
  _id: string;
  firma: string;
  foto?: string;
}

export interface NewsItem {
  _id: string;
  fecha_a?: number;
  fecha_c: number;
  imagen_home: string;
  imagen_interior: string;
  introHTML: string;
  opinologo?: Opinologo;
  prevId: string;
  secciones: string[];
  textoHTML: string;
  titulo: string;
  link: string;
}

export const mockNews: NewsItem[] = [
  {
    _id: "69e53bc20d2cbf00142f3ac1",
    fecha_a: 1776631838212,
    fecha_c: 1776631838211,
    imagen_home: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=450&fit=crop",
    imagen_interior: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=450&fit=crop",
    introHTML: "<p>El boliviano volc&oacute; en un tramo de alta velocidad en Mina Clavero, Argentina, sali&oacute; ileso junto a su copiloto, pero no pudo continuar en una jornada que termin&oacute; marcada por una tragedia.</p>",
    opinologo: {
      _id: "68bd2f75484b81000295bbbd",
      firma: "Jaime Paniagua",
      foto: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100&h=100&fit=crop"
    },
    prevId: "1776631838",
    secciones: ["multideportivo"],
    textoHTML: "<section dir=\"auto\"><p>El piloto boliviano<strong> Sebasti&aacute;n Franco fue protagonista de un fuerte accidente durante la segunda fecha del Rally Codasur, disputada en Mina Clavero, Argentin</strong>a, lo que provoc&oacute; su abandono de la competencia cuando ven&iacute;a cumpliendo una destacada actuaci&oacute;n.</p><p>El incidente se produjo en el tramo Ci&eacute;naga de Allende &ndash; Mina Clavero, en un sector de alta velocidad con una curva a la izquierda y salto incluido.<strong> Seg&uacute;n reportes, el veh&iacute;culo despeg&oacute; de punta tras el salto, perdi&oacute; estabilidad al momento de aterrizar y termin&oacute; dando una vuelta de campana, q</strong>uedando cruzado en medio del camino y con evidentes da&ntilde;os mec&aacute;nicos.</p><p>Pese a la violencia del vuelco, <strong>Franco y su copiloto, Lucas Hurtado, lograron salir por sus propios medios y se encontraban en buen estado de salud, si</strong>n necesidad de asistencia m&eacute;dica. Incluso, el navegante aplic&oacute; correctamente el protocolo de seguridad al colocarse metros antes del lugar del accidente con la se&ntilde;al de &ldquo;OK&rdquo; para advertir a los dem&aacute;s competidores.</p><p>El boliviano, que se encontraba cuarto en el campeonato y hab&iacute;a llegado como uno de los protagonistas del fin de semana, <strong>no pudo continuar en carrera y qued&oacute; fuera en la segunda etapa, en una jornada que hasta ese momento ya mostraba alta exigencia en los tramos.</strong></p><p>Minutos m&aacute;s tarde, la competencia se ver&iacute;a marcada por un hecho a&uacute;n m&aacute;s grave. <strong>Durante el d&eacute;cimo tramo cronometrado, en el sector Giulio Cesare&ndash;Mina Clavero, el piloto paraguayo Didier Arias perdi&oacute; el control de su veh&iacute;culo tras impactar contra una piedra</strong>, volc&oacute; en varias ocasiones y termin&oacute; embistiendo a espectadores.</p><p><strong>El accidente dej&oacute; como saldo la muerte de un aficionado de 25 a&ntilde;os, adem&aacute;s de varias personas heridas</strong>, entre ellas una mujer y su hija, quienes fueron trasladadas a un centro m&eacute;dico y se encuentran fuera de peligro. Ante esta situaci&oacute;n, la organizaci&oacute;n decidi&oacute; suspender definitivamente la carrera, que no pudo completar los 13 tramos previstos.</p></section>",
    titulo: "El piloto Sebastian Franco abandona tras un fuerte vuelco en el Rally Codasur",
    link: "el-piloto-sebastian-franco-abandona-tras-un-fuerte-vuelco-en-el-rally-codasur_1776631838"
  },
  {
    _id: "69e5135267550e0014cd1158",
    fecha_c: 1776620608530,
    fecha_a: 1776620608530,
    imagen_home: "https://images.unsplash.com/photo-1518605368461-1e1e38d47555?w=800&h=450&fit=crop",
    imagen_interior: "https://images.unsplash.com/photo-1518605368461-1e1e38d47555?w=800&h=450&fit=crop",
    introHTML: "<p>El City se impuso por 2-1 al &nbsp;Arsenal en el Etihad Stadium. El equipo dirigido por Pep Guardiola a&uacute;n tiene un partido pendiente y depende de s&iacute; mismo para conquistar el t&iacute;tulo de la Premier League, siempre y cuando gane todos sus encuentros restantes y logre superar a su rival en la diferencia de goles.</p>",
    opinologo: {
      _id: "68bd2f75484b81000295bbb1",
      firma: "Agencia EFE"
    },
    prevId: "1776620608",
    secciones: ["futbol"],
    textoHTML: "<p>Irrumpi&oacute; Erling Haaland, casi desaparecido hasta ese momento, pasada por poco la hora de juego, justo cuando emerg&iacute;a el Arsenal, para devolver la ventaja al Manchester City y encarrilar una victoria (2-1) que pone de cara el t&iacute;tulo de la Premier al equipo del espa&ntilde;ol Pep Guardiola.</p>",
    titulo: "Manchester City vence al Arsenal y enciende la lucha por el título de la Premier",
    link: "manchester-city-vence-al-arsenal-y-enciende-la-lucha-por-el-titulo-de-la-premier_1776620608"
  },
  {
    _id: "mock-1",
    fecha_c: 1713500000000,
    imagen_home: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&h=450&fit=crop",
    imagen_interior: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&h=450&fit=crop",
    introHTML: "<p>An incredible performance in the championship match ends with a memorable victory for the home team.</p>",
    prevId: "mock1",
    secciones: ["deportes"],
    textoHTML: "<p>In one of the most thrilling matches of the season, the home team secured a championship victory with a stunning final performance. The match showcased exceptional skill, determination, and teamwork.</p><p>From the opening whistle, both teams displayed their commitment to winning. The momentum shifted several times throughout the match, keeping fans on the edge of their seats.</p>",
    titulo: "Championship Victory: Historic Win in Stunning Final",
    link: "championship-victory-historic-win_1713500000000"
  },
  {
    _id: "mock-2",
    fecha_c: 1713400000000,
    imagen_home: "https://images.unsplash.com/photo-1508344928928-7157b686fbc3?w=800&h=450&fit=crop",
    imagen_interior: "https://images.unsplash.com/photo-1508344928928-7157b686fbc3?w=800&h=450&fit=crop",
    introHTML: "<p>One of the league's most talented players signs a groundbreaking multi-year contract.</p>",
    prevId: "mock2",
    secciones: ["futbol"],
    textoHTML: "<p>In a shocking move that sent shockwaves through the sports world, one of the league's brightest stars has signed a record-breaking contract with one of the major franchises.</p><p>The deal is considered the most lucrative in the history of the sport, reflecting the player's exceptional talent and market value.</p>",
    titulo: "Star Player Signs Record-Breaking Contract",
    link: "star-player-record-contract_1713400000000"
  },
  {
    _id: "mock-3",
    fecha_c: 1713300000000,
    imagen_home: "https://images.unsplash.com/photo-1521550130623-a1bfb03ba249?w=800&h=450&fit=crop",
    imagen_interior: "https://images.unsplash.com/photo-1521550130623-a1bfb03ba249?w=800&h=450&fit=crop",
    introHTML: "<p>Nueva edición del campeonato interregional de deportes variados arranca este fin de semana.</p>",
    prevId: "mock3",
    secciones: ["multideportivo"],
    textoHTML: "<p>Con más de 500 atletas inscritos, la competición multideportiva más importante del mes promete romper todos los récords de asistencia y participación.</p>",
    titulo: "Gran inicio de la temporada de competiciones multideportivas",
    link: "gran-inicio-temporada-multideportiva_1713300000000"
  },
  {
    _id: "mock-4",
    fecha_c: 1713200000000,
    imagen_home: "https://images.unsplash.com/photo-1526566762798-8fac9c07aa22?w=800&h=450&fit=crop",
    imagen_interior: "https://images.unsplash.com/photo-1526566762798-8fac9c07aa22?w=800&h=450&fit=crop",
    introHTML: "<p>Los beneficios ocultos del entrenamiento cruzado para atletas de alto rendimiento.</p>",
    prevId: "mock4",
    secciones: ["deportes"],
    textoHTML: "<p>Los expertos coinciden en que el entrenamiento cruzado mejora no solo la resistencia física, sino que previene lesiones a largo plazo.</p>",
    titulo: "La ciencia detrás del rendimiento deportivo óptimo",
    link: "ciencia-detras-del-rendimiento_1713200000000"
  },
  {
    _id: "mock-5",
    fecha_c: 1713100000000,
    imagen_home: "https://images.unsplash.com/photo-1551280655-32e602484433?w=800&h=450&fit=crop",
    imagen_interior: "https://images.unsplash.com/photo-1551280655-32e602484433?w=800&h=450&fit=crop",
    introHTML: "<p>Análisis táctico: Por qué el 4-3-3 moderno está dominando el fútbol europeo.</p>",
    prevId: "mock5",
    secciones: ["futbol"],
    textoHTML: "<p>Una mirada en profundidad a las tácticas modernas que están definiendo el fútbol en las grandes ligas.</p>",
    titulo: "El esquema táctico que revoluciona el fútbol moderno",
    link: "esquema-tactico-futbol-moderno_1713100000000"
  }
]

export function getNewsBySection(seccion: string): NewsItem[] {
  return mockNews.filter((item) => item.secciones.includes(seccion))
}

export function getNewsByLink(seccion: string, link: string): NewsItem | undefined {
  return mockNews.find((item) => item.secciones.includes(seccion) && item.link === link)
}

export function getFeaturedNews(): NewsItem[] {
  return mockNews.slice(0, 3)
}

export function getTrendingNews(): NewsItem[] {
  return mockNews.slice(0, 4)
}

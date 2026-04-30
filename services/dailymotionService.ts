/**
 * Servicio para la integración con la API de Dailymotion.
 * Este archivo centraliza la obtención y normalización de datos de videos.
 */

export interface VideoItem {
  id: string;
  titulo: string;
  thumb: string;
  url: string;
  embedUrl: string;
  shareUrl?: string;
}

/**
 * Interfaz para la respuesta cruda de la API de Dailymotion.
 */
interface DailymotionVideo {
  id: string;
  title: string;
  thumbnail_720_url: string;
  thumbnail_url: string;
  url: string;
  embed_url: string;
  share_url?: string;
}

const PLAYLIST_ID = process.env.NEXT_PUBLIC_DAILYMOTION_PLAYLIST;

/**
 * Obtiene la lista de videos de una playlist específica de Dailymotion.
 * 
 * @returns Promesa que resuelve a un array de VideoItem normalizados.
 * Retorna un array vacío si hay errores o si la configuración es inexistente.
 */
export async function getDailymotionVideos(): Promise<VideoItem[]> {
  if (!PLAYLIST_ID) {
    console.warn('[Dailymotion] Warning: NEXT_PUBLIC_DAILYMOTION_PLAYLIST is not defined in environment variables.');
    return [];
  }

  try {
    // Definimos los campos específicos que queremos recuperar para optimizar la respuesta
    // share_url puede no estar disponible en todas las respuestas, por lo que es opcional
    const fields = 'id,title,thumbnail_720_url,thumbnail_url,url,embed_url';
    const url = `https://api.dailymotion.com/playlist/${PLAYLIST_ID}/videos?limit=20&fields=${fields}`;
    
    // Usamos el cache de Next.js con revalidación de 1 hora (3600 segundos)
    const response = await fetch(url, { 
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      console.error(`[Dailymotion] API error: ${response.status} ${response.statusText} for playlist ${PLAYLIST_ID}`);
      return [];
    }

    const data = await response.json();

    if (!data.list || !Array.isArray(data.list)) {
      console.error('[Dailymotion] Unexpected API response format: "list" field is missing or not an array.');
      return [];
    }

    // Normalizamos la respuesta a nuestro formato interno estable
    return data.list.map((item: DailymotionVideo) => {
      return {
        id: item.id,
        titulo: item.title,
        // Preferimos la miniatura de alta resolución (720), pero tenemos un fallback
        thumb: item.thumbnail_720_url || item.thumbnail_url,
        url: item.url,
        embedUrl: item.embed_url,
        // item.id es el identificador canonico del video en Dailymotion
        shareUrl: item.share_url || `https://dai.ly/${item.id}`,
      };
    });
  } catch (error) {
    // Manejo genérico de errores de red o parseo
    console.error('[Dailymotion] Fetch error:', error);
    return [];
  }
}

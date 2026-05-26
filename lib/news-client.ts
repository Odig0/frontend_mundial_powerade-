const DEFAULT_API_URL = 'https://dev.eldeber.bo/v1'
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_URL

function getApiUrl() {
  if (!API_URL) {
    throw new Error('Missing NEXT_PUBLIC_API_URL. Set it to your backend base URL, for example http://localhost:3000/v1')
  }

  return API_URL.replace(/\/$/, '')
}

function buildUrl(path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${getApiUrl()}${normalizedPath}`
}

async function requestJson<T>(path: string, init: RequestInit = {}): Promise<T> {
  const url = buildUrl(path)

  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...(init.headers ?? {}),
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`Request to ${path} failed with status ${response.status}`)
  }

  return response.json() as Promise<T>
}

export function formatSectionLabel(section: string) {
  if (!section) {
    return ''
  }

  return section.charAt(0).toUpperCase() + section.slice(1)
}

function normalizeSectionValue(section: unknown): string | null {
  if (typeof section === 'string') {
    const trimmed = section.trim()
    return trimmed || null
  }

  if (typeof section === 'number' || typeof section === 'boolean') {
    return String(section)
  }

  if (!section || typeof section !== 'object') {
    return null
  }

  const candidate = section as Record<string, unknown>
  const rawValue =
    candidate.slug ??
    candidate.value ??
    candidate.section ??
    candidate.name ??
    candidate.label ??
    candidate.nombre ??
    candidate.titulo ??
    candidate.id ??
    candidate._id

  if (typeof rawValue === 'string') {
    const trimmed = rawValue.trim()
    return trimmed || null
  }

  if (typeof rawValue === 'number' || typeof rawValue === 'boolean') {
    return String(rawValue)
  }

  return null
}

export async function getAvailableSectionsAll(): Promise<string[]> {
  const sections = await requestJson<unknown[]>('/news/sections/all')
  return sections.map(normalizeSectionValue).filter((section): section is string => Boolean(section))
}

export async function updateNewsSections(id: string, sections: string[]): Promise<void> {
  await requestJson(`/news/${encodeURIComponent(id)}/sections`, {
    method: 'PUT',
    body: JSON.stringify({
      secciones: sections,
    }),
  })
}

export async function assignPosicionPortada(newsId: string, posicionPortada: number): Promise<void> {
  await requestJson('/news/posicion-portada', {
    method: 'POST',
    body: JSON.stringify({
      newsId,
      posicion_portada: posicionPortada,
    }),
  })
}
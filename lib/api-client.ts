export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('authToken')
}

export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('authToken', token)
}

export function clearAuthToken(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem('authToken')
}

interface FetchOptions extends RequestInit {
  includeAuth?: boolean
}

export async function apiFetch(
  url: string,
  options: FetchOptions = {}
): Promise<Response> {
  const { includeAuth = true, ...fetchOptions } = options

  const headers = new Headers(fetchOptions.headers || {})

  if (includeAuth) {
    const token = getAuthToken()
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
  }

  return fetch(url, {
    ...fetchOptions,
    headers,
  })
}

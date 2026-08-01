const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

export function getCached(key: string): any | null {
  const entry = cache.get(key)
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    return entry.data
  }
  return null
}

export function setCache(key: string, data: any): void {
  cache.set(key, { data, timestamp: Date.now() })
}

export async function fetchWithCache(url: string, options?: RequestInit): Promise<any> {
  const cached = getCached(url)
  if (cached) {
    // Refresh in background
    fetch(url, options).then(r => r.json()).then(d => setCache(url, d)).catch(() => {})
    return cached
  }
  
  const res = await fetch(url, options)
  if (!res.ok) throw new Error(`Failed: ${res.status}`)
  const data = await res.json()
  setCache(url, data)
  return data
}
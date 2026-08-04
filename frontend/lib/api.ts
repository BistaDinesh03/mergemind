const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000

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
    fetch(url, options).then(r => r.json()).then(d => setCache(url, d)).catch(() => {})
    return cached
  }
  
  const res = await fetch(url, options)
  if (!res.ok) throw new Error(`Failed: ${res.status}`)
  const data = await res.json()
  setCache(url, data)
  return data
}

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

let backendReady = false
let checkingBackend = false

export async function waitForBackend(): Promise<boolean> {
  if (backendReady) return true
  if (checkingBackend) {
    await new Promise(r => setTimeout(r, 2000))
    return backendReady
  }
  
  checkingBackend = true
  
  for (let i = 0; i < 24; i++) {
    try {
      const res = await fetch(`${API}/health/live`, { signal: AbortSignal.timeout(5000) })
      if (res.ok) {
        backendReady = true
        checkingBackend = false
        return true
      }
    } catch {}
    
    await new Promise(r => setTimeout(r, 5000))
  }
  
  checkingBackend = false
  return false
}
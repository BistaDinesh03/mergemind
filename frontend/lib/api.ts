import { useState, useEffect, useCallback } from "react"

const API_BASE = "http://localhost:8000"

// Simple cache
const cache = new Map<string, { data: any; ts: number }>()
const TTL = 2 * 60 * 1000

export class ApiError extends Error {
  status: number
  constructor(msg: string, status: number) { super(msg); this.status = status }
}

export async function apiFetch<T = any>(endpoint: string, opts?: RequestInit & { skipCache?: boolean }): Promise<T> {
  const url = `${API_BASE}${endpoint}`
  const skipCache = opts?.skipCache || opts?.method === 'POST'
  
  if (!skipCache) {
    const c = cache.get(url)
    if (c && Date.now() - c.ts < TTL) return c.data as T
  }

  const res = await fetch(url, { ...opts, headers: { "Content-Type": "application/json", ...opts?.headers } })
  if (!res.ok) {
    if (res.status === 429) throw new ApiError("Rate limit reached", 429)
    if (res.status === 404) throw new ApiError("Not found", 404)
    if (res.status >= 500) throw new ApiError("Server error", 500)
    throw new ApiError(`Error ${res.status}`, res.status)
  }

  const data = await res.json()
  if (!skipCache) cache.set(url, { data, ts: Date.now() })
  return data as T
}

// Reusable data fetching hook
export function useApi<T = any>(endpoint: string | null) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetch = useCallback(() => {
    if (!endpoint) return
    setLoading(true); setError("")
    apiFetch<T>(endpoint)
      .then(d => { setData(d); setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [endpoint])

  useEffect(() => { fetch() }, [fetch])

  return { data, loading, error, refetch: fetch }
}
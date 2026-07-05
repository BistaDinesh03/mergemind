const API = typeof window !== "undefined" ? process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000" : "http://localhost:8000"
const TIMEOUT = 10000
const CACHE_TTL = 120000

const cache = new Map<string, { data: unknown; ts: number }>()
const inflight = new Map<string, Promise<unknown>>()

export class ApiError extends Error {
  status: number
  constructor(message: string, status = 0) { super(message); this.status = status; this.name = "ApiError" }
}

async function fetchWithTimeout(url: string, init?: RequestInit): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT)
  try {
    const res = await fetch(url, { ...init, signal: controller.signal })
    return res
  } catch (err: unknown) {
    const error = err as Error
    if (error.name === "AbortError") throw new ApiError("Request timed out", 408)
    if (error.message === "Failed to fetch") throw new ApiError("Cannot connect to server", 0)
    throw new ApiError(error.message || "Network error", 0)
  } finally { clearTimeout(timer) }
}

export async function apiFetch<T = unknown>(endpoint: string, options?: { skipCache?: boolean; method?: string; body?: unknown }): Promise<T> {
  const url = `${API}${endpoint}`
  const skipCache = options?.skipCache || options?.method === "POST"
  const cacheKey = `${options?.method || "GET"}:${endpoint}`

  // Return cached data
  if (!skipCache) {
    const cached = cache.get(cacheKey)
    if (cached && Date.now() - cached.ts < CACHE_TTL) return cached.data as T
  }

  // Deduplicate in-flight requests
  if (!skipCache) {
    const pending = inflight.get(cacheKey)
    if (pending) return pending as Promise<T>
  }

  const promise = (async () => {
    const res = await fetchWithTimeout(url, {
      method: options?.method || "GET",
      headers: { "Content-Type": "application/json" },
      body: options?.body ? JSON.stringify(options.body) : undefined,
    })

    if (!res.ok) {
      if (res.status === 404) throw new ApiError("Resource not found", 404)
      if (res.status === 401) throw new ApiError("Authentication required", 401)
      if (res.status === 429) throw new ApiError("Too many requests", 429)
      if (res.status >= 500) throw new ApiError("Server error", res.status)
      throw new ApiError(`Request failed (${res.status})`, res.status)
    }

    const data = await res.json()
    if (!skipCache) cache.set(cacheKey, { data, ts: Date.now() })
    return data as T
  })()

  if (!skipCache) {
    inflight.set(cacheKey, promise)
    promise.finally(() => inflight.delete(cacheKey))
  }

  return promise
}

// Clean expired cache entries
if (typeof window !== "undefined") {
  setInterval(() => {
    const now = Date.now()
    for (const [k, v] of cache) { if (now - v.ts > CACHE_TTL) cache.delete(k) }
  }, 60000)
}
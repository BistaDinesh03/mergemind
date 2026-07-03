// ============================================================
// MergeMind API Client — Timeouts, Retries, Error Recovery
// ============================================================

const API_BASE = "http://localhost:8000"
const TIMEOUT = 10000 // 10 seconds
const MAX_RETRIES = 1

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number = 0) {
    super(message)
    this.status = status
    this.name = "ApiError"
  }
}

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = TIMEOUT): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    })
    return response
  } catch (err: any) {
    if (err.name === "AbortError") {
      throw new ApiError("Request timed out. The server took too long to respond.", 408)
    }
    if (err.message === "Failed to fetch" || err.name === "TypeError") {
      throw new ApiError("Cannot connect to server. Is it running?", 0)
    }
    throw new ApiError(err.message || "Network error", 0)
  } finally {
    clearTimeout(timer)
  }
}

export async function apiFetch<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`
  let lastError: ApiError | null = null

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetchWithTimeout(url, {
        ...options,
        headers: { "Content-Type": "application/json", ...options.headers },
      })

      if (!res.ok) {
        if (res.status === 404) throw new ApiError("Resource not found", 404)
        if (res.status === 403) throw new ApiError("Access denied. Check your GitHub token.", 403)
        if (res.status === 429) throw new ApiError("Too many requests. Please wait a moment.", 429)
        if (res.status >= 500) throw new ApiError("Server error. Please try again.", res.status)
        throw new ApiError(`Request failed (${res.status})`, res.status)
      }

      return await res.json()
    } catch (err) {
      lastError = err instanceof ApiError ? err : new ApiError("Unexpected error", 0)
      
      // Only retry on server errors or timeouts
      if (lastError.status >= 500 || lastError.status === 408 || lastError.status === 0) {
        if (attempt < MAX_RETRIES) {
          await new Promise(r => setTimeout(r, 1000)) // Wait 1 second
          continue
        }
      } else {
        break // Don't retry client errors
      }
    }
  }

  throw lastError || new ApiError("Request failed")
}

// Cache for GET requests
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 2 * 60 * 1000 // 2 minutes

export async function cachedFetch<T = any>(endpoint: string): Promise<T> {
  const cached = cache.get(endpoint)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data as T
  }

  const data = await apiFetch<T>(endpoint)
  cache.set(endpoint, { data, timestamp: Date.now() })
  return data
}
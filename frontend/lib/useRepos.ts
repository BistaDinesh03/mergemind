import { useState, useEffect, useCallback } from "react"
import { apiFetch } from "./api"
import type { GitHubRepo } from "@/types"

interface UseReposOptions {
  query?: string
  language?: string
  sort?: string
  page?: number
}

export function useRepos(options: UseReposOptions = {}) {
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchRepos = useCallback(async () => {
    setLoading(true); setError("")
    try {
      const params = new URLSearchParams()
      if (options.query) params.set("query", options.query)
      if (options.language) params.set("language", options.language)
      if (options.sort) params.set("sort", options.sort)
      if (options.page) params.set("page", String(options.page || 1))

      const data = await apiFetch<{ repositories: GitHubRepo[]; total: number }>(`/api/github/repositories?${params}`)
      setRepos(data.repositories || [])
      setTotal(data.total || 0)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [options.query, options.language, options.sort, options.page])

  useEffect(() => { fetchRepos() }, [fetchRepos])

  return { repos, total, loading, error, refetch: fetchRepos }
}
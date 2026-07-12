"use client"
import { useState, useEffect, useCallback } from "react"
import { Navbar } from "@/components/Navbar"
import { SearchBar } from "@/components/SearchBar"
import { LanguageFilter } from "@/components/LanguageFilter"
import { RepoCard } from "@/components/RepoCard"
import { RepoCardSkeleton } from "@/components/Skeletons"
import { ErrorDisplay } from "@/components/ErrorDisplay"
import { Compass } from "lucide-react"

const API = process.env.NEXT_PUBLIC_API_URL || ""

export default function DiscoverPage() {
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [language, setLanguage] = useState("")
  const [sort, setSort] = useState("stars")

  const fetchRepos = useCallback(async (searchQuery = "") => {
    if (!API) {
      setError("API URL not configured")
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.append("query", searchQuery)
      if (language) params.append("language", language)
      params.append("sort", sort)
      
      const res = await fetch(`${API}/api/github/repositories?${params}`)
      if (!res.ok) throw new Error("Failed to fetch repositories")
      const data = await res.json()
      setRepos(data.repositories || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [language, sort])

  useEffect(() => {
    fetchRepos()
  }, [fetchRepos])

  const handleSearch = (query: string) => {
    fetchRepos(query)
  }

  if (!API) {
    return (
      <div className="min-h-screen bg-[#09090b] text-white">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <p className="text-zinc-400">API configuration missing. Set NEXT_PUBLIC_API_URL.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center gap-2 mb-8">
          <Compass className="w-5 h-5 text-purple-400" />
          <h1 className="text-2xl font-bold">Discover Repositories</h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <SearchBar onSearch={handleSearch} />
          <LanguageFilter selected={language} onSelect={setLanguage} />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="h-[50px] px-4 bg-[#1a1a2e] border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500"
          >
            <option value="stars">Most Stars</option>
            <option value="forks">Most Forks</option>
            <option value="updated">Recently Updated</option>
          </select>
        </div>

        {loading && (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <RepoCardSkeleton key={i} />
            ))}
          </div>
        )}

        {error && !loading && (
          <ErrorDisplay type="server" message={error} onRetry={() => fetchRepos()} />
        )}

        {!loading && !error && repos.length === 0 && (
          <div className="text-center py-16">
            <Compass className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <p className="text-sm text-zinc-500">No repositories found. Try different search terms.</p>
          </div>
        )}

        {!loading && !error && repos.length > 0 && (
          <div className="space-y-4">
            {repos.map((repo: any) => (
              <RepoCard key={repo.id} repo={repo} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
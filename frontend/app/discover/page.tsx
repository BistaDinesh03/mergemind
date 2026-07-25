"use client"
import { useState, useEffect, useCallback, useRef } from "react"
import { Navbar } from "@/components/Navbar"
import { SearchBar } from "@/components/SearchBar"
import { LanguageFilter } from "@/components/LanguageFilter"
import { RepoCard } from "@/components/RepoCard"
import { IssueCard } from "@/components/IssueCard"
import { RepoCardSkeleton } from "@/components/Skeletons"
import { ErrorDisplay } from "@/components/ErrorDisplay"
import { EmptyState } from "@/components/EmptyState"
import { Compass, GitPullRequest, BookOpen, SlidersHorizontal } from "lucide-react"

const API = process.env.NEXT_PUBLIC_API_URL || ""

export default function DiscoverPage() {
  const [mode, setMode] = useState<"issues" | "repos">("issues")
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchLoading, setSearchLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [language, setLanguage] = useState("")
  const [difficulty, setDifficulty] = useState("beginner")
  const [sort, setSort] = useState("updated")
  const [searchQuery, setSearchQuery] = useState("")
  const abortRef = useRef<AbortController | null>(null)
  const initialFetchDone = useRef(false)

  const fetchItems = useCallback(async (query = "") => {
    if (!API) { setError("API URL not configured"); setLoading(false); return }
    if (abortRef.current) abortRef.current.abort()
    abortRef.current = new AbortController()
    if (query) { setSearchLoading(true) } else { setLoading(true) }
    setError(null)
    setSearchQuery(query)

    try {
      const params = new URLSearchParams()
      if (query) params.append("query", query)
      if (language) params.append("language", language)
      params.append("sort", sort)
      params.append("per_page", "20")

      let endpoint: string
      if (mode === "issues") {
        const labels = difficulty === "beginner" ? "good+first+issue,help+wanted,beginner" : "help+wanted"
        endpoint = `${API}/api/github/search/issues?labels=${labels}&${params}`
      } else {
        endpoint = `${API}/api/github/repositories?${params}`
      }

      const res = await fetch(endpoint, { signal: abortRef.current.signal })
      if (!res.ok) throw new Error("Failed to fetch")
      const data = await res.json()
      setItems(mode === "issues" ? (data.issues || []) : (data.repositories || []))
    } catch (err: any) {
      if (err.name === "AbortError") return
      setError(err.message)
    } finally {
      setLoading(false)
      setSearchLoading(false)
    }
  }, [language, sort, mode, difficulty])

  useEffect(() => {
    if (!initialFetchDone.current) { initialFetchDone.current = true; fetchItems() }
    return () => { if (abortRef.current) abortRef.current.abort() }
  }, [fetchItems])

  if (!API) {
    return (
      <div className="min-h-screen bg-[#09090b] text-white"><Navbar />
        <div className="flex items-center justify-center py-32"><p className="text-zinc-400">API configuration missing.</p></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-12 animate-fadeIn">
        <div className="flex items-center gap-2 mb-6">
          <Compass className="w-5 h-5 text-purple-400" />
          <h1 className="text-2xl font-bold">Discover</h1>
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center gap-1 mb-6 bg-[#18181b] rounded-[14px] p-1 w-fit">
          <button onClick={() => setMode("issues")}
            className={`px-4 py-2 rounded-[12px] text-sm font-medium transition-all flex items-center gap-2 ${mode === "issues" ? "bg-purple-500/20 text-purple-300" : "text-zinc-500 hover:text-zinc-300"}`}>
            <GitPullRequest className="w-4 h-4" /> Issues
          </button>
          <button onClick={() => setMode("repos")}
            className={`px-4 py-2 rounded-[12px] text-sm font-medium transition-all flex items-center gap-2 ${mode === "repos" ? "bg-purple-500/20 text-purple-300" : "text-zinc-500 hover:text-zinc-300"}`}>
            <BookOpen className="w-4 h-4" /> Repositories
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <SearchBar onSearch={(q) => fetchItems(q)} loading={searchLoading} placeholder={mode === "issues" ? "Search issues..." : "Search repositories..."} />
          <LanguageFilter selected={language} onSelect={setLanguage} />
          {mode === "issues" && (
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}
              className="h-[50px] px-4 bg-[#1a1a2e] border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500">
              <option value="beginner">🟢 Beginner</option>
              <option value="all">All Levels</option>
            </select>
          )}
          <select value={sort} onChange={(e) => setSort(e.target.value)}
            className="h-[50px] px-4 bg-[#1a1a2e] border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500">
            <option value="updated">Recently Updated</option>
            <option value="stars">Most Stars</option>
            <option value="created">Newest</option>
          </select>
        </div>

        {/* Search Context */}
        {!loading && items.length > 0 && (
          <p className="text-xs text-zinc-600 mb-6">
            Showing {items.length} {mode === "issues" ? "issues" : "repositories"}
            {searchQuery && <> matching &quot;{searchQuery}&quot;</>}
            {language && <> in {language}</>}
            {mode === "issues" && difficulty === "beginner" && <> · beginner-friendly</>}
          </p>
        )}

        {/* Results */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (<RepoCardSkeleton key={i} />))}
          </div>
        )}

        {error && !loading && <ErrorDisplay type="server" message={error} onRetry={() => fetchItems()} />}

        {!loading && !error && items.length === 0 && (
          <EmptyState kind="discover" action={{ label: "Clear Filters", onClick: () => { setLanguage(""); setDifficulty("beginner"); fetchItems() } }} />
        )}

        {!loading && !error && items.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((item: any) =>
              mode === "issues" ? <IssueCard key={item.id} issue={item} /> : <RepoCard key={item.id} repo={item} />
            )}
          </div>
        )}
      </main>
    </div>
  )
}
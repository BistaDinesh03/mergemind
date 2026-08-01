"use client"
import { useState, useEffect, useRef } from "react"
import { Navbar } from "@/components/Navbar"
import { SearchBar } from "@/components/SearchBar"
import { LanguageFilter } from "@/components/LanguageFilter"
import { RepoCard } from "@/components/RepoCard"
import { IssueCard } from "@/components/IssueCard"
import { RepoCardSkeleton } from "@/components/Skeletons"
import { ErrorDisplay } from "@/components/ErrorDisplay"
import { EmptyState } from "@/components/EmptyState"
import { fetchWithCache } from "@/lib/api"
import { Compass, GitPullRequest, BookOpen, TrendingUp, Sparkles, Zap, Bug } from "lucide-react"

const API = process.env.NEXT_PUBLIC_API_URL || ""

const QUICK_FILTERS = [
  { id: "trending", label: "Trending", icon: TrendingUp },
  { id: "recommended", label: "Recommended", icon: Sparkles },
  { id: "beginner", label: "Beginner", icon: Compass },
  { id: "fast", label: "Fast (<1h)", icon: Zap },
  { id: "bug", label: "Bug Fixes", icon: Bug },
]

export default function DiscoverPage() {
  const [mode, setMode] = useState<"issues" | "repos">("issues")
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [hasLoaded, setHasLoaded] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [language, setLanguage] = useState("")
  const [sort, setSort] = useState("updated")
  const [activeQuickFilter, setActiveQuickFilter] = useState("")
  const abortRef = useRef<AbortController | null>(null)
  const modeRef = useRef<"issues" | "repos">("issues")

  const doFetch = async (currentMode: "issues" | "repos", query: string = "") => {
    if (!API) { setError("API URL not configured"); setLoading(false); setHasLoaded(true); return }
    if (abortRef.current) abortRef.current.abort()
    abortRef.current = new AbortController()
    if (query) { setSearchLoading(true) } else { setLoading(true) }
    setError(null)

    const startTime = performance.now()

    try {
      const params = new URLSearchParams()
      if (query) params.append("query", query)
      if (language) params.append("language", language)
      params.append("sort", sort)
      params.append("per_page", "20")

      let endpoint: string
      if (currentMode === "issues") {
        let labels = "good+first+issue,help+wanted"
        if (activeQuickFilter === "bug") labels = "bug,good+first+issue"
        if (activeQuickFilter === "beginner") labels = "good+first+issue,beginner"
        endpoint = `${API}/api/github/search/issues?labels=${labels}&${params}`
      } else {
        endpoint = `${API}/api/github/repositories?${params}`
      }

      const data = await fetchWithCache(endpoint)
      setItems(currentMode === "issues" ? (data.issues || []) : (data.repositories || []))
      console.log(`Discover loaded in ${Math.round(performance.now() - startTime)}ms`)
    } catch (err: any) {
      if (err.name === "AbortError") return
      setError(err.message)
    } finally {
      setLoading(false)
      setSearchLoading(false)
      setHasLoaded(true)
    }
  }

  useEffect(() => {
    doFetch("issues")
    return () => { if (abortRef.current) abortRef.current.abort() }
  }, [])

  const switchMode = (newMode: "issues" | "repos") => {
    if (newMode === modeRef.current) return
    modeRef.current = newMode
    setMode(newMode)
    setItems([])
    setHasLoaded(false)
    setLoading(true)
    setError(null)
    doFetch(newMode)
  }

  const handleQuickFilter = (filterId: string) => {
    const newFilter = activeQuickFilter === filterId ? "" : filterId
    setActiveQuickFilter(newFilter)
    setItems([])
    setHasLoaded(false)
    setLoading(true)
    setError(null)
    modeRef.current = "issues"
    setMode("issues")
    setTimeout(() => doFetch("issues"), 0)
  }

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
      <main className="max-w-6xl mx-auto px-6 py-12">
        
        <div className="flex items-center gap-3 mb-8">
          <Compass className="w-6 h-6 text-purple-400" />
          <h1 className="text-2xl font-bold tracking-tight">Discover</h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1">
            <SearchBar onSearch={(q) => doFetch(modeRef.current, q)} loading={searchLoading} placeholder="Search issues..." />
          </div>
          <div className="flex items-center gap-1 bg-[#18181b] rounded-[12px] p-1">
            <button onClick={() => switchMode("issues")}
              className={`px-4 py-2 rounded-[10px] text-sm font-medium transition-colors flex items-center gap-2 ${mode === "issues" ? "bg-white text-zinc-900" : "text-zinc-400 hover:text-white"}`}>
              <GitPullRequest className="w-4 h-4" /> Issues
            </button>
            <button onClick={() => switchMode("repos")}
              className={`px-4 py-2 rounded-[10px] text-sm font-medium transition-colors flex items-center gap-2 ${mode === "repos" ? "bg-white text-zinc-900" : "text-zinc-400 hover:text-white"}`}>
              <BookOpen className="w-4 h-4" /> Repos
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          {QUICK_FILTERS.map(f => (
            <button key={f.id} onClick={() => handleQuickFilter(f.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg transition-colors ${
                activeQuickFilter === f.id ? "bg-white text-zinc-900" : "bg-[#1a1a2e] text-zinc-400 border border-gray-700/50 hover:text-white"
              }`}>
              <f.icon className="w-3 h-3" /> {f.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <LanguageFilter selected={language} onSelect={setLanguage} />
          <select value={sort} onChange={(e) => setSort(e.target.value)}
            className="h-9 px-3 bg-[#1a1a2e] border border-gray-700/50 rounded-lg text-white text-xs focus:outline-none focus:border-purple-500">
            <option value="updated">Recently Updated</option>
            <option value="stars">Most Stars</option>
          </select>
        </div>

        {!loading && items.length > 0 && (
          <p className="text-sm text-zinc-500 mb-6">
            {items.length.toLocaleString()} {mode === "issues" ? "issues" : "repositories"} found
            {language && <> in {language}</>}
          </p>
        )}

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (<RepoCardSkeleton key={i} />))}
          </div>
        )}

        {error && !loading && <ErrorDisplay type="server" message={error} onRetry={() => doFetch(modeRef.current)} />}

        {hasLoaded && !loading && !error && items.length === 0 && (
          <EmptyState kind="discover" action={{ label: "Clear Filters", onClick: () => { setLanguage(""); setActiveQuickFilter(""); doFetch(modeRef.current) } }} />
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
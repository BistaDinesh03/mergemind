"use client"
import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { Navbar } from "@/components/Navbar"
import { EmptyState } from "@/components/EmptyState"
import { ErrorDisplay } from "@/components/ErrorDisplay"
import { Search, X, Star, GitFork, AlertCircle, Clock, Sparkles } from "lucide-react"

const API = "http://localhost:8000"
const LANGUAGES = ["Python", "JavaScript", "TypeScript", "Rust", "Go"]

function RepoCard({ repo }: { repo: any }) {
  const daysAgo = Math.floor((Date.now() - new Date(repo.updated_at).getTime()) / 86400000)
  return (
    <Link href={`/repo/${repo.full_name}`}
      className="block bg-[#18181b] border border-[#27272a] rounded-[20px] p-5 hover:border-zinc-600 hover:-translate-y-0.5 transition-all duration-200 group">
      <div className="flex items-start gap-3 mb-3">
        <Image src={repo.owner?.avatar || ""} alt="" width={40} height={40} className="rounded-full ring-1 ring-[#27272a] flex-shrink-0" loading="lazy" />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm truncate group-hover:text-white transition-colors">{repo.full_name}</h3>
          <p className="text-xs text-zinc-500">{repo.owner?.login}</p>
        </div>
        {repo.recommended && (
          <span className="flex items-center gap-1 px-2 py-1 bg-purple-500/10 text-purple-300 rounded-full text-[10px] font-medium border border-purple-500/20 flex-shrink-0">
            <Sparkles className="w-2.5 h-2.5" /> AI Pick
          </span>
        )}
      </div>
      <p className="text-sm text-zinc-400 mb-3 line-clamp-2 leading-relaxed">{repo.description || "No description"}</p>
      <div className="flex items-center gap-3 text-xs text-zinc-500 pt-3 border-t border-[#27272a]">
        {repo.language && <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-yellow-400"/>{repo.language}</span>}
        <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-400"/> {repo.stars?.toLocaleString()||0}</span>
        <span className="flex items-center gap-1"><GitFork className="w-3 h-3"/> {repo.forks?.toLocaleString()||0}</span>
        <span className="flex items-center gap-1 ml-auto text-zinc-600"><Clock className="w-2.5 h-2.5"/> {daysAgo}d</span>
      </div>
    </Link>
  )
}

function SkeletonCard() {
  return (
    <div className="bg-[#18181b] border border-[#27272a] rounded-[20px] p-5 space-y-3 animate-pulse">
      <div className="flex items-start gap-3"><div className="w-10 h-10 skeleton rounded-full"/><div className="flex-1 space-y-2"><div className="h-4 w-3/4 skeleton rounded"/><div className="h-3 w-1/3 skeleton rounded"/></div></div>
      <div className="h-4 w-full skeleton rounded"/><div className="h-4 w-2/3 skeleton rounded"/>
      <div className="flex gap-3 pt-3 border-t border-[#27272a]"><div className="h-3 w-12 skeleton rounded"/><div className="h-3 w-12 skeleton rounded"/></div>
    </div>
  )
}

export default function DiscoverPage() {
  const [repos, setRepos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchInput, setSearchInput] = useState("")
  const [search, setSearch] = useState("")
  const [language, setLanguage] = useState("")
  const [sort, setSort] = useState("stars")

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput), 150)
    return () => clearTimeout(timer)
  }, [searchInput])

  const fetchRepos = () => {
    setLoading(true)
    setError(null)
    
    fetch(`${API}/api/github/repositories?sort=${sort}`)
      .then(r => {
        if (!r.ok) {
          if (r.status === 403 || r.status === 429) throw new Error("GitHub API rate limit reached. Please wait a moment and try again.")
          if (r.status >= 500) throw new Error("Server error. Please try again later.")
          throw new Error(`Unable to load repositories (${r.status})`)
        }
        return r.json()
      })
      .then(d => {
        setRepos(d.repositories || [])
        setLoading(false)
      })
      .catch(err => {
        setError(err.message || "Unable to load repositories. Check your connection and try again.")
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchRepos()
  }, [sort])

  // Memoized filtering
  const filtered = useMemo(() => {
    return repos.filter(r => {
      if (language && r.language !== language) return false
      if (search && !r.full_name.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [repos, language, search])

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-10 space-y-6">
        
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Discover Repositories</h1>
          <p className="text-sm text-zinc-500 mt-1.5">
            {loading ? "Loading repositories..." : error ? null : `${filtered.length} repositories found`}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Search by name..."
              className="w-full h-11 pl-11 pr-10 bg-[#18181b] border border-[#27272a] rounded-[14px] text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40"
            />
            {searchInput && (
              <button onClick={() => { setSearchInput(""); setSearch("") }} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <select value={sort} onChange={e => setSort(e.target.value)}
            className="h-11 px-4 bg-[#18181b] border border-[#27272a] rounded-[14px] text-white text-sm">
            <option value="stars">Most Stars</option>
            <option value="updated">Recently Updated</option>
            <option value="forks">Most Forks</option>
          </select>
        </div>

        <div className="flex flex-wrap gap-2">
          <button onClick={() => setLanguage("")}
            className={`px-4 py-2 text-sm rounded-[14px] font-medium transition-all duration-200 ${!language ? "bg-white text-zinc-900" : "bg-[#18181b] text-zinc-400 border border-[#27272a] hover:border-zinc-600"}`}>All</button>
          {LANGUAGES.map(lang => (
            <button key={lang} onClick={() => setLanguage(lang)}
              className={`px-4 py-2 text-sm rounded-[14px] font-medium transition-all duration-200 ${language === lang ? "bg-white text-zinc-900" : "bg-[#18181b] text-zinc-400 border border-[#27272a] hover:border-zinc-600"}`}>{lang}</button>
          ))}
        </div>

        {/* ERROR STATE */}
        {error && !loading && (
          <ErrorDisplay
            type="api"
            message={error}
            onRetry={fetchRepos}
          />
        )}

        {/* LOADING STATE */}
        {loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* EMPTY STATE — only shown when no error and no loading */}
        {!loading && !error && filtered.length === 0 && (
          <EmptyState type={search ? "search" : "repos"} />
        )}

        {/* SUCCESS STATE */}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filtered.map((repo, i) => <RepoCard key={i} repo={repo} />)}
          </div>
        )}

      </main>
    </div>
  )
}
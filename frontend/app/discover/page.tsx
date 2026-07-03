"use client"
import { useState, useEffect } from "react"
import { Navbar } from "@/components/Navbar"
import { RepoCard, RepoCardSkeleton } from "@/components/RepoCard"
import { EmptyState } from "@/components/EmptyState"
import { Search } from "lucide-react"

const LANGUAGES = ["Python", "JavaScript", "TypeScript", "Rust", "Go"]

export default function DiscoverPage() {
  const [search, setSearch] = useState("")
  const [language, setLanguage] = useState("")
  const [repos, setRepos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.title = "Discover — MergeMind"
    setLoading(true)
    fetch("http://localhost:8000/api/github/repositories")
      .then(r => r.json())
      .then(d => { setRepos(d.repositories || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = repos.filter(r => {
    if (language && r.language !== language) return false
    if (search && !r.full_name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <Navbar />
      <main id="main-content" className="max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-10 space-y-6 sm:space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Discover Repositories</h1>
          <p className="text-sm sm:text-base text-zinc-400 mt-1 sm:mt-2">Find the perfect project to contribute to</p>
          {!loading && <p className="text-xs sm:text-sm text-zinc-600 mt-1">{filtered.length} repositories found</p>}
        </div>

        <div className="space-y-3 sm:space-y-4">
          <div className="relative">
            <Search className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-zinc-500" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search repositories..."
              className="w-full h-12 sm:h-[52px] pl-11 sm:pl-14 pr-4 sm:pr-6 bg-[#18181b] border border-white/[0.04] rounded-[14px] text-white placeholder-zinc-500 text-base focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all duration-200" />
          </div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            <button onClick={() => setLanguage("")} className={`px-3 sm:px-4 py-2 sm:py-2 text-xs sm:text-sm rounded-[14px] font-medium transition-all duration-200 ${!language?"bg-white text-zinc-900":"bg-[#18181b] text-zinc-400 border border-white/[0.04] hover:border-white/[0.08]"}`}>All</button>
            {LANGUAGES.map(lang => (
              <button key={lang} onClick={() => setLanguage(lang)} className={`px-3 sm:px-4 py-2 sm:py-2 text-xs sm:text-sm rounded-[14px] font-medium transition-all duration-200 ${language===lang?"bg-white text-zinc-900":"bg-[#18181b] text-zinc-400 border border-white/[0.04] hover:border-white/[0.08]"}`}>{lang}</button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
            {[...Array(6)].map((_, i) => <RepoCardSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState type={search ? "search" : "repos"} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
            {filtered.map((repo, i) => <RepoCard key={i} repo={repo} />)}
          </div>
        )}
      </main>
    </div>
  )
}
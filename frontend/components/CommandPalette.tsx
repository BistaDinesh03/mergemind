"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Search, Star, Clock, X, ArrowRight, Sparkles, Loader2 } from "lucide-react"

const API = process.env.NEXT_PUBLIC_API_URL || ""

interface RepoResult {
  id: number
  full_name: string
  description: string
  stars: number
  language: string
}

export function CommandPalette({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<RepoResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem("recentSearches")
    if (stored) setRecentSearches(JSON.parse(stored))
  }, [])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
      setQuery("")
      setSelectedIndex(0)
      setResults([])
      setError("")
    }
  }, [isOpen])

  // Real API search with debounce
  useEffect(() => {
    if (!query.trim() || !API) {
      setResults([])
      setError("")
      return
    }

    if (debounceRef.current) clearTimeout(debounceRef.current)
    
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      setError("")
      try {
        const res = await fetch(`${API}/api/github/repositories?query=${encodeURIComponent(query)}&per_page=8`)
        if (!res.ok) throw new Error("Search failed")
        const data = await res.json()
        setResults(data.repositories || [])
      } catch {
        setError("Search unavailable")
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 250)

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [query])

  const saveRecent = (term: string) => {
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem("recentSearches", JSON.stringify(updated))
  }

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const items = results
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex(prev => Math.min(prev + 1, items.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex(prev => Math.max(prev - 1, 0))
    } else if (e.key === "Enter") {
      e.preventDefault()
      const selected = items[selectedIndex]
      if (selected) {
        saveRecent(selected.full_name)
        router.push(`/repo/${selected.full_name}`)
        onClose()
      }
    } else if (e.key === "Escape") {
      onClose()
    }
  }, [results, selectedIndex, router, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-xl bg-[#18181b] border border-[#27272a] rounded-[20px] shadow-2xl overflow-hidden">
        
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#27272a]">
          {loading ? (
            <Loader2 className="w-5 h-5 text-purple-400 animate-spin flex-shrink-0" />
          ) : (
            <Search className="w-5 h-5 text-zinc-500 flex-shrink-0" />
          )}
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search repositories..."
            className="flex-1 bg-transparent text-white text-lg placeholder-zinc-500 outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-[10px] text-zinc-500 bg-[#27272a] rounded-md font-mono">⌘K</kbd>
          <button onClick={onClose} className="text-zinc-500 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {!query && recentSearches.length > 0 && (
            <div className="px-3 py-3">
              <p className="px-3 py-1.5 text-[10px] text-zinc-500 uppercase tracking-wider font-medium">Recent</p>
              {recentSearches.map((term, i) => (
                <button key={i} onClick={() => setQuery(term)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-sm text-zinc-400 hover:text-white hover:bg-[#27272a]/50 text-left">
                  <Clock className="w-4 h-4 text-zinc-600" />{term}
                </button>
              ))}
            </div>
          )}

          {query && !loading && !error && results.length === 0 && (
            <div className="px-6 py-10 text-center">
              <Search className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
              <p className="text-sm text-zinc-500">No repositories found</p>
            </div>
          )}

          {error && (
            <div className="px-6 py-10 text-center">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {results.length > 0 && (
            <div className="px-3 pb-3 space-y-1">
              <p className="px-3 py-1.5 text-[10px] text-zinc-500 uppercase tracking-wider font-medium">Results ({results.length})</p>
              {results.map((repo, i) => {
                const isSelected = i === selectedIndex
                return (
                  <button
                    key={repo.id}
                    onClick={() => { saveRecent(repo.full_name); router.push(`/repo/${repo.full_name}`); onClose() }}
                    className={`w-full flex items-center gap-4 px-3 py-3 rounded-[12px] text-left transition-all ${
                      isSelected ? "bg-purple-500/10 border border-purple-500/20" : "hover:bg-[#27272a]/30"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-[#27272a] flex items-center justify-center flex-shrink-0">
                      <span className="text-xs text-zinc-400 font-bold">{repo.full_name?.[0]?.toUpperCase() || "?"}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium truncate">{repo.full_name}</span>
                        {repo.stars > 100000 && <Sparkles className="w-3 h-3 text-yellow-400 flex-shrink-0" />}
                      </div>
                      <p className="text-xs text-zinc-500 truncate mt-0.5">{repo.description || "No description"}</p>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-zinc-600 flex-shrink-0">
                      <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-400" />{(repo.stars / 1000).toFixed(0)}k</span>
                      <span>{repo.language}</span>
                      <ArrowRight className={`w-3.5 h-3.5 transition-all ${isSelected ? "text-purple-400 translate-x-0.5" : "opacity-0"}`} />
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 px-5 py-3 border-t border-[#27272a] text-[10px] text-zinc-600">
          <span>↑↓ Navigate</span><span>↵ Open</span><span>Esc Close</span>
        </div>
      </div>
    </div>
  )
}
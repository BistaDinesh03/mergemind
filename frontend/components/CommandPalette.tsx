"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Search, Star, GitFork, Clock, TrendingUp, X, ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

interface RepoResult {
  full_name: string
  description: string
  stars: number
  language: string
  updated_at: string
}

const POPULAR_REPOS: RepoResult[] = [
  { full_name: "fastapi/fastapi", description: "FastAPI framework, high performance", stars: 99600, language: "Python", updated_at: "2026-07-03" },
  { full_name: "vercel/next.js", description: "The React Framework for the Web", stars: 140300, language: "JavaScript", updated_at: "2026-07-02" },
  { full_name: "microsoft/vscode", description: "Visual Studio Code", stars: 187000, language: "TypeScript", updated_at: "2026-07-03" },
  { full_name: "pallets/flask", description: "Python micro framework", stars: 69000, language: "Python", updated_at: "2026-06-28" },
  { full_name: "rust-lang/rust", description: "Reliable and efficient software", stars: 102000, language: "Rust", updated_at: "2026-07-03" },
  { full_name: "golang/go", description: "The Go programming language", stars: 129000, language: "Go", updated_at: "2026-07-02" },
  { full_name: "facebook/react", description: "Library for web UIs", stars: 225000, language: "JavaScript", updated_at: "2026-07-03" },
  { full_name: "tiangolo/sqlmodel", description: "SQL databases in Python", stars: 15000, language: "Python", updated_at: "2026-06-15" },
]

export function CommandPalette({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<RepoResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("recentSearches")
    if (stored) setRecentSearches(JSON.parse(stored))
  }, [])

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
      setQuery("")
      setSelectedIndex(0)
    }
  }, [isOpen])

  // Search logic with debounce
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }
    const timer = setTimeout(() => {
      const q = query.toLowerCase()
      const filtered = POPULAR_REPOS.filter(r =>
        r.full_name.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.language.toLowerCase().includes(q)
      )
      setResults(filtered)
      setSelectedIndex(0)
    }, 100)
    return () => clearTimeout(timer)
  }, [query])

  // Save to recent searches
  const saveRecent = (term: string) => {
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem("recentSearches", JSON.stringify(updated))
  }

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const items = query ? results : POPULAR_REPOS
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
  }, [query, results, selectedIndex, router, onClose])

  // Global Cmd+K listener
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        isOpen ? onClose() : onClose() // Toggle handled by parent
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const displayItems = query ? results : POPULAR_REPOS
  const showRecent = !query && recentSearches.length > 0

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      {/* Palette */}
      <div className="relative w-full max-w-xl bg-[#18181b] border border-[#27272a] rounded-[20px] shadow-2xl shadow-black/50 overflow-hidden animate-scaleIn">
        
        {/* Search Input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#27272a]">
          <Search className="w-5 h-5 text-zinc-500 flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search repositories..."
            className="flex-1 bg-transparent text-white text-lg placeholder-zinc-500 outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-[10px] text-zinc-500 bg-[#27272a] rounded-md font-mono">
            <span>⌘</span>K
          </kbd>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-80 overflow-y-auto">
          
          {/* Recent Searches */}
          {showRecent && (
            <div className="px-3 py-3">
              <p className="px-3 py-1.5 text-[10px] text-zinc-500 uppercase tracking-wider font-medium">Recent</p>
              {recentSearches.map((term, i) => (
                <button
                  key={i}
                  onClick={() => { setQuery(term); saveRecent(term) }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-sm text-zinc-400 hover:text-white hover:bg-[#27272a]/50 transition-all duration-150 text-left"
                >
                  <Clock className="w-4 h-4 text-zinc-600" />
                  {term}
                </button>
              ))}
            </div>
          )}

          {/* Section Label */}
          <div className="px-3 py-2">
            <p className="px-3 py-1.5 text-[10px] text-zinc-500 uppercase tracking-wider font-medium">
              {query ? `Results (${results.length})` : "Popular Repositories"}
            </p>
          </div>

          {/* Results / Popular */}
          {displayItems.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <Search className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
              <p className="text-sm text-zinc-500">No repositories found</p>
              <p className="text-xs text-zinc-600 mt-1">Try a different search term</p>
            </div>
          ) : (
            <div className="px-3 pb-3 space-y-1">
              {displayItems.map((repo, i) => {
                const isSelected = i === selectedIndex
                return (
                  <button
                    key={repo.full_name}
                    onClick={() => {
                      saveRecent(repo.full_name)
                      router.push(`/repo/${repo.full_name}`)
                      onClose()
                    }}
                    className={`w-full flex items-center gap-4 px-3 py-3 rounded-[12px] text-left transition-all duration-100 ${
                      isSelected ? "bg-purple-500/10 border border-purple-500/20" : "hover:bg-[#27272a]/30"
                    }`}
                  >
                    {/* Avatar placeholder */}
                    <div className="w-8 h-8 rounded-full bg-[#27272a] flex items-center justify-center flex-shrink-0">
                      <span className="text-xs text-zinc-400 font-bold">{repo.full_name?.[0]?.toUpperCase() || "?"}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium truncate">{repo.full_name}</span>
                        {repo.stars > 100000 && (
                          <Sparkles className="w-3 h-3 text-yellow-400 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-zinc-500 truncate mt-0.5">{repo.description}</p>
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

        {/* Footer */}
        <div className="flex items-center gap-4 px-5 py-3 border-t border-[#27272a] text-[10px] text-zinc-600">
          <span>↑↓ Navigate</span>
          <span>↵ Open</span>
          <span>Esc Close</span>
        </div>
      </div>
    </div>
  )
}
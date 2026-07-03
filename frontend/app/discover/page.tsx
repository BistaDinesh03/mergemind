"use client"
import { useState } from "react"
import { Navbar } from "@/components/Navbar"
import { SearchBar } from "@/components/SearchBar"
import { LanguageFilter } from "@/components/LanguageFilter"
import { RepoCard, RepoCardSkeleton } from "@/components/RepoCard"
import { DiscoverSkeleton } from "@/components/Skeletons"
import { ErrorDisplay } from "@/components/ErrorDisplay"
import { EmptyState } from "@/components/EmptyState"
import { useRepos } from "@/lib/useRepos"

export default function DiscoverPage() {
  const [query, setQuery] = useState("")
  const [language, setLanguage] = useState("")
  const [sort, setSort] = useState("stars")
  const { repos, total, loading, error, refetch } = useRepos({ query, language, sort })

  if (loading && repos.length === 0) return <DiscoverSkeleton />

  return (
    <div className="min-h-screen bg-[#0a0b0f] text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1 sm:mb-2">Discover Repositories</h1>
          <p className="text-gray-400 text-xs sm:text-sm">Find the perfect open source project</p>
          {total > 0 && <p className="text-xs text-gray-500 mt-1 sm:mt-2">{total.toLocaleString()} repos found</p>}
        </div>

        {/* Filters - stack on mobile */}
        <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <div className="flex-1"><SearchBar onSearch={setQuery} /></div>
            <select value={sort} onChange={(e) => setSort(e.target.value)} 
              className="px-3 py-2.5 sm:py-3 bg-[#111318] border border-gray-700/50 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500 w-full sm:w-auto">
              <option value="stars">Most Stars</option><option value="updated">Recently Updated</option><option value="forks">Most Forks</option>
            </select>
          </div>
          <LanguageFilter selected={language} onSelect={setLanguage} />
        </div>

        {error && <ErrorDisplay type="api" message={error} onRetry={refetch} />}
        
        {loading && repos.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
            {[...Array(4)].map((_, i) => <RepoCardSkeleton key={i} />)}
          </div>
        )}

        {!loading && !error && repos.length === 0 && (
          <EmptyState type={query ? "search" : "repos"} />
        )}

        {!loading && !error && repos.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
            {repos.map((repo: any) => <RepoCard key={repo.id} repo={repo} />)}
          </div>
        )}
      </div>
    </div>
  )
}
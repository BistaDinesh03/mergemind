"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Star, GitFork, ExternalLink, Loader2, TrendingUp } from "lucide-react"

export default function DiscoverPage() {
  const [repos, setRepos] = useState([])
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [language, setLanguage] = useState("python")
  const [selectedRepo, setSelectedRepo] = useState("")

  useEffect(() => {
    fetch(`http://localhost:8000/api/github/trending?language=${language}`)
      .then(r => r.json())
      .then(d => { setRepos(d.repos || []); setLoading(false) })
  }, [language])

  const loadIssues = async (repoFullName: string) => {
    setSelectedRepo(repoFullName)
    setIssues([])
    const [owner, repo] = repoFullName.split("/")
    const r = await fetch(`http://localhost:8000/api/github/issues/${owner}/${repo}`)
    const d = await r.json()
    setIssues(d.issues || [])
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">MergeMind</Link>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-300 hover:text-white text-sm">Dashboard</Link>
          <Link href="/discover" className="text-blue-400 text-sm">Discover</Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Discover Issues</h1>
          <p className="text-gray-400 mt-1">Real GitHub issues from trending repositories</p>
        </div>

        {/* Language Filter */}
        <div className="flex gap-2 mb-6">
          {["python", "javascript", "typescript", "rust", "go"].map(lang => (
            <button key={lang} onClick={() => setLanguage(lang)}
              className={`px-4 py-2 rounded-lg text-sm capitalize ${language === lang ? "bg-purple-600" : "bg-[#1a1a2e] border border-gray-700 hover:bg-gray-700"}`}>
              {lang}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20"><Loader2 className="w-8 h-8 animate-spin text-purple-400 mx-auto" /><p className="text-gray-400 mt-4">Loading trending repos...</p></div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Repos List */}
            <div className="space-y-3">
              <h2 className="font-semibold text-lg mb-3">Trending {language} Repos</h2>
              {repos.map((repo: any) => (
                <div key={repo.name} onClick={() => loadIssues(repo.name)}
                  className={`p-4 rounded-xl cursor-pointer transition-all border ${selectedRepo === repo.name ? "border-purple-500 bg-purple-500/10" : "border-gray-700 bg-[#111118] hover:border-gray-600"}`}>
                  <p className="font-medium">{repo.name}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Star className="w-3 h-3" /> {repo.stars?.toLocaleString()}</span>
                    <span>{repo.language}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Issues List */}
            <div className="space-y-3">
              <h2 className="font-semibold text-lg mb-3">
                {selectedRepo ? `Issues in ${selectedRepo}` : "Select a repo to see issues"}
              </h2>
              {issues.map((issue: any) => (
                <a key={issue.number} href={issue.url} target="_blank" rel="noopener noreferrer"
                  className="block p-4 rounded-xl border border-gray-700 bg-[#111118] hover:border-gray-500 transition-all">
                  <p className="font-medium text-sm">{issue.title}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {issue.labels?.map((l: string) => (
                      <span key={l} className="px-2 py-0.5 text-xs bg-green-500/10 text-green-400 rounded-full">{l}</span>
                    ))}
                    <span className="text-xs text-gray-500 ml-auto">#{issue.number}</span>
                    <ExternalLink className="w-3 h-3 text-gray-500" />
                  </div>
                </a>
              ))}
              {selectedRepo && issues.length === 0 && (
                <p className="text-gray-500 text-center py-10">No "good first issue" found in this repo</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
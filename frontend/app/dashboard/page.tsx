"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { GitPullRequest, Star, Users, Code, Search, BookOpen, Loader2, ExternalLink } from "lucide-react"

export default function DashboardPage() {
  const { data: session } = useSession()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const username = session?.user?.name || "BistaDinesh03"

  useEffect(() => {
    fetch(`http://localhost:8000/api/portfolio/${username}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
  }, [username])

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
    </div>
  )

  const totalStars = data?.repositories?.reduce((s: number, r: any) => s + r.stars, 0) || 0
  const repos = data?.repositories || []

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">MergeMind</Link>
        <div className="flex items-center gap-4">
          <Link href="/discover" className="text-gray-300 hover:text-white text-sm">Discover</Link>
          <Link href="/portfolio" className="text-gray-300 hover:text-white text-sm">Portfolio</Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {data?.name || username}! 👋</h1>
          <p className="text-gray-400 mt-1">@{username} • {data?.followers || 0} followers • {data?.public_repos || 0} public repos</p>
        </div>

        {/* REAL Stats from GitHub */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Code, label: "Public Repos", value: data?.public_repos || 0, color: "text-blue-400", bg: "bg-blue-400/10" },
            { icon: Star, label: "Total Stars", value: totalStars, color: "text-yellow-400", bg: "bg-yellow-400/10" },
            { icon: Users, label: "Followers", value: data?.followers || 0, color: "text-green-400", bg: "bg-green-400/10" },
            { icon: GitPullRequest, label: "Contributions", value: repos.length, color: "text-purple-400", bg: "bg-purple-400/10" },
          ].map((s, i) => (
            <div key={i} className={`${s.bg} rounded-xl p-4 border border-gray-700/50`}>
              <s.icon className={`w-6 h-6 ${s.color} mb-2`} />
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-gray-400">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/discover" className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-xl p-6 border border-blue-500/30 hover:border-blue-400 transition-all">
            <Search className="w-8 h-8 text-blue-400 mb-3" />
            <h3 className="text-lg font-bold">Discover Issues</h3>
            <p className="text-sm text-gray-400 mt-1">Browse real GitHub issues from trending repos</p>
            <span className="text-blue-400 text-sm mt-3 inline-block">Browse now →</span>
          </Link>

          <Link href="/portfolio" className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 rounded-xl p-6 border border-green-500/30 hover:border-green-400 transition-all">
            <BookOpen className="w-8 h-8 text-green-400 mb-3" />
            <h3 className="text-lg font-bold">Your Portfolio</h3>
            <p className="text-sm text-gray-400 mt-1">Showcase your GitHub profile & repos</p>
            <span className="text-green-400 text-sm mt-3 inline-block">View portfolio →</span>
          </Link>

          <a href="http://localhost:8000/docs" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-br from-yellow-900/50 to-orange-900/50 rounded-xl p-6 border border-yellow-500/30 hover:border-yellow-400 transition-all">
            <Code className="w-8 h-8 text-yellow-400 mb-3" />
            <h3 className="text-lg font-bold">API Docs</h3>
            <p className="text-sm text-gray-400 mt-1">AI scoring, GitHub API, portfolio endpoints</p>
            <span className="text-yellow-400 text-sm mt-3 inline-block">Open docs →</span>
          </a>
        </div>

        {/* Real Repos from GitHub */}
        <div className="bg-[#111118] rounded-xl p-6 border border-gray-800">
          <h3 className="font-semibold mb-4">Your Repositories</h3>
          <div className="space-y-2">
            {repos.slice(0, 5).map((repo: any) => (
              <a key={repo.name} href={repo.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-[#1a1a2e] rounded-lg hover:bg-gray-700 transition-all">
                <div>
                  <p className="text-sm font-medium">{repo.name}</p>
                  <p className="text-xs text-gray-500">{repo.language || "N/A"} • {repo.description?.slice(0, 60) || "No description"}</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Star className="w-3 h-3" /> {repo.stars}
                  <ExternalLink className="w-3 h-3" />
                </div>
              </a>
            ))}
          </div>
          <Link href="/portfolio" className="text-sm text-purple-400 mt-4 inline-block">View all repos →</Link>
        </div>
      </div>
    </div>
  )
}
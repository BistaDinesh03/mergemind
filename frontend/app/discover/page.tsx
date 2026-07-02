"use client"

import { useState } from "react"
import { Search, Filter, Star, CircleDot, ChevronRight } from "lucide-react"
import Link from "next/link"

const mockIssues = [
  { id: 1, title: "Add dark mode support to settings", repo: "facebook/react", labels: ["good first issue"], score: 85, difficulty: "Easy", hours: 2, stars: 225000 },
  { id: 2, title: "Improve error handling in API middleware", repo: "vercel/next.js", labels: ["help wanted"], score: 72, difficulty: "Medium", hours: 4, stars: 125000 },
  { id: 3, title: "Write unit tests for utility functions", repo: "microsoft/vscode", labels: ["good first issue"], score: 90, difficulty: "Easy", hours: 3, stars: 160000 },
]

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="min-h-screen bg-dark-950">
      <nav className="flex items-center justify-between p-6 border-b border-gray-800">
        <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 text-transparent bg-clip-text">
          MergeMind
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/discover" className="text-blue-400">Discover</Link>
          <Link href="/dashboard" className="text-gray-300 hover:text-white">Dashboard</Link>
        </div>
      </nav>

      <main className="p-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Discover Issues</h1>
          <p className="text-gray-400">Find the perfect issues to contribute to, scored by AI</p>
        </div>

        <div className="flex gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search issues, repositories, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-dark-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="space-y-4">
          {mockIssues.map((issue) => (
            <div key={issue.id} className="bg-dark-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all cursor-pointer">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CircleDot className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm text-gray-400">{issue.repo}</span>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Star className="w-3 h-3" /> {(issue.stars / 1000).toFixed(0)}k
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 hover:text-blue-400 transition-colors">{issue.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    {issue.labels.map((label) => (
                      <span key={label} className="px-2 py-0.5 text-xs bg-blue-600/20 text-blue-400 rounded-full border border-blue-600/30">{label}</span>
                    ))}
                    <span className="px-2 py-0.5 text-xs bg-emerald-600/20 text-emerald-400 rounded-full">{issue.difficulty}</span>
                    <span className="px-2 py-0.5 text-xs bg-purple-600/20 text-purple-400 rounded-full">~{issue.hours}h</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="px-3 py-1.5 bg-blue-600/20 text-blue-400 rounded-lg border border-blue-600/30 text-sm font-bold">
                    {issue.score}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
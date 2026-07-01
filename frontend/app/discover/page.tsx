"use client"

import { useState } from "react"
import { Search, Filter, Star, GitFork, CircleDot } from "lucide-react"
import { Navbar } from "@/components/layout/Navbar"
import { Sidebar } from "@/components/layout/Sidebar"
import { IssueCardSkeleton } from "@/components/ui/Skeleton"
import { EmptyState } from "@/components/ui/EmptyState"
import { ScoreBadge } from "@/components/ui/ScoreBadge"

const mockIssues = [
  {
    id: 1,
    title: "Add dark mode support to settings",
    repo: "facebook/react",
    labels: ["good first issue", "enhancement"],
    opportunityScore: 85,
    difficulty: "Easy",
    estimatedHours: 2,
    stars: 225000,
  },
  {
    id: 2,
    title: "Improve error handling in API middleware",
    repo: "vercel/next.js",
    labels: ["help wanted", "bug"],
    opportunityScore: 72,
    difficulty: "Medium",
    estimatedHours: 4,
    stars: 125000,
  },
  {
    id: 3,
    title: "Write unit tests for utility functions",
    repo: "microsoft/vscode",
    labels: ["good first issue", "testing"],
    opportunityScore: 90,
    difficulty: "Easy",
    estimatedHours: 3,
    stars: 160000,
  },
]

export default function DiscoverPage() {
  const [loading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="min-h-screen bg-dark-950">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          {/* Header */}
          <div className="mb-8 animate-fadeIn">
            <h1 className="text-3xl font-bold mb-2">Discover Issues</h1>
            <p className="text-gray-400">Find the perfect issues to contribute to, scored by AI</p>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search issues, repositories, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-dark-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-3 bg-dark-800 border border-gray-700 rounded-xl hover:bg-dark-700 transition-colors">
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>

          {/* Results */}
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <IssueCardSkeleton key={i} />
              ))}
            </div>
          ) : mockIssues.length > 0 ? (
            <div className="space-y-4">
              {mockIssues.map((issue) => (
                <div
                  key={issue.id}
                  className="glass-card p-6 hover:border-gray-600 transition-all cursor-pointer animate-slideIn group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CircleDot className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm text-gray-400">{issue.repo}</span>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Star className="w-3 h-3" />
                          {(issue.stars / 1000).toFixed(0)}k
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-400 transition-colors">
                        {issue.title}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {issue.labels.map((label) => (
                          <span
                            key={label}
                            className="px-2 py-0.5 text-xs bg-blue-600/20 text-blue-400 rounded-full border border-blue-600/30"
                          >
                            {label}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <ScoreBadge score={issue.opportunityScore} label="Opportunity" size="md" />
                      <span className="text-sm text-gray-400">
                        ~{issue.estimatedHours}h · {issue.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No issues found"
              description="Try adjusting your search or filters to find issues"
              action={{ label: "Clear Filters", onClick: () => setSearchQuery("") }}
            />
          )}
        </main>
      </div>
    </div>
  )
}

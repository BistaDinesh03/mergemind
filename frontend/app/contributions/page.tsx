"use client"

import { useState } from "react"
import { Navbar } from "@/components/layout/Navbar"
import { Sidebar } from "@/components/layout/Sidebar"
import { EmptyState } from "@/components/ui/EmptyState"
import { ScoreBadge } from "@/components/ui/ScoreBadge"
import { GitPullRequest, CheckCircle, Clock, XCircle, ExternalLink, Filter } from "lucide-react"

const mockContributions = [
  {
    id: 1,
    title: "Add error boundary to dashboard components",
    repository: "facebook/react",
    status: "Merged",
    mergedAt: "2026-06-28",
    language: "TypeScript",
    difficulty: "Medium",
  },
  {
    id: 2,
    title: "Fix responsive layout in settings page",
    repository: "vercel/next.js",
    status: "InProgress",
    startedAt: "2026-06-30",
    language: "TypeScript",
    difficulty: "Easy",
  },
  {
    id: 3,
    title: "Update documentation for API endpoints",
    repository: "microsoft/vscode",
    status: "PROpened",
    startedAt: "2026-07-01",
    language: "JavaScript",
    difficulty: "Easy",
  },
]

const statusConfig = {
  Merged: { icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  InProgress: { icon: Clock, color: "text-yellow-400", bg: "bg-yellow-400/10" },
  PROpened: { icon: GitPullRequest, color: "text-blue-400", bg: "bg-blue-400/10" },
  Closed: { icon: XCircle, color: "text-red-400", bg: "bg-red-400/10" },
}

export default function ContributionsPage() {
  const [filter, setFilter] = useState("all")
  const hasContributions = true

  return (
    <div className="min-h-screen bg-dark-950">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="mb-8 animate-fadeIn">
            <h1 className="text-3xl font-bold mb-2">My Contributions</h1>
            <p className="text-gray-400">Track your open source journey</p>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-6">
            {["all", "InProgress", "PROpened", "Merged", "Closed"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={px-4 py-2 rounded-lg text-sm transition-colors }
              >
                {status === "all" ? "All" : status.replace("InProgress", "In Progress").replace("PROpened", "PR Opened")}
              </button>
            ))}
          </div>

          {hasContributions ? (
            <div className="space-y-4">
              {mockContributions.map((contrib) => {
                const status = statusConfig[contrib.status as keyof typeof statusConfig]
                const StatusIcon = status.icon
                
                return (
                  <div
                    key={contrib.id}
                    className="glass-card p-6 hover:border-gray-600 transition-all animate-slideIn"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm text-gray-400">{contrib.repository}</span>
                          <span className="text-xs px-2 py-0.5 bg-dark-700 rounded-full text-gray-400">
                            {contrib.language}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold mb-3">{contrib.title}</h3>
                        <div className="flex items-center gap-4">
                          <div className={lex items-center gap-1.5 px-3 py-1 rounded-lg text-xs }>
                            <StatusIcon className={w-3.5 h-3.5 } />
                            <span className={status.color}>{contrib.status}</span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {contrib.mergedAt
                              ? Merged: 
                              : Started: }
                          </span>
                        </div>
                      </div>
                      <button className="flex items-center gap-1 px-3 py-1.5 text-sm bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors">
                        <ExternalLink className="w-3.5 h-3.5" />
                        View
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <EmptyState
              icon={GitPullRequest}
              title="No contributions yet"
              description="Start your open source journey by discovering issues that match your skills"
              action={{ label: "Discover Issues", onClick: () => {} }}
            />
          )}
        </main>
      </div>
    </div>
  )
}

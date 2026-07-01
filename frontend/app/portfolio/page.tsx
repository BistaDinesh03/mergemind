"use client"

import { Navbar } from "@/components/layout/Navbar"
import { Sidebar } from "@/components/layout/Sidebar"
import { StatCard } from "@/components/ui/StatCard"
import { EmptyState } from "@/components/ui/EmptyState"
import { GitPullRequest, Github, Star, TrendingUp, ExternalLink } from "lucide-react"

export default function PortfolioPage() {
  const hasContributions = false // Will be replaced with real data

  return (
    <div className="min-h-screen bg-dark-950">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="mb-8 animate-fadeIn">
            <h1 className="text-3xl font-bold mb-2">Your Portfolio</h1>
            <p className="text-gray-400">Showcase your open source contributions</p>
          </div>

          {hasContributions ? (
            <>
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard icon={GitPullRequest} label="Merged PRs" value={0} color="text-emerald-400" />
                <StatCard icon={Github} label="Repositories" value={0} color="text-blue-400" />
                <StatCard icon={Star} label="Stars Received" value={0} color="text-yellow-400" />
                <StatCard icon={TrendingUp} label="Impact Score" value="0%" color="text-purple-400" />
              </div>

              {/* Timeline */}
              <div className="glass-card p-6">
                <h2 className="text-xl font-semibold mb-4">Contribution Timeline</h2>
                <div className="text-gray-400">Your merged PRs will appear here</div>
              </div>
            </>
          ) : (
            <EmptyState
              icon={GitPullRequest}
              title="No contributions yet"
              description="Start contributing to open source projects to build your portfolio. We'll help you find the best issues to get started."
              action={{ label: "Discover Issues", onClick: () => window.location.href = "/discover" }}
            />
          )}

          {/* Portfolio Share Card */}
          <div className="glass-card p-6 mt-8">
            <h2 className="text-xl font-semibold mb-2">Share Your Portfolio</h2>
            <p className="text-gray-400 mb-4">
              Once you have contributions, you can share your portfolio with a custom link.
            </p>
            <div className="flex items-center gap-2 p-3 bg-dark-900 rounded-lg border border-gray-700">
              <code className="text-gray-500 flex-1">https://mergemind.dev/portfolio/your-username</code>
              <button className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                <ExternalLink className="w-3 h-3" />
                Preview
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

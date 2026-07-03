"use client"

import { Search, Inbox, GitFork, AlertCircle, BookOpen, Star } from "lucide-react"
import Link from "next/link"

interface EmptyStateProps {
  type: "repos" | "issues" | "recommendations" | "portfolio" | "search" | "generic"
  title?: string
  description?: string
}

const configs = {
  repos: {
    icon: GitFork,
    title: "No repositories found",
    description: "Try adjusting your search or language filter to find more repositories.",
    action: null
  },
  issues: {
    icon: AlertCircle,
    title: "No open issues",
    description: "This repository doesn't have any open issues right now. Check back later or try another repo.",
    action: { label: "Browse Other Repos", href: "/discover" }
  },
  recommendations: {
    icon: Star,
    title: "No recommendations yet",
    description: "We're scanning repositories to find the best issues for you. Browse repos to get started.",
    action: { label: "Discover Repositories", href: "/discover" }
  },
  portfolio: {
    icon: BookOpen,
    title: "No contributions yet",
    description: "Start contributing to open source projects to build your portfolio. We'll help you find the best issues.",
    action: { label: "Find Issues", href: "/discover" }
  },
  search: {
    icon: Search,
    title: "No results found",
    description: "Try a different search term or clear your filters.",
    action: null
  },
  generic: {
    icon: Inbox,
    title: "Nothing here yet",
    description: "Check back later for updates.",
    action: null
  }
}

export function EmptyState({ type, title, description }: EmptyStateProps) {
  const config = configs[type] || configs.generic
  const Icon = config.icon

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fadeIn">
      <div className="w-16 h-16 rounded-2xl bg-gray-700/20 flex items-center justify-center mb-5 ring-1 ring-gray-700/30">
        <Icon className="w-8 h-8 text-gray-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-300 mb-2">{title || config.title}</h3>
      <p className="text-sm text-gray-500 max-w-sm mb-6 leading-relaxed">{description || config.description}</p>
      {config.action && (
        <Link href={config.action.href}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm font-medium transition-all duration-200">
          {config.action.label}
        </Link>
      )}
    </div>
  )
}
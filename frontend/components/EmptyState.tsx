"use client"

import { 
  Search, Inbox, Star, AlertCircle, BookOpen, GitFork,
  Sparkles, ArrowRight, Github, Zap, Target, ActivityIcon
} from "lucide-react"
import Link from "next/link"

interface Action {
  label: string
  href?: string
  onClick?: () => void
  primary?: boolean
}

interface EmptyStateProps {
  type: "recommendations" | "repos" | "issues" | "portfolio" | "search" | "contributions" | "activity"
  title?: string
  description?: string
  actions?: Action[]
}

const configs: Record<string, { icon: any; title: string; description: string; actions: Action[] }> = {
  
  recommendations: {
    icon: Sparkles,
    title: "No recommendations yet",
    description: "Connect your GitHub account and browse repositories to get AI-powered recommendations tailored to your skills.",
    actions: [
      { label: "Browse Repositories", href: "/discover", primary: true },
    ]
  },

  repos: {
    icon: GitFork,
    title: "No repositories found",
    description: "Try adjusting your search terms or language filter to discover more projects.",
    actions: [
      { label: "Browse Trending", href: "/discover", primary: true },
    ]
  },

  issues: {
    icon: AlertCircle,
    title: "No open issues",
    description: "This repository doesn't have any open issues right now. Explore other repositories to find contribution opportunities.",
    actions: [
      { label: "Browse Other Repos", href: "/discover", primary: true },
    ]
  },

  portfolio: {
    icon: BookOpen,
    title: "Start your contribution journey",
    description: "Your merged PRs will appear here automatically. Discover issues and start building your open source portfolio today.",
    actions: [
      { label: "Find Issues", href: "/discover", primary: true },
    ]
  },

  search: {
    icon: Search,
    title: "No results found",
    description: "Try a different search term or browse repositories by language to find what you're looking for.",
    actions: [
      { label: "Browse All", href: "/discover", primary: true },
    ]
  },

  contributions: {
    icon: Github,
    title: "No contributions yet",
    description: "Start contributing to open source and your merged PRs will show up here. Every contribution builds your portfolio.",
    actions: [
      { label: "Discover Issues", href: "/discover", primary: true },
    ]
  },

  activity: {
    icon: ActivityIcon,
    title: "No recent activity",
    description: "Your recent actions will appear here. Connect GitHub and start exploring to see your activity timeline.",
    actions: [
      { label: "Get Started", href: "/discover", primary: true },
    ]
  },
}

export function EmptyState({ type, title, description, actions }: EmptyStateProps) {
  const config = configs[type] || configs.repos
  const Icon = config.icon
  const displayTitle = title || config.title
  const displayDescription = description || config.description
  const displayActions = actions || config.actions

  return (
    <div className="flex flex-col items-center justify-center py-16 sm:py-20 px-4 text-center animate-fadeIn">
      <div className="w-20 h-20 rounded-[20px] bg-white/[0.03] border border-white/[0.04] flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-zinc-500" />
      </div>

      <h3 className="text-xl font-bold text-zinc-300 mb-2">{displayTitle}</h3>
      <p className="text-base text-zinc-500 max-w-md mb-8 leading-relaxed">{displayDescription}</p>

      {displayActions.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {displayActions.map((action, i) => 
            action.href ? (
              <Link
                key={i}
                href={action.href}
                className={`h-[44px] px-6 inline-flex items-center gap-2 rounded-[14px] text-sm font-semibold transition-all duration-200 active:scale-[0.98] ${
                  action.primary
                    ? "bg-white hover:bg-zinc-100 text-zinc-900 shadow-sm shadow-white/5"
                    : "bg-white/[0.03] hover:bg-white/[0.06] text-zinc-400 border border-white/[0.06]"
                }`}
              >
                {action.label}
                {action.primary && <ArrowRight className="w-4 h-4" />}
              </Link>
            ) : (
              <button
                key={i}
                onClick={action.onClick}
                className={`h-[44px] px-6 inline-flex items-center gap-2 rounded-[14px] text-sm font-semibold transition-all duration-200 active:scale-[0.98] ${
                  action.primary
                    ? "bg-white hover:bg-zinc-100 text-zinc-900 shadow-sm shadow-white/5"
                    : "bg-white/[0.03] hover:bg-white/[0.06] text-zinc-400 border border-white/[0.06]"
                }`}
              >
                {action.label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  )
}
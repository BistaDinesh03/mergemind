"use client"

import { Search, GitFork, Sparkles, AlertCircle, BookOpen, Github, ArrowRight, ActivityIcon, Compass } from "lucide-react"
import Link from "next/link"

interface EmptyStateProps {
  type?: "repos" | "issues" | "recommendations" | "portfolio" | "search" | "activity" | "error" | "discover"
  title?: string
  description?: string
  action?: { label: string; href?: string; onClick?: () => void }
  secondaryAction?: { label: string; href?: string; onClick?: () => void }
}

const configs: Record<string, { icon: any; title: string; description: string; defaultAction: { label: string; href: string } }> = {
  repos: {
    icon: GitFork,
    title: "No repositories found",
    description: "Try adjusting your search terms or exploring popular repositories.",
    defaultAction: { label: "Browse Popular Repos", href: "/discover" }
  },
  issues: {
    icon: AlertCircle,
    title: "No issues found today",
    description: "This repository doesn't have open issues right now. We can help you find similar projects.",
    defaultAction: { label: "Find Similar Projects", href: "/discover" }
  },
  recommendations: {
    icon: Sparkles,
    title: "No recommendations yet",
    description: "Discover repositories to get AI-powered picks tailored to your skills.",
    defaultAction: { label: "Explore Repositories", href: "/discover" }
  },
  portfolio: {
    icon: BookOpen,
    title: "No repositories yet",
    description: "Start contributing to open source and your portfolio will grow here.",
    defaultAction: { label: "Find Your First Issue", href: "/discover" }
  },
  search: {
    icon: Search,
    title: "No results found",
    description: "Try different keywords or browse by language.",
    defaultAction: { label: "Browse All Repos", href: "/discover" }
  },
  activity: {
    icon: ActivityIcon,
    title: "No recent activity",
    description: "Your contributions and recommendations will appear here.",
    defaultAction: { label: "Get Started", href: "/discover" }
  },
  discover: {
    icon: Compass,
    title: "No repositories to show",
    description: "Try adjusting your filters or search for something new.",
    defaultAction: { label: "Clear Filters", href: "/discover" }
  },
  error: {
    icon: AlertCircle,
    title: "Something went wrong",
    description: "Please try again or explore repositories while we fix this.",
    defaultAction: { label: "Go to Discover", href: "/discover" }
  },
}

export default function EmptyState({ type = "repos", title, description, action, secondaryAction }: EmptyStateProps) {
  const config = configs[type] || configs.repos
  const Icon = config?.icon

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fadeIn">
      <div className="w-16 h-16 rounded-2xl bg-[#18181b] border border-[#27272a] flex items-center justify-center mb-5">
        {Icon && <Icon className="w-8 h-8 text-zinc-500" />}
      </div>
      <h3 className="text-lg font-semibold text-zinc-300 mb-2">{title || config?.title}</h3>
      <p className="text-sm text-zinc-500 max-w-md mb-6">{description || config?.description}</p>

      <div className="flex flex-col sm:flex-row gap-3">
        {action ? (
          action.href ? (
            <Link href={action.href} className="h-10 px-5 bg-white text-zinc-900 rounded-[14px] text-sm font-semibold inline-flex items-center gap-2 hover:bg-zinc-200 transition-colors">
              {action.label} <ArrowRight className="w-4 h-4" />
            </Link>
          ) : action.onClick ? (
            <button onClick={action.onClick} className="h-10 px-5 bg-white text-zinc-900 rounded-[14px] text-sm font-semibold inline-flex items-center gap-2 hover:bg-zinc-200 transition-colors">
              {action.label} <ArrowRight className="w-4 h-4" />
            </button>
          ) : null
        ) : (
          <Link href={config?.defaultAction?.href || "/discover"} className="h-10 px-5 bg-white text-zinc-900 rounded-[14px] text-sm font-semibold inline-flex items-center gap-2 hover:bg-zinc-200 transition-colors">
            {config?.defaultAction?.label || "Explore"} <ArrowRight className="w-4 h-4" />
          </Link>
        )}

        {secondaryAction && (
          secondaryAction.href ? (
            <Link href={secondaryAction.href} className="h-10 px-5 bg-[#18181b] text-white border border-[#27272a] rounded-[14px] text-sm font-medium inline-flex items-center gap-2 hover:bg-[#27272a] transition-colors">
              {secondaryAction.label}
            </Link>
          ) : secondaryAction.onClick ? (
            <button onClick={secondaryAction.onClick} className="h-10 px-5 bg-[#18181b] text-white border border-[#27272a] rounded-[14px] text-sm font-medium inline-flex items-center gap-2 hover:bg-[#27272a] transition-colors">
              {secondaryAction.label}
            </button>
          ) : null
        )}
      </div>
    </div>
  )
}
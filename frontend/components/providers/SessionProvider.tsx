"use client"

import { Search, GitFork, Sparkles, AlertCircle, BookOpen, ArrowRight, ActivityIcon, Compass } from "lucide-react"
import Link from "next/link"

const icons: any = {
  repos: GitFork,
  issues: AlertCircle,
  recommendations: Sparkles,
  portfolio: BookOpen,
  search: Search,
  activity: ActivityIcon,
  discover: Compass,
  error: AlertCircle,
}

const defaults: any = {
  repos: { title: "No repositories found", description: "Try adjusting your search terms.", label: "Browse Repos", href: "/discover" },
  issues: { title: "No issues found today", description: "We can help you find similar projects.", label: "Find Projects", href: "/discover" },
  recommendations: { title: "No recommendations yet", description: "Discover repositories to get AI-powered picks.", label: "Explore", href: "/discover" },
  portfolio: { title: "No repositories yet", description: "Start contributing to grow your portfolio.", label: "Find Issues", href: "/discover" },
  search: { title: "No results found", description: "Try different keywords.", label: "Browse All", href: "/discover" },
  activity: { title: "No recent activity", description: "Your activity will appear here.", label: "Get Started", href: "/discover" },
  discover: { title: "No repositories to show", description: "Try adjusting your filters.", label: "Clear Filters", href: "/discover" },
  error: { title: "Something went wrong", description: "Please try again.", label: "Go to Discover", href: "/discover" },
}

export function EmptyState({ kind = "repos", title, description, action, secondaryAction }: any) {
  const Icon = icons[kind] || icons.repos
  const d = defaults[kind] || defaults.repos

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fadeIn">
      <div className="w-16 h-16 rounded-2xl bg-[#18181b] border border-[#27272a] flex items-center justify-center mb-5">
        <Icon className="w-8 h-8 text-zinc-500" />
      </div>
      <h3 className="text-lg font-semibold text-zinc-300 mb-2">{title || d.title}</h3>
      <p className="text-sm text-zinc-500 max-w-md mb-6">{description || d.description}</p>

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
          <Link href={d.href} className="h-10 px-5 bg-white text-zinc-900 rounded-[14px] text-sm font-semibold inline-flex items-center gap-2 hover:bg-zinc-200 transition-colors">
            {d.label} <ArrowRight className="w-4 h-4" />
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
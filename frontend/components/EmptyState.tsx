"use client"

import { ArrowRight } from "lucide-react"
import Link from "next/link"

interface EmptyStateProps {
  type: "recommendations" | "repos" | "issues" | "portfolio" | "search" | "error"
  title?: string
  description?: string
  action?: { label: string; href: string }
}

const illustrations: Record<string, string> = {
  recommendations: "/illustrations/no-recommendations.svg",
  repos: "/illustrations/no-repos.svg",
  issues: "/illustrations/no-issues.svg",
  portfolio: "/illustrations/no-repos.svg",
  search: "/illustrations/no-repos.svg",
  error: "/illustrations/error.svg",
}

const defaults: Record<string, { title: string; description: string; action?: { label: string; href: string } }> = {
  recommendations: {
    title: "No recommendations yet",
    description: "Connect your GitHub account and browse repositories to get AI-powered picks.",
    action: { label: "Browse Repositories", href: "/discover" }
  },
  repos: {
    title: "No repositories found",
    description: "Try adjusting your search or language filter.",
    action: { label: "Browse Trending", href: "/discover" }
  },
  issues: {
    title: "No open issues",
    description: "This repository doesn't have any open issues right now.",
    action: { label: "Browse Other Repos", href: "/discover" }
  },
  portfolio: {
    title: "Start your journey",
    description: "Your merged PRs will appear here. Start contributing today.",
    action: { label: "Find Issues", href: "/discover" }
  },
  search: {
    title: "No results found",
    description: "Try a different search term.",
    action: { label: "Browse All", href: "/discover" }
  },
  error: {
    title: "Something went wrong",
    description: "Please try again or check your connection.",
    action: { label: "Try Again", href: "/" }
  },
}

export function EmptyState({ type, title, description, action }: EmptyStateProps) {
  const config = defaults[type]
  const img = illustrations[type]

  return (
    <div className="flex flex-col items-center justify-center py-16 sm:py-20 px-4 text-center animate-fadeInUp">
      <img src={img} alt="" className="w-28 h-28 sm:w-32 sm:h-32 mb-8 opacity-80" />
      <h3 className="text-xl font-bold text-zinc-300 mb-2">{title || config.title}</h3>
      <p className="text-base text-zinc-500 max-w-md mb-8">{description || config.description}</p>
      {(action || config.action) && (
        <Link href={(action || config.action)!.href}
          className="h-[44px] px-6 bg-white hover:bg-zinc-100 text-zinc-900 rounded-[14px] text-sm font-semibold inline-flex items-center gap-2 transition-all duration-200 active:scale-[0.98]">
          {(action || config.action)!.label} <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  )
}
"use client"

import { Search, GitFork, Sparkles, AlertCircle, BookOpen, Github, ArrowRight, ActivityIcon } from "lucide-react"
import Link from "next/link"

interface EmptyStateProps {
  type?: "repos" | "issues" | "recommendations" | "portfolio" | "search" | "activity" | "error"
  title?: string; description?: string
  action?: { label: string; href?: string; onClick?: () => void }
}

const configs: Record<string, { icon: any; title: string; description: string }> = {
  repos: { icon: GitFork, title: "No repositories found", description: "Try adjusting your search or language filter." },
  issues: { icon: AlertCircle, title: "No open issues", description: "This repository has no open issues right now." },
  recommendations: { icon: Sparkles, title: "No recommendations yet", description: "Browse repositories to get AI-powered picks." },
  portfolio: { icon: BookOpen, title: "No repositories", description: "Your GitHub repositories will appear here." },
  search: { icon: Search, title: "No results found", description: "Try a different search term." },
  activity: { icon: ActivityIcon, title: "No recent activity", description: "Your actions will appear here." },
  error: { icon: AlertCircle, title: "Something went wrong", description: "Please try again." },
}

export function EmptyState({ type = "repos", title, description, action }: EmptyStateProps) {
  const config = configs[type] || configs.repos
  const Icon = config.icon
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fadeIn">
      <div className="w-16 h-16 rounded-2xl bg-[#18181b] border border-[#27272a] flex items-center justify-center mb-5">
        <Icon className="w-8 h-8 text-zinc-500" />
      </div>
      <h3 className="text-lg font-semibold text-zinc-300 mb-2">{title || config.title}</h3>
      <p className="text-sm text-zinc-500 max-w-md mb-6">{description || config.description}</p>
      {action && (action.href ? <Link href={action.href} className="h-10 px-5 bg-white text-zinc-900 rounded-[14px] text-sm font-semibold inline-flex items-center gap-2">{action.label} <ArrowRight className="w-4 h-4"/></Link> : action.onClick ? <button onClick={action.onClick} className="h-10 px-5 bg-white text-zinc-900 rounded-[14px] text-sm font-semibold">{action.label}</button> : null)}
    </div>
  )
}
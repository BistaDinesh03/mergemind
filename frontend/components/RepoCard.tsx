"use client"
import { Star, GitFork, AlertCircle, Clock, ChevronRight, Sparkles, Heart } from "lucide-react"
import Link from "next/link"

interface RepoCardProps {
  repo: {
    full_name: string
    owner: { login: string; avatar: string }
    description: string
    stars: number
    forks: number
    open_issues: number
    language: string
    topics: string[]
    updated_at: string
    url?: string
    health?: number
    recommended?: boolean
    issue_count?: number
  }
}

const languageColors: Record<string, string> = {
  Python: "bg-blue-500", JavaScript: "bg-yellow-400", TypeScript: "bg-indigo-500",
  Rust: "bg-orange-500", Go: "bg-cyan-400", Java: "bg-red-500",
  Ruby: "bg-red-400", C: "bg-gray-400", "C++": "bg-pink-500",
}

export function RepoCard({ repo }: RepoCardProps) {
  const daysAgo = Math.floor((Date.now() - new Date(repo.updated_at).getTime()) / 86400000)
  const dotColor = languageColors[repo.language] || "bg-zinc-500"

  return (
    <Link href={`/repo/${repo.full_name}`}
      className="group block bg-[#18181b] border border-white/[0.06] rounded-[20px] p-6 
        hover:border-white/[0.12] hover:bg-white/[0.01] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20
        transition-all duration-300 ease-out relative overflow-hidden">
      
      {/* AI Recommended badge */}
      {repo.recommended && (
        <div className="absolute top-4 right-4 z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/10 text-purple-300 rounded-full text-xs font-medium border border-purple-500/20">
            <Sparkles className="w-3 h-3" /> AI Pick
          </span>
        </div>
      )}

      {/* Repo Header */}
      <div className="flex items-start gap-4 mb-4">
        {/* Owner Avatar */}
        <img 
          src={repo.owner.avatar} 
          alt={repo.owner.login}
          className="w-12 h-12 rounded-full ring-1 ring-white/[0.06] flex-shrink-0 group-hover:ring-white/[0.12] transition-all duration-200"
        />
        
        <div className="flex-1 min-w-0 pr-16">
          {/* Repo Name */}
          <h3 className="text-lg font-semibold group-hover:text-white transition-colors truncate leading-snug">
            {repo.full_name}
          </h3>
          <p className="text-sm text-zinc-500 mt-1">{repo.owner.login}</p>
        </div>

        {/* Health Score Chip */}
        {repo.health && (
          <div className={`flex flex-col items-center justify-center w-14 h-14 rounded-[14px] flex-shrink-0 border ${
            repo.health >= 80 ? "bg-green-500/5 border-green-500/20" :
            repo.health >= 60 ? "bg-blue-500/5 border-blue-500/20" :
            "bg-yellow-500/5 border-yellow-500/20"
          }`}>
            <span className={`text-lg font-bold ${
              repo.health >= 80 ? "text-green-400" : repo.health >= 60 ? "text-blue-400" : "text-yellow-400"
            }`}>{repo.health}</span>
            <span className="text-[9px] text-zinc-500">health</span>
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-zinc-400 mb-4 line-clamp-2 leading-relaxed">
        {repo.description || "No description available"}
      </p>

      {/* Topics */}
      {repo.topics?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {repo.topics.slice(0, 5).map(topic => (
            <span key={topic} className="px-2.5 py-1 text-xs bg-blue-500/5 text-blue-300 rounded-full border border-blue-500/10 font-medium">
              {topic}
            </span>
          ))}
        </div>
      )}

      {/* Stats Row */}
      <div className="flex items-center gap-5 text-sm text-zinc-500 pt-4 border-t border-white/[0.04]">
        {/* Language */}
        <span className="flex items-center gap-1.5">
          <span className={`w-2.5 h-2.5 rounded-full ${dotColor}`} />
          {repo.language || "N/A"}
        </span>

        {/* Stars */}
        <span className="flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5 text-yellow-400" />
          {repo.stars.toLocaleString()}
        </span>

        {/* Forks */}
        <span className="flex items-center gap-1.5">
          <GitFork className="w-3.5 h-3.5" />
          {repo.forks.toLocaleString()}
        </span>

        {/* Open Issues */}
        <span className="flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5" />
          {repo.open_issues.toLocaleString()}
        </span>

        {/* Updated */}
        <span className="flex items-center gap-1.5 ml-auto text-xs text-zinc-600">
          <Clock className="w-3 h-3" />
          {daysAgo === 0 ? "Today" : daysAgo === 1 ? "Yesterday" : `${daysAgo}d ago`}
        </span>
      </div>

      {/* Bottom: Open Issues CTA */}
      {repo.issue_count && (
        <div className="mt-3 pt-3 border-t border-white/[0.04] flex items-center justify-between">
          <span className="text-sm text-purple-400 font-medium">
            {repo.issue_count} open issues for you
          </span>
          <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all duration-200" />
        </div>
      )}
    </Link>
  )
}

// Skeleton
export function RepoCardSkeleton() {
  return (
    <div className="bg-[#18181b] border border-white/[0.06] rounded-[20px] p-6 space-y-4 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-white/[0.04] rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="h-5 w-3/4 bg-white/[0.04] rounded-lg" />
          <div className="h-3 w-1/3 bg-white/[0.02] rounded-lg" />
        </div>
        <div className="w-14 h-14 bg-white/[0.04] rounded-[14px]" />
      </div>
      <div className="h-4 w-full bg-white/[0.03] rounded-lg" />
      <div className="h-4 w-2/3 bg-white/[0.03] rounded-lg" />
      <div className="flex gap-2">
        <div className="h-6 w-16 bg-white/[0.04] rounded-full" />
        <div className="h-6 w-20 bg-white/[0.04] rounded-full" />
        <div className="h-6 w-14 bg-white/[0.04] rounded-full" />
      </div>
      <div className="flex gap-4 pt-4 border-t border-white/[0.04]">
        <div className="h-3 w-16 bg-white/[0.03] rounded" />
        <div className="h-3 w-16 bg-white/[0.03] rounded" />
        <div className="h-3 w-12 bg-white/[0.03] rounded" />
      </div>
    </div>
  )
}
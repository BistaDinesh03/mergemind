"use client"
import { Star, GitFork, AlertCircle, Clock, ChevronRight, Sparkles, Heart } from "lucide-react"
import Link from "next/link"

export function RepoCard({ repo }: { repo: any }) {
  const daysAgo = Math.floor((Date.now() - new Date(repo.updated_at).getTime()) / 86400000)
  const healthScore = repo.health || Math.floor(Math.random() * 25 + 65)

  return (
    <Link href={`/repo/${repo.full_name}`}
      className="block bg-[#18181b] border border-[#27272a] rounded-[20px] p-5 hover:border-zinc-600 hover:-translate-y-0.5 transition-all duration-200 group">
      
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <img src={repo.owner?.avatar || ""} alt="" className="w-10 h-10 rounded-full ring-1 ring-[#27272a] flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm truncate group-hover:text-white transition-colors">{repo.full_name}</h3>
          <p className="text-xs text-zinc-500">{repo.owner?.login}</p>
        </div>
        {repo.recommended && (
          <span className="flex items-center gap-1 px-2 py-1 bg-purple-500/10 text-purple-300 rounded-full text-[10px] font-medium border border-purple-500/20 flex-shrink-0">
            <Sparkles className="w-2.5 h-2.5" /> AI Pick
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-zinc-400 mb-3 line-clamp-2 leading-relaxed">{repo.description || "No description"}</p>

      {/* Health + Stats Row */}
      <div className="flex items-center gap-3 text-xs text-zinc-500 pt-3 border-t border-[#27272a]">
        {repo.language && (
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-yellow-400" />
            {repo.language}
          </span>
        )}
        <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-400" /> {repo.stars?.toLocaleString() || 0}</span>
        <span className="flex items-center gap-1"><GitFork className="w-3 h-3" /> {repo.forks?.toLocaleString() || 0}</span>
        <span className="flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {repo.open_issues || 0}</span>
        
        <div className="ml-auto flex items-center gap-2">
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
            healthScore >= 80 ? "bg-green-500/10 text-green-400" : healthScore >= 60 ? "bg-blue-500/10 text-blue-400" : "bg-yellow-500/10 text-yellow-400"
          }`}>
            <Heart className="w-2.5 h-2.5" /> {healthScore}
          </div>
          <span className="flex items-center gap-1 text-zinc-600"><Clock className="w-2.5 h-2.5" /> {daysAgo}d</span>
        </div>
      </div>
    </Link>
  )
}

export function RepoCardSkeleton() {
  return (
    <div className="bg-[#18181b] border border-[#27272a] rounded-[20px] p-5 space-y-3 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-[#27272a] rounded-full" />
        <div className="flex-1 space-y-2"><div className="h-4 w-3/4 skeleton rounded" /><div className="h-3 w-1/3 skeleton rounded" /></div>
      </div>
      <div className="h-4 w-full skeleton rounded" />
      <div className="h-4 w-2/3 skeleton rounded" />
      <div className="flex gap-3 pt-3 border-t border-[#27272a]">
        <div className="h-3 w-12 skeleton rounded" />
        <div className="h-3 w-12 skeleton rounded" />
        <div className="h-3 w-8 skeleton rounded ml-auto" />
      </div>
    </div>
  )
}
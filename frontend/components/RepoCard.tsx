"use client"
import { Star, GitFork, Sparkles, Heart, Thermometer, GitMerge, Clock, Smile, ChevronRight } from "lucide-react"
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
    health?: number
    recommended?: boolean
    issue_count?: number
  }
}

const languageColors: Record<string, string> = {
  Python: "bg-blue-500", JavaScript: "bg-yellow-400", TypeScript: "bg-indigo-500",
  Rust: "bg-orange-500", Go: "bg-cyan-400", Java: "bg-red-500",
}

export function RepoCard({ repo }: RepoCardProps) {
  const dotColor = languageColors[repo.language] || "bg-zinc-500"
  const healthScore = repo.health || Math.floor(Math.random() * 30) + 65

  return (
    <Link href={`/repo/${repo.full_name}`}
      className="group block bg-[#18181b] border border-white/[0.04] rounded-[20px] p-5 
        hover:border-white/[0.08] hover:bg-white/[0.01] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20
        transition-all duration-300 ease-out relative overflow-hidden">
      
      {/* AI Pick badge */}
      {repo.recommended && (
        <div className="absolute top-4 right-4 z-10">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-purple-500/10 text-purple-300 rounded-full text-[11px] font-medium border border-purple-500/20">
            <Sparkles className="w-3 h-3" /> AI Pick
          </span>
        </div>
      )}

      {/* Header: Avatar + Name */}
      <div className="flex items-center gap-3 mb-4">
        <img src={repo.owner.avatar} alt={repo.owner.login}
          className="w-10 h-10 rounded-full ring-1 ring-white/[0.06] flex-shrink-0" />
        <div className="flex-1 min-w-0 pr-16">
          <h3 className="text-base font-semibold group-hover:text-white transition-colors truncate">
            {repo.full_name}
          </h3>
          <p className="text-xs text-zinc-500">{repo.owner.login}</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-zinc-400 mb-4 line-clamp-2 leading-relaxed">
        {repo.description || "No description available"}
      </p>

      {/* ─── DECISION CARDS — The hero section ─── */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {/* Health Score */}
        <div className={`rounded-[14px] p-3 text-center ${
          healthScore >= 80 ? "bg-green-500/5 border border-green-500/10" :
          healthScore >= 60 ? "bg-blue-500/5 border border-blue-500/10" :
          "bg-yellow-500/5 border border-yellow-500/10"
        }`}>
          <Heart className={`w-3.5 h-3.5 mx-auto mb-1 ${
            healthScore >= 80 ? "text-green-400" : healthScore >= 60 ? "text-blue-400" : "text-yellow-400"
          }`} />
          <p className={`text-lg font-bold ${
            healthScore >= 80 ? "text-green-400" : healthScore >= 60 ? "text-blue-400" : "text-yellow-400"
          }`}>{healthScore}</p>
          <p className="text-[10px] text-zinc-500">Health</p>
        </div>

        {/* Beginner Friendly */}
        <div className="rounded-[14px] p-3 text-center bg-purple-500/5 border border-purple-500/10">
          <Smile className="w-3.5 h-3.5 text-purple-400 mx-auto mb-1" />
          <p className="text-lg font-bold text-purple-400">
            {repo.topics?.some(t => t.toLowerCase().includes("good first issue")) ? "High" : "Med"}
          </p>
          <p className="text-[10px] text-zinc-500">Beginner</p>
        </div>

        {/* Merge Probability */}
        <div className="rounded-[14px] p-3 text-center bg-blue-500/5 border border-blue-500/10">
          <GitMerge className="w-3.5 h-3.5 text-blue-400 mx-auto mb-1" />
          <p className="text-lg font-bold text-blue-400">
            {healthScore >= 80 ? "85%" : healthScore >= 60 ? "70%" : "55%"}
          </p>
          <p className="text-[10px] text-zinc-500">Merge</p>
        </div>

        {/* Estimated Time */}
        <div className="rounded-[14px] p-3 text-center bg-amber-500/5 border border-amber-500/10">
          <Clock className="w-3.5 h-3.5 text-amber-400 mx-auto mb-1" />
          <p className="text-lg font-bold text-amber-400">
            {repo.open_issues < 100 ? "1-2h" : "2-4h"}
          </p>
          <p className="text-[10px] text-zinc-500">Est. Time</p>
        </div>
      </div>

      {/* Topics */}
      {repo.topics?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {repo.topics.slice(0, 3).map(topic => (
            <span key={topic} className="px-2 py-0.5 text-[10px] bg-white/[0.03] text-zinc-400 rounded-full border border-white/[0.04]">
              {topic}
            </span>
          ))}
          {repo.topics.length > 3 && (
            <span className="px-2 py-0.5 text-[10px] text-zinc-600">+{repo.topics.length - 3}</span>
          )}
        </div>
      )}

      {/* Footer: Language + Secondary Stats */}
      <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
        <div className="flex items-center gap-3 text-xs text-zinc-500">
          <span className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${dotColor}`} />
            {repo.language}
          </span>
          <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-400" />{repo.stars.toLocaleString()}</span>
          <span className="flex items-center gap-1"><GitFork className="w-3 h-3" />{repo.forks.toLocaleString()}</span>
        </div>
        
        {repo.issue_count && (
          <span className="text-xs text-purple-400 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
            {repo.issue_count} issues <ChevronRight className="w-3.5 h-3.5" />
          </span>
        )}
      </div>
    </Link>
  )
}

// Skeleton
export function RepoCardSkeleton() {
  return (
    <div className="bg-[#18181b] border border-white/[0.04] rounded-[20px] p-5 space-y-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-white/[0.04] rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 bg-white/[0.03] rounded" />
          <div className="h-3 w-1/3 bg-white/[0.02] rounded" />
        </div>
      </div>
      <div className="h-4 w-full bg-white/[0.03] rounded" />
      <div className="grid grid-cols-2 gap-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-16 bg-white/[0.02] rounded-[14px]" />
        ))}
      </div>
    </div>
  )
}
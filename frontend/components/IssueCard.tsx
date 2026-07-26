"use client"
import { Clock, BarChart3, Sparkles, ArrowRight, Star, Play, ExternalLink, Bookmark } from "lucide-react"
import Link from "next/link"

export function IssueCard({ issue }: { issue: any }) {
  const isBeginner = issue.is_beginner_friendly
  const difficulty = isBeginner ? "Beginner" : "Medium"
  const score = issue.overall_score || 75

  return (
    <div className="group bg-[#18181b] border border-[#27272a] rounded-[20px] p-5 card-hover">
      {/* Top Row: Badges */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full border ${
          isBeginner 
            ? "bg-green-500/10 text-green-400 border-green-500/20" 
            : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isBeginner ? "bg-green-400" : "bg-yellow-400"}`} />
          {difficulty}
        </span>
        
        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full">
          <Clock className="w-3 h-3" /> 1-2h
        </span>
        
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-full border ${
          score >= 80 ? "bg-purple-500/10 text-purple-300 border-purple-500/20" :
          score >= 60 ? "bg-blue-500/10 text-blue-300 border-blue-500/20" :
          "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
        }`}>
          <BarChart3 className="w-3 h-3" /> {score}/100
        </span>
      </div>

      {/* Title */}
      <h3 className="font-semibold text-sm leading-snug mb-2 group-hover:text-white transition-colors line-clamp-2">
        {issue.title}
      </h3>

      {/* Repository */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-5 h-5 rounded-full bg-[#27272a] flex items-center justify-center flex-shrink-0">
          <span className="text-[10px] text-zinc-400 font-bold">
            {(issue.repository_full_name || issue.repo || "?")[0]?.toUpperCase()}
          </span>
        </div>
        <span className="text-xs text-zinc-500 font-mono truncate">
          {issue.repository_full_name || issue.repo}
        </span>
      </div>

      {/* Labels */}
      {issue.labels?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {issue.labels.slice(0, 3).map((label: string) => (
            <span key={label} className="px-2 py-0.5 text-[10px] bg-[#27272a]/50 text-zinc-400 rounded-full border border-[#27272a]">
              {label}
            </span>
          ))}
        </div>
      )}

      {/* AI Reason */}
      {issue.reason && (
        <div className="flex items-start gap-1.5 mb-4 p-3 bg-purple-500/5 border border-purple-500/10 rounded-[14px]">
          <Sparkles className="w-3 h-3 text-purple-400 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">{issue.reason}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-3 border-t border-[#27272a]">
        <Link
          href={`/repo/${issue.repository_full_name || issue.repo}/issues/${issue.number || issue.issue_number}`}
          className="flex-1 h-9 bg-white text-zinc-900 rounded-[12px] text-xs font-semibold inline-flex items-center justify-center gap-1.5 hover:bg-zinc-200 transition-colors scale-press"
        >
          <Play className="w-3 h-3" /> Start Contributing
        </Link>
        <a href={issue.url} target="_blank" rel="noopener noreferrer" 
          className="h-9 w-9 bg-[#27272a] rounded-[12px] text-xs text-zinc-400 hover:text-white transition-colors inline-flex items-center justify-center">
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
        <button className="h-9 w-9 bg-[#27272a] rounded-[12px] text-xs text-zinc-400 hover:text-white transition-colors inline-flex items-center justify-center">
          <Bookmark className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
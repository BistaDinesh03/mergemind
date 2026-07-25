"use client"
import { Clock, BarChart3, Sparkles, ArrowRight, Star, GitFork, Play } from "lucide-react"
import Link from "next/link"

export function IssueCard({ issue }: { issue: any }) {
  const isBeginner = issue.is_beginner_friendly
  const difficulty = isBeginner ? "Easy" : issue.labels?.some((l: string) => l.toLowerCase().includes("help")) ? "Medium" : "Moderate"
  const difficultyColor = isBeginner ? "text-green-400 bg-green-500/10 border-green-500/20" : "text-yellow-400 bg-yellow-500/10 border-yellow-500/20"

  return (
    <div className="bg-[#18181b] border border-[#27272a] rounded-[20px] p-5 hover:border-purple-500/20 hover:-translate-y-0.5 transition-all duration-200 group">
      {/* Top badges */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className={`px-2.5 py-1 text-xs rounded-full border ${difficultyColor}`}>
          {difficulty}
        </span>
        <span className="px-2.5 py-1 text-xs bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20 flex items-center gap-1">
          <Clock className="w-3 h-3" /> 1-2h
        </span>
        <span className="px-2.5 py-1 text-xs bg-purple-500/10 text-purple-300 rounded-full border border-purple-500/20 flex items-center gap-1">
          <BarChart3 className="w-3 h-3" /> {issue.overall_score || 75}/100
        </span>
      </div>

      {/* Title */}
      <h3 className="font-semibold text-sm mb-2 group-hover:text-white transition-colors line-clamp-2">
        {issue.title}
      </h3>

      {/* Repository */}
      <p className="text-xs text-zinc-500 font-mono mb-3">
        {issue.repository_full_name || issue.repo}
      </p>

      {/* Labels */}
      {issue.labels?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {issue.labels.slice(0, 3).map((label: string) => (
            <span key={label} className="px-2 py-0.5 text-[10px] bg-[#27272a] text-zinc-400 rounded-full">
              {label}
            </span>
          ))}
        </div>
      )}

      {/* AI Reason */}
      {issue.reason && (
        <div className="flex items-start gap-1.5 mb-4">
          <Sparkles className="w-3 h-3 text-purple-400 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-zinc-500 line-clamp-2">{issue.reason}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-3 border-t border-[#27272a]">
        <Link
          href={`/repo/${issue.repository_full_name || issue.repo}/issues/${issue.number || issue.issue_number}`}
          className="flex-1 h-9 bg-white text-zinc-900 rounded-[12px] text-xs font-semibold inline-flex items-center justify-center gap-1.5 hover:bg-zinc-200 transition-colors"
        >
          <Play className="w-3 h-3" /> Start Contributing
        </Link>
        <a href={issue.url} target="_blank" rel="noopener noreferrer" className="h-9 px-3 bg-[#27272a] rounded-[12px] text-xs text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-1">
          GitHub <ArrowRight className="w-3 h-3" />
        </a>
      </div>
    </div>
  )
}
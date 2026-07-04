"use client"

import { 
  Sparkles, Thermometer, Clock, GitMerge, Smile, Activity, 
  FileText, Star, Heart, Zap, ChevronRight, Award, AlertCircle
} from "lucide-react"
import Link from "next/link"

interface AIRecommendationProps {
  issue: {
    title: string
    repo: string
    url?: string
    overall_score?: number
    difficulty_score?: number
    difficulty?: string
    merge_chance?: number
    time_estimate?: string
    estimated_hours?: string
    beginner_score?: number
    repo_health?: number
    issue_number?: number
    reason?: string
    labels?: string[]
    verdict?: string
  }
  variant?: "hero" | "card" | "compact"
  linkToDetail?: string
}

export function AIRecommendationCard({ issue, variant = "card", linkToDetail }: AIRecommendationProps) {
  
  const score = issue.overall_score || 0
  const verdict = score >= 80 ? "Highly Recommended" : score >= 60 ? "Recommended" : "Worth Considering"
  const verdictColor = score >= 80 ? "text-green-400 bg-green-500/10 border-green-500/20" : 
                       score >= 60 ? "text-blue-400 bg-blue-500/10 border-blue-500/20" : 
                       "text-yellow-400 bg-yellow-500/10 border-yellow-500/20"

  const factors = [
    { 
      icon: Thermometer, 
      label: "Difficulty", 
      value: issue.difficulty || (issue.difficulty_score > 80 ? "Easy" : issue.difficulty_score > 50 ? "Medium" : "Hard"),
      score: issue.difficulty_score,
      color: "text-green-400",
      bg: "bg-green-500/10",
      bar: "bg-green-500"
    },
    { 
      icon: Clock, 
      label: "Time Estimate", 
      value: issue.time_estimate || issue.estimated_hours || "2-4h",
      score: 75,
      color: "text-purple-400",
      bg: "bg-purple-500/10", 
      bar: "bg-purple-500"
    },
    { 
      icon: GitMerge, 
      label: "Merge Probability", 
      value: `${issue.merge_chance || 75}%`,
      score: issue.merge_chance || 75,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      bar: "bg-blue-500"
    },
    { 
      icon: Heart, 
      label: "Repo Health", 
      value: issue.repo_health ? `${issue.repo_health}/100` : "Good",
      score: issue.repo_health || 75,
      color: "text-rose-400",
      bg: "bg-rose-500/10",
      bar: "bg-rose-500"
    },
    { 
      icon: Activity, 
      label: "Maintainer Activity", 
      value: "Active",
      score: 85,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
      bar: "bg-cyan-500"
    },
    { 
      icon: Smile, 
      label: "Beginner Friendly", 
      value: issue.beginner_score > 80 ? "Very" : "Yes",
      score: issue.beginner_score || 80,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      bar: "bg-amber-500"
    },
  ]

  const isHero = variant === "hero"
  const isCompact = variant === "compact"

  const CardWrapper = ({ children }: { children: React.ReactNode }) => {
    if (linkToDetail) {
      return <Link href={linkToDetail} className="block">{children}</Link>
    }
    if (issue.url) {
      return <a href={issue.url} target="_blank" rel="noopener noreferrer" className="block">{children}</a>
    }
    return <div>{children}</div>
  }

  return (
    <CardWrapper>
      <div className={`bg-[#18181b] border border-[#27272a] rounded-[20px] overflow-hidden transition-all duration-200 hover:border-zinc-600 ${
        isHero ? "border-purple-500/20 bg-gradient-to-r from-purple-500/5 to-blue-500/5" : ""
      }`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between ${isHero ? "p-6 sm:p-8" : "p-5"}`}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[12px] bg-purple-500/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-200">{issue.title}</p>
              <p className="text-xs text-zinc-500 font-mono">{issue.repo}</p>
            </div>
          </div>

          {/* Score */}
          <div className="flex flex-col items-center flex-shrink-0 ml-4">
            <div className={`w-14 h-14 rounded-[16px] flex flex-col items-center justify-center ${
              score >= 80 ? "bg-purple-500/20" : score >= 60 ? "bg-blue-500/20" : "bg-yellow-500/20"
            }`}>
              <span className={`text-xl font-bold ${score >= 80 ? "text-purple-400" : score >= 60 ? "text-blue-400" : "text-yellow-400"}`}>
                {score}
              </span>
            </div>
            <span className="text-[9px] text-zinc-600 mt-1">AI Score</span>
          </div>
        </div>

        {/* AI Explanation */}
        <div className={`px-5 ${isHero ? "px-6 sm:px-8" : ""} pb-4`}>
          <div className={`${verdictColor} inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border mb-3`}>
            <Award className="w-3.5 h-3.5" />
            {verdict}
          </div>
          
          <p className="text-sm text-zinc-400 leading-relaxed">
            <Sparkles className="w-3.5 h-3.5 text-purple-400 inline mr-1.5" />
            {issue.reason || `This issue scored ${score}/100 based on its clarity, the repository's health, and how beginner-friendly it is.`}
          </p>
        </div>

        {/* Factor Grid */}
        <div className={`grid gap-2 px-5 pb-5 ${isHero ? "grid-cols-3 px-6 sm:px-8" : "grid-cols-3"}`}>
          {factors.map(factor => (
            <div key={factor.label} className={`${factor.bg} rounded-[14px] p-3 text-center`}>
              <factor.icon className={`w-4 h-4 ${factor.color} mx-auto mb-1.5`} />
              <p className={`text-sm font-bold ${factor.color}`}>{factor.value}</p>
              <p className="text-[10px] text-zinc-500 mt-0.5">{factor.label}</p>
            </div>
          ))}
        </div>

        {/* Bottom: Skills + Action */}
        {issue.labels && issue.labels.length > 0 && (
          <div className="px-5 pb-5 flex flex-wrap items-center gap-2">
            <span className="text-[10px] text-zinc-600">Skills:</span>
            {issue.labels.slice(0, 4).map(label => (
              <span key={label} className="px-2 py-0.5 text-[10px] bg-[#27272a] text-zinc-400 rounded-full">
                {label}
              </span>
            ))}
          </div>
        )}

        {/* Hover indicator */}
        <div className="border-t border-[#27272a] px-5 py-3 flex items-center justify-between text-xs text-zinc-600">
          <span>Click to see full AI analysis</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </CardWrapper>
  )
}
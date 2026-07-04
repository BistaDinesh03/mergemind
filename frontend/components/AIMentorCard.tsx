"use client"

import { Sparkles, Thermometer, Clock, GitMerge, Smile, Activity, Award, ChevronRight } from "lucide-react"
import Link from "next/link"

export function AIMentorCard({ issue, linkToDetail }: { issue: any; linkToDetail?: string }) {
  if (!issue) return null

  const score = issue.overall_score || 0
  const mergeChance = issue.merge_chance || 75
  const difficulty = (issue.difficulty_score || 0) > 80 ? "Easy" : (issue.difficulty_score || 0) > 50 ? "Medium" : "Challenging"

  // Human-readable explanations based on score
  const getExplanation = () => {
    const points = []
    if ((issue.difficulty_score || 0) > 80) points.push("Beginner-friendly — you can tackle this today")
    if (mergeChance > 80) points.push("Maintainers are responsive — your PR will likely be accepted")
    if (mergeChance > 60) points.push("Good chance of getting merged within a week")
    if ((issue.beginner_score || 0) > 80) points.push("Great for building your open source portfolio")
    points.push("Clear scope — you'll know exactly what to do")
    return points
  }

  const getTimeEstimate = () => {
    const s = issue.difficulty_score || 50
    if (s > 85) return "1-2 hours"
    if (s > 65) return "2-4 hours"
    return "4-8 hours"
  }

  const getMentorAdvice = () => {
    if (score >= 85) return "This is an ideal first contribution. The maintainers are welcoming, the scope is clear, and you'll learn a lot. I'd start here."
    if (score >= 70) return "Solid choice. Read through the issue comments first, then dive in. You've got this."
    if (score >= 55) return "Worth considering, but review the requirements carefully. Ask questions if anything is unclear."
    return "This one is challenging. Make sure you have time to commit before starting."
  }

  const explanations = getExplanation()

  const CardContent = () => (
    <div className="bg-[#18181b] border border-[#27272a] rounded-[24px] overflow-hidden">
      
      {/* Mentor Header */}
      <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-b border-purple-500/10 px-6 py-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-[12px] bg-purple-500/20 flex items-center justify-center">
          <Sparkles className="w-4.5 h-4.5 text-purple-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-purple-300">AI Mentor's Pick</p>
          <p className="text-xs text-zinc-500">Here's why I recommend this issue for you</p>
        </div>
        <div className="ml-auto flex flex-col items-center">
          <span className="text-2xl font-bold text-purple-400">{score}</span>
          <span className="text-[10px] text-zinc-600">/100</span>
        </div>
      </div>

      {/* Issue Title */}
      <div className="px-6 py-4 border-b border-[#27272a]">
        <h3 className="text-lg font-bold leading-snug">{issue.title}</h3>
        <p className="text-sm text-zinc-500 font-mono mt-1">{issue.repo}</p>
      </div>

      {/* Why This Issue */}
      <div className="px-6 py-4 border-b border-[#27272a]">
        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Why This Issue</p>
        <div className="space-y-2.5">
          {explanations.map((point, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Award className="w-3 h-3 text-green-400" />
              </div>
              <p className="text-sm text-zinc-300">{point}</p>
            </div>
          ))}
        </div>
      </div>

      {/* At a Glance */}
      <div className="px-6 py-4 border-b border-[#27272a]">
        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">At a Glance</p>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-green-500/5 border border-green-500/10 rounded-[14px] p-3 text-center">
            <Thermometer className="w-4 h-4 text-green-400 mx-auto mb-1" />
            <p className="text-sm font-semibold text-green-400">{difficulty}</p>
            <p className="text-[10px] text-zinc-500">Difficulty</p>
          </div>
          <div className="bg-blue-500/5 border border-blue-500/10 rounded-[14px] p-3 text-center">
            <GitMerge className="w-4 h-4 text-blue-400 mx-auto mb-1" />
            <p className="text-sm font-semibold text-blue-400">{mergeChance}%</p>
            <p className="text-[10px] text-zinc-500">Merge Chance</p>
          </div>
          <div className="bg-amber-500/5 border border-amber-500/10 rounded-[14px] p-3 text-center">
            <Clock className="w-4 h-4 text-amber-400 mx-auto mb-1" />
            <p className="text-sm font-semibold text-amber-400">{getTimeEstimate()}</p>
            <p className="text-[10px] text-zinc-500">Est. Time</p>
          </div>
        </div>
      </div>

      {/* Mentor Advice */}
      <div className="px-6 py-4 bg-purple-500/5">
        <div className="flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-zinc-300 leading-relaxed italic">"{getMentorAdvice()}"</p>
        </div>
      </div>

      {/* Action */}
      {linkToDetail && (
        <div className="px-6 py-4 border-t border-[#27272a]">
          <Link href={linkToDetail} className="flex items-center justify-between text-sm text-purple-400 hover:text-purple-300 transition-colors font-medium">
            See full AI analysis
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  )

  if (linkToDetail) {
    return <Link href={linkToDetail} className="block card-lift"><CardContent /></Link>
  }

  return (
    <a href={issue.url} target="_blank" rel="noopener noreferrer" className="block card-lift">
      <CardContent />
    </a>
  )
}
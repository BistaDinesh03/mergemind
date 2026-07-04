"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Navbar } from "@/components/Navbar"
import { 
  ExternalLink, Clock, MessageSquare, ChevronRight, Loader2,
  Thermometer, GitMerge, Smile, Activity, FileText,
  Sparkles, Award, CheckCircle, AlertTriangle, Copy, 
  Share2, Bookmark, Zap
} from "lucide-react"

export default function IssueDetailPage() {
  const params = useParams()
  const owner = params?.owner as string
  const repo = params?.repo as string
  const number = params?.number as string
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.title = `Issue #${number} — MergeMind`
    setTimeout(() => setLoading(false), 600)
  }, [number])

  if (loading) return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
    </div>
  )

  const score = 92
  const factors = [
    { icon: Thermometer, label: "Difficulty", score: 88, status: "green" },
    { icon: GitMerge, label: "Merge Chance", score: 85, status: "green" },
    { icon: Clock, label: "Time Estimate", score: 90, status: "green" },
    { icon: Smile, label: "Beginner Friendly", score: 92, status: "green" },
    { icon: Activity, label: "Maintainer Activity", score: 90, status: "green" },
    { icon: FileText, label: "Issue Clarity", score: 78, status: "yellow" },
  ]

  const getStatusColor = (status: string) => {
    switch(status) {
      case "green": return { ring: "#4ade80", bg: "bg-green-500/10", text: "text-green-400" }
      case "yellow": return { ring: "#fbbf24", bg: "bg-amber-500/10", text: "text-amber-400" }
      case "red": return { ring: "#f87171", bg: "bg-red-500/10", text: "text-red-400" }
      default: return { ring: "#a1a1aa", bg: "bg-zinc-500/10", text: "text-zinc-400" }
    }
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-10">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-zinc-500 mb-8 flex-wrap">
          <Link href="/dashboard" className="hover:text-zinc-300">Dashboard</Link><ChevronRight className="w-3.5 h-3.5" />
          <Link href={`/repo/${owner}/${repo}`} className="hover:text-zinc-300">{owner}/{repo}</Link><ChevronRight className="w-3.5 h-3.5" />
          <span className="text-zinc-200 font-medium">#{number}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* ═══ LEFT — Score Circle + Factors ═══ */}
          <div className="space-y-6">
            
            {/* Score Circle */}
            <div className="bg-[#18181b] border border-[#27272a] rounded-[24px] p-8 text-center">
              <p className="text-sm text-zinc-400 uppercase tracking-wider mb-6">AI Score</p>
              
              {/* Animated Ring */}
              <div className="relative w-40 h-40 mx-auto mb-4">
                <svg className="w-40 h-40 -rotate-90" viewBox="0 0 160 160">
                  <circle cx="80" cy="80" r="70" fill="none" stroke="#27272a" strokeWidth="12" />
                  <circle cx="80" cy="80" r="70" fill="none" stroke="url(#scoreGrad)" strokeWidth="12"
                    strokeDasharray={`${2 * Math.PI * 70}`} 
                    strokeDashoffset={`${2 * Math.PI * 70 * 0.08}`} 
                    strokeLinecap="round" className="transition-all duration-1500 ease-out" />
                  <defs>
                    <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#4ade80" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-bold">{score}</span>
                  <span className="text-sm text-zinc-500">/100</span>
                </div>
              </div>

              {/* Verdict */}
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-500/10 text-green-400 rounded-full text-sm font-semibold border border-green-500/20">
                <Award className="w-4 h-4" /> Highly Recommended
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-[#18181b] border border-[#27272a] rounded-[20px] p-4 space-y-2">
              {[
                { icon: ExternalLink, label: "Open on GitHub", primary: !0 },
                { icon: Copy, label: "Copy Link" },
                { icon: Share2, label: "Share Issue" },
                { icon: Bookmark, label: "Bookmark" },
              ].map((action, i) => (
                <button key={i} className={`w-full flex items-center gap-3 px-4 py-3 rounded-[14px] text-sm transition-all duration-200 ${
                  action.primary 
                    ? "bg-white hover:bg-zinc-100 text-zinc-900 font-semibold justify-center" 
                    : "text-zinc-400 hover:text-white hover:bg-[#27272a]/50"
                }`}>
                  <action.icon className="w-4 h-4" /> {action.label}
                </button>
              ))}
            </div>
          </div>

          {/* ═══ MIDDLE — Issue Content ═══ */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Issue Header */}
            <div className="bg-[#18181b] border border-[#27272a] rounded-[24px] p-6 sm:p-8">
              <h1 className="text-xl sm:text-2xl font-bold mb-4 leading-snug">
                Add type hints to dependencies/utils.py
              </h1>
              
              <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-500 mb-4">
                <span className="px-3 py-1.5 bg-green-500/10 text-green-400 rounded-full text-xs font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" /> Open
                </span>
                <span className="flex items-center gap-1.5">
                  <img src={`https://avatars.githubusercontent.com/${owner}`} className="w-5 h-5 rounded-full" />
                  tiangolo
                </span>
                <span><Clock className="w-4 h-4 inline mr-1" />2 days ago</span>
                <span><MessageSquare className="w-4 h-4 inline mr-1" />5 comments</span>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-6">
                {["good first issue","python","enhancement","help wanted"].map(l => (
                  <span key={l} className="px-2.5 py-1 text-xs bg-purple-500/10 text-purple-300 rounded-full border border-purple-500/20">{l}</span>
                ))}
              </div>

              <div className="prose prose-invert max-w-none">
                <p className="text-zinc-400 leading-relaxed">
                  We need to add type hints to the dependencies/utils.py file to improve code quality 
                  and developer experience. This is a great first issue for anyone looking to contribute 
                  to FastAPI.
                </p>
                <h3 className="text-white font-semibold mt-4 mb-2">Steps to reproduce</h3>
                <ol className="text-zinc-400 space-y-2 list-decimal list-inside">
                  <li>Fork the repository</li>
                  <li>Add type hints to all functions in utils.py</li>
                  <li>Run the test suite to ensure nothing breaks</li>
                  <li>Submit a PR</li>
                </ol>
              </div>
            </div>

            {/* Factor Breakdown */}
            <div>
              <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" /> Score Breakdown
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {factors.map(factor => {
                  const status = getStatusColor(factor.status)
                  return (
                    <div key={factor.label} className="bg-[#18181b] border border-[#27272a] rounded-[20px] p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          <factor.icon className={`w-4 h-4 ${status.text}`} />
                          <span className="text-sm font-medium">{factor.label}</span>
                        </div>
                        <span className={`text-base font-bold ${status.text}`}>{factor.score}</span>
                      </div>
                      
                      {/* Mini progress bar */}
                      <div className="w-full h-1.5 bg-[#27272a] rounded-full overflow-hidden">
                        <div className="h-1.5 rounded-full transition-all duration-1000" 
                          style={{ width: `${factor.score}%`, backgroundColor: status.ring }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* AI Recommendation */}
            <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-[24px] p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-[14px] bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">AI Recommendation</h3>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-400 rounded-full text-sm font-semibold border border-green-500/20 mb-3">
                    <Award className="w-4 h-4" /> Highly Recommended
                  </div>
                  <p className="text-zinc-400 leading-relaxed text-sm">
                    This is an excellent first contribution. The issue is well-defined with clear steps, 
                    the maintainers are highly responsive, and the scope is manageable for a beginner. 
                    With a 92/100 score across all factors, this is one of the best issues to start with. 
                    The high merge probability (88%) means your PR is very likely to be accepted.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
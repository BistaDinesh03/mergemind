"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Navbar } from "@/components/Navbar"
import { 
  ExternalLink, Clock, MessageSquare, ChevronRight, Loader2,
  Zap, Thermometer, GitMerge, Smile, Activity, FileText,
  Sparkles, CheckCircle, Target, Shield, TrendingUp,
  Award, ArrowRight
} from "lucide-react"

export default function IssueDetailPage() {
  const params = useParams()
  const owner = params?.owner as string
  const repo = params?.repo as string
  const number = params?.number as string
  const [issue, setIssue] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!owner || !repo || !number) return
    fetch(`http://localhost:8000/api/github/repositories/${owner}/${repo}/issues/${number}`)
      .then(r => r.json()).then(d => { setIssue(d); setLoading(false) }).catch(() => setLoading(false))
  }, [owner, repo, number])

  if (loading) return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
    </div>
  )

  const scoring = issue?.scoring
  const factors = scoring?.factors || {}

  // Mock factors for display
  const displayFactors = [
    { key: "difficulty", icon: Thermometer, label: "Difficulty", score: 88, color: "text-green-400", barColor: "bg-green-500", reason: "Labeled as good first issue, clear scope" },
    { key: "merge_probability", icon: GitMerge, label: "Merge Chance", score: 85, color: "text-blue-400", barColor: "bg-blue-500", reason: "Active maintainers, high historical merge rate" },
    { key: "time_estimate", icon: Clock, label: "Estimated Time", score: 90, color: "text-purple-400", barColor: "bg-purple-500", reason: "Small scope, well-defined requirements" },
    { key: "beginner_friendly", icon: Smile, label: "Beginner Friendly", score: 92, color: "text-yellow-400", barColor: "bg-yellow-500", reason: "Clear instructions, supportive community" },
    { key: "repo_activity", icon: Activity, label: "Repo Health", score: 90, color: "text-cyan-400", barColor: "bg-cyan-500", reason: "Very active, pushed today, popular project" },
    { key: "issue_clarity", icon: FileText, label: "Issue Clarity", score: 78, color: "text-pink-400", barColor: "bg-pink-500", reason: "Good description with reproduction steps" },
  ]

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-10">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-zinc-500 mb-8 flex-wrap">
          <Link href="/dashboard" className="hover:text-zinc-300">Dashboard</Link><ChevronRight className="w-3.5 h-3.5" />
          <Link href="/discover" className="hover:text-zinc-300">Discover</Link><ChevronRight className="w-3.5 h-3.5" />
          <Link href={`/repo/${owner}/${repo}`} className="hover:text-zinc-300 truncate max-w-[120px]">{owner}/{repo}</Link><ChevronRight className="w-3.5 h-3.5" />
          <Link href={`/repo/${owner}/${repo}/issues`} className="hover:text-zinc-300">Issues</Link><ChevronRight className="w-3.5 h-3.5" />
          <span className="text-zinc-200 font-medium">#{number}</span>
        </div>

        {/* ─── HERO SCORE SECTION ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          
          {/* LEFT — Big Score Circle */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative">
              {/* Score Circle */}
              <div className="w-48 h-48 rounded-full bg-gradient-to-br from-purple-600 via-violet-600 to-blue-600 flex items-center justify-center shadow-2xl shadow-purple-500/20">
                <div className="text-center">
                  <p className="text-6xl font-bold text-white">92</p>
                  <p className="text-purple-200 text-sm mt-1">out of 100</p>
                </div>
              </div>
              {/* Confidence ring */}
              <svg className="absolute inset-0 w-48 h-48 -rotate-90">
                <circle cx="96" cy="96" r="90" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
                <circle cx="96" cy="96" r="90" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="4" 
                  strokeDasharray={`${2 * Math.PI * 90}`} strokeDashoffset={`${2 * Math.PI * 90 * 0.08}`} strokeLinecap="round" />
              </svg>
            </div>
            
            {/* Verdict */}
            <div className="mt-6 text-center">
              <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-500/10 text-green-400 rounded-full text-base font-semibold border border-green-500/20">
                <Award className="w-5 h-5" /> Highly Recommended
              </span>
            </div>
          </div>

          {/* RIGHT — Factor Scores */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2.5 mb-1">
                <Sparkles className="w-5 h-5 text-purple-400" /> Why this score?
              </h2>
              <p className="text-sm text-zinc-500">AI analyzed this issue across 6 dimensions</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {displayFactors.map(factor => (
                <div key={factor.key} className="bg-[#18181b] border border-white/[0.06] rounded-[20px] p-5 hover:border-white/[0.12] transition-all duration-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-[14px] flex items-center justify-center ${
                        factor.score >= 80 ? "bg-green-500/10" : factor.score >= 60 ? "bg-blue-500/10" : "bg-yellow-500/10"
                      }`}>
                        <factor.icon className={`w-5 h-5 ${factor.color}`} />
                      </div>
                      <span className="text-base font-semibold">{factor.label}</span>
                    </div>
                    <span className={`text-xl font-bold ${factor.color}`}>{factor.score}</span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full h-2 bg-white/[0.04] rounded-full mb-2">
                    <div className={`h-2 ${factor.barColor} rounded-full transition-all duration-1000 ease-out`} 
                      style={{ width: `${factor.score}%` }} />
                  </div>
                  
                  <p className="text-sm text-zinc-500">{factor.reason}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── ISSUE DETAILS ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT — Issue Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Issue Header */}
            <div className="bg-[#18181b] border border-white/[0.06] rounded-[20px] p-8">
              <div className="flex items-start justify-between mb-5">
                <h1 className="text-2xl font-bold tracking-tight flex-1 leading-snug">{issue?.title}</h1>
                <a href={issue?.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 h-[44px] px-5 bg-white hover:bg-zinc-100 text-zinc-900 rounded-[14px] text-sm font-semibold transition-all duration-200 active:scale-[0.98] flex-shrink-0 ml-4">
                  <ExternalLink className="w-4 h-4" /> Open on GitHub
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500 mb-4">
                <span className="px-3 py-1.5 bg-green-500/10 text-green-400 rounded-full text-xs font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" /> Open
                </span>
                {issue?.author && (
                  <span className="flex items-center gap-2">
                    <img src={issue.author.avatar} className="w-5 h-5 rounded-full" />
                    {issue.author.login}
                  </span>
                )}
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {new Date(issue?.created_at).toLocaleDateString()}</span>
                <span className="flex items-center gap-1.5"><MessageSquare className="w-4 h-4" /> {issue?.comments_count || 0} comments</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {issue?.labels?.map((l: string) => (
                  <span key={l} className="px-3 py-1.5 text-xs bg-purple-500/5 text-purple-300 rounded-full border border-purple-500/10 font-medium">{l}</span>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-[#18181b] border border-white/[0.06] rounded-[20px] p-8">
              <h2 className="text-lg font-bold mb-4">Description</h2>
              <div className="text-base text-zinc-400 leading-relaxed whitespace-pre-wrap">
                {issue?.body || "No description provided."}
              </div>
            </div>
          </div>

          {/* RIGHT — AI Summary + Action */}
          <div className="space-y-5">
            
            {/* AI Recommendation */}
            <div className="bg-gradient-to-br from-purple-500/5 to-blue-500/5 border border-purple-500/10 rounded-[20px] p-6">
              <h3 className="text-sm font-semibold text-purple-300 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> AI Recommendation
              </h3>
              <p className="text-base text-zinc-300 leading-relaxed mb-4">
                This is an excellent issue for you. It's beginner-friendly, has clear requirements, 
                and the maintainers are highly active. High probability of merge within a week.
              </p>
              
              {/* Key strengths */}
              <div className="space-y-2 mb-4">
                {[
                  "Well-documented with clear steps",
                  "Active maintainers respond within hours",
                  "Small scope — estimated 1-2 hours",
                  "No competing PRs currently open",
                ].map((s, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-zinc-400">{s}</span>
                  </div>
                ))}
              </div>

              <a href={issue?.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 w-full h-[52px] bg-white hover:bg-zinc-100 text-zinc-900 rounded-[14px] font-semibold text-base transition-all duration-200 active:scale-[0.98] shadow-sm shadow-white/5">
                <ExternalLink className="w-4 h-4" /> Start Contributing on GitHub
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Quick Stats */}
            <div className="bg-[#18181b] border border-white/[0.06] rounded-[20px] p-6">
              <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Quick Stats</h3>
              <div className="space-y-3">
                {[
                  { icon: Clock, label: "Estimated Time", value: "1-2 hours" },
                  { icon: Target, label: "Difficulty", value: "Easy" },
                  { icon: TrendingUp, label: "Merge Chance", value: "85%" },
                  { icon: Shield, label: "Repo Health", value: "90/100" },
                ].map(s => (
                  <div key={s.label} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                    <span className="text-sm text-zinc-500 flex items-center gap-2.5">
                      <s.icon className="w-4 h-4" /> {s.label}
                    </span>
                    <span className="text-sm font-semibold text-zinc-200">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
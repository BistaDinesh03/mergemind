"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Navbar } from "@/components/Navbar"
import { 
  Star, GitFork, AlertCircle, Clock, ExternalLink, 
  GitBranch, Package, Shield, Sparkles, ChevronRight, 
  Loader2, Bug, Activity, Heart, TrendingUp,
  BookOpen, Users, Wrench, Rocket, Zap, ArrowRight,
  Thermometer, GitMerge, Smile
} from "lucide-react"

export default function RepoDetailPage() {
  const params = useParams()
  const owner = params?.owner as string
  const repo = params?.repo as string
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.title = `${owner}/${repo} — MergeMind`
    setTimeout(() => setLoading(false), 600)
  }, [owner, repo])

  if (loading) return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
    </div>
  )

  const health = { overall: 90, status: "Excellent" }
  const healthFactors = [
    { icon: Activity, label: "Activity", score: 95, color: "bg-green-500", reason: "Pushed today, frequent commits" },
    { icon: BookOpen, label: "Documentation", score: 88, color: "bg-blue-500", reason: "Well-maintained README, Wiki enabled" },
    { icon: Users, label: "Community", score: 92, color: "bg-purple-500", reason: "99K+ stars, 9.5K forks, discussions active" },
    { icon: Wrench, label: "Maintenance", score: 85, color: "bg-amber-500", reason: "Issues triaged, PRs merged within days" },
    { icon: Rocket, label: "Release Frequency", score: 90, color: "bg-cyan-500", reason: "Regular releases, latest: 0.139.0" },
  ]

  const topIssues = [
    { number: 10370, title: "Add type hints to dependencies/utils.py", score: 92, difficulty: "Easy", merge: 88, time: "1-2h", beginner: !0 },
    { number: 10345, title: "Improve error messages in validation", score: 87, difficulty: "Medium", merge: 82, time: "2-3h", beginner: !1 },
    { number: 10280, title: "Update documentation for middleware", score: 84, difficulty: "Easy", merge: 90, time: "1h", beginner: !0 },
  ]

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-10 space-y-10">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-zinc-500 animate-fadeInUp">
          <Link href="/discover" className="hover:text-zinc-300">Discover</Link><ChevronRight className="w-3.5 h-3.5" />
          <span className="text-zinc-200 font-medium">{owner}/{repo}</span>
        </div>

        {/* ═══ HERO ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeInUp">
          
          {/* LEFT — Repo Info + Health */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Repo Header */}
            <div className="bg-[#18181b] border border-[#27272a] rounded-[24px] p-6 sm:p-8">
              <div className="flex items-start gap-5 mb-6">
                <img src={`https://avatars.githubusercontent.com/${owner}`} alt={owner} 
                  className="w-16 h-16 rounded-full ring-2 ring-[#27272a] flex-shrink-0" />
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl font-bold">{owner}/{repo}</h1>
                  <p className="text-zinc-400 text-base mt-1">FastAPI framework, high performance, easy to learn, fast to code, ready for production</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {["api","async","python","web","framework"].map(t => (
                      <span key={t} className="px-2.5 py-1 text-xs bg-purple-500/10 text-purple-300 rounded-full border border-purple-500/20">{t}</span>
                    ))}
                  </div>
                </div>
                <a href={`https://github.com/${owner}/${repo}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 h-11 px-5 bg-white hover:bg-zinc-100 text-zinc-900 rounded-[14px] text-sm font-semibold transition-all duration-200 active:scale-[0.98] flex-shrink-0">
                  <ExternalLink className="w-4 h-4" /> GitHub
                </a>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-[#27272a]">
                {[
                  { icon: Star, label: "Stars", value: "99.6K" },
                  { icon: GitFork, label: "Forks", value: "9.5K" },
                  { icon: AlertCircle, label: "Open Issues", value: "92" },
                  { icon: Clock, label: "Updated", value: "Today" },
                ].map(s => (
                  <div key={s.label} className="text-center p-3 bg-[#09090b]/50 rounded-[14px]">
                    <s.icon className="w-4 h-4 text-zinc-500 mx-auto mb-1" />
                    <p className="text-lg font-bold">{s.value}</p>
                    <p className="text-xs text-zinc-600">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Health Breakdown */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-purple-500/10 rounded-[14px] flex items-center justify-center">
                  <Heart className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Repository Health</h2>
                  <p className="text-sm text-zinc-500">Breakdown across 5 dimensions</p>
                </div>
              </div>

              <div className="space-y-3">
                {healthFactors.map(factor => (
                  <div key={factor.label} className="bg-[#18181b] border border-[#27272a] rounded-[20px] p-5 hover:border-zinc-600 transition-all duration-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-[12px] bg-[#09090b]/50 flex items-center justify-center">
                          <factor.icon className="w-4.5 h-4.5 text-zinc-400" />
                        </div>
                        <span className="text-base font-semibold">{factor.label}</span>
                      </div>
                      <span className="text-xl font-bold">{factor.score}</span>
                    </div>
                    
                    <div className="w-full h-2.5 bg-[#27272a] rounded-full overflow-hidden">
                      <div className={`h-2.5 ${factor.color} rounded-full transition-all duration-1000`} 
                        style={{ width: `${factor.score}%` }} />
                    </div>
                    
                    <p className="text-sm text-zinc-500 mt-2">{factor.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — AI Summary + Score */}
          <div className="space-y-5">
            
            {/* Overall Health Score */}
            <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-[24px] p-8 text-center sticky top-24">
              <p className="text-sm text-purple-300 font-medium uppercase tracking-wider mb-4">Health Score</p>
              <p className="text-6xl font-bold text-purple-400">{health.overall}</p>
              <p className="text-zinc-500 text-sm mt-2">out of 100</p>
              <span className="inline-block mt-4 px-4 py-2 bg-green-500/10 text-green-400 rounded-full text-sm font-medium border border-green-500/20">
                {health.status}
              </span>
            </div>

            {/* AI Summary */}
            <div className="bg-[#18181b] border border-[#27272a] rounded-[20px] p-6">
              <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" /> AI Summary
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                FastAPI is an exceptional project for contributors. The maintainers are highly active, 
                documentation is thorough, and the community is welcoming. With 92 open issues and 
                a 90/100 health score, this is one of the best repos to contribute to right now.
              </p>
            </div>
          </div>
        </div>

        {/* ═══ TOP RECOMMENDED ISSUES ═══ */}
        <section className="animate-fadeInUp">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/10 rounded-[14px] flex items-center justify-center">
                <Zap className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Top Recommended Issues</h2>
                <p className="text-sm text-zinc-500">AI-picked for beginners</p>
              </div>
            </div>
            <Link href={`/repo/${owner}/${repo}/issues`} 
              className="flex items-center gap-2 h-11 px-5 bg-white hover:bg-zinc-100 text-zinc-900 rounded-[14px] text-sm font-semibold transition-all duration-200">
              View All Issues <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {topIssues.map((issue, i) => (
              <Link key={i} href={`/repo/${owner}/${repo}/issues/${issue.number}`}
                className="group bg-[#18181b] border border-[#27272a] rounded-[20px] p-5 hover:border-zinc-600 card-hover transition-all duration-200">
                
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-zinc-500 font-mono">#{issue.number}</span>
                  {issue.beginner && (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 bg-green-500/10 text-green-400 rounded-full text-xs font-medium">
                      <Smile className="w-3 h-3" /> Beginner
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-base font-semibold mb-4 group-hover:text-white transition-colors line-clamp-2">
                  {issue.title}
                </h3>

                {/* Score Pills */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-purple-500/10 rounded-full text-xs font-medium text-purple-300">
                    <Thermometer className="w-3 h-3" /> {issue.difficulty}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-500/10 rounded-full text-xs font-medium text-blue-300">
                    <GitMerge className="w-3 h-3" /> {issue.merge}%
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-500/10 rounded-full text-xs font-medium text-amber-300">
                    <Clock className="w-3 h-3" /> {issue.time}
                  </span>
                </div>

                {/* Score */}
                <div className="flex items-center justify-between pt-3 border-t border-[#27272a]">
                  <span className="text-xs text-zinc-500">AI Score</span>
                  <span className="text-xl font-bold text-purple-400">{issue.score}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ═══ CTA BANNER ═══ */}
        <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-[24px] p-8 text-center animate-fadeInUp">
          <Sparkles className="w-8 h-8 text-purple-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold mb-2">Ready to contribute?</h2>
          <p className="text-zinc-400 mb-6">Start with one of the recommended issues above</p>
          <Link href={`/repo/${owner}/${repo}/issues`}
            className="inline-flex items-center gap-2 h-[52px] px-8 bg-white hover:bg-zinc-100 text-zinc-900 rounded-[14px] font-semibold text-base transition-all duration-200 active:scale-[0.98]">
            Browse All Issues <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
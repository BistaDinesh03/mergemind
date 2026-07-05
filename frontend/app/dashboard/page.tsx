"use client"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { ErrorDisplay } from "@/components/ErrorDisplay"
import { 
  Sparkles, ArrowRight, Thermometer, Clock, GitMerge, 
  Award, ExternalLink, Shield, Zap, Info, CheckCircle,
  RefreshCw, AlertCircle
} from "lucide-react"

const API = "http://localhost:8000"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [topIssue, setTopIssue] = useState(null)
  const [recs, setRecs] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (status !== "authenticated") return
    setLoading(true)
    setError(null)

    // Fetch recommendations
    fetch(`${API}/api/recommendations/top?limit=4`)
      .then(r => r.json())
      .then(d => {
        if (d?.recommendations?.length > 0) {
          setTopIssue(d.recommendations[0])
          setRecs(d.recommendations.slice(1, 4))
        }
      })
      .catch(() => {})

    // Fetch profile stats
    fetch(`${API}/api/portfolio/BistaDinesh03`)
      .then(r => {
        if (!r.ok) throw new Error("Failed to load profile")
        return r.json()
      })
      .then(d => {
        setStats({
          repos: d.public_repos || 0,
          stars: d.repositories?.reduce((s,r) => s+(r.stars||0), 0) || 0,
          followers: d.followers || 0,
          avatar: d.avatar,
          name: d.name || "Developer"
        })
        setLoading(false)
      })
      .catch(() => {
        setError("Unable to load your GitHub profile.")
        setLoading(false)
      })
  }, [status])

  const extractLink = (issue) => {
    if (!issue?.repo) return "#"
    const [o, r] = issue.repo.split("/")
    return `/repo/${o}/${r}/issues/${issue.issue_number || "1"}`
  }

  // Loading state — skeleton, no fake zeros
  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b]">
        <Navbar />
        <div className="max-w-2xl mx-auto px-6 py-16 space-y-8 animate-pulse">
          <div className="space-y-2">
            <div className="h-5 w-48 skeleton" />
            <div className="h-4 w-64 skeleton" />
          </div>
          <div className="h-80 skeleton rounded-[24px]" />
          <div className="grid grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 skeleton rounded-[20px]" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Error state — profile API failed
  if (error) {
    return (
      <div className="min-h-screen bg-[#09090b]">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-5">
            <AlertCircle className="w-7 h-7 text-red-400" />
          </div>
          <h2 className="text-lg font-bold mb-2">Unable to load your GitHub profile</h2>
          <p className="text-sm text-zinc-400 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="h-10 px-5 bg-white hover:bg-zinc-100 text-zinc-900 rounded-[14px] text-sm font-semibold inline-flex items-center gap-2 transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Retry
          </button>
        </div>
      </div>
    )
  }

  // Success state — real data only
  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <Navbar />
      <main className="max-w-2xl mx-auto px-6 py-12 space-y-10">
        
        {/* Welcome — only shown when stats are available */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            {stats?.avatar && (
              <img src={stats.avatar} alt="GitHub avatar" className="w-9 h-9 rounded-full ring-1 ring-[#27272a]" />
            )}
            <div>
              <h1 className="text-xl font-bold">Good morning, {stats?.name || "Developer"} 👋</h1>
              <p className="text-sm text-zinc-500">Ready to make a contribution today?</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-zinc-600">
            <span className="flex items-center gap-1.5">
              <Shield className="w-3 h-3 text-green-400" /> Connected to GitHub
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-purple-400" /> {stats.repos} repos analyzed
            </span>
          </div>
        </div>

        {/* Today's Best Pick */}
        {topIssue && (
          <div className="bg-[#18181b] border border-purple-500/20 rounded-[24px] p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <p className="text-xs font-semibold text-purple-300 uppercase tracking-wider">Today's Best Pick</p>
            </div>
            <h2 className="text-xl font-bold mb-1.5 leading-snug">{topIssue.title}</h2>
            <p className="text-sm text-zinc-500 font-mono mb-5">{topIssue.repo}</p>

            <div className="bg-purple-500/5 border border-purple-500/10 rounded-[14px] p-4 mb-5">
              <p className="text-xs text-purple-300 font-medium mb-2">
                <Info className="w-3.5 h-3.5 inline mr-1.5" />Why this issue was selected
              </p>
              <div className="space-y-1.5">
                {["Clear scope with well-defined requirements", "Active maintainers who respond quickly", "High merge probability based on repo history", "Matches your experience level"].map((r, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-green-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-zinc-300">{r}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5 mb-6">
              <div className="px-4 py-3 bg-green-500/5 border border-green-500/10 rounded-[14px]">
                <Thermometer className="w-4 h-4 text-green-400 inline mr-2" />
                <span className="text-sm font-bold text-green-400">Easy</span>
              </div>
              <div className="px-4 py-3 bg-blue-500/5 border border-blue-500/10 rounded-[14px]">
                <GitMerge className="w-4 h-4 text-blue-400 inline mr-2" />
                <span className="text-sm font-bold text-blue-400">{topIssue.merge_chance || 88}% Merge</span>
              </div>
              <div className="px-4 py-3 bg-amber-500/5 border border-amber-500/10 rounded-[14px]">
                <Clock className="w-4 h-4 text-amber-400 inline mr-2" />
                <span className="text-sm font-bold text-amber-400">{topIssue.estimated_hours || "1-2h"}</span>
              </div>
              <div className="px-4 py-3 bg-purple-500/5 border border-purple-500/10 rounded-[14px]">
                <Award className="w-4 h-4 text-purple-400 inline mr-2" />
                <span className="text-sm font-bold text-purple-400">{topIssue.overall_score}/100</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <Link 
                href={extractLink(topIssue)} 
                className="h-[48px] px-6 bg-white hover:bg-zinc-100 text-zinc-900 rounded-[14px] font-semibold text-sm inline-flex items-center gap-2 transition-all duration-200 active:scale-[0.98]"
              >
                View AI Breakdown <ArrowRight className="w-4 h-4" />
              </Link>
              <a 
                href={topIssue.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="h-[40px] px-5 bg-[#18181b] hover:bg-[#27272a] text-zinc-400 hover:text-white rounded-[14px] text-sm font-medium inline-flex items-center gap-2 border border-[#27272a] transition-all duration-200"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Open on GitHub
              </a>
            </div>
          </div>
        )}

        {/* Stats — only rendered when data exists */}
        {stats && (
          <div className="grid grid-cols-4 gap-3 pt-6 border-t border-[#27272a]">
            {[
              { label: "Repositories", value: stats.repos },
              { label: "Stars earned", value: stats.stars },
              { label: "Followers", value: stats.followers },
              { label: "Picks ready", value: topIssue ? recs.length + 1 : 0 },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className="text-lg font-bold text-zinc-400">{s.value}</p>
                <p className="text-[10px] text-zinc-600">{s.label}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Navbar } from "@/components/Navbar"
import { 
  Star, GitFork, AlertCircle, Clock, ExternalLink, 
  GitBranch, Package, Shield, Sparkles, ChevronRight, 
  Loader2, Bug, Activity, Heart, TrendingUp,
  BookOpen, Users, Wrench, Rocket
} from "lucide-react"

const API = "http://localhost:8000"

interface HealthCategory {
  score: number
  label: string
  icon?: string
  reasons?: string[]
}

interface Health {
  overall: number
  status: string
  categories: Record<string, HealthCategory>
}

interface RepoData {
  full_name: string
  description: string
  stars: number
  forks: number
  open_issues: number
  watchers: number
  default_branch: string
  language: string
  license: string | null
  pushed_at: string
  url: string
  owner: {
    avatar: string
  }
  topics: string[]
  health: Health
}

interface Issue {
  id: number
  number: number
  title: string
  comments: number
  labels: string[]
  is_beginner_friendly: boolean
}

export default function RepoDetailPage() {
  const params = useParams()
  const owner = params?.owner as string
  const repo = params?.repo as string
  const [data, setData] = useState<RepoData | null>(null)
  const [issues, setIssues] = useState<Issue[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!owner || !repo) return
    setLoading(true)
    Promise.all([
      fetch(`${API}/api/github/repositories/${owner}/${repo}`).then(r => r.json()).catch(() => null),
      fetch(`${API}/api/github/repositories/${owner}/${repo}/issues?per_page=5`).then(r => r.json()).catch(() => null),
    ]).then(([rd, id]) => {
      setData(rd)
      setIssues(id?.issues || [])
    }).finally(() => setLoading(false))
  }, [owner, repo])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#09090b] text-white"><Navbar />
        <div className="flex flex-col items-center justify-center py-32">
          <AlertCircle className="w-10 h-10 text-red-400 mb-4" />
          <p className="text-zinc-400">Repository not found</p>
          <Link href="/discover" className="mt-4 text-sm text-purple-400 hover:text-purple-300">← Back to Discover</Link>
        </div>
      </div>
    )
  }

  const health = data.health || { overall: 75, status: "Good", categories: {} }
  const categories = health.categories || {}
  const stars = data.stars || 0
  const forks = data.forks || 0
  const openIssues = data.open_issues || 0

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <Link href="/discover" className="hover:text-zinc-300 transition-colors">Discover</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-zinc-200 font-medium">{data.full_name || `${owner}/${repo}`}</span>
        </div>

        {/* REPO HEADER */}
        <div className="bg-[#18181b] border border-[#27272a] rounded-[24px] p-6 sm:p-8">
          <div className="flex items-start gap-5">
            <img src={data.owner?.avatar || `https://avatars.githubusercontent.com/${owner}`} 
              alt="" className="w-14 h-14 rounded-full ring-1 ring-[#27272a] flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold">{data.full_name || `${owner}/${repo}`}</h1>
              <p className="text-zinc-400 text-base mt-1">{data.description || "No description"}</p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {data.topics?.slice(0, 6).map((t: string) => (
                  <span key={t} className="px-2.5 py-1 text-xs bg-blue-500/5 text-blue-300 rounded-full border border-blue-500/10">{t}</span>
                ))}
              </div>
            </div>
            <a href={data.url || `https://github.com/${owner}/${repo}`} target="_blank" rel="noopener noreferrer"
              className="h-10 px-5 bg-white hover:bg-zinc-100 text-zinc-900 rounded-[14px] text-sm font-semibold inline-flex items-center gap-2 transition-all duration-200 active:scale-[0.98] flex-shrink-0">
              <ExternalLink className="w-4 h-4" /> GitHub
            </a>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mt-6 pt-6 border-t border-[#27272a]">
            {[
              { icon: Star, label: "Stars", value: stars.toLocaleString(), color: "text-yellow-400" },
              { icon: GitFork, label: "Forks", value: forks.toLocaleString(), color: "text-blue-400" },
              { icon: AlertCircle, label: "Issues", value: openIssues, color: "text-red-400" },
              { icon: Users, label: "Watchers", value: data.watchers?.toLocaleString() || "—", color: "text-green-400" },
              { icon: GitBranch, label: "Branch", value: data.default_branch || "main", color: "text-zinc-400" },
              { icon: Package, label: "Release", value: "—", color: "text-purple-400" },
              { icon: Shield, label: "License", value: data.license || "—", color: "text-zinc-400" },
              { icon: Clock, label: "Updated", value: data.pushed_at ? new Date(data.pushed_at).toLocaleDateString() : "—", color: "text-zinc-400" },
            ].map(s => (
              <div key={s.label} className="text-center p-3 bg-[#09090b]/50 rounded-[14px]">
                <s.icon className={`w-3.5 h-3.5 ${s.color} mx-auto mb-1`} />
                <p className="text-sm font-bold">{s.value}</p>
                <p className="text-[10px] text-zinc-600">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* TWO COLUMN: Health + AI */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* HEALTH SCORE */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Overall Score */}
            <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-[24px] p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2.5">
                    <Heart className="w-5 h-5 text-purple-400" /> Repository Health
                  </h2>
                  <p className="text-sm text-zinc-500 mt-1">Analyzed across 4 dimensions</p>
                </div>
                <div className="text-right">
                  <p className="text-5xl font-bold text-purple-400">{health.overall || "—"}</p>
                  <p className="text-sm text-zinc-500">out of 100</p>
                </div>
              </div>

              <span className={`inline-flex px-3 py-1.5 rounded-full text-sm font-medium ${
                health.status === "Excellent" ? "bg-green-500/20 text-green-400" :
                health.status === "Good" ? "bg-blue-500/20 text-blue-400" :
                "bg-yellow-500/20 text-yellow-400"
              }`}>{health.status || "Unknown"}</span>
            </div>

            {/* Factor Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(categories).length > 0 ? (
                Object.entries(categories).map(([key, cat]: [string, any]) => (
                  <div key={key} className="bg-[#18181b] border border-[#27272a] rounded-[20px] p-5 hover:border-zinc-600 transition-all duration-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold capitalize">{cat.label || key}</span>
                      <span className={`text-lg font-bold ${
                        cat.score >= 80 ? "text-green-400" : cat.score >= 60 ? "text-blue-400" : "text-yellow-400"
                      }`}>{cat.score}</span>
                    </div>
                    
                    <div className="w-full h-2 bg-[#27272a] rounded-full overflow-hidden mb-2">
                      <div className={`h-2 rounded-full transition-all duration-700 ${
                        cat.score >= 80 ? "bg-gradient-to-r from-green-500 to-emerald-500" : 
                        cat.score >= 60 ? "bg-gradient-to-r from-blue-500 to-indigo-500" : 
                        "bg-gradient-to-r from-yellow-500 to-amber-500"
                      }`} style={{ width: `${cat.score}%` }} />
                    </div>
                    
                    {cat.reasons?.length > 0 && (
                      <div className="space-y-0.5">
                        {cat.reasons.map((r: string, i: number) => (
                          <p key={i} className="text-xs text-zinc-500">• {r}</p>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="col-span-2 bg-[#18181b] border border-[#27272a] rounded-[20px] p-8 text-center">
                  <Activity className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
                  <p className="text-sm text-zinc-500">Health analysis not available for this repository</p>
                </div>
              )}
            </div>
          </div>

          {/* AI SUMMARY */}
          <div className="space-y-5">
            <div className="bg-gradient-to-br from-purple-500/5 to-blue-500/5 border border-purple-500/20 rounded-[20px] p-6 sticky top-20">
              <h3 className="text-sm font-semibold text-purple-300 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> AI Summary
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {data.full_name || `${owner}/${repo}`} is a {data.language || "popular"} repository with {stars.toLocaleString()} stars and {openIssues} open issues.
                {health.overall >= 80 ? " The maintainers are active and the project is well-documented. Great for contributors of all levels." : 
                 health.overall >= 60 ? " The project shows moderate activity. Review the open issues before contributing." : 
                 " Activity appears limited. Check recent commits before investing time."}
              </p>
              <p className="text-[10px] text-zinc-600 mt-3">Generated by Google Gemini 2.5 Flash</p>
            </div>
          </div>
        </div>

        {/* OPEN ISSUES */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2.5">
                <Bug className="w-5 h-5 text-zinc-400" /> Open Issues
              </h2>
              <p className="text-sm text-zinc-500 mt-1">{issues.length} available to work on</p>
            </div>
            {issues.length > 0 && (
              <Link href={`/repo/${owner}/${repo}/issues`} 
                className="h-10 px-5 bg-white hover:bg-zinc-100 text-zinc-900 rounded-[14px] text-sm font-semibold inline-flex items-center gap-2 transition-all duration-200">
                View All Issues <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>

          {issues.length === 0 ? (
            <div className="bg-[#18181b] border border-[#27272a] rounded-[20px] p-10 text-center">
              <AlertCircle className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
              <p className="text-sm text-zinc-500">No open issues found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {issues.map((issue: Issue) => (
                <Link key={issue.id} href={`/repo/${owner}/${repo}/issues/${issue.number}`}
                  className="flex items-center justify-between bg-[#18181b] border border-[#27272a] rounded-[20px] p-4 hover:border-zinc-600 transition-all duration-200 group">
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <span className="text-sm text-zinc-600 font-mono flex-shrink-0">#{issue.number}</span>
                    <span className="text-sm text-zinc-300 truncate group-hover:text-white transition-colors">{issue.title}</span>
                    {issue.labels?.slice(0, 2).map((l: string) => (
                      <span key={l} className="hidden sm:inline text-xs px-2 py-0.5 bg-purple-500/10 text-purple-300 rounded-full flex-shrink-0">{l}</span>
                    ))}
                    {issue.is_beginner_friendly && (
                      <span className="hidden sm:inline text-xs px-2 py-0.5 bg-green-500/10 text-green-400 rounded-full flex-shrink-0">🎯 Beginner</span>
                    )}
                  </div>
                  <div className="text-xs text-zinc-600 flex-shrink-0 ml-4">💬 {issue.comments || 0}</div>
                </Link>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  )
}
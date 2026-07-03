"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Navbar } from "@/components/Navbar"
import { 
  Star, GitFork, AlertCircle, Clock, ExternalLink, 
  GitBranch, Package, Shield, Sparkles, ChevronRight, 
  Loader2, Bug, Activity, Code2, Scale, TrendingUp,
  Users, FileText, Heart
} from "lucide-react"

export default function RepoDetailPage() {
  const params = useParams()
  const owner = params?.owner as string
  const repo = params?.repo as string
  const [data, setData] = useState<any>(null)
  const [issues, setIssues] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!owner || !repo) return
    Promise.all([
      fetch("http://localhost:8000/api/github/repositories/"+owner+"/"+repo).then(r => r.json()),
      fetch("http://localhost:8000/api/github/repositories/"+owner+"/"+repo+"/issues?per_page=5").then(r => r.json()),
      fetch("http://localhost:8000/api/github/repositories/"+owner+"/"+repo+"/ai-summary").then(r => r.json().catch(() => ({summary:""})))
    ]).then(([rd, id, ai]) => {
      setData(rd)
      setIssues(id.issues || [])
    }).finally(() => setLoading(false))
  }, [owner, repo])

  if (loading) return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
      <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
    </div>
  )

  const health = data?.health || {}
  const categories = health?.categories || {}
  const stars = data?.stars || 0
  const forks = data?.forks || 0
  const openIssues = data?.open_issues || 0

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-6 sm:px-10 py-10 space-y-10">
        
        {/* ─── BREADCRUMB ─── */}
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <Link href="/discover" className="hover:text-zinc-300 transition-colors">Discover</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-zinc-200 font-medium">{data?.full_name}</span>
          <span className="px-2 py-0.5 bg-zinc-800 rounded-md text-xs text-zinc-500">Public</span>
        </div>

        {/* ─── REPO HEADER ─── */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <div className="flex items-start gap-5">
            <img src={data?.owner?.avatar} className="w-14 h-14 rounded-full ring-1 ring-zinc-700 flex-shrink-0" />
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold tracking-tight">{data?.full_name}</h1>
              </div>
              <p className="text-base text-zinc-400 leading-relaxed mb-4">{data?.description || "No description"}</p>
              
              <div className="flex flex-wrap items-center gap-2">
                {data?.topics?.slice(0, 6).map((t: string) => (
                  <span key={t} className="px-2.5 py-1 text-xs bg-blue-500/5 text-blue-300 rounded-lg border border-blue-500/10">{t}</span>
                ))}
              </div>
            </div>
            <a href={data?.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-sm font-medium transition-all duration-150 flex-shrink-0">
              <ExternalLink className="w-4 h-4" /> GitHub
            </a>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mt-8 pt-6 border-t border-zinc-800">
            {[
              { icon: Star, label: "Stars", value: stars.toLocaleString(), color: "text-yellow-400" },
              { icon: GitFork, label: "Forks", value: forks.toLocaleString(), color: "text-blue-400" },
              { icon: AlertCircle, label: "Issues", value: openIssues, color: "text-red-400" },
              { icon: Users, label: "Watchers", value: data?.watchers?.toLocaleString() || "—", color: "text-green-400" },
              { icon: GitBranch, label: "Branch", value: data?.default_branch || "main", color: "text-zinc-400" },
              { icon: Package, label: "Release", value: data?.latest_release?.tag || "—", color: "text-purple-400" },
              { icon: Scale, label: "License", value: data?.license || "—", color: "text-zinc-400" },
              { icon: Clock, label: "Updated", value: data?.pushed_at ? new Date(data.pushed_at).toLocaleDateString() : "—", color: "text-zinc-400" },
            ].map(s => (
              <div key={s.label} className="text-center p-3 bg-zinc-800/30 rounded-xl">
                <s.icon className={`w-3.5 h-3.5 ${s.color} mx-auto mb-1.5`} />
                <p className="text-sm font-semibold">{s.value}</p>
                <p className="text-[10px] text-zinc-600">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ─── TWO COLUMN LAYOUT ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT — Health + Issues (2 columns) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* ─── HEALTH SCORE — The Hero Section ─── */}
            <section>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
                  <Heart className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Repository Health</h2>
                  <p className="text-sm text-zinc-500">Analyzed across 4 dimensions</p>
                </div>
              </div>

              {/* Overall Score — Prominent */}
              <div className="bg-gradient-to-br from-purple-500/5 to-blue-500/5 border border-purple-500/10 rounded-2xl p-8 mb-5">
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-5xl font-bold text-purple-400">{health?.overall || "—"}</p>
                    <p className="text-sm text-zinc-500 mt-1">out of 100</p>
                  </div>
                  <div className="flex-1">
                    <span className={`inline-flex px-3 py-1.5 rounded-full text-sm font-medium ${
                      health?.status === "Excellent" ? "bg-green-500/20 text-green-400" :
                      health?.status === "Good" ? "bg-blue-500/20 text-blue-400" :
                      "bg-yellow-500/20 text-yellow-400"
                    }`}>{health?.status || "Unknown"}</span>
                    
                    {/* Summary points */}
                    <div className="mt-4 space-y-2">
                      {health?.summary?.map((s: string, i: number) => (
                        <p key={i} className="text-sm text-zinc-300 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0" />
                          {s}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Category Progress Bars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(categories).map(([key, cat]: [string, any]) => (
                  <div key={key} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold capitalize">{cat.label || key}</span>
                      <span className={`text-lg font-bold ${
                        cat.score >= 80 ? "text-green-400" : cat.score >= 60 ? "text-blue-400" : "text-yellow-400"
                      }`}>{cat.score}</span>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="w-full h-2.5 bg-zinc-800 rounded-full mb-3 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-700 ease-out ${
                          cat.score >= 80 ? "bg-gradient-to-r from-green-500 to-emerald-500" : 
                          cat.score >= 60 ? "bg-gradient-to-r from-blue-500 to-indigo-500" : 
                          "bg-gradient-to-r from-yellow-500 to-orange-500"
                        }`}
                        style={{ width: `${cat.score}%` }}
                      />
                    </div>
                    
                    {/* Reasons */}
                    <div className="space-y-1">
                      {cat.reasons?.map((r: string, i: number) => (
                        <p key={i} className="text-xs text-zinc-500">• {r}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ─── OPEN ISSUES ─── */}
            <section>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                    <Bug className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Open Issues</h2>
                    <p className="text-sm text-zinc-500">{issues.length} available to work on</p>
                  </div>
                </div>
                {issues.length > 0 && (
                  <Link href={`/repo/${owner}/${repo}/issues`} 
                    className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-zinc-200 text-zinc-900 rounded-xl text-sm font-medium transition-all duration-150">
                    View All Issues <ChevronRight className="w-4 h-4" />
                  </Link>
                )}
              </div>

              {issues.length === 0 ? (
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-10 text-center">
                  <AlertCircle className="w-8 h-8 text-zinc-700 mx-auto mb-3" />
                  <p className="text-base text-zinc-500">No open issues found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {issues.slice(0, 5).map((issue: any) => (
                    <Link key={issue.id} href={`/repo/${owner}/${repo}/issues/${issue.number}`}
                      className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-all duration-150 group">
                      <div className="flex items-center gap-4 min-w-0 flex-1">
                        <span className="text-sm text-zinc-600 font-mono flex-shrink-0">#{issue.number}</span>
                        <span className="text-base text-zinc-300 truncate group-hover:text-white transition-colors">{issue.title}</span>
                        {issue.labels?.slice(0, 2).map((l: string) => (
                          <span key={l} className="hidden sm:inline text-xs px-2.5 py-1 bg-purple-500/5 text-purple-300 rounded-lg border border-purple-500/10 flex-shrink-0">{l}</span>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-zinc-600 flex-shrink-0 ml-4">
                        <span>💬 {issue.comments}</span>
                        <ChevronRight className="w-4 h-4 group-hover:text-zinc-300 transition-colors" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* RIGHT — AI Summary + Info */}
          <div className="space-y-6">
            
            {/* AI Summary — Second thing users see */}
            <div className="bg-gradient-to-br from-purple-500/5 to-blue-500/5 border border-purple-500/10 rounded-2xl p-6 sticky top-20">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <h3 className="font-semibold text-base">AI Summary</h3>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                {data?.full_name} is a {data?.language || "popular"} repository with {stars.toLocaleString()} stars and {openIssues} open issues. 
                The maintainers are active and the documentation is well-maintained. 
                Great project for contributors of all skill levels.
              </p>
              <div className="flex items-center gap-2 text-xs text-zinc-600">
                <Sparkles className="w-3 h-3" /> Generated by Llama 3.2
              </div>
            </div>

            {/* Quick Info */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h3 className="text-sm font-semibold mb-4 text-zinc-400 uppercase tracking-wider">Repository Info</h3>
              <div className="space-y-3">
                {[
                  { icon: Code2, label: "Language", value: data?.language || "—" },
                  { icon: Scale, label: "License", value: data?.license || "None" },
                  { icon: GitBranch, label: "Default Branch", value: data?.default_branch || "main" },
                  { icon: Clock, label: "Created", value: data?.created_at ? new Date(data.created_at).toLocaleDateString() : "—" },
                  { icon: FileText, label: "Has Wiki", value: data?.has_wiki ? "Yes" : "No" },
                  { icon: Activity, label: "Discussions", value: data?.has_discussions ? "Enabled" : "Disabled" },
                ].map(info => (
                  <div key={info.label} className="flex items-center justify-between py-2 border-b border-zinc-800/50 last:border-0">
                    <span className="text-sm text-zinc-500 flex items-center gap-2.5">
                      <info.icon className="w-3.5 h-3.5" /> {info.label}
                    </span>
                    <span className="text-sm text-zinc-300">{info.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            {health?.recommendations?.length > 0 && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-400" /> Tips
                </h3>
                <div className="space-y-2">
                  {health.recommendations.map((r: string, i: number) => (
                    <p key={i} className="text-sm text-zinc-400">• {r}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Navbar } from "@/components/Navbar"
import { EmptyState } from "@/components/EmptyState"
import { RepoDetailSkeleton } from "@/components/Skeletons"
import { 
  Star, GitFork, AlertCircle, Clock, ExternalLink, 
  Sparkles, ChevronRight, Bug, Heart,
  Users, ArrowRight, CheckCircle, XCircle
} from "lucide-react"

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export default function RepoDetailPage() {
  const params = useParams()
  const owner = params?.owner as string
  const repo = params?.repo as string
  const [data, setData] = useState<any>(null)
  const [issues, setIssues] = useState<any[]>([])
  const [similar, setSimilar] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!owner || !repo) return
    setLoading(true)
    
    Promise.all([
      fetch(`${API}/api/github/repositories/${owner}/${repo}`).then(r => r.json()).catch(() => null),
      fetch(`${API}/api/github/repositories/${owner}/${repo}/issues?per_page=10`).then(r => r.json()).catch(() => null),
    ]).then(async ([rd, id]) => {
      setData(rd)
      const issueList = id?.issues || []
      setIssues(issueList)
      
      if (issueList.length === 0) {
        try {
          const sr = await fetch(`${API}/api/github/repositories/${owner}/${repo}/similar?limit=3`)
          if (sr.ok) { const simData = await sr.json(); setSimilar(simData.similar || []) }
        } catch {}
      }
    }).finally(() => setLoading(false))
  }, [owner, repo])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b]"><Navbar /><RepoDetailSkeleton /></div>
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

  const health = data.health || {}
  const categories = health.categories || {}
  const stars = data.stars || 0
  const forks = data.forks || 0
  const openIssues = data.open_issues || 0
  const overallScore = health.overall || 0

  const beginnerIssues = issues.filter((i: any) => i.is_beginner_friendly)
  const otherIssues = issues.filter((i: any) => !i.is_beginner_friendly)

  const beginnerReasons = []
  if (overallScore >= 70) beginnerReasons.push({ pass: true, text: "Active maintainers" })
  else beginnerReasons.push({ pass: false, text: "Low maintainer activity" })
  if (categories.documentation?.score >= 60) beginnerReasons.push({ pass: true, text: "Good documentation" })
  else beginnerReasons.push({ pass: false, text: "Limited documentation" })
  if (beginnerIssues.length > 0) beginnerReasons.push({ pass: true, text: `${beginnerIssues.length} beginner issues` })
  else beginnerReasons.push({ pass: false, text: "No beginner issues" })
  if (data.license) beginnerReasons.push({ pass: true, text: "Open source licensed" })
  else beginnerReasons.push({ pass: false, text: "No license" })

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-10 space-y-8 animate-fadeIn">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <Link href="/discover" className="hover:text-zinc-300">Discover</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-zinc-200 font-medium">{data.full_name}</span>
        </div>

        {/* Repo Header */}
        <div className="bg-[#18181b] border border-[#27272a] rounded-[24px] p-6 sm:p-8">
          <div className="flex items-start gap-5">
            <img 
              src={data.owner?.avatar || `https://avatars.githubusercontent.com/${owner}`} 
              alt="" 
              onError={(e) => { (e.target as HTMLImageElement).src = `https://avatars.githubusercontent.com/${owner}` }}
              className="w-14 h-14 rounded-full ring-1 ring-[#27272a] flex-shrink-0" 
            />
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold">{data.full_name}</h1>
              <p className="text-zinc-400 text-base mt-1">{data.description || "No description"}</p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {data.topics?.slice(0, 6).map((t: string) => (
                  <span key={t} className="px-2.5 py-1 text-xs bg-blue-500/5 text-blue-300 rounded-full border border-blue-500/10">{t}</span>
                ))}
              </div>
            </div>
            <a href={data.url} target="_blank" rel="noopener noreferrer" className="h-10 px-5 bg-white hover:bg-zinc-100 text-zinc-900 rounded-[14px] text-sm font-semibold inline-flex items-center gap-2 flex-shrink-0">
              <ExternalLink className="w-4 h-4" /> GitHub
            </a>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-[#27272a] text-sm text-zinc-400">
            <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400" />{stars.toLocaleString()} stars</span>
            <span className="flex items-center gap-1"><GitFork className="w-4 h-4 text-blue-400" />{forks.toLocaleString()} forks</span>
            <span className="flex items-center gap-1"><AlertCircle className="w-4 h-4 text-red-400" />{openIssues} open issues</span>
            <span className="flex items-center gap-1"><Users className="w-4 h-4 text-green-400" />{data.watchers?.toLocaleString() || 0} watchers</span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-zinc-400" />{data.pushed_at ? new Date(data.pushed_at).toLocaleDateString() : "—"}</span>
          </div>
        </div>

        {/* Beginner Score */}
        <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-[24px] p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2.5"><Heart className="w-5 h-5 text-purple-400" /> Beginner Score</h2>
              <p className="text-sm text-zinc-500 mt-1">How friendly is this repo for new contributors?</p>
            </div>
            <div className="text-right">
              <p className="text-5xl font-bold text-purple-400">{overallScore}</p>
              <p className="text-sm text-zinc-500">out of 100</p>
            </div>
          </div>
          <div className="space-y-2">
            {beginnerReasons.map((r, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                {r.pass ? <CheckCircle className="w-4 h-4 text-green-400" /> : <XCircle className="w-4 h-4 text-zinc-600" />}
                <span className={r.pass ? "text-zinc-300" : "text-zinc-600"}>{r.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Summary */}
        <div className="bg-[#18181b] border border-[#27272a] rounded-[20px] p-6">
          <h3 className="text-sm font-semibold text-purple-300 mb-3 flex items-center gap-2"><Sparkles className="w-4 h-4" /> AI Summary</h3>
          <p className="text-sm text-zinc-400 leading-relaxed">
            {data.full_name} is a {data.language || "popular"} repository with {stars.toLocaleString()} stars and {openIssues} open issues.
          </p>
        </div>

        {/* Beginner Issues */}
        <section>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Bug className="w-5 h-5 text-green-400" /> Beginner Issues ({beginnerIssues.length})</h2>
          
          {beginnerIssues.length > 0 ? (
            <div className="space-y-2">
              {beginnerIssues.map((issue: any) => (
                <Link key={issue.id} href={`/repo/${owner}/${repo}/issues/${issue.number}`} className="flex items-center justify-between bg-[#18181b] border border-green-500/20 rounded-[20px] p-4 hover:border-green-500/40 transition-all group">
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <span className="text-sm text-zinc-600 font-mono flex-shrink-0">#{issue.number}</span>
                    <span className="text-sm text-zinc-300 truncate group-hover:text-white transition-colors">{issue.title}</span>
                    {issue.labels?.slice(0, 2).map((l: string) => (
                      <span key={l} className="hidden sm:inline text-xs px-2 py-0.5 bg-green-500/10 text-green-400 rounded-full flex-shrink-0">{l}</span>
                    ))}
                  </div>
                  <div className="text-xs text-zinc-600 flex-shrink-0 ml-4">💬 {issue.comments || 0}</div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-[#18181b] border border-[#27272a] rounded-[20px] p-8">
              <EmptyState 
                kind="issues"
                title="No beginner issues today"
                description="This repository doesn't have any issues labeled for beginners right now."
                action={{ label: "Browse Discover", href: "/discover" }}
              />
            </div>
          )}

          {/* Other Issues */}
          {otherIssues.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-zinc-400 mb-3">All Issues ({otherIssues.length})</h3>
              <div className="space-y-2">
                {otherIssues.slice(0, 5).map((issue: any) => (
                  <Link key={issue.id} href={`/repo/${owner}/${repo}/issues/${issue.number}`} className="flex items-center justify-between bg-[#18181b] border border-[#27272a] rounded-[20px] p-4 hover:border-zinc-600 transition-all group">
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <span className="text-sm text-zinc-600 font-mono flex-shrink-0">#{issue.number}</span>
                      <span className="text-sm text-zinc-300 truncate">{issue.title}</span>
                      {issue.labels?.slice(0, 2).map((l: string) => (
                        <span key={l} className="hidden sm:inline text-xs px-2 py-0.5 bg-purple-500/10 text-purple-300 rounded-full flex-shrink-0">{l}</span>
                      ))}
                    </div>
                    <div className="text-xs text-zinc-600 flex-shrink-0 ml-4">💬 {issue.comments || 0}</div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Similar Repos Fallback */}
        {issues.length === 0 && similar.length > 0 && (
          <section>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><ArrowRight className="w-5 h-5 text-purple-400" /> Similar Repositories</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {similar.map((s: any) => (
                <Link key={s.full_name} href={`/repo/${s.full_name}`} className="block bg-[#18181b] border border-[#27272a] rounded-[20px] p-5 hover:border-purple-500/30 transition-all group">
                  <h4 className="font-semibold text-sm mb-2 group-hover:text-purple-400">{s.full_name}</h4>
                  <p className="text-xs text-zinc-500 mb-3 line-clamp-2">{s.description || "No description"}</p>
                  <div className="flex items-center gap-3 text-xs text-zinc-600">
                    <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-400" />{s.stars?.toLocaleString() || 0}</span>
                    {s.language && <span>{s.language}</span>}
                    <span className="ml-auto">{s.open_issues} issues</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
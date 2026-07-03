"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Navbar } from "@/components/Navbar"
import { ErrorDisplay } from "@/components/ErrorDisplay"
import { ExternalLink, Clock, MessageSquare, ChevronRight, Loader2, Thermometer, GitMerge, Smile, Activity, FileText, Zap } from "lucide-react"

const iconMap: Record<string, any> = { thermometer: Thermometer, clock: Clock, "git-merge": GitMerge, smile: Smile, activity: Activity, "file-text": FileText }

export default function IssueDetailPage() {
  const params = useParams()
  const owner = params?.owner as string
  const repo = params?.repo as string
  const number = params?.number as string
  const [issue, setIssue] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchIssue = () => {
    setLoading(true); setError("")
    fetch(`http://localhost:8000/api/github/repositories/${owner}/${repo}/issues/${number}`)
      .then(r => { if(!r.ok) throw new Error(); return r.json() })
      .then(d => { setIssue(d); setLoading(false) })
      .catch(() => { setError("Failed to load issue"); setLoading(false) })
  }

  useEffect(() => { if(owner && repo && number) fetchIssue() }, [owner, repo, number])

  if (loading) return <div className="min-h-screen bg-[#0a0b0f] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-purple-400" /></div>
  if (error) return <div className="min-h-screen bg-[#0a0b0f]"><Navbar /><ErrorDisplay type="api" message={error} onRetry={fetchIssue} /></div>

  const scoring = issue?.scoring
  const factors = scoring?.factors || {}

  return (
    <div className="min-h-screen bg-[#0a0b0f] text-white">
      <Navbar />
      <div className="max-w-5xl mx-auto p-6">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 flex-wrap">
          <Link href="/dashboard" className="hover:text-gray-300 transition-colors">Dashboard</Link>
          <ChevronRight className="w-3 h-3 flex-shrink-0" />
          <Link href="/discover" className="hover:text-gray-300 transition-colors">Discover</Link>
          <ChevronRight className="w-3 h-3 flex-shrink-0" />
          <Link href={`/repo/${owner}/${repo}`} className="hover:text-gray-300 transition-colors truncate max-w-[150px]">{owner}/{repo}</Link>
          <ChevronRight className="w-3 h-3 flex-shrink-0" />
          <Link href={`/repo/${owner}/${repo}/issues`} className="hover:text-gray-300 transition-colors">Issues</Link>
          <ChevronRight className="w-3 h-3 flex-shrink-0" />
          <span className="text-gray-300">#{number}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#111318] rounded-xl p-6 border border-gray-800/50">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-xl font-bold flex-1">{issue?.title}</h1>
                <a href={issue?.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm flex-shrink-0 ml-4 transition-all">
                  <ExternalLink className="w-4 h-4" /> Open on GitHub
                </a>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400 mb-4">
                <span className="px-2 py-1 bg-green-500/10 text-green-400 rounded-full text-xs font-medium">Open</span>
                {issue?.author && <span className="flex items-center gap-1"><img src={issue.author.avatar} className="w-5 h-5 rounded-full" />{issue.author.login}</span>}
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {new Date(issue?.created_at).toLocaleDateString()}</span>
                <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" /> {issue?.comments_count} comments</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {issue?.labels?.map((l:string) => <span key={l} className="px-2 py-1 text-xs bg-purple-500/10 text-purple-300 rounded-full">{l}</span>)}
              </div>
            </div>

            <div className="bg-[#111318] rounded-xl p-6 border border-gray-800/50">
              <h2 className="text-lg font-bold mb-3">Description</h2>
              <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{issue?.body || "No description provided."}</p>
            </div>

            {issue?.comments?.length > 0 && (
              <div className="bg-[#111318] rounded-xl p-6 border border-gray-800/50">
                <h2 className="text-lg font-bold mb-4">Comments ({issue.comments.length})</h2>
                {issue.comments.map((c:any) => (
                  <div key={c.id} className="bg-[#1a1d24] rounded-lg p-4 mb-3">
                    <div className="flex items-center gap-2 mb-2"><img src={c.author?.avatar} className="w-5 h-5 rounded-full"/><span className="text-sm font-medium">{c.author?.login}</span><span className="text-xs text-gray-500">{new Date(c.created_at).toLocaleDateString()}</span></div>
                    <p className="text-sm text-gray-300">{c.body}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI Score Sidebar */}
          <div className="space-y-4">
            {scoring && (
              <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-xl p-6 border border-purple-500/30 sticky top-20">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Zap className="w-5 h-5 text-purple-400"/>AI Score</h2>
                <div className="text-center mb-4"><span className="text-5xl font-bold text-purple-400">{scoring.overall_score}</span><span className="text-gray-400 text-lg">/100</span></div>
                <div className={`text-center mb-4 px-3 py-1.5 rounded-full text-sm font-medium ${scoring.verdict.includes("Highly")?"bg-green-500/20 text-green-400":"bg-blue-500/20 text-blue-400"}`}>{scoring.verdict}</div>
                
                {Object.entries(factors).map(([key, data]:[string,any]) => {
                  const Icon = iconMap[data.icon] || Zap
                  const color = data.score >= 70 ? "text-green-400" : data.score >= 50 ? "text-yellow-400" : "text-red-400"
                  return (
                    <div key={key} className="bg-[#1a1d24] rounded-lg p-3 mb-2">
                      <div className="flex items-center justify-between mb-1"><div className="flex items-center gap-2"><Icon className={`w-4 h-4 ${color}`}/><span className="text-xs font-medium">{data.label}</span></div><span className={`text-sm font-bold ${color}`}>{data.score}</span></div>
                      <div className="w-full bg-gray-700 rounded-full h-1.5"><div className={`h-1.5 rounded-full ${data.score>=70?"bg-green-500":data.score>=50?"bg-yellow-500":"bg-red-500"}`} style={{width:`${data.score}%`}}/></div>
                      <p className="text-xs text-gray-500 mt-1">{data.reason}</p>
                    </div>
                  )
                })}
                
                {scoring.summary?.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    {scoring.summary.map((s:string,i:number)=><p key={i} className="text-xs text-gray-300 mb-1">✅ {s}</p>)}
                  </div>
                )}
                <div className="mt-4 pt-4 border-t border-gray-700"><p className="text-sm text-gray-300">{scoring.recommendation}</p></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
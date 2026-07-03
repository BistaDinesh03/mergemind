"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Navbar } from "@/components/Navbar"
import { RepoDetailSkeleton } from "@/components/Skeletons"
import { ErrorDisplay } from "@/components/ErrorDisplay"
import { EmptyState } from "@/components/EmptyState"
import { Star, GitFork, AlertCircle, Sparkles, ChevronRight, Loader2 } from "lucide-react"
import { HealthCards } from "@/components/HealthCards"

export default function RepoDetailPage() {
  const params = useParams()
  const owner = params?.owner as string
  const repo = params?.repo as string
  const [data, setData] = useState<any>(null)
  const [issues, setIssues] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchData = () => {
    setLoading(true); setError("")
    Promise.all([
      fetch("http://localhost:8000/api/github/repositories/"+owner+"/"+repo).then(r => { if(!r.ok) throw new Error(); return r.json() }),
      fetch("http://localhost:8000/api/github/repositories/"+owner+"/"+repo+"/issues?per_page=5").then(r => { if(!r.ok) throw new Error(); return r.json() }),
      fetch("http://localhost:8000/api/github/repositories/"+owner+"/"+repo+"/ai-summary").then(r => r.json().catch(() => ({summary:""})))
    ]).then(([rd, id, ai]) => { setData(rd); setIssues(id.issues||[]); setLoading(false) })
      .catch(() => { setError("Failed to load repository"); setLoading(false) })
  }

  useEffect(() => { if(owner && repo) fetchData() }, [owner, repo])

  if (loading) return <div className="min-h-screen bg-[#0a0b0f]"><Navbar /><RepoDetailSkeleton /></div>
  if (error) return <div className="min-h-screen bg-[#0a0b0f]"><Navbar /><ErrorDisplay type="api" message={error} onRetry={fetchData} /></div>

  return (
    <div className="min-h-screen bg-[#0a0b0f] text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/discover" className="hover:text-gray-300">Discover</Link><ChevronRight className="w-3 h-3" /><span className="text-gray-300">{data?.full_name}</span>
        </div>
        <div className="bg-[#111318] rounded-xl p-6 border border-gray-800/50">
          <div className="flex items-start gap-4 mb-4">
            <img src={data?.owner?.avatar} className="w-14 h-14 rounded-full border-2 border-gray-700" />
            <div className="flex-1"><h1 className="text-2xl font-bold">{data?.full_name}</h1><p className="text-gray-400 text-sm mt-1">{data?.description}</p></div>
            <a href={data?.url} target="_blank" className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm flex-shrink-0">GitHub</a>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-gray-400 pt-4 border-t border-gray-800/50">
            <span><Star className="w-4 h-4 inline" /> {data?.stars?.toLocaleString()}</span>
            <span><GitFork className="w-4 h-4 inline" /> {data?.forks?.toLocaleString()}</span>
            <span><AlertCircle className="w-4 h-4 inline" /> {data?.open_issues} issues</span>
          </div>
        </div>
        <HealthCards health={data?.health} />
        
        <div className="bg-[#111318] rounded-xl p-6 border border-gray-800/50">
          <div className="flex justify-between mb-4">
            <h3 className="text-lg font-bold">Open Issues ({issues.length})</h3>
            {issues.length > 0 && <Link href={"/repo/"+owner+"/"+repo+"/issues"} className="text-sm text-purple-400 hover:text-purple-300">View All →</Link>}
          </div>
          {issues.length === 0 ? (
            <EmptyState type="issues" description="No open issues found in this repository" />
          ) : (
            issues.map((i:any) => (
              <Link key={i.id} href={"/repo/"+owner+"/"+repo+"/issues/"+i.number} 
                className="flex justify-between p-3 bg-[#1a1d24] rounded-lg hover:bg-gray-700 transition-all mb-2">
                <span className="text-sm">{i.title}</span><span className="text-xs text-gray-500">#{i.number}</span>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
"use client"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { AIMentorCard } from "@/components/AIMentorCard"
import { Sparkles, Search, Star, Users, TrendingUp, GitFork, AlertCircle, RefreshCw, ArrowRight } from "lucide-react"

const API = "http://localhost:8000"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [data, setData] = useState(null)
  const [topIssue, setTopIssue] = useState(null)
  const [recs, setRecs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const name = session?.user?.name || "Developer"

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const users = [name, "BistaDinesh03", "BISUTA"]
      let p = null
      for (const u of users) {
        const r = await fetch(`${API}/api/portfolio/${u}`)
        if (r.ok) { const d = await r.json(); if (d.public_repos > 0) { p = d; break } }
      }
      setData(p || { username: name, public_repos: 0, followers: 0, repositories: [] })
      const rr = await fetch(`${API}/api/recommendations/top?limit=4`)
      if (rr.ok) {
        const d = await rr.json()
        const list = d.recommendations || []
        setTopIssue(list[0] || null)
        setRecs(list.slice(1))
      }
    } catch (e) {
      setError("Cannot connect to server")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { if (status === "authenticated") load() }, [status, name])

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-[#09090b]"><Navbar />
        <div className="max-w-2xl mx-auto px-6 py-16 space-y-6 animate-pulse">
          <div className="h-96 bg-[#18181b] rounded-[24px]" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#09090b]"><Navbar />
        <div className="flex flex-col items-center justify-center py-32">
          <AlertCircle className="w-10 h-10 text-red-400 mb-3" />
          <p className="text-zinc-400 mb-4">{error}</p>
          <button onClick={load} className="h-10 px-5 bg-white text-zinc-900 rounded-[14px] text-sm font-semibold inline-flex items-center gap-2"><RefreshCw className="w-3.5 h-3.5"/> Retry</button>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-[#09090b]"><Navbar />
        <div className="flex flex-col items-center justify-center py-32">
          <GitFork className="w-10 h-10 text-zinc-600 mb-3" />
          <h2 className="text-lg font-bold mb-1">Connect Your GitHub</h2>
          <p className="text-zinc-400 text-sm mb-4">Sign in to get your personalized recommendation.</p>
          <Link href="/login" className="h-10 px-5 bg-white text-zinc-900 rounded-[14px] text-sm font-semibold">Sign in with GitHub</Link>
        </div>
      </div>
    )
  }

  const extractLink = (issue) => {
    if (!issue?.repo) return "#"
    const [owner, repo] = issue.repo.split("/")
    return `/repo/${owner}/${repo}/issues/${issue.issue_number || "1"}`
  }

  const totalStars = data?.repositories?.reduce((s,r) => s+(r.stars||0), 0) || 0

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <Navbar />
      <main className="max-w-2xl mx-auto px-6 py-12 space-y-8">
        
        {topIssue ? (
          <AIMentorCard issue={topIssue} linkToDetail={extractLink(topIssue)} />
        ) : (
          <div className="bg-[#18181b] border border-[#27272a] rounded-[24px] p-10 text-center">
            <Sparkles className="w-10 h-10 text-zinc-600 mx-auto mb-4" />
            <h2 className="text-lg font-bold mb-2">No Recommendations Yet</h2>
            <p className="text-zinc-400 text-sm mb-6">Browse repositories to get AI-powered picks.</p>
            <Link href="/discover" className="h-10 px-5 bg-white text-zinc-900 rounded-[14px] text-sm font-semibold"><Search className="w-3.5 h-3.5"/> Browse Repositories</Link>
          </div>
        )}

        <div className="grid grid-cols-4 gap-3">
          <div className="bg-[#18181b] border border-[#27272a] rounded-[20px] p-4 text-center">
            <GitFork className="w-4 h-4 text-blue-400 mx-auto mb-1.5" /><p className="text-xl font-bold">{data?.public_repos??"—"}</p><p className="text-[10px] text-zinc-500">Repos</p>
          </div>
          <div className="bg-[#18181b] border border-[#27272a] rounded-[20px] p-4 text-center">
            <Star className="w-4 h-4 text-yellow-400 mx-auto mb-1.5" /><p className="text-xl font-bold">{totalStars||"—"}</p><p className="text-[10px] text-zinc-500">Stars</p>
          </div>
          <div className="bg-[#18181b] border border-[#27272a] rounded-[20px] p-4 text-center">
            <Users className="w-4 h-4 text-green-400 mx-auto mb-1.5" /><p className="text-xl font-bold">{data?.followers??"—"}</p><p className="text-[10px] text-zinc-500">Followers</p>
          </div>
          <div className="bg-[#18181b] border border-[#27272a] rounded-[20px] p-4 text-center">
            <TrendingUp className="w-4 h-4 text-purple-400 mx-auto mb-1.5" /><p className="text-xl font-bold">{recs.length+(topIssue?1:0)}</p><p className="text-[10px] text-zinc-500">Picks</p>
          </div>
        </div>

        {recs.length > 0 && (
          <section>
            <h3 className="text-base font-semibold mb-3">More Picks from Your AI Mentor</h3>
            <div className="space-y-2">
              {recs.map((r,i) => (
                <AIMentorCard key={i} issue={r} linkToDetail={extractLink(r)} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}